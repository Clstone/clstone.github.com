---
layout: post
title: "Eurovision visualisation"
description: ""
category: nerdery
tags: [eurovision, d3]
---
{% include JB/setup %}

This is part five of a series of posts describing a predictive model for the Eurovision Song Contest. The full set of posts can be found [here][ev].

### A brief diversion

I still haven't gotten around to doing a full assessment of the Eurovision model's performance on the night, but I did spend an afternoon messing about in [D3.js][d3js], and I managed to come up with the network graph you see below. This is based on updated values of the friendship matrix, including the 2012 data, so it's not identical to the graph I showed [originally][firstev], but it's quite similar. You can drag the slider underneath to change the threshold from 2 (approximately one standard deviation above average) to 6 (approximately three standard deviations above average).

<div id="evfriends" />
<script src='/assets/d3/d3.v2.min.js'> </script>
<script src='/assets/d3/evfriends.js'> </script>

Countries are represented by [ISO 3166-1 alpha-2][iso3166] codes, but you knew that already. This probably needs a modern browser, but I don't have any non-modern browsers to test it in, so who knows?

[ev]: /tags.html#eurovision-ref

[d3js]: http://d3js.org/
[iso3166]: http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

[firstev]: /nerdery/2012/05/20/ive-got-eurosong-fever-ted/