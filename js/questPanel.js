/**
 * Панель с актуальной очередью постов
 *
 * status: IN PROGRESS
 */

"use strict";

function initQuestPanel() {
	$('body').append('<div id="quest_panel" class="hv-questpanel"><div class="hv-questpanel__trigger"></div><div class="hv-questpanel__list"></div></div>');
	$.ajax({
		url: 'http://f.etrin.ru/frpgAPI.php',
		data: {
			method: 'getQueue',
			bid: BoardID
		},
		success: function (json) {
			console.log(json);
		},
		error: function (error) {
			if (error.status === 0 && GroupID === 1) {
				$.jGrowl('Кажется, это не ваш скрипт)');
			};
		}
	})
}