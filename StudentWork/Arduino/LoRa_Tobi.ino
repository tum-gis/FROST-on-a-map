/*
 * Author: Tobias Zagler, Markus Meyer (Technical University Munich)
 * Date: 2020-12-23
 * 
 * Used: Seeeduino LoRaWAN w/ GPS (built-in GPS) together with
 * - Grove - 16x2 LCD (Black on Red)
 * - Grove - Temperature Humidity Pressure Gas Sensor(Bosch BME680)
 * - Grove - Sunlight Sensor SI1145 (visible, infrared & ultraviolett light)
 * - Grove - Laser particulate matter sensor (HM3301)
 * 
 * This Code automatically updates the GPS Position and all other measurements every loop. Duration of the loop can be adjusted
 * by the "duration"-variable at the beginning of the skript.
 * During setup, the GPS receiver will try to receive a GPS signal every 3 seconds. If the board cannot find any GPS-signal
 * in the setup after 5 minutes, the run errors by starting an endless "while(true)" loop. If the setup was successful,
 * invalid GPS-positions are allowed in "void loop(void)".
 * 
 * If you use BaseShield, deactivate line 56 "digitalWrite(38, HIGH);".
 * 
 */

float duration = 3000;  // duration of the loop in milliseconds


#include <CayenneLPP.h>                      // Include Cayenne Library
// === source: https://wiki.tum.de/display/geosensorweb/Cayenne+Protocol
char buffer[256];
 
// CayenneLPP lpp(51); // original                         //Define the buffer size
CayenneLPP lpp(58);                         //Define the buffer size
// === source ending

#include <LoRaWan.h>
// Markus
// #define DevEUI "0009FDE4A6BBAB6C"
// #define AppEUI "70B3D57ED002F952"
// #define AppKey "43BAAA8D3A95246033DAE2C52EA56B5E"
// Tobi
#define DevEUI "0087F8C42B706B89"
#define AppEUI "70B3D57ED00302CB"
#define AppKey "914581E9A52D7822966E1C1B377625C3"


// LCD
#include <Wire.h>
#include "rgb_lcd.h"
rgb_lcd lcd;
const int colorR = 255;
const int colorG = 0;
const int colorB = 0;


// Temperature Humidity Pressure Sensor
#include "Zanshin_BME680.h"
BME680_Class BME680;


// Sunlight Sensor
// source: SI1145DEMO, compare https://wiki.seeedstudio.com/Grove-Sunlight_Sensor/
#include "Arduino.h"
#include "SI114X.h"
SI114X Sunlight = SI114X();
// source ending


// Laser PM2.5 Sensor (HM3301) Laser Dust Detection Sensor (particulate matter)
// source: basic_demo, compare https://wiki.seeedstudio.com/Grove-Laser_PM2.5_Sensor-HM3301/
#include <Seeed_HM330X.h>
#ifdef  ARDUINO_SAMD_VARIANT_COMPLIANCE
    #define SERIAL_OUTPUT SerialUSB
#else
    #define SERIAL_OUTPUT Serial
#endif
HM330X HM3301;
uint8_t buf[30];
const char* str[] = {"sensor num: ", "PM1.0 concentration(CF=1,Standard particulate matter,unit:ug/m3): ",
                     "PM2.5 concentration(CF=1,Standard particulate matter,unit:ug/m3): ",
                     "PM10 concentration(CF=1,Standard particulate matter,unit:ug/m3): ",
                     "PM1.0 concentration(Atmospheric environment,unit:ug/m3): ",
                     "PM2.5 concentration(Atmospheric environment,unit:ug/m3): ",
                     "PM10 concentration(Atmospheric environment,unit:ug/m3): ",
                    };
// source ending


// source: https://wiki.seeedstudio.com/Seeeduino_LoRAWAN/#42-lat-and-lng
#define USE_GPS 1

// GPS
#ifdef USE_GPS
#include "TinyGPS++.h"
TinyGPSPlus gps;
#endif
// source ending


