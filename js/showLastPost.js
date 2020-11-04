function hvShowLastPost(topicId, divId) {
    var block = $('#' + divId);
    block.html('<span class="newsLoader"></span>');
    $.get('/api.php?method=post.get&topic_id=' + topicId + '&sort_dir=desc&limit=1&fields=message', function (data) {
        var news = data.response[0].message;
        block.html(news);
    }).fail(function () {
        block.html('<span class="newsError"></span>');
    });
}