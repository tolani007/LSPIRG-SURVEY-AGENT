# EPL Goalscoring Analysis
> Goals win games. But understanding HOW, WHEN, and WHERE goals happen -- that's what makes you a data scientist, not just a football fan.

## What I Built (and Why You Should Care)

I built a comprehensive visualization project analyzing goalscoring metrics for Premier League attackers. This wasn't just "who scored the most goals" -- it was a deep dive into the patterns behind goal production. Shot accuracy, expected goals (xG), conversion rates, goals from different body parts, goals from inside vs. outside the box. The kind of analysis that football clubs actually pay analysts to produce.

Why should you care even if you're not into football? Because this project is really about comparative performance analysis. Every industry does this: comparing sales reps' conversion rates, comparing marketing channels' ROI, comparing manufacturing lines' efficiency. The statistical techniques are identical. Football just makes it visceral and engaging.

This is also a masterclass in visualization design. When you have 15 metrics for 50 players, you need to make smart choices about what to show, how to show it, and what story to tell. That's the same challenge you'll face in any data analyst or data scientist role when building dashboards and reports.

## The Core Concepts - Explained Simply

**Expected Goals (xG):** This is the revolutionary metric in modern football analytics. Every shot gets assigned a probability of being a goal based on historical data: distance from goal, angle, body part, game situation, etc. A penalty might be 0.76 xG, a shot from 30 yards might be 0.03 xG. Sum up all the xG for a player's shots and you get their "expected" goals. If a player scores 15 goals from 10 xG worth of chances, they're overperforming -- they're either really clinical or really lucky.

**Conversion Rate:** Goals divided by shots. Sounds simple, but it reveals a lot. A player with a 25% conversion rate is elite. A player with 5% is either unlucky or needs to work on finishing. But context matters: if most of their shots are from distance, a low conversion rate might be expected. This is why you need multiple metrics together, never just one.

**Shot Accuracy:** Shots on target divided by total shots. This tells you how often a player even hits the frame. Combined with conversion rate, you get a complete picture: high accuracy + low conversion = the goalkeeper is saving everything. High accuracy + high conversion = clinical finisher. Low accuracy = either shooting from bad positions or just poor technique.

**Visualization Design Principles:** When showing player comparisons, you face a design challenge. With 20 players and 10 metrics each, you can't show everything at once. The solution: hierarchy. Start with the big picture (who scores the most), then drill into the interesting questions (who overperforms their xG, who is most efficient inside the box). Each visualization answers ONE question clearly.

**Statistical Distributions:** When you plot all attackers' goalscoring rates, you get a distribution. Most cluster in the middle, a few elite scorers sit on the right tail, and some underperformers sit on the left. Understanding where a player sits in this distribution -- and whether that position is sustainable -- is the core of performance analytics.

## How It Actually Works - Step by Step

1. **Data Gathering:** Collect Premier League attacker statistics: goals, shots, shots on target, xG, goals per 90 minutes, shot locations, goal locations, body part, etc.
2. **Metric Computation:** Calculate derived metrics -- conversion rate, xG over/underperformance, shots per goal, goals per 90 minutes (to normalize for playing time).
3. **Player Comparison Visualizations:** Bar charts ranking attackers by different metrics. Horizontal bar charts work well here because player names are readable.
4. **Relationship Analysis:** Scatter plots showing xG vs. actual goals (the diagonal line = performing exactly as expected, above = overperforming, below = underperforming).
5. **Efficiency Analysis:** Radar charts or grouped bars showing multiple efficiency metrics side-by-side for top attackers.
6. **Narrative Assembly:** Arrange visualizations to tell a story -- who's the best finisher, who's getting lucky, who's underrated, who needs better service.

## What This Taught Me (And What It'll Teach You)

- **Multi-dimensional performance analysis** -- evaluating subjects across many metrics simultaneously
- **xG and advanced football analytics** -- understanding probabilistic models applied to real events
- **Visualization hierarchy design** -- organizing complex data into a digestible narrative flow
- **Comparative analytics** -- benchmarking individuals against peers using statistical distributions
- **Normalization techniques** -- per-90-minute stats to fairly compare players with different playing times
- **matplotlib/seaborn advanced usage** -- custom color palettes, annotations, multi-panel figures
- **Insight extraction** -- going beyond descriptive stats to find genuinely interesting patterns
- **Presentation of findings** -- making data analysis accessible and engaging

## Interview Confidence Builder

**"How do you approach multi-dimensional comparison analysis?"**
Describe your methodology: start with a single key metric to rank, then add dimensions one at a time. Use scatter plots for two dimensions, radar charts for many dimensions, and tables for precise values. Emphasize that the goal is insight, not information overload.

**"Explain a time you normalized data for fair comparison."**
Per-90-minute normalization is the perfect example. A player who plays every minute has more opportunity to score than a substitute. Dividing by minutes played and multiplying by 90 gives you a "per full game" rate that's fair. Same concept applies in business: revenue per employee, cost per acquisition.

**"What is xG and how would you explain it to a non-technical person?"**
"Imagine every shot in football history from a certain position. If 100 players shot from exactly where this player shot, how many would score? That percentage is the expected goal value. Over a season, if a player's actual goals are way higher than their xG, they're either incredible or due for regression."

**"How do you decide what to visualize vs. what to leave in a table?"**
Visualize patterns, relationships, and distributions. Use tables for precise numbers and reference lookups. If you're trying to show "this player is better than that player," a chart is better. If you're trying to show "here are the exact stats," a table is better.

**"Describe your approach to building a data-driven argument."**
Start with a question/hypothesis. Show the big picture first (overview visualization). Then zoom into the evidence (detailed comparisons). Address counterarguments (what about playing time? what about team quality?). Conclude with a clear, evidence-backed claim. This analysis project follows exactly this structure.

**"How do you handle metrics that might be misleading?"**
Raw goal counts can be misleading because they don't account for playing time, shot quality, or team context. Explain how you layer multiple metrics: raw goals, goals per 90, xG, conversion rate, and qualitative context. No single metric tells the whole story.

## Get Started

```bash
git clone https://github.com/tolani007/epl-goalscoring-analysis-march-2023.git
cd epl-goalscoring-analysis-march-2023
# Open the analysis notebooks/files to explore the visualizations
```

## How This Connects

This pairs naturally with [epl-dribbling-analysis](https://github.com/tolani007/epl-dribbbling-analysis) as a companion EDA project. The insights about player quality feed into the feature engineering in [EPL-WinPredictor](https://github.com/tolani007/EPL-WinPredictor) -- understanding which metrics predict outcomes. The data sourcing techniques come from [ScrapingFBREF](https://github.com/tolani007/ScrapingFBREF). Together, these four projects tell a complete story: scrape the data, explore it from multiple angles, then build predictive models.
