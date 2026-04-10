# Neon Tic-Tac-Toe
> I took the simplest game in the world and turned it into a full sensory experience -- because why not learn every browser API at once?

## What I Built (and Why You Should Care)

I built an "enterprise-grade, neon-infused" Tic-Tac-Toe game. Yes, you read that right. The game you played on napkins as a kid -- except now it has a 3D parallax board, an animated purple liquid background, chromatic aberration cursor trails, an emoji companion cheering you on, confetti when you win, and a generative space drone soundscape playing the whole time. It runs on Node.js with Express and deploys to Google Cloud Run.

Why did I do this? Because the best way to learn a dozen browser APIs is to give yourself permission to go completely overboard. When you build something "serious," you play it safe. When you build something absurd, you experiment. I touched Three.js, the Web Audio API, Canvas API, CSS3 animations, touch event handling, and cloud deployment -- all in one project. Every single one of those is a real skill that shows up in real jobs.

If you want to understand how the modern browser is basically a game engine hiding inside a document viewer, this project is your playground.

## The Core Concepts - Explained Simply

### Three.js and 3D Rendering
Think of your browser as a window into a 3D world. Three.js is the toolkit that lets you build that world. You create a **scene** (the room), a **camera** (your eyes), and a **renderer** (the artist who paints what the camera sees onto your screen). In this project, I use Three.js for the parallax board tilting -- as you move your mouse, the board subtly rotates in 3D space, like holding a card and tilting it under a light. Under the hood, that is matrix math and WebGL shaders, but Three.js wraps it all in a friendly API so you can say "rotate this thing 5 degrees on the Y axis" instead of writing GPU instructions.

### Web Audio API and Generative Sound
The Web Audio API is like having a tiny recording studio inside the browser. You can create oscillators (think: tuning forks that vibrate at specific frequencies), connect them through effects (reverb, gain, filters), and route them to the speakers. My "space drone soundscape" is not a pre-recorded MP3 -- it is generated in real time by layering low-frequency oscillators with slow modulation. Imagine three people each humming a slightly different note and slowly changing pitch. That is generative audio. The key insight: audio in the browser is a **graph** of connected nodes, just like a signal chain in a recording studio.

### Canvas API for Visual Effects
The HTML Canvas is your digital drawing surface. Every frame (roughly 60 times per second), I clear the canvas and redraw. The chromatic aberration cursor trails work by drawing the same shape three times, slightly offset, in red, green, and blue -- mimicking how a cheap camera lens splits light. The liquid background uses simplex noise (a math function that generates smooth, organic-looking randomness) to animate color blobs. Each frame, the noise values shift slightly, creating that flowing, lava-lamp effect.

### Express.js Server Architecture
Express is the skeleton of a Node.js web server. Think of it as a receptionist: requests come in, Express looks at the URL and method, and routes them to the right handler. For this project, the server is lean -- it mostly serves static files (the HTML, CSS, and JS in the `public/` folder). But having a real server means I can deploy it to the cloud, add an API later, or serve different content based on the request. It is the difference between a static HTML file and a real web application.

### Game State Management
Even Tic-Tac-Toe needs state management. I track whose turn it is, what is in each cell, and whether someone has won. This is the same fundamental pattern behind every interactive app: you have **state** (the data), **actions** (user clicks a cell), and **rendering** (update the UI to reflect the new state). React, Vue, Redux -- they all formalize this exact loop. Tic-Tac-Toe is the perfect sandbox to internalize it before frameworks add complexity.

### Cloud Deployment with Google Cloud Run
Cloud Run is Google's "just give me a container and I will run it" service. I package my app in a Docker container (or let Cloud Run build it), push it up, and Google handles scaling, HTTPS, and everything else. It is **serverless containers** -- you pay only when someone is actually playing the game. Think of it like a food truck: it only runs when customers show up, instead of paying rent on a restaurant 24/7.

## How It Actually Works - Step by Step

1. **Server starts:** `server.js` fires up Express, tells it to serve everything in the `public/` directory, and listens on a port.
2. **Browser loads the page:** The HTML file pulls in CSS for neon styling and JS for all the interactive features.
3. **Three.js initializes:** A 3D scene is created. The tic-tac-toe board is positioned in 3D space. Mouse move events feed into the camera or board rotation, creating the parallax tilt effect.
4. **Canvas layers activate:** A canvas element sits behind (or in front of) the game board, running the liquid background animation and cursor trail effects at 60fps via `requestAnimationFrame`.
5. **Web Audio boots up:** On the first user interaction (browsers require a gesture before playing audio), the generative soundscape starts. Oscillator nodes connect through gain and filter nodes to produce the ambient drone.
6. **Game loop runs:** Player clicks a cell. The game state updates. The UI re-renders the board. A win-check function scans rows, columns, and diagonals. If someone wins: confetti explodes, the emoji companion celebrates, and a victory sound triggers.
7. **Mobile support:** Touch events are mapped to the same handlers as mouse events, and CSS media queries adjust layouts for smaller screens.

