# Ghana Cocoa Sustainability
> A data investigation into whether cocoa farming in Ghana can be both profitable and sustainable -- because the numbers tell a story that policy debates alone cannot.

## What I Built (and Why You Should Care)

I built a data-driven investigation into cocoa yield and sustainable profitability in Ghana. Ghana is the world's second-largest cocoa producer, and cocoa is the backbone of its rural economy. But here is the tension that most people do not see: global demand for chocolate keeps growing, while the farmers who grow the cocoa often earn less than $2 a day. Yields per hectare have been stagnating or declining in many regions. Climate change is shifting the growing zones. And the pressure to expand farmland pushes into forests that the planet needs.

This is not just an agricultural problem -- it is an economics problem, a climate problem, and a human welfare problem wrapped into one. And the only way to untangle those threads is with data. That is what this project does. I gathered cocoa yield data, economic indicators, sustainability metrics, and climate variables, then conducted an exploratory data analysis that asks the hard questions: What drives yield variation? Where are the most productive regions and why? What is the relationship between yield and profitability? Can sustainable farming practices maintain or improve yields?

Why should you care as a data professional? Because domain-specific EDA on a real-world policy question is one of the most valuable skills you can demonstrate in an interview. It shows you can take a messy, multi-dimensional problem, define the right questions, find the data, clean it, analyze it, and communicate findings that could actually influence decisions. This project is my proof that I can do exactly that.

## The Core Concepts - Explained Simply

### Agricultural Data Analysis
Agricultural data is uniquely challenging. It is seasonal (cocoa has specific harvest windows), geographically variable (soil type, rainfall, and altitude all matter), and subject to external shocks (pest outbreaks, price crashes, policy changes). Analyzing it requires thinking about time series, spatial patterns, and confounding variables simultaneously.

Imagine you are trying to understand why a student's grades vary. Is it the teacher? The subject? How much they slept? What they ate? Agricultural yield analysis is the same kind of multi-factor investigation. Cocoa yield depends on rainfall, soil nutrients, tree age, farming practices, pest management, and economic incentives (if the price is too low, farmers under-invest in their farms). Teasing apart these factors is the analytical challenge.

### Sustainability Metrics
Sustainability is one of those words that means everything and nothing. I define it concretely with measurable indicators:
- **Yield per hectare:** Are we producing more or less cocoa per unit of land over time? Declining yield means farmers must clear more forest to maintain production.
- **Input costs vs. revenue:** Can farmers afford fertilizer, pesticides, and labor at current cocoa prices? If not, they cut corners and yields drop further -- a vicious cycle.
- **Deforestation rate:** How much forest is being cleared for new cocoa plantland? This measures environmental sustainability.
- **Soil health indicators:** Are farming practices depleting the soil or maintaining it? Soil depletion causes long-term yield decline.
- **Farmer income:** At the end of the day, sustainability means farmers can make a living. If they cannot, they abandon cocoa for other crops or migrate to cities, and the entire supply chain collapses.

### Yield Analysis
Yield analysis is the core analytical thread. I look at cocoa yield (tons per hectare) across regions, time periods, and farming practice categories. The goal is to identify what separates high-yield farms from low-yield farms. Is it the age of the trees? (Cocoa trees peak in productivity between 5-25 years, then decline.) Is it fertilizer use? (Many Ghanaian farmers cannot afford adequate fertilization.) Is it shade management? (Cocoa is traditionally grown under shade trees, which helps biodiversity but may limit yield compared to full-sun monoculture.)

Think of yield analysis like a medical diagnosis for the farming sector. Low yield is the symptom. The data helps me trace back to the underlying causes -- and those causes point to potential interventions.

### Economic Modeling
I build simple but revealing economic models: given current cocoa prices, input costs (fertilizer, labor, tools, transport), and average yields, what is a farmer's net income per hectare? I vary the inputs to run scenarios: What if global cocoa prices drop 20%? What if a government subsidy reduces fertilizer costs by 30%? What if adopting improved farming practices increases yield by 15%?

