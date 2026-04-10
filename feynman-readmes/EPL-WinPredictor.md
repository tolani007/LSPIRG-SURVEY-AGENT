# EPL-WinPredictor
> Predicting football match outcomes is really just asking: "Given everything that's happened so far this season, what's most likely to happen next Saturday?"

## What I Built (and Why You Should Care)

I built a machine learning model that predicts whether a Premier League team will win, draw, or lose their next match. This was my BrainStation capstone project, and I threw everything I had at it: XGBoost, Random Forest, Logistic Regression, feature engineering that would make a football scout jealous, and SHAP explainability so you can actually understand *why* the model makes its predictions.

Here's why this matters beyond football. Every company with historical data wants to predict future outcomes: will this customer churn, will this stock go up, will this patient be readmitted? The techniques I used here -- rolling averages, Elo ratings, ensemble models, feature interaction engineering -- are the exact same patterns you'd use in any predictive modeling job. Football just made it fun to learn.

The real magic is in the feature engineering. Raw match data is boring: Team A scored 2, Team B scored 1. But when you compute rolling 5-game averages, dynamic Elo ratings, expected goals differentials, and head-to-head records, suddenly your model has rich context. That transformation from raw data to meaningful features is the single most valuable skill in applied ML.

## The Core Concepts - Explained Simply

**Feature Engineering (Rolling Averages):** Imagine you're trying to predict how well a student will do on their next exam. Looking at just their last test score isn't great. But if you average their last 5 tests, you get a much better picture of their "form." That's what rolling averages do for football teams -- instead of "they won last week," the model sees "they've averaged 1.8 goals and 58% possession over their last 5 matches."

**Elo Ratings:** Chess players have Elo ratings that go up when they beat strong opponents and down when they lose to weak ones. I implemented the same system for Premier League teams. After every match, each team's rating updates based on the result AND the strength of their opponent. So beating Man City is worth more than beating a relegation team. This gives the model a dynamic measure of true team quality that adapts throughout the season.

**XGBoost (Extreme Gradient Boosting):** Think of it like this: you have a team of students taking a test. The first student takes the test and gets some questions wrong. The second student focuses specifically on the questions the first student missed. The third student focuses on what the first two still got wrong. By the time you combine all their answers, the team collectively aces it. That's XGBoost -- each "tree" learns from the mistakes of previous trees.

**Random Forest:** Instead of students learning from each other's mistakes (like XGBoost), imagine you give 100 different students slightly different versions of the test (random subsets of questions and data). Each works independently. Then you take a majority vote. The wisdom of the crowd tends to be more accurate than any single student. That's Random Forest.

**SHAP (SHapley Additive exPlanations):** After your model makes a prediction, your boss asks "but WHY does it think Liverpool will win?" SHAP answers this by computing how much each feature contributed to that specific prediction. It's borrowed from game theory -- if the prediction is a team project, SHAP figures out exactly how much each team member (feature) contributed to the final grade.

**Precision, Recall, and F1:** Precision asks "of all the wins I predicted, how many actually happened?" Recall asks "of all the actual wins, how many did I correctly predict?" F1 is the harmonic mean -- a balanced score. In football prediction, you care about both: you don't want to predict wins that don't happen (low precision), and you don't want to miss wins that do happen (low recall).

**Dask for Larger-Than-Memory Data:** When your dataset gets too big for pandas to handle in RAM, Dask lets you process it in chunks. Think of it as hiring a moving crew instead of carrying everything yourself -- the furniture still gets moved, but now you can handle a mansion instead of just a studio apartment.

## How It Actually Works - Step by Step

