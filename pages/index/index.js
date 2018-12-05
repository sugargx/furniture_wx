// pages/index/index.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //是否有活动显示
    condition: false,

    // 数量展示
    month: '',
    all_num: '',
    remain_num: '',

    //首页底部的电话
    telephone: '0533-2868618',

    //下拉框
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //下拉列表的数据
    index: 0, //选择的下拉列表下标

    hidden: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "",
    phone: "",
    // // 授权登录按钮是否显示
    // shouquanButton:true,
    //无活动时的电话显示
    noactive_telephone: '16605332967',

    //顶部
    // topNum: 0,

    // 业务员信息
    salesman: "",

    //全新设备图片3张
    device1:'../../images/bm_bg.jpg',
    device2:'../../images/bm_bg.jpg',
    device3:'../../images/bm_bg.jpg'
  },
  goTop: function() {
    this.setData({
      topNum: this.data.topNum = 0
    });
  },
  // 点击下拉显示框 
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var userInfo = app.globalData.userInfo
    var month = new Date() // 获取当前月份
    that.setData({
      salesman: options, // 存储业务员信息
    })
    // console.log(that.data.salesman, '业务员信息');
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            canIUse: false
          })
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo
              that.login()
            }
          })
        }
      }
    })
    // 请求可选择区域
    wx.request({
      url: app.globalData.url + "/api/getArea",
      method: "GET",
      success: function(res) {
        // console.log(res, "请求当前区域")
        // console.log(res.data,"区域")
        that.setData({
          selectData: res.data
        })
      }
    })
    // 请求当前活动
    wx.request({
      url: app.globalData.url + '/api/getActivity',
      method: "GET",
      success: function(res) {
        if (res.data.code == 1) {
          // console.log(res, '有活动返回的信息')
          that.setData({
            condition: true, // 有活动
            all_num: res.data.quota, // 抢单数
            remain_num: res.data.quota - res.data.applied, // 剩余名额
            month: month.getMonth() + 1, // 当前月份
            activityid: res.data.id, // 活动id
          })
        } else if (res.data.code == 0) {
          // console.log(res, '无活动返回的信息')
          that.setData({
            condition: false, // 无活动
          })
        }
      }
    })
    // 浏览量
    if (that.data.salesman.id) {
      wx.request({
        url: app.globalData.url + '/api/visit',
        method: "POST",
        data: {
          'salesmanid': that.data.salesman.id
        },
        success: res => {
          // console.log(res, "业务员的浏览量信息")
        }
      })
    }
  },
  login: function() {
    var that = this
    wx.login({
      success: res => {
        wx.request({
          method: "POST",
          url: app.globalData.url + "/api/login",
          data: {
            'code': res.code,
            'userInfo': app.globalData.userInfo
          },
          success: res => {
            app.globalData.userInfo = res.data
            // that.setData({
            //   'shouquanButton':false
            // })
            // console.log(res.data, "后台获取用户信息")
            // console.log(that.data.shouquanButton,'授权登录按钮是否显示')
            if (res.data.group == 2) {
              this.setData({
                hidden: false
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },
  bindGetUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      canIUse: false
    })
    this.login()
  },
  //表单提交
  formSubmit: function(e) {
    var that = this
    var areaid = that.data.index
    // console.log(that.data.index,'用户选择的区域下标')
    // console.log(that.data.selectData,'所有区域')
    var mobile = /^1\d{10}$/;
    var isMobile = mobile.exec(e.detail.value.phone)
    console.log(e.detail.value.phone, "输入手机号")
    if (e.detail.value.name == '') {
      wx.showModal({
        title: '姓名不能为空',
        content: '',
      })
      return;
    }
    if (e.detail.value.phone == '') {
      wx.showModal({
        title: '手机号不能为空',
        content: '',
      })
      return;
    } 
    if (e.detail.value.phone.length != 11){
      wx.showModal({
        title: '手机号输入位数有误！',
        content: '',
      })
      return;
    } 
    else if (!isMobile){
      wx.showModal({
        title: '手机号输入有误，请重新检查填写！',
        content: '',
      })
      return;
    }
    // 用户报名
    setTimeout(
    wx.request({
      url: app.globalData.url + "/api/apply",
      method: "POST",
      data: {
        name: e.detail.value.name, // 用户姓名
        phone: e.detail.value.phone, // 用户电话
        id: app.globalData.userInfo.id, // 用户id
        salesmanid: that.data.salesman.id, // 业务员id
        type: that.data.salesman.type, // 报名类型 1：卡片消息 2：二维码
        activityid: that.data.activityid, // 活动id
        areaid: that.data.selectData[areaid]['id'], // 区域id
      },
      success: function(res) {
        // console.log(res, '报名后返回的信息')
        if (res.data.code == 1) {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 3000
          }),
          wx.request({
            url: app.globalData.url + "/api/template",
            method: "POST",
            data: {
              id: app.globalData.userInfo.id,
              formId: e.detail.formId,
            },
            success: function(res) {
              // console.log(res, "发送模板消息");
            }
          })
        } else if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '报名失败，请稍后重试！',
            icon: 'none',
            duration: 3000
          })
        }
      }
    }), 5000)
  },
  call: function() {
    wx.makePhoneCall({
      phoneNumber: '0533-2868618',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  bindCanvas: function () {
    wx.navigateTo({ url: '../canvas/canvas' })
  },
  /** 
   * 用户点击右上角分享
   */

  onShareAppMessage: function() {
    var that = this
    return {
      // title: that.data.name,
      path: '/pages/index/index?id=' + app.globalData.userInfo.id + '&type=1',
      // imageUrl: that.data.page.titleImage,
      success: (res) => {
        // console.log(res)
        wx.request({
          url: app.globalData.url + "/api/forward",
          method: "POST",
          data: {
            id: app.globalData.userInfo.id
          },
          success: function (res) {
            // console.log(res)
          }
        })
      },
      fail: (res) => {

      }
    }
  },

  // 下拉刷新
  onPullDownRefresh:function(){
    // this.onLoad()
    wx.stopPullDownRefresh()
  },

})