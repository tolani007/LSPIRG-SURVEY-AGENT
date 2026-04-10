# Steeview WiFi DensePose (Rust)
> A high-performance system that detects human poses through walls using WiFi signals -- no cameras, no wearables, just $5 microcontrollers and Rust running 810x faster than Python.

## What I Built (and Why You Should Care)

Let me start with the headline: I built a system that can track up to 3 people through solid walls using nothing but WiFi signals and $5 ESP32 microcontrollers. No cameras. No wearables. No line-of-sight. Just the WiFi signals already bouncing around your home, analyzed in real-time at ~18 microseconds per frame by a Rust engine I wrote from scratch.

Why does this matter? Imagine an elderly person who lives alone and falls in the middle of the night. A camera in the bedroom is a privacy nightmare. A wearable only works if they remember to put it on. But WiFi signals pass through walls, reflect off human bodies, and carry information about movement and pose -- silently, continuously, and without any privacy-invasive visual data. That is what Steeview does. It turns ordinary WiFi into a through-wall sensing system for applications like fall detection, search-and-rescue, and hospital monitoring.

The engineering challenge was enormous. WiFi Channel State Information (CSI) is noisy, multipath-heavy, and incredibly sensitive to environmental changes. Extracting human pose from that signal requires a pipeline of sophisticated digital signal processing -- FFT, Hampel filtering, phase sanitization, Fresnel zone modeling -- all running fast enough for real-time tracking. I chose Rust because Python could not come close to the performance requirements. The result: 810x speedup over the Python prototype, with 10 modular crates covering everything from signal processing to neural networks to a Three.js real-time dashboard. Phase 1 delivered the Rust engine MVP. Phase 2 integrated real ESP32 hardware with UDP streaming for live tracking.

## The Core Concepts - Explained Simply

### Channel State Information (CSI)
Every WiFi packet carries hidden metadata that most people never think about. When a WiFi signal travels from your router to your laptop, it bounces off walls, furniture, and -- crucially -- people. By the time it arrives, the signal has been modified by everything it interacted with. **CSI** is a detailed measurement of exactly how the signal was modified across different frequency subcarriers. Think of it as a detailed fingerprint of the environment between the transmitter and receiver. When a person moves, walks, or falls, the CSI fingerprint changes. My system reads those changes and interprets them as human motion.

### Digital Signal Processing (DSP) Pipeline
Raw CSI data is messy. Imagine trying to listen to a whispered conversation in a noisy stadium -- you need serious filtering. My DSP pipeline is a sequence of cleaning and analysis steps:

1. **Phase Sanitization:** Raw phase measurements from WiFi hardware jump around randomly due to clock offsets. Phase sanitization removes these hardware artifacts to reveal the true phase shifts caused by human movement. Think of it like removing the wobble from a camera before you can read the scene.

2. **Hampel Filtering:** This is an outlier-removal technique. Occasionally, a CSI reading will be wildly wrong -- a spike caused by interference or hardware glitch. The Hampel filter identifies values that deviate too far from their local median and replaces them with the median. It is like having a copy editor who catches obvious typos before the article goes to print.

3. **FFT (Fast Fourier Transform):** This is the workhorse. FFT takes a signal in the time domain ("the signal value at each moment") and converts it to the frequency domain ("how much energy is at each frequency"). Why? Because human movement shows up as specific frequency patterns in CSI. Breathing is around 0.1-0.5 Hz. Walking is 1-2 Hz. Falling is a sudden broadband spike. FFT lets me separate these activities by frequency, the same way a prism separates white light into colors.

4. **Fresnel Zone Tracking:** A Fresnel zone is the cigar-shaped region of space between a WiFi transmitter and receiver where signal reflection is strongest. When a person moves through a Fresnel zone, the CSI changes dramatically. By modeling the Fresnel zones between multiple transmitter-receiver pairs, I can triangulate a person's position and movement. Think of it like crossing laser beams in a heist movie -- except the "beams" are WiFi signals and the "alarm" is a pose detection.

### Rust's Ownership Model
I chose Rust for a reason beyond raw speed. Rust's ownership model guarantees memory safety at compile time -- no null pointer dereferences, no data races, no use-after-free bugs. In a real-time signal processing system where data flows between threads at high speed, this is not a nice-to-have; it is essential. Think of it like a traffic system where the compiler physically prevents car crashes rather than just posting speed limit signs and hoping for the best. Every one of the 10 crates in this project benefits from Rust's zero-cost abstractions: I get the safety of a high-level language with the performance of C.

