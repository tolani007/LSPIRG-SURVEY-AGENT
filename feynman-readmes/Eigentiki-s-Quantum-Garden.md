# Eigentiki's Quantum Garden
> My personal journey into quantum computing -- where I plant intuitions about qubits, grow understanding of quantum gates, and harvest real projects like a quantized vector search engine for government websites.

## What I Built (and Why You Should Care)

I started this quantum garden in February 2026 because I realized something: quantum computing is not the future anymore. It is the present. Companies like IBM, Google, and Amazon are building quantum hardware right now, and the engineers who understand both classical and quantum computing will have a massive edge in the next decade. But most quantum resources are either too academic (pages of Dirac notation with no intuition) or too hand-wavy ("it is like being in two places at once!"). I wanted something in between -- rigorous enough to be correct, but explained simply enough that my past self could have understood it on the first read.

So I started working through MIT's quantum computing course, building notebooks for each concept, and writing Feynman-technique explanations for the ideas that tripped me up. The Deutsch-Jozsa algorithm, the CHSH inequality, quantum information formulation -- each one gets its own notebook with code, math, and plain-English reasoning. I also wrote a full Feynman explanation of the Z Gate that I am particularly proud of.

But I did not stop at theory. I built a **quantized vector search tool** for Ontario government websites. I scraped government pages, created text embeddings, and then applied a quantization trick -- scaling decimal values by 100 and storing them as integers -- to get 4x memory compression. The result is a semantic search engine that runs on Google Colab with minimal resources. That project is where quantum-inspired thinking meets practical engineering: quantization is a bridge concept that appears in both classical ML deployment and quantum computing.

## The Core Concepts - Explained Simply

### Qubits -- The Quantum Bit
A classical bit is like a light switch: it is either ON (1) or OFF (0). A qubit is like a dimmer switch that can be anywhere between fully off and fully on -- and it stays in that blended state until you actually look at it. Mathematically, a qubit is |psi> = alpha|0> + beta|1>, where alpha and beta are complex numbers whose squared magnitudes give the probability of measuring 0 or 1. The key insight: the qubit is not secretly 0 or 1 before measurement. It genuinely exists in a combination of both states. This is **superposition**, and it is not just weird philosophy -- it is the computational resource that makes quantum algorithms powerful.

### Dirac Notation (Bra-Ket Notation)
Dirac notation scared me at first, but it is actually just a compact way to write vectors. |0> is a column vector [1, 0]. |1> is [0, 1]. The "ket" |psi> is a state vector. The "bra" <psi| is its conjugate transpose. When you write <phi|psi>, you are taking a dot product -- which gives you the probability amplitude of finding state |psi> in state |phi>. Once you see that bra-kets are just vectors and dot products in disguise, the notation stops being scary and starts being convenient.

### The Bloch Sphere
The Bloch sphere is a beautiful visualization tool. Since a single qubit state is defined by two angles (theta and phi, after factoring out a global phase), you can represent any qubit state as a point on the surface of a sphere. |0> is the north pole. |1> is the south pole. The equator holds superposition states like |+> and |->. Every quantum gate is a rotation on this sphere. The Bloch sphere turned abstract linear algebra into something I could actually picture, and my understanding accelerated from there.

### Quantum Gates (Hadamard, Z, S, T)
Quantum gates are the operations you perform on qubits -- they are to quantum computing what logic gates (AND, OR, NOT) are to classical computing. But instead of flipping bits, they rotate the state on the Bloch sphere.

- **Hadamard (H):** Takes |0> to an equal superposition of |0> and |1>. Think of it as the "coin flip" gate -- it creates uncertainty from certainty. It rotates the state 180 degrees around an axis halfway between X and Z on the Bloch sphere.
- **Z Gate:** Leaves |0> alone but flips the phase of |1> (multiplies by -1). On the Bloch sphere, this is a 180-degree rotation around the Z axis. Phase is invisible when you measure directly, but it becomes visible when you interfere states -- and that interference is the engine of quantum algorithms. I wrote a full Feynman-technique document on the Z gate because phase manipulation is the single most important concept in quantum computing.
- **S Gate:** A 90-degree rotation around Z. It is the square root of Z (apply S twice and you get Z).
- **T Gate:** A 45-degree rotation around Z. The T gate is special because it is the key ingredient for universal quantum computing -- with H, T, and CNOT, you can approximate any quantum operation to arbitrary precision.

