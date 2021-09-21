'use strict'

const INITIAL_VALUES = {
  enabled: false,
  maskLimit: 20,
  guestAccess: [],
  forumAccess: {},
  forumAccessExtended: {},
  changeList: {},
  userFields: ['pa-author', 'pa-title', 'pa-avatar', 'pa-fld1','pa-reg','pa-posts','pa-respect', 'pa-positive', 'pa-awards', 'pa-gifts']
}

const CHANGE_INITIAL_VALUE = {
  title: '',
  description: '',
  tag: '',
  class: '',
  type: 'bbcode',
}

const CSS_URL = 'http://localhost:8080/projects/mybbProfileMask/styles.css'
const TEMP_URL = 'http://localhost:8080/projects/mybbProfileMask/template.html'

const GROUP_SETTINGS_TEMPLATE = '<div class="adfs-box" id="sortGroups">'
  +'<div class="sort_groups">'
  +'<div><strong>Нет маски</strong></div>'
  +'<div><strong>Только аватар</strong></div>'
  +'<div><strong>Полная маска</strong></div>'
  +'</div>'
  +'<div class="sort_groups">'
  +'<div id="sortGroupsUnable" data-orig="null">'
  +'</div>'
  +'<div id="sortGroupsPart" data-orig="forumAccess">'
  +'</div>'
  +'<div id="sortGroupsFull" data-orig="forumAccessExtended">'
  +'</div>'
  +'</div>'
  +'</div>'

