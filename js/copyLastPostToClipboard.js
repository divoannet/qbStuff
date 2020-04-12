/**
 * Возможность скопировать последний пост при переполнении темы
 *
 * status: DONE
 */

$('#pun-viewtopic #pun-main > h2').append('<div style="opacity: 0;position: absolute;bottom: 210px;right: 60px;width: 10px;height: 10px;"><textarea id="reserved_post">' + localStorage.ReservePost + '</textarea></div>');
$('#pun-viewtopic #pun-main > h2').append('<div id="reserve_post">Если вы потеряли свой пост из-за этого, нажмите на этот текст — отправленный пост будет скопирован в буфер обмена.</div>');
$('#reserve_post').on('click', function() { var post = document.getElementById('reserved_post'); post.select(); document.execCommand('copy'); })