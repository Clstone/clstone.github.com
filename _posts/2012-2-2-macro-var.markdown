SAS里面除了变量，还有宏变量，其用途也非常广泛。创建宏变量的方法最早有shiyiming总结，翻了翻Rick Aster的Professional SAS Programming Shortcuts – Over 1,000 Ways To Improve Your SAS Programs，发现里面并没有总结这个问题，有点失望。

这里转载并补充姚志勇的SAS书里面的内容，使得更加完整和充实，便于大家以后方便选择使用，一共有四类方法：


1、通过直接赋值或通过宏函数创建宏变量 最基本最常用的

%let mv = 100;

%let dsid=%sysfunc(open(sashelp.class));

%let nvars=%sysfunc(attrn(&dsid,nvars));
%let nobs=%sysfunc(attrn(&dsid,nobs));
%let dsid=%sysfunc(close(&dsid));
%put &nvars.;
%put &nobs.;

2、通过data步接口子程序call symputx与call symput（两者有区别）

a, 创建单个宏变量

1
2
3
4
5
6
7
8
9
10
call symput('x', x);
run;
data _null_;
set sashelp.class nobs=obs;
call symputx('m1',obs);
call symput('m2',obs);
Stop;
run;
%put &m1.;
%put &m2.;
b, 为某变量的每个值创建一个宏变量

data _null_;
set sashelp.class;
suffix=put(_n_,5.);
call symput(cats(‘Name’,suffix), Name);
run;

c, 为表的每个值创建一个宏变量

data _null_;
set sashelp.class;
suffix=put(_n_,5.);
array xxx{*} _numeric_;
do i =1 to dim(xxx);
call symput(cats(vname(xxx),suffix),xxx);
end;
array yyy{*} $ _character_;
do i =1 to dim(yyy);
call symput(cats(vname(yyy),suffix),yyy);
end;
run;

3、proc sql方法 这个用法有很多的灵活性

a. 通过SQL过程用变量值创建一个宏变量

proc sql noprint;
select distinct sex
into :list_a separated by ‘ ‘
from sashelp.class;
quit;
%put &list_a.;

b.通过SQL过程创建多个宏变量

proc sql noprint;
select nvar,nobs
into:nvar , :nobs
from dictionary.tables
where libname = ‘SASHELP’ and memname = ‘CLASS’;
quit;
%put &nvar.;
%put &nobs.;

c. 通过contents和sql过程用变量名创建宏变量

proc contents data=sashelp.class out=con_class;
run;
proc sql noprint;
select name,put(count(name),5.-l)
into :clist separated by ‘ ‘,:charct
from con_class
where type=2;
quit;
%put &clist.;
%put &charct.;

d.通过SQL过程用宏变量创建宏变量列表

proc sql noprint;
select name
into :clist1-:clist999
from dictionary.columns
where libname = ‘SASHELP’ and memname = ‘CLASS’;
quit;
%put &clist1.;
%put &clist2.;

e.通过SQL过程用变量值创建宏变量列表

proc sql noprint;
select count(distinct sex)
into :n
from sashelp.class;
select distinct sex
into :type1 – :type%left(&n)
from sashelp.class;
quit;
%put &n.;
%put &type1.;

4、使用call set call set是我们处理对照表数据最强的武器，不但灵活方便，而且性能上是最优的。

1
2
3
4
5
6
7
8
9
10
%macro doit;
%let id=%sysfunc(open(sashelp.class));
%let NObs=%sysfunc(attrn(&amp;id,NOBS));
%syscall set(id);
%do i=1 %to &amp;NObs;
%let rc=%sysfunc(fetchobs(&amp;id,&amp;i));
%put # # # Processing &amp;Height # # #;
%end;
%let id=sysfunc(close(&amp;id));
%mend;
参考：

1，SAS中文论坛 几种给宏变量赋值的方法 by shiyiming 
2，姚志勇 SAS编程与数据挖掘商业案例 2010年出版 pp171-173.

ps：谢谢SAS中文论坛ID”天性爱好者“提供出处。