// counts the number of loops in setup while searching for GPS signal
unsigned int nGPSsetup = 0;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
void setup(void)
{
  // digitalWrite(38, HIGH); // deactivate this line, if you use BaseShield

  // Setting up the LCD display
  lcd.begin(16, 2);
  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Setup board");

  // 3sec delay to be able to read the display
  delay(3000);

  // Initializing USB connection to Serial Monitor / Arduino IDE.
  // Make sure to use the same baud rate (115200) in your serial monitor.
  SerialUSB.begin(115200);
  SerialUSB.println(F("Setup board"));

  // === GPS init starting ===
  #ifdef USE_GPS
    Serial2.begin(9600);     // open the GPS. GPS uses 9600 baud rate

    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Searching for");
    lcd.setCursor(0,1);
    lcd.print("GPS-signal");
    SerialUSB.println(F("Searching for GPS-signal"));

    // 5sec delay to be able to read the display
    delay(5000);

    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Searching GPS...");

    while (!gps.location.isValid()) {   // Search as long as there is no GPS location fix
      nGPSsetup++;
      lcd.setCursor(0,1);
      lcd.print("Try ");
      lcd.print(nGPSsetup);
      SerialUSB.print("Try ");
      SerialUSB.println(nGPSsetup);
      while (Serial2.available() > 0) {   // Process the data of the GPS-datastream (=Serial2), as long as there is any present
        if (gps.encode(Serial2.read())) {   // Feed the encoder with the GPS specific data
          if (gps.location.isValid()) {       // break the while-loop, when a location fix is found
            SerialUSB.print(F("GPS-signal found at try "));
            SerialUSB.println(nGPSsetup);
            lcd.clear();
            lcd.setCursor(0,0);
            lcd.print("GPS-signal found");
            lcd.setCursor(0,1);
            lcd.print("at try ");
            lcd.print(nGPSsetup);
            break;
          }
        }
      }

      // true if the GPS produces still no data after 15 seconds
      if (millis() > 15000 && gps.charsProcessed() < 10)
      {
        SerialUSB.println(F("No GPS detected: check wiring."));
        SerialUSB.println(gps.charsProcessed());
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("No GPS found");
        lcd.setCursor(0,1); // first column, second line
        lcd.print("Check wiring");
        while(true);
      }
      // true, if there is no signal found in e.g. 5 minutes
      else if (millis() > 5 * 60000) {
        SerialUSB.println(F("Not able to get a fix in alloted time."));
        SerialUSB.print(F("Number of tries: "));
        SerialUSB.println(nGPSsetup);
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("No fix possible.");
        lcd.setCursor(0,1);
        lcd.print(nGPSsetup);
        lcd.print(" tries");
        // break;     // break if you want to go on even without a location fix
        while(true);  // while(true) if you want to error the program
      }

      // 3sec delay to wait for GPS-signal
      delay(3000);
    }
    
    // 5sec delay to be able to read the display
    delay(5000);
  #endif
  // === GPS init ending ===


  // === BME setup starting ===
  // source: I2CDemo of BME680-libary
  // compare https://wiki.seeedstudio.com/Grove-Temperature_Humidity_Pressure_Gas_Sensor_BME680/
  
  lcd.clear();    
  lcd.setCursor(0,0);
  lcd.print("Setup BME");
  SerialUSB.print(F("- Initializing BME680 sensor\n"));
  while (!BME680.begin(I2C_STANDARD_MODE))  { // Start BME680 using I2C, use first device found
    SerialUSB.print(F("-  Unable to find BME680. Trying again in 5 seconds.\n"));
    delay(5000);
  }  // of loop until device is located
  SerialUSB.print(F("- Setting 16x oversampling for all sensors\n"));
  BME680.setOversampling(TemperatureSensor, Oversample16);  // Use enumerated type values
  BME680.setOversampling(HumiditySensor, Oversample16);     // Use enumerated type values
  BME680.setOversampling(PressureSensor, Oversample16);     // Use enumerated type values
  SerialUSB.print(F("- Setting IIR filter to a value of 4 samples\n"));
  BME680.setIIRFilter(IIR4);  // Use enumerated type values
  SerialUSB.print(F("- Setting gas measurement to 320\xC2\xB0\x43 for 150ms\n"));  // "�C" symbols
  BME680.setGas(320, 150);  // 320�c for 150 milliseconds
  // source ending
  lcd.setCursor(0,1);
  lcd.print("finished");
  delay(5000);
  // === BME setup ending ===
  
  

  // === Sunlight sensor setup starting ===
  // source: SI1145DEMO, compare https://wiki.seeedstudio.com/Grove-Sunlight_Sensor/
  lcd.clear();    
  lcd.setCursor(0,0);
  lcd.print("Setup SI1145");
  
  SerialUSB.println();
  SerialUSB.println("Beginning Si1145 Sunlight Sensor!");

  while (!Sunlight.Begin()) {
      SerialUSB.println("Si1145 Sunlight Sensor is not ready!");
      delay(1000);
  }
  SerialUSB.println("Si1145 Sunlight sensor is ready!");
  // source ending
  lcd.setCursor(0,1);
  lcd.print("finished");
  delay(5000);
  // === Sunlight sensor setup ending


  // === HM3301 Laser Dust Detection sensor setup starting ===
  // source: basic_demo, compare Dust Sensor https://wiki.seeedstudio.com/Grove-Laser_PM2.5_Sensor-HM3301/
  lcd.clear();    
  lcd.setCursor(0,0);
  lcd.print("Setup HM3301");
  delay(5000);
  
  SERIAL_OUTPUT.begin(115200);
  delay(100);
  SERIAL_OUTPUT.println("Serial start");
  if (HM3301.init()) {
      SERIAL_OUTPUT.println("HM330X init failed!!!");
      while (1);
  }
  // source ending
  lcd.setCursor(0,1);
  lcd.print("finished");
  delay(5000);
  // === HM3301 setup ending
  
 
  // === LoRaWAN connection setup starting ===
  // source: https://wiki.tum.de/display/geosensorweb/Cayenne+Protocol
  // alternative source: https://wiki.tum.de/display/geosensorweb/LoRaWAN+Node+-+Seeeduino+LoRaWAN
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Setup LoRaWAN");

  lora.init();                        // Initialize the LoRaWAN module
  lora.setDeviceReset();

  memset(buffer, 0, 256);             // clear text buffer
  lora.getVersion(buffer, 256, 1);  
  memset(buffer, 0, 256);             // We call getVersion() two times, because after a reset the LoRaWAN module can be
  lora.getVersion(buffer, 256, 1);    // in sleep mode and then the first call only wakes it up and will not be performed.
  SerialUSB.print(buffer);
    
  memset(buffer, 0, 256);
  lora.getId(buffer, 256, 1);
  SerialUSB.print(buffer);

  // void setId(char *DevAddr, char *DevEUI, char *AppEUI);
  lora.setId(NULL, DevEUI, AppEUI); 

  // setKey(char *NwkSKey, char *AppSKey, char *AppKey);
  lora.setKey(NULL, NULL, AppKey);
    
  lora.setDeciveMode(LWOTAA);           // select OTAA join mode (note that setDeciveMode is not a typo; it is misspelled in the library)
  // lora.setDataRate(DR5, EU868);         // SF7, 125 kbps (highest data rate)
  lora.setDataRate(DR3, EU868);         // SF9, 125 kbps (medium data rate and range)
  // lora.setDataRate(DR0, EU868);         // SF12, 125 kbps (lowest data rate, highest max. distance)

  // lora.setAdaptiveDataRate(false);  
  lora.setAdaptiveDataRate(true);       // automatically adapt the data rate
    
  lora.setChannel(0, 868.1);
  lora.setChannel(1, 868.3);
  lora.setChannel(2, 868.5);
  lora.setChannel(3, 867.1);
  lora.setChannel(4, 867.3);
  lora.setChannel(5, 867.5);
  lora.setChannel(6, 867.7);
  lora.setChannel(7, 867.9);
     
  lora.setDutyCycle(false);             // for debugging purposes only - should normally be activated
  lora.setJoinDutyCycle(false);         // for debugging purposes only - should normally be activated
    
  lora.setPower(14);                    // LoRa transceiver power (14 is the maximum for the 868 MHz band)
    
  // while(!lora.setOTAAJoin(JOIN));
  while(!lora.setOTAAJoin(JOIN,20)) {   // wait until the node has successfully joined TTN
    lcd.setCursor(0,1);
    lcd.print("Joining TTN...");
  }

  lora.setPort(1);                     // all data packets are sent to LoRaWAN port 10 (Port number is set as per SWM configuration)
  lcd.setCursor(0,0);
  lcd.clear();
  lcd.print("Connected!");
  delay(5000);

  // === LoRaWAN connection setup ending ===
  // source ending


  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Board Setup");
  lcd.setCursor(0,1);
  lcd.print("finished");
  SerialUSB.println("Board Setup finished");

  // 3sec delay to be able to read the display
  delay(3000);
}



