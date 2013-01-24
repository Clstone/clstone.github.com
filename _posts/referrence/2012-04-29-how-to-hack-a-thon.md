---
layout: post
title: "How to Hack a Thon"
description: ""
category: kaggle
tags: [hackathon]
---
{% include JB/setup %}

Yesterday was the [EMC Data Science Global Hackathon][hackathon], a 24-hour predictive modelling competition, hosted by [Kaggle][kaggle]. The event was held at about a dozen locations globally, but a large number of competitors (including myself) entered remotely, from the comfort of their own coding caves.

I finished in fourth place globally, knocked out of third at the last minute by a horde of Australian data scientists. The code I used is now available on [GitHub][github], and I'm going to use this post to talk through some of the decisions I made along the way.

### The problem

The overall goal is to predict (anonymised) measures of air quality over a three day period, given eight days of previous history of these measures, along with some meteorological data. The meteorology isn't available for the prediction period though, so I decided to leave it out of my model. The dataset is relatively small, with about 700,000 total measurements in the training data, and about 40,000 values to predict. Even with terrible code driven by time pressure, I had trouble writing anything that took more than 15 minutes to run.

The tricky part about the dataset was that there are a lot of missing values. Of the 4009 different time series, only 776 give a complete 8 day record with no gaps, and over a thousand are missing a day or more. This sort of problem is common in real world data, and mechanisms for dealing with it can easily take as much effort and ingenuity as the actual modelling itself. It's also an enormous source of bugs, as I discovered around two o'clock this morning.

### A simple start

The first thing I did was build a series of extremely simple baseline models based on summary statistics of the data. I focused on the medians of variables, rather than the means, because of the error metric (mean absolute error). The purpose of these models was partially to get something quick and simple up on the leaderboard, but mostly to provide a fallback model for when fancier models fail due to lack of data.

I calculated medians for each variable, grouped by hour, 8-day chunk, month, hour and chunk combined, and hour and month combined. Then I took a weighted median of the five predictions, weighting by the reciprocal of the error as calculated on the training data. This is technically a bad thing to do, as we're evaluating the model on the same data used to fit it, but I was in a hurry and didn't really care. I also vaguely looked at using day of the week as a predictor, but didn't bother following through.

Surprisingly this baseline model, which is barely a model at all, put me in eighth place on the public leaderboard at the halfway point. I took a break at this stage to eat some food, watch some TV, and ruminate on what a real model would look like.

### ARIMA

By the time I got back, I had slipped to twelfth place, and things were hotting up at the top of the board. I had decided to fit [ARIMA][arima] models to the data, as they're a reasonably good generic time series tool, and I knew that R could fit them quickly and easily. 

It took an embarassing amount of time (about 5 hours) to get this working without crashing. The handling of missing data in R is quite finicky, and I spent far too long debugging things and catching every possible problem. I think the lesson learned here is that I need to either improve my R debugging skills, or learn to write R code which is easier to debug.

Before fitting the ARIMA models, I transformed the data onto a log scale. This is usually a good way to work with concentrations, which is what I assumed the target variables were. It certainly made their histograms look more reasonable, and with time short that was good enough for me. I replaced zeros and negative values with the smallest positive value in each dataset to avoid infinities in the transformed data. I then filled in missing values using spline interpolation in the log space. If there were too many missing values, I simply fell back to predicting the median of the data available.

To begin with, I fitted a (1,0,1) × (0,1,1) seasonal ARIMA model with a 24-hour period, using the `arima0` function from R. This particular choice of order was made very unscientifically, after playing around with a few different choices on the training data, and choosing the one I liked the look of best. I fitted a separate model to each time series, and predicted 72 hours into the future. The results put me up to thirteenth on the leaderboard (I had previously slipped to fifteenth), which was much worse than I had expected.

### Post-processing

Looking at the predictions, it was clear why the score wasn't as good as it could be. For some time series the ARIMA model was predicting explosive growth, in some cases giving predictions which were fifty times larger than anything in the training data. This seemed unlikely to me, so I clamped the predictions for each time series to the bounds of the observed data. This little change brought me up to 9th place.

The next experiment I tried was a simple blend. I took the results of the clamped ARIMA fit and the weighted median baseline model and averaged them. I didn't expect this to improve things much, but it moved me up to seventh place.

I guessed that the reason for this was that the ARIMA model was making very bad predictions for the later part of the time series. Ideally, the predictions would regress towards the long term average as the prediction window moves further out. Rather than try to calculate properly how this process should work, I went with a quick and dirty approach I called "cross-fading". 

I set the solution to the ARIMA fit at the first predicted hour, and the weighted median fit at the last. For the in-between times, I linearly interpolated between the two fits as a function of time. My initial submission with this technique gave horrible results, before I realised that I'd done the interpolation backwards. Once I fixed that, I jumped up to fifth place.

The next thing I tried was a silly little trick which came to me in a moment of sleep-deprived inspiration. All of the target variables seemed to take a discrete set of values. Looking at the distribution of these values, it was clear that all the measurements for each variable were multiples of some discrete unit. I back-calculated what each unit was, and used that to round my predictions. This did give a very small boost to my score (0.0003!) but wasn't enough to move me on the leaderboard.

### Final submission

At this point I had two submissions remaining. I went back to playing around with ARIMA parameters, and discovered that I could get pretty good fits to the early part of time series using a (1,0,1) model with no periodic component. I tried cross-fading that with the weighted median fit, and rounding the result, but it performed less well than the previous fit.

As a last-ditch attempt to squeeze some value out of this model, and because I was tired and wanted to go to bed without having to code up anything new, I blended the periodic ARIMA model with the aperiodic one in a two-to-one mix, then cross-faded with the weighted median model and rounded. This was my final submission, and it jumped me to third place on the leaderboard. It was six o'clock in the morning and I went to bed.

When I woke up six hours later, I found that with one minute and sixteen seconds left in the contest, the 'feeling_unlucky' team had leapfrogged me for third place. Congratulations to them, and to Ben Hamner and James Petterson, who took the top two spots.

The code I used, in all its hacky glory, is available on [GitHub][github]. Feel free to gawp and stare, but please don't send me any bug reports.

#### Postscript

It turns out that the two-to-one mix I chose for the final blend is damn near close to optimal. Experimenting after the deadline, I see that I can improve the score by 0.00007 by switching to a five-to-two blend, but two-to-one beats everything simpler. Score one for blind intuition.

[hackathon]: https://www.kaggle.com/c/dsg-hackathon
[kaggle]: http://www.kaggle.com/
[github]: https://github.com/mewo2/airquality
[arima]: http://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average