---
layout: post
title: "用SAS生成漂亮精美的EXCEl模板数据"
description: ""
categories: SAS
tags:   [SAS]
---
{% include JB/setup %}
###问题：

不管你是用SAS Proc export还是file statement还是libname excel引擎还是ODS+print/report/summary还是DDE。。把数据导出到SAS，默认情况的格式都是蛮丑的。
当我们在做类似重复性工作时，后续的EXCEL内部美化将会是烦劳的事情。而如果我们真正着手利用proc template + proc report制作一个个性化的稍微
漂亮的模板时，首先我们要理解十几个甚至更多参数对应到excel的位置，功能，然后再调试。当Excel,SAS版本更新时还要担心兼容性。本身也不是一件有趣的事来着。

###解决思路：

这里有两个比较简单易用的方法可以优化我们导出的EXCEL的format.      

1. 用SAS导出数据时不是只有一种形式模板，其实已经内嵌了很多还算过得去眼的模板。
2. 自己在EXCEL里动手DIY一个漂亮的模板，把数据位置空出。利用SAS打开模板，DDE功能导出。

###实施方法1：

这里我们利用最简单的ODS HTML Syntax生成excel作为例子，平常我们可以用odstagsets.ExcelXP style=“”生成多个worksheet或者设置更多的参数。
    
    /*ODS HTML Syntax生成excel*/
    ODS HTML FILE=’D:\TEMP.XLS’; 
      PROC PRINT  DATA=SASHELP.CLASS; 
      RUN; 
    ODS HTML CLOSE;

这时默认用default模板，可以通过在ODS HTML语句后加 Style= 参数设置模板,**注意style的对应参数不要用引号括起来**。但是SAS里已经有哪些模板呢？可以用此句查看。
`proc template;list styles;run`
Furthermore,我们可以利用以下语句生成所有模板的案例excel文件到`D:\ODS_test`一探究竟，前提是你要建一个ODS_test文件夹。但是已经有人做好了html的模板总览可以一看，
但是与生成excel里的样子稍有不同。[http://stat.lsu.edu/SAS_ODS_styles/SAS_ODS_styles.htm](http://stat.lsu.edu/SAS_ODS_styles/SAS_ODS_styles.htm)

{% highlight %}
/** 生成所有excel模板的案例到D:\ODS_test,注意生成过程时一直点取消/Cancel **/

dm 'log; clear; output; clear';                                          
                                                                         
filename list catalog 'work.temp.temp.source' ;   
                                                  
proc printto print=list new ;                     
run;                                              
                                         
ODS listing;                             
                                         
proc template ;                          
     list styles ;                       
run ;                                    
                                         
ODS listing close;                       
                                         
proc printto ;                           
run;                                     
                                         
data _null_ ;                            
     length style $ 17 ;                 
     infile list missover;        
     input @'Styles.' style ;            
     if style>' ' ;                  
                                     
       * create a folder for the files, then change the drive/folder below;         
                                                           
     call execute('ods html file="d:\ODS_test\'||strip(style)||'.xls" style='||style||';') ;    
     call execute('title "'||style||'";') ;                    
     call execute('proc means data=sashelp.class maxdec=2; run ;') ;                            
     call execute('ods html close'||';') ;     
run ;
                 
{% endhighlight %}

###更改ODS默认使用模板

OK~,我们在其中选择了自己喜欢的模板，也知道了它的名字，比如说，`Sasweb`。但是如果每次都在写ODS语句后面写style=Sasweb
岂不是很麻烦，那我们就来更改下SAS的默认ODS模板。使它默认就是用`Sasweb`style.

步骤，

1. 打开SAS,在命令行小窗口输入 `regedit`
2. 进入SAS注册表，选择 ODS->DESTINATIONS->MARKUP->HTML4
3. 在右边Contents窗口，把selected style的参数从Default改为Sasweb，OK！

更多相关信息请参考[@SAS官方Doc](http://support.sas.com/documentation/cdl/en/statug/63347/HTML/default/viewer.htm#statug_odsgraph_sect046.htm)

##实施方法2：

个人感觉方法2更于灵活方便美观。Dynamic Data Exchange (DDE) 它是一个在不同windows应用程序间动态交换数据的一种方法。

步骤，

1. 在EXCEL做一个自己满意的模板，什么布局，格式都设置好。把数据位置空处，比如说是A5:G100。（如果不确定多少行或列，就尽量在后面的程序中把范围写大点）
2. SAS程序导出前，利用X Command语句打开这个模板。
3. 利用filename+dde/file+put语句把数据导入到A5:G100。
4. 再利用X Command把打开并导入数据的模板另存为某个文件名的excel文件。（每次模板不会被改动）


**主要程序如下,此处模板里有两个worksheet**

{% highlight %}
options noxwait noxsync missing=' ';
x '"d:\ODS_test\Report_template.xlsx"';

/**给机器和自己一点时间去反映***/
data _null_;
rc = sleep(5);
run;

filename cc dde 'excel|worksheet1!r5c1:r100c7'  lrecl=650;

data _null_;
set zhaocl_t01;
  file cc;
  put Var1-Var5;
run;

filename gg dde 'excel|worksheet2!r5c1:r100c7'  lrecl=650;

data _null_;
set zhaocl_t02;
  file gg;
  put  Var1-Var5;
run;

/***********Save and Close the file************/
filename ddecmds DDE "excel|system";

data _null_;
  file ddecmds;
	put '[error(false)]';
	cmnd='[save.as("d:\ODS_test\'||"测试文件"||'.xlsx")]';
	put cmnd;
	put '[quit()]';
run;

{% endhighlight %}

***
转帖请注明出处。在此谢过！  

***
