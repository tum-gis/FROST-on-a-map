#include <CayenneLPP.h>                      // Include Cayenne Library
#include <LoRaWan.h>
#include "Zanshin_BME680.h"
BME680_Class BME680;

#define USE_GPS 1
 
#ifdef USE_GPS
#include "TinyGPS++.h"
TinyGPSPlus gps;
#endif
 
#define DevEUI "0009FDE4A6BBAB6C"
#define AppEUI "70B3D57ED002F952"
#define AppKey "43BAAA8D3A95246033DAE2C52EA56B5E"

#include <Wire.h> 
#include "rgb_lcd.h"

rgb_lcd lcd;

const int colorR = 255;
const int colorG = 0;
const int colorB = 0;

char buffer[256];
CayenneLPP lpp(51); 

float timestamp = 0;
bool stationary = false;

 
void setup(void)
{
  digitalWrite(38, HIGH);
  lcd.begin(16, 2);
  lcd.setRGB(colorR, colorG, colorB);
  lcd.clear();
  lcd.print("Setup Board");
  lora.init();                        // Initialize the LoRaWAN module
  lora.setDeviceReset();
  //BME setup
    
    lcd.setCursor(0,0);
    lcd.clear();
    lcd.print("Setup BME");
    Serial.print(F("- Initializing BME680 sensor\n"));
    while (!BME680.begin(I2C_STANDARD_MODE))  { // Start BME680 using I2C, use first device found
      Serial.print(F("-  Unable to find BME680. Trying again in 5 seconds.\n"));
      delay(5000);
    }  // of loop until device is located
    Serial.print(F("- Setting 16x oversampling for all sensors\n"));
    BME680.setOversampling(TemperatureSensor, Oversample16);  // Use enumerated type values
    BME680.setOversampling(HumiditySensor, Oversample16);     // Use enumerated type values
    BME680.setOversampling(PressureSensor, Oversample16);     // Use enumerated type values
    Serial.print(F("- Setting IIR filter to a value of 4 samples\n"));
    BME680.setIIRFilter(IIR4);  // Use enumerated type values
    Serial.print(F("- Setting gas measurement to 320\xC2\xB0\x43 for 150ms\n"));  // "�C" symbols
    BME680.setGas(320, 150);  // 320�c for 150 milliseconds
  //end BME setup
  //start Connection Setup
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Setup Connection");
    
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
    while(!lora.setOTAAJoin(JOIN,20));    // wait until the node has successfully joined TTN
  
    lora.setPort(1);                     // all data packets are sent to LoRaWAN port 10 (Port number is set as per SWM configuration)
    lcd.setCursor(0,0);
    lcd.clear();
    lcd.print("Connected!");
  // Delay
  timestamp = millis();
  while(millis() - timestamp < 3000) {
    // do nothing --> wait
  }
    
    
    
    char c;
    #ifdef USE_GPS
      bool locked;
  #endif
 
    SerialUSB.begin(115200);
 
    #ifdef USE_GPS
    Serial2.begin(9600);     // open the GPS
    locked = false;
 
    // For S&G, let's get the GPS fix now, before we start running arbitary
    // delays for the LoRa section

    lcd.setCursor(0,0);
    lcd.clear();
    lcd.print("GPS Setup started");
    while (!gps.location.isValid()) {
      while (Serial2.available() > 0) {
        if (gps.encode(Serial2.read())) {
          if (stationary) { // Ist der Sensor stationär?
            displayInfo();
            break;
          }
          else {
            if(gps.location.isUpdated()) { // Ist der Sensor stationär, dann kann diese if-Schleife weggelassen werden
              displayInfo();
              break;
            }
          }
        }

      }
    }
    
    
  #endif


  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Stationary GPS?");
  lcd.setCursor(0,1);
  if (stationary) {
    lcd.print("true");
  }
  else {
    lcd.print("false");
  }

  // Delay
  timestamp = millis();
  while(millis() - timestamp < 5000) {
    // do nothing --> wait
  }

  

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Setup finished");
  SerialUSB.println("Setup finished");

  // Delay
  timestamp = millis();
  while(millis() - timestamp < 3000) {
    // do nothing --> wait
  }
}
 


