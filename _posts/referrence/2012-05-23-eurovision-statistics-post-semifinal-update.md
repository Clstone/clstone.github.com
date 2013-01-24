---
layout: post
title: "Eurovision statistics: Post-semifinal update"
description: ""
category: nerdery
tags: [eurovision]
---
{% include JB/setup %}

This is part two of a series of posts describing a predictive model for the Eurovision Song Contest. The full set of posts can be found [here][ev].

### So how'd we do?

Last time I showed a model that gave probabilistic predictions for the Eurovision Song Contest, based on evidence from previous years' voting. The first semifinal is over now, so we can see how well the model did predictively. Unfortunately, the full scores for the semifinals won't be released until after the final, but we can still look at which countries qualified, and make a judgment from that.

The ten countries which were most likely to qualify according to the model, in descending order of probability, were: Romania (74%), Greece (73%), Albania (67%), Moldova (65%), Russia (63%), Iceland (60%), Denmark (59%), Hungary (54%), San Marino (53%) and Israel (52%). Of these, the first eight did indeed qualify, and the last two were replaced by Ireland and Cyprus, which had predicted probabilities of 52% and 51% respectively. If anything, this is evidence that the model is being too conservative with its predictions; if the probabilities were correct, we should expect to only get six or seven right.

In any case, the model seems to have passed its first test, even if it was an easy one. Now we can look forward to the second semifinal on Thursday, and the final on Saturday night.

### The more you know

What extra information do we now have that can improve our predictions? While in a strict Bayesian sense we have learned more about voting patterns, and therefore should be able to improve our predictions for the second semifinal, in practice it's just about impossible to extract any relevant information from what we learned yesterday. On the other hand, we've learned quite a lot that can inform our predictions for the final.

At the most basic level, we know that eight countries have been knocked out. The probability that the winner is Montenegro, Switzerland, Belgium, Latvia, Finland, Austria, Israel or San Marino is now zero, and the probabilities for everyone else shuffle a bit accordingly. We've also learned a little bit about the ten songs which have qualified. For example, they can't be completely terrible. If they had extremely low quality scores, they would have been knocked out.

Using the same 10,000 simulation runs as last time, we can look at the quality distributions for the qualifying countries, and identify the marginal distributions: how likely it is that they have a song of a given quality, given that they qualified.

![Marginal distributions of song quality][qualmargins]

These are the distributions of song quality for each of the ten qualifiers. The overall shapes should look identical, but because we're only using 10,000 samples, there's a little bit of noise. The green areas show the simulation runs in which each song qualified. Our best estimate for the quality of each of the songs is now the green distribution, which is always to the right of the overall distribution.

In particular, the countries which were "surprise" qualifications, Ireland and Cyprus, have marginal distributions with much higher average quality than the full distribution. On the other hand, we really haven't learned much about Romania or Greece. We always expected them to qualify, so the information that they actually did doesn't tell us much about their song quality.

Sadly, marginalising over all ten qualifications at once doesn't work as easily. If we look at just the model runs with this particular set of qualifiers, we're down to four runs, and I'd be foolish to draw any conclusions from these. Instead I've generated a new set of 10,000 model runs, with the song qualities for the songs which have already qualified selected from the marginal distributions above.

Strictly speaking, this is not the correct thing to do. In doing this, I'm implicitly assuming that the qualification prospects of each country are independent, when in reality they're not. However, I'm just going to gloss over this detail, and hope it doesn't come back to haunt me later. It's certainly not the worst approximation I've made when building this model.

### The new order

Again, we can look at the probability of winning in the final for each country. This time round I've colour-coded the countries by their qualification route. Green shows the countries which qualified in the first semifinal, red shows the countries that have yet to qualify, and black shows the automatic qualifiers.

![Winning probabilities after first semifinal][winnerpostsf1]

The clearest thing is that the countries which have already qualified are much more likely to win than those which haven't. So much, so obvious. It's maybe a little less obvious that the countries which qualified yesterday are in a better position than the automatic qualifiers. Those six songs are complete unknowns—as far as we know they could be horrendously awful. The songs which got through the qualifiers, on the other hand, have passed a basic sniff test. That raises their victory chances by quite a bit.

There's also been a bit of a shift in the order of things. Some of the less likely qualifiers from yesterday, such as Hungary, Cyprus and Ireland, have jumped up the table. These countries had a tough qualification battle, and the fact that they succeeded bodes well for them in the final. There's also been some rearrangement of the other countries, but it's hard to tell how much of this is just random differences between two sets of simulations, and how much is real. Still, it's easy to imagine that Sweden have benefitted from Finland's exit, and you can tell similar stories about other countries.

### Wrapping up

A few people have contacted me with suggestions of ways to improve the model. Some have suggested new sources of information, such as the performer's age, gender, style of music, etc. Others have suggested systematic changes to the model, such as varying the distribution of song quality by country, or having time-dependent friendship factors. One point which has been raised repeatedly is that the voting system has changed between pure televoting and a mixed jury/phone-in system over the years. Modelling this is an obvious next step. If anyone is aware of the details of how the jury and phone votes are combined, I'd be interested to hear about it in the comments.

I'm unlikely to make significant changes to the model before the final, but I am interested in possible improvements. Suggestions which come with the data required to put them into practice are particularly welcome.

Finally, I should make some predictions for the second semifinal. On the basis of the model runs so far, it looks like Bosnia-Herzegovina (77%), Serbia (72%), Turkey (70%) and Macedonia (66%) are fairly safe bets. The next four, Georgia (60%), Belarus (58%), Ukraine (56%) and Slovakia (56%) are reasonably likely as well. The final two slots go to Estonia (55%) and Sweden (53%), but those are a bit shakier. I wouldn't be surprised to see something else come through from further down the table, maybe Croatia (51%) or Norway (50%).

---

[Next post in the series][next]


[ev]: /tags.html#eurovision-ref

[previous]: /nerdery/2012/05/20/ive-got-eurosong-fever-ted/
[next]: /nerdery/2012/05/24/eurovision-statistics-final-predictions/

[qualmargins]: /assets/images/eurovision/qualmargins.png
[winnerpostsf1]: /assets/images/eurovision/winnerpostsf1.png