//index.js
//获取应用实例
var app = getApp()
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var that;
var itlist= new Array();
Page({
  data: {
    itemList: [],
    limit: 100,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    searchKeyword: '',
    countIt:0,
    countFIt:0
  },
  onLoad: function (options) {
    that=this;
   itlist=[];
  },

  onShow: function () {
    itlist = [];
    that = this;
    that.setData({
      loading: false
    });
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            var Schedule = Bmob.Object.extend("UserSchedule");
            var query = new Bmob.Query(Schedule);
            var isme = new Bmob.User();
            isme.id = ress.data;
            query.equalTo("participant", isme);
            query.count({
              success: function (count) {
                that.setData({
                  countIt: count
                })
              }
            });
            var mySchedule = Bmob.Object.extend("Schedule");
            var myScheduleQuery = new Bmob.Query(mySchedule);
            myScheduleQuery.matchesKeyInQuery("objectId", "itemID",query);
            if (that.data.limit == 100) {
              myScheduleQuery.limit(that.data.limit);
            }

             if (that.data.limit > 100) {
               myScheduleQuery.limit(2);
               myScheduleQuery.skip(that.data.limit - 2);
               console.log(that.data.limit);
               console.log("skip")
             }
            myScheduleQuery.descending("plannedDate");
            myScheduleQuery.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                for (var i = 0; i < results.length; i++) {
                  var jsonA;
                  var title = results[i].get("title");
                  var content = results[i].get("content");
                  var id = results[i].id;
                  var created_at = results[i].createdAt;
                  var _url;
                  var pic = results[i].get("pic");
                  var picUrl = results[i].get("pictureUrl");
                  var address = results[i].get("address");
                  var importance = results[i].get("importance");
                  var picFlag=0;
                  var plannedDate=results[i].get("plannedDate");
                  var plannedTime=results[i].get("time");
                  var arr=[];
                  arr=plannedDate.split("-");
                  var plannedYear=arr[0];
                  var plannedMonth=arr[1];
                  var plannedDay=arr[2];
                  var finished = results[i].get("finished");
                  for (; content.indexOf('\n') != -1;)
                    content = content.replace('\n', " ");
                  if (pic || picUrl) {
                    picFlag=1;
                    if (pic) {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + pic._url + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                    } else {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + picUrl + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'

                    }
                  }
                  else {
                    picFlag=0;
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  if(!finished){
                     itlist.unshift(jsonB);
                  }else{
                    itlist.push(jsonB);
                  }
                  
                  that.setData({
                    itemList: itlist,
                    loading: true
                  })
                }
              },
              error: function (error) {
                common.dataLoading(error, "loading");
                that.setData({
                  loading: true
                })
                console.log(error)
              }
            });
            myScheduleQuery.equalTo("finished", true);
            /*myScheduleQuery.find({
              success: function(results)
              {
                results.equalTo("finished",true);
              }
            });*/
            myScheduleQuery.count({
              success: function (count) {
                that.setData({
                  countFIt: count
                })
              }
            });
          }
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

  },
  onReady: function () {

  },
  onHide: function (){
    itlist=[];
  },
  onUnload: function (event) {

  },
  pullUpLoad: function (e) {
    that.loadMore();
  },
  pullDownRefresh: function () {
    console.log("refresh");
    that.onLoad();
  },
  setSearchKeyword: function(e){
    that.setData({
      searchKeyword:e.detail.value
    })
  },
  loadMore: function(){
    if(that.data.countIt>15){
      wx.getStorage({
        key: 'user_id',
        success: function (res) {
          if (res.data) {
            var Schedule = Bmob.Object.extend("UserSchedule");
            var query = new Bmob.Query(Schedule);
            var isme = new Bmob.User();
            isme.id = res.data;
            query.equalTo("participant", isme);
            var mySchedule = Bmob.Object.extend("Schedule");
            var myScheduleQuery = new Bmob.Query(mySchedule);
            myScheduleQuery.equalTo("participant", isme);
            myScheduleQuery.matchesKeyInQuery("objectId", "itemID", query);
            myScheduleQuery.skip(that.data.limit);
            myScheduleQuery.limit(2);
            myScheduleQuery.descending("plannedDate");
            myScheduleQuery.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                              for (var i = 0; i < results.length; i++) {
                  var jsonA;
                  var title = results[i].get("title");
                  var content = results[i].get("content");
                  var id = results[i].id;
                  var created_at = results[i].createdAt;
                  var _url;
                  var pic = results[i].get("pic");
                  var picUrl = results[i].get("pictureUrl");
                  var address = results[i].get("address");
                  var importance = results[i].get("importance");
                  var picFlag=0;
                  var plannedDate=results[i].get("plannedDate");
                  var plannedTime=results[i].get("time");
                  var arr=[];
                  arr=plannedDate.split("-");
                  var plannedYear=arr[0];
                  var plannedMonth=arr[1];
                  var plannedDay=arr[2];
                  var finished = results[i].get("finished");
                  for (; content.indexOf('\n') != -1;)
                    content = content.replace('\n', " ");
                  if (pic || picUrl) {
                    picFlag=1;
                    if (pic) {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + pic._url + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                    } else {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + picUrl + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'

                    }
                  }
                  else {
                    picFlag=0;
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                  }
                  var jsonB = JSON.parse(jsonA);
                  if(!finished){
                     itlist.unshift(jsonB);
                  }else{
                    itlist.push(jsonB);
                  }
                  
                  that.setData({
                    itemList: itlist,
                    loading: true
                  })
                }
              },
              error: function (error) {
                common.dataLoading(error, "loading");
                that.setData({
                  loading: true
                })
                console.log(error)
              }
            });
            that.setData({
              limit : that.data.limit + 2
            })
          }
        },
      })
      
    }
  },
  toSearch:function(){
    wx.navigateTo({
      url: '../search/search?searchKeyword='+that.data.searchKeyword,
    })
  }

})


