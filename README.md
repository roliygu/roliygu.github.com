## 我的站点

---

### 一. 概述
这个[project](http://roliygu.github.io)是我计划中的三大project中的一个,"数据可视化服务".同时也是另外两个project的入口,当然目前这三个project要么处于设计阶段要么处于demo阶段.这里先介绍下这个"数据可视化服务"吧.

### 二. 数据可视化服务
这个服务的目的是简化数据可视化的操作,让一个不会用R或Python绘图的人画出他们想画的图;或者让数据相关从业者前期能快捷简便地进行数据探索.(如果不考虑作为另外两个服务的入口的话,)这个项目是一个纯前端项目.

#### 1. 使用到的JS库

* echarts: 百度出品的可视化库;
* BackboneJS: 一款精简的前端MVC框架;
* UnderscoreJS: Backbone的依赖包,同时提供了大量简便操作的JS函数;
* RequireJS: 方便模块化导入的工具包;
* jQuery: 常用的DOM操作库;
* BootStrap: 前端UI框架;
* bootbox: 还不错的alert提示框;
* jquery-filestyle: 基于jquery的文件上传插件;

前5个是使用得最多,也是本项目中最重要的组件.

#### 2. 使用流程

1. 用户上传符合要求的数据文件;
2. 得到需要的图.

#### 3. 目前支持的图
##### 3.1 散点图
支持两种数据文件,一种是没有类别的数据,可能如下:
```
1.0, 1.2
0.9, 0.8
0.7, 0.6
1.0, 1.5
0.9, 0.4
0.7, 0.8
```
每行由两个**数字**组成,中间由**英文逗号**间隔.
另一类是包含类别的数据,可能如下:
```
男生
1.0, 1.2
0.9, 0.8
0.7, 0.6
女生
1.0, 1.5
0.9, 0.4
0.7, 0.8
```
每个数据块的首行是这个数据块的label,需要注意的是,label中请不要包含英文逗号.如上所示,包含了两类,一类是"男生"的数据,一类是女生的数据.数据部分规则不变,仍然是由英文逗号分隔开的两个数字.
**目前暂时只支持2列数据**,这样第一列作为x轴,第二列作为y轴.后续更新会提供高维数据的可视化,稍安勿躁.

#### 4. 需要帮助
这个项目和另外两个项目都需要人手,如果你对这个项目或者另外两个神秘项目感兴趣,想参与建设的话,请发邮件到**roiygu@gmail.com**.如果使用本服务过程中发现任何bug或者体验不当之处也希望你能在本项目的issue中发帖,或者直接联系我,非常感谢.
