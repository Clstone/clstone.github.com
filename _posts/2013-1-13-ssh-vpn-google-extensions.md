---
layout: post
title: "Chrome安装扩展方法+免费越狱方式"
description: ""
categories: me
tags:   [tips]
---
{% include JB/setup %}
####Chrome安装插件方法

自从Chrome更新了扩展程序安装方式，每次下个crx的扩展程序都显示不能从此页进行安装。郁闷.。。找了几种方法，都不能用。今天找到
一种方法可行。在你的google的快键方式上右键-》属性(properties)，有个目标(target)窗口。
{% highlight html %}
把其中
\Chrome\Application\chrome.exe
改为
\Chrome\Application\chrome.exe --enable-easy-off-store-extension-install
{% endhighlight %}

用此快捷方式打开的chrome就可以像以前一样自动安装扩展程序了。

####免费越狱方式

想去个[sascommunity.org](http://sascommunity.org)都去不了。以前的TOVPN又到期了，而且不怎么稳定。找到个还凑合的免费的，[usassh.net](http://usassh.net)
试试看吧。还不好用，就自己买个虚拟主机vps自己搭建vpn玩去。看官有稳定的收费vpn能推荐个会十分感谢。