This is sensitivity analysis, and it is incredibly powerful for policy discussions. Instead of arguing in the abstract about whether a subsidy program is "worth it," I can show exactly how many farmers cross the poverty line under each scenario. Data makes the invisible visible.

### Domain-Specific EDA (Exploratory Data Analysis)
EDA in a domain like this is more than making histograms. It requires asking domain-informed questions:
- Are there regional clusters of high yield, and do they correlate with specific soil types or rainfall patterns?
- Is there a time trend in yield -- is it improving, declining, or stable?
- What is the distribution of farm sizes, and does size correlate with yield efficiency?
- Are there outlier regions that achieve unusually high yield, and what can we learn from them?
- How does the farmgate price (what the farmer receives) compare to the export price?

Each question leads to a visualization, a statistical test, or a deeper drill-down. The EDA is the conversation I am having with the data, and the notebook documents both sides of that conversation.

### Data-Driven Policy Recommendations
The culmination of this project is not a model -- it is a set of evidence-based recommendations. These might include: invest in farmer training programs in regions with the largest yield gaps, target fertilizer subsidies to farms with the highest marginal return, protect forest corridors by incentivizing shade-grown cocoa (which is both more sustainable and fetches premium prices), or reform pricing structures to ensure a larger share reaches farmers.

The key insight: policy recommendations backed by data carry weight that opinions alone do not. This project teaches you to build that kind of evidence base.

## How It Actually Works - Step by Step

1. **Data gathering.** Collect cocoa production data (national and regional yield, production volume, cultivated area), economic data (cocoa prices, input costs, farmer income surveys), and sustainability indicators (deforestation rates, soil health, climate data).
2. **Data cleaning.** Handle inconsistencies in reporting periods, unit conversions (metric tons vs. bags of cocoa), missing regions, and data source discrepancies. Agricultural data is notoriously messy.
3. **Regional analysis.** Map yield by region to identify high-performing and underperforming areas. Overlay with rainfall, soil type, and farming practice data to generate hypotheses about what drives variation.
4. **Time series analysis.** Plot yield trends over years/decades. Identify inflection points (policy changes, price shocks, pest outbreaks) that correspond to yield shifts.
5. **Economic analysis.** Build cost-revenue models for typical farms. Calculate net income under different price and yield scenarios. Identify the break-even yield at current prices.
6. **Sustainability assessment.** Quantify the relationship between yield intensification and environmental indicators. Is higher yield per hectare associated with less deforestation pressure?
7. **Scenario modeling.** Run what-if analyses: What if yields improve 20% through training programs? What if cocoa prices drop due to oversupply? What if climate change shifts the optimal growing zone northward?
8. **Insight communication.** Synthesize findings into clear visualizations and narrative that a policymaker (not a data scientist) could act on.

## What This Taught Me (And What It Will Teach You)

- **EDA is an art, not a checklist.** Good EDA is driven by domain curiosity and hypothesis formation, not by running every possible plot. Each analysis should answer a question or generate a new one.
- **Context transforms numbers into meaning.** A yield of 0.4 tons per hectare means nothing until you know the global average is 0.5 and the theoretical maximum is 2.0. Context is how you turn data into insight.
- **Agricultural data is messy in unique ways.** Seasonal patterns, geographic variation, inconsistent units (bags vs. tons), and data scarcity in rural regions all create challenges that generic data cleaning tutorials do not cover.
- **Economic modeling does not require a PhD.** Simple cost-revenue calculations and sensitivity analyses can generate powerful insights that inform real decisions. The math is basic; the insight is sophisticated.
- **Data storytelling matters.** The most rigorous analysis is useless if you cannot communicate it clearly. I learned to structure my notebooks as narratives: setup the question, walk through the evidence, and deliver a clear conclusion.
- **Sustainability is quantifiable.** Moving from vague aspirations ("we want sustainable cocoa") to measurable indicators (yield per hectare, farmer income, deforestation rate) is a skill that transfers to any domain where "sustainability" is in the conversation.

## Interview Confidence Builder

**Q1: Walk me through an exploratory data analysis you conducted.**
Start with the business question: "What drives cocoa yield variation in Ghana?" Describe the data sources. Walk through the analytical steps: distribution analysis, regional comparison, time series trends, correlation between yield and potential drivers. Share a key insight: for example, that tree age and fertilizer access explain more yield variation than climate variables. Emphasize how each analysis step was driven by a hypothesis, not just a default checklist.

**Q2: How do you handle messy, real-world data?**
I profile the data first: check data types, null rates, value distributions, and cross-source consistency. For this project, I dealt with inconsistent units (metric tons vs. bags), missing regional data, and reporting periods that did not align across sources. I document every cleaning decision and create validation checks so I know my cleaning did not introduce artifacts.

**Q3: How would you build an economic model for agricultural policy?**
Define the unit of analysis (farm, region, country). Collect cost components (inputs, labor, transport) and revenue components (yield x price). Build a baseline profitability model. Then run sensitivity analysis: vary price, yield, and input costs independently and together. Identify break-even points and threshold effects. Present scenarios to stakeholders as "if X happens, then Y follows."

**Q4: What is the difference between correlation and causation in agricultural data?**
Regions with higher rainfall might have higher yield -- but is it the rainfall causing higher yield, or is it that wetter regions also have better soil and more investment? I handle this by controlling for confounding variables (comparing yield within similar soil types), looking for natural experiments (policy changes that affected some regions but not others), and being explicit about the limitations of observational data.

**Q5: How do you communicate data findings to non-technical stakeholders?**
Lead with the insight, not the method. "Farmers in the Western region earn 30% less per hectare than the national average, primarily due to aging cocoa trees" is actionable. "I ran a multivariate regression with 12 features and got an R-squared of 0.67" is not. Use clear visualizations (maps for geographic data, trend lines for time series, bar charts for comparisons). Always include a "so what" -- what should the audience do with this information?

**Q6: How do you approach a problem in a domain you are not an expert in?**
Read domain literature to understand the key variables and relationships. Talk to domain experts if possible. Start with basic EDA to build intuition about the data before applying sophisticated techniques. Use the data to challenge assumptions -- sometimes the conventional wisdom in a domain is wrong, and the data shows it.

**Q7: What is sensitivity analysis and when would you use it?**
Sensitivity analysis tests how robust your conclusions are to changes in assumptions. I vary key inputs (cocoa price, yield, input costs) one at a time and observe how the output (farmer profitability) changes. If a small change in cocoa price swings profitability from positive to negative, that tells me the system is fragile and price stability is critical. It is useful whenever your model depends on uncertain inputs -- which is always in real-world analysis.

## Get Started

```bash
git clone https://github.com/tolani007/ghana-cocoa-sustainability.git
cd ghana-cocoa-sustainability

# Install dependencies
pip install jupyter numpy pandas matplotlib seaborn

# Open the analysis notebook
jupyter notebook

# Follow the analysis flow:
# 1. Data loading and cleaning
# 2. Regional yield analysis
# 3. Time series trends
# 4. Economic modeling
# 5. Sustainability assessment
# 6. Policy recommendations
```

## How This Connects

This project is the **policy and economics counterpart** to my **Cocoa Contamination AI Detector**. That project uses computer vision to help farmers identify disease; this one uses data analysis to help policymakers understand the economic and sustainability dynamics of the cocoa sector. Together, they represent a full-stack approach to agricultural data science: AI for the field and analytics for the boardroom. The **EDA and data cleaning skills** draw directly from my **Data Engineering Vault**. The **economic modeling** uses the same analytical thinking as the customer value modeling in my **Instacart Customer Behaviour** project -- cost-revenue analysis, scenario modeling, segmentation. And the **data storytelling** discipline I built here informs how I communicate findings across all my work. If you want to see data science applied to a problem that genuinely matters to millions of people, this is the project to explore.