const profileMaskSettings = {
  values: INITIAL_VALUES,
  form: null,
  formElements: {
    enabled: null,
    maskLimit: null,
    forumsList: null,
  },
  forumList: {},
  profileFields: [],
  init: async function () {
    if (!document.getElementById('pun-admin_scripts')) return
    await this.getStoredSettings()
    this.appendStyles()
    await this.renderForm()
    this.addListeners()
  },
  setFormValues: async function() {
    // enabled
    this.formElements.enabled = document.getElementsByName('profileMask[enabled]')
    for (let i = 0; i < this.formElements.enabled.length; i++) {
      this.formElements.enabled[i].checked = this.values.enabled == this.formElements.enabled[i].value
    }
    // maskLimit
    this.formElements.maskLimit = document.getElementsByName('profileMask[maskLimit]')[0]
    this.formElements.maskLimit.value = this.values.maskLimit
    // access
    this.forumList = await this.getBoards()
    this.formElements.forumsList = document.getElementById('profileMaskForumsSettings')
    Object.values(this.forumList).forEach(section => {
      this.formElements.forumsList.insertAdjacentHTML('beforeend', '<p><span class="adinput">***</span></p>')
      section.forEach(forum => {
        this.formElements.forumsList
          .insertAdjacentHTML(
            'beforeend',
            `<p data-forum-name="${forum.name}"><span class="adlabel">${forum.name}</span><br><span class="adinput"><span class="set-forum-settings">Настроить</a></span></p>`
          )
      })
    })
    // changeList
    this.profileFields = await this.getProfileFields()
    this.formElements.profileFldSelect = document.getElementById('profileFldSelect')
    this.renderProfileFldSelect()
    this.renderProfileFields()
    this.userGroups = await this.getUserGroups()
  },
  getStoredSettings: async function() {
    const { response } = await $.get('/api.php',
      {
        method: 'storage.get',
        key: 'profileMaskSettings',
        app_id: 16777215
      }
    )
    const responseText = response.storage.data.profileMaskSettings
    const settings = JSON.parse(responseText)
    this.values = {
      ...this.values,
      ...this.normalizeSettings(settings)
    }
  },
  appendStyles: function() {
    document.querySelector('head')
      .insertAdjacentHTML('beforeend', `<link rel="stylesheet" type="text/css" href="${CSS_URL}">`)
  },
  renderForm: async function() {
    this.form = document.createElement('div')
    this.form.id = 'profileMaskSettings'
    document.getElementById('pun-admain1').appendChild(this.form)
    await _load('#profileMaskSettings', TEMP_URL)
    await this.setFormValues()
  },
  renderProfileFldSelect() {
    this.formElements.profileFldSelect.innerHTML = ''
    const paFlds = []
    this.profileFields.forEach(field => {
      if (!field.visible) return // поле не настроено
      paFlds.push(field.className) // для сохранения порядка при вставке маски
      if (field.service) return // сервисные не отображаем
      if (Object.keys(this.values.changeList).includes(field.id)) return // что уже настроено
      this.formElements.profileFldSelect.insertAdjacentHTML('beforeend', `<option value="${field.id}">${field.label}</option>`)
    })
    if (JSON.stringify(this.values.userFields) !== JSON.stringify(paFlds)) {
      this.values.userFields = paFlds
    }
  },
  renderProfileFields: function() {
    const block = document.getElementById('profileMaskFieldsList')
    block.innerHTML = ''
    Object.values(this.values.changeList).forEach(field => {
      block.insertAdjacentHTML('beforeend', `<p><span class="adlabel">${field.title}</span><br><span class="adinput"><a href="#" class="set-field-settings">Настроить</a></span></p>`)
    })
  },
  initSortableUserList: function() {
    const access = this.getForumAccess(this.activeForumSettings)
    const userGroupUnable = document.getElementById('sortGroupsUnable')
    userGroupUnable.innerHTML = ''
    const userGroupPart = document.getElementById('sortGroupsPart')
    userGroupPart.innerHTML = ''
    const userGroupFull = document.getElementById('sortGroupsFull')
    userGroupFull.innerHTML = ''
    this.userGroups.forEach(group => {
      const html = `<span data-group-id="${group.groupId}">${group.groupTitle}</span>`
      const element = access.full.includes(group.groupTitle)
        ? userGroupFull
        : access.common.includes(group.groupTitle)
          ? userGroupPart
          : userGroupUnable
      element.insertAdjacentHTML('beforeend', html)
    })
    sortable('#sortGroupsUnable', {
      acceptFrom: '#sortGroupsPart, #sortGroupsFull'
    })[0].addEventListener('sortupdate', this.handleGroupChange)
    sortable('#sortGroupsPart', {
      acceptFrom: '#sortGroupsUnable, #sortGroupsFull'
    })[0].addEventListener('sortupdate', this.handleGroupChange)
    sortable('#sortGroupsFull', {
      acceptFrom: '#sortGroupsUnable, #sortGroupsPart'
    })[0].addEventListener('sortupdate', this.handleGroupChange)
  },
  addProfileField: function() {
    const chosenField = document.getElementById('profileFldSelect').value
    const profileField = this.profileFields.find(({id}) => id === chosenField)
    if (this.values.changeList[chosenField]) return
    this.values.changeList[chosenField] = {
      title: profileField.label,
      description: profileField.description,
      tag: profileField.id,
      class: profileField.className,
      type: 'bbcode',
    }
    this.renderProfileFldSelect()
    this.renderProfileFields()
  },
  addListeners: function() {
    this.handleGroupChange = this.handleGroupChange.bind(this)
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this)
    this.formElements.enabled.forEach(radio => radio.addEventListener('change', this.handleChangeEnabled))
    this.handleChangeMaskLimit = this.handleChangeMaskLimit.bind(this)
    this.formElements.maskLimit.addEventListener('change', this.handleChangeMaskLimit)
    this.addProfileField = this.addProfileField.bind(this)
    document.getElementById('addMaskFieldButton').addEventListener('click', this.addProfileField)
    this.handleForumsBoxClick = this.handleForumsBoxClick.bind(this)
    this.formElements.forumsList.addEventListener('click', this.handleForumsBoxClick)
    this.handleFieldsBoxClick = this.handleFieldsBoxClick.bind(this)
    document.getElementById('profileMaskFieldsList').addEventListener('click', this.handleFieldsBoxClick)
  },
  handleChangeEnabled: function(event) {
    this.values.enabled = event.target.value === '1'
  },
  handleChangeMaskLimit: function(event) {
    this.values.maskLimit = event.target.value
  },
  handleForumsBoxClick: function(event) {
    event.preventDefault()
    if (!event.target.classList.contains('set-forum-settings')) return
    const p = event.target.closest('p')
    if (!p) return
    const forumName = p.dataset.forumName
    if (this.activeForumSettings) {
      const form = document.getElementById('profileMaskGroupsSettings')
      this.formElements.forumsList.removeChild(form)
    }
    if (this.activeForumSettings === forumName) {
      this.activeForumSettings = null
      return
    }
    this.activeForumSettings = forumName
    const settings = document.createElement('div')
    settings.id = 'profileMaskGroupsSettings'
    settings.innerHTML = GROUP_SETTINGS_TEMPLATE
    p.after(settings)
    this.initSortableUserList()
  },
  handleFieldsBoxClick: function(event) {
    event.preventDefault()
    if (!event.target.classList.contains('set-field-settings')) return
    console.log(event.target.closest('p').nextSibling)
  },
  handleGroupChange: function({ detail }) {
    const origin = detail.origin.container.dataset.orig
    const destination = detail.destination.container.dataset.orig

    const groupName = detail.item.innerText

    if (origin !== 'null') {
      this.values[origin][this.activeForumSettings].splice(detail.origin.index, 1)
    }

    if (destination !== 'null') {
      if (!this.values[destination][this.activeForumSettings]) {
        this.values[destination][this.activeForumSettings] = []
      }
      this.values[destination][this.activeForumSettings].splice(detail.destination.index, 0, groupName)
    }
  },
  getBoards: async function() {
    const { response } = await $.ajax({
      url: '/api.php',
      data: {
        method: 'board.getForums',
      }
    })
    const result = {}
    response.forEach(forum => {
      if (!result[forum.cat_id]) {
        result[forum.cat_id] = []
      }
      result[forum.cat_id].push({
        name: forum.name,
        id: forum.id,
      })
    })
    return result
  },
  getProfileFields: async function() {
    // Получаем и парсим все видимые в профиле поля со страницы "Поля профиля"
    const fieldsResult = await $.ajax({
      url: '/admin_fields.php'
    })
    const page = $(fieldsResult)
    const lines = page.find('#edfields p')
    const result = []
    lines.each((index, line) => {
      if (line.className !== '') return
      const select = $(line).find('select')
      const key = $(line).find('input').attr('id')
      const label = $(line).find('.adlabel').text()
      // Исключаем из списка допполей использованные по умолчанию и системные
      const isService = ['ip', 'respect', 'posts', 'author', 'title', 'avatar', 'respect', 'last-visit', 'online'].includes(key)
      result.push({
        id: key,
        className: `pa-${key}`,
        visible: select.val() === '1',
        service: isService,
        label,
      })
    })
    return result
  },
  getUserGroups: async function() {
    const groupsResult = await $.ajax({
      url: '/userlist.php'
    })
    const page = $(groupsResult)
    const groups = []
    page.find('#fld2 option').each((i, option) => {
      if (option.value <= 2) return
      groups.push({
        groupId: option.value,
        groupTitle: option.innerHTML,
      })
    })
    return groups
  },
  getForumAccess: function(forumName) {
    return {
      common: this.values.forumAccess[forumName] || [],
      full: this.values.forumAccessExtended[forumName] || [],
    }
  },
  normalizeSettings: function(settings) {
    const result = {}
    Object.entries(settings).forEach(([key, value]) => {
      if (!Object.keys(INITIAL_VALUES).includes(key)) return
      if (key === 'changeList') {
        result[key] = Object.values(value).reduce((res, item) => {
          const fld = item.class.split('-')[1]
          res[fld] = {...item}
          return res
        }, {})
      } else {
        result[key] = value
      }
    })
    return result
  },
}

profileMaskSettings.init()

/* HELPERS */

function _load(selector, url) {
  return new Promise((resolve, reject) => {
    try {
      $(selector).load(url, () => resolve())
    } catch (e) { reject(e) }
  })
}
