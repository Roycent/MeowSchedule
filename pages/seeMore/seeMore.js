// pages/seeMore/seeMore.js
var that;
var common = require('../template/getCode.js');
var Bmob=require("../../utils/bmob.js");
var vArray = [0,0,0,0,0];
Page({
  data:{
    varietyArray:[0,0,0,0,0],
    loading:false,
    windowHeight:0,
    windowWidth:0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.setData({
      loading:false
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var myInterval = setInterval(function(){
      wx.getStorage({
        key: 'user_id',
        success: function(res){
          // success
          if(res.data){
            clearInterval(myInterval);
            var Schedule = Bmob.Object.extend("Schedule");
            var query = new Bmob.Query(Schedule);
            var isme = new Bmob.User();
            isme.id = res.data;
            query.equalTo("participant",isme);
            query.find({
              success: function(results){
                that.setData({
                  loading:true
                });
                for(var i = 0; i < results.length; i++){
                  var tempVariety = results[i].get("variety");
                  console.log(tempVariety);
                  vArray[tempVariety]++;
                }
                that.setData({
                  varietyArray:vArray
                })
              },
              error: function(error){
                common.loading(error,"loading");
                that.setData({
                  loading:false
                });
                console.log(error);
              }
            })
          }
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      }) 
    },500);
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight:res.windowHeight,
          windowWidth:res.windowWidth
        })
      }
    })
  },
  onHide:function(){
      vArray:[0,0,0,0,0]
    // 页面隐藏

  },
  onUnload:function(){
    // 页面关闭
      vArray:[0,0,0,0,0]
  }
})