// GPS
float latitude;
float longitude;
float altitude_GPS;

// BME680
float temperature;
float humidity;
float pressure;
float airquality;

// SI1145 Sunlight sensor
int Vis;
int IR;
float UV;

unsigned int nloops = 0;      // counts the number of loops
bool LocUpdate = false;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
void loop(void)
{
  nloops++;
  LocUpdate = false;
  
/*  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("-- LOOP ");
  lcd.print(nloops);

  SerialUSB.print("-- LOOP ");
  SerialUSB.println(nloops);

  // 1sec delay to be able to read the display
  delay(1000);
*/

  // Basically same GPS code as in void setup(void)
  while (Serial2.available() > 0) {
    if (gps.encode(Serial2.read())) {
      if(gps.location.isUpdated()) {    // ... the new position must differ from the position of the loop before
          LocUpdate = true;
          displayInfo();
          break;
      }
    }
  }


  if (LocUpdate) {
  
    SerialUSB.println();
    static int32_t  temp, hum, pres, gas;
    static float    alt;
    BME680.getSensorData(temp, hum, pres, gas);     
    
    temperature=temp/100.0;
    humidity=hum/1000.0;
    pressure=pres/100.0;
    alt=altitude(pres);
    airquality=gas;
    if(SerialUSB) {
      SerialUSB.print("Temperature: ");
      SerialUSB.print(temperature);
      SerialUSB.println(" °C");
      SerialUSB.print("Humidity: ");
      SerialUSB.print(humidity);
      SerialUSB.println(" %");
      SerialUSB.print("Pressure: ");
      SerialUSB.print(pressure);
      SerialUSB.println(" hPa");
      SerialUSB.print("Altitude: ");
      SerialUSB.print(alt);
      SerialUSB.println(" m");
      SerialUSB.print("Gas: ");
      SerialUSB.print(airquality);
      SerialUSB.println(" Ohm");
    }
    
  
  
    // === source: SI1145DEMO, compare https://wiki.seeedstudio.com/Grove-Sunlight_Sensor/
    Vis=Sunlight.ReadVisible();
    IR=Sunlight.ReadIR();
    UV=(float)Sunlight.ReadUV() / 100.0; //the real UV value must be div 100 from the reg value , datasheet for more information.
    if (SerialUSB) {
      SerialUSB.print("Vis: ");
      SerialUSB.print(Vis);
      SerialUSB.println(" lumen");
      SerialUSB.print("IR: ");
      SerialUSB.print(IR);
      SerialUSB.println(" lumen");
      SerialUSB.print("UV: ");
      SerialUSB.print(UV);
      SerialUSB.println(" UN index"); // compare https://wiki.seeedstudio.com/Grove-Sunlight_Sensor/
      SerialUSB.println();
    }
    // === source ending
    
  
    // === source: https://wiki.tum.de/display/geosensorweb/Cayenne+Protocol, adapted
    lpp.reset();                                                     // Resets the Cayenne buffer
    lpp.addTemperature(1, temperature);                                     // encodes the temperature value 22.5 on channel 1 in Cayenne format
    lpp.addBarometricPressure(2, pressure);                           // encodes the pressure value 1073.21 on channel 2 in Cayenne format
    lpp.addRelativeHumidity(3, humidity);
    //lpp.addGPS(4, latitude, longitude, alt);
    lpp.addGPS(4, latitude, longitude, altitude_GPS);
  
  
    lpp.addAnalogOutput(5, Vis);
    lpp.addAnalogOutput(6, IR);
    lpp.addAnalogOutput(7, UV);
  
    // Folgendes wird in die Methode "HM330XErrorCode parse_result(uint8_t* data)" gepackt
    // "HM330XErrorCode parse_result(uint8_t* data)" wird gleich im Anschluss aufgerufen
    // lpp.addAnalogOutput(8, 10.0);
    // lpp.addAnalogOutput(9, 20.0);
    // lpp.addAnalogOutput(10, 30.0);
    // lpp.addAnalogOutput(11, 40.0);
    // lpp.addAnalogOutput(12, 50.0);
    // lpp.addAnalogOutput(13, 60.0);
    
    
    // === source: basic_demo, compare HM3301 Dust Sensor https://wiki.seeedstudio.com/Grove-Laser_PM2.5_Sensor-HM3301/
    if (HM3301.read_sensor_value(buf, 29)) {
        SERIAL_OUTPUT.println("HM330X read result failed!!!");
    }
    // parse_result_value(buf); // gibt Matrix aus in HEX Schreibweise
    parse_result(buf); // gibt Zeilen mit Text aus; HEX entschlüsselt
    SERIAL_OUTPUT.println("");
    // === source ending
  
    bool result = false;
    // Send it off
    result = lora.transferPacket(lpp.getBuffer(), lpp.getSize(), 5);   // sends the Cayenne encoded data packet (n bytes) with a default timeout of 5 secs
   
    if (result)
    {
      short length;
      short rssi;
    
      length = lora.receivePacket(buffer, 256, &rssi);
    
      if (length)
      {
    
        if (SerialUSB) {
          SerialUSB.print("Length is: ");
          SerialUSB.println(length);
          SerialUSB.print("RSSI is: ");
          SerialUSB.println(rssi);
          SerialUSB.print("Data is: ");
          for (unsigned char i = 0; i < length; i ++)
          {
            SerialUSB.print("0x");
            SerialUSB.print(buffer[i], HEX);
            SerialUSB.print(" ");
          }
          SerialUSB.println();
        }
      }
    }
    
  }


  
  if (SerialUSB) {
    SerialUSB.println((String)"Loop " + nloops + "...done!\n");
  }

  /*
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Loop ");
  lcd.print(nloops);
  lcd.print("...done!");
  lcd.setCursor(0,1);
  lcd.print("LoRa sent: ");
  if(result)
  {
    lcd.print("true");
  }
  else
  {
    lcd.print("false");
  }
*/

  delay(duration);

}


 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// source: https://wiki.seeedstudio.com/Seeeduino_LoRAWAN/#42-lat-and-lng