float latitude;
float longitude;
float temperature;
float humidity;
float pressure;
unsigned int nloops = 0;


void loop(void)
{
  nloops++;
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("-- LOOP ");
  lcd.print(nloops);

  SerialUSB.print("-- LOOP ");
  SerialUSB.println(nloops);

  // Delay
  timestamp = millis();
  while(millis() - timestamp < 3000) {
    // do nothing --> wait
  }



  while (Serial2.available() > 0) {
    if (gps.encode(Serial2.read())) {
      if (stationary) { // Ist der Sensor stationär?
        displayInfo();
        break;
      }
      else {
        if(gps.location.isUpdated()) { // Ist der Sensor stationär, dann kann diese if-Schleife weggelassen werden
          displayInfo();
          break;
        }
      }
    }

  }
  static int32_t  temp, hum, pres, gas;
  static float    alt;
  BME680.getSensorData(temp, hum, pres, gas);     
  
  temperature=temp/100.0;
  humidity=hum/1000.0;
  pressure=pres/100.0;
  alt=altitude(pres);
  Serial.print("T: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("Pressure: ");
  Serial.println(pressure);
  Serial.print("Altitude: ");
  Serial.println(alt);
  

 
  lpp.reset();                                                     // Resets the Cayenne buffer
  lpp.addTemperature(1, temperature);                                     // encodes the temperature value 22.5 on channel 1 in Cayenne format
  lpp.addBarometricPressure(2, pressure);                           // encodes the pressure value 1073.21 on channel 2 in Cayenne format
  lpp.addRelativeHumidity(3, humidity);
  lpp.addGPS(4, latitude, longitude, alt);  
 
  // Send it off
  bool result = lora.transferPacket(lpp.getBuffer(), lpp.getSize(), 5);   // sends the Cayenne encoded data packet (n bytes) with a default timeout of 5 secs
 
  if (result)
  {
    short length;
    short rssi;
  
    length = lora.receivePacket(buffer, 256, &rssi);
  
    if (length)
    {
  
      if (Serial) {
        Serial.print("Length is: ");
        Serial.println(length);
        Serial.print("RSSI is: ");
        Serial.println(rssi);
        Serial.print("Data is: ");
        for (unsigned char i = 0; i < length; i ++)
        {
          Serial.print("0x");
          Serial.print(buffer[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
      }
    }
  }
  
  if (Serial) {
    Serial.println((String)"Loop " + nloops + "...done!\n");
  }
  

}






 

void displayInfo()
{
  
  float flat, flng, falt;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("L ");
  lcd.print(nloops);
  lcd.setCursor(7,0);


    
  SerialUSB.print(F("Location: ")); 
  if (gps.location.isValid())
  {
    flat = gps.location.lat();
    latitude=flat;
    flng = gps.location.lng();
    longitude=flng;
    
    SerialUSB.print(flat, 6);
    SerialUSB.print(F(","));
    SerialUSB.print(flng, 6);

    lcd.print(flat,6);
    lcd.setCursor(7,1);
    lcd.print(flng,6);
  }
  else
  {
    SerialUSB.print(F("INVALID"));
    lcd.print("Invalid GPS");
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


  timestamp = millis();
  while(millis() - timestamp < 5000) {
    // do nothing --> wait
  }


  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("L ");
  lcd.print(nloops);
  lcd.setCursor(8,0);
  
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

 
  timestamp = millis();
  while(millis() - timestamp < 3000) {
    // do nothing --> wait
  }
  
  
}
float altitude(const int32_t press){
  return altitude(press, 1013.25);
}
float altitude(const int32_t press, const float seaLevel) {
 
  static float Altitude;
  Altitude =
      44330.0 * (1.0 - pow(((float)press / 100.0) / seaLevel, 0.1903));  // Convert into meters
  return (Altitude);
}  // of method altitude()
