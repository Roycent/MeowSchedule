// pages/listDetail/listDetail.js

//获取应用实例
var app = getApp()
var that;
var optionId;
var isme;
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var commentlist;
var picture;
var parts=[];
var itlist = new Array();
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
      listVariety:0,
      listImportance:0,
      varietyArray: ['学习', '工作', '娱乐', '健身', '其它'],
      importanceArray: ['lowest', 'below normal', 'normal', 'above normal', 'highest'],
      finished:false,
      isMine:false,
      hasChanged:false,
      wannaChange:false,
      itemList:[],
      shareState:false,
  },
  
  onLoad: function(options) {   
      that=this;
      optionId=options.itemId;
      console.log(options.itemId);
      itlist = [];
  },
  onReady:function(){
     wx.hideToast() 
     
  },
  onShow: function() {  
      var myInterval=setInterval(getReturn,500);
      itlist=[];
      function getReturn(){
          wx.getStorage({
            key: 'user_id',
            success: function(ress) {
              if(ress.data){
                clearInterval(myInterval)
                var Schedule = Bmob.Object.extend("Schedule");
                var userSchedule = Bmob.Object.extend("UserSchedule");
                var query = new Bmob.Query(Schedule);
                var userScheduleQuery=new Bmob.Query(userSchedule);
                isme = ress.data;
                query.equalTo("objectId", optionId);
                console.log("optionId "+optionId);
                query.find({
                  success: function (result) {
                    var title = result[0].get("title");
                    var content = result[0].get("content");
                    var address = result[0].get("address");
                    var importance = parseInt(result[0].get("importance"));
                    var variety = parseInt(result[0].get("variety"));
                    var time = result[0].get("time");
                    var date = result[0].get("plannedDate");
                    var finish = result[0].get("finished");
                    var shareStateTmp=result[0].get("shareFlag");
                    //that.data.shareState=result[0].get("shareFlag");
                    /*if (participant.id == ress.data) {
                      that.setData({
                        isMine: true
                      })
                    }*/
                    
                    var userPic;
                    var url;
                    if (result[0].get("pic")) {
                      url = result[0].get("pic")._url;
                      picture = result[0].get("pic")._url;
                    }
                    else {
                      if (result[0].get("pictureUrl")) {
                        url = result[0].get("pictureUrl");
                        picture = url;
                      }
                      else {
                        url = null;
                        picture = null;
                      }
                    }
                    that.setData({
                      listTitle: title,
                      listContent: content,
                      listPic: url,
                      listAddress: address,
                      listVariety: variety,
                      listImportance: importance,
                      listTime: time,
                      listDate: date,
                      loading: true,
                      finished: finish,
                      shareState:shareStateTmp
                    })
                  },
                  error: function (error) {
                    // common.dataLoading(error,"loading");
                    that.setData({
                      loading: true
                    })
                    console.log(error)
                  }
                });  
                var aUser = new Bmob.Object.extend("_User");
                var aUserQuery = new Bmob.Query(aUser);
                userScheduleQuery.equalTo("itemID", optionId);
                userScheduleQuery.find({
                      success:function(results){
                        for(var i=0;i<results.length;i++){
                          aUserQuery.get(results[i].get("participant").id,{
                            success:function(res){
                              var username = res.get("username");
                              var userPic=res.get("userPic");
                              var jsonA;
                              jsonA = '{"username":"' + username + '","userPic":"' + userPic + '"}';
                              var jsonB = JSON.parse(jsonA);
                              itlist.push(jsonB);
                              that.setData({
                                itemList: itlist,
                                loading: true
                              })
                            }
                          })
                        };
                        
                      }
                    })
                userScheduleQuery.equalTo("participant", isme);
                userScheduleQuery.count({
                  success: function (count) {
                    console.log(count);
                    if (parseInt(count)>=1) {
                      console.log("change");
                      that.setData({
                        isMine: true
                      })
                    }
                  }
                });
                }
                
            } 
          })
      }

  },
  onShareAppMessage: function () {
    var Schedule = Bmob.Object.extend("Schedule");
    var query = new Bmob.Query(Schedule);
    query.equalTo("objectId", optionId);
    query.find({
      success: function (result) {
        var shareFlag = result[0].get("shareFlag");
        console.log(shareFlag);
        if (!shareFlag) {
          shareFlag = true;
        }
        result[0].set('shareFlag', shareFlag);
        result[0].save();
        console.log(shareFlag);
        that.setData({
          shareState: shareFlag,
        })
      },
      error: function (error) {
        // common.dataLoading(error,"loading");
        that.setData({
          loading: true
        })
      }
    })
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
                      console.log("delete Schedule item")
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
            var userSchedule = Bmob.Object.extend("UserSchedule");
            var queryUserSchedule = new Bmob.Query(userSchedule);
            queryUserSchedule.equalTo("itemID", optionId);
            
            queryUserSchedule.find({
              success: function (results) {
              for (var i = 0; i < results.length; i++){
                results[i].destroy({
                  success: function (myObject) {
                    console.log("delete Schedule item"+i)
                  },
                  error: function (myObject, error) {
                    // 删除失败
                    console.log(error)
                    // common.dataLoading(error,"loading");
                  }
                });
              }
                    common.dataLoading("删除成功", "success", function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    });
                  },
                  error: function (myObject, error) {
                    // 删除失败
                    console.log(error)
                    // common.dataLoading(error,"loading");
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
  //????
  finishIt: function(e){
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
                    that.setData({
                      finished: true
                    })
                  }else{
                    res.set('finished',false);
                    res.save();
                    that.setData({
                      finished: false
                    })
                  }
                  
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
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        // success
        var me = new Bmob.User();
        me.id = res.data;
        var userSchedule = Bmob.Object.extend("UserSchedule");
        var us = new userSchedule();
        /*var VVindex = parseInt(Vindex);
        var IIindex = parseInt(Iindex);
        schedule.set("participant", me);
        if(that.data.listPic!=null){
              schedule.set("pictureUrl", that.data.listPic);
        }
        schedule.set("title", title);
        schedule.set("content", content);
        schedule.set("address", address);
        schedule.set("plannedDate", date);
        schedule.set("time", time);
        schedule.set("importance", IIindex);
        schedule.set("variety", VVindex);
        schedule.set("finished", false);
        console.log(res.data);
        */
        us.set("participant", me);
        us.set("itemID", optionId);
        
        us.save(null, {
          success: function (result) {
            console.log(res.id);
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
  },
  changeTitle: function(e){
    that.setData({
      hasChanged:true,
      listTitle: e.detail.value
    })
  },
  changeContent: function(e){
    that.setData({
      hasChanged:true,
      listContent: e.detail.value
    })
  },
  changeVariety: function(e){
    that.setData({
      hasChanged:true,
      listVariety: e.detail.value
    })
  },
  changeImportance: function(e){
    that.setData({
      hasChanged:true,
      listImportance:e.detail.value
    })
    console.log(that.data.listImportance);
  },
  changeTime:function(e){
    that.setData({
      hasChanged:true,
      listTime:e.detail.value
    })
  },
  changeDate:function(e){
    that.setData({
      hasChanged:true,
      listDate:e.detail.value
    })
  },
  changeAddress: function(){
    wx.chooseLocation({
      success: function(res){
        var point = {
          latitude: res.latitude,
          longitude: res.longitude
          };
        that.setData({
          listAddress : res.name || res.address
          }); 
          },
      fail: function(res) {
        console.log(res);
        },
      complete: function(res) {
        console.log(res);
        }
    })
  },
  writeAddress: function(e){
    that.setData({
      listAddress:e.detail.value
    })
  },
  changeShareState:function(){
    var Schedule = Bmob.Object.extend("Schedule");
    var query = new Bmob.Query(Schedule); 
    query.equalTo("objectId", optionId);
    query.find({
      success: function (result) {
        var shareFlag = result[0].get("shareFlag");
        console.log(shareFlag);
        if(shareFlag){
          shareFlag=false;
        }
        result[0].set('shareFlag',shareFlag);
        result[0].save();
        console.log(shareFlag);
        that.setData({
          shareState:shareFlag,
        })
      },
       error: function (error) {
        // common.dataLoading(error,"loading");
        that.setData({
          loading: true
        })}
      })

  },
  saveChanges: function(){
    var Schedule = Bmob.Object.extend("Schedule");
    var query = new Bmob.Query(Schedule);
    query.get(optionId,{
      success:function(result){
        result.fetchWhenSave(true);
        result.set('title',that.data.listTitle);
        result.set('content',that.data.listContent);
        result.set('variety',parseInt(that.data.listVariety));  
        result.set('importance',parseInt(that.data.listImportance));
        result.set('time',that.data.listTime);
        result.set('address',that.data.listAddress);
        console.log(that.data.listImportance);
        result.set('plannedDate',that.data.listDate);
        result.save();
        common.dataLoading("修改成功","success",function(){
          wx.naviga
          wx.navigateBack({
            delta:1 
          })
        })
      },
      error:function(error){
        console.log(error)
      }
    }) 
  },
  wannaChange:function(){
    that.setData({
      wannaChange:true
    })
  }
})
