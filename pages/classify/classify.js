//获取应用实例
var app = getApp()
var common = require('../template/getCode.js')
var Bmob=require("../../utils/bmob.js");
var that;
var sum, studySum, workSum, entertainmentSum, exerciseSum, otherSum;  //各类日程项的总个数
var percent0, percent1, percent2, percent3, percent4;  //各类日程项的百分比
Page({
  data:{
        loading: false,
        sum: 0,
        studySum: 0,
        workSum: 0,
        entertainmentSum: 0,
        exerciseSum: 0,
        otherSum: 0,
        percent0: 0,
        percent1: 0,
        percent2: 0,
        percent3: 0,
        percent4: 0
  },  //end of data
  onLoad:function(options){
                           // 生命周期函数--监听页面加载, options为页面跳转所带来的参数
                           // 监听页面显示
        that=this;
        var myInterval=setInterval(getReturn,500);
        function getReturn(){
            wx.getStorage({
              key: 'user_id',
              success: function(res){
                    if(res.data){
                        clearInterval(myInterval)
                        var Schedule = Bmob.Object.extend("Schedule");
                        var isme = new Bmob.User();
                        isme.id=res.data;
                        
                        var query1 = new Bmob.Query(Schedule);
                        query1.equalTo("participant", isme);
                        query1.count({
                            success:function(count){                                
                                that.setData({
                                    sum:count   //当前用户的日程项总数
                                })
                            },                             
                        })
                     
                        var query2 = new Bmob.Query(Schedule);
                        query2.equalTo("participant", isme);
                        query2.equalTo("variety",0);  //学习
                        query2.count({
                            success:function(count){
                                that.setData({
                                    studySum: count//当前用户的学习日程项总数
                                 })
                            }
                        })
                        var query3 = new Bmob.Query(Schedule);
                        query3.equalTo("participant", isme);
                        query3.equalTo("variety",1);  //工作
                        query3.count({
                            success:function(count){
                                that.setData({
                                    workSum: count,//当前用户的工作日程项总数                                   
                                })
                            }
                        })
                        var query4 = new Bmob.Query(Schedule);
                        query4.equalTo("participant", isme);
                        query4.equalTo("variety",2);  //娱乐
                        query4.count({
                            success:function(count){
                                that.setData({
                                    entertainmentSum: count//当前用户的娱乐日程项总数
                                })
                            }
                        })
                        var query5 = new Bmob.Query(Schedule);
                        query5.equalTo("participant", isme);
                        query5.equalTo("variety",3);  //健身
                        query5.count({
                            success:function(count){
                                that.setData({
                                    exerciseSum: count//当前用户的健身日程项总数
                                })    
                            }
                        })
                        var query6 = new Bmob.Query(Schedule);
                        query6.equalTo("participant", isme);
                        query6.equalTo("variety",4);  //其他
                        query6.count({
                            success:function(count){
                                that.setData({
                                    otherSum: count//当前用户的其他日程项总数
                                }) 
                            }
                        })
                        /* that.setData({
                            loading: true,
                            percent0: parseFloat(studySum)/parseFloat(sum),
                            percent1: parseFloat(workSum)/parseFloat(sum),
                            percent2: parseFloat(entertainmentSum)/parseFloat(sum),
                            percent3: parseFloat(exerciseSum)/parseFloat(sum),
                            percent4: parseFloat(otherSum)/parseFloat(sum),
                        });*/
                        //percent0=studySum/sum,
                        console.log(studySum/sum*100);//测试结果是否正确
                        console.log(workSum/sum*100);//测试结果是否正确
                        console.log(entertainmentSum/sum*100);//测试结果是否正确
                        console.log(exerciseSum/sum*100);//测试结果是否正确
                        console.log(otherSum/sum*100);//测试结果是否正确    
                    }//end of if
              },//end of success
                   
            }) 
        }//end of getReturn
  },  //end of onLoad
  onReady:function(){
                      // 监听页面初次渲染完成
    
  }, //end of onReady
  onShow:function(){
        
  },   //end of onShow
  onHide:function(){
                            // 监听页面隐藏

  },   //end of onHide
  onUnload:function(){
                            // 监听页面卸载

  },   //end of onUnload
  onPullDownRefresh: function() {
                            // 页面相关事件处理函数--监听用户下拉动作

  },   //end of onPullDownRefresh
  onReachBottom: function() {
                                // 页面上拉触底事件的处理函数

  },   //end of onReachBottom
  onShareAppMessage: function() {
                                    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }  //end of onShareAppMessage
})  //end of Page