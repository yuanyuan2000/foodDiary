Page({
  //选择excel表格
  chooseExcel: function(){
    let that=this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res){
        let path=res.tempFiles[0].path
        console.log("选择excel成功",path)
        that.uploadExcel(path)
      }
    })
  },

  //上传excel的云存储
  uploadExcel: function(path){
    let that=this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime()+'.xls',
      filePath: path,
      success: res=>{
        console.log("上传成功",res.fileID)
        that.jiexi(res.fileID)
      },
      fail: err=>{
        console.log("上传失败",err)
      }
    })
  },

  //解析excel数据并上传到云数据库
  jiexi: function(fileId){
    wx.cloud.callFunction({
      name:'excel',
      data:{
        fileID:fileId
      },
      success(res){
        console.log("解析并上传成功",res)
      },
      fail(res){
        console.log("解析失败",res)
      }
    })
  }
})