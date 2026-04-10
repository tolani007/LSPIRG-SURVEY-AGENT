# BrilliantEigentikiData2025
> I built my own year-in-review for Brilliant.org because the app did not have one -- and I wanted to see my learning journey come alive with animations, charts, and sound.

## What I Built (and Why You Should Care)

I use Brilliant.org to study math and science, and I love those end-of-year recaps that Spotify and GitHub do. Brilliant did not have one. So I built my own. I extracted my learning data, processed it with Python, and created a fully animated, interactive web visualization with React, Framer Motion, Recharts, and even Web Audio API for sound feedback. It has a particle-effect hero section, scroll-triggered animations, counting stat cards, an activity heatmap, streak visualizations, course progress cards, glassmorphism design, dark/light mode toggle, and responsive layouts.

This is not just "pretty charts on a page." It is a full data pipeline project: raw data goes in one end (Python extraction scripts), gets processed into structured JSON, and comes out the other end as an interactive, animated web experience. It touches data engineering (Python processing), frontend engineering (React + TypeScript), animation engineering (Framer Motion), data visualization (Recharts), and UX design (responsive, accessible, beautiful). Very few projects exercise this many muscles at once.

Why should you care? Because data visualization is one of the most in-demand skills in tech, and most people stop at "matplotlib bar chart." This project shows what happens when you bring frontend engineering rigor to data visualization -- the data tells a story, and the presentation makes people actually want to read it.

## The Core Concepts - Explained Simply

### Data Processing Pipeline (Python to JSON to React)
The project starts with raw data from Brilliant.org and ends with an interactive web page. In between, there is a pipeline. Think of it like cooking: Python (`scripts/extract-data.py`) is the prep kitchen where raw ingredients (API data, scraped stats) get cleaned, sliced, and organized into containers (`src/data/processed-data.json`). React is the dining room where those prepared ingredients get plated beautifully. The JSON file is the pass-through window connecting the two. This separation is crucial -- if Brilliant changes their data format, I only fix the Python script. The React app never needs to know.

### Framer Motion Animations
Framer Motion is React's best animation library, and understanding it opens a whole world of interaction design. The core idea is simple: instead of toggling CSS classes, you describe where a component should start and where it should end, and Framer Motion figures out the animation in between. Want a card to fade in from the left? `initial={{ opacity: 0, x: -50 }}` and `animate={{ opacity: 1, x: 0 }}`. That is it. But the real power is in scroll-triggered animations using `whileInView`, gesture animations with `whileHover` and `whileTap`, and spring physics that make motion feel natural instead of robotic. Springs have damping and stiffness -- just like real physical springs. That is why Framer Motion animations feel "alive."

### React Component Architecture
The `src/components/` directory tells the whole story: `Hero.tsx`, `StatCard.tsx`, `Timeline.tsx`, and more. Each component is a self-contained unit responsible for one piece of the visualization. The Hero handles the landing animation with particles. StatCard displays a single metric with a counting animation. Timeline shows the learning journey chronologically. The architecture follows a pattern: data flows down as props, each component handles its own animation and layout. This composability means I can rearrange the page by reordering components, add new sections by creating new components, or reuse components in other projects.

### Recharts for Data Visualization
Recharts is a React-native charting library built on D3.js. The key advantage over raw D3 is that Recharts speaks React's language -- components, props, and state. Want a line chart? `<LineChart data={myData}><Line dataKey="score" /></LineChart>`. The activity heatmap (think GitHub's contribution graph) shows learning patterns across days and weeks. The course progress charts show completion percentages. Recharts handles axes, tooltips, legends, and responsive sizing. Under the hood, it is rendering SVG elements, which means everything is crisp at any resolution.

### Web Audio API for Sound Feedback
Sound feedback turns a passive viewing experience into an active one. When a stat card counts up, a subtle tick sound plays. When you complete a section scroll, a satisfying chime. This is the same Web Audio API I used in Neon Tic-Tac-Toe, but here it serves a different purpose: reinforcement. Sound makes interactions feel more tangible. The technical implementation is the same: create an AudioContext, generate tones with oscillators, shape them with gain envelopes (a quick attack and slow decay makes a "ding"), and route to speakers.

