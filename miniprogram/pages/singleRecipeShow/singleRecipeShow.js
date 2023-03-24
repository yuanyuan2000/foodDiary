//pages/singleRecipeShow/singleRecipeShow.js
const app = getApp()

Page({
  data: {
    //样式相关
    isloading1: false,
    isloading2: false,
    isloading3: false,

    //数据相关
    recipeId:'',
    openid: '',
    year: 0,
    month: 0,
    date: 0,
    mealType: 0,  //该餐餐别号码
    mealNum: 0, //该餐次序
    mealTypeName: '',  //餐别名称
    recipeName: '', //食谱名称
    recipeIntroduction: '', //食谱介绍
    recipeImg: '',  // 食谱顶部大图在数据库中的位置
    food:[],  //存储食物信息的数组
    isshared: false,  //食谱是否已分享至推荐页面
    
    //恒量相关
    foodName:['土豆','辣椒','生菜','番茄','酸奶','奶酪','冰淇淋','牛奶','大麦','芋头','小米','玉米','荞麦','鱼','河虾','螃蟹','猪肉','牛肉','有机菜心','有机芥蓝','无糖可乐','豆腐','豆浆','酱油','鸡蛋','绿豆','鸡肉','鸭肉','苹果','桃子']
  },
  
  onLoad: function(options) {
    var that=this;
    if (!app.globalData.openid) {
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
    //console.log(this.data.openid)

    let theMealTypeName=['早餐','午餐','晚餐']
    let recipe=JSON.parse(decodeURIComponent(options.recipe))
    this.setData({
      year: recipe.year,
      month: recipe.month,
      date: recipe.date,
      mealType: recipe.mealType,
      mealTypeName: theMealTypeName[recipe.mealType-1] ,
      mealNum: recipe.mealNum,
      recipeImg: recipe.recipeImg,
      recipeName: recipe.recipeName,
      recipeIntroduction: recipe.recipeIntroduction,
      food: recipe.food,
      isshared: recipe.isshared
    })
  },

  onUnload: function() {
    // 页面销毁时执行
    var pages = getCurrentPages();
    console.log(pages);
    var prevPage = pages[pages.length-2];
    prevPage.loadRecipe();  //实现食谱的重新加载
  },

  getRecipeName: function (e) {
    this.setData({
      recipeName: e.detail.value
    })
  },
  getRecipeIntroduction: function (e) {
    this.setData({
      recipeIntroduction: e.detail.value
    })
  },

  changeBigImg: function() {
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,  //云存储图片名字
          filePath,  //临时路径
          success: res => {
            console.log('上传图片成功：', res)
            that.setData({
              recipeImg: res.fileID,  //云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
            });
          },
           fail: e => {
            console.error('上传图片失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },

  select: function(e) {
    var that=this;
    let food1=that.data.food;
    let index = e.currentTarget.dataset.food.index;
    //console.log("食物名称:"+e.detail)
    //console.log("食物序号:"+index)
    const db = wx.cloud.database()
    db.collection('aboutFood').where({
      name: e.detail
    })
    .get({
      success: res => {
        //console.log(res.data[0].name)
        food1[index].foodImage=res.data[0].image;
        food1[index].foodName=res.data[0].name;
        food1[index].foodIntroduction=res.data[0].introduction;
        food1[index].health_value=Math.floor(Math.random() * 10);
        food1[index].taste_value=Math.floor(Math.random() * 10);
        that.setData({
          food: food1
        })
        //console.log(that.data.food)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据查询失败'
        })
      }
    })
  },

  delete: function(e){
    var that=this;
    let food1=that.data.food;
    let index=e.currentTarget.dataset.index;
    wx.showModal({
      tittle: '提示',
      content: '是否删除该食物',
      success: function(res){
        if(res.confirm){
          that.setData({
            isloading3: true
          })
          food1.splice(index,1);
          for(let i=0;i<food1.length;i++)
          {
            food1[i].index=i;
          }
          that.setData({
            food: food1
          })
          console.log(that.data.food);
          that.setData({
            isloading3: false
          })
        }
      }
    })
  },

  addFood: function(){
    this.setData({
      isloading1: true
    })
    let food1 = this.data.food;
    let obj = {};
    let num = this.data.food.length;
    obj = {
      "index": num,
      "foodImage": "",
      "foodName": "请选择",
      "foodIntroduction": "",
      "health_value": 0,
      "taste_value": 0
    }
    food1.push(obj);
    this.setData({
      food: food1,
      isloading1: false
    })
    //console.log(this.data.food)
  },

  save: function(){
    var that=this;
    this.setData({
      isloading2: true
    })

    const db = wx.cloud.database()
    db.collection('recipe').where({
      _openid: that.data.openid,
      year: that.data.year,
      month: that.data.month,
      date: that.data.date,
      mealType: that.data.mealType,
      mealNum: that.data.mealNum
    }).get({
      success: res => {
        console.log('查询成功: ', res)
        //若查询不到内容
        if (JSON.stringify(res.data) == '[]'){
          console.log('即将添加数据')
          db.collection('recipe').add({
            data: {
              //_openid: that.data.openid,
              year: that.data.year,
              month: that.data.month,
              date: that.data.date,
              mealType: that.data.mealType,
              mealNum: that.data.mealNum,
              recipeName: that.data.recipeName,
              recipeIntroduction: that.data.recipeIntroduction,
              recipeImg: that.data.recipeImg,
              food: that.data.food,
              isshared: that.data.isshared
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
          that.setData({
            recipeId: res.data[0]._id
          })
          console.log(that.data.recipeId)
          db.collection('recipe').doc(that.data.recipeId).update({
            data: {
              //_openid: that.data.openid,
              year: that.data.year,
              month: that.data.month,
              date: that.data.date,
              mealType: that.data.mealType,
              mealNum: that.data.mealNum,
              recipeName: that.data.recipeName,
              recipeIntroduction: that.data.recipeIntroduction,
              recipeImg: that.data.recipeImg,
              food: that.data.food,
              isshared: that.data.isshared
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
    
    this.setData({
      isloading2: false
    })
  },

  share: function() {
    var that=this
    const db = wx.cloud.database()
    wx.showModal({
      tittle: '提示',
      content: '是否将食谱分享给他人（其他用户将可通过主页看到这个食谱）',
      success: function(res){
        if(res.confirm){
          that.setData({
            isshared: true
          })
          that.save();
          db.collection('sharedRecipe').where({
            _openid: that.data.openid,
            recipeName: that.data.recipeName,
            recipeIntroduction: that.data.recipeIntroduction,
            recipeImg: that.data.recipeImg
          }).get({
            success: res => {
              console.log('查询成功: ', res)
              //若查询不到内容
              if (JSON.stringify(res.data) == '[]'){
                console.log('即将添加数据')
                db.collection('sharedRecipe').add({
                  data: {
                    //_openid: that.data.openid,
                    recipeName: that.data.recipeName,
                    recipeIntroduction: that.data.recipeIntroduction,
                    recipeImg: that.data.recipeImg,
                    food: that.data.food
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
                let shareRecipeId=res.data[0]._id
                db.collection('sharedRecipe').doc(shareRecipeId).update({
                  data: {
                    //_openid: that.data.openid,
                    recipeName: that.data.recipeName,
                    recipeIntroduction: that.data.recipeIntroduction,
                    recipeImg: that.data.recipeImg,
                    food: that.data.food
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
      }
    })
  }
})
