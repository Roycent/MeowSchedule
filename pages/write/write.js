
//获取应用实例
var app = getApp()
var Bmob=require("../../utils/bmob.js")
var common = require('../template/getCode.js')
var bmap = require('../../utils/bmap-wx.min.js')
var wxMarkerData = []; 
var that;
Page({
  onLoad: function(options) {
      that=this;

      that.setData({//初始化数据
        src:"",
        isSrc:false,
        title:"",
        location:"",
        content:"",
        ishide:"0",
        autoFocus:true,
        isLoading:false,
        loading:false,
        isdisabled:false,
        sugData:'',
        markers: [], 
        latitude: '', 
        longitude: '', 
        rgcData: {} ,
        address:''
      })
           var BMap = new bmap.BMapWX({ 
            ak: 'Nf89ueEBsf5a0MGY0uSG0U5mQikq2Olr' 
        }); 
      var fail = function(data) { 
            console.log(data) 
        }; 
      var success = function(data) { 
            wxMarkerData = data.wxMarkerData; 
            that.setData({ 
                markers: wxMarkerData 
            }); 
            that.setData({ 
                latitude: wxMarkerData[0].latitude 
            }); 
            that.setData({ 
                longitude: wxMarkerData[0].longitude 
            });
      }
      BMap.regeocoding({ 
            fail: fail, 
            success: success, 
            iconPath: '../img/marker_yellow.png', 
            iconTapPath: '../img/marker_red.png' 
        }); 
  },
  makertap: function(e) { 
        var that = this; 
        var id = e.markerId; 
        that.showSearchInfo(wxMarkerData, id); 
    }, 
  showSearchInfo: function(data, i) { 
        var that = this; 
        that.setData({ 
            rgcData: { 
                address: '地址：' + data[i].address + '\n', 
                desc: '描述：' + data[i].desc + '\n', 
                business: '商圈：' + data[i].business 
            } 
        }); 
    },  
  onReady:function(){
     wx.hideToast() 
  },
  onShow:function(){
    var myInterval=setInterval(getReturn,500);
    function getReturn(){
      wx.getStorage({
        key: 'user_openid',
        success: function(ress) {
          if(ress.data){
            clearInterval(myInterval)
              that.setData({
                loading:true
            })
          }
          

        } 
      })
    }
  },
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
})
},
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
  },
  clearPic:function(){//删除图片
    that.setData({
      isSrc:false,
      src:""
    })
  },
  setContent:function(e){//心情内容
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
  sendNewMood: function(e) {//保存日程
    //判断日程内容是否为空

    var content=e.target.dataset.content;
    var title=e.target.dataset.title;
    var address=e.target.dataset.address;
    if(content==""){
      common.dataLoading("内容不能为空","loading");
    }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
        wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Diary = Bmob.Object.extend("Diary");
              var diary = new Diary();
              var me = new Bmob.User();
              me.id=ress.data;
              diary.set("title",title);
              diary.set("content",content);
              diary.set("is_hide",that.data.ishide);
              diary.set("publisher", me);
              diary.set("likeNum",0);
              diary.set("commentNum",0);
              diary.set("liker",[]);
              diary.set("address",address);
              if(that.data.isSrc==true){
                  var name=that.data.src;//上传的图片的别名
                  var file=new Bmob.File(name,that.data.src);
                  file.save();
                  diary.set("pic",file);
              }
              diary.save(null, {
                success: function(result) {
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  common.dataLoading("添加日程成功","success",function(){
                      wx.navigateBack({
                          delta: 1
                      })
                  });
                },
                error: function(result, error) {
                  // 添加失败
                  console.log(error)
                  common.dataLoading("添加日程失败","loading");
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 

                }
            });


          }
        })
        
      
    }
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})