### Scroll-Triggered Animations
This is where the storytelling magic lives. As you scroll down the page, elements animate into view -- cards slide in, numbers count up, charts draw themselves. The technique uses the Intersection Observer API (a browser API that tells you when an element enters or exits the viewport) combined with Framer Motion's `whileInView` prop. The result feels like the page is responding to your attention. This is not just decoration -- it is information design. You process one section, then the next one appears. It controls the pacing of the narrative.

### Glassmorphism Design
Glassmorphism is a design trend that makes elements look like frosted glass -- semi-transparent backgrounds with a blur effect that lets the content behind show through softly. In CSS, it is `backdrop-filter: blur(10px)` plus a semi-transparent background color. It creates depth without heavy shadows. Combined with dark mode (swapping the color palette based on a toggle), the design adapts to user preference while maintaining the same visual language.

### Particle Effects in the Hero Section
The hero section has floating particles that create an ambient, dynamic feel. Particles are just small shapes (circles, dots) that move according to simple rules: drift in a direction, maybe respond to gravity or mouse position, wrap around when they leave the screen. Each frame, you update each particle's position and redraw. With enough particles moving slowly, you get an effect that feels organic and alive. It is the same principle as the confetti in Neon Tic-Tac-Toe, just calmer.

## How It Actually Works - Step by Step

