// pages/user/user.js
var that;
var common = require('../template/getCode.js');
Page({
  data:{userPicSrc:''},
  onLoad:function(options){
    that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
    key:'my_avatar',
      success:function(res){
        that.setData({
          userPicSrc: res.data
        })
      }
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  callLoading:function(){
    common.dataloading('loading','loading');
  },
})