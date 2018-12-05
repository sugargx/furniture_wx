import util from '../../utils/util'

const app = getApp();

Page({
    data: {
        windowWidth: 0,
        windowHeight: 0,
        contentHeight: 0,
        thinkList: [],
        offset: 0,
        lineHeight: 30,
        content: '全屋定制家居',
        content1: '全屋定制工厂网上抢单',
        content2: '直省50%以上',
        content3: '月网上抢单数',
        content4: '今天仅剩',
        content5: '个名额',
        content6: '长按识别二维码',
        content7: '立即报名抢单',
        // 数量展示
        all_num: '',
        remain_num: '',
        // 缓存图片路径
        filePath: "",
    },

    onLoad: function (options) {
        var that = this
        var month = new Date() // 获取当前月份
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    offset: (res.windowWidth - 300) / 2
                });
            }
        });

        // 请求当前活动
        wx.request({
          url: app.globalData.url + '/api/getActivity',
          method: "GET",
          success: function(res) {
            if (res.data.code == 1) {
              // console.log(res, '有活动返回的信息')
              that.setData({
                all_num: res.data.quota, // 抢单数
                remain_num: res.data.quota - res.data.applied, // 剩余名额
                content3: month.getMonth() + 1 + ' 月网上抢单数', // 当前月份
              })
            } else if (res.data.code == 0) {
              // console.log(res, '无活动返回的信息')
            }
          }
        })

        wx.downloadFile({
            url: app.globalData.url + '/api/getImage?id=' + app.globalData.userInfo.id,
            header: 'content-type:image/jpeg',
            success: function (res) {
                // console.log(res.tempFilePath, "res1")
                if (res.statusCode === 200) {
                    // console.log(res.tempFilePath, "res2")
                    that.setData({
                        filePath: res.tempFilePath,
                    })
                    setTimeout(function () {
                        that.getData()
                    }, 200)
                // console.log(that.data.filePath, "filePath1")
                }
                // console.log(that.data.filePath, "res3")
            }
        })
        // console.log(that.data.filePath, "filePath2")
        
    },

    getData: function () {
        var that = this;
        var i = 0;
        var lineNum = 1;
        var thinkStr = '';
        var thinkList = [];
        for (var item of that.data.content) {
            if (item === '\n') {
                thinkList.push(thinkStr);
                thinkList.push('a');
                i = 0;
                thinkStr = '';
                lineNum += 1;
            } else if (i === 19) {
                thinkList.push(thinkStr);
                i = 1;
                thinkStr = item;
                lineNum += 1;
            } else {
                thinkStr += item;
                i += 1;
            }
        }
        thinkList.push(thinkStr);
        that.setData({ thinkList: thinkList });
        that.createNewImg(lineNum);
    },

    drawSquare: function (ctx, height) {
        ctx.rect(0, 0, this.data.windowWidth, height);
        ctx.setFillStyle("#f5f6fd");
        ctx.fill()
    },

    drawFont: function (ctx, content, left, height, size, color) {
        ctx.setFontSize(size);
        ctx.setFillStyle(color);
        ctx.fillText(content, this.data.offset + left, height);
    },

    drawLine: function (ctx, height) {
        ctx.beginPath();
        ctx.moveTo(this.data.offset, height - 50);
        ctx.lineTo(this.data.windowWidth - this.data.offset, height - 50);
        ctx.stroke('#eee');
        ctx.closePath();
    },

    createNewImg: function (lineNum) {
        var that = this;
        var qrpath = that.data.filePath;
        var ctx = wx.createCanvasContext('myCanvas');
        var contentHeight = lineNum * that.data.lineHeight + 450;
        that.drawSquare(ctx, contentHeight);
        that.setData({ contentHeight: contentHeight });
        var height = 100;
        for (var item of that.data.thinkList) {
            if (item !== 'a') {
                that.drawFont(ctx, item, height);
                height += that.data.lineHeight;
            }
        }
        // console.log(that.data.filePath, "data")
        // 背景图
        ctx.drawImage('../../images/bm_bg.jpg', that.data.windowWidth - that.data.offset - 300, lineNum * that.data.lineHeight + 20, 300, 400);
        // 文字
        that.drawFont(ctx, that.data.content1, 30, lineNum * that.data.lineHeight + 80, 25, "#000");
        that.drawFont(ctx, that.data.content2, 80, lineNum * that.data.lineHeight + 120, 25, "#000");
        that.drawFont(ctx, that.data.content3, 40, lineNum * that.data.lineHeight + 170, 25, "#000");
        that.drawFont(ctx, that.data.all_num, 220, lineNum * that.data.lineHeight + 170, 25, "red");
        that.drawFont(ctx, that.data.content4, 40, lineNum * that.data.lineHeight + 220, 25, "#000");
        that.drawFont(ctx, that.data.remain_num, 150, lineNum * that.data.lineHeight + 220, 25, "red");
        that.drawFont(ctx, that.data.content5, 190, lineNum * that.data.lineHeight + 220, 25, "#000");
        that.drawFont(ctx, that.data.content6, 20, lineNum * that.data.lineHeight + 320, 22, "#000");
        that.drawFont(ctx, that.data.content7, 30, lineNum * that.data.lineHeight + 360, 22, "#000");
        // 二维码
        ctx.drawImage(qrpath, that.data.windowWidth - that.data.offset - 120, lineNum * that.data.lineHeight + 280, 120, 140);
        ctx.draw();
    },

    savePic: function () {
        var that = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.windowWidth,
            height: that.data.contentHeight,
            canvasId: 'myCanvas',
            success: function (res) {
                util.savePicToAlbum(res.tempFilePath)
            }
        })
    }
});