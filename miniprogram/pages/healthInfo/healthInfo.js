// pages/healthInfo/healthInfo.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['甲亢', '贫血', '肝硬化', '高血压','高血脂','高血糖','糖尿病','脑出血','冠心病','类风湿性关节炎','慢性肾功能衰竭'],
    objectArray: [
      {id: 0,chosen:true,name: '甲亢'},
      {id: 1,chosen:true,name: '贫血'},
      {id: 2,chosen:true,name: '肝硬化'},
      {id: 2,chosen:true,name: '高血压'},
      {id: 2,chosen:false,name: '高血脂'},
      // {id: 2,chosen:false,name: '高血糖'},
      // {id: 3,chosen:false,name: '糖尿病'},
      // {id: 2,chosen:false,name: '脑出血'},
      // {id: 2,chosen:false,name: '冠心病'},
      // {id: 2,chosen:false,name: '类风湿性关节炎'},
      // {id: 2,chosen:false,name: '慢性肾功能衰竭'}
    ],
    openid: '',
    sourvalue: 0,
    sweetvalue: 0,
    saltyvalue: 0,
    spicyvalue: 0,
    preferenceHealth: [
      {name:"减重",checked:false,id:0},
      {name:"增肌",checked:false,id:1},
      {name:"补钙",checked:false,id:2},
      {name:"补血",checked:false,id:3},
      {name:"孕妇",checked:false,id:4},
      {name:"儿童成长",checked:false,id:5},
      {name:"通便",checked:false,id:6},
      {name:"美白",checked:false,id:7},
      {name:"老年养生",checked:false,id:8},
      {name:"术后恢复",checked:false,id:9}
    ],
  },

  // 健康状况
  bindPickerChange:function(event){
    let objectArray=this.data.objectArray;
    let index=event.currentTarget.dataset.id;
    objectArray[index].chosen=!objectArray[index].chosen;
    this.setData({
      objectArray:objectArray
    })
    console.log(this.data.objectArray)
  },

  // 健康选择
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
      this.setData({
        openid: app.globalData.openid
      })
    }
    that.loaddata();
  },

  loaddata:function(){
    var that=this;
    const db = wx.cloud.database()
    db.collection('userHealth').where({
      _openid: that.data.openid
    }).get({
      success: res => {
        console.log(res.data)
        if(res.data[0].preferenceHealth.length==10){  //长度为10说明此前数据库有数据，可更新至局部变量
          that.setData({
            preferenceHealth: res.data[0].preferenceHealth
          })
          //console.log('找到用户健康资料，已更新至局部变量')
        }
        
      },
      fail: err => {
        console.error('查询失败：', err)
      }
    })
  },

  choose: function (e) { 
    let preferenceHealth=this.data.preferenceHealth;
    let index=e.currentTarget.dataset.pf.id;
    preferenceHealth[index].checked=!preferenceHealth[index].checked;
    this.setData({
      preferenceHealth:preferenceHealth
    })
    console.log(this.data.preferenceHealth)
  },

  submitClick: function (event) {
    var that=this;
    const db = wx.cloud.database()
    db.collection('userHealth').where({
      _openid: that.data.openid
    }).get({
      success: res => {
        console.log('查询成功: ', res)
        //若查询不到内容
        if (JSON.stringify(res.data) == '[]'){
          console.log('即将添加数据')
          db.collection('userHealth').add({
            data: {
              preferenceHealth:  that.data.preferenceHealth
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
          db.collection('userHealth').where(that.data.openid).update({
            data: {
              preferenceHealth:  that.data.preferenceHealth
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
  }
})