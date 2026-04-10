# Instacart Grocery Recommendation Project
> A recommendation system that learns what groceries you want before you know you want them -- built on Instacart's massive real-world dataset using collaborative filtering, content-based methods, and serious feature engineering.

## What I Built (and Why You Should Care)

I built a recommendation engine using Instacart's publicly available grocery transaction dataset -- one of the largest and richest e-commerce datasets out there. The question it answers is deceptively simple: "Given a customer's purchase history, what will they order next?" The answer requires understanding habits (people reorder the same milk every week), exploration (sometimes they try something new), temporal patterns (bananas on Monday, wine on Friday), and product relationships (if they buy pasta, they probably want marinara sauce).

This is the exact same problem that powers Amazon's "Customers who bought this also bought..." and Netflix's recommendation feed. The difference is that grocery shopping is uniquely interesting because of its regularity, its seasonality, and its basket structure. People do not buy one item at a time -- they build baskets, and those baskets have internal logic. A recommendation system that understands basket dynamics is fundamentally different from one that just matches individual products.

I attacked this from multiple angles: collaborative filtering (finding customers with similar tastes and recommending what they buy), content-based filtering (understanding product attributes and matching them to user preferences), and hybrid approaches that combine both. Along the way, I engineered features from raw transactional data -- reorder rates, days since last purchase, aisle and department co-occurrence patterns -- that turned a simple "what did they buy?" into a rich behavioral profile.

## The Core Concepts - Explained Simply

### Collaborative Filtering
Imagine you and your friend have bought the same 20 groceries over the past month. Then your friend buys oat milk, which you have never tried. Collaborative filtering says: "You and your friend have very similar taste. Your friend likes oat milk. You probably will too." It does not care WHY you might like it -- it just finds people like you and recommends what they enjoy. There are two flavors: **user-based** (find similar users, recommend their items) and **item-based** (find similar items to what you already buy). Item-based tends to work better at scale because item-item similarity is more stable than user-user similarity.

### Content-Based Filtering
Content-based filtering takes the opposite approach. Instead of looking at other customers, it looks at the characteristics of products you already like and finds similar products. If you buy organic, gluten-free granola, it looks for other products that are organic, gluten-free, and in the breakfast aisle. The advantage: it works even for new users (no "cold start" problem for items with good metadata). The disadvantage: it can trap you in a bubble of things you already know, never surfacing a surprising recommendation.

### Market Basket Analysis
Here is a concept that is both intuitive and powerful. Market basket analysis asks: "Which products are frequently purchased together?" The classic example is diapers and beer (an apocryphal retail legend, but the idea is real). In my Instacart project, I analyze co-occurrence patterns across thousands of baskets to find non-obvious associations. Maybe people who buy avocados also tend to buy limes and cilantro (Guacamole Night). These association rules become powerful features for the recommendation model -- if someone adds tortilla chips to their cart, the system can proactively suggest salsa.

**Support, confidence, and lift** are the three key metrics:
- **Support:** How frequently does this combination appear? (Absolute popularity)
- **Confidence:** Given item A in the basket, how often is item B also there? (Conditional probability)
- **Lift:** Is this co-occurrence more frequent than random chance? A lift greater than 1 means the items are positively associated.

### Feature Engineering on Transactional Data
Raw transaction data is just: "User X bought product Y at time T." That is not enough for a good model. Feature engineering transforms these raw facts into rich behavioral signals:

- **Reorder rate:** What fraction of a user's orders include product Y? High reorder rate means it is a staple.
- **Days since last purchase:** Has it been 7 days since they bought milk? They probably need more. Has it been 90 days? Maybe they switched brands.
- **Order sequence position:** Do they add bananas first (they are planning around it) or last (it is an afterthought)?
- **Aisle and department co-occurrence:** People who shop heavily in the produce aisle have different recommendation needs than people who shop in frozen foods.
- **Time-of-day and day-of-week patterns:** Weekend orders look different from weekday orders.

