// pages/log/log.js
Page({

  handleGetUserInfo(e){
    // console.log(e);

  const {userInfo}=e.detail;
  wx.setStorageSync("userinfo",userInfo);

  // 退回
  wx.navigateBack({
    delta: 1,
  });
  }
})