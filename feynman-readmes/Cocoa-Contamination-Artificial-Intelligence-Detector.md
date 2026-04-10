# Cocoa Contamination Artificial Intelligence Detector
> An AI system that looks at cocoa leaves and tells you exactly what disease they have -- precision agriculture powered by image classification, built to protect farmers' livelihoods.

## What I Built (and Why You Should Care)

I built an AI workflow that can look at a photo of a cocoa leaf and tell you whether it is healthy or diseased -- and if diseased, what specific disease is affecting it. This is not a toy project. Cocoa farming supports the livelihoods of millions of people across West Africa, Southeast Asia, and Latin America. When a disease hits a cocoa plantation, farmers often do not know what it is until the damage is widespread. By the time a human expert identifies the problem, entire harvests can be lost.

My detector changes that equation. A farmer with a smartphone can take a photo of a suspicious leaf, run it through the model, and get an immediate diagnosis. Early detection means targeted treatment. Targeted treatment means less crop loss, less pesticide waste, and more money in the farmer's pocket. This is AI doing what it should do: solving a real problem for real people.

The technical stack is straightforward by design: Jupyter Notebooks for the training workflow, Python with image classification libraries for the model, and transfer learning so that I do not need millions of images to get good results. The simplicity is the point. A model that requires a GPU cluster to run is useless to a farmer in rural Ghana. I optimized for deployability as much as accuracy.

## The Core Concepts - Explained Simply

### Image Classification
Imagine teaching a child to identify animals. You show them hundreds of pictures of cats and dogs, and eventually they learn the visual patterns that distinguish one from the other. **Image classification** works the same way. I show the model thousands of cocoa leaf images labeled as "healthy," "black pod disease," "frosty pod rot," and so on. The model learns the visual patterns -- discoloration patterns, lesion shapes, texture changes -- that distinguish each category. Given a new photo, it outputs probabilities for each disease class.

### Convolutional Neural Networks (CNNs)
A CNN is the engine that powers image classification. Here is how I explain it: imagine sliding a tiny magnifying glass across an image. At each position, the magnifying glass detects a specific pattern -- maybe an edge, a color gradient, or a spot. The first layer of the CNN detects simple patterns (edges, corners). The second layer combines those into slightly more complex patterns (textures, shapes). By the time you reach the deep layers, the network recognizes high-level features (lesion boundaries, leaf venation patterns, discoloration halos). This hierarchical feature learning is why CNNs are so powerful for visual tasks -- they automatically discover the features that matter, without me having to manually define them.

### Transfer Learning
Training a CNN from scratch requires millions of images and days of GPU time. I do not have that. What I do have is **transfer learning**: I take a model that has already been trained on millions of images (like ImageNet, which includes everything from airplanes to zebras) and repurpose it for cocoa leaf classification. The early layers of the pre-trained model already know how to detect edges, textures, and shapes -- those skills transfer to any visual domain. I only need to retrain the final layers to recognize cocoa-specific diseases. Think of it like hiring an experienced chef and only needing to teach them your restaurant's specific recipes -- you do not need to teach them how to hold a knife.

### Data Augmentation
My cocoa leaf dataset is not huge. To prevent the model from memorizing the training images instead of learning generalizable patterns (overfitting), I use **data augmentation**: I create variations of existing images by rotating, flipping, adjusting brightness, cropping, and adding slight color shifts. This artificially expands the training set and teaches the model to recognize diseases regardless of leaf orientation, lighting conditions, or camera angle. It is like studying for an exam by working through the same problem from different angles -- you learn the underlying concept, not just the specific example.

### Precision Agriculture
Precision agriculture is the idea that farming decisions should be data-driven and targeted rather than broad and wasteful. Instead of spraying an entire plantation with pesticide because some leaves look sick, a farmer can use my detector to identify which areas are actually affected and what specific treatment is needed. This saves money, reduces chemical runoff, and protects beneficial insects. My detector is one tool in the precision agriculture toolkit -- the eyes that help the farmer see what is happening at scale.

### Model Deployment for Real-World Impact
Building an accurate model is only half the job. The other half is getting it to the people who need it. For cocoa farmers, that means the model needs to work on a smartphone with limited connectivity. This pushes design decisions: I optimize the model size (fewer parameters, quantized weights), I design the inference pipeline to run without a constant internet connection, and I package results in a format that is meaningful to a non-technical user. "Black pod disease -- severity: moderate -- recommended action: copper-based fungicide" is useful. A probability vector is not.

### Evaluation Metrics for Imbalanced Classes
In agricultural disease detection, some diseases are much rarer than others. If 90% of my dataset is healthy leaves, a model that always predicts "healthy" gets 90% accuracy -- but it is completely useless for disease detection. I focus on **precision** (when the model says "diseased," how often is it right?), **recall** (out of all actually diseased leaves, how many did the model catch?), and **F1 score** (the harmonic mean that balances both). For a farmer, high recall is critical -- missing a disease is worse than a false alarm.

## How It Actually Works - Step by Step

1. **Data collection and labeling.** Cocoa leaf images, each labeled with a disease category or "healthy." The images represent different cultivars, lighting conditions, and disease stages.
2. **Data preprocessing.** Resize images to a standard input size, normalize pixel values, and split into training, validation, and test sets. Apply data augmentation to the training set.
3. **Model selection.** I start with a pre-trained CNN backbone (like ResNet or EfficientNet) and add custom classification layers on top.
4. **Transfer learning.** Freeze the early layers of the pre-trained model (they already know edges and textures). Train only the later layers and the new classification head on cocoa leaf images.
5. **Fine-tuning.** Gradually unfreeze more layers and train with a very small learning rate, allowing the model to adapt its feature detectors to cocoa-specific patterns.
6. **Evaluation.** Test on held-out images the model has never seen. Check precision, recall, and F1 for each disease class, paying special attention to rare diseases.
7. **Iteration.** If a disease class has poor recall, I investigate: not enough training examples? Need more augmentation for that class? Adjust and retrain.
8. **Deployment preparation.** Optimize model size, test on simulated mobile hardware, and package with clear user-facing outputs.

