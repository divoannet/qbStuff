﻿/**
 * Добавляет в тему поиска персонажей список, сгруппированный по фандому.
 * Список даёт возможность фильтровать тему по фендому или по персонажу.
 *
 * author: Человек-Шаман
 * version: 1.1
 * status: DONE
 * 
 * instruction:
 * 1. Добавить в html-низ, заменить 999 на номер темы поиска
 *    <script>
 *      hvWantedFilters.init(999);
 *    </script>
 * 2. Добавить в первое сообщение темы поиска
 *    [block=charlist][/block]
 *    там, где нужно отрисовать список ролей
 * 3. Убедитесь, что [block=charlist][/block] не поставлен в спойлере
 *    для медиа или html-блоке, так он не будет работать
 * 4. Для стилизации используйте стили
 *    .post .charlist { стили блока списка ролей }
 *    .post .charlist .charlist_fd { стили блока фандома }
 *    .post .charlist .charlist_item { стили элемента списка фандома }
 *    .post .charlist .charlist_title { стили заголовка фандома }
  */

const hvWantedFilters = {
  topicId: 0,
  topicData: {
    postCount: 0,
    posts: [],
  },
  filteredPosts: [],
  fandoms: {},
  filterList: null,
  filters: {
    fandom: null,
    post: null,
  },
  init: function (topicId) {
    $(document).on('pun_main_ready', () => this.run(topicId));
  },
  run: async function(topicId) {
    const $topic = $("#pun-viewtopic");
    const currentTopicId = $topic.length
      ? Number($("#pun-viewtopic").attr("data-topic-id"))
      : 0;
  
    if (topicId !== currentTopicId) return;
    this.bindHandlers();
    this.setNeddfulElements();
    
    this.topicId = topicId;
    await this.getTopicData(topicId);
    await this.getPosts(topicId);
    this.renderSummary();

    this.initList();
  },
  bindHandlers: function() {
    this.handleListClick = this.handleListClick.bind(this);
  },
  setNeddfulElements: function () {
    $('head').append('<link rel="stylesheet" href="https://forumstatic.ru/files/0017/95/29/69365.css" />');
    this.filterList = $('<div class="hvFilteredList"></div>');
    $('.topicpost').after(this.filterList);
  },
  getTopicData: async function(topicId) {
    const topicData = await $.get(
      `/api.php?method=topic.get&topic_id=${topicId}`
    );
    const postCount = Number(topicData.response[0]?.num_replies);
    this.topicData.postCount = isNaN(postCount) ? this.topicData.postCount : postCount;
  },
  getPosts: async function(topicId) {
    const reqestCount = Math.ceil(this.topicData.postCount / 100);
    for (let i = 0; i < reqestCount; i++) {
      const { response } = await $.get(
        `/api.php?method=post.get&topic_id=${topicId}&skip=${i * 100}&limit=100`
      );
      this.topicData.posts = this.topicData.posts.concat(response);
    }
    this.getFandoms();
  },
  getFandoms: function() {
    this.topicData.posts.forEach((post) => {
      if (index === 0) return;
      const message = $(`<div>${post.message}</div>`);
      const $fandomName = message.find(".fd")[0];
      const $charNames = message.find(".nm");
  
      const fandomName = $fandomName ? $($fandomName).text() : 'Other';
      const charNames = [];
      $charNames.each((index, item) => charNames.push($(item).text()));

      if (!this.fandoms[fandomName.toLowerCase()]) {
        this.fandoms[fandomName.toLowerCase()] = {
          name: fandomName,
          items: [],
        };
      }

      charNames.forEach(name => {
        this.fandoms[fandomName.toLowerCase()].items.push({
          name,
          postId: post.id,
          author: post.username,
          rating: post.rating,
        });
      })
      if (charNames.length === 0) {
        this.fandoms[fandomName.toLowerCase()].items.push({
          name: null,
          postId: post.id,
          author: post.username,
          rating: post.rating,
        });
      }
    });
  },
  renderSummary: function() {
    const $charlist = $(".topicpost").find(".charlist");
    const filteredFandomNames = Object.keys(this.fandoms).sort();

    
    $charlist.append('<span class="hvClearFilters">x Сбросить фильтр</span>');

    filteredFandomNames.forEach((fandom, index) => {
      if (fandom === 'other' && this.fandoms[fandom].items.length === 0) {
        return;
      }
      const ul = $(`<ul class="charlist_fd fd${index}"></ul>`);
      ul.append(`<li class="charlist_item charlist_title" data-fandom="${fandom}">${this.fandoms[fandom].name}</li>`);
      const sortedNames = this.fandoms[fandom].items.sort((a, b) => a.name > b.name ? 1 : -1);
      sortedNames.forEach((char) => {
        if (!char.name) return;
        ul.append(
          `<li class="charlist_item" data-character="${char.postId}"><a href="viewtopic.php?pid=${char.postId}#p${char.postId}" data-post-id="${char.postId}" title="by ${char.author}">${char.name}</a></li>`
        );
      });
      $charlist.append(ul);
    });

    $charlist.on('click', this.handleListClick);
  },
  handleListClick: function(event) {
    const $target = $(event.target);
    if ($target.closest('a').length) {
      event.preventDefault();
    } 
    if ($target.closest('li').length) {
      const fandom = $target.closest('li').attr('data-fandom');
      const post = $target.closest('li').attr('data-character');
      this.setFilters(fandom, post);
    } else if ($target.closest('.hvClearFilters')) {
      this.setFilters(null, null);
    }
  },

  initList: function() {
    this.getFilters();
    this.filterPosts();
    this.renderFilteredList();
  },
  getFilters: function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.filters.fandom = urlParams.get('fandom');
    this.filters.post = urlParams.get('post');

    $(`.charlist li`).removeClass('active');
    $(`.charlist li[data-fandom="${this.filters.fandom}"]`).addClass('active');
    $(`.charlist li[data-character="${this.filters.post}"]`).addClass('active');
    $('.topic').toggleClass('filtered', Boolean(this.filters.fandom || this.filters.post));
  },
  setFilters: function(fandom, post) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (fandom) {
      urlParams.delete('post');
      urlParams.set('fandom', fandom);
    } else if (post) {
      urlParams.delete('fandom');
      urlParams.set('post', post);
    } else {
      urlParams.delete('fandom');
      urlParams.delete('post');
    }

    window.history.replaceState( {} , 'title', window.location.pathname + '?' + urlParams.toLocaleString() );
    this.initList();
  },
  filterPosts: function() {
    if (this.filters.fandom) {
      const fandom = this.fandoms[this.filters.fandom];
      const postIds = fandom ? fandom.items.map(item => item.postId) : [];
      this.filteredPosts = this.topicData.posts.filter(post => postIds.includes(post.id));
    }
    if (this.filters.post) {
      this.filteredPosts = this.topicData.posts.filter(post => this.filters.post === post.id);
    }
    if (!this.filters.fandom && !this.filters.post) {
      this.filteredPosts = [];
    }
  },
  renderFilteredList: function() {
    this.filterList.empty();
    this.filteredPosts.forEach(post => {
      const posted = new Date(+post.posted*1000).toLocaleDateString("ru-RU", {
        hour: "numeric",
        minute: "numeric",
      });
      this.filterList.append(`<div class="post filteredPost">
      <h3><span><strong>+${post.rating}</strong><a class="permalink" rel="nofollow" href="/viewtopic.php?pid=${post.id}#p${post.id}" target="_blank" rel="nofollow">${posted}</a></span></h3>
      <div class="container"><div class="post-author"><ul>
        <li class="pa-author"><span class="acchide">Автор:&nbsp;</span><a href="/profile.php?id=${post.user_id}" target="_blank" rel="nofollow">${post.username}</a></li>
			</ul></div><div class="post-body"><div class="post-box"><div class="post-content">
        ${post.message}
      </div></div></div></div>`);
    })
  },
};