1. **Data Extraction:** `scripts/extract-data.py` runs against Brilliant.org data (API or exported data). Python processes raw metrics: courses completed, streaks, daily activity, time spent, scores.
2. **Data Processing:** The Python script cleans, aggregates, and structures the data into `src/data/processed-data.json`. This JSON file becomes the single source of truth for the frontend.
3. **React App Loads:** Vite serves the React app. On mount, the app reads the processed JSON data.
4. **Hero Renders:** The Hero component initializes particle animations and displays the headline stats with entrance animations.
5. **Scroll Journey Begins:** As the user scrolls, Intersection Observer triggers fire. Framer Motion animates each section into view.
6. **StatCards Count Up:** Each stat card receives a target number and animates from 0 to the target using a counting animation (requestAnimationFrame + easing function). Sound plays on completion.
7. **Charts Draw:** Recharts components render the activity heatmap, streak visualization, and course progress bars. The charts animate their data fills using Recharts' built-in animation props.
8. **Dark/Light Toggle:** A mode toggle swaps CSS variables (or Tailwind's dark mode classes), recoloring the entire page without re-rendering components.
9. **Responsive Adaptation:** Tailwind's responsive breakpoints rearrange the layout for mobile. Stat cards stack vertically, charts resize, and touch interactions replace hover interactions.

## What This Taught Me (And What It'll Teach You)

- **End-to-end data pipeline thinking.** Raw data in, beautiful visualization out. The Python-to-JSON-to-React pipeline is a miniature version of what data teams do at scale.
- **Framer Motion mastery.** Spring physics, scroll triggers, gesture animations, layout animations -- Framer Motion is the industry standard for React animation, and this project made me fluent.
- **Data visualization principles.** Choosing the right chart for the right data, labeling axes clearly, using color meaningfully -- these are data literacy skills that transfer to any tool.
- **React component design.** Breaking a complex page into composable, reusable components with clear prop interfaces. This is the core skill of frontend engineering.
- **Python data processing.** Using pandas and Python scripting to transform raw data into analysis-ready formats. The same skill used in data engineering and data science.
- **Web Audio as interaction design.** Sound is an underused dimension in web development. Learning when and how to use it adds a layer to your UX thinking.
- **Responsive design rigor.** Making a complex animated page work on phones, tablets, and desktops requires careful planning with Tailwind's breakpoint system.
- **Dark mode implementation.** Understanding CSS custom properties, media queries for `prefers-color-scheme`, and state-driven theme toggling.

## Interview Confidence Builder

**Q: Walk me through a data pipeline you have built.**
Start with the source (Brilliant.org data), explain the processing step (Python script that cleans and aggregates), describe the output format (structured JSON), and show the consumer (React frontend). Emphasize separation of concerns: if the source changes, only the Python script changes. If the visualization changes, only React changes. They are decoupled by the JSON contract.

**Q: How does Framer Motion work, and why did you choose it over CSS animations?**
Framer Motion uses spring physics (damping, stiffness, mass) instead of CSS's bezier curves. Springs feel more natural because they overshoot and settle, like real objects. Framer Motion also integrates natively with React's component model -- you can animate mount/unmount, respond to state changes, and coordinate complex sequences. CSS animations cannot do layout animations or spring physics without JavaScript.

**Q: How would you build an activity heatmap like GitHub's contribution graph?**
It is a grid where each cell represents a day, colored by activity level. The data structure is an array of `{ date, count }` objects. You map dates to grid positions (columns for weeks, rows for days of the week). Color is a function of count: 0 is gray, 1-3 is light green, 4+ is dark green. Recharts or D3 can render this, or you can build it with plain CSS Grid and dynamic class names.

**Q: Explain the Intersection Observer API.**
It is a browser API that asynchronously watches elements and tells you when they enter or leave the viewport (or any ancestor element). You create an observer with a callback and a threshold (e.g., "trigger when 50% visible"), then observe target elements. It replaced the old pattern of listening to scroll events and calculating positions manually, which was expensive and janky. Framer Motion uses it under the hood for `whileInView`.

**Q: How do you implement dark mode in a React application?**
Three layers: (1) detect system preference with `prefers-color-scheme` media query, (2) provide a manual toggle that stores the user's choice in localStorage, and (3) apply the theme using CSS custom properties or Tailwind's `dark:` variant. The toggle updates a state variable and a class on the root element. All color values reference the theme, so swapping the class recolors everything.

**Q: What is glassmorphism, and how do you implement it in CSS?**
Glassmorphism is a design style that makes elements look like frosted glass. Implementation: `background: rgba(255, 255, 255, 0.1)` for semi-transparency, `backdrop-filter: blur(10px)` for the frosted effect, and `border: 1px solid rgba(255, 255, 255, 0.2)` for a subtle edge. It requires the parent to have visible content behind the element. Browser support for `backdrop-filter` is now excellent.

**Q: How do you make animations accessible?**
Respect the `prefers-reduced-motion` media query. Users who have motion sensitivity enable this in their OS settings. In Framer Motion, you can use the `useReducedMotion` hook and conditionally disable animations. In CSS, wrap animations in `@media (prefers-reduced-motion: no-preference)`. Never make essential information dependent on animation.

**Q: Why did you build this instead of waiting for Brilliant to build one?**
Because building it taught me more than waiting ever would. I learned Python data processing, React animation, data visualization, and full-pipeline thinking in one project. And I got to design the exact experience I wanted. The best projects come from scratching your own itch.

## Get Started

```bash
# Clone the repo
git clone https://github.com/tolani007/BrilliantEigentikiData2025.git
cd BrilliantEigentikiData2025

# Process the data first
python3 scripts/extract-data.py

# Install frontend dependencies
npm install

# Start the development server
npm run dev

# Open in your browser (usually http://localhost:5173)
```

To use your own Brilliant data, replace the source data and rerun the Python extraction script. The React app reads from `src/data/processed-data.json`, so as long as your script outputs the same structure, everything works.

## How This Connects

This project is the intersection of three of my passions: data, design, and learning. The **Python data processing** skills connect directly to my data engineering vault and my scraping projects. The **React + Framer Motion** skills are the polished version of what I experimented with in [Neon Tic-Tac-Toe](neon-tic-tac-toe.md). The **Recharts visualization** work is what happens when you take the data from my analysis projects and give it a proper visual home. And the **Web Audio** feedback is something I keep coming back to because sound adds a dimension that most developers ignore. This project proves I can take data from source to story.