## What This Taught Me (And What It Will Teach You)

- **Transfer learning is a game-changer.** I went from zero cocoa leaf expertise to a working disease classifier in days, not months, because pre-trained models carry over so much visual knowledge. This is a skill every ML practitioner needs.
- **Domain knowledge matters.** Understanding cocoa diseases -- their visual symptoms, progression patterns, and treatment options -- made me a better ML engineer for this project. I could spot when the model was picking up on the wrong features (like leaf background color instead of disease symptoms).
- **Evaluation metrics are a design choice.** Accuracy is not always the right metric. For disease detection, I learned to optimize for recall because a missed disease costs the farmer their harvest. The metric should match the real-world cost of errors.
- **Data augmentation is essential for small datasets.** In agriculture, large labeled datasets are rare and expensive to create. Augmentation is how you stretch a small dataset without degrading model quality.
- **Deployment thinking changes design.** When I started thinking about a farmer with a smartphone in a rural area with spotty internet, my entire model architecture changed. Smaller models, offline inference, and clear non-technical outputs became design requirements, not afterthoughts.
- **AI for social good is real engineering.** This is not a feel-good side project. It requires the same rigor as any production ML system -- maybe more, because the users cannot debug your model for you.

## Interview Confidence Builder

**Q1: Explain transfer learning and when you would use it.**
Transfer learning leverages a model pre-trained on a large dataset (like ImageNet) and adapts it to a new, smaller dataset. The early layers learn general visual features (edges, textures) that transfer across domains. I use it when my target dataset is too small to train a deep model from scratch -- which is most real-world scenarios outside of major tech companies.

**Q2: How do you handle class imbalance in image classification?**
Multiple strategies: (1) oversampling minority classes or undersampling majority classes during training, (2) applying class weights to the loss function so misclassifying a rare disease costs more than misclassifying a common one, (3) using data augmentation more aggressively on underrepresented classes, and (4) evaluating with precision/recall/F1 per class instead of overall accuracy.

**Q3: What is the difference between precision and recall, and which matters more here?**
Precision is "of all predictions of disease X, how many were correct?" Recall is "of all actual cases of disease X, how many did we detect?" For a disease detector, recall matters more because missing a real disease (false negative) means untreated crop loss. A false alarm (false positive) just means unnecessary inspection. I would rather over-alert than under-alert.

**Q4: How would you deploy this model for use in rural areas with limited connectivity?**
Export the model in a mobile-friendly format (TFLite or ONNX), optimize with quantization and pruning to reduce size, and build a lightweight mobile app that runs inference locally on the device. All the farmer needs is the app and a camera -- no internet required for the classification itself. Results and recommendations can sync when connectivity is available.

**Q5: What is data augmentation and why is it important?**
Data augmentation creates modified copies of existing training images (rotations, flips, color shifts, crops) to artificially expand the dataset. It is important because it reduces overfitting by teaching the model to recognize the subject regardless of incidental variation (lighting, angle, position). In my project, a diseased leaf looks the same whether the photo is taken upside down or in morning vs. afternoon light.

**Q6: How do CNNs learn hierarchical features?**
Each convolutional layer applies filters that detect patterns at a specific level of abstraction. Early layers learn simple patterns (edges, color gradients) from raw pixels. Middle layers combine those into textures and shapes. Deep layers combine those into object parts and high-level concepts. This hierarchical composition happens automatically through backpropagation -- the network discovers the useful features for the classification task without human engineering.

**Q7: How would you explain this project's real-world impact?**
Cocoa diseases cause billions of dollars in crop losses annually, disproportionately affecting smallholder farmers who can least afford it. Early detection through smartphone-based AI reduces crop loss, minimizes unnecessary pesticide use, and helps farmers make targeted treatment decisions. The model is designed to be accessible -- low computational requirements, clear outputs, no specialized equipment.

## Get Started

```bash
git clone https://github.com/tolani007/Cocoa-Contamination-Artificial-Intelligence-Detector.git
cd Cocoa-Contamination-Artificial-Intelligence-Detector

# Install dependencies
pip install jupyter numpy pandas matplotlib tensorflow  # or pytorch, depending on implementation

# Open the main notebook
jupyter notebook

# Walk through the cells sequentially:
# 1. Data loading and exploration
# 2. Preprocessing and augmentation
# 3. Model building (transfer learning)
# 4. Training and evaluation
# 5. Results visualization
```

## How This Connects

This project sits at the intersection of my ML skills and my belief that technology should serve people. The **image classification and transfer learning** skills build directly on the deep learning foundations from my **Fun Data Science Content** -- CNNs, loss functions, optimization. The **agricultural domain** connects to my **Ghana Cocoa Sustainability** project, which analyzes cocoa economics from the data side while this project tackles it from the AI side. The **deployment thinking** (small models, offline inference, real-world users) mirrors the engineering discipline from my **Data Engineering Vault** and the performance optimization mindset from **Steeview**. And the **precision agriculture** vision -- using AI to help farmers make better decisions -- is the kind of meaningful application that motivates all of my work.