This feature engineering is where the real craft of recommendation systems lives. The model is only as good as the features you feed it, and the features are only as good as your understanding of the domain.

### Handling Large Datasets
The Instacart dataset is big -- millions of orders, hundreds of thousands of products, millions of user-product interactions. This means I cannot just load everything into a pandas DataFrame and hope for the best. I need to think about memory management (loading data in chunks, using efficient data types), computation strategy (vectorized operations instead of loops, sparse matrices for user-item interactions), and evaluation design (sampling strategies that respect temporal ordering -- you cannot test on the past and train on the future).

### Evaluation Metrics for Recommendations
How do you know if a recommendation is good? Accuracy metrics like RMSE are not enough. I use:
- **Precision@K:** Of the top K recommendations, how many did the user actually buy?
- **Recall@K:** Of the items the user actually bought, how many were in the top K recommendations?
- **Mean Average Precision (MAP):** Average precision across all users, which rewards systems that rank relevant items higher.
- **F1@K:** Harmonic mean of precision and recall at K.

The right metric depends on the business goal. If the goal is to fill a customer's cart accurately, recall matters more. If the goal is to surface a short list of compelling suggestions, precision matters more.

## How It Actually Works - Step by Step

1. **Data loading and exploration.** Load the Instacart dataset (orders, products, aisles, departments, order_products tables). Understand the schema and relationships.
2. **Exploratory Data Analysis.** What are the most popular products? What does the distribution of basket sizes look like? How often do customers reorder? What are the peak ordering times?
3. **Feature engineering.** Build user-level features (total orders, average basket size, favorite aisle), product-level features (reorder rate, popularity rank, average add-to-cart position), and user-product features (number of times user bought this product, fraction of orders containing it, days since last purchase).
4. **Collaborative filtering.** Build user-item interaction matrices. Compute user-user or item-item similarity. Generate recommendations based on similar users' preferences or similar items to the user's favorites.
5. **Content-based filtering.** Use product metadata (aisle, department) and engineered features to build product profiles. Recommend products with similar profiles to the user's purchase history.
6. **Market basket analysis.** Compute association rules (support, confidence, lift) for product pairs. Identify strong co-occurrence patterns.
7. **Model training and evaluation.** Split data temporally (train on earlier orders, test on last order). Evaluate using Precision@K, Recall@K, and MAP. Compare collaborative, content-based, and hybrid approaches.
8. **Insight generation.** What product categories are most predictable? Which users are hardest to recommend for? Where does the model succeed and fail?

## What This Taught Me (And What It Will Teach You)

- **Recommendation systems are harder than they look.** The concept is intuitive ("suggest things people will like"), but the execution requires careful thinking about data sparsity, cold starts, evaluation methodology, and computational scaling.
- **Feature engineering is the multiplier.** The difference between a mediocre model and a good one was not the algorithm -- it was the features. Reorder rate, purchase cadence, and basket-level context were more valuable than sophisticated algorithms on raw data.
- **Temporal ordering matters.** In time-series-like data, your train/test split must respect time. If you randomly split orders, you are leaking future information into the model, and your evaluation metrics will be misleadingly optimistic.
- **Sparsity is the enemy.** Most users buy a tiny fraction of available products. The user-item matrix is 99%+ empty. Learning from this sparse signal is the core challenge of recommendation systems.
- **Domain intuition helps.** Knowing that people buy groceries weekly, that fresh produce has a short repurchase cycle, and that holiday seasons shift purchasing patterns -- this domain knowledge guided both my feature engineering and my error analysis.
- **Large dataset management is a skill.** Efficient data types, chunked processing, and sparse matrix representations made the difference between a notebook that crashes and one that runs.

## Interview Confidence Builder