1. **Data Loading:** Load CSV files of Premier League match data -- dates, teams, scores, shots, possession, expected goals, etc.
2. **Preprocessing:** Clean column names, handle missing values, convert dates to numeric format, encode team names, transform kick-off times into cyclical features (sin/cos) so the model understands that 23:00 and 01:00 are close together.
3. **Feature Engineering:** This is where 80% of the value lives:
   - Compute rolling 5-game averages for goals, shots, possession, xG
   - Calculate win/loss streaks (momentum matters)
   - Generate interaction features: xG differential (attacking power minus opponent's), shot accuracy ratios
   - Build head-to-head statistics between specific team pairs
   - Implement dynamic Elo ratings that update after each match
4. **Model Training:** Train XGBoost, Random Forest, and Logistic Regression. Evaluate each with precision, recall, F1-score. Use SHAP to understand which features drive predictions.
5. **Prediction:** Prepare upcoming match data with the same features, run through the best model, output win/draw/loss probabilities.

## What This Taught Me (And What It'll Teach You)

- **Feature engineering is the real ML superpower** -- raw data is almost never enough; you need to transform it into meaningful signals
- **Ensemble methods** -- understanding when to use boosting (XGBoost) vs. bagging (Random Forest) vs. linear models (Logistic Regression)
- **Model evaluation beyond accuracy** -- precision, recall, F1, and why accuracy alone is misleading for imbalanced classes
- **Explainability with SHAP** -- making black-box models transparent, which is increasingly required in industry
- **Time-series feature engineering** -- rolling windows, lag features, streaks, momentum indicators
- **Elo rating systems** -- a transferable skill used in recommendation systems, matchmaking, and ranking
- **Domain knowledge integration** -- understanding football tactics translated directly into better features
- **Handling larger datasets with Dask** -- parallel computing for data that doesn't fit in memory

## Interview Confidence Builder

**"Walk me through a feature engineering project."**
Talk about this project. Explain how you took raw match data and engineered rolling averages, Elo ratings, interaction features, and streaks. Emphasize that feature engineering contributed more to model performance than algorithm selection.

**"What's the difference between boosting and bagging?"**
Boosting (XGBoost): sequential trees, each learning from predecessors' errors, reduces bias. Bagging (Random Forest): parallel trees on random data subsets, majority vote, reduces variance. You used both here and can compare their performance.

**"How do you evaluate a classification model?"**
Go beyond accuracy. Discuss precision/recall tradeoffs, F1-score, and why you chose specific metrics. Mention that in football prediction, classes are imbalanced (fewer draws than wins/losses).

**"How do you make ML models explainable?"**
Describe your SHAP implementation. Explain how Shapley values attribute prediction contributions to individual features. This is a huge plus for regulated industries.

**"How do you handle time-series data in ML?"**
Explain why you can't randomly split time-series data (future leakage). Describe your rolling window features, the importance of chronological train/test splits, and how Elo ratings capture temporal dynamics.

**"Tell me about a project where domain knowledge improved your model."**
This entire project. Knowing that home advantage matters, that form fluctuates, that head-to-head records are predictive, and that xG is more reliable than raw goals -- all of this domain knowledge translated directly into better features.

**"How do you handle a dataset that doesn't fit in memory?"**
Explain your use of Dask: lazy evaluation, chunked processing, the DataFrame API that mirrors pandas. Discuss when to use Dask vs. Spark vs. just getting more RAM.

## Get Started

```bash
git clone https://github.com/tolani007/EPL-WinPredictor.git
cd EPL-WinPredictor
pip install jupyter xgboost scikit-learn dask shap pandas
jupyter notebook Brainstation_Capstone_Project.ipynb
```

The notebook walks through the entire pipeline from data loading to prediction. `UprightCatPREML_Version_4.ipynb` contains an alternative model version worth comparing.

## How This Connects

This is the crown jewel of the **Sports Analytics** learning path. It builds on data scraped in [ScrapingFBREF](https://github.com/tolani007/ScrapingFBREF), applies insights from [epl-dribbling-analysis](https://github.com/tolani007/epl-dribbbling-analysis) and [epl-goalscoring-analysis](https://github.com/tolani007/epl-goalscoring-analysis-march-2023), and uses the same ML fundamentals explored in [Fun-Data-Science-Content-from-Tiki](https://github.com/tolani007/Fun-Data-Science-Content-from-Tiki). The feature engineering patterns transfer directly to the [Instacart projects](https://github.com/tolani007/instacart-grocery-recommendation-project) and any industry prediction problem.
