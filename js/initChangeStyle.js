/**
 * Добавляет поле смены стиля в профиле пользователя
 *
 * status: DONE
 */

'use strict';

// var hvStylesList = [
// 	{ id: 'default', name: 'Меньшее Зло' },
// 	{ id: 'sfw', name: 'Safe for work', path: 'http://forumfiles.ru/files/0018/22/0a/59867.css' }
// ];

function initChangeStyle(hvStylesList) {
    var style = localStorage.getItem('hvStyleId') || 'default';
    if (style !== 'default') changeStyle(style, 1);

    if (location.pathname === '/profile.php' && location.search.includes('section=display')) {
        $(document).ready(function () { initProfileSelect() })
    }
    function changeStyle(styleId, saveFlag) {
        var $style = $($('link[rel="stylesheet"]')[0]);
        if (saveFlag) window.DefaultStyleUrl = $style.attr('href');
        var styleObj = hvStylesList.find(function (item) { return item.id === styleId });
        if (styleObj.path) {
            $style.attr('href', styleObj.path);
        } else {
            $style.attr('href', DefaultStyleUrl);
        }
        style = styleObj.id;
    }
    $('body').addClass('hv-' + style + '-style');

    function initProfileSelect() {
        $($('#profile6').children('fieldset')[0]).before('<fieldset><legend><span>Выбор стиля для этого браузера</span></legend><div class="fs-box inline"><p class="inputfield"><label for="selectTheme">Тема</label><br><span class="input"><select id="selectTheme"></select></span></p><p class="infofield">Тема будет изменена только для этого браузера</p></div></fieldset>');
        $('#selectTheme').html(function () {
            var options = [];
            hvStylesList.forEach(function (item) {
                var selected = item.id === style ? 'selected="selected"' : '';
                options.push('<option value="' + item.id + '" ' + selected + '>' + item.name + '</option>');
            });
            return options.join('');
        });
        $('#selectTheme').val(style);
        $('#selectTheme').on('change', function (event) {
            var value = event.target.value;
            if (value !== style) {
                localStorage.setItem('hvStyleId', value);
                changeStyle(value);
            }
        })
    }
}