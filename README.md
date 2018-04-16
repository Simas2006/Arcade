## Arcade - How To Install and Use

### On Computer

NodeJS is required to run Arcade.

Run the following code in your terminal:
```
$ git clone git@github.com:Simas2006/Arcade.git
$ cd Arcade/arcade-app
$ npm install
$ node server.js <PORT>
```

Open `http://localhost:<PORT>/web/index.html` in your browser. Align game as necessary.

The home page will contain all of your installed games, and help text for each one. Press A on your controller to start a game.

### On Phone/Controller

Download the Expo app from the App Store.

In your browser of choice, open `https://exp.host/@simas06/gyro-detector`. Scroll down to the `Open Project in Expo` button and press it.

You will be prompted with a screen to into the "Machine Address". Type in the local address of your Arcade device, including the port you configured above. You will be connected, and three new buttons will appear on screen:
  - "A": Used in game and to start games
  - "Home": Return to home page
  - "Disconnect": Disconnect from arcade machine

The app is also always reading the accelerometer data from the phone, which is used in games. Note that only the first connected controller is able to manipulate the home page.
