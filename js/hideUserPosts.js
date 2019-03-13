$(document).ready(function () {
    if (location.pathname === '/profile.php' && location.search.includes('section=display')) {
        hideUserPostsInput();
    }

    var blockedUsers = JSON.parse(localStorage.getItem('hvHideUserIDs'));

    $('.post').each(function() {
        var profileLink = $(this).find('.pl-email a[href*="profile.php"]').attr('href');

        if (!profileLink) {
            return;
        }

        var userId = profileLink.split('=')[1];
        if (blockedUsers.indexOf(userId) + 1) {
            $(this).addClass('user-hidden');
            $(this).on('click', function() { $(this).toggleClass('user-hidden'); });
        };
    });

    function hideUserPostsInput() {
        $($('#profile6').children('fieldset')[0]).before('<fieldset><legend><span>Скрыть посты юзеров</span></legend><div class="fs-box inline"><p class="inputfield"><label for="hideUserPosts">Юзеры</label><br><span class="input"><input type="text" id="hideUserPosts"><button id="saveHideUserPosts">Сохранить</button></span></p><p class="infofield">Ввести ID юзеров через запятую</p><p id="hideUsersIDsList" class="infofield"></p></div></fieldset>');

        renderBlockedUsers();

        $('#saveHideUserPosts').on('click', function (e) {
            e.preventDefault();
            var values = $('#hideUserPosts').val().split(',').map(function (item) { return item.trim(); }).filter(onlyUnique);

            localStorage.setItem('hvHideUserIDs', JSON.stringify(values));
            renderBlockedUsers();
        });
    }

    function onlyUnique(value, index, self) {
        return value && self.indexOf(value) === index;
    }

    function renderBlockedUsers() {
        var values = JSON.parse(localStorage.getItem('hvHideUserIDs'));
        $('#hideUserPosts').val(values.join(','));
        if (values && values.length > 0) {
            $('#hideUsersIDsList').text('Скрываются посты юзеров с id: ' + values.join(', '));
        } else {
            $('#hideUsersIDsList').text('');
        }
    }
});