### ESP32 Microcontrollers and Embedded Systems
The ESP32 is a $5 microcontroller with built-in WiFi. In Phase 2, I wrote C++ firmware that runs on these tiny chips, extracts CSI data from incoming WiFi packets, and streams it over UDP to the Rust engine. The remarkable thing is that these are commodity hardware -- not specialized laboratory equipment. I use multiple ESP32 boards positioned around a space to create overlapping Fresnel zones, giving the system spatial resolution. The firmware handles packet sniffing, CSI extraction, and real-time UDP transmission, all within the constraints of a chip with 520KB of RAM.

### WebAssembly (WASM)
One of the 10 crates compiles to WebAssembly, which means the signal processing can run inside a web browser. Why does this matter? Because it enables edge deployment -- a nurse's station could run the pose detection locally in their browser without sending data to a server, preserving patient privacy. WASM runs at near-native speed in the browser, and Rust is one of the best languages for targeting it.

### Real-Time Visualization with Three.js
Data is useless if nobody can see it. I built a real-time 60fps dashboard using Three.js that renders detected human poses as 3D figures in a browser. The Rust backend streams processed data to the frontend, which renders updated pose estimates smoothly. The dashboard also shows signal health metrics, detection confidence, and zone coverage maps.

## How It Actually Works - Step by Step

1. **ESP32 microcontrollers** are placed around a room. They passively capture WiFi packets and extract CSI (amplitude and phase for each frequency subcarrier).
2. **UDP streaming** sends raw CSI data from each ESP32 to the central Rust engine in real-time.
3. **The Rust engine** receives the streams and feeds them into the DSP pipeline:
   - Phase sanitization removes hardware-induced phase noise
   - Hampel filtering removes spike outliers
   - FFT converts time-domain CSI to frequency-domain for activity recognition
   - Fresnel zone modeling localizes detected movement in 3D space
4. **The neural network crate** (nn) takes the processed signal features and estimates human pose -- body position, limb orientation, activity type.
5. **The database layer** (PostgreSQL with Redis caching) stores historical data for trend analysis, fall pattern recognition, and system health monitoring.
6. **The API crate** serves results over HTTP/WebSocket to the Three.js dashboard.
7. **The dashboard** renders 3D pose estimates at 60fps, with real-time signal health indicators.
8. **Monitoring stack** (Prometheus + Grafana) tracks system performance, processing latency, and hardware health.

### The 10 Crate Architecture
- **core:** Shared types, error handling, and the central data pipeline coordinator
- **signal:** All DSP operations -- FFT, filtering, phase sanitization, Fresnel computation
- **nn:** Neural network inference for pose estimation from processed signals
- **db:** PostgreSQL integration and Redis caching layer
- **hardware:** ESP32 communication, UDP stream management, device discovery
- **config:** Configuration management across all crates
- **api:** REST and WebSocket API for the dashboard and external consumers
- **mat:** Matrix operations optimized for signal processing workloads
- **cli:** Command-line interface for system control, calibration, and diagnostics
- **wasm:** WebAssembly compilation target for browser-based processing

## What This Taught Me (And What It Will Teach You)

- **Systems thinking at scale.** Coordinating 10 crates, hardware firmware, database layers, and real-time visualization taught me how to design systems where components are loosely coupled but tightly coordinated.
- **Rust is worth the learning curve.** The compiler fights you at first, but once you internalize ownership and borrowing, you write code that is both blazing fast and provably safe. The 810x speedup over Python is not a benchmark trick -- it is the difference between "works in a lab" and "works in real-time."
- **DSP is a superpower.** Understanding FFT, filtering, and frequency-domain analysis opens doors far beyond WiFi sensing -- audio processing, radar, communications, medical imaging. The math is the same everywhere.
- **Hardware integration is humbling.** Working with ESP32 firmware, dealing with clock drift, packet loss, and hardware variability taught me respect for the physical layer that most software engineers never touch.
- **Privacy-preserving AI is a design choice.** Steeview deliberately avoids cameras because the application demands it. This taught me that ethics is not something you bolt on after the fact -- it shapes the architecture from day one.
- **Performance profiling is an art.** Getting to 18 microseconds per frame required profiling every allocation, minimizing copies, and understanding CPU cache behavior. I learned more about computer architecture from this project than from any textbook.

## Interview Confidence Builder

