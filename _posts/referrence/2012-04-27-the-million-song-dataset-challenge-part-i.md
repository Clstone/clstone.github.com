---
layout: post
title: "The Million Song Dataset Challenge: Part I"
description: "In which our intrepid hero boggles at too much data, and calculates some correlations"
category: kaggle
tags: [msd-challenge]
---
{% include JB/setup %}

This is the first in a series of posts where I'm going to attempt to develop a solution to the [Million Song Dataset Challenge][msd], a [Kaggle][kaggle] competition about predicting music listening patterns. If you want to follow along, the code I'm using is available on [GitHub][github]. You'll also need to grab the data from the [competition website][data].

This is not intended to be an introduction to predictive modelling, or collaborative filtering, or even the particular problem I'm dealing with here. If you want introductory material, there's plenty available on the web. What I'm going to give here is a description of the particular process that I'm going through as I approach this particular problem. I'm going to assume that you're either familiar with the techniques I'm using, or are capable of looking things up on the internet if you don't understand. I am, however, happy to answer questions.

I don't know yet what kind of tools I'll be using, but I'm going to start out with Python, including [numpy and scipy][scipy]. Judging by previous experience, [R][r] will probably be involved, and it's quite likely I'll need to drop down to C for some performance-intensive stuff at some point. However, to begin with I'm going to start with Python for some preprocessing.

### First impressions

This is a really big dataset. The full Million Song Dataset collection of triples is around 3GB on disk; just parsing that much data will take a significant amount of time. Experimenting with this problem is going to be very slow going. I can speed it up slightly by using random samples, and by making sure to cache the result of even basic calculations, but things are definitely going to get slow.

The first thing I want to do is get rid of the long tags that are being used as identifiers. It's generally a lot easier to deal with integers. We're already given a mapping from songs to integers, and I can use the order in `kaggle_users.txt` to produce one for users. Then I can translate at least the evaluation data into a more manageable form. The following script does this, yielding a CSV file with three integers per line.

{% highlight python %}
# Script to convert evaluation triples to numeric form
# Usage: python numberify.py <userfile> <songfile> <infile> <outfile>

import sys

userfile, songfile, infile, outfile = sys.argv[1:5]

users = {}
for n, line in enumerate(open(userfile), start=1):
  users[line.strip()] = n

songs = {}
for line in open(songfile):
  song, n = line.split()
  songs[song] = n

with open(outfile, 'wb') as out:
  out.write('user,song,count\n')
  for line in open(infile):
    user, song, count = line.split()
    out.write('%d,%s,%s\n' % (users[user], songs[song], count))
{% endhighlight %}

### Getting stuck in

I want to put together some kind of non-trivial prediction algorithm as a first step. Really what I'm doing here is some useful preprocessing, but I'll throw together a simple prediction along the way as a sanity check.

I want to calculate a "co-listening" matrix for the songs. This will be a (sparse) matrix `colisten` where `colisten[i,j]` is the number of users who listened to both tracks `i` and `j`. This will allow for some very basic "people who listened to X also listened to Y" style collaborative filtering. To begin with, I'll generate it from just the evaluation data, but eventually I'll want to do this for the full MSD.

{% highlight python %}
# Build colisten matrix from triplet CSV and save in mtx format
# Usage: python colisten.py <infile> <outfile>

import scipy.sparse, scipy.io
import sys
import util

infile, outfile = sys.argv[1:]

colisten = scipy.sparse.lil_matrix((util.N_SONGS, util.N_SONGS))

for listens in util.songs_by_user(infile):
  for s, _ in listens:
    for t, _ in listens:
      colisten[s-1, t-1] += 1 # Songs are 1-indexed, but scipy uses 0-indexing

scipy.io.mmwrite(file(outfile, 'wb'), colisten)
{% endhighlight %}

This takes about 10 minutes to run on my machine. I could probably optimise it, but it's not code I'm going to run very many times, and it's still short enough that I can go make coffee while it's doing its thing, so I'll leave it as it is. You'll notice that I've created a `util.py` to include some basic constants and functions that make things a bit easier to read.

### Making an entry

Now that I have the co-listening matrix, I can generate a prediction based on it. Let's imagine that every song `i` is associated with a co-listening vector `colisten[i,:]`. If I sum this vector for every song that a user listened to, I should get a vector indicating how similar each song is to their listening history. I can then sort this in descending order to estimate which songs they're likely to listen to in the future.

In many cases, I'm not going to come up with 500 songs this way, so as a backup I'll use the overall listening frequencies, as in the [sample entry][sample]. I can get this simply by reading off the main diagonal of the co-listening matrix. I also need to filter out the songs that the user has already listened to.

{% highlight python %}
# Do prediction based on colistening matrix
# Usage: python predict_colisten.py <mtxfile> <evalfile> <outfile> 

import sys
import itertools
import scipy.io
import numpy
import util

mtxfile, evalfile, outfile = sys.argv[1:]

colisten = scipy.io.mmread(file(mtxfile)).tocsr()
listens = colisten.diagonal()

listenranked = numpy.argsort(-listens)[:500]

with open(outfile, 'w') as out:
  for history in util.songs_by_user(evalfile):
    songs, counts = zip(*history)
    
    sim = numpy.array(counts)[numpy.newaxis, :] * colisten[numpy.array(songs) - 1,:]
        
    # All this nonsense is an optimisation to avoid the fact that
    # sorting 300,000 numbers 110,000 times is bad for your health.
    # I only sort the songs where sim > 0
    simidxs = sim.nonzero()[1]
    srt = numpy.lexsort((-listens[simidxs], -sim[0,simidxs]))
    rankidxs = simidxs[srt]
    
    guess = []
    for s in rankidxs:
      if s+1 in songs:
        continue
      guess.append(str(s+1))
      if len(guess) == 500: break
    else:
      for s in listenranked:
        if s+1 in songs or s+1 in rankidxs:
          continue
        guess.append(str(s+1))
        if len(guess) == 500: break
      
    out.write(' '.join(guess) + '\n')

{% endhighlight %}

This time around I have done a little bit of optimisation, as it would have taken all day to run otherwise. It still takes about an hour or so, which is slower than I'd like, but as I said at the start, this is an annoyingly large dataset.

### The moment of truth

So I submit this and...

...first on the leaderboard! It's still very early days yet (there are only three non-benchmark submissions), but it's a nice piece of encouragement. I think that's a good point at which to stop for now.

#### To do

 *  Faster sparse matrix saving/loading: `scipy.io.mmread` takes forever to parse a matrix
 *  Look into some canned solutions like [MyMediaLite][mml]
 *  Grouping by user, rather than by song
 *  Work out how to visualise the data, or at least get meaningful song titles
 
[msd]: https://www.kaggle.com/c/msdchallenge
[kaggle]: https://www.kaggle.com/
[github]: https://www.github.com/mewo2/msdchallenge
[data]: https://www.kaggle.com/c/msdchallenge/data
[scipy]: http://www.scipy.org/
[r]: http://www.r-project.org/
[sample]: https://kaggle2.blob.core.windows.net/competitions/kaggle/2799/media/gettingstarted.pdf
[mml]: http://www.ismll.uni-hildesheim.de/mymedialite/