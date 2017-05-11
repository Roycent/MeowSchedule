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
      listAddress:"",
      listPic:"",
      listTime:"",
      listDate:"",
      listVariety:"",
      listImportance:"",
      finished:false,
      isMine:false
  },
  
  onLoad: function(options) {   
      that=this;
      optionId=options.itemId;
      console.log(options.itemId);
      
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
                      var address=result[0].get("address");
                      var importance=result[0].get("importance");
                      var variety=result[0].get("variety");
                      var time=result[0].get("time");
                      var date=result[0].get("date");
                      var finish=result[0].get("finished");
                      if(participant.id==ress.data){
                        that.setData({
                          isMine:true
                        })
                      }
                      var userPic;
                      var url;
                      if(result[0].get("pic")){
                        url=result[0].get("pic")._url;
                      }
                      else{
                        url=null;
                      }
                      that.setData({
                        listTitle:title,
                        listContent:content,
                        listPic:url,
                        listAddress:address,
                        listVariety:variety,
                        listImportance:importance,
                        listTime:time,
                        listdate:date,
                        loading: true,
                        finished:finish
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
        path: '/pages/listDetail/listDetail?itemId='+optionId,
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
changeTitle:function(e){
  this.setData({
    listTitle: e.detail.value
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
  },
  finishedIt: function(e){
          wx.getStorage({
            key: 'user_id',
            success: function(res){
              // success
              var Schedule = Bmob.Object.extend("Schedule");
              var query = new Bmob.Query(Schedule);
              query.get(optionId,{
                success: function(res){
                  if(res.get('finished')==false){
                    res.set('finished',true);
                    res.save();
                  }else{
                    res.set('finished',false);
                    res.save();
                  }

                  console.log("success");
                  console.log(optionId);
                },
                error: function(object,error){
                  console.log(error);
                }
              });
              
            },
            fail: function(res) {
              // fail
            },
            complete: function(res) {
              // complete
            }
          })
  },
  addToMine: function(){
    var content = that.data.listContent;
    var title = that.data.listTitle;
    var address = that.data.listAddress;
    var date = that.data.listDate;
    var time = that.data.listTime;
    var Iindex = that.data.listImportance;
    var Vindex = that.data.listVariety;
    var pic = that.data.listPic;
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        // success
        var Schedule = Bmob.Object.extend("Schedule");
        var schedule = new Schedule();
        var me = new Bmob.User();
        me.id = res.data;
        var VVindex = parseInt(Vindex);
        var IIindex = parseInt(Iindex);
        schedule.set("participant", me);
        schedule.set("pic",pic);
        schedule.set("title", title);
        schedule.set("content", content);
        schedule.set("address", address);
        schedule.set("plannedDate", date);
        schedule.set("time", time);
        schedule.set("importance", IIindex);
        schedule.set("variety", VVindex);
        schedule.set("finished", false);
        console.log(res.data);
        schedule.save(null, {
          success: function (result) {
            console.log("resultID:" + result.id);
            var UserSchedule = Bmob.Object.extend("UserSchedule");
            var us = new UserSchedule;
            us.set("participant", me);
            us.set("itemID", result.id);
            us.save(null, {
              success: function (res) {
                console.log(res.id);
              }
            })
            that.setData({
              isLoading: false,
              loading: false
            });

            common.dataLoading("添加日程成功", "success", function () {
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
                success: function (res) {
                  // success
                },
                fail: function (res) {
                  // fail
                },
                complete: function (res) {
                  // complete
                }
              })
            })


          },
          error: function (result, error) {
            console.log(error);
            common.dataLoading("添加日程失败", "loading");
            that.setData({
              isLoading: false,
              loading: false
            })
          }
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})