// adapted with LCD-prints and some delays
void displayInfo()
{
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("L ");
  lcd.print(nloops);
  lcd.setCursor(7,0);


    
  SerialUSB.print(F("Location: ")); 
  if (gps.location.isValid())
  {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    
    SerialUSB.print(latitude, 6);
    SerialUSB.print(F(","));
    SerialUSB.print(longitude, 6);

/*    
    lcd.print(latitude,6);
    lcd.setCursor(7,1);
*/
    lcd.print(longitude,6);
  }
  else
  {
    SerialUSB.print(F("INVALID"));
    lcd.print("Invalid GPS");
  }

  SerialUSB.print(F("  Altitude: ")); 
  if (gps.altitude.isValid())
  {
    altitude_GPS = gps.altitude.meters();
    
    SerialUSB.print(altitude_GPS, 6);
  }
  else
  {
    SerialUSB.print(F("INVALID"));
  }

  
  SerialUSB.print(F("  Date/Time: "));
  if (gps.date.isValid())
  {
    SerialUSB.print(gps.date.month());
    SerialUSB.print(F("/"));
    SerialUSB.print(gps.date.day());
    SerialUSB.print(F("/"));
    SerialUSB.print(gps.date.year());
  }
  else
  {
    SerialUSB.print(F("INVALID"));
  }

/*
  delay(3000);


  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("L ");
  lcd.print(nloops);
*/
  //lcd.setCursor(8,0);
  lcd.setCursor(8,1);
  
  SerialUSB.print(F(" "));
  if (gps.time.isValid())
  {
    if (gps.time.hour() < 10) {
      SerialUSB.print(F("0"));
      lcd.print("0");
    }
    SerialUSB.print(gps.time.hour());
    SerialUSB.print(F(":"));
    lcd.print(gps.time.hour());
    lcd.print(":");
    
    if (gps.time.minute() < 10) {
      SerialUSB.print(F("0"));
      lcd.print("0");
    }
    SerialUSB.print(gps.time.minute());
    SerialUSB.print(F(":"));
    lcd.print(gps.time.minute());
    lcd.print(":");
    
    if (gps.time.second() < 10) {
      SerialUSB.print(F("0"));
      lcd.print("0");
    }
    SerialUSB.print(gps.time.second());
    SerialUSB.print(F("."));
    lcd.print(gps.time.second());
    
    if (gps.time.centisecond() < 10) SerialUSB.print(F("0"));
    SerialUSB.print(gps.time.centisecond());
  }
  else
  {
    SerialUSB.print(F("INVALID"));
    lcd.print("Invalid Time");
  }
 
  SerialUSB.println();

/*
  delay(3000);
*/
  
}
// === source ending


