// pages/person/person.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opneid: '',
    userinfo:{}
    
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
  },

  onShow(){
    const userinfo=wx.getStorageSync("userinfo");  //获取用户信息（如果用户已授权才能调用成功）
    this.setData({userinfo});
  },

  handleGetUserInfo(e){
  //console.log(e);
  const {userInfo}=e.detail;  //若用户点击授权会返回相应userinfo（如果是第一次会弹出系统提示）
  wx.setStorageSync("userinfo",userInfo);  //于是可以调用系统函数进行授权
  const userinfo=wx.getStorageSync("userinfo");  //获取用户信息（如果用户已授权才能调用成功）
  this.setData({userinfo});
  },

  gotoself:function(e){
    wx.navigateTo({
      url: '../../pages/self/self',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  gotofoodbook:function(e){
    wx.navigateTo({
      url: '../../pages/foodbook/foodbook',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  gotohealthInfo:function(e){
    wx.navigateTo({
      url: '../../pages/healthInfo/healthInfo',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})