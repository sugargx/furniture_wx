var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    factoryimages: "",
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
      url: app.globalData.url + "/api/getFactoryImages/" + options.id,
      method: "GET",
      success: function (res) {
        // console.log(res, "请求工厂图片")
        that.setData({
          factoryimages: res.data
        })
      }
    })
  },
})