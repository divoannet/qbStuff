/**
 * Скрипт примерочной для личного звания
 * автор: Человек-Шаман
 * version: 1.0.1
 *
 * Инструкция:
 * 1. В первое сообщение нужной темы в нужном месте добавить код [block=fittingRoom][/block]
 * 2. В скрипте ниже в переменной topicId указать номер темы
 * 3. В переменной fields указать поля для примерочной в формате: { title: 'Название поля', className: 'класс поля в профиле', template: 'шаблон' }
 * 4. В переменной order указать порядок полей в профиле, до нужного
 * 5. Можно вызывать скрипт в нескольких темах, каждый со своими настройками
 */

function hvFittingRoom ({
  topicId,
  fields = [],
  order = [],
}) {
  if (!topicId || location.pathname !== '/viewtopic.php') return;

  const locationTopicId = location.search.match(/id=(\d+)/)[1];
  if (topicId !== +locationTopicId) return;
  
  const topicpost = document.querySelector('.topicpost');
  if (!topicpost) return;

  const postContent = topicpost.querySelector('.post-content');
  const postProfile = topicpost.querySelector('.post-author ul');

  const wrapper = postContent.querySelector('.fittingRoom');

  if (!wrapper) {
    if (GroupID === 1) {
      $.jGrowl('Необходимо вставить код [block=fittingRoom][/block] в первый пост темы и убедиться, что он не в блоках html или media.');
    }
    return;
  }

  const renderField = ({ title, className, template }) => {
    return `
      <div class="hvFittingRoom-field hvFittingRoom-field_${className}" data-field="${className}">
        <div class="hvFittingRoom-field-input">
          <textarea id="hvFr-${className}"} name="fitting-room-${className}" placeholder="${title}" rows="2"></textarea>
          <span class="hvFittingRoom-field-caption error"></span>
        </div>
        <div class="hvFittingRoom-field-actions ${template ? '' : 'hidden'}">
          <input type="button" class="hvFittingRoom-field-action hvFittingRoom-field-action_add-temp button" title="Вставить шаблон" value="«"/>
        </div>
      </div>
    `;
  };

  const fillExample = (values = {}) => {
    const avatar = postProfile.querySelector('.pa-avatar img');
    if (avatar) {
      avatar.src = UserAvatar;
    }
    Object.entries(values).forEach(([key, value]) => {
      let field = postProfile.querySelector(`.${key}`);
      if (!field) {
        const fieldIndex = order.indexOf(key);
        field = document.createElement('li');
        field.classList.add(key);
        let prevChild;
        for (let i = fieldIndex - 1; i >= 0; i--) {
          prevChild = postProfile.querySelector(`.${order[i]}`);
          if (prevChild) break;
        }
        if (prevChild) {
          prevChild.after(field);
        } else {
          postProfile.append(field);
        }
      };
      field.innerHTML = value;
    });
  }

  function validateHTML(htmlString) {
    const doc = document.createElement('div');
    doc.innerHTML = htmlString;
    return doc.innerHTML === htmlString;
  }

  const roomBox = document.createElement('div');
  roomBox.classList.add('fittingroom');
  roomBox.innerHTML = `<div class="hvFittingRoom-Wrapper">
  <div class="hvFittingRoom-fields">${fields.map(renderField).join('')}</div>
  <div class="hvFittingRoom-actions">
    <input type="button" class="hvFittingRoom-action hvFittingRoom-action_fit button" value="Примерить" />
    <input type="button" class="hvFittingRoom-action hvFittingRoom-action_submit button" value="Вставить в пост" />
  </div>
  </div>`;

  const style = document.createElement('style');
  style.innerHTML = `.hvFittingRoom-field {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      gap: 1em;
      box-sizing: border-box;
      padding: 8px;
  }
  .hvFittingRoom-field-input { flex: 1 1 auto; }
  .hvFittingRoom-field-input textarea { width: 100%; box-sizing: border-box; }
  .hvFittingRoom-field-actions { flex: 0 0 24px; }
  .hvFittingRoom-field-actions.hidden { display: none; }
  .hvFittingRoom-actions { text-align: center; padding: 8px;}
  .hvFittingRoom-field-caption.error {font-size: 0.7em;line-height: 0.7em;color: #ac0000;}`;

  wrapper.appendChild(roomBox);
  document.head.appendChild(style);

  wrapper.addEventListener('click', event => {
    if (event.target.classList.contains('hvFittingRoom-field-action_add-temp')) {
      const field = event.target.closest('.hvFittingRoom-field');
      const className = field.dataset.field;
      const textarea = field.querySelector('textarea');
      const template = fields.find(f => f.className === className).template;
      textarea.value = template;
    }

    if (event.target.classList.contains('hvFittingRoom-action_fit')) {
      const fields = wrapper.querySelectorAll('.hvFittingRoom-field');
      const values = Array.from(fields).reduce((acc, field) => {
        const textarea = field.querySelector('textarea');
        const isValid = validateHTML(textarea.value);
        if (!isValid) {
          field.querySelector('.hvFittingRoom-field-caption').innerHTML = 'Неверный HTML';
          return acc;
        }
        field.querySelector('.hvFittingRoom-field-caption').innerHTML = '';
        acc[field.dataset.field] = textarea.value;
        return acc;
      }, {});

      fillExample(values);
    }

    if (event.target.classList.contains('hvFittingRoom-action_submit')) {
      const fields = wrapper.querySelectorAll('.hvFittingRoom-field');
      const values = Array.from(fields).map(field => `[code]${field.querySelector('textarea').value}[/code]`);
      window.insert(values.join('\n'));
    }
  });
}
