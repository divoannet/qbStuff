/**
 * Разбивает текст в постах на параграфы для введения красной строки, например
 *
 * status: DONE
 * syntax: formatTextParagraphs(Array<number>) <- массив номеров форумов, в которых применяется
 */

"use strict";

function formatTextParagraphs(forumIndexes) {
    if (!(FORUM.topic && forumIndexes.includes(+FORUM.topic.forum_id))) return;
    $(".post-content").each(function(key, item) {
        var paragraphs = $(item).children("p");
        $(paragraphs).each(function(pkey, paragraph) {

            if ($(paragraph).attr('style') || $(paragraph).attr('class')) return;
            var pHtml = $(paragraph).html();
            var tempDiv = document.createElement('div');
            $(tempDiv).html(pHtml);
            var tags = $(tempDiv).children();
            var tagStore = [];
            tags.each(function(key, tag) {
            	if (tag.tagName === 'BR') return;
            	tagStore.push(tag.outerHTML);
            	tag.outerHTML = '|HTML-REPLACER|';
            });
            var newParagraph = $(tempDiv)
                .html()
                .split("<br>");
            var output = "";
            newParagraph.forEach(function(p) {
                p = p.length ? flipString(p.innerText) : "";
            });
            output = newParagraph.join('<br>');
            while (tagStore.length > 0) {
            	var tag = tagStore.shift();
            	output = output.replace('|HTML-REPLACER|', tag);
            };
            $(paragraph).html(output);
        });
    });
}
