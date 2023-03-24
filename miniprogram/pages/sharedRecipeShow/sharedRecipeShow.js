
const app = getApp()

Page({
  data: {
    //样式相关
    isloading1: false,

    //数据相关
    recipeName: '', //食谱名称
    recipeIntroduction: '', //食谱介绍
    recipeImg: '',  // 食谱顶部大图在数据库中的位置
    food:[],  //存储食物信息的数组
    
    //恒量相关
    foodName:['土豆','辣椒','生菜','番茄','酸奶','奶酪','冰淇淋','牛奶','大麦','芋头','小米','玉米','荞麦','鱼','河虾','螃蟹','猪肉','牛肉','有机菜心','有机芥蓝','无糖可乐','豆腐','豆浆','酱油','鸡蛋','绿豆','鸡肉','鸭肉','苹果','桃子']
  },
  
  onLoad: function(options) {
    let recipe=JSON.parse(decodeURIComponent(options.recipe))
    this.setData({
      recipeImg: recipe.recipeImg,
      recipeName: recipe.recipeName,
      recipeIntroduction: recipe.recipeIntroduction,
      food: recipe.food
    })
  },

  save: function(){
    var that=this;
    this.setData({
      isloading1: true
    })

    // const db = wx.cloud.database()
    // db.collection('recipe').where({
    //   _openid: that.data.openid,
    //   year: that.data.year,
    //   month: that.data.month,
    //   date: that.data.date,
    //   mealType: that.data.mealType,
    //   mealNum: that.data.mealNum
    // }).get({
    //   success: res => {
    //     console.log('查询成功: ', res)
    //     //若查询不到内容
    //     if (JSON.stringify(res.data) == '[]'){
    //       console.log('即将添加数据')
    //       db.collection('recipe').add({
    //         data: {
    //           //_openid: that.data.openid,
    //           year: that.data.year,
    //           month: that.data.month,
    //           date: that.data.date,
    //           mealType: that.data.mealType,
    //           mealNum: that.data.mealNum,
    //           recipeName: that.data.recipeName,
    //           recipeIntroduction: that.data.recipeIntroduction,
    //           recipeImg: that.data.recipeImg,
    //           food: that.data.food,
    //           isshared: that.data.isshared
    //         },
    //         success: res => {
    //           console.log('添加成功', res._id)
    //           wx.showToast({title: '保存成功'})
    //         },
    //         fail: err => {
    //           console.error('添加失败', err)
    //           wx.showToast({icon: 'none',title: '保存失败'})
    //         }
    //       })
    //     }
    //     //若查询到内容
    //     else{
    //       that.setData({
    //         recipeId: res.data[0]._id
    //       })
    //       console.log(that.data.recipeId)
    //       db.collection('recipe').doc(that.data.recipeId).update({
    //         data: {
    //           //_openid: that.data.openid,
    //           year: that.data.year,
    //           month: that.data.month,
    //           date: that.data.date,
    //           mealType: that.data.mealType,
    //           mealNum: that.data.mealNum,
    //           recipeName: that.data.recipeName,
    //           recipeIntroduction: that.data.recipeIntroduction,
    //           recipeImg: that.data.recipeImg,
    //           food: that.data.food,
    //           isshared: that.data.isshared
    //         },
    //         success: res => {
    //           console.log('更新成功')
    //           wx.showToast({title: '保存成功'})
    //         },
    //         fail: err => {
    //           console.error('更新失败', err)
    //           wx.showToast({icon: 'none',title: '保存失败'})
    //         }
    //       })
    //     }
    //   },
    //   fail: err => {
    //     console.error('查询失败：', err)
    //   }
    // })
    
    this.setData({
      isloading1: false
    })
  }
})
