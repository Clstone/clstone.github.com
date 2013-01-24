---
layout: post
title: "Eurovision statistics: after the final"
description: ""
category: nerdery
tags: [eurovision]
---
{% include JB/setup %}

This is part four of a series of posts describing a predictive model for the Eurovision Song Contest. The full set of posts can be found [here][ev].

### They think it's all over

The final is over, the dust has settled, and Sweden's Loreen has won the 2012 Eurovision Song Contest. Congratulations to her—it wasn't my favourite song on the night, but it's a worthy winner, and obviously very popular across Europe.

Mostly I'm pleased because now I can test the model against new data. How did it perform? I'm going to put off doing a full evaluation because I don't yet have the full results in a convenient form, but we can still look at some fairly simple measures of success.

First, though, I want to talk about the "Malta thing". In the [model predictions for the final][predictions], Malta was given a relatively high probability of victory—in fact they were ranked as the second most likely winners. As this was fairly counterintuitive, given their lack of strong friendship links, I picked out this prediction and tried to explain how it came about.

This prediction caused quite a stir in Malta, with a [story in the Times of Malta][timesofmalta] and over 16,000 pageviews from Malta[^1] on Saturday alone. Many took this as good evidence that Malta were going to do well in the contest, and some people were rather annoyed with me when they did not. 

I'd like to apologise if I misled anyone. I didn't expect anyone to take the model predictions particularly seriously, and if I had known, I would have included some more caveats and explanations of exactly what the model was predicting. Instead, I was fairly loose and jokey about the model results, and didn't really talk about what they meant in real terms. Sorry, guys.

### Risky strategies

The case of Malta does bring up an interesting point about the Eurovision results which isn't widely understood. How is it possible for the second most likely winner to come 21st? We can ask similar questions about Norway (3rd most likely winner, came last) or Denmark (4th most likely winner, came 23rd). Is this a failure of the model, or is it a feature of the system as a whole? It turns out that it's the latter—in general, countries which are more likely to win are also more likely to do extremely badly.

I've plotted the distribution of each country's placing in 10,000 simulation runs of this year's final:

![Simulated rankings][rankprobs]

The green bars show the place that each country actually achieved. The final bar for France is actually clipped, as the model predicted a 38% chance that they would come last.

There are essentially three kinds of distribution here. The first covers the Big 4 (France, Germany, Spain, UK). These countries have few inbound friendship links, and qualify automatically for the final. This means that they have a rather large chance of coming dead last. Their placing distribution reflects this, with a large peak in the lower ranks. It's still possible for these countries to do well, but automatic qualification means that their worst songs don't get weeded out early, and they have to compete with the best of the rest of Europe.

The second kind of distribution is associated with countries which have a lot of friendship links, both positive and negative. The best examples of this are Balkan countries, such as Macedonia and Albania. These countries have enough guaranteed votes to prevent them from ever coming last. However they also have enough negative links to prevent them from gathering points outside of their friendship circle[^2]. As such, they sit squarely in the middle of the table, year after year.

The third and final kind of distribution is the one which all of our likely winners display. Malta and Sweden are perfect examples of this. In statistical terms, this distribution is *bimodal*. There are two peaks in the distribution: one in the high rankings, and one in the low rankings. These countries have very variable results. Either they do well, in which case they place very highly, or they do badly, in which case they place very low.

This last group is where the winner usually comes from. Countries from the second group are perpetual also-rans. It's impossible to win with a consistent middle-of-the-road performance. You'll usually do well, often better than a lot of countries from the third group[^3], but there are enough countries with high variability that one of them is usually going to do well. It's just very hard to predict which one.

I realise this is probably little consolation to fans of these countries who have just seen them crash and burn, but take solace in the fact that you at least have a shot next year, unlike poor Macedonia, which looks to be relegated to a future of constant 13th place finishes.

### Evaluation

Looking again at the distributions above, the most surprising thing from the model perspective is that Norway came last. This was a fairly unlikely outcome, coming up in only 1% of simulations. I think that the reason the model underestimated this probability is the strange nature of the voting relationship between the Scandinavian countries. Although on average they give each other more points than might be expected, this relationship is really quite variable on a year-to-year basis. This isn't captured by the model, which assumes a constant level of friendship, rather than the wild mood swings which characterise Nordic relations.

We can also look at the ten most likely 12s that the model predicted:

 *  Iceland → Denmark (Only 5! Denmark did do pretty badly this year)
 *  France → Turkey (5 again, the lowest since 1999)
 *  Azerbaijan → Turkey (Yes.)
 *  Germany → Turkey (8, the lowest since 2001)
 *  Belarus → Russia (Yes. Of Belarus' 58 points, 46 stayed in the former USSR)
 *  Moldova → Romania (Yes)
 *  Macedonia → Albania (Yes)
 *  Romania → Moldova (Yes)
 *  Greece → Cyprus (Yes)
 *  Cyprus → Greece (Of course)
 
Seven out of ten predictions were correct. Turkey seems to have underperformed with its diaspora in the west—its other habitual donors such as Belgium, Netherlands and Switzerland also ranked it relatively low. It's possible that the song, which seemed less traditionally Turkish, didn't provoke the same enthusiasm among emigrants as in previous years.

In terms of the five "bellwether" countries, Hungary, Slovakia, Israel, Malta and Belgium, all but Malta gave twelve points to Sweden. In contrast, only eighteen out of the forty-two countries voting did so. This is a reasonable vindication of the model performance, although the probability of doing this well with five randomly selected countries is still around 11%.

### Coming up next time

There's still a more comprehensive evaluation to do, but it will have to wait for a few days. I'll also try to dig into what we can expect for next year's contest.

[^1]: The population of Malta is approximately 450,000, so this is a significant proportion of the island.

[^2]: These negative links are probably more due to cultural incomprehension than active animosity. I don't think anyone west of Vienna truly understands [turbo-folk][turbofolk] as a musical genre.

[^3]: Macedonia actually came ahead of Sweden in the majority of simulations.

[ev]: /tags.html#eurovision-ref

[predictions]: /nerdery/2012/05/24/eurovision-statistics-final-predictions/

[timesofmalta]: http://www.timesofmalta.com/articles/view/20120526/local/sweden-tops-eurovision-predictions-but-is-malta-second.421407
[turbofolk]: http://en.wikipedia.org/wiki/Turbo-folk

[rankprobs]: /assets/images/eurovision/rankprobs.png
