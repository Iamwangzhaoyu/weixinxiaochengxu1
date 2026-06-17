// pages/scene/scene.js
Page({
  data: {
    scenes: [
      { id: 'business', name: '商务证件照', icon: '/images/icon-business.png', description: '正式、专业' },
      { id: 'linkedin', name: 'LinkedIn', icon: '/images/icon-linkedin.png', description: '职场社交' },
      { id: 'resume', name: '简历照', icon: '/images/icon-resume.png', description: '简洁大方' },
      { id: 'creative', name: '创意形象', icon: '/images/icon-creative.png', description: '个性展示' }
    ],
    selectedScene: null
  },

  selectScene: function (e) {
    this.setData({ selectedScene: e.currentTarget.dataset.id });
  },

  goUpload: function () {
    if (!this.data.selectedScene) return;
    wx.navigateTo({
      url: `/pages/upload/upload?scene=${this.data.selectedScene}`
    });
  }
});