## What This Taught Me (And What It'll Teach You)

- **Browser APIs are powerful.** The modern browser can do 3D graphics, generate audio, process images, and run at 60fps. You do not always need a native app.
- **requestAnimationFrame is your animation heartbeat.** Every smooth animation in the browser uses this function. It tells the browser "call me before the next repaint" and gives you a timestamp to calculate motion.
- **WebGL and Three.js fundamentals.** Scenes, cameras, renderers, meshes, materials, lights -- this vocabulary transfers directly to game development and AR/VR work.
- **The Audio Context graph model.** Understanding signal routing (source -> effect -> destination) is how all audio software works, from GarageBand to professional DAWs.
- **Canvas 2D rendering.** Drawing shapes, clearing frames, compositing layers -- the same skills power data visualizations, image editors, and games.
- **Express.js server patterns.** Middleware, static file serving, route handling -- the bread and butter of Node.js backend work.
- **Cloud Run deployment.** Containerizing and deploying a web app is a skill every developer needs. Cloud Run makes it approachable.

## Interview Confidence Builder

**Q: What is the difference between Canvas 2D and WebGL?**
Canvas 2D gives you a simple drawing API -- rectangles, arcs, text, images. WebGL gives you access to the GPU for hardware-accelerated 3D rendering. Three.js is a library that wraps WebGL so you do not have to write raw shader code. Use Canvas 2D for 2D effects and simple graphics. Use WebGL/Three.js when you need 3D or heavy parallel computation.

**Q: How does requestAnimationFrame differ from setInterval for animations?**
`setInterval` fires at a fixed interval regardless of whether the browser is ready to repaint. `requestAnimationFrame` syncs with the browser's repaint cycle (usually 60fps), pauses when the tab is hidden (saving CPU), and gives you a high-resolution timestamp for smooth timing. Always use `requestAnimationFrame` for visual animations.

**Q: Explain the Web Audio API's node graph architecture.**
The Web Audio API models audio as a directed graph. You create an `AudioContext`, then build a chain of nodes: sources (oscillators, audio buffers) connect to processing nodes (gain, biquad filter, delay, convolver) which connect to the destination (speakers). Data flows through the graph in real time. This is exactly how hardware synthesizers and mixing boards work.

**Q: How would you handle game state in a more complex game?**
The same pattern scales up: define your state shape, write pure functions that take state + action and return new state, and render based on that state. For multiplayer, you would add a server-authoritative model where the server validates moves and broadcasts state. For undo/redo, you store a history of states. This is the foundation of the Redux pattern.

**Q: What is parallax, and how do you implement it in the browser?**
Parallax is when objects at different distances appear to move at different speeds relative to the viewer. In a browser, you can fake this by translating or rotating elements based on mouse position or scroll offset. I use Three.js to rotate the board in 3D space based on cursor coordinates, giving a "looking through a window" effect. The math is simple: map mouse X/Y to rotation angles with a damping factor.

**Q: How do you deploy a Node.js app to Google Cloud Run?**
You need a Dockerfile (or use Cloud Run's buildpacks), a `package.json` with a start script, and your app listening on the `PORT` environment variable (Cloud Run injects this). Then `gcloud run deploy` builds the container, pushes it to Artifact Registry, and spins up the service. Cloud Run scales to zero when idle, so you pay nothing when nobody is using it.

**Q: Why would you over-engineer a simple game?**
To learn. Constraints breed creativity, and absurd scope breeds breadth. By adding 3D, generative audio, canvas effects, and cloud deployment to a tic-tac-toe game, I touched more browser APIs in one project than most tutorials cover in a semester. The game is the excuse; the learning is the point.

## Get Started

```bash
# Clone the repo
git clone https://github.com/tolani007/neon-tic-tac-toe.git
cd neon-tic-tac-toe

# Install dependencies
npm install

# Run the server
node server.js

# Open in your browser
# http://localhost:3000 (or whatever port is configured)
```

For deployment to Cloud Run:
```bash
gcloud run deploy neon-tic-tac-toe --source . --allow-unauthenticated
```

## How This Connects

This project is where I let my creative side drive my technical learning. The **Three.js and animation skills** show up again in my [Brilliant Data Visualization](BrilliantEigentikiData2025.md) project, where I use Framer Motion for scroll-triggered animations. The **Web Audio API** knowledge carries over too. The **Express server** pattern is the same one powering my [LSPIRG Survey Agent](LSPIRG-SURVEY-AGENT.md) backend. And the sheer willingness to build something fun? That is the same energy behind every project in this collection -- learning should feel like play.
