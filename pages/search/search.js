// pages/search/search.js
var common = require('../template/getCode.js');
var Bomb = require('../../utils/bmob.js');
var that;
var itlist = new Array();
Page({
  data:{
    itemList: [],
    limit: 20,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    searchKeyword:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.setData({
      loading: true,
      searchKeyword:options.searchKeyword
    });
    console.log(that.data.searchKeyword);
    console.log(itlist);
    var myInterval = setInterval(function (){
      wx.getStorage({
        key: 'user_id',
        success: function(res){
          // success
          if(res.data){
            clearInterval(myInterval);
            var userSchedule = Bomb.Object.extend("UserSchedule");
            var userScheduleQuery = new Bomb.Query(userSchedule);
            var searchedSchedule = Bomb.Object.extend("Schedule");
            var searchedScheduleQuery = new Bomb.Query(searchedSchedule);
            var isme = new Bomb.User();
            isme.id = res.data;
            userScheduleQuery.equalTo("participant", isme);
            searchedScheduleQuery.matchesKeyInQuery("objectId", "itemID", userScheduleQuery);
            if(that.data.limit==20){
              searchedScheduleQuery.limit(that.data.limit);
            }
            if(that.data.limit>20){
              searchedScheduleQuery.limit(2);
              searchedScheduleQuery.skip(that.data.limit-2);
            }
            searchedScheduleQuery.ascending("plannedDate");
            searchedScheduleQuery.find({
              success: function(results){
                that.setData({
                  loading:true
                });
                for(var i = 0; i < results.length; i++){                            
                  var jsonA;
                  var title=results[i].get("title");
                  var content=results[i].get("content");
                  var id=results[i].id;
                  var created_at=results[i].createdAt;
                  var _url;
                  var pic=results[i].get("pic");
                  var address=results[i].get("address");
                  var importance = results[i].get("importance");
                  var picFlag = 0;
                  var plannedDate = results[i].get("plannedDate");
                  var plannedTime = results[i].get("time");
                  var arr = [];
                  arr = plannedDate.split("-");
                  var plannedYear = arr[0];
                  var plannedMonth = arr[1];
                  var plannedDay = arr[2];
                  var finished = results[i].get("finished");
                  var searching = that.data.searchKeyword;
                  if(title.search(searching)!=-1 || content.search(searching)!=-1)
                  {
                  for (; content.indexOf('\n') != -1;)
                      content = content.replace('\n', " ");
                  if(pic){
                    picFlag=1;
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + pic._url + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                    }
                     else{
                       picFlag=0;
                    jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","address":"' + address + '","importance":"' + importance + '","picFlag":"' + picFlag + '","plannedYear":"' + plannedYear + '","plannedMonth":"' + plannedMonth + '","plannedDay":"' + plannedDay + '","plannedTime":"' + plannedTime + '","finished":"' + finished + '"}'
                       }
                  var jsonB=JSON.parse(jsonA);
                  itlist.push(jsonB)
                  that.setData({
                    itemList:itlist,
                    loading: true
                    })        
                }
                }
              },//end of query.find.success
              error: function(error){
                common.dataLoading(error,"loading");
                that.setData({
                  loading: ture
                });
                console.log(error)
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
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
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
    itlist=[];
    // 页面隐藏
  },
  onUnload:function(){
    itlist=[];
    // 页面关闭
  },
  pullUpLoad: function (e) {
    var limit = this.data.limit + 2
    that.setData({
      limit: limit
    });
    that.onLoad();
  },
  pullDownRefresh: function () {
    console.log("refresh");
    that.onLoad();
  },
  setSearchKeyword:function(e){
    that.setData({
      searchKeyword:e.detail.value
    })
  },
  toSearch:function(){
    wx.navigateTo({
      url: '../search/search?searchKeyword='+that.data.searchKeyword,
    })
  }
})