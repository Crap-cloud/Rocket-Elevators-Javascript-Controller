# Rocket-Elevators-Javascript-Controller

# Usage
To do some tests you can uncomment a bit of code at the end of my file and see the results with 'node residential_controller.js' command. For scenarios I used same examples as they are in the test.js file. For that you need to install node.js.

## Example
Commands that you can use to download npm and use it after to run tests :
npm install
npm run dev
npm test

Command that you can use after downloading node.js :
node residential_controller.js

# Description
Example:

This program controls a Column of elevators.

It sends an elevator when a user presses a button on a floor and it takes
a user to its desired floor when a button is pressed from the inside of elevator.

Elevator selection is based on scores given by their activity when the request is done. 1 is the best score you have, it means the elevator is at your floor, it is stopped and it goes in the same direction as you requested. At the opposite, the worst score is 4, when most of elevators are unavailable and you peek the closest to you.

# Video Link
Here is my explanation video link about my code : https://youtu.be/Z-z0zh8e3Vk

