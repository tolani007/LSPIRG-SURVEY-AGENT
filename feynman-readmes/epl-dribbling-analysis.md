# EPL Dribbling Analysis
> If you can look at football data and tell a story that makes someone say "oh, I never thought about it that way" -- you've just done data science.

## What I Built (and Why You Should Care)

I built a data story analyzing the top dribblers in the English Premier League. Not just charts and numbers -- a narrative. Who are the best dribblers? What makes them effective? How do dribbling stats relate to team performance? I took raw football statistics and turned them into insights that even a casual fan could appreciate.

This project is important because it represents the most underrated skill in data science: storytelling. Any analyst can compute averages and make bar charts. The ones who get promoted, who influence decisions, who get hired -- they're the ones who can look at data and craft a compelling narrative. This project was my practice ground for that exact skill.

The technical side matters too. This is classic Exploratory Data Analysis (EDA) -- the process of poking and prodding a dataset to find patterns before you build any models. In industry, you'll spend 60-70% of your time on EDA before touching a single ML algorithm. Getting good at it means you'll be faster and more effective at everything that comes after.

## The Core Concepts - Explained Simply

**Exploratory Data Analysis (EDA):** Before you build a model, you need to understand your data. EDA is like a detective examining a crime scene before forming theories. You look at distributions, correlations, outliers, missing values. You ask "what's weird?" and "what patterns jump out?" The dribbling dataset told stories I didn't expect until I started exploring.

**Data Storytelling:** Raw numbers don't convince anyone. "Player X averages 4.2 successful dribbles per game" means nothing to most people. But "Player X beats their defender more often than any attacker in the league, and it's not even close -- here's the visual proof" lands completely differently. Storytelling is arranging your analysis in a narrative arc: setup, tension, insight, conclusion.

**Statistical Visualization:** Choosing the right chart type is an art. Bar charts for comparisons, scatter plots for relationships, line charts for trends over time, heatmaps for correlations. For dribbling analysis, I needed charts that showed both volume (how many dribbles attempted) and efficiency (what percentage succeeded). A scatter plot with those two axes instantly reveals which players are both prolific AND effective.

**Domain Context:** Dribbling in football isn't just "running past someone." There are different types: progressive dribbles that advance the ball up the pitch, dribbles in the final third that create chances, and defensive dribbles that relieve pressure. Understanding these distinctions makes the analysis meaningful rather than superficial. Domain knowledge is what separates a data scientist from a chart-maker.

**Feature Relationships:** The interesting insights come from asking "how does X relate to Y?" Do teams with more successful dribblers score more goals? Do dribblers attempt more in home games? Is there a fatigue effect where dribble success drops later in the season? These are the questions that make EDA valuable.

## How It Actually Works - Step by Step

1. **Data Collection:** Premier League dribbling statistics -- attempts, successes, success rate, progressive dribbles, dribbles in different zones of the pitch.
2. **Data Cleaning:** Standardize player names, handle missing values, ensure consistent units and time periods.
3. **Univariate Analysis:** Look at each metric individually. What's the distribution of dribble attempts? Who are the outliers? What's the average success rate?
4. **Bivariate Analysis:** Plot metrics against each other. Attempts vs. success rate (are high-volume dribblers less efficient?). Dribbles vs. goals/assists (does dribbling translate to output?).
5. **Narrative Construction:** Arrange the findings into a story. Start with the big picture, zoom into surprising findings, highlight standout players, and end with actionable insights.
6. **Visualization Design:** Create clean, readable charts with proper titles, labels, and annotations. Every chart should make ONE clear point.

## What This Taught Me (And What It'll Teach You)

- **Exploratory Data Analysis methodology** -- systematic approaches to understanding unfamiliar data
- **Data visualization best practices** -- choosing chart types, color palettes, annotations, and layout
- **Statistical thinking** -- distributions, outliers, correlations, and what they mean
- **Data storytelling** -- arranging analysis into a compelling narrative with a clear point
- **pandas proficiency** -- groupby, pivot tables, filtering, aggregation, merging
- **matplotlib/seaborn mastery** -- creating publication-quality visualizations
- **Domain expertise communication** -- translating football knowledge into analytical frameworks
- **The EDA-to-insight pipeline** -- going from "I have data" to "I have a story"

## Interview Confidence Builder

**"Walk me through your EDA process."**
Start with shape/size of data, check data types and missing values, compute summary statistics, visualize distributions, look for correlations, identify outliers, form hypotheses, test them with targeted visualizations. Use this project as your example.

**"How do you choose the right visualization?"**
Comparison -> bar chart. Relationship -> scatter plot. Distribution -> histogram/box plot. Trend -> line chart. Composition -> stacked bar/pie. Part-to-whole -> treemap. Explain your reasoning for each chart choice in the dribbling analysis.

**"Tell me about a time you found an unexpected insight in data."**
Share a specific finding from this analysis. Maybe a player with a low reputation had elite dribbling stats, or a surprising correlation between dribbling and team defensive performance. The specificity makes it memorable.

**"How do you communicate technical findings to non-technical stakeholders?"**
This entire project is the answer. You took complex statistical analysis and turned it into a story a football fan could follow. Discuss: lead with the insight (not the method), use analogies, let visualizations do the heavy lifting, and always end with "so what."

**"What's the value of EDA before modeling?"**
EDA reveals data quality issues (missing values, outliers, wrong types), informs feature selection, suggests which models might work, and prevents you from building models on flawed assumptions. It's 60-70% of real-world data science work.

**"How do you handle outliers?"**
First, investigate whether they're errors or genuine extremes. In football, an outlier might be a world-class player (genuine) or a data entry error. Options: remove, cap/winsorize, transform (log), or use robust methods. The choice depends on context.

## Get Started

```bash
git clone https://github.com/tolani007/epl-dribbbling-analysis.git
cd epl-dribbbling-analysis
# Open notebooks/analysis files and explore the data story
```

## How This Connects

This is an early project in the **Sports Analytics** path -- pure EDA before predictive modeling. The insights here informed the feature engineering in [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor), and the data came from techniques developed in [ScrapingFBREF](https://github.com/tolani007/ScrapingFBREF). The visualization skills transfer directly to [epl-goalscoring-analysis](https://github.com/tolani007/epl-goalscoring-analysis-march-2023) and every other analytical project in the portfolio.
