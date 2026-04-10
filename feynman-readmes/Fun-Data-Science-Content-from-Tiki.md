# Fun Data Science Content from Tiki
> My personal mosaic of everything I have learned in data science -- from transformers to PySpark, loss functions to entropy -- explained the way I wish someone had explained them to me.

## What I Built (and Why You Should Care)

This repo is my brain, externalized. Every time I learn something new -- a concept, an algorithm, a mathematical insight -- I sit down and build a notebook that explains it from scratch. Not copying a textbook. Not pasting Stack Overflow answers. Actually working through the idea with code, math, and plain English until I can explain it to a friend over coffee. That is the Feynman technique, and this repo is 34 notebooks of it in action.

What you will find here is not a linear course. It is a mosaic. One notebook implements the self-attention mechanism from the Transformer paper by hand. Another walks through how the Adam optimizer actually works under the hood. There is a whole "Math Gym" series where I drill concepts like convexity, gradients, entropy, and Jensen's inequality -- the mathematical muscles that make everything else in ML click. I have PySpark projects for distributed computing, YOLO breakdowns for object detection, GRU implementations for sequence modeling, SQL tutorials, and daily Deep ML challenges that keep me sharp.

Why should you care? Because if you are preparing for ML interviews or trying to actually understand (not just use) deep learning, these notebooks are designed to take you from "I have heard of this concept" to "I can explain it, implement it, and defend my understanding under pressure." I wrote them for myself, but I wrote them as if I were teaching you.

## The Core Concepts - Explained Simply

### Self-Attention and Transformers
Here is the analogy that finally made attention click for me. Imagine you are at a party, and someone says: "The bank was steep near the river." Your brain automatically pays more **attention** to "river" to figure out that "bank" means a riverbank, not a financial institution. That is self-attention -- each word in a sentence looks at every other word and decides how much to "pay attention" to it for understanding context.

Mechanically, it works like this: every word gets three vectors -- a Query ("what am I looking for?"), a Key ("what do I have to offer?"), and a Value ("what information do I carry?"). You compute how well each Query matches each Key (dot product), scale it, apply softmax to get attention weights, and then use those weights to create a weighted sum of Values. The result is a new representation of each word that now "knows about" the rest of the sentence. In my notebook, I build this entire mechanism from raw matrix operations so you can see exactly where each number comes from.

### Loss Functions for Classification
A loss function is how your model knows it is wrong. Think of it like a coach yelling louder when the player is further from the goal. **Cross-entropy loss** is the most common one for classification, and here is how I think about it: if your model is 99% confident of the correct answer, the loss is tiny. If it is 99% confident of the WRONG answer, the loss is enormous. This asymmetry is what drives learning. My notebook walks through binary cross-entropy, categorical cross-entropy, and focal loss (which is cross-entropy with a twist that focuses training on hard-to-classify examples).

### The Adam Optimizer
Gradient descent is like rolling a ball downhill to find the lowest point in a valley. Basic gradient descent uses a fixed step size, which is clumsy -- too big and you overshoot, too small and you take forever. **Adam** is smarter. It keeps a running average of past gradients (momentum -- like the ball building up speed on a consistent slope) AND a running average of past squared gradients (adaptive learning rates -- like adjusting your step size based on how bumpy the terrain has been). The result is an optimizer that adapts to each parameter individually and converges faster. My notebook implements Adam from scratch, showing you each moving average update.

### GRU Cells (Gated Recurrent Units)
Think of a GRU like a note-taker with a smart eraser. As it reads a sequence (say, words in a sentence), it decides at each step: "How much of what I remember should I keep?" (the update gate) and "How much of this new input should I blend in?" (the reset gate). Unlike a basic RNN that just overwrites its memory at every step, a GRU can selectively remember long-term dependencies while still absorbing new information. I implement the gates from scratch in my notebook so you can trace exactly how information flows.