// === source: I2CDemo of BME680-libary
// compare https://wiki.seeedstudio.com/Grove-Temperature_Humidity_Pressure_Gas_Sensor_BME680/
float altitude(const int32_t press){
  return altitude(press, 1013.25);
}
float altitude(const int32_t press, const float seaLevel) {
 
  static float Altitude;
  Altitude =
      44330.0 * (1.0 - pow(((float)press / 100.0) / seaLevel, 0.1903));  // Convert into meters
  return (Altitude);
}  // of method altitude()
// === source ending


// source: basic_demo, compare Dust Sensor https://wiki.seeedstudio.com/Grove-Laser_PM2.5_Sensor-HM3301/
HM330XErrorCode print_result(const char* str, uint16_t value) {
    if (NULL == str) {
        return ERROR_PARAM;
    }
    SERIAL_OUTPUT.print(str);
    SERIAL_OUTPUT.println(value);
    return NO_ERROR;
}

/*parse buf with 29 uint8_t-data*/
HM330XErrorCode parse_result(uint8_t* data) {
    uint16_t value = 0;
    if (NULL == data) {
        return ERROR_PARAM;
    }
    for (int i = 1; i < 8; i++) {
        value = (uint16_t) data[i * 2] << 8 | data[i * 2 + 1];
        print_result(str[i - 1], value);

        // Adaption Tobi
        if (i!=1) {
          lpp.addAnalogOutput(i+6, value);
        }
        // Adaption ending
    }
    return NO_ERROR;
}

HM330XErrorCode parse_result_value(uint8_t* data) {
    if (NULL == data) {
        return ERROR_PARAM;
    }
    for (int i = 0; i < 28; i++) {
        SERIAL_OUTPUT.print(data[i], HEX);
        SERIAL_OUTPUT.print("  ");
        if ((0 == (i) % 5) || (0 == i)) {
            SERIAL_OUTPUT.println("");
        }
    }
    uint8_t sum = 0;
    for (int i = 0; i < 28; i++) {
        sum += data[i];
    }
    if (sum != data[28]) {
        SERIAL_OUTPUT.println("wrong checkSum!!!!");
    }
    SERIAL_OUTPUT.println("");
    return NO_ERROR;
}
// source ending
