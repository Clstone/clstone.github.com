---
layout: post
title: "Eurovision statistics: final predictions"
description: ""
category: nerdery
tags: [eurovision]
---
{% include JB/setup %}

This is part three of a series of posts describing a predictive model for the Eurovision Song Contest. The full set of posts can be found [here][ev].

### Keeping score

Last time round, I compared my model's original predictions to the results of the first semifinal. It managed to predict eight of the ten qualifiers correctly, which is significantly[^1] better than the five or six that random guessing would give, and seemed to compare well with the numbers I was seeing on Twitter for human predictions (which have the benefit of knowing what the song sounds like).

This time around the model's predictions were not quite as good. It correctly predicted that Bosnia-Herzegovina, Serbia, Turkey, Macedonia, Ukraine, Estonia and Sweden would qualify. However, it failed to predict Norway, Malta or Lithuania. Seven out of ten is still better than random though, and fifteen out of twenty is a fairly respectable overall score. There's about a 1% chance of doing this well by random guessing.

### What did we learn today?

Just like last time, we can look at how our knowledge about the songs' quality has changed, now that we know that they've qualified.

![Marginal distributions of song quality][qual2margins]

The green areas show the marginal distribution of song quality, given that the songs have qualified. We've learned next to nothing about the Balkan qualifiers: those guys were always going to get through on each others' coattails. The less expected qualifiers, on the other hand, must have pretty well-liked songs if they got through. In particular, the two Baltic countries, Lithuania and Estonia, have expected scores over 1.5. This raises their victory chances by quite a lot.

### The final countdown

I've used these marginal distributions to feed the model and produce a final set of predictions.

![Final win probabilities][finalwinprobs]

Sweden have jumped back into the lead, having now qualified for the final. They're joined in a very close second place by Malta, one of the surprise qualifiers from the second semifinal. Malta have very few strong inbound friendship links, either positive or negative. This means that their chances of victory are more sensitive than most to song quality. The fact that they qualified from what should have been a fairly tough semifinal shows that they've got a well-liked song, with a reasonable shot at winning the whole contest.

Overall, it looks likely that next year's contest will be in Scandinavia, with Sweden, Denmark and Norway all having decent chances. The Balkans are not looking quite so good, nor are the Soviet bloc. In fact, this might be one of Western Europe's best contests in a while.

### Reading the signs

I had hoped to take a look at what the first few countries to report votes would tell us about the eventual winner. Unfortunately, there's been a change to the format this year. Rather than the votes being shown in a predetermined random order, the order will be chosen to "maximise the excitement" once the jury votes are known, meaning that the early votes could be chosen to be deliberately misleading.

We can still look to see which countries are likely to be the most reliable indicators of the final winner. Looking at 10,000 simulation runs, I've calculated the probability that each country gives 12 points to the eventual winner.

![Bellwether probabilities][bellwether]

There are a few countries which are very unlikely to pick the winner. The probability that Cyprus gives 12 points to the winner is pretty much synonymous with the probability that Greece is the winner, given typical Cypriot voting behaviour. Similarly, the former Yugoslavia is probably going to exchange 12s among itself, and given how unlikely it is that the winner will come from this region, the chances are low that one of these will hit the jackpot.

There is, however, a clear group of five countries whose votes are better indicators of how the contest is going than any of the others. The strongest two are both "unaligned" Central European countries, Hungary and Slovakia. It's likely that if they were competing, Poland and the Czech Republic would also be in this group. These countries are unlikely to vote for a regional favourite, and will probably choose a song which appeals to Europe as a whole.

Israel, Malta and Belgium are similarly outside of voting cliques, and usually reflect broad opinion. However, they do have a few occasional voting habits which are worth bearing in mind. It probably doesn't mean much if Israel votes for Russia[^2], Malta votes for the UK or Italy, or Belgium votes for Greece or Turkey.

If you're looking for an easy way to judge how things are going, and don't trust the actual scores because of the "excitement maximisation", these five are probably worth keeping track of. In 90% of simulations, the winning song gets a 12 from at least one of these five, and in 63% of simulations, from two. If two or more of these countries agree, there's a 65% chance that it's on the winner. If three or more agree, the chance rises to 84%.

### Stating the obvious

There are also some 12s which are completely expected. I've produced a list of the ten most likely votes. When these happen, don't get excited. It means absolutely nothing. Although I couldn't possibly condone it, I imagine drinking a shot for each one might make for an entertaining drinking game, if you're so inclined:

 *  Iceland → Denmark (55%)
 *  France → Turkey (60%)
 *  Azerbaijan → Turkey (60%)
 *  Germany → Turkey (60%)
 *  Belarus → Russia (62%)
 *  Moldova → Romania (68%)
 *  Macedonia → Albania (76%)
 *  Romania → Moldova (79%)
 *  Greece → Cyprus (81%)
 *  Cyprus → Greece (88%)
 
If any of these *don't* happen, then that might be a sign that something interesting is going on. Or it might be random noise, who knows?
 
### In conclusion

Sweden's going to win, unless it's Malta, or maybe somebody else. If you average together the taste in pop music of all of Europe, you get a Hungarian. Don't trust the scores on Saturday night, they're just toying with your emotions. Greeks and Cypriots love each other very much.

---

[Next post in the series][next]


[^1]: p ≈ 0.03

[^2]: This year's Turkish entry, Can Bonomo, is a Sephardic Jew, and will probably also get some significant votes from Israel. This isn't reflected in the model though; the friendship link from Israel to Turkey is actually slightly negative.

[ev]: /tags.html#eurovision-ref
[next]: /nerdery/2012/05/27/eurovision-statistics-after-the-final/

[original]: /nerdery/2012/05/20/ive-got-eurosong-fever-ted/
[previous]: /nerdery/2012/05/23/eurovision-statistics-post-semifinal-update/

[qual2margins]: /assets/images/eurovision/qual2margins.png
[finalwinprobs]: /assets/images/eurovision/finalwinprobs.png
[bellwether]: /assets/images/eurovision/bellwether.png