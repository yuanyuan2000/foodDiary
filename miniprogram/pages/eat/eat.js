// pages/foodbook/foodbook.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据相关
    recommendGroup:[],  //推荐食谱的集合

    //恒量相关
    srcSearch: 'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/search.png',
    srcMessage: 'https://7a67-zgycode-cecn7-1301106701.tcb.qcloud.la/icons/message.png',
    searchInput: '疫情宅家低卡健康食谱'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    const db = wx.cloud.database()
    db.collection('sharedRecipe').limit(10).get({  //注意这是个全量查询，后面要改
      success: res => {
        that.setData({
          recommendGroup: res.data
        })
        console.log(that.data.recommendGroup)
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })
  },

  gotoRecipe: function(e) {
    let recipe=e.currentTarget.dataset.recipe;
    wx.navigateTo({
      url:"../../pages/sharedRecipeShow/sharedRecipeShow?recipe="+encodeURIComponent(JSON.stringify(recipe))
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})