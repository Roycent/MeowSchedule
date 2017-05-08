// pages/seeMore/seeMore.js
var that;
var common = require('../template/getCode.js');
var Bmob=require("../../utils/bmob.js");
var vArray = [0,0,0,0,0];
var itlist = new Array();
Page({
  data:{
    varietyArray:[0,0,0,0,0],
    loading:false,
    windowHeight:0,
    windowWidth:0,
    startDate:"2017-01-01",
    endDate:"2017-05-01",
    itemList:[]
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
    vArray = [0,0,0,0,0];
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
      vArray=[0,0,0,0,0];
      itlist=[];
    // 页面隐藏

  },
  onUnload:function(){
    // 页面关闭
      vArray=[0,0,0,0,0];
      itlist=[];
  },
  setStartDate:function(e){
    that.setData({
      startDate:e.detail.value
    })
  },
  setEndDate:function(e){
    that.setData({
      endDate:e.detail.value
    })
  },
  searchDate:function(){
    itlist=[];
    var myInterval = setInterval(function () {
      wx.getStorage({
        key: 'user_id',
        success: function (res) {
          // success
          if (res.data) {
            clearInterval(myInterval);
            var Schedule = Bmob.Object.extend("Schedule");
            var query = new Bmob.Query(Schedule);
            var isme = new Bmob.User();
            isme.id = res.data;
            query.equalTo("participant", isme);

            query.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                for (var i = 0; i < results.length; i++) {
                  if(results[i].get("plannedDate")<=that.data.endDate && results[i].get("plannedDate")>=that.data.startDate)
                  {
                            var jsonA;
                            var title=results[i].get("title");
                            var content=results[i].get("content");
                            var id=results[i].id;
                            var created_at=results[i].createdAt;
                            var _url;
                            var pic=results[i].get("pic");
                            var address=results[i].get("address");
                            console.log(address);
                            if(pic){
                                jsonA='{"title":"'+title+'","content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","attachment":"'+pic._url+'","address":"'+address+'"}'
                            }
                            else{
                              jsonA='{"title":"'+title+'","content":"'+content+'","id":"'+id+'","created_at":"'+created_at+'","address":"'+address+'"}'
                            }
                            var jsonB=JSON.parse(jsonA);
                            itlist.push(jsonB)
                            that.setData({
                              itemList:itlist,
                              loading: true
                            })       
                }      
                }
              },
              error: function (error) {
                common.loading(error, "loading");
                that.setData({
                  loading: false
                });

                console.log(error);
              }
            })
          }
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    }, 500);
    
  }
})