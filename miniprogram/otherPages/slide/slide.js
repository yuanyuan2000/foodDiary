Page({
  data: {
    haha: '这是几个字啊啊啊啊',
    tittle_left: '0rpx',
    touchS: [0, 0], //手指最近一次开始触碰时的坐标
    touchE: [0, 0], //手指最近一次触碰所在的坐标
  },
  /*
   *触摸开始函数
   */
  touchStart: function (e) {
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
    this.data.touchE = [sx, sy]
  },
  /*
   *触摸移动函数
   */
  touchMove: function (e) {
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
    let dx = this.data.touchE[0] - this.data.touchS[0];
    let ddx = dx * 2;
    if (dx < 325 && dx > 0) {
      this.setData({
        tittle_left: ddx + 'rpx'
      })
    }
    else if (dx < 0 && dx > -325) {
      this.setData({
        tittle_left: ddx + 'rpx'
      })
    }
  },
  /*
   *触摸结束函数
   */
  touchEnd: function (e) {
    let dx = this.data.touchE[0] - this.data.touchS[0];
    //console.log(dx);
    if (dx < 150 && dx > -150) {
      this.setData({
        tittle_left: '0rpx'  //慢慢恢复
      })
    }
    else if (dx >= 150) {
      this.setData({
        tittle_left: '650rpx' //继续移动
      })
    }
    else {
      this.setData({
        tittle_left: '-650rpx' //继续移动
      })
    }
  }
})