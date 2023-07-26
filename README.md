This is Remek's vanilla (mapping) app bootstrap. It assumes you're on debian linux. If you don't know what you're doing, install nvm, tune to v4.2.6, npm install, then npm run gulp. 

First install Node.js and npm according to the following instructions: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Then, you need to install nvm (node version manager):
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
2. source ~/.nvm/nvm.sh
3. nvm install 4.2.6 
4. node -v (Verify that node version is v4.2.6 (nvm install 4.2.6))
5. npm install (installs all relevant dependencies automatically)
6. npm run gulp

Operational Steps:
1. Make sure backend server is actively listening before loading application. You can retry the connection a finite amount of times, but it must be able to connect.
2. Open up command console to display any relevant messages or errors (optional, useful for debugging)
3. You can move the pins anywhere you would like, clicking on the pins reveals what the pin represents
4. If you want to demo the obstacle avoidance, make sure to put the red pins in a location that the drone is likely to fly into when trying to go to the destination. The red circles around each pin are of radius ten meters (10 m), which can of course be changed to whatever you want the obstacle radius to be around the point (must be changed in the UI and backend seperately unfortunately). The drone basically "sees" the obstacle pin as a cylindrical obstacle that has "infinite" altitude. This is because the point does not have any altitude since it is represented by a two dimensional, so the drone will never attempt to fly over the obstacle (even if it does cross into the obstacle sometimes if the controller parameters are not balanced enough).
5. When the pins are where you want them, push confirm pins button. Make sure your takeoff location is somewhere other than default, this is important for avoiding the failure to update the instance in the cloud if the secrets file (values.yml) is not modified. 
6. Update helm chart (as per the README.md in the offboard-mode-feature branch of the mavlink-shim).
7. Wait for the backend to do its magic! The UI will now simply display telemetry data. 