**Q1: Explain the difference between collaborative filtering and content-based filtering.**
Collaborative filtering finds patterns in user behavior -- it recommends items that similar users liked, without needing to understand the items themselves. Content-based filtering uses item attributes to recommend things similar to what the user already likes. Collaborative is better at surprising recommendations; content-based avoids the cold-start problem for new items with good metadata. Most production systems use a hybrid.

**Q2: What is the cold start problem and how would you handle it?**
Cold start occurs when a new user (no purchase history) or new product (no interaction data) enters the system. For new users: fall back to popularity-based recommendations or ask for explicit preferences. For new products: use content-based methods with product metadata. As interaction data accumulates, transition to collaborative methods.

**Q3: How would you evaluate a recommendation system?**
Never use random train/test splits for temporal data. Split by time: train on historical orders, test on the most recent order. Use Precision@K (are the top K recommendations relevant?), Recall@K (did we cover the relevant items?), and MAP (are relevant items ranked higher?). Also consider offline metrics vs. online A/B testing -- offline metrics do not capture novelty and serendipity.

**Q4: Explain market basket analysis and give an example.**
Market basket analysis finds products frequently purchased together. Using metrics like support (frequency), confidence (conditional probability), and lift (beyond random chance), I can discover rules like "customers who buy spaghetti also buy tomato sauce with 3.5x lift." These rules power cross-selling recommendations and store layout optimization.

**Q5: How do you handle the sparsity problem in user-item matrices?**
Sparsity means most entries in the user-item matrix are unknown. Strategies: (1) matrix factorization (decompose the sparse matrix into low-rank dense matrices that capture latent factors), (2) use implicit feedback (treat non-purchases as weak negatives, not hard zeros), (3) incorporate side information (user demographics, product metadata) to regularize the model, (4) use dimensionality reduction techniques.

**Q6: What feature engineering did you do on the Instacart dataset?**
User features: total orders, average basket size, favorite department, ordering frequency. Product features: reorder rate, popularity, average cart position. User-product features: times purchased, fraction of orders containing the item, days since last purchase, reorder probability trend. These features captured behavioral patterns that raw transaction IDs could not.

**Q7: How would you scale a recommendation system to millions of users?**
Pre-compute item-item similarity (more stable than user-user). Use approximate nearest neighbors (like FAISS or Annoy) instead of exact similarity search. Batch-generate recommendations offline and serve from cache. Use sparse matrix representations. Segment users into cohorts for cohort-level recommendations when individual data is sparse.

**Q8: What is implicit vs. explicit feedback, and which did you use?**
Explicit feedback is direct ratings (1-5 stars). Implicit feedback is inferred from behavior (purchases, clicks, time spent). Instacart data is implicit -- a purchase is a positive signal, but the absence of a purchase is ambiguous (do they dislike it, or just have not discovered it?). I treated purchases as positive signals and used techniques like negative sampling to handle the ambiguity.

## Get Started

```bash
git clone https://github.com/tolani007/instacart-grocery-recommendation-project.git
cd instacart-grocery-recommendation-project

# Install dependencies
pip install jupyter numpy pandas scikit-learn matplotlib seaborn

# Download the Instacart dataset (if not included)
# Available at: https://www.instacart.com/datasets/grocery-shopping-2017

# Open the notebook
jupyter notebook

# Walk through:
# 1. Data exploration
# 2. Feature engineering
# 3. Model building
# 4. Evaluation and insights
```

## How This Connects

This recommendation project is where my **data engineering** skills meet my **data science** skills. The feature engineering patterns come straight from my **Data Engineering Vault** -- the same pipeline thinking, the same attention to data quality. The ML techniques (similarity metrics, matrix operations, loss functions) build on my **Fun Data Science Content** notebooks. This project shares the Instacart dataset with my **Customer Behavior Prediction** project, but attacks it from a different angle -- recommendations here, segmentation and CLV there. Together, they form a complete picture of how data-driven e-commerce actually works. And the large-dataset management skills I built here? They showed up again in **Steeview**, where real-time data volume demands the same kind of memory-conscious engineering.
