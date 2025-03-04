const personalFile = {
  postId: null,
  userId: null,
  config: {
    forum: null,
    userGroups: [],
    style: '',
  },
  topics: [],
  initData: {
    banner: 'https://forumupload.ru/uploads/001b/5c/7f/124/747355.png',
    avatar: 'https://forumupload.ru/uploads/001b/f1/af/2/719963.png',
  },
  data: {
    banner: '',
    avatar: '',
    info: '',
    charlist: '',
    achievements: '',
    link: '',
    quicklinks: [],
  },
  init: function (config) {
    if (GroupID === 3) return;
    this.config.forum = config.forum || null;
    this.config.userGroups = config.userGroups || [];
    this.config.style = config.style || '';
    this.initData.banner = config.defaultBanner || this.initData.banner;
    this.initData.avatar = config.defaultAvatar || this.initData.avatar;
    this.addStyle();
    this.renderButtons();
    this.renderModal();
  },
  addStyle: function () {
    if (!this.config.style) return;
    const style = `<link rel="stylesheet" href="${this.config.style}">`;
    document.head.insertAdjacentHTML('beforeend', style);
  },
  renderButtons: function () {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
      if (!this.config.userGroups.includes(Number(post.dataset.groupId))) {
        return;
      }

      const userId = post.dataset.userId;
      const postId = Number(post.id.slice(1));
      const profile = post.querySelector('.post-author ul');
      const li = '<li class="pa-personal-file"><button class="pa-personal-file-button">Личное дело</button></li>';
      profile.insertAdjacentHTML('beforeend', li);
      profile.addEventListener('click', (event) => {
        if (!event.target.classList.contains('pa-personal-file-button')) return;
        this.toggleModal(userId, postId);
      });
    });
  },
  renderModal: function () {
    this.modal = document.createElement('div');
    this.modal.id = 'pf_dialog';
    this.modal.classList.add('hidden');
    this.modal.innerHTML = '<div class="pf_bg"><div class="inner container">' +
        '<div class="pf_profile">' +
        '<div class="pf_banner" id="pf_banner">' +
        '<a class="pf_edit_link" id="pf_edit_link" target="_blank" href=""></a>' +
        '<div class="pf_avatar" id="pf_avatar"></div>' +
        '<div class="pf_quicklinks" id="pf_quicklinks"></div>' +
        '</div>' +
        '<div class="pf_info" id="pf_info">' +
        '</div>' +
        '<div class="pf_charlist" id="pf_charlist"></div>' +
        '</div>' +
        '<div class="pf_right"><h2>Полученные достижения:</h2>' +
        '<div class="pf_achievements" id="pf_achievements"></div>' +
        '</div>' +
        '</div></div>';
    document.getElementById('pun-main').append(this.modal);
    this.modal.addEventListener('click', (event) => {
      if (event.target.classList.contains('pf_bg')) {
        this.toggleModal();
      }
    });
  },
  clearModal: function () {
    document.getElementById('pf_banner').style.backgroundImage = 'none';
    document.getElementById('pf_avatar').style.backgroundImage = 'none';
    document.getElementById('pf_info').innerHTML = '';
    document.getElementById('pf_charlist').innerHTML = '';
    document.getElementById('pf_achievements').innerHTML = '';
    document.getElementById('pf_quicklinks').innerHTML = '';
    document.getElementById('pf_edit_link').href = '';
  },
  fillModal: function () {
    document.getElementById('pf_banner').style.backgroundImage = `url(${this.data.banner})`;
    document.getElementById('pf_avatar').style.backgroundImage = `url(${this.data.avatar})`;
    document.getElementById('pf_info').innerHTML = this.data.info;
    document.getElementById('pf_charlist').innerHTML = this.data.charlist;
    document.getElementById('pf_charlist')?.classList.toggle('empty', !Boolean(this.data.charlist));
    document.getElementById('pf_achievements').innerHTML = this.data.achievements;
    document.getElementById('pf_quicklinks').innerHTML = this.getQuickLinks();
    document.getElementById('pf_edit_link').href = (UserID === this.userId) ? this.data.link : '';
    $('#pf_quicklinks a').tooltipsy({ offset: [0, -1] });
  },
  getQuickLinks: function () {
    const html = this.data.quicklinks.map(link => {
      return `<a href="${link.href || '#'}" title="${link.title || 'Ссылка'}" target="_blank"><img src="${link.img || 'https://forumstatic.ru/files/001b/5c/7f/61674.png'}"/></a>`
    })
    return html.join('') || '';
  },
  toggleModal: async function (userId, postId) {
    if (!userId) {
      this.postId = null;
      this.modal.classList.toggle('hidden', true);
      this.clearModal();
      return;
    }
    this.userId = Number(userId);
    this.postId = postId;
    this.setLoading(true);
    if (postId) {
      const achievements = document.querySelector(`#p${postId} .mini_awards`);
      this.data.achievements = achievements?.innerHTML || '';
      const avatar = document.querySelector(`#p${postId} .pa-avatar`);
      this.data.avatar = avatar?.querySelector('img')?.src || '';
      this.data.banner = this.initData.banner;
      this.data.info = '';
      this.data.charlist = '';
    }
    await this.fetchForum();
    await this.fetchPost(userId);
    this.fillModal();
    this.setLoading(false);
    this.modal.classList.toggle('hidden', false);
  },
  setLoading: function (loading) {
    const profile = document.querySelector(`#p${this.postId} .post-author`);
    profile.classList.toggle('loadProfile', loading);
  },
  fetchForum: async function(skip) {
    if (this.topics.length) return;
    const data = await fetch(`/api.php?method=topic.get&forum_id=${this.config.forum}&limit=100&fields=init_post,last_user_id&skip=${skip}`);
    const { response } = await data.json();
    this.topics.push(...response);
    if (response.length === 100) {
      await this.fetchForum(skip + 100);
    }
  },
  parseLinks: function (ul) {
    const el = document.createElement('div');
    el.innerHTML = ul;
    const list = el.querySelectorAll('li');
    const links = [...list].map(li => {
      const link = li.querySelector('a');
      return {
        img: li.querySelector('img')?.src || '',
        title: link?.innerText || '',
        href: link?.href || '',
      }
    });
    return links;
  },
  fetchPost: async function(userId) {
    const topic = this.topics.find(topic => topic.last_user_id === userId);
    if (!topic) return;

    const data = await fetch(`/api.php?method=post.get&post_id=${topic.init_id}&fields=message,avatar`);
    const { response: [ post ] } = await data.json();
    const temp = document.createElement('div');
    temp.innerHTML = post.message;
    const personalFile = temp.querySelector('.personalFile');
    if (!personalFile) return;

    const banner = personalFile.querySelector('.banner');
    this.data.banner = banner?.querySelector('img')?.src || this.initData.banner;

    const avatar = personalFile.querySelector('.avatar');
    this.data.avatar = avatar?.querySelector('img')?.src || post.avatar || this.initData.avatar;

    const info = personalFile.querySelector('.info');
    this.data.info = info?.innerHTML || '';

    const charlist = personalFile.querySelector('.charlist');
    this.data.charlist = charlist?.innerHTML || '';

    const quicklinks = personalFile.querySelector('.quicklinks');
    this.data.quicklinks = this.parseLinks(quicklinks?.innerHTML || '');

    this.data.link = `/viewtopic.php?pid=${topic.init_id}#p${topic.init_id}`;
  }
}