### PySpark and Distributed Computing
Imagine you need to count every word in every book in a library. Alone, it takes years. But if you hand each shelf to a different volunteer, and they all count simultaneously, then combine results -- that is distributed computing. **PySpark** is how I tell a cluster of machines to do this with data. My PySpark notebooks show the MapReduce paradigm in action: split the data, process in parallel, combine the results. The syntax looks like pandas, but under the hood, your data is spread across dozens of machines.

### YOLO (You Only Look Once) Object Detection
Most object detection systems work in two passes: first find regions that might contain objects, then classify each region. YOLO does it in a single pass -- it divides the image into a grid, and each grid cell simultaneously predicts bounding boxes and class probabilities. That is why it is fast enough for real-time video. My breakdown walks through how YOLO splits the image, how anchor boxes work, and how the loss function balances localization accuracy against classification accuracy.

### The Math Gym Series
This is where I sharpen the mathematical instincts that underpin all of ML. **Convexity** matters because convex loss functions have a single global minimum -- no getting trapped in local minima. **Gradients** are the compass that tells your optimizer which direction is "downhill." **Entropy** measures uncertainty -- a fair coin has maximum entropy, a loaded coin has less. **Jensen's inequality** connects convexity to expectation and shows up everywhere from information theory to variational inference. Each notebook starts with intuition, builds to formal definitions, and ends with practical implications for ML.

### SQL for Data Science
SQL is not glamorous, but it is the skill that gets you hired. My SQL tutorials cover the patterns that come up again and again in interviews: window functions for running totals and rankings, CTEs for readable multi-step queries, self-joins for comparing rows within the same table. I focus on the "why" -- not just the syntax, but when and why you would reach for each tool.

## How It Actually Works - Step by Step

1. **Each notebook is self-contained.** You do not need to read them in order. Pick the concept you want to learn and dive in.
2. **Transformer notebooks** start with raw matrix math, build up to single-head attention, then multi-head attention, then a full encoder block. By the end, you can trace a token through the entire architecture.
3. **Loss function notebooks** start with the intuition (why does the model need a signal to learn from?), show the math, implement from scratch, then validate against PyTorch's built-in implementations.
4. **The Adam notebook** implements each component of the optimizer -- first moment, second moment, bias correction -- then trains a small model to show it working in practice.
5. **GRU notebooks** visualize the gates opening and closing as data flows through, making the abstract math concrete.
6. **PySpark notebooks** start with local mode (your laptop pretending to be a cluster) and walk through real distributed data processing patterns.
7. **Math Gym notebooks** are short, focused drills -- typically 30-50 lines of combined math and code, designed to be completed in one sitting.
8. **Deep ML daily challenges** are my practice log -- short problems that keep specific skills fresh, the way musicians practice scales.

## What This Taught Me (And What It Will Teach You)

- **The Feynman technique works.** If you cannot explain something simply, you do not understand it. Every notebook here forced me to find the gap in my understanding and fill it.
- **Implementation beats memorization.** I did not truly understand attention until I built it with numpy. I did not truly understand Adam until I saw the bias correction fix early-step estimates. Build it yourself and the knowledge sticks.
- **Math is not optional.** You can use PyTorch without understanding gradients, but you cannot debug a model that is not converging without understanding gradients. The Math Gym made me dangerous in a good way.
- **Distributed computing is a mindset.** PySpark taught me to think about data in partitions, about operations that parallelize naturally vs. ones that require shuffles, about the cost of moving data between machines.
- **Breadth creates depth.** By exploring transformers, sequence models, object detection, optimization, and statistics, I started seeing the same patterns everywhere -- and that cross-pollination is where real insight lives.
- **Consistency beats intensity.** The daily Deep ML challenges kept me sharp between big projects. Ten minutes a day beats ten hours once a month.

## Interview Confidence Builder

**Q1: Explain the self-attention mechanism in transformers.**
Walk through Query, Key, Value. Explain the dot product between Q and K gives attention scores, softmax normalizes them, and the weighted sum of V produces context-aware representations. Mention scaling by the square root of dimension to prevent softmax saturation. Reference my notebook where I build it from raw matrices.

