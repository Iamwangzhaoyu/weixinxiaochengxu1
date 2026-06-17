// pages/index/index.js
Page({
  data: {
    scenes: [],
    userCount: 0
  },

  onLoad: function () {
    this.loadScenes();
    this.loadUserCount();
  },

  loadScenes: function () {
    // TODO: 从云数据库加载场景列表
    this.setData({
      scenes: [
        { id: 'business', name: '商务证件照', thumbnail: '/images/scene-business.png', priceLabel: '看广告免费' },
        { id: 'linkedin', name: 'LinkedIn 头像', thumbnail: '/images/scene-linkedin.png', priceLabel: '看广告免费' },
        { id: 'creative', name: '创意形象照', thumbnail: '/images/scene-creative.png', priceLabel: '看广告免费' }
      ]
    });
  },

  loadUserCount: function () {
    // TODO: 从云数据库查询用户数
    this.setData({ userCount: 1280 });
  },

  selectScene: function (e) {
    const sceneId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/upload/upload?scene=${sceneId}`
    });
  },

  startGenerate: function () {
    wx.navigateTo({ url: '/pages/scene/scene' });
  }
});
