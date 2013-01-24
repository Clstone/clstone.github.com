---
layout: post
title: "I've got Eurosong fever, Ted"
description: ""
category: nerdery
tags: [eurovision, mcmc]
---
{% include JB/setup %}

This is part one of a series of posts describing a predictive model for the Eurovision Song Contest. The full set of posts can be found [here][ev].

---

This Saturday, the final of the 57th Eurovision Song Contest will take place in Baku, Azerbaijan. To the uninitiated, it's quite hard to explain the cultural significance of Eurovision to Europe. On one level, it's a simple pop music contest, a throwback to the 1950s, when men wore tuxedos, fostering cultural unity seemed like a good way to stop World War III, and Luxembourg still had a shot at winning international competitions. On another level though, it's a fascinating insight into the complex interconnected web that is European geopolitics[^1].

The system is relatively simple: each participating country sends a performer or group of performers with a three-minute pop song. Phone-in and text message votes in each country determine how that country's ranks the entrants (other than its own). These rankings are then translated into points; 12, 10, 8, 7, 6, 5, 4, 3, 2, 1 for the top ten.[^2] Points are tallied, and a winner is announced. Since 2004, the number of entrants has been too large for one contest, so semifinals have been held in the week before the contest, using the same rules.

While the system may be simple, the results are anything but. Certain patterns of voting are fairly predictable. Cyprus gives 12 points to Greece. Former Soviet republics give high scores to Mother Russia. What happens in Scandinavia stays in Scandinavia. These phenomena have been described in detail, both [academically][gatherer] and in [cartoon form][cartoon]. Depending on the level of politeness involved, these patterns are described as "bloc voting", "political voting" or "collusive voting".

These terms are probably unfair. Croatia didn't sidle up to Bosnia one day and suggest a sneaky vote-swap. In most cases the results can be explained in terms of immigrant populations (Germany's fondness for Turkey), or cultural similarity (the Irish love for Danish pop). Determining which is true in any particular case is probably impossible[^3]. However, regardless of their source, the existence of patterns opens up the possibility of models which can predict the results of the contest in advance, at least probabilistically.

### A Gibbs Sampler For Europe

I'm going to work with data from both the finals and semifinals, starting in 1998. This date is chosen partially to reduce the quantity of data, partially to ensure the relevance of the data to predicting modern contests, and mostly because this is the point at which the modern phone-in voting system was introduced. Prior to this, a country's votes were determined by a pre-selected jury. This led to slightly less predictable voting patterns.

While most analyses I've seen have worked in terms of typical numbers of points awarded between countries, I'm going to take a more fundamental approach. The basic unit of data here is the *comparison*: if Country A gives Country B \\(m\\) points, Country A gives Country C \\(n\\) points, and \\(m > n\\), then we say that A *prefers* B to C. We know nothing about the strength of this preference, simply that it exists. This also extends to the case where one of the countries involved receives zero points.

This choice of datum means that our knowledge about a preference is not affected by the presence or absence of any other countries in the competition. This is a problem with a points-based approach, where for example the mean number of points given by Norway to Sweden is partially determined by which years Denmark took part in the competition.

In any given contest, we can observe a preference of A for B over C, for C over B, or neither. If we ignore the cases where no preference is observed, treating them as missing data, we can try to model the direction of the preference as a Bernoulli random variable. Our goal, then, is to model the probability that a given preference is expressed.

The model I've chosen for this is a modified form of a logistic regression. I model the *affinity* of a country for a given song with the sum of two terms. The first is a "friendship" term, dependent on the country awarding the points and the country receiving the points, but independent of the year of the contest. The second is a "quality" term, dependent on the country receiving the points and the year of the contest, but independent of the awarding country. The friendship term captures the "political" aspect of the voting, while the quality term should represent how universally liked a particular song is.

Given a country A and two songs (a, b), I then model the probability of preferring one over the other as \\(\\mathrm{logit}(Aff_A(a) - Aff_B(b))\\). The distributions of both the friendship and quality terms are assumed to be normal, with zero mean and unknown variance.

I've run this model using [JAGS][jags], a Gibbs sampler, to determine the values of these parameters. There are approximately 130,000 preferences recorded, and about 3,000 parameters in the full model, so most of the parameters are fairly well constrained. In some cases, such as friendship ratings between two countries which have never competed in the same contest, the results are not so well constrained, but the prior distribution means that these values become small on average.

Anyway, what this gives us is a matrix indicating how much each country "likes" each other country in voting terms, along with a "quality score" for each song. The first question we can ask is then which of the two terms is more important. Is the voting more influenced by regular voting patterns, or is the quality of the song a bigger factor?

![Density plots of quality and friendship terms][qualitydensity]

The answer is that they're about equal in importance. The largest friendship factors are somewhat larger than the highest quality scores, but typical values are very similar. These really large friendship factors are mostly small countries giving points to big neighbours, for example:

 *  Andorra → Spain (9.5)
 *  Cyprus → Greece (9.1)
 *  Monaco → France (8.1)
 