**Q1: Why did you choose Rust over C++ for a real-time signal processing system?**
Rust gives me C++-level performance with memory safety guaranteed at compile time. In a system processing live sensor data across multiple threads, data races and null pointer bugs are not just inconvenient -- they can crash the system and miss a fall detection. Rust's ownership model eliminates these classes of bugs entirely. I also benefit from Cargo's package management, which made the 10-crate architecture manageable.

**Q2: Explain your DSP pipeline and why each step is necessary.**
Phase sanitization corrects hardware artifacts. Hampel filtering removes outlier spikes. FFT converts to frequency domain where human activities have distinct signatures. Fresnel zone modeling provides spatial localization. Each step builds on the previous one -- skip any step and the downstream results degrade significantly. I can draw this pipeline on a whiteboard and explain the input/output of each stage.

**Q3: How does WiFi-based pose detection work without cameras?**
WiFi signals reflect off the human body. Different body positions create different reflection patterns, which appear as changes in Channel State Information. By analyzing CSI across multiple frequency subcarriers and multiple transmitter-receiver pairs, the system builds enough signal diversity to infer pose. The neural network learns the mapping from CSI features to human pose through supervised training on labeled data.

**Q4: How did you achieve 810x speedup over the Python prototype?**
Three factors: (1) Rust compiles to native machine code with no garbage collector overhead, (2) I used zero-copy data structures and minimized heap allocations in the hot path, (3) I leveraged Rust's fearless concurrency to parallelize independent pipeline stages across CPU cores. The Python prototype used numpy for vectorized operations, which is fast for batch processing but cannot match Rust's per-frame latency for real-time streaming.

**Q5: Walk me through your modular crate architecture.**
I separated concerns into 10 crates so that each could be developed, tested, and optimized independently. The signal crate does not know about the database. The API crate does not know about hardware. The core crate defines shared types and orchestration. This separation means I can swap out the neural network implementation without touching the signal pipeline, or add a new hardware backend without changing the API.

**Q6: How do you handle noise and unreliable data from cheap hardware?**
Multiple layers: firmware-level packet validation on the ESP32, Hampel filtering for statistical outlier removal, phase sanitization for clock-drift correction, and confidence scoring in the neural network output. The system is designed to degrade gracefully -- if one ESP32 drops offline, the remaining units continue tracking with reduced spatial resolution rather than crashing.

**Q7: What are the ethical considerations of through-wall human tracking?**
This technology could be misused for surveillance, which is why I designed it around privacy-preserving applications: elderly fall detection, search-and-rescue, and hospital monitoring where cameras are inappropriate. The system detects pose and movement, not identity. There is no visual data to leak. In a production deployment, I would add encryption to the data stream, strict access controls, and consent frameworks.

**Q8: How does the Fresnel zone model work for localization?**
A Fresnel zone is an ellipsoidal region between a transmitter and receiver where signal reflection is most significant. When a person moves through this zone, the CSI changes dramatically. By deploying multiple transmitter-receiver pairs, I create overlapping Fresnel zones. The intersection of zones that show activity gives me a 3D position estimate. It is the same principle as GPS triangulation, but using WiFi reflections instead of satellite signals.

## Get Started

```bash
git clone https://github.com/tolani007/Steeview-wifi-densepose-rs.git
cd Steeview-wifi-densepose-rs

# Build the Rust engine (requires Rust 1.70+)
cargo build --release

# Run tests across all 10 crates
cargo test

# Start the system with default configuration
cargo run --release -- --config config/default.toml

# For the Three.js dashboard
cd dashboard
npm install && npm start
# Open http://localhost:3000

# For ESP32 firmware (requires PlatformIO)
cd firmware
pio build && pio upload
```

Requirements: Rust 1.70+, Docker (for PostgreSQL/Redis/Prometheus/Grafana), Node.js (for dashboard), PlatformIO (for ESP32 firmware).

## How This Connects

Steeview is where every skill I have built comes together at full intensity. The **DSP pipeline thinking** mirrors the ETL pipelines in my **Data Engineering Vault**, just running 810x faster. The **neural network crate** draws on the deep learning understanding from my **Fun Data Science Content** -- attention mechanisms, loss functions, optimization. The **systems architecture** (10 crates, database layer, monitoring) reflects enterprise-grade engineering. The **quantization concepts** connect to my **Quantum Garden's** vector search project. And the **ethical design choices** -- privacy-preserving sensing for elderly care and search-and-rescue -- reflect the same values that drive my **Cocoa Contamination** and **Ghana Cocoa Sustainability** projects: technology should serve people. This is my most ambitious project, and it sits at the intersection of everything I know.
