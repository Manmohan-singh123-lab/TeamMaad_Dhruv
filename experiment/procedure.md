### Procedure
1. Select RC Components –
Choose resistor (R) and capacitor (C) values to design the circuits.

Example: R = 10kΩ, C = 0.001µF (gives a time constant τ = RC)


3. Build the Pre-emphasis Circuit –
Construct a high-pass filter using the selected RC values on a breadboard. Connect the input signal from a function generator.


4. Apply Input Signal –
Use a sine wave signal (e.g., 1kHz to 20kHz) from the function generator as input to the pre-emphasis circuit.


5. Observe Pre-emphasis Output –
Measure the output using an oscilloscope. Notice that higher frequencies have increased amplitude due to emphasis.


6. Construct the De-emphasis Circuit –
Build a low-pass filter with the same time constant (RC) as the pre-emphasis circuit.


7. Connect the Circuits in Series –
Connect the output of the pre-emphasis circuit to the input of the de-emphasis circuit.


8. Apply the Same Input Signal Again –
Feed the same input signal through the combined circuit and observe the final output on the oscilloscope.


9. Analyze the Results –
Compare the input and final output signals. You should observe that the original signal shape is restored, showing the de-emphasis effect successfully cancels the pre-emphasis.
