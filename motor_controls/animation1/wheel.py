import tkinter as tkr
import numpy as np
import time 
import sys 


curr_pos = 90
wheel_center_x = 205
wheel_center_y = 205

top_left_x = 5
top_left_y = 5
bot_right_x = 405
bot_right_y = 405
polar_c = [200, 90]

line_width = 5
marker_width = 10

sleep_time = .01

def is_int(val):
    try:
        num = int(val)
    except ValueError:
        return False
    return True 

def rotate_delta(polar_c, delta):
    polar_c[1] += delta
    if polar_c[1] == 361 :
        polar_c[1] -= 360
    elif polar_c[1] == -1 :
        polar_c[1] += 360

    y = polar_c[0] * np.sin(np.deg2rad(polar_c[1])) + 205
    x = polar_c[0] * np.cos(np.deg2rad(polar_c[1])) + 205
    return (wheel_center_x, wheel_center_y, x, y)

def rotate_line_n_degrees(polar_c, n, line, canvas, sleep_time, tk):
    time.sleep(sleep_time)
    sgn = 1
    if (n == 0):
        return
    if (n < 0):
        sgn = -1
    
    for i in range(abs(n)):
      
        canvas.coords(line, rotate_delta(polar_c, sgn))
        time.sleep(sleep_time)
        tk.update()
    

def compute_min(a1, a2):
    cw = a2 - a1
    ccw = a1 - a2 
    if ccw < 0 :
        ccw += 360
    elif cw < 0 :
        cw += 360
    
    if ccw < cw :
        return -ccw
    else :
        return cw



tk = tkr.Tk() 

canvas = tkr.Canvas(tk, width=420, height=410)
canvas.pack()

circle = canvas.create_oval(top_left_x, top_left_y, bot_right_x, bot_right_y, fill="light blue")

polar_c_marker = [100, 90]
polar_c_texts =  [110, 100]
m1 = canvas.create_line(rotate_delta(polar_c_marker, 0), width=marker_width, fill="light green")
t1 = canvas.create_text(rotate_delta(polar_c_texts,0)[2:], fill="darkblue", font="Times 20 italic bold", text="0")
for ctr in range(4):
    canvas.create_line(rotate_delta(polar_c_marker, 72), width=marker_width, fill="light green")
    canvas.create_text(rotate_delta(polar_c_texts, 72)[2:], fill="darkblue", font="Times 20 italic bold", text="{0}".format(ctr + 1))

line = canvas.create_line(rotate_delta(polar_c, 0))


while True:
    usr_inpt = input("Enter a number in {0, 1, 2, 3, 4}: ")
    # canvas.delete(line) 
    if (not is_int(usr_inpt)):
        print("\nPlease enter a number or -1 to exit\n")
    elif int(usr_inpt) < 0 :
        print("\nNegative input, exiting....")
        exit()
    else:
        val = (int(usr_inpt) % 5) * 72 + 90
        to_move = compute_min(curr_pos, val)
 
        
        rotate_line_n_degrees(polar_c, to_move, line, canvas, sleep_time, tk)
        curr_pos = val


tk.mainloop() 