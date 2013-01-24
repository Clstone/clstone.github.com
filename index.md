---
layout: page
title: Recent Posts
tagline:
---
{% include JB/setup %}

{% for post in site.posts limit: 5 %}
  <div class="post">
    <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
    {{ post.content }}
    <div class="post_footer">
      Posted {{ post.date | date: "%d %B %Y" }} in <a href="{{ site.production_url }}/categories.html#{{ post.category }}-ref">{{ post.category }}</a> | <a href="{{ post.url }}">Link to this post</a> | <a href="{{ site.production_url }}{{ post.url }}/#disqus_thread">Leave a comment</a>
    </div>
  </div>  
  <hr />
{% endfor %}

{% include JB/comment-counts %}