### A social network

I've plotted the friendship links with strength greater than an arbitrary cutoff of 4.

![Eurovision friendship network][network]

The two most obvious groupings are the countries of the former Yugoslavia (near the top) and the former Soviet Union (near the bottom left). Both of these areas, because of their former political unity, have a lot of cultural similarity[^4] and many people have familial and ethnic ties to countries other than those they live in. As such, it's in no way surprising that a lot of points are exchanged within these areas.

More interestingly, this phenomenon doesn't seem to happen as strongly in Western Europe, where national borders have been stable for longer. Instead, there are a number of strong pairings (Andorra/Spain, Monaco/France, Iceland/Denmark), linked by chains of weaker links. The Scandinavian situation is particularly odd, with a chain of votes going roughly eastward: Norway → Iceland → Denmark → Sweden → Finland → Estonia.

We can also look at the strongest negative links: those countries which appear to never vote for each other. In many cases, these seem somewhat bizarre. I have no idea why Andorrans hate Serbia so much (-6.0), but the data never lies. Is it possible that Moldovans really dislike Maltese pop music (-5.2)?

In one case, however, the reason is clear. On all eight occasions when it was possible for Azerbaijan to award points to Armenia, they have failed to do so. The reason for this is the [Nagorno-Karabakh war][nkwar], a conflict between the two countries which took place immediately after the collapse of the Soviet Union, and which has been at a shaky ceasefire since 1994. While Armenia has on occasion dispensed a few points in the direction of Azerbaijan, the reverse has never occurred, and with good reason. In 2009, it was [reported][rferl] that the 43 Azerbaijanis who texted in votes for Armenia in that year's contest were summoned to the National Security Ministry to explain their actions. 

### Song quality

The other thing we can look at is the quality of individual songs. The "quality" term in the regression gives us a measure of how well liked a song is, independently of any voting patterns that may have affected its score in the actual contest. Strictly speaking, these scores aren't completely comparable between years, as we have no way of knowing what the average standard was in any given year. I'm just going to finesse this detail, in service of providing you with the Top Five Best Eurovision Songs Ever (1998-2011):

1.  [Alexander Rybak - Fairytale][no09] (Norway, 2009) (5.8) - It was always going to be this grinning loon with a violin. Holds all sorts of records for the most points, most 12s, etc.
2.  [Ruslana - Wild Dances][ua04] (Ukraine, 2004) (5.3) - A Game Of Thrones filtered through post-Soviet Eurodance. She was a member of parliament in the Ukraine from 2006 to 2007.
3.  [Željko Joksimović - Лане моје][rs04] (Serbia and Montenegro, 2004) (5.2) - I'm pretty sure every middle-aged woman in the Balkans has a little shrine to this guy. He's entering again this year, but the betting markets are only giving odds of around 18/1.
4.  [Sakis Rouvas - Shake It][gr04] (Greece, 2004) (4.5) - The Hellenic Ricky Martin. I'm reliably informed that he's huge in Greece. Nobody else has ever heard of him.
5.  [Lordi - Hard Rock Hallelujah][fi06] (Finland, 2006) (4.4) - After this won, we thought that all future Eurovision winners would be heavy metal orcs. How wrong we were.

If these scores are to be believed, then 2004 was a bumper year for Eurovision entries. 2011, on the other hand, was the worst year in the dataset, with the [winning Azerbaijani entry][az11] scoring a measly 2.6.

The scientifically determined worst song in Eurovision history (-6.6) is then [these rapping Gypsy superheroes][cz09] who represented the Czech Republic in 2009. They scored zero points in their semifinal, and thus failed to qualify for the final. The Czech Republic has not competed since.

### Putting my money where my mouth is

Of course, any model is only as good as its predictions. If we want to use this model predictively, we need a way to translate preference probabilities into consistent total orderings on the set of all entrants.

I've chosen to do this again using Gibbs sampling, this time in R. I treat each preference as independent, given known values for the affinities. This means that if I fix an ordering for all but one of the entries, I can calculate the probability that the remaining entry fits into each "slot" in the ordering. By repeatedly selecting an entry and re-inserting it using this method, I eventually achieve a sample from the implied distribution of total orderings.

For the 2012 contest, I assume that all friendship values remain the same as in previous years, while the quality scores are sampled randomly from the posterior distribution calculated previously. Then, running through the contest mechanics, I arrive at a sample prediction for the result of the contest. I do this 10,000 times, producing a distribution over the contest results.

The first thing I want to look at is the probability of qualifying for the final. The final generally draws much bigger viewership figures than the semifinals, but only in countries which qualify. However, national broadcasters have to commit to showing the final, without knowing in advance whether their country will be competing. This is a potential loss of a large number of primetime Saturday evening viewers. It's therefore useful to know what the chances are that any given country will be participating in the final.

The "Big Five" countries (France, Germany, Italy, Spain, UK) and the host nation automatically qualify for the final, while the others must come in the top ten in one of the two semifinals. Were the semifinals completely random, or equivalently, completely dependent on song quality, the chance of any given country qualifying would be approximately 56%. However, the reality is quite different.

![Semifinal qualification probabilities][semiquals]

Greece benefits from having Cyprus in its semi-final, and Romania and Moldova's mutual love-in raises both of their qualification chances. The second semi-final is dominated by the Balkans, with Bosnia and Serbia benefitting both from each other, and from their neighbours Slovenia, Macedonia and Croatia.

As an indication that dividing up voting clusters is effective, the qualification chances of the Scandinavian countries are relatively low. Only Denmark and Iceland have better than random chances of qualification. We should also spare a thought for poor old Portugal, which is missing its perennial boosters Andorra (not competing this year) and Spain (voting in the other semi-final). The chances of a Portuguese finalist are relatively slim as a result.

Looking on to the final, things are quite different:

![Winning probabilities][winner]

The runaway favourite here is Sweden, which is likely to receive the lion's share of Scandinavian points. Paradoxically, the high qualification chances from the Balkans actually act against them, as points are likely to be split between a number of countries. Scandinavia, on the other hand, will probably only get one or two qualifiers, and this will help in unifying the Nordic vote.

Coincidentally, Sweden are also the favourites on the betting markets, trading at 2.94 on [Betfair][betfair] at the time of writing, corresponding to an implied probability of 34%. The increase in certainty is probably due to additional information gleaned from actually listening to [the song][se12]. We shouldn't trust the betting markets too much though; last year their favourite was the [French entry][fr11], which came a fairly shoddy 15th. It was very popular in Belgium though.

#### Wrapping up

The data I used for this, along with the (rough, undocumented, partial) code, are available on [GitHub][github]. The data is modified from that originally collected by Anthony Goldbloom of [Kaggle][kaggle] in 2010, corrected in a few spots, and augmented with 2010 and 2011 data from Wikipedia. The code is my own, and not the most beautiful thing I've ever written.

There are a few obvious ways that this could be improved. It wouldn't be hard to include information about the song, such as gender of the performer, language of the lyrics, or position in the running order. People have suggested that all of these could have an effect on a song's chances, and it would be reasonably easy to test this hypothesis.

---

[Next post in the series][next]


[^1]: Strictly speaking, Eurovision participation is open to all countries within the European Broadcast Area, or members of the Council of Europe. This leads to a rather loose definition of Europe which includes large chunks of North Africa, the Middle East and Central Asia.

[^2]: Psephologically speaking, this is a variant on a [Borda count][borda].

[^3]: The problem is similar but not identical to that of distinguishing [contagion and homophily in social networks][shalizi].

[^4]: At least for the purposes of Eurovision. For example, while there may be huge differences in culture between Croats and Serbs in terms of history and religion, these don't generally come out in pop music.

[gatherer]: http://jasss.soc.surrey.ac.uk/9/2/1.html
[cartoon]: http://i44.tinypic.com/xxh7r.jpg
[shalizi]: http://cscs.umich.edu/~crshalizi/weblog/656.html
[jags]: http://mcmc-jags.sourceforge.net/
[nkwar]: http://en.wikipedia.org/wiki/Nagorno-Karabakh_War
[borda]: http://en.wikipedia.org/wiki/Borda_count
[rferl]: http://www.rferl.org/content/feature/1800013.html
[kaggle]: http://www.kaggle.com/
[github]: http://www.github.com/mewo2/eurovision/
[betfair]: http://sports.betfair.com/?mi=104582460&ex=1&q=eurovision

[no09]: http://www.youtube.com/watch?v=fBFFlL58UTM
[ua04]: http://www.youtube.com/watch?v=10XR67NQcAc
[rs04]: http://www.youtube.com/watch?v=z7OvpjplJ_8
[gr04]: http://www.youtube.com/watch?v=asZwDUTEXls
[fi06]: http://www.youtube.com/watch?v=gAh9NRGNhUU
[cz09]: http://www.youtube.com/watch?v=w3CgUmzl4sk
[az11]: http://www.youtube.com/watch?v=fSnz-iF9Xps
[fr11]: http://www.youtube.com/watch?v=OTiBNPT-x_Y
[se12]: http://www.youtube.com/watch?v=4nJcmLMb5to

[qualitydensity]: /assets/images/eurovision/qualitydensity.png
[network]: /assets/images/eurovision/eurovisionfriends.png
[semiquals]: /assets/images/eurovision/semiquals.png
[winner]: /assets/images/eurovision/winner.png

[ev]: /tags.html#eurovision-ref

[next]: /nerdery/2012/05/23/eurovision-statistics-post-semifinal-update/
[next2]: /nerdery/2012/05/24/eurovision-statistics-final-predictions/
