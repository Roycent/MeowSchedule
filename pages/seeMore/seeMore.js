// pages/seeMore/seeMore.js
var that;
var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
var wxCharts = require('../../utils/wxcharts.js');
var vArray = [0, 0, 0, 0, 0];
var itlist = new Array();
var variety = ['学习', '工作', '娱乐', '健身', '其它'];
var vData = new Array();
var rectChart = null;
var ringChart = null;
var colorCanvas = ['#97b8eb', '#fac674' , '#80d29b', '#eb7d71',  '#e0a9da']
var actionSheetItems = ["今天", "最近七天", "本月", "今年","所有时间"];
var dateStartSelected = [];
var dateEndSelected=[];
var temp1 = 0;
var temp2 = 0;
Page({
  data: {
    varietyArray: [0, 0, 0, 0, 0],
    loading: false,
    hasItems: false,
    windowHeight: 0,
    windowWidth: 0,
    itemList: [],
    sTime: "1900-00-00",
    eTime: "2300-00-00",
    noChooseTime: true,
    shownavindex: '',
    timerShaft: true,
    time: "00:00",
    date: "2017-06-01",
    userDefinedFlag:false,
    noChooseTime:true,
    selectedTime:"所有时间"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.setData({
      loading: false
    });
    var today = new Date();
    var lastWeek = new Date(today.getTime() - 7 * 24 * 3600 * 1000);
    var dd = today.getDate();
    var ddLastWeek = lastWeek.getDate();
    var mm = today.getMonth() + 1; //一月是0
    var mmLastWeek = lastWeek.getMonth() + 1; //一月是0
    var yyyy = today.getFullYear();
    var yyyyLastWeek = lastWeek.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (ddLastWeek < 10) {
      ddLastWeek = '0' + ddLastWeek
    }
    if (mm < 10) {
      mmLastWeek = '0' + mmLastWeek
    }
    var thisDate = yyyy + '-' + mm + '-' + dd;
    var thisTime = hour + ':' + minutes;
    var lastWeekDate = yyyyLastWeek + '-' + mmLastWeek + '-' + ddLastWeek;
    dateStartSelected=[thisDate,lastWeekDate,yyyy+'-'+mm+'-00',yyyy+'-00-00',"1900-00-00"];
    dateEndSelected=[thisDate,thisDate,yyyy+'-'+mm+'32',yyyy+'-13-32',"2100-00-00"]
    that.setData({
      date: thisDate,
      time: thisTime
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
      },
    });
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        if (res.data) {
          var Schedule = Bmob.Object.extend("UserSchedule");
          var query = new Bmob.Query(Schedule);
          var isme = new Bmob.User();
          isme.id = res.data;
          query.equalTo("participant", isme);
          query.count({
            success: function (count) {
              if (count > 0) {
                console.log(count)
              }
            }
          })
        }
      },
    })
    

  },
  onReady: function () {
    that.searchDate();
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log("onShow called");
    that.setData({
      hasItems: false,
      itemList: [],
    });
    itlist=[];
    vArray = [0, 0, 0, 0, 0];
    vData = [];
    var myInterval = setInterval(function () {
      wx.getStorage({
        key: 'user_id',
        success: function (res) {

          // success
          if (res.data) {
            clearInterval(myInterval);
            var Schedule = Bmob.Object.extend("Schedule");
            var UserSchedule = Bmob.Object.extend("UserSchedule");
            var query = new Bmob.Query(Schedule);
            var userScheduleQuery = new Bmob.Query(UserSchedule);
            var isme = new Bmob.User();
            isme.id = res.data;
            userScheduleQuery.equalTo("participant", isme);
            query.matchesKeyInQuery("objectId", "itemID", userScheduleQuery);
            if (that.data.sTime != null) {
              that.setData({
                noChooseTime: false
              })
            }
            query.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                console.log("find");
                console.log(results.length);
                vArray = [0, 0, 0, 0, 0];  //11111
                for (var i = 0; i < results.length; i++) {
                  if ((that.data.noChooseTime&&results.length>0)||(results[i].get("plannedDate") >= (that.data.sTime) && results[i].get("plannedDate") <= (that.data.eTime))){
                    that.setData({
                      hasItems: true
                    })
                    var tempVariety = results[i].get("variety");
                    console.log("这个日程的时间是"+results[i].get("plannedDate"));
                    vArray[tempVariety]++;
                  }
                }
                that.setData({
                  varietyArray: vArray
                });
                if (that.data.hasItems) {
                  temp1 = vArray[0];        //保存数组中最大的值
                  for (var i = 1; i < 5; i++) {
                    if (temp1 < vArray[i])
                      temp1 = vArray[i];
                  }
                  temp2 = that.data.windowWidth * 0.67 / (temp1);  //平均每个所占的长度

                  rectChart = wx.createCanvasContext('rectCanvas');
                  rectChart.clearRect(0, 0, that.data.windowWidth, that.data.windowHeight);   //22222222
                  rectChart.setFontSize(15);
                  rectChart.setTextAlign('left');
                  var y=[0,1,2,3,4];      //44444444444444
                  for (var i = 0; i < 5; i++) {
                    rectChart.setFillStyle('#000000');
                    if (vArray[i]!=0){
                      rectChart.fillText(variety[i] + '    ' + vArray[i], 10, 18 + 34 * y[i]);  //文字
                      rectChart.setFillStyle(colorCanvas[i]);
                      rectChart.rect(10, 20 + 34 * y[i], temp2 * vArray[i], 10);    //矩形条
                      rectChart.fill();
                      rectChart.draw(true);
                    }
                    else{
                      if(i!=4)
                       for(var j=i+1;j<5; j++)
                        y[j]--;
                    }
                  }
                }
                vData = [];  //3333333
                for (var i = 0; i < 5; i++) {
                  if (vArray[i] != 0) {
                    vData.push({
                      name: variety[i],
                      data: vArray[i],
                      color: colorCanvas[i],
                      hasItems: true
                    })
                  }
                }
                if (that.data.hasItems) {
                  console.log("cccccccccc");
                  ringChart = new wxCharts({
                    animation: true,
                    canvasId: 'ringCanvas',
                    type: 'ring',
                    series: vData,
                    dataLabel: true,
                    width: that.data.windowWidth * 0.75,
                    height: that.data.windowHeight * 0.5
                  });
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
          console.log(res)
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    }, 500);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });

    console.log(vArray[1]);
  },
  onHide: function () {
    vArray = [0, 0, 0, 0, 0];
    itlist = [];
    vData = [];
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
    vArray = [0, 0, 0, 0, 0];
    itlist = [];
    vData = [];
  },
  setStartDate: function (e) {
    that.setData({
      startDate: e.detail.value
    })
  },
  setEndDate: function (e) {
    that.setData({
      endDate: e.detail.value
    })
  },
  searchDate: function () {
    console.log("searchDate called")
    itlist = [];
    var myInterval = setInterval(function () {
      wx.getStorage({
        key: 'user_id',
        success: function (res) {
          // success
          if (res.data) {
            clearInterval(myInterval);
            var UserSchedule = Bmob.Object.extend("UserSchedule");
            var userScheduleQuery = new Bmob.Query(UserSchedule);
            var Schedule = Bmob.Object.extend("Schedule");
            var scheduleQuery = new Bmob.Query(Schedule);
            var isme = new Bmob.User();
            isme.id = res.data;
            userScheduleQuery.equalTo("participant", isme);
            scheduleQuery.matchesKeyInQuery("objectId", "itemID", userScheduleQuery);
            scheduleQuery.ascending("plannedDate");
            scheduleQuery.find({
              success: function (results) {
                that.setData({
                  loading: true
                });
                for (var i = 0; i < results.length; i++) {
                  if (results[i].get("plannedDate") <= that.data.eTime && results[i].get("plannedDate") >= that.data.sTime) {
                    var jsonA;
                    var title = results[i].get("title");
                    if(title.length>20){
                      title = title.substr(0,19)+'...'
                    }
                    var content = results[i].get("content");
                    var id = results[i].id;
                    var created_at = results[i].createdAt;
                    var _url;
                    var pic = results[i].get("pic");
                    var address = results[i].get("address");
                    var finished = results[i].get("finished");
                    var date = results[i].get("plannedDate");
                    var variety = results[i].get("variety");
                    console.log(address);
                    for (; content.indexOf('\n') != -1;)
                      content = content.replace('\n', " ");
                    if (pic) {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","attachment":"' + pic._url + '","address":"' + address + '","date":"' + date + '","finished":"' + finished + '","variety":"' + variety + '"}';

                      console.log(jsonA);
                    }
                    else {
                      jsonA = '{"title":"' + title + '","content":"' + content + '","id":"' + id + '","created_at":"' + created_at + '","address":"' + address + '","date":"' + date + '","finished":"' + finished + '","variety":"' + variety + '"}';
                      console.log(jsonA);
                    }
                    var jsonB = JSON.parse(jsonA);
                    itlist.push(jsonB);

                    that.setData({
                      itemList: itlist,
                      loading: true
                    })
                  }
                }
                console.log(itlist.length);
                if (itlist.length == 0) {
                  wx.showModal({
                    title: 'Not found',
                    showCancel: 'false'
                  })
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

  },
  rectTouchHandler: function (e) {
    console.log(rectChart.getCurrentDataIndex(e));
  },
  ringTouchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },
  showSheet: function () {
    wx.showActionSheet({
      itemList: ["今天", "最近七天", "本月", "今年", "所有时间"],
      success(res) {
        if(!res.cancel){
        that.setData({
          selectedTime: actionSheetItems[res.tapIndex],
          sTime: dateStartSelected[res.tapIndex],
          eTime: dateEndSelected[res.tapIndex],
        })}
        console.log("xuanze"+res.tapIndex);
        that.onShow();
        that.searchDate();
      },
      fail(res){
        that.setData({
          selectedTime:"所有时间",
          sTime:'1900-00-00',
          eTime:'2100-00-00'
        })
      }
    })
  },
 
  changeToTimerShaft:function(e){
    that.setData({
      timerShaft:true
    })
  },
  changeToDiagram:function(e){
    that.setData({
      timerShaft:false
    })
  },
  timerShaftBtnClick:function(e){
    that.onShow();
    that.changeToDiagram();
  },
  diagramBtnClick:function(e){
    that.changeToTimerShaft();
    that.searchDate();
  }
})