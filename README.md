<h1 align="center">Hi 👋, I'm THAPA Sanuz</h1>
<h3 align="center">Student of Behavioral Economics at UFC, Besançon</h3>

---

### 🔭 About the Project

Data analysis of Wage in different catagories with Dahsboard using shiny and R 

---
#### Methodology used in this project:
-  Upload Section of Data (not all datas may be compatable as its a wage analysis)
- All the manipulation and analysis cann be done in web browser rather that Rstudo and vscode.
- Dynamically filter the wages with slide bar.
- can select/remove the variables by ticking(Results changes dynamically)
- Comparison between two can be done in webb itself
- Residulas Hiostogram
- Coreelation plot of data in web
-Download the processed data in csv format.
---
### Easy Navigation :

# Data Analysis in R with shiny (Web Application) 

## Table of Contents
- [Dashboard overview](#Dashboard)
- [upload Section](#introduction)
- [Data Summary](#Data Summary)
- [Dynamic Boxplot](#Dynamic Boxplot)
- [Dynamic Regeresiion model ](#Dynamic Regeresiion model)
- [Model Comparison](#Model Comparison)
- [Correlation Plot](#correrelationplot)
- [residuals Hoistogram](#residual histogram)

## Introduction
This exercise focuses on analyzing Wage in the dataset Dynam,ically through web version.
Shiny is a powerful app library in R which helps in creating web version application for our R Models. Which makes it userfriendly adn no specefic R knowlede is required to navigate and use through Web as its userfriendly.

#### 1. **`r4_eec.CSV ** Wage Information):
- Contains details about all potential Sallarided with other information like gender, Timeworked .
       Age = AGE,
       Diploma = DDIPL,
       Wage = SALMEE,
       Gender = SEXE,
       Worktime = TPP
       ** Data seesm to be messy and unorganized **
---

## Dashboard Overview
![Dashboard Overview](https://github.com/sanuzthapa/Web-Dashboard-using-Shiny-in-R/blob/main/images/Dashboard.png)

## Upload Section
csv can be uploaded from the external storage 
  
![Upload Section](https://github.com/sanuzthapa/Web-Dashboard-using-Shiny-in-R/blob/main/images/upload.png)

## Data Summary
Detailed Qu, Median ,Mean , Active, 3rd Qu. are shown ion the dashboard from the data.

![Upload Section](https://github.com/sanuzthapa/Web-Dashboard-using-Shiny-in-R/blob/main/images/img3.png)

##  Dynamic Boxplot

Boxoplot will be dynamically generated whn the slider in the filter is used, Which makes this applicatiuon quite dynamic and user freindly.

<div style="display: flex; justify-content: center; gap: 10px;">

<img src="https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i3boxplot.png" alt="Dynamic Boxplot 1" width="45%">
<img src="https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i4boxplot.png" alt="Dynamic Boxplot 2" width="45%">

</div>


## Dynamic Regeresiion model 
All the Variables are selectable and unselectable, and accordingly it will be adfdded to our model an ddata changes dynamicaslly.
<img src="https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i5regressionallcheck.png" alt="Dynamic Boxplot 1" width="45%">
<img src="https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i5regressionHalfcheck.png" alt="Dynamic Boxplot 2" width="45%">
  
## Model Comparison  
here two models are taken into consideration,

model <- lm(Wage ~ Female + Age, data = eec)
model2 <- lm(Wage ~ Female + Age + Study_nodiploma + Study_brevet + Study_capbep + Study_bac + Study_superieur, data = eec)

![Age Group vs Score ](https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i6modelComparison.png)



## residuals Hoistogram
![Age Group vs Score ](https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i6residual.png)

## Correrelation Plot
  ![Age Group vs Mean Review](https://github.com/sanuzthapa/PowerBi-Dahsboard/blob/main/img/i7Correlation.png)

## Conclusion
Summary of findings and insights from the analysis.


### 💬 Connect with Me:
- 📫 **Email**: [sanuzh.thapa@gmail.com](mailto:sanus.thapa@gmail.com)  
- 🌐 **LinkedIn**: [www.linkedin.com/in/sanuz-thapa](https://linkedin.com/in/sanuz-thapa)  

---

### 🛠️ Languages and Tools:
shiny
tidyverse
DT
corrplot

---
