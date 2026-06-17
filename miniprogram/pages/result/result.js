// pages/result/result.js
Page({
  data: {
    taskId: null,
    originalImage: null,
    resultImage: null,
    selectedStyle: 'business',
    unlocked: false,
    styles: [
      { id: 'business', name: '商务证件', thumbnail: '/images/style-business.png' },
      { id: 'linkedin', name: 'LinkedIn', thumbnail: '/images/style-linkedin.png' },
      { id: 'creative', name: '创意形象', thumbnail: '/images/style-creative.png' },
      { id: 'formal', name: '正式证件', thumbnail: '/images/style-formal.png' }
    ],
    adUnitId: '' // 激励视频广告位 ID，需在后台申请
  },

  onLoad: function (options) {
    this.setData({
      taskId: options.taskId,
      originalImage: options.originalImage || '/images/demo-original.jpg'
    });
    this.loadResult();
  },

  loadResult: function () {
    // TODO: 轮询云函数查询生成结果
    // 模拟结果
    setTimeout(() => {
      this.setData({
        resultImage: '/images/demo-result.jpg'
      });
    }, 2000);
  },

  selectStyle: function (e) {
    const styleId = e.currentTarget.dataset.id;
    this.setData({ selectedStyle: styleId });
    // TODO: 切换风格重新加载预览
  },

  watchAd: function () {
    const that = this;
    const videoAd = wx.createRewardedVideoAd({
      adUnitId: this.data.adUnitId
    });

    videoAd.onClose(function (res) {
      if (res && res.isEnded) {
        // 用户完整观看了广告
        that.setData({ unlocked: true });
        wx.showToast({ title: '已解锁', icon: 'success' });
      } else {
        wx.showToast({ title: '需要看完广告才能解锁哦', icon: 'none' });
      }
    });

    videoAd.show().catch(() => {
      videoAd.load().then(() => videoAd.show()).catch((err) => {
        console.error('广告加载失败:', err);
        wx.showToast({ title: '广告加载失败，请稍后重试', icon: 'none' });
      });
    });
  },

  subscribe: function () {
    // TODO: 接入微信虚拟支付（需企业主体）
    wx.showToast({ title: '会员功能即将上线', icon: 'none' });
  },

  downloadImage: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.resultImage,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('auth deny') !== -1 || err.errMsg.indexOf('authorize') !== -1) {
          wx.showModal({
            title: '需要授权',
            content: '请允许保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: 'AI 证件照 - 一张自拍，多种专业风格',
      path: '/pages/index/index'
    };
  }
});