**Q2: Why does Adam work better than vanilla SGD in practice?**
Adam combines momentum (smoothing out noisy gradients) with adaptive learning rates (different step sizes for different parameters). It also includes bias correction for the first few steps when the running averages have not warmed up yet. The result: faster convergence, less sensitivity to hyperparameter tuning, and better performance on sparse gradients.

**Q3: What is the vanishing gradient problem, and how do GRUs address it?**
In vanilla RNNs, gradients get multiplied through many time steps during backpropagation. If those multiplied values are less than 1, the gradient shrinks toward zero -- the network cannot learn long-range dependencies. GRUs solve this with gates that create direct pathways for gradients to flow backward without repeated multiplication, similar to how highway systems let traffic bypass local roads.

**Q4: Explain cross-entropy loss intuitively.**
Cross-entropy measures how surprised your model is by the true answer. If the model predicts 0.99 for the correct class, surprise is low and loss is tiny. If it predicts 0.01 for the correct class, surprise is enormous and loss is huge. The logarithm in the formula creates this asymmetric penalty that punishes confident wrong answers much more than uncertain ones.

**Q5: When would you use PySpark over pandas?**
Pandas is single-machine, in-memory. If your data fits in RAM (say, under 10GB), pandas is simpler and faster to develop with. PySpark distributes data across a cluster, so it handles datasets that are too large for a single machine. I reach for PySpark when data exceeds memory, when I need to process in parallel for speed, or when the pipeline needs to run on a production cluster.

**Q6: What is Jensen's inequality and where does it show up in ML?**
For a convex function f, Jensen's inequality says f(E[X]) <= E[f(X)]. In ML, this shows up in variational inference: we cannot compute a log-likelihood directly, so we use Jensen's inequality to construct a lower bound (the ELBO) that we CAN optimize. It also explains why the log-loss of an ensemble is less than or equal to the average log-loss of individual models.

**Q7: How does YOLO differ from two-stage detectors like Faster R-CNN?**
Two-stage detectors first propose regions, then classify them -- accurate but slow. YOLO treats detection as a single regression problem: one forward pass through the network simultaneously predicts bounding boxes and class probabilities for every grid cell. This makes YOLO dramatically faster (real-time capable) but historically less precise on small objects. Recent YOLO versions have closed much of the accuracy gap.

**Q8: What is the difference between L1 and L2 regularization?**
L1 (Lasso) adds the absolute value of weights to the loss -- it drives some weights exactly to zero, creating sparse models (automatic feature selection). L2 (Ridge) adds the squared value of weights -- it shrinks all weights toward zero but rarely to exactly zero. I think of L1 as a sharp knife that cuts away features, and L2 as gentle pressure that keeps everything small.

## Get Started

```bash
git clone https://github.com/tolani007/Fun-Data-Science-Content-from-Tiki.git
cd Fun-Data-Science-Content-from-Tiki

# Browse the collection
ls  # 34 notebooks across transformers, PySpark, math, loss functions, and more

# Recommended starting path:
# 1. Start with a Math Gym notebook (convexity or gradients)
# 2. Move to the Adam optimizer explanation
# 3. Then tackle the self-attention / transformer notebooks
# 4. Explore PySpark and GRU at your own pace

jupyter notebook
```

You will need: Python 3.8+, Jupyter, numpy, PyTorch (for some notebooks), PySpark (for distributed computing notebooks).

## How This Connects

This repo is my **learning laboratory** -- it is where I build understanding from first principles. The mathematical foundations here (gradients, convexity, entropy) underpin everything in my **Data Engineering Vault** and my **Instacart** projects. The transformer and attention mechanism work connects directly to modern NLP and the kind of architecture thinking I apply in **Steeview's** neural network crate. The PySpark skills are production data engineering. And the Feynman-technique teaching style? That is the same approach I bring to my **Quantum Garden**, where I explain qubits and quantum gates the same way I explain attention heads here -- simply, from scratch, until it clicks.