### Entanglement
Imagine two coins that are magically linked: whenever one lands heads, the other always lands tails, no matter how far apart they are. That is entanglement. Formally, two qubits are entangled when the state of the combined system cannot be written as a product of individual qubit states. The Bell state (|00> + |11>)/sqrt(2) is the classic example -- measuring the first qubit as 0 instantly tells you the second is 0. This is not communication; it is correlation baked into the quantum state. The CHSH inequality notebook in this repo explores how entanglement produces correlations that are literally impossible in classical physics.

### The Deutsch-Jozsa Algorithm
This is the first quantum algorithm that blew my mind. Here is the setup: you have a black-box function that takes n bits and outputs 0 or 1. You are promised the function is either **constant** (same output for every input) or **balanced** (outputs 0 for exactly half the inputs and 1 for the other half). Classically, you might need to check 2^(n-1) + 1 inputs to be sure. The Deutsch-Jozsa algorithm does it in **one query** by exploiting superposition and interference. It puts all inputs into superposition simultaneously, runs the function once, and uses interference to amplify the answer. My notebook implements this step by step so you can watch the interference pattern emerge.

### Vector Quantization (The Ontario Government Search Tool)
This is where theory meets practice. I built a semantic search engine for Ontario government websites. The pipeline: scrape web pages, chunk the text, create embeddings (dense vector representations of meaning), then search by finding the closest embedding to a query. The twist: raw embeddings are 32-bit floats, which eat memory. I applied **quantization** -- multiplying by 100 and rounding to integers -- which compresses the embeddings to roughly 4x smaller with minimal accuracy loss. This is the same principle behind model quantization in production ML, and it connects beautifully to quantum computing where discrete state representations are fundamental.

## How It Actually Works - Step by Step

1. **Start with the fundamentals notebook** (`General_formulation_of_quantum_information.ipynb`). This sets up the mathematical framework: Hilbert spaces, state vectors, measurement probabilities.
2. **Move to the Z Gate explanation** (`Z_Gate_Feynman_Technique.docx`). Understanding phase is the gateway to understanding why quantum algorithms work. I explain it with analogies and step-by-step math.
3. **Work through Deutsch-Jozsa** (`Deutsch_Jozsa_Algorithm.ipynb`). This is where superposition and interference come together into your first real quantum speedup. Run each cell, modify the oracle function, and watch the output change.
4. **Explore the CHSH inequality** (`chsh_inequality.ipynb`). This proves that quantum mechanics allows correlations that classical physics cannot -- it is the experimental proof that entanglement is real and powerful.
5. **Try the quantized vector search tool.** This is the practical capstone. You will see how embeddings work, why quantization matters for deployment, and how semantic search actually functions end to end.

## What This Taught Me (And What It Will Teach You)

- **Quantum computing is linear algebra with attitude.** Once I stopped being intimidated by the notation and saw qubits as vectors and gates as matrices, everything opened up. If you know matrix multiplication, you can understand quantum computing.
- **Phase is the secret weapon.** Classical computing ignores phase entirely. Quantum computing runs on it. Understanding why the Z gate matters (even though it does not change measurement probabilities) was my biggest "aha" moment.
- **Interference is the engine.** Quantum algorithms work by making wrong answers destructively interfere (cancel out) and right answers constructively interfere (add up). Deutsch-Jozsa is the simplest example of this pattern.
- **Quantization bridges classical and quantum.** Working with discrete representations, managing precision-vs-efficiency trade-offs, and thinking about information compression -- these skills transfer directly between classical ML deployment and quantum computing.
- **Building projects cements understanding.** The Ontario government search tool forced me to connect theoretical concepts to real engineering constraints: memory, latency, accuracy. Theory without practice is sterile.
- **Curiosity is a competitive advantage.** Most engineers are not exploring quantum computing yet. By starting now, I am building intuitions that will compound as quantum hardware matures.

