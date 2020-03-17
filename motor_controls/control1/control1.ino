#include <Arduino.h>
#include "A4988.h"

#define STEP 3
#define DIR 4
#define FULL 200
#define SPEED 60
#define MS1 5
#define MS2 6
#define MS3 7
#define FULL_ANGLE 360
#define SECTORS 5

const int delta = FULL_ANGLE/SECTORS; 

/**
 * Sequences: 
 * 
 * SECTORS is defined as 5 above. So each 
 * dispensing bins are 360/5 = 70 degrees apart
 * Given a sequence, the motor will turn to those 
 * angles in that order. Taking the shortest path 
 * to get there. 
 */

 
//int sequence[5] = {3, 1, 2, 4, 3}; 

/**
 * To test: input a sequence len, and then 
 * enter an array with that many elements from 
 * 0 to 'SECTORS' - 1 as defined above. 
 * 
 * 0 is the home position, or the position that the 
 * servo motor starts from. 
 */
int sequence_len = 5; 
int sequence[sequence_len] = {1, 4, 3, 1, 3}; 
int current_pos; 

void go_to_angle(int a);
int compute_min(int a1, int a2); 

A4988 stepper1(FULL, DIR, STEP, MS1, MS2, MS3);

void setup() { 
    delay(5000);
    current_pos = 0; 
    stepper1.begin(20, 1); 
    delay(1000); 
}

void go_to_angle(int a) {
  stepper1.rotate(compute_min(current_pos, a) * delta); 
  current_pos = a; 
}

void go_home() {
  go_to_angle(0); 
}

int compute_min(int a1, int a2) {
  int cw = a2 - a1;
  int ccw = a1 - a2; 
  if (ccw < 0) {
    ccw += SECTORS;
  } else if (cw < 0) {
  cw += SECTORS;
  }
  if (ccw < cw) {
    return ccw;
  } else {
    return -cw; 
  }
}

void loop() {
  for (int i = 0; i < 5; ++i) {
    go_to_angle(sequence[i]);
    delay(5000);  
  }
  go_home(); 
  while(1); 
  
}
