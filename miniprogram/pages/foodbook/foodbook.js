// pages/foodbook/foodbook.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    sourvalue: 0,
    sweetvalue: 0,
    saltyvalue: 0,
    spicyvalue: 0,
    preferenceFood: [
      {name:"蔬菜",checked:true,id:0},
      {name:"海鲜",checked:true,id:1},
      {name:"水果",checked:true,id:2},
      {name:"白肉",checked:false,id:3},
      {name:"红肉",checked:false,id:4},
      {name:"高蛋白",checked:false,id:5},
      {name:"代糖",checked:false,id:6},
      {name:"低糖",checked:false,id:7},
      {name:"豆制品",checked:false,id:8},
      {name:"乳制品",checked:false,id:9},
      {name:"有机食品",checked:false,id:10},
      {name:"无麸制食品",checked:false,id:11},
    ],

  },

  onLoad: function (options) {
    var that=this;
    const db = wx.cloud.database()
    if(!app.globalData.openid){
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.userInfo.openId
          that.setData({
            openid: res.result.userInfo.openId
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
    else{
      that.setData({
        openid: app.globalData.openid
      })
    }
    that.loaddata();
  },

  loaddata:function(){
    var that=this;
    const db = wx.cloud.database()
    //console.log(that.data.openid)
    db.collection('userFood').where({
      _openid: that.data.openid
    }).get({
      success: res => {
        //console.log(res.data)
        that.setData({
          sourvalue: res.data[0].sourvalue,
          sweetvalue: res.data[0].sweetvalue,
          saltyvalue: res.data[0].saltyvalue,
          spicyvalue: res.data[0].spicyvalue,
          preferenceFood: res.data[0].preferenceFood
        })
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })
  },

  sourslider:function(e){
    console.log(e.detail.value)
  },
  sweetslider:function(e){
    console.log(e.detail.value)
  },
  saltyslider:function(e){
    console.log(e.detail.value)
  },
  spicyslider:function(e){
    console.log(e.detail.value)
  },

  choose: function (e) { 
    let preferenceFood=this.data.preferenceFood;
    let index=e.currentTarget.dataset.pf.id;
    preferenceFood[index].checked=!preferenceFood[index].checked;
    this.setData({
      preferenceFood:preferenceFood
    })
    console.log(this.data.preferenceFood)
  },

  submitClick: function (event) {
    var that=this;
    var sourvalue = event.detail.value.sour;
    var sweetvalue = event.detail.value.sweet;
    var saltyvalue = event.detail.value.salty;
    var spicyvalue = event.detail.value.spicy;
    this.setData({
      sourvalue:sourvalue,
      sweetvalue:sweetvalue,
      saltyvalue:saltyvalue,
      spicyvalue:spicyvalue
    })

    const db = wx.cloud.database()
    db.collection('userFood').where({
      _openid: that.data.openid
    }).get({
      success: res => {
        console.log('查询成功: ', res)
        //若查询不到内容
        if (JSON.stringify(res.data) == '[]'){
          console.log('即将添加数据')
          db.collection('userFood').add({
            data: {
              sourvalue: that.data.sourvalue,
              sweetvalue: that.data.sweetvalue,
              saltyvalue: that.data.saltyvalue,
              spicyvalue: that.data.spicyvalue,
              preferenceFood:  that.data.preferenceFood
            },
            success: res => {
              console.log('添加成功', res._id)
              wx.showToast({title: '保存成功'})
            },
            fail: err => {
              console.error('添加失败', err)
              wx.showToast({icon: 'none',title: '保存失败'})
            }
          })
        }
        //若查询到内容
        else{
          db.collection('userFood').doc(that.data.openid).update({
            data: {
              sourvalue: that.data.sourvalue,
              sweetvalue: that.data.sweetvalue,
              saltyvalue: that.data.saltyvalue,
              spicyvalue: that.data.spicyvalue,
              preferenceFood:  that.data.preferenceFood
            },
            success: res => {
              console.log('更新成功')
              wx.showToast({title: '保存成功'})
            },
            fail: err => {
              console.error('更新失败', err)
              wx.showToast({icon: 'none',title: '保存失败'})
            }
          })
        }
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })
  },
    
  // resetClick: function (event) {
  //   console.log(event.detail.value);
  // },


  hocol: function (res) {
    console.log(res.currentTarget.dataset.index);
    let index = res.currentTarget.dataset.index
    //背景颜色获取
    let temp = 'foodname[' + index + '].color'
    // 颜色获取
    let temps = 'foodname[' + index + '].tcol'
    // 更改
    if (this.data.foodname[index].color == "") {
      this.setData({
        [temp]: "#3d80ea",
        [temps]: "white"
      })
    } else {
      this.setData({
        [temp]: "",
        [temps]: "#AAAAAA"
      })
    }
  }
})