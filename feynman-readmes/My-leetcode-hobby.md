# My LeetCode Hobby
> I do not grind LeetCode. I genuinely enjoy it. This is my documentation of falling in love with data structures and algorithms.

## What I Built (and Why You Should Care)

I want to be upfront about something: I actually enjoy this. I know "LeetCode grind" has a reputation as a soul-crushing rite of passage, but for me, solving algorithmic problems is like solving puzzles. It is the same satisfaction as finishing a crossword or cracking a riddle. This repo is my personal documentation of that practice -- solutions in Python, organized by problem, with my thinking process laid out.

Why should you care? Because data structures and algorithms are the bedrock of computer science, and if you understand them deeply -- not just memorize patterns but truly understand why they work -- you will be a fundamentally better engineer. Every system you build sits on top of these primitives. When you choose a list versus a set, you are making an algorithmic decision. When you write a database query that runs in milliseconds instead of minutes, it is because of indexing algorithms you understand (or don't). When your search feature returns results instantly, it is because someone chose the right data structure.

This repo is not a cheat sheet. It is a record of how I think about problems. If you read through my solutions, you will not just see the answer -- you will see the reasoning path that got me there.

## The Core Concepts - Explained Simply

### Arrays and Strings
An array is a row of numbered boxes. Box 0, Box 1, Box 2, and so on. You can jump to any box instantly if you know its number (that is O(1) access). The catch: inserting or removing a box in the middle means shifting everything after it (that is O(n)). Strings are just arrays of characters. Most "array problems" on LeetCode are really about clever use of **two pointers** (one at each end, walking inward) or **sliding windows** (a movable frame over a portion of the array). The trick is always: can you avoid looking at every element more than once?

### Hash Maps (Dictionaries)
A hash map is like a coat check: you hand over your coat (value) and get a ticket number (key). Later, you show the ticket and get your coat back instantly. In Python, this is a dictionary (`dict`). The magic is that lookup, insertion, and deletion are all O(1) on average. Whenever a problem says "find if X exists" or "count occurrences," a hash map is almost always the answer. The classic: "Two Sum." Given an array, find two numbers that add to a target. Without a hash map: check every pair (O(n^2)). With a hash map: for each number, check if (target - number) is already in the map. One pass. O(n). Beautiful.

### Linked Lists
A linked list is a scavenger hunt. Each clue (node) has a piece of data and tells you where the next clue is. You cannot jump to the 5th clue directly -- you have to follow the chain from the start. This makes access slow (O(n)) but insertion and deletion fast (O(1) if you have the right pointer). The key patterns: **fast and slow pointers** (one moves two steps, the other one step -- they meet if there is a cycle), **reversing** (swap the "next" pointers so the chain runs backward), and **merging** (interleave two sorted chains).

### Trees and Binary Search Trees
A tree is a family tree. One root at the top, children branching down. A binary tree means each parent has at most two children (left and right). A binary search tree (BST) adds an ordering rule: everything in the left subtree is smaller, everything in the right is larger. This makes searching O(log n) -- at each node, you eliminate half the remaining candidates. Traversal patterns are essential: **inorder** (left, root, right -- gives sorted order for BSTs), **preorder** (root, left, right -- useful for copying/serializing), **postorder** (left, right, root -- useful for deletion and calculation).

### Graphs
A graph is a map of cities and roads. Cities are nodes, roads are edges. Some roads are one-way (directed graph), some go both ways (undirected). The two fundamental traversal algorithms are **BFS** (breadth-first search: explore all neighbors before going deeper, like ripples on a pond) and **DFS** (depth-first search: go as deep as possible before backtracking, like exploring a maze). BFS finds the shortest path in unweighted graphs. DFS is great for detecting cycles, topological sorting, and exploring all possibilities.

### Stacks and Queues
A stack is a stack of plates: last in, first out (LIFO). You can only add to or remove from the top. A queue is a line at a coffee shop: first in, first out (FIFO). You join at the back and leave from the front. Stacks are behind every function call in your program (the call stack), every undo button (push action on undo, pop on redo), and every valid-parentheses problem. Queues power BFS, print queues, and task scheduling. When you see "process things in order," think queue. When you see "match things in reverse order," think stack.

### Heaps (Priority Queues)
A heap is like an ER waiting room. Patients are not seen in arrival order -- the most urgent (highest priority) goes first. In a min-heap, the smallest element is always at the top. In a max-heap, the largest. Insertion and extraction are both O(log n). In Python, `heapq` gives you a min-heap. Use it for problems like "find the K largest elements" (maintain a min-heap of size K), "merge K sorted lists" (heap of list heads), or any problem where you repeatedly need the smallest or largest item.

### Dynamic Programming (DP)
DP is the art of not solving the same problem twice. Imagine climbing a staircase where you can take 1 or 2 steps. How many ways can you reach step 10? You could recursively try every combination, but you will re-calculate "ways to reach step 5" dozens of times. DP says: calculate it once, store the result, and look it up later. The two approaches are **top-down** (recursion with memoization -- start from the goal and break down) and **bottom-up** (iteration -- start from the base case and build up). The hard part is seeing the substructure: "Can I express the answer for size N in terms of answers for smaller sizes?"

### Greedy Algorithms
A greedy algorithm makes the locally optimal choice at each step, hoping it leads to a globally optimal solution. Think of it like navigating a city by always turning toward your destination at every intersection. It does not always work (sometimes you need to detour), but when it does, it is elegant and fast. Classic examples: interval scheduling (always pick the job that ends earliest), coin change with specific denominations, and Huffman encoding. The key is proving the greedy choice is safe -- that it never eliminates the optimal solution.

### Backtracking
Backtracking is trial and error done systematically. Imagine filling in a Sudoku puzzle: you try a number, see if it conflicts, and if it does, you erase it and try the next one. If no number works, you go back to the previous cell and try a different choice there. It is DFS on a decision tree. Every "generate all combinations" or "find all valid configurations" problem uses backtracking. The template: make a choice, recurse, undo the choice.

### Big-O Analysis
Big-O is how we talk about how algorithms scale. It answers: "If I double the input size, how much longer does this take?" O(1) means constant time -- doubling input does not change runtime. O(n) means linear -- double the input, double the time. O(n^2) means quadratic -- double the input, quadruple the time. O(log n) means logarithmic -- double the input, add one more step. O(n log n) is the sweet spot for sorting. The skill is not just memorizing complexities but analyzing your own code: how many loops? Are they nested? Does each loop shrink the problem?

## How It Actually Works - Step by Step

1. **Read the problem.** Understand what input you are given and what output is expected. Identify constraints (array size, value range).
2. **Identify the pattern.** Is this a sliding window problem? A BFS? A DP? Recognizing the pattern is 80% of the work.
3. **Plan the approach.** Write pseudocode or draw a diagram. What data structure will I use? What is the time complexity?
4. **Implement in Python.** Write clean, readable code. Python's built-in data structures (lists, dicts, sets, heapq, deque) are your best friends.
5. **Test with examples.** Run through the given examples by hand. Then think of edge cases: empty input, single element, all duplicates, maximum size.
6. **Optimize if needed.** Can I reduce time complexity by using a different data structure? Can I reduce space by using variables instead of an array?
7. **Document the reasoning.** This is what makes this repo different from a solution dump. I write down why I chose the approach, what alternatives I considered, and what I learned.

## What This Taught Me (And What It'll Teach You)

- **Pattern recognition.** After enough problems, you start seeing categories. "Oh, this is a sliding window problem." "This is BFS on an implicit graph." That pattern library is invaluable in interviews and in real engineering.
- **Algorithmic thinking.** The ability to reason about time and space complexity changes how you write all code, not just interview code.
- **Python fluency.** List comprehensions, dictionary tricks, itertools, heapq, collections.deque -- daily practice makes you genuinely fast in Python.
- **Problem decomposition.** Every hard problem is made of easy subproblems. Learning to break things down is the most transferable skill in computer science.
- **Comfort under pressure.** Practice builds confidence. When you have solved 200 problems, a whiteboard interview feels like a conversation, not an exam.
- **The joy of elegance.** There is a genuine thrill in finding a clean, efficient solution. That feeling is what keeps me coming back.

## Interview Confidence Builder

**Q: Explain the time complexity of your solution.**
Always state the Big-O for both time and space. Walk through the analysis: "I have one loop over N elements, and inside the loop, I do a hash map lookup which is O(1), so the total is O(N) time and O(N) space for the hash map."

**Q: Can you solve this without extra space?**
This is asking if you can go from O(N) space to O(1) space. Techniques: two pointers, in-place array modification, bit manipulation, or mathematical formulas. Not always possible, but always worth considering.

**Q: What data structure would you use for this problem?**
The answer should connect the problem's requirements to the data structure's strengths. Need fast lookup? Hash map. Need sorted order with fast insert? Balanced BST or sorted set. Need FIFO processing? Queue. Need to repeatedly extract the minimum? Heap. Justify your choice with Big-O.

**Q: Walk me through your approach before you start coding.**
This is about communication. State the problem in your own words. Identify the pattern (e.g., "This looks like a two-pointer problem on a sorted array"). Sketch the algorithm in plain English. State the expected time and space complexity. Then start coding. Interviewers care about your thought process as much as your code.

**Q: What if the input is very large -- say, 10 million elements?**
This is a scalability question. O(n^2) is out. You need O(n log n) or O(n). Think about streaming solutions (process elements one at a time without storing everything). Consider external sorting, MapReduce, or approximation algorithms. Show that you think about real-world constraints.

**Q: How do you decide between BFS and DFS?**
BFS when you need the shortest path in an unweighted graph or when you want to explore level by level. DFS when you need to explore all paths (backtracking), detect cycles, or do topological sorting. BFS uses a queue and more memory (stores all nodes at the current level). DFS uses a stack (or recursion) and less memory but does not guarantee shortest paths.

**Q: What is your favorite problem, and why?**
Have one ready. Pick a problem that taught you something surprising. Explain the naive approach, why it is slow, and the insight that made it fast. Show genuine enthusiasm. Interviewers remember passion.

## Get Started

```bash
# Clone the repo
git clone https://github.com/tolani007/My-leetcode-hobby.git
cd My-leetcode-hobby

# Browse solutions by problem
ls

# Run a solution
python3 <problem_name>.py
```

No special dependencies needed. Just Python 3 and curiosity.

## How This Connects

This is the foundational practice that makes everything else possible. The **algorithmic thinking** here powers the data pipeline optimizations in my [data engineering vault](Data-Engineering-vault.md). The **graph algorithms** show up in my scraping projects where I navigate linked web pages. The **dynamic programming** mindset helps me design efficient workflows in my [LSPIRG Survey Agent](LSPIRG-SURVEY-AGENT.md). And the **Python fluency** from daily practice makes me faster in every Python project I touch. This repo is not separate from my other work -- it is the training that makes the other work possible.
