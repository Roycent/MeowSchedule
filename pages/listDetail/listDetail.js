// pages/listDetail/listDetail.js

//获取应用实例
var app = getApp()
var that;
var optionId;
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var commentlist;
Page({
  data:{
      limit:5,
      showImage:false ,
      loading:false,
      isdisabled:false,
      isdisabled1:false,
      listContent:"",
      listTitle:"",
      listPic:""
  },
  
  onLoad: function(options) {   
      that=this;
      optionId=options.moodId;
      console.log(options.moodId);
      
  },
  onReady:function(){
     wx.hideToast() 
     
  },
  onShow: function() {  
      var myInterval=setInterval(getReturn,500);
      function getReturn(){
          wx.getStorage({
            key: 'user_id',
            success: function(ress) {
              if(ress.data){
                clearInterval(myInterval)
                var Schedule = Bmob.Object.extend("Schedule");
                var query = new Bmob.Query(Schedule);
                query.equalTo("objectId", optionId);
                query.include("participant");
                query.find({
                    success: function(result) {
                      var title=result[0].get("title");
                      var content=result[0].get("content");
                      var participant=result[0].get("participant");
                      var address=participant.get("address");
                      var userPic;
                      var url;
                      if(result[0].get("pic")){
                        url=result[0].get("pic")._url;
                      }
                      else{
                        url=null;
                      }
                      console.log("xixi");
                      that.setData({
                        listTitle:title,
                        listContent:content,
                        listPic:url,
                        loading: true,
                      })
                    },
                    error: function(error) {
                        // common.dataLoading(error,"loading");
                        that.setData({
                          loading: true
                        })
                        console.log(error)
                    }
                  }); 
                }
                
            } 
          })
      }

  },
  onShareAppMessage: function () {
      return {
        title:that.data.listTitle,
        desc: that.data.listContent,
        path: '/pages/listDetail/listDetail?moodId='+optionId,
      }
    
  },
  changeFocus:function(){
    that.setData({
      autoFo:true
    })
  },
  deleteThis:function(){//删除
    wx.showModal({
      title: '是否删除该日程？',
      content: '删除后将不能恢复',
      showCancel:true,
      success: function(res) {
        if (res.confirm) {
          // 删除此心情后返回上一页
            var Schedule = Bmob.Object.extend("Schedule");
            var querySchedule = new Bmob.Query(Schedule);
            querySchedule.get(optionId, {
                success: function(result) {
                  result.destroy({
                    success: function(myObject) {
                      // 删除成功
                      common.dataLoading("删除成功","success",function(){
                          wx.navigateBack({
                              delta: 1
                          })
                      });
                    },
                    error: function(myObject, error) {
                      // 删除失败
                      console.log(error)
                      // common.dataLoading(error,"loading");
                    }
                  });
                },
                error: function(object, error) {

                }
            });
          
        }
        else{
        }
      }
    })
  },
bindKeyInput:function(e){
  this.setData({
    publishContent: e.detail.value
  })
},
  onHide: function() {
      // Do something when hide.
  },
  onUnload:function(event){
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  seeBig:function(e){
    wx.previewImage({
      current: that.data.listPic, // 当前显示图片的http链接
      urls: [ that.data.listPic] // 需要预览的图片http链接列表
    })
  }
})
