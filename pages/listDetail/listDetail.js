
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
      commentLoading:false,
      isdisabled1:false,
      recommentLoading:false,
      commentList:[],
      agree:0
  },
  
  onLoad: function(options) {   
      that=this;
      optionId=options.moodId;
      
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
                var Diary = Bmob.Object.extend("Diary");
                var query = new Bmob.Query(Diary);
                query.equalTo("objectId", optionId);
                query.include("publisher");
                query.find({
                    success: function(result) {
                      var title=result[0].get("title");
                      var content=result[0].get("content");
                      var publisher=result[0].get("publisher");
                      var agreeNum=result[0].get("likeNum");
                      var commentNum=result[0].get("commentNum");
                      var ishide=result[0].get("is_hide");
                      var liker=result[0].get("liker");
                      var userNick=publisher.get("nickname");
                      var address=publisher.get("address");
                      var isPublic;
                      var userPic;
                      var url;
                      if(publisher.get("userPic")){
                          userPic=publisher.get("userPic");
                      }
                      else{
                          userPic=null;
                      }
                      if(result[0].get("pic")){
                        url=result[0].get("pic")._url;
                      }
                      else{
                        url=null;
                      }
                      if(publisher.id==ress.data){
                        that.setData({
                          isMine:true
                        })
                      }
                      if(ishide==0){
                        isPublic=false;
                      }
                      else{
                        isPublic=true;
                      }
                      that.setData({
                        listTitle:title,
                        listContent:content,
                        listPic:url,
                        agreeNum:agreeNum,
                        commNum:commentNum,
                        ishide:ishide,
                        isPublic:isPublic,
                        userPic:userPic,
                        userNick:userNick,
                        loading: true,
                      })
                      for(var i=0;i<liker.length;i++){
                        var isLike=0;
                        if(liker[i]==ress.data){
                          isLike=1;
                          that.setData({
                            agree:isLike
                          })
                          break; 
                        }
                        
                      }
                      that.commentQuery(result[0]);

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
      confirmColor:"#a07c52",
      cancelColor:"#646464",
      success: function(res) {
        if (res.confirm) {
          // 删除此心情后返回上一页
            var Diary = Bmob.Object.extend("Diary");
            var queryDiary = new Bmob.Query(Diary);
            queryDiary.get(optionId, {
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
