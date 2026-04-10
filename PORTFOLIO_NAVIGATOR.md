# Eigentiki's Learning Universe

**A living map of every project, every experiment, and every rabbit hole -- organized into paths you can actually follow.**

---

> *"The best way to learn something is to build it, break it, and then explain it to someone else."*

---

## Who Am I

Hey, I'm Tolani -- most people online know me as **Eigentiki**. I'm a builder, learner, and perpetual tinkerer based in Canada, working at the intersection of machine learning, data engineering, and creative technology.

I love football (the real kind -- the one you play with your feet), quantum computing, Rust, and figuring out how things work from first principles. I believe the best portfolio isn't a resume -- it's a trail of things you've actually built, broken, and shipped.

This document is that trail, organized so you (or future-me) can walk it in a way that makes sense.

Find me on Twitter/X: [@tolaniakinola_](https://twitter.com/tolaniakinola_)
GitHub: [tolani007](https://github.com/tolani007)

---

## How to Navigate This Document

This portfolio is organized into **9 learning paths** plus a bonus section. Each path is a curated sequence -- repos are listed in the order that builds the most understanding, not the order I created them.

**A few things to know:**

- **ORIGINAL** repos are projects I built from scratch. These are where my thinking lives.
- **FORKED** repos are resources I studied, completed, or extended. I don't fork things I haven't worked through.
- Some repos appear in more than one path. That's intentional -- real skills don't fit neatly into one box.
- Each path ends with a "Skills You'll Gain" and "Interview Topics This Covers" section, so you can target what matters most to you right now.

If you're not sure where to start, skip to the [Start Here](#start-here--pick-your-path) section at the bottom.

---

## Table of Contents

| # | Path | Focus |
|---|------|-------|
| 1 | [Python & Data Science Foundations](#path-1-python--data-science-foundations) | The starting line |
| 2 | [Machine Learning -- From Theory to Production](#path-2-machine-learning--from-theory-to-production) | Algorithms, research, real models |
| 3 | [Sports Analytics & Football Intelligence](#path-3-sports-analytics--football-intelligence) | Data meets the beautiful game |
| 4 | [Computer Vision & Object Detection](#path-4-computer-vision--object-detection) | Teaching machines to see |
| 5 | [Data Engineering & DevOps](#path-5-data-engineering--devops) | Pipelines, containers, infra |
| 6 | [AI Agents & LLM Engineering](#path-6-ai-agents--llm-engineering) | Intelligence that acts |
| 7 | [Systems Programming & Edge Computing](#path-7-systems-programming--edge-computing) | When Python isn't fast enough |
| 8 | [Quantum Computing](#path-8-quantum-computing) | The frontier |
| 9 | [Interview Prep & System Design](#path-9-interview-prep--system-design) | Talk about what you've built |
| + | [Bonus: Creative & Personal Projects](#bonus-creative--personal-projects) | Because building should be fun |

---

## PATH 1: Python & Data Science Foundations

*"Start here. This is where the journey begins."*

Every serious technical career starts with the fundamentals -- loading data, cleaning it, understanding it, and telling a story with it. This path walks through progressively richer data science work, from Excel warmups to full notebook explorations with transformers, PySpark, and computer vision.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [Quick-data-analysis-project-to-warm-up-my-excel-skills](https://github.com/tolani007/Quick-data-analysis-project-to-warm-up-my-excel-skills) | Financial statement data analysis task from a team lead. Excel skills warmup. | Original | Excel |
| 2 | [Data-Cleaning-Practical-Examples](https://github.com/tolani007/Data-Cleaning-Practical-Examples) | Data cleaning in Python and Julia with practical examples. | Forked | Python / Julia |
| 3 | [Fun-Data-Science-Content-from-Tiki](https://github.com/tolani007/Fun-Data-Science-Content-from-Tiki) | A mosaic of data science content: transformers, attention, PySpark, SQL, YOLO, Adam optimizer, GRU cells. 34 items across notebooks, PDFs, and implementations. Includes Feynman-style explanations and interview drills. | Original | Jupyter Notebook |
| 4 | [ascii_art_converter](https://github.com/tolani007/ascii_art_converter) | ASCII art converter. | Original | Jupyter Notebook |

**Skills You'll Gain:**
- Data loading, inspection, and cleaning in Python and Julia
- Exploratory data analysis and financial data interpretation
- Working with pandas, PySpark, and SQL
- Understanding core ML building blocks (attention mechanisms, optimizers, GRU cells)
- Jupyter Notebook fluency and storytelling with data

**Interview Topics This Covers:**
- "Walk me through how you'd clean a messy dataset."
- "Explain the attention mechanism in transformers."
- "What's the difference between batch, mini-batch, and stochastic gradient descent?"
- "How do you handle missing values and outliers?"
- "Describe a time you did exploratory data analysis on a real business problem."

---

## PATH 2: Machine Learning -- From Theory to Production

*"You don't just learn ML, you build it from the ground up."*

This is the big one. It starts with algorithms implemented from scratch, moves through foundational research papers, then into real predictive models with feature engineering, interpretability, and deployment. By the end, you'll understand the full arc from theory to production ML systems.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [Ml-algorithms-from-scratch-that-I-binged](https://github.com/tolani007/Ml-algorithms-from-scratch-that-I-binged) | Fork of TheAlgorithms/Python. 40+ directories of algorithms: sorting, searching, data structures, neural networks, cryptography, quantum computing, blockchain. | Forked | Python |
| 2 | [A-Curated-List-of-Must-Read-ML-Research-Papers](https://github.com/tolani007/A-Curated-List-of-Must-Read-ML-Research-Papers) | Comprehensive ML research paper collection. | Forked | -- |
| 3 | [cs249r_book](https://github.com/tolani007/cs249r_book) | "Introduction to Machine Learning Systems" textbook. | Forked | -- |
| 4 | [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor) | ML model predicting Premier League match outcomes. XGBoost, Random Forest, Logistic Regression. Features: rolling averages, Elo ratings, SHAP interpretability, win/loss streaks, head-to-head stats. | Original | Jupyter Notebook |
| 5 | [Cocoa-Contamination-Artificial-Intelligence-Detector](https://github.com/tolani007/Cocoa-Contamination-Artificial-Intelligence-Detector) | AI workflow for detecting and classifying cocoa leaf diseases. | Original | Jupyter Notebook |
| 6 | [instacart-grocery-recommendation-project](https://github.com/tolani007/instacart-grocery-recommendation-project) | Recommendation system using a large Instacart dataset. | Original | Jupyter Notebook |
| 7 | [instacart-customer-behaviour-prediction](https://github.com/tolani007/instacart-customer-behaviour-prediction) | Predicting customer lifetime value and behavior segmentation. | Original | Python |
| 8 | [MLOps-Basics](https://github.com/tolani007/MLOps-Basics) | MLOps fundamentals. | Forked | Jupyter Notebook |
| 9 | [ml-practical-usecases-for-Tiki-s-ml-work-experience-](https://github.com/tolani007/ml-practical-usecases-for-Tiki-s-ml-work-experience-) | 450 ML system design case studies from 100+ companies. | Forked | -- |

**Skills You'll Gain:**
- Implementing ML algorithms from scratch (not just calling sklearn)
- Reading and contextualizing ML research papers
- Feature engineering: rolling averages, Elo ratings, temporal features
- Model interpretability with SHAP
- Ensemble methods (XGBoost, Random Forest) and when to use them
- Recommendation systems and customer behavior modeling
- MLOps: model versioning, CI/CD for ML, experiment tracking
- Understanding ML system design at production scale

**Interview Topics This Covers:**
- "Implement logistic regression from scratch."
- "How does XGBoost differ from Random Forest?"
- "Explain SHAP values and why interpretability matters."
- "Design a recommendation system for an e-commerce platform."
- "How would you take a model from notebook to production?"
- "What's your approach to feature engineering for time-series data?"
- "Describe the MLOps lifecycle."

---

## PATH 3: Sports Analytics & Football Intelligence

*"Where data science meets the beautiful game."*

This is what happens when you bring a data scientist's toolkit to the sport you love. Web scraping, statistical storytelling, predictive modeling, and even computer vision -- all applied to football. If you want to see how domain expertise amplifies technical skill, this is the path.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [ScrapingFBREF](https://github.com/tolani007/ScrapingFBREF) | Python web scraper for Premier League stats from FBref. Flask web UI, rate limiting, checkpoint system. | Original | Python |
| 2 | [epl-dribbbling-analysis](https://github.com/tolani007/epl-dribbbling-analysis) | Data story analyzing top dribblers in the EPL (March 2023). | Original | Python |
| 3 | [epl-goalscoring-analysis-march-2023](https://github.com/tolani007/epl-goalscoring-analysis-march-2023) | Visualizations of goalscoring metrics for EPL attackers (March 2023). | Original | Python |
| 4 | [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor) | ML prediction model for Premier League matches (see Path 2 for full details). | Original | Jupyter Notebook |
| 5 | [football-player-object-detection-model-by-Eigentiki-and-OJ-](https://github.com/tolani007/football-player-object-detection-model-by-Eigentiki-and-OJ-) | Soccer player tracking CV model built in one day. OpenCV, NumPy, Pillow. Webcam-based detection. Built with collaborator "OJ". | Original | Python |

**Skills You'll Gain:**
- Web scraping with BeautifulSoup4, requests, and rate limiting
- Building Flask web interfaces for data tools
- Sports-specific data visualization and statistical storytelling
- Applying ML to real-world prediction problems with domain context
- Computer vision for sports tracking (OpenCV)
- Collaborative development under time constraints

**Interview Topics This Covers:**
- "How do you approach scraping data from websites ethically and reliably?"
- "Walk me through a data storytelling project you're proud of."
- "How did you choose features for your prediction model?"
- "Describe a project where domain expertise changed your technical approach."
- "How do you handle rate limiting and checkpointing in data pipelines?"

---

## PATH 4: Computer Vision & Object Detection

*"Teaching machines to see what humans see."*

From a webcam-based football tracker built in a day to state-of-the-art detection architectures, this path covers the visual intelligence stack. You'll see both the hands-on "ship it now" mindset and the deeper research behind modern object detection.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [football-player-object-detection-model-by-Eigentiki-and-OJ-](https://github.com/tolani007/football-player-object-detection-model-by-Eigentiki-and-OJ-) | Soccer player detection with OpenCV, NumPy, Pillow. Webcam-based, built in one day. | Original | Python |
| 2 | [rf-detr](https://github.com/tolani007/rf-detr) | RF-DETR: real-time object detection and segmentation model. | Forked | Python |
| 3 | [noah-research](https://github.com/tolani007/noah-research) | Noah Research. | Forked | Python |

**Skills You'll Gain:**
- OpenCV fundamentals and real-time image processing
- Object detection pipeline design
- Understanding modern detection architectures (DETR family)
- Rapid prototyping of CV systems
- Research-grade computer vision implementations

**Interview Topics This Covers:**
- "Explain the difference between one-stage and two-stage detectors."
- "How does the DETR architecture work?"
- "Walk me through building a real-time detection system."
- "What trade-offs do you consider between accuracy and latency in CV?"

---

## PATH 5: Data Engineering & DevOps

*"Building the pipelines that make everything else possible."*

Models are worthless without infrastructure. This path covers the full stack beneath the ML layer: Linux fundamentals, containerization with Docker and Kubernetes, cloud orchestration on AWS, ETL pipeline design, and Snowflake. These are the skills that make you the person who can actually ship things.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [linux-basics-course](https://github.com/tolani007/linux-basics-course) | Linux fundamentals course (completed). | Forked | Shell |
| 2 | [docker-samples-voting-app](https://github.com/tolani007/docker-samples-voting-app) | Docker Compose practice. | Forked | JavaScript |
| 3 | [certified-kubernetes-administrator-course](https://github.com/tolani007/certified-kubernetes-administrator-course) | Kubernetes admin course (completed). | Forked | Shell |
| 4 | [amazon-elastic-kubernetes-service-course](https://github.com/tolani007/amazon-elastic-kubernetes-service-course) | AWS EKS course (completed). | Forked | HCL |
| 5 | [Data-Engineering-vault](https://github.com/tolani007/Data-Engineering-vault) | 4 data engineering challenges + 1 notebook: boticario-br-challenge, home-credit-risk-engine, privia-health-challenge, prospa-etl-challenge, Gordon_Food_Service_Solution_drill.ipynb. | Original | Python / Jupyter / HTML / CSS |
| 6 | [sfguide-declarative-pipelines-dynamic-tables](https://github.com/tolani007/sfguide-declarative-pipelines-dynamic-tables) | Snowflake declarative pipelines with dynamic tables. | Forked | PLpgSQL |
| 7 | [Data-engineering-tasks-completed-by-Tiki-](https://github.com/tolani007/Data-engineering-tasks-completed-by-Tiki-) | Completed engineering interview challenges. | Forked | Python |

**Skills You'll Gain:**
- Linux command line proficiency
- Docker containerization and multi-service orchestration with Docker Compose
- Kubernetes administration and deployment strategies
- AWS EKS and cloud-native infrastructure (Terraform/HCL)
- ETL pipeline design and implementation
- Snowflake and modern data warehouse patterns
- Solving real data engineering interview challenges end-to-end

**Interview Topics This Covers:**
- "Explain Docker networking and multi-container orchestration."
- "How do Kubernetes pods, services, and deployments work?"
- "Design an ETL pipeline for [X] use case."
- "What's the difference between batch and streaming data pipelines?"
- "How would you set up CI/CD for a data pipeline?"
- "Describe your experience with cloud infrastructure and IaC."

---

## PATH 6: AI Agents & LLM Engineering

*"Building intelligence that acts, not just responds."*

This is the bleeding edge. Starting with building an LLM from scratch (yes, literally from scratch), this path moves through agent frameworks, LangChain, MCP servers, token-efficient formats, and culminates in a production agent system. If you want to understand what comes after chatbots, walk this path.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [llm_from_scratch](https://github.com/tolani007/llm_from_scratch) | Building an LLM from scratch. "On Monday October 13th tikidata started building an LLM from fucking scratch." | Forked | Python |
| 2 | [ai-agents-lessons-for-Tiki](https://github.com/tolani007/ai-agents-lessons-for-Tiki) | 12 lessons to get started building AI agents. | Forked | Jupyter Notebook |
| 3 | [langchain](https://github.com/tolani007/langchain) | Build context-aware reasoning applications. | Forked | Python |
| 4 | [agency-agents](https://github.com/tolani007/agency-agents) | A complete AI agency at your fingertips. | Forked | Shell |
| 5 | [everything-claude-code](https://github.com/tolani007/everything-claude-code) | Agent harness performance optimization system. | Forked | JavaScript |
| 6 | [unusual-whales-mcp](https://github.com/tolani007/unusual-whales-mcp) | MCP server for Unusual Whales API -- options flow, dark pool data. | Forked | TypeScript |
| 7 | [Token-Oriented-Object-Notation-](https://github.com/tolani007/Token-Oriented-Object-Notation-) | TOON format for LLMs. | Forked | TypeScript |
| 8 | [Token-efficient-Structured-Object-Notation-](https://github.com/tolani007/Token-efficient-Structured-Object-Notation-) | TSON format for LLMs. | Forked | Python |
| 9 | [LSPIRG-SURVEY-AGENT](https://github.com/tolani007/LSPIRG-SURVEY-AGENT) | QR-coded event survey agent with AI sentiment analysis (Groq), auto-close, email delivery. n8n + Google Forms + Telegram. $0/month. | Original | JavaScript / Shell |

**Skills You'll Gain:**
- Transformer architecture from the ground up (attention, positional encoding, training loops)
- Agent design patterns: planning, tool use, memory, reflection
- LangChain and context-aware application development
- Model Context Protocol (MCP) server implementation
- Token-efficient serialization formats for LLM I/O
- Prompt engineering and agent harness optimization
- Building production agent systems with zero infrastructure cost

**Interview Topics This Covers:**
- "Explain the transformer architecture from first principles."
- "What's the difference between a chatbot and an AI agent?"
- "How would you design an agent that can use external tools?"
- "What is MCP and why does it matter for LLM applications?"
- "How do you optimize token usage in LLM-powered systems?"
- "Describe a production system you built using LLMs."

---

## PATH 7: Systems Programming & Edge Computing

*"When Python isn't fast enough, you go deeper."*

This path is for when you need real performance. GPU programming with CUDA, systems-level Rust, and a project that achieves an 810x speedup over Python by tracking human poses through walls using WiFi signals. This is where software engineering meets physics.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [cuda-course](https://github.com/tolani007/cuda-course) | Comprehensive CUDA course for FreeCodeCamp. GPU kernel optimization, cuBLAS, cuDNN, Triton, PyTorch CUDA extensions. 83% CUDA code. | Forked | CUDA / Python |
| 2 | [ruview](https://github.com/tolani007/ruview) | WiFi DensePose reference implementation. | Forked | Rust |
| 3 | [Steeview-wifi-densepose-rs](https://github.com/tolani007/Steeview-wifi-densepose-rs) | HIGH-PERFORMANCE Rust tracking system. Extracts Channel State Information from WiFi to detect human poses through walls without cameras. 810x speedup over Python. 10 Rust crates, ESP32 firmware (C++), Three.js dashboard, Docker/PostgreSQL/Redis/Prometheus/Grafana. Tracks up to 3 people simultaneously. 18 microseconds per frame. | Original | Rust / C++ / JavaScript |

**Skills You'll Gain:**
- GPU programming: CUDA kernels, memory hierarchy, optimization patterns
- cuBLAS, cuDNN, Triton, and PyTorch CUDA extensions
- Rust for high-performance systems (crates, async, FFI)
- Signal processing and Channel State Information extraction
- ESP32 embedded firmware development
- Full observability stack: Prometheus, Grafana, Redis
- Performance engineering and benchmarking (achieving 810x speedups)

**Interview Topics This Covers:**
- "Explain GPU memory hierarchy and how it affects kernel performance."
- "Why would you choose Rust over C++ for a performance-critical system?"
- "How do you profile and optimize a compute-heavy pipeline?"
- "Describe a system where you achieved significant performance gains."
- "What's your experience with embedded systems and IoT?"
- "How do you design for observability in a real-time system?"

---

## PATH 8: Quantum Computing

*"The frontier of computation."*

This is the newest frontier in the portfolio. Starting from qubits and superposition, working through quantum gates and the Bloch sphere, and building toward practical applications like quantized vector search. Quantum is where curiosity meets the future.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [Eigentiki-s-Quantum-Garden](https://github.com/tolani007/Eigentiki-s-Quantum-Garden) | Quantum computing learning journey (started Feb 2026). MIT course lectures, problem sets. Topics: qubits, superposition, quantum gates (Hadamard, Z, S, T), Bloch sphere, Dirac notation, Deutsch-Jozsa Algorithm, CHSH inequality. Also includes a quantized vector search tool for Ontario government websites. | Original | Jupyter Notebook |
| 2 | [qiskit-ibm-runtime](https://github.com/tolani007/qiskit-ibm-runtime) | IBM Client for Qiskit Runtime. | Forked | Python |

**Skills You'll Gain:**
- Quantum computing fundamentals: qubits, superposition, entanglement
- Quantum gate operations (Hadamard, Pauli, Phase gates)
- Bloch sphere visualization and Dirac notation
- Key quantum algorithms (Deutsch-Jozsa, foundations for Shor's and Grover's)
- Qiskit programming and IBM Quantum hardware interaction
- Applying quantum concepts to practical search problems

**Interview Topics This Covers:**
- "Explain superposition and entanglement in your own words."
- "What is the Deutsch-Jozsa algorithm and why does it matter?"
- "How does a quantum computer differ from a classical computer architecturally?"
- "What are the current practical limitations of quantum computing?"
- "Describe the CHSH inequality and its significance."

---

## PATH 9: Interview Prep & System Design

*"You're already building cool stuff. Now let's make sure you can talk about it."*

Building things is half the battle. The other half is communicating what you built, why you built it that way, and how it would work at scale. This path covers algorithmic problem-solving patterns, data structure fluency, and hundreds of real-world ML system design case studies from companies that are actually hiring.

| # | Repository | Description | Type | Language |
|---|-----------|-------------|------|----------|
| 1 | [leetcode-patterns](https://github.com/tolani007/leetcode-patterns) | A pattern-based approach to technical interview questions. | Forked | JavaScript |
| 2 | [My-leetcode-data-structure-and-algorithm-hobby-](https://github.com/tolani007/My-leetcode-data-structure-and-algorithm-hobby-) | Personal documentation of DS&A coding practice. | Original | Python |
| 3 | [a-curated-list-of-ml-system-design-case-studies](https://github.com/tolani007/a-curated-list-of-ml-system-design-case-studies) | 300+ case studies from 80+ companies on ML system design. | Forked | -- |
| 4 | [ml-practical-usecases-for-Tiki-s-ml-work-experience-](https://github.com/tolani007/ml-practical-usecases-for-Tiki-s-ml-work-experience-) | 450 ML system design case studies from 100+ companies. | Forked | -- |

**Skills You'll Gain:**
- Pattern recognition for algorithmic problems (sliding window, two pointers, BFS/DFS, dynamic programming)
- Data structure selection and trade-off analysis
- ML system design at scale (feature stores, model serving, A/B testing, feedback loops)
- Communicating technical decisions clearly and concisely
- Understanding how real companies build and deploy ML systems

**Interview Topics This Covers:**
- "Solve this coding problem and explain your approach."
- "Design a recommendation system that serves 10M users."
- "How would you build a real-time fraud detection pipeline?"
- "What are the trade-offs between online and batch prediction?"
- "Walk me through the ML system design for [any major tech company use case]."
- "How do you monitor model performance in production?"

---

## BONUS: Creative & Personal Projects

*"Because building cool stuff should also be fun."*

Not everything has to optimize a loss function. These projects show range, personality, and the kind of creative energy that makes engineering joyful.

| Repository | Description | Type | Language |
|-----------|-------------|------|----------|
| [neon-tic-tac-toe](https://github.com/tolani007/neon-tic-tac-toe) | Enterprise-grade neon Tic-Tac-Toe with purple liquid background, chromatic aberration, 3D parallax, emoji companion, Web Audio space drone. | Original | Node.js / Three.js / Express |
| [Eigentiki-library](https://github.com/tolani007/Eigentiki-library) | Curated digital garden of books, papers, and essays. Ethereal minimalism aesthetic. | Original | React 19 / Tailwind CSS 4 / Vite |
| [BrilliantEigentikiData2025](https://github.com/tolani007/BrilliantEigentikiData2025) | Interactive year-in-review visualization for Brilliant.org learning data. Duolingo-inspired animations, glassmorphism design. | Original | React 18 / Framer Motion / Recharts |
| [Python-Automated-Powerpoint-Presentation-for-my-little-sister-](https://github.com/tolani007/Python-Automated-Powerpoint-Presentation-for-my-little-sister-) | "I just wanted to make life a little easier for my little sister." Python automation for PowerPoint. | Original | Python |
| [ghana-cocoa-sustainability](https://github.com/tolani007/ghana-cocoa-sustainability) | Data investigation into cocoa yield and sustainable profitability. | Original | Jupyter Notebook |
| [care-count-starter](https://github.com/tolani007/care-count-starter) | Python project. | Original | Python |
| [app-ideas](https://github.com/tolani007/app-ideas) | Collection of app ideas for skill improvement. | Forked | -- |
| [AI-roadmap](https://github.com/tolani007/AI-roadmap) | AI learning roadmap from Twitter user @lochan_twt. | Forked | -- |

---

## Start Here -- Pick Your Path

Not sure where to begin? Here's what I'd recommend based on where you are:

**"I'm just getting started with data and Python."**
Start with **Path 1: Python & Data Science Foundations**. Work through each repo in order. By the end, you'll have the fundamentals to tackle anything else in this portfolio.

**"I want to build real ML models, not just follow tutorials."**
Go straight to **Path 2: Machine Learning -- From Theory to Production**. Start with the algorithms-from-scratch repo, then jump to EPL-WinPredictor to see a full applied project with feature engineering and interpretability.

**"I'm a football fan and I want to see data science in action."**
**Path 3: Sports Analytics & Football Intelligence** was made for you. It's the most fun path and shows how domain expertise makes you a better data scientist.

**"I need to level up my engineering and infrastructure skills."**
**Path 5: Data Engineering & DevOps** will take you from Linux basics through Kubernetes and into real pipeline challenges. Pair it with **Path 7: Systems Programming** if you want to go deep on performance.

**"I want to understand the AI agent / LLM wave."**
**Path 6: AI Agents & LLM Engineering** starts from building an LLM from scratch and works up to production agent systems. This is the path that's most relevant to where the industry is heading right now.

**"I have an interview coming up."**
Start with **Path 9: Interview Prep & System Design** for direct preparation, but don't skip the project-based paths -- the best interview answers come from things you've actually built.

**"I want to work on something nobody else is working on."**
**Path 7: Systems Programming** (especially Steeview -- tracking people through walls with WiFi and Rust) and **Path 8: Quantum Computing** are the frontier paths. They're harder, weirder, and more exciting.

**"I just want to see the coolest things you've built."**
Check out these three:
- [Steeview-wifi-densepose-rs](https://github.com/tolani007/Steeview-wifi-densepose-rs) -- 810x speedup, tracks humans through walls
- [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor) -- ML meets the Premier League
- [neon-tic-tac-toe](https://github.com/tolani007/neon-tic-tac-toe) -- the most overengineered Tic-Tac-Toe you've ever seen

---

## Feynman-Technique Deep-Dive READMEs

Throughout this portfolio, I use the Feynman technique: if you can't explain something simply, you don't understand it well enough.

You'll find detailed Feynman-style breakdowns of key projects in the **`feynman-readmes/`** folder of this repository. Each one takes a project from this portfolio and explains the core concepts as if you're teaching them to someone encountering the ideas for the first time -- no jargon walls, no hand-waving, just clear thinking.

Browse them here: [`feynman-readmes/`](./feynman-readmes/)

These are especially useful if you're preparing for interviews or trying to deepen your understanding of a topic before building on top of it.

---

*This document is a living thing. As I build more, it grows. Last organized: April 2026.*

*-- Tolani "Eigentiki" Akinola*
