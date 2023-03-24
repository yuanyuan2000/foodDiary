// pages/diary/diary.js

const app = getApp()

Page({
  data: {
    //样式相关
    windowWidth: 0, //表示屏幕宽度，以px为单位
    windowHeight: 0, //表示屏幕高度，以px为单位
    touchS: [0, 0], //手指最近一次开始触碰时的坐标
    touchE: [0, 0], //手指最近一次触碰所在的坐标
    calendar_date_left: '0rpx', //日历日期部分左侧坐标
    calendar_lastDate_left: '-750rpx', //上月日历日期部分左侧坐标
    calendar_nextDate_left: '750rpx', //下月日历日期部分左侧坐标
    showDate: true, //仅当闪现新页面时为false，用于控制亮眼的样式，避免亮瞎用户
    
    //数据相关
    year: 0, //表示目标月所在年份
    month: 0, //表示目标月所在月份（从0开始算起）
    date: 0, //表示目标日期，初始默认为今天，随触摸单击而变化
    chooseLine: 0, //表示目标日期在第几行（从1开始算起）
    chooseDay: 0, //表示目标日期是星期几（星期日为0）
    calendarTittle: '', //表示日历标题栏应显示的文案
    dateArr: [], //一个长度为42的数组，表示从头到尾应显示的本月日期的相关信息
    lastDateArr: [], //一个长度为42的数组，表示从头到尾应显示的本月日期的相关信息
    nextDateArr: [], //一个长度为42的数组，表示从头到尾应显示的本月日期的相关信息
    openid: '',
    breakfast: [],
    lunch: [],
    dinner: [],

    //恒量
    dayChinese: ['日', '一', '二', '三', '四', '五', '六'],
    lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0], //农历60年各月天数十六进制表示
    chineseNumber: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"], 
    gotoSRSImg:'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/rightArrow.png'
  },


  //生命周期函数--监听页面加载
  onLoad: function() {
    var that = this;
    //日历相关加载
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth, //获取屏幕宽度（单位是px）
      windowHeight: wx.getSystemInfoSync().windowHeight //获取屏幕宽度（单位是px）
    })
    //console.log(this.data.windowWidth,this.data.windowHeight);
    let now = new Date();
    let year = now.getFullYear(); //表示今天的年份
    let month = now.getMonth(); //表示今天的月份
    let date = now.getDate(); //表示今天的日期
    let day = now.getDay(); //表示今天是星期几
    this.setData({
      year: year,
      month: month,
      date: date,
      chooseDay: day
    })
    this.calendarTittleUpdate();
    this.dateInit(year, month);

    //登录及早午晚餐相关加载
    wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.userInfo.openId
          that.setData({
            openid: res.result.userInfo.openId
          })
         that.loadRecipe();
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
  },

  //加载或更新食谱面板
  loadRecipe: function() {
    var that=this;
    const db = wx.cloud.database()
    db.collection('recipe').where({
      _openid: that.data.openid,
      year: that.data.year,
      month: that.data.month,
      date: that.data.date,
      mealType: 1
    }).get({
      success: res => {
        that.setData({
          breakfast: res.data
        })
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })

    db.collection('recipe').where({
      _openid: that.data.openid,
      year: that.data.year,
      month: that.data.month,
      date: that.data.date,
      mealType: 2
    }).get({
      success: res => {
        console.log(res.data)
        that.setData({
          lunch: res.data
        })
        
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })

    db.collection('recipe').where({
      _openid: that.data.openid,
      year: that.data.year,
      month: that.data.month,
      date: that.data.date,
      mealType: 3
    }).get({
      success: res => {
        that.setData({
          dinner: res.data
        })
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })
  },


  //calendarTittle更新函数
  calendarTittleUpdate: function() {
    let str = '';
    let now = new Date();
    let year = now.getFullYear(); //表示今天的年份
    let month = now.getMonth(); //表示今天的月份
    let date = now.getDate(); //表示今天的日期
    //根据不同时间为str赋予不同内容
    if (this.data.year == year && this.data.month == month) {
      if (this.data.date == date) {
        str = (this.data.month + 1) + '月,今天';
      } else str = (this.data.month + 1) + '月,周' + this.data.dayChinese[this.data.chooseDay];
    } else {
      str = (this.data.month + 1) + '月,' + (this.data.year) + '年';
    }
    //将str赋值给calendarTittle
    this.setData({
      calendarTittle: str
    })
  },


  //dateArr、lastDateArr、nextDateArr更新函数
  dateInit: function(setYear, setMonth) {
    let now = new Date(setYear, setMonth); //令now为目标年目标月的日期
    let year = now.getFullYear(); //目标年数
    let month = now.getMonth(); //目标月数（从0开始，方便后面计算当月总天数）
    let nextMonth = (month + 1) > 11 ? 0 : (month + 1); //目标月的下一个月的月份数
    let nextYear = (month + 1) > 11 ? (year + 1) : year; //目标月的下一个月的年份数
    let lastMonth = (month == 0) ? 11 : (month - 1); //目标月的上一个月的月份数
    let lastYear = (month == 0) ? year - 1 : year; //目标月的上一个月的年份数
    this.setData({
      dateArr: this.dateArrInit(year, month),
      lastDateArr: this.dateArrInit(lastYear, lastMonth),
      nextDateArr: this.dateArrInit(nextYear, nextMonth)
    })
  },


  //得到theYear年，theMonth月对应的dateArr（存储该月应显示信息的数组）
  dateArrInit: function(theYear, theMonth) {
    //全部时间的月份都是按0~11基准，显示时才+1
    let dateArr = []; //需要遍历的日历数组数据
    let now = new Date(theYear, theMonth); //令now为目标年目标月的日期
    let year = now.getFullYear(); //目标年数
    let month = now.getMonth(); //目标月数（从0开始，方便后面计算当月总天数）

    let nextMonth = (month + 1) > 11 ? 0 : (month + 1); //目标月的下一个月的月份数
    let nextYear = (month + 1) > 11 ? (year + 1) : year; //目标月的下一个月的年份数
    let lastMonth = (month == 0) ? 11 : (month - 1); //目标月的上一个月的月份数
    let lastYear = (month == 0) ? year - 1 : year; //目标月的上一个月的年份数
    let dayNums = new Date(nextYear, nextMonth, 0).getDate(); //获取目标月有多少天
    let lastDayNums = new Date(year, month, 0).getDate(); //获取目标月的上一个月有多少天
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期几

    //初始化日历数组
    let obj = {};
    let num = 0;
    for (let i = 0; i < 42; i++) {
      //上个月的日子
      if (i < startWeek) {
        num = lastDayNums - (startWeek - i - 1);
        obj = {
          dateNum: num,
          dayNum: i % 7,
          isThisMonth: false,
          lunarDate: this.getLunarDate(lastYear, lastMonth, num),
          line: parseInt(i / 7) + 1
        }
      }
      //这个月的日子
      else if (i < startWeek + dayNums) {
        num = i - startWeek + 1;
        obj = {
          dateNum: num,
          dayNum: i % 7,
          isThisMonth: true,
          lunarDate: this.getLunarDate(year, month, num),
          line: parseInt(i / 7) + 1
        };
        //今天
        if (this.data.month == month && this.data.date == num) {
          this.setData({
            chooseLine: parseInt(i / 7) + 1
          })
        }
      }
      //下个月的日子
      else {
        num = i - (startWeek + dayNums) + 1;
        obj = {
          dateNum: num,
          dayNum: i % 7,
          isThisMonth: false,
          lunarDate: this.getLunarDate(nextYear, nextMonth, num),
          line: parseInt(i / 7) + 1
        }
      }
      dateArr[i] = obj;
    }
    return dateArr;
  },


  //获取第theYear年theMonth+1月theDate天对应的农历字符串
  getLunarDate: function(theYear, theMonth, theDate) {
    let startDate = new Date('1900/1/31');
    let objDate = new Date(theYear, theMonth, theDate);
    //offset表示出目标日期和1900年1月31日相差的天数
    let offset = parseInt((objDate.getTime() - startDate.getTime()) / 86400000);
    // 用offset减去每农历年的天数，offset最终结果是当年的第几天，iYear最终结果是农历的年份
    let iYear, daysOfYear = 0;
    for (iYear = 1900; iYear < 2200 && offset > 0; iYear++) {
      daysOfYear = this.yearDays(iYear);
      offset -= daysOfYear;
    }
    if (offset < 0) {
      offset += daysOfYear;
      iYear--;
    }
    //用当年的天数offset,逐个减去每月天数，最后offset表示当天是本月的第几天
    let leapMonth = this.leapMonth(iYear); //表示闰哪个月,1-12
    let leap = false; // 布尔变量
    let iMonth, daysOfMonth = 0;
    for (iMonth = 1; iMonth < 13 && offset > 0; iMonth++) {
      // 闰月
      if (leapMonth > 0 && iMonth == (leapMonth + 1) && !leap) {
        --iMonth;
        leap = true;
        daysOfMonth = this.leapDays(iYear);
      } else
        daysOfMonth = this.monthDays(iYear, iMonth);

      offset -= daysOfMonth;
      // 解除闰月
      if (leap && iMonth == (leapMonth + 1)) leap = false;
    }
    //offset为0且刚才计算的月份是闰月时，要校正
    if (offset == 0 && leapMonth > 0 && iMonth == leapMonth + 1) {
      if (leap) {
        leap = false;
      } else {
        leap = true;
        --iMonth;
      }
    }
    //offset小于0时，也要校正
    if (offset < 0) {
      offset += daysOfMonth;
      --iMonth;
    }

    let lunarDate = ''; //得到最终表示日期的字符串
    let newmonth = this.data.chineseNumber[iMonth - 1]; //得到表示月份的字符串，仅在当月第一天使用
    {
      let day = offset + 1;
      let chineseTen = ["初", "十", "廿", "卅"];
      let n = day % 10 == 0 ? 9 : day % 10 - 1; //表示汉字个位应为chineseNumber的第几个
      if (day == 1) lunarDate = newmonth + '月';
      else if (day == 10) lunarDate = "初十";
      else
        lunarDate = chineseTen[parseInt(day / 10)] + this.data.chineseNumber[n];
    }
    //console.log(lunarDate);
    return lunarDate;
  },


  //农历辅助函数1：得到农历y年的天数
  yearDays: function(y) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      if ((this.data.lunarInfo[y - 1900] & i) != 0) sum++;
    }
    return (sum + this.leapDays(y));
  },
  //农历辅助函数2：得到农历y年闰月的天数
  leapDays: function(y) {
    if (this.leapMonth(y) != 0) {
      if ((this.data.lunarInfo[y - 1900] & 0x10000) != 0)
        return 30;
      else
        return 29;
    } else
      return 0;
  },
  //农历辅助函数3：得到农历y年第几个月是闰月
  leapMonth: function(y) {
    return this.data.lunarInfo[y - 1900] & 0xf;
  },
  //农历辅助函数4：得到农历y年第m月的天数
  monthDays: function(y, m) {
    if ((this.data.lunarInfo[y - 1900] & (0x10000 >> m)) == 0)
      return 29;
    else
      return 30;
  },


  //点击日历日期上的属于本月的数字
  chooseDate: function(e) {
    if (e.currentTarget.dataset.datearr.isThisMonth) {
      //更新date、chooseDay和chooseLine
      let date = e.currentTarget.dataset.datearr.dateNum;
      let day = e.currentTarget.dataset.datearr.dayNum;
      let line = e.currentTarget.dataset.datearr.line;
      this.setData({
        date: date,
        chooseDay: day,
        chooseLine: line
      })
      //更新日历标题栏
      this.calendarTittleUpdate();
      //更新食谱面板
      this.loadRecipe();
    }
  },


  //触摸开始函数
  touchStart_calendar: function(e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
    this.data.touchE = [sx, sy]
  },
  //触摸移动函数
  touchMove_calendar: function(e) {
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
    let dx = this.data.touchE[0] - this.data.touchS[0];
    let ddx = dx * 2.5;
    //月视图方可滑动
    if (!this.data.calendarPattern) {
      if (dx < 375 && dx > 0) {
        this.setData({
          calendar_date_left: ddx + 'rpx',
          calendar_lastDate_left: (-750 + ddx) + 'rpx'
        })
      } else if (dx < 0 && dx > -375) {
        this.setData({
          calendar_date_left: ddx + 'rpx',
          calendar_nextDate_left: (750 + ddx) + 'rpx'
        })
      }
    }
  },
  //触摸结束函数
  touchEnd_calendar: function(e) {
    let dx = this.data.touchE[0] - this.data.touchS[0];
    //滑不过去
    if (this.data.calendarPattern || (dx < 100 && dx > -100)) {
      this.setData({
        calendar_date_left: '0rpx',
        calendar_lastDate_left: '-750rpx',
        calendar_nextDate_left: '750rpx'
      })
    }
    //从左往右滑动成功
    else if (dx >= 100) {
      if (!this.data.calendarPattern) {
        this.lastMonth();
      }
    }
    //从右往左滑动成功 
    else {
      if (!this.data.calendarPattern) {
        this.nextMonth();
      }
    }
  },


  //切换到上个月的数据更新函数
  lastMonth: function() {
    //切换瞬间让亮眼元素不要显现
    this.setData({
      showDate: false
    })

    //改变日历日期部分位置样式
    this.setData({
      calendar_date_left: '0rpx',
      calendar_lastDate_left: '-750rpx',
      calendar_nextDate_left: '750rpx'
    })
    //得到新的年份和月份
    let year = this.data.month - 1 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 1 < 0 ? 11 : this.data.month - 1;
    //得到新的日期
    let date = 1;
    let now = new Date();
    let nowYear = now.getFullYear(); //表示今天的年份
    let nowMonth = now.getMonth(); //表示今天的月份
    if (year == nowYear && month == nowMonth) {
      date = now.getDate();
    }
    //得到新的星期几
    let day = new Date(year, month, date).getDay();
    //更新年、月、日期、星期几
    this.setData({
      year: year,
      month: month,
      date: date,
      chooseDay: day
    })
    //更新标题栏信息
    this.calendarTittleUpdate();
    //更新dateArr和第几行
    this.dateInit(year, month);
    //让亮眼元素重新显现
    this.setData({
      showDate: true
    })
    //更新食谱面板
    this.loadRecipe();
  },
  //切换到下个月数据更新函数
  nextMonth: function() {
    //切换瞬间让亮眼元素不要显现
    this.setData({
      showDate: false
    })
    //改变日历日期部分位置样式
    this.setData({
      calendar_date_left: '0rpx',
      calendar_lastDate_left: '-750rpx',
      calendar_nextDate_left: '750rpx'
    })
    //得到新的年份和月份
    let year = this.data.month >= 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month >= 11 ? 0 : this.data.month + 1;
    //得到新的日期
    let date = 1;
    let now = new Date();
    let nowYear = now.getFullYear(); //表示今天的年份
    let nowMonth = now.getMonth(); //表示今天的月份
    if (year == nowYear && month == nowMonth) {
      date = now.getDate();
    }
    //得到新的星期几
    let day = new Date(year, month, date).getDay();
    //更新年、月、日期、星期几
    this.setData({
      year: year,
      month: month,
      date: date,
      chooseDay: day
    })
    //更新标题栏信息
    this.calendarTittleUpdate();
    //更新dateArr和第几行
    this.dateInit(year, month);
    //让亮眼元素重新显现
    this.setData({
      showDate: true
    })
    //更新食谱面板
    this.loadRecipe();
  },

  addBreakfast: function(){
    let breakfast = this.data.breakfast; 
    let obj = {};
    let num = this.data.breakfast.length;
    obj = {
      "year": this.data.year,
      "month": this.data.month,
      "date": this.data.date,
      "mealType": 1,
      "mealNum": num + 1,
      "recipeName": "点击修改食物名称",
      "recipeIntroduction": "点击修改食物介绍",
      "recipeImg": 'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/choosePicture.jpg',
      "food": [],
      "isshared": false
    }
    breakfast.push(obj);
    this.setData({
      breakfast: breakfast
    })
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(this.data.breakfast[num]))
    })
  },
  chooseBreakfast: function(e){
    let breakfast=e.currentTarget.dataset.breakfast;
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(breakfast))
    })
  },

  addLunch: function(){
    let lunch = this.data.lunch; 
    let obj = {};
    let num = this.data.lunch.length;
    obj = {
      "year": this.data.year,
      "month": this.data.month,
      "date": this.data.date,
      "mealType": 2,
      "mealNum": num + 1,
      "recipeName": "点击修改食物名称",
      "recipeIntroduction": "点击修改食物介绍",
      "recipeImg": 'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/choosePicture.jpg',
      "food": [],
      "isshared": false
    }
    lunch.push(obj);
    this.setData({
      lunch: lunch
    })
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(this.data.lunch[num]))
    })
  },
  chooseLunch: function(e){
    let lunch=e.currentTarget.dataset.lunch;
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(lunch))
    })
  },

  addDinner: function(){
    let dinner = this.data.dinner; 
    let obj = {};
    let num = this.data.dinner.length;
    obj = {
      "year": this.data.year,
      "month": this.data.month,
      "date": this.data.date,
      "mealType": 3,
      "mealNum": num + 1,
      "recipeName": "点击修改食物名称",
      "recipeIntroduction": "点击修改食物介绍",
      "recipeImg": 'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/choosePicture.jpg',
      "food": [],
      "isshared": false
    }
    dinner.push(obj);
    this.setData({
      dinner: dinner
    })
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(this.data.dinner[num]))
    })
  },
  chooseDinner: function(e){
    let dinner=e.currentTarget.dataset.dinner;
    wx.navigateTo({
      url:"../../pages/singleRecipeShow/singleRecipeShow?recipe="+encodeURIComponent(JSON.stringify(dinner))
    })
  },

  //用户分享
  onShareAppMessage: function () {

  }
})