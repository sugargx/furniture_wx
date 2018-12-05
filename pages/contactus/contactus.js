// pages/contactus/contactus.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factory: "", // 工厂展示数据 名称，封面，相册
    telephone: '0533-2868618',
    watch_telephone:'16605332967',

    //幻灯片
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 2000, //滑动动画时长
    
    // 地图
    latitude: 36.7516679377,
    longitude: 117.9849135876,
    markers: [{
      id: 1,
      latitude: 36.7516679377,
      longitude: 117.9849135876,
      name: '山东省淄博市张店区傅家镇向阳村西500米',
      iconPath: '/images/location.png',
      lable: '山东省淄博市张店区傅家镇向阳村西500米',
      title: '山东省淄博市张店区傅家镇向阳村西500米'
    }]
    },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  call_zixun:function(){
    wx.makePhoneCall({
      phoneNumber: '0533-2868618',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  call_qiangdan: function(){
    wx.makePhoneCall({
      phoneNumber: '16605332967',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  moreGoto: function(event){
    // console.log(event.currentTarget.dataset.id, "工厂信息")
    wx.navigateTo({
      url: '../factory_show/factory_show?id=' + event.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      url: app.globalData.url
    })
    wx.request({
      url: app.globalData.url + "/api/getFactory",
      method: "GET",
      success: function (res) {
        // console.log(res, "请求工厂展示")
        that.setData({
          factory: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // this.onLoad()
    wx.stopPullDownRefresh()
  },
})