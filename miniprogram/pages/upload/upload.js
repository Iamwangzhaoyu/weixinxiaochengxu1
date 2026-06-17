// pages/upload/upload.js
Page({
  data: {
    scene: null,
    imagePath: null,
    generating: false
  },

  onLoad: function (options) {
    this.setData({ scene: options.scene || 'business' });
  },

  chooseImage: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imagePath: res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  generatePhoto: function () {
    if (!this.data.imagePath || this.data.generating) return;

    this.setData({ generating: true });

    // 上传图片到云存储
    const cloudPath = `user-photos/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.imagePath,
      success: (uploadRes) => {
        // 调用云函数生成 AI 照片
        wx.cloud.callFunction({
          name: 'generatePhoto',
          data: {
            fileID: uploadRes.fileID,
            scene: this.data.scene
          },
          success: (result) => {
            this.setData({ generating: false });
            wx.navigateTo({
              url: `/pages/result/result?taskId=${result.result.taskId}`
            });
          },
          fail: (err) => {
            this.setData({ generating: false });
            wx.showToast({ title: '生成失败，请重试', icon: 'none' });
            console.error('生成失败:', err);
          }
        });
      },
      fail: (err) => {
        this.setData({ generating: false });
        wx.showToast({ title: '上传失败', icon: 'none' });
        console.error('上传失败:', err);
      }
    });
  }
});
