#include <Servo.h>

/**
 * Sonar
 * 
 * Outputs the distance reading of a ultrasonic sensro in cm.
 * 
 * Circuit:
 * 
 * Sonic sensor vcc to vcc, gnd to gnd, echo to pin 2 and trig to pin 3.
 * 
 */

// this constant won't change. It's the pin number of the sensor's output:
const int pingPin = 3;
const int echoPin = 2;
const int servoPin = 9;

Servo servo;
int position = 0;                        // Rotation in degrees.
int direction = 1;                       // 1 is left, 0 is right.
int steps = constrain(180 / 40, 0, 180); // Number of steps in 180.

void setup()
{
  // initialize serial communication:
  Serial.begin(9600);

  // Attach to servo.
  servo.attach(servoPin);

  // Sonic sensor pins.
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop()
{
  // Switch direction if we need to.
  switch (position)
  {
  case 180:
    direction = 1;
    break;

  case 0:
    direction = 0;
    break;
  }

  // Move servo depending on direction we're travelling.
  switch (direction)
  {
  case 0:
    position += steps;
    break;

  case 1:
    position -= steps;
    break;
  }
  servo.write(position);

  // Take measurement.
  long cm = takeMeasurement();

  // Push data down serial (in JSON!).
  Serial.print("{");
  Serial.print("\"cm\": ");
  Serial.print(cm);
  Serial.print(", \"position\": ");
  Serial.print(position);
  Serial.print("}");
  Serial.println();

  // No rush.
  delay(100);
}

/**
 * @brief Converts microseconds a sounds wave took to rebound into CM.
 * 
 * @param microseconds
 * @return long 
 */
long microsecondsToCentimeters(long microseconds)
{
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the object we
  // take half of the distance travelled.
  return microseconds / 29 / 2;
}

/**
 * @brief Triggers sonic sensor to take a measurement in CM.
 * 
 * @return long 
 */
long takeMeasurement()
{
  // Short low to ensure a clean high pulse.
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);

  // High burst to trigger measurement.
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(10); // 10 high for my sonic sensor.
  digitalWrite(pingPin, LOW);

  // Read how long it took for the sound wave to return.
  long duration = pulseIn(echoPin, HIGH);

  // Convert the time measurement into a distance.
  return microsecondsToCentimeters(duration);
}
