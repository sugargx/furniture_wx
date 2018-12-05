// pages/customs/customs.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer: "", // 客户数据 姓名，安装时间，地址，图片

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000, //滑动动画时长
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this
  this.setData({
    url:app.globalData.url
  })
  wx.request({
    url: app.globalData.url + "/api/getCustomer",
    method: "GET",
    success: function (res) {
      // console.log(res, "请求客户实例")
      that.setData({
        customer: res.data
      })
    }
  })
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     console.log('到底了兄弟！')
  },

})