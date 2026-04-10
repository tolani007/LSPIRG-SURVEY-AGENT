# Instacart Customer Behaviour Prediction
> Predicting who your best customers will be, who is about to leave, and how much everyone is worth -- the analytical backbone that turns grocery transaction data into business strategy.

## What I Built (and Why You Should Care)

I built a customer analytics pipeline that takes Instacart's raw grocery transaction data and transforms it into actionable business intelligence. The questions it answers are the ones every e-commerce executive asks: Which customers are most valuable? Who is at risk of churning? How should we segment our customer base for targeted marketing? And the big one: what is the predicted Customer Lifetime Value (CLV) of each customer?

If the recommendation project is about "what should we suggest?", this project is about "who should we focus on?" and "how should we invest our marketing budget?" These are fundamentally different questions that require different analytical approaches. Recommendations optimize for engagement; customer behavior prediction optimizes for long-term business value.

Here is why this matters for you: customer segmentation, CLV prediction, and churn analysis are among the most commonly requested skills in data science interviews, especially at e-commerce and SaaS companies. This project is my worked example -- start to finish, on a real dataset, with real business logic. If you understand the reasoning behind every feature I engineered and every segment I defined, you will be dangerous in any customer analytics interview.

## The Core Concepts - Explained Simply

### Customer Lifetime Value (CLV)
CLV answers the question: "Over their entire relationship with us, how much revenue will this customer generate?" It is like estimating how much a fruit tree will produce over its lifetime, not just this season. A customer who spends $50 per week for 5 years is worth $13,000 -- far more valuable than one who spends $200 once and never returns. CLV combines purchase frequency, average order value, and expected customer lifespan into a single number that drives business decisions like how much to spend acquiring or retaining each customer.

There are multiple ways to estimate CLV:
- **Historical CLV:** Sum up everything they have spent so far. Simple but backward-looking.
- **Predictive CLV:** Use models (like BG/NBD for purchase frequency and Gamma-Gamma for monetary value) to forecast future spending. More useful for decision-making.
- **Simple heuristic:** Average order value x purchase frequency x expected lifespan. A good starting point for building intuition.

### RFM Analysis (Recency, Frequency, Monetary)
RFM is the Swiss Army knife of customer segmentation. It scores each customer on three dimensions:
- **Recency:** How recently did they last order? (A customer who ordered yesterday is more engaged than one who ordered six months ago.)
- **Frequency:** How often do they order? (Weekly shoppers vs. monthly shoppers.)
- **Monetary:** How much do they spend per order? (Big baskets vs. small baskets.)

Imagine you run a coffee shop. Your best customers score high on all three: they came in yesterday (recent), they come every day (frequent), and they always buy a large latte plus a pastry (high monetary). Your at-risk customers scored high on frequency and monetary six months ago but low on recency now -- they used to be regulars and they stopped coming. That shift is your early warning signal.

I segment customers into buckets based on their RFM scores: Champions (high across the board), Loyal Customers (high frequency), At Risk (used to be good, declining recency), Hibernating (have not ordered in a long time), and New Customers (recent but not yet frequent). Each segment gets a different business strategy.

### Customer Segmentation with Clustering
RFM is rule-based segmentation. Clustering is data-driven segmentation. I use algorithms like **K-Means** to let the data reveal natural customer groupings based on behavioral features. K-Means works like this: pick K random centers, assign each customer to the nearest center, move each center to the middle of its assigned customers, and repeat until the centers stop moving. The result is K groups of customers who are similar to each other and different from other groups.

Think of it like sorting a jar of mixed candies. You could sort by color (rule-based, like RFM), or you could pour them onto a table and notice that some naturally clump together by size AND color AND shape -- that is clustering. The advantage of clustering is that it can discover segments you would not have thought to define manually.

### Churn Prediction
Churn is when a customer stops buying. In subscription businesses, it is obvious -- they cancel. In grocery shopping, it is fuzzy -- how many days of inactivity count as "churned"? I define churn based on the customer's own historical behavior: if they usually order weekly and have not ordered in 4 weeks, that is a churn signal. If they usually order monthly and it has been 5 weeks, that is normal.

