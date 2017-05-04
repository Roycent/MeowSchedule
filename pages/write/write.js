// pages/write/write.js
var app = getApp()
var Bmob=require("../../utils/bmob.js")
var common = require('../template/getCode.js')
var wxMarkerData = []; 
var that;
Page({
  onLoad:function(options){
    that = this;
    
    that.setData({
      src:"",
      isSrc:false,
      title:"",
      address:"",
      content:"",
      isLoading:false,
      loading:false,
      isDisabled:false,
      sugData:'',
      markers:[]
    });//end of onLoad.that.setData
  },//end of onLoad
  onReady:function(){
    wx.hideToast();
  },//end of onReady
  onShow:function(){
    var myInterval=setInterval(getReturn,500);
    function getReturn(){
      wx.getStorage({
        key: 'user_openid',
        success: function(res) {
          if(res.data){
            clearInterval(myInterval)
              that.setData({
                loading:true
            })
          }    
        },
      })
    }
  },//end of onShow
  onHide:function(){
    // 页面隐藏
  },//end of onHide
  onUnload:function(){
    // 页面关闭
  },//end of onUnload
  getAddr: function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        var point = {
          latitude: res.latitude,
          longitude: res.longitude
          };
        that.setData({
          address : res.name || res.address
          }); 
          },
      fail: function(res) {
        console.log(res);
        },
      complete: function(res) {
        console.log(res);
        }
    })//end of wx.chooseLocation
  },//end of getAddr
  uploadPic:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc:true,
          src:tempFilePaths
        })
      }
    })
  },//end of uploadPic
  clearPic:function(){//删除图片
    that.setData({
      isSrc:false,
      src:""
    })
  },//end of clearPic
  //设置各种内容
  setContent:function(e){
    that.setData({
      content:e.detail.value
    }) 
  },
  setTitle:function(e){
    that.setData({
      title:e.detail.value
    }) 
  },
  setAddress:function(e){
    that.setData({
      address:e.detail.value
    })
  },
  //set各种内容的分割线
  //保存新的日程
  sendNewItem: function(e){
    var content = e.target.dataset.content;
    var title = e.target.dataset.title;
    var address = e.target.dataset.address;
    //判断内容是否为空，BUG:点两次才好使= =
    if(content==""){
      common.dataLoading("内容不能为空","loading");
    }else{
      that.setData({
        isLoading:true,
        isDisabled:true
      })
      wx.getStorage({
        key: 'user_id',
        success: function(res){
          // success
          var Schedule = Bmob.Object.extend("Schedule");
          var schedule = new Schedule();
          var me = new Bmob.User();
          me.id = res.data;
          schedule.set("participant",me)
          schedule.set("title",title);
          schedule.set("content",content);
          schedule.set("address",address);
          if(that.data.isSrc==true){
            var name = that.data.src;
            var file = new Bmob.File(name,that.data.src);
            file.save();
            schedule.set("pic",file);
          }
          schedule.save(null,{
            success: function(result){
              that.setData({
                isLoading:false,
                loading:false
              })

              common.dataLoading("添加日程成功","success",function(){
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                  success: function(res){
                    // success
                  },
                  fail: function(res) {
                    // fail
                  },
                  complete: function(res) {
                    // complete
                  }
                })
              })


            },//end of schedule.save.success
            error:function(result,error){
              console.log(error);
              common.dataLoading("添加日程失败","loading");
              setData({
                isLoading:false,
                loading:false
              })
            }
          });
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })//end of wx.getstorage
    }//end of 内容非空
  }//end of sendNewItem
})//end of Page