---
layout: post
title: 利用SAS抓取网页数据总结及案例
description: ""
categories: SAS
tags:   [SAS, 网页数据, web crawler, 网络爬虫]
---
{% include JB/setup %}
###故事来由

本人以前有一小站`www.daaata.com`刊登几篇关于利用SAS抓取网页数据的小文，然后挂了个链接在人大论坛。后因懒惰，此站挂掉，相继有人询问。在从新有此博后打

算把其中一篇简单易懂的补上，另外几篇译文已被[@统计网](http://itongji.cn/)收录，文章末尾会贴上链接。

###适用性

*  下面介绍的例子只是介绍了静态网页数据的抓取方式。也就是说，如果你看到一些网页上的数据，然后在当前网页右键**“View Source”**中还能发现此数据，那么利用

下面的此案例相同方式理论都可以进去获取。

*  然而并不是所有的数据你都能在网页源码中找到并进行提取，有些网页属于动态网页，有些数据会利用各种技术,如JS生成动态request, AJAX与数据库进行动态通信获取数据。
这种数据就需要其他的技术方法去进行获取。网络上有各种C#,JAVA的开源程序大家可以借鉴。另外，即时是我们手边的EXCEL+VBA，也可以进行各种的网页数据抓取，包括
一些动态网页，QueryTable 或者 WebBrowser控件和httpRequest方法即可以达到目的。

P.S. [@AJAX数据库实例](http://www.w3school.com.cn/tiy/t.asp?f=ajax_database) || [@AJAX数据库实例讲解](http://www.w3school.com.cn/ajax/ajax_database.asp)


###正文

####前戏

有时我们常常需要保存备份某些网上的数据，如银行利率，股票行情，抑或统计局、各种金融机构或其他类型网站的数据。
有时这些网站会提供历史数据，有的则不会。但是我们可以通过SAS每天跑下程序获取累积历史数据作为后来的分析之用。现在我拿获取 
[http://www.shibor.org/](http://www.shibor.org/) 主页,上海银行间同业拆放利率,作为案例进行演示。

####以下为主页上我们想要的数据

![shibor table](http://img2081.poco.cn/mypoco/myphoto/20121230/05/17326974720121230053258013.jpg)


当我们打开此网页，并进到网页源码中时，我们会惊讶的发现。什么情况，在主页上看到的数据在源码里找不到，难道使用了别的技术。我们大概浏览一下源码所表示的

网页布局。


按网页布局来说，一大坨文字的后面就应该放最新Shibor数据的源码，而他放了一句。

    <iframe scrolling="no" src ="/shibor/web/html/shibor.html" width="377" height="473" frameborder="0" name="shibordata"></iframe>


这是html内联框架结构，就是说他把数据放另一个网页上了，然后把这个网页嵌在主页里。好，那我们就打开此网页

[http://www.shibor.org/shibor/web/html/shibor.html](http://www.shibor.org/shibor/web/html/shibor.html)并查看源码，发现数据就存在此网页中，那我们就开始用SAS抓它一下。

####高潮

首先介绍下Filename,利用它加上infile语句就可以把网页当成文件导入SAS数据集。
The **FILENAME Statement** (URL Access Method) in Base SAS, enables users to access the source code from a web site and read it into a data set. The syntax for this statement is: 

    FILENAME fileref URL 'external-file'<url-options>;


*  数据导入

把Shibor数据网页导入SAS数据集。我们知道网页数据是标记语言，服从一定规范，所有属性设置都被`<>`包含。所以我们利用`dlm=">"`把它分隔导入到一个变量中，
因为数据太乱，我们没法分清使之导入到不同变量。

{% highlight Tcl %}
FILENAME SOURCE URL "%STR(http://www.shibor.org/shibor/web/html/shibor.html)" DEBUG;
DATA Zhaocl01;
	FORMAT WEBPAGE $1000.;
	INFILE SOURCE LRECL=32767 DELIMITER=">";
	INPUT WEBPAGE $ @@;
RUN;
{% endhighlight %}

*  数据清洗

因为我们利用了`dlm=">"`进行了分隔，所以我们清楚收集到的观测值只要以`<`开头就说明这条观测只有设置语言，没有我们想要的数据。而我们真正要要的数据肯
定都在`<`标识符的前面。因为在网页源码中会用 `&nbsp`代表空格，`&amp`代表连字符，所以把他们进行替换。

{% highlight Mysql %}
DATA Zhaocl02;
	SET Zhaocl01;
	WHERE WEBPAGE LIKE "_%<%";     /**删除以<开头的观测**/
	TEXT=SUBSTRN(WEBPAGE,1,FIND(WEBPAGE,"<")-1);   /**提取<前面的字符串**/
	TEXT=TRANWRD(TEXT,"%NRSTR(&nbsp;)"," ");
	TEXT=TRANWRD(TEXT,"%NRSTR(&amp;)","&");
	IF ANYALPHA(TEXT) + ANYDIGIT(TEXT) LT 1 THEN DELETE;  /**保留有效观测**/
	KEEP TEXT;
RUN;
{% endhighlight %}

###结局

*  结果展现

拿到了清理后的数据集，打开看下已经很清楚了。我们只要再做下最后简单的加工就好了。注意，由于网页布局的变动这段程序也可能要随之稍加修改。

<pre>
data Zhaocl03;  
    set Zhaocl02;
    set Zhaocl02(firstobs=2 rename=(text=next1));  
    set Zhaocl02(firstobs=3 rename=(text=next2));  
    if text in ("O/N","1W","2W","1M","3M","6M","9M","1Y");  
    label text='期限'            
          next1='Shibor(%)'       
          next2='涨跌(BP)';   
run; 
 
proc print label;run;
</pre>


![presentation](http://img2081.poco.cn/mypoco/myphoto/20121230/05/17326974720121230054538087.jpg)



###其他

**正则表达式**

在处理网页数据时，有一个利器就是正则表达式，威力巨大。比如：
    prxchange("s/<.+?>//",-1,WEBPAGE ); 
就可以去除所有`<>`包含的内容。但是一定要在对自己获取数据了解十分透彻的情况下使用，以防遗漏重要信息。

**相关资源**

A Guide to Crawling the Web with SAS?
[http://www.sascommunity.org/wiki/Simple_Web_Crawler_with_SAS_Macro_and_SAS_Data_Step](http://www.sascommunity.org/wiki/Simple_Web_Crawler_with_SAS_Macro_and_SAS_Data_Step)
[http://support.sas.com/resources/papers/proceedings10/053-2010.pdf](http://support.sas.com/resources/papers/proceedings10/053-2010.pdf)

被收录的译文,网络爬虫—利用SAS抓取网页方法
[http://www.itongji.cn/article/0221O62012.html](http://www.itongji.cn/article/0221O62012.html)
[http://www.itongji.cn/article/0221OR012.html](http://www.itongji.cn/article/0221OR012.html)

***
转帖请注明出处。在此谢过！
***