Churn prediction is a binary classification problem: will this customer churn in the next N days? Features include recency, order frequency trend (increasing or decreasing?), basket size trend, day-of-week consistency, and product diversity. A gradient boosted model (XGBoost, LightGBM) works well here because churn signals are often non-linear interactions between features. The business value is enormous: retaining an existing customer is 5-7x cheaper than acquiring a new one.

### Business Metrics That Matter
Beyond technical metrics (AUC, precision, recall), I connect every model output to a business decision:
- **CLV** drives customer acquisition spend (do not spend more to acquire a customer than their predicted lifetime value).
- **Churn probability** drives retention campaigns (target high-value, high-risk customers with incentives).
- **Segment labels** drive marketing strategy (Champions get early access, At Risk get win-back campaigns, New Customers get onboarding sequences).

This connection between model output and business action is what separates data science from statistics. It is also what interviewers want to hear.

## How It Actually Works - Step by Step

1. **Data ingestion.** Load the Instacart dataset: orders, products, user-product interactions. Understand the temporal structure -- orders are timestamped and sequenced.
2. **Customer-level aggregation.** Transform transaction-level data into customer-level features: total orders, total spend, average basket size, ordering cadence, product diversity, favorite categories.
3. **RFM scoring.** Calculate Recency (days since last order), Frequency (total order count), and Monetary (average or total spend) for each customer. Assign RFM scores (typically 1-5 for each dimension).
4. **RFM segmentation.** Map RFM score combinations to business-meaningful segments: Champions, Loyal, Potential Loyalists, At Risk, Hibernating, Lost.
5. **Clustering.** Scale features and run K-Means (or DBSCAN) to discover data-driven segments. Use the elbow method or silhouette score to pick the right number of clusters. Compare cluster-based segments with RFM segments for validation.
6. **Churn definition and labeling.** Define churn based on customer-specific purchase cadence. Label customers as churned or active for the most recent time window.
7. **Churn model training.** Engineer temporal features (frequency trend, recency delta, basket value trend). Train a gradient boosted classifier. Evaluate with AUC, precision, recall, and confusion matrix.
8. **CLV estimation.** Use predictive models (BG/NBD + Gamma-Gamma, or a simpler regression approach) to estimate expected future value for each customer.
9. **Insight synthesis.** Combine segment labels, churn probabilities, and CLV estimates into a single customer dashboard view. Translate insights into recommended business actions.

## What This Taught Me (And What It Will Teach You)

- **Customer analytics is a full pipeline.** It is not just one model -- it is a chain of data transformations, segmentation logic, prediction models, and business translations that must all align.
- **RFM is powerful because it is simple.** Before I jumped to complex models, RFM gave me 80% of the insight. The lesson: always start simple, validate with domain experts, and only add complexity when the simple approach hits a ceiling.
- **Churn definition is a design decision.** There is no universal definition of churn in non-subscription businesses. The threshold you choose affects every downstream metric. I learned to define churn relative to each customer's own behavior, not a global cutoff.
- **Feature engineering outweighs algorithm selection.** A gradient boosted model with rich behavioral features outperformed a neural network with raw features. The features carry the domain knowledge; the algorithm just finds patterns in them.
- **Business context transforms analysis into value.** Saying "this customer has a 73% churn probability" is analytics. Saying "this high-value customer has a 73% churn probability, so we should send them a personalized retention offer this week" is data science.
- **Clustering requires interpretation.** K-Means gives you groups, but the groups are meaningless until you characterize them. I learned to profile each cluster across multiple dimensions and give them business-meaningful names.

## Interview Confidence Builder

**Q1: How would you predict customer lifetime value?**
Start with RFM as a baseline -- high-RFM customers are generally high-CLV. For predictive CLV, use probabilistic models like BG/NBD (predicts future transaction count) combined with Gamma-Gamma (predicts monetary value per transaction). Multiply expected transactions by expected value. For regression-based CLV, engineer features from historical behavior and train a model to predict total spend over a future window.

