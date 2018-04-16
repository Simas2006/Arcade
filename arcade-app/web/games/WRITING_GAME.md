## Arcade - How to Write Games

### Game Boilerplate

#### HTML
Each game requires an object in the body of `index.html` according to the pattern:

```
<div id="<GAME NAME>-game" class="game">
  ... any required html ...
</div>
```

Add your JavaScript declaration to the head of `index.html` above the `script.js` declaration according to the pattern:

```
<script src="games/<GAME NAME>.js"></script>
```

#### CSS
Add necessary CSS code into `style.css` in sections for each game, separated by line breaks. Leave CSS for `[#.]home*` at the bottom of the file.

#### JS
Add your game declaration in the `games` object in the `script.js` file according to the pattern:

```
<VISIBLE GAME NAME>: <INTERNAL GAME NAME>
```

### Game API

All game code must be stored in a JS file in the `games` directory, named `<GAME NAME>.js`. The file must contain a single class, named the internal game name (see Game Boilerplate/JS).

#### Object Data

  - `gameState`: Scratch space. Is not affected by core engine.
  - `directionalAPI`: Object controlling all interaction with controllers. Functions called by core engine. If `metadata.controllerType` equals 2, format must be doubled in array as [Format,Format]. Format is:
    - `x`:
      - `positive`: Function,
      - `negative`: Function
    - `z`:
      - `positive`: Function,
      - `negative`: Function
    - `a`: Function
  - `metadata`: Object with game metadata for core engine. Format is:
    - `controllerType`: Integer from 0 to 2. Values represent:
      - 0: Single controller mode
      - 1: Two controller mode, simultaneous interaction disabled
      - 2: Two controller mode, simultaneous interaction enabled
    - `turn`: Integer from 0 to 1. When `controllerType` equals 1, values represent which controller is allowed to call the functions in `directionalAPI`. When `controllerType` does not equal 1, this variable does nothing. It is recommended to store the actual turn in a variable in `gameState`, and then to copy that variable here in a rendering loop.
    - `help`: String. Help text that will be shown on the home page if the user selects your game. Describe controls and the game here.

#### Object Functions

  - `constructor`: Define all object data here. Do not call object or core functions here.
  - `init`: Called when core can fully initialize all game data. Initialize rendering loops here.
  - (optional) `render`: Can be called by initializing a `setInterval` loop in the core. Should be used if using canvas for game display.
  - `unmount`: Called when home button on controller is pressed and returning to home page. Cancel all interval loops here, so they are not active on the home page.