## Interview Confidence Builder

**Q1: Explain what a qubit is and how it differs from a classical bit.**
A classical bit is 0 or 1. A qubit is a linear combination of |0> and |1> with complex amplitudes. When you measure it, you get 0 or 1 with probabilities determined by the squared magnitudes of the amplitudes. The key difference: before measurement, the qubit genuinely exists in superposition, enabling parallel exploration of computational paths.

**Q2: What is quantum entanglement, and why is it useful?**
Entanglement is a correlation between qubits that cannot be described by treating each qubit independently. It is useful because it enables quantum algorithms to coordinate information across qubits without explicit communication. Teleportation, superdense coding, and error correction all rely on entanglement as a resource.

**Q3: Walk me through the Deutsch-Jozsa algorithm.**
Initialize n+1 qubits (n in |0>, one ancilla in |1>). Apply Hadamard to all qubits to create superposition. Apply the oracle function. Apply Hadamard again to the first n qubits. Measure. If all zeros, the function is constant; otherwise, it is balanced. The magic is in the interference pattern created by the oracle combined with the Hadamard transforms.

**Q4: What is vector quantization and why would you use it?**
Vector quantization maps continuous values to a discrete set of representatives. In my project, I scaled float embeddings by 100 and stored them as integers, achieving 4x memory compression. You use it when you need to store or search large embedding collections efficiently -- the accuracy loss is typically minimal for nearest-neighbor search tasks.

**Q5: How does the Hadamard gate create superposition?**
The Hadamard gate applies the matrix (1/sqrt(2)) * [[1,1],[1,-1]]. When applied to |0>, it produces (|0> + |1>)/sqrt(2) -- an equal superposition with 50/50 measurement probability. When applied to |1>, it produces (|0> - |1>)/sqrt(2) -- also 50/50, but with a relative phase difference. That phase difference is crucial for interference-based algorithms.

**Q6: What is the CHSH inequality and what does it demonstrate?**
The CHSH inequality sets an upper bound on the strength of correlations between measurements in classical physics (the bound is 2). Quantum mechanics violates this bound (achieving up to 2*sqrt(2)). This proves that quantum correlations are fundamentally stronger than any classical model can produce -- they cannot be explained by "hidden variables."

**Q7: How would you explain the concept of quantum phase to a non-technical person?**
Think of two waves in the ocean. If their peaks align (in phase), they combine into a bigger wave. If one's peak meets the other's trough (out of phase), they cancel out. Quantum computing works by carefully arranging phases so that wrong answers cancel and right answers reinforce. The Z gate is the tool that flips a wave's phase, setting up these cancellations.

## Get Started

```bash
git clone https://github.com/tolani007/Eigentiki-s-Quantum-Garden.git
cd Eigentiki-s-Quantum-Garden

# Install dependencies
pip install qiskit numpy jupyter

# Start with the quantum information formulation
jupyter notebook General_formulation_of_quantum_information.ipynb

# Then explore Deutsch-Jozsa for your first quantum algorithm
jupyter notebook Deutsch_Jozsa_Algorithm.ipynb

# Read the Z Gate Feynman explanation for deep phase intuition
# Z_Gate_Feynman_Technique.docx
```

## How This Connects

This quantum garden grows from the same soil as everything else I build. The **linear algebra instincts** I developed in my **Fun Data Science Content** repo (attention mechanisms, loss functions, gradient math) translate directly to quantum state manipulation -- it is all matrices and vectors. The **quantized vector search** project uses the same embedding and search patterns from my **Instacart recommendation** work, just with a quantization twist. The **engineering discipline** I built in my **Data Engineering Vault** (clean pipelines, reproducible results, defensive coding) keeps my quantum experiments organized and trustworthy. And the **Feynman teaching approach** that started in my data science notebooks has become my signature style here -- if I cannot explain a quantum concept simply, I keep working until I can.