**Q2: Explain RFM analysis and how you would use it to segment customers.**
Recency: days since last purchase. Frequency: total purchases in a period. Monetary: average spend per purchase. Score each 1-5, then map score combinations to segments. Example: R=5 F=5 M=5 is a Champion; R=1 F=5 M=5 is At Risk (used to buy a lot but stopped recently). Each segment gets a different marketing strategy.

**Q3: How do you define churn in a non-subscription business?**
There is no hard cutoff, so I use customer-specific thresholds. If a customer typically orders every 7 days, they show churn risk at 21 days of inactivity (3x their normal cadence). A monthly shopper shows risk at 60-90 days. This adaptive definition avoids false alarms for infrequent but loyal customers and catches truly disengaging frequent shoppers early.

**Q4: What clustering algorithm would you use and how would you choose K?**
K-Means is my default for customer segmentation -- it is interpretable, scalable, and works well with RFM-style features. I choose K using the elbow method (plot inertia vs. K and look for the bend) supplemented by silhouette score (measures how similar each point is to its own cluster vs. others). I also validate by examining whether the resulting clusters tell a coherent business story.

**Q5: How would you build a churn prediction model?**
Define the target: binary label (churned or not) based on a future observation window. Engineer features: recency, frequency trend, monetary trend, basket composition changes, day-of-week consistency, category diversity. Train a gradient boosted classifier (XGBoost or LightGBM). Evaluate on AUC, precision, and recall. Optimize the classification threshold based on the relative cost of false positives (wasted retention spend) vs. false negatives (lost customers).

**Q6: What is the difference between rule-based and data-driven segmentation?**
Rule-based (like RFM) uses predefined thresholds and business logic. It is transparent, interpretable, and easy to explain to stakeholders. Data-driven (like K-Means) lets the algorithm discover natural groupings. It can find segments you would not have defined manually, but requires interpretation to be actionable. I typically use both: RFM for a quick, business-aligned view, and clustering to discover hidden patterns within or beyond RFM segments.

**Q7: How do you connect model outputs to business decisions?**
Every model output maps to an action. High CLV + low churn risk = invest in upselling. High CLV + high churn risk = immediate retention campaign. Low CLV + low churn risk = autopilot. Low CLV + high churn risk = let go gracefully. This 2x2 matrix (CLV x churn) is the framework I use to turn predictions into strategy. The model is only valuable if it changes a decision.

**Q8: How would you handle a customer who is new and has very little purchase history?**
Cold start for customer analytics. Options: (1) assign them to a "New Customer" segment with default treatment, (2) use look-alike modeling to match them to similar customers based on their first few purchases, (3) gradually update their segment assignment as more data accumulates. The key is to have a graceful onboarding path rather than ignoring them until they have enough data.

## Get Started

```bash
git clone https://github.com/tolani007/instacart-customer-behaviour-prediction.git
cd instacart-customer-behaviour-prediction

# Install dependencies
pip install jupyter numpy pandas scikit-learn matplotlib seaborn xgboost

# Open the notebook
jupyter notebook

# Follow the analytical pipeline:
# 1. Data exploration and customer-level aggregation
# 2. RFM analysis and segmentation
# 3. Clustering for data-driven segments
# 4. Churn prediction model
# 5. CLV estimation
# 6. Business recommendations
```

## How This Connects

This project is the **business intelligence twin** of my **Instacart Recommendation Project**. That project answers "what should we suggest?"; this one answers "who should we focus on?" Together, they form a complete customer analytics system. The feature engineering skills are the same ones I sharpened in my **Data Engineering Vault** -- transforming raw transactions into rich behavioral signals. The ML techniques (classification, clustering, evaluation) build on foundations from **Fun Data Science Content**. And the business-oriented thinking -- connecting model outputs to decisions -- is the soft skill that ties all my technical work to real-world value. If you are preparing for a data science interview at an e-commerce company, this project plus the recommendation project cover the two most asked-about topics: personalization and customer analytics.
