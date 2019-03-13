/**
 * Табы смайлов
 *
 * status: NEED REFACTOR
 */

var smiles = {
    stickersEvilBastards: {
        name: 'Злишечко',
        pack: [
            'http://forumfiles.ru/files/0018/22/0a/40200.png',
            'http://forumfiles.ru/files/0018/22/0a/22172.png',
            'http://forumfiles.ru/files/0018/22/0a/23474.png',
            'http://forumfiles.ru/files/0018/22/0a/99354.png',
            'http://forumfiles.ru/files/0018/22/0a/88745.png',
            'http://forumfiles.ru/files/0018/22/0a/85303.png',
            'http://forumfiles.ru/files/0018/22/0a/28181.png',
            'http://sg.uploads.ru/9dPNn.png',
            'http://forumfiles.ru/files/0018/22/0a/35616.png',
            'http://forumfiles.ru/files/0018/22/0a/73167.png',
            'http://forumfiles.ru/files/0018/22/0a/16440.png',
            'http://forumfiles.ru/files/0018/22/0a/38123.png',
            'http://forumfiles.ru/files/0018/22/0a/50069.png',
            'http://forumfiles.ru/files/0018/22/0a/97808.png',
            'http://forumfiles.ru/files/0018/22/0a/41851.png',
            'http://forumfiles.ru/files/0018/22/0a/43980.png',
            'http://forumfiles.ru/files/0018/22/0a/64344.png',
            'http://forumfiles.ru/files/0018/22/0a/65111.png',
            'http://s3.uploads.ru/6LKJd.png',
            'http://s8.uploads.ru/5R3lE.png',
            'http://sd.uploads.ru/jLtQV.png',
            'http://s6.uploads.ru/wmGuo.png',
            'http://s5.uploads.ru/ykN6F.png',
            'http://sd.uploads.ru/cxknB.png',
            'http://sg.uploads.ru/aK30w.png',
            'http://s4.uploads.ru/2gybf.png',
            'https://i.imgur.com/v9kgMYK.png',
            'http://forumfiles.ru/files/0018/22/0a/24294.png',
            'http://s0.uploads.ru/Z2jhM.png',
            'http://s6.uploads.ru/ra5Ov.png',
            'http://s0.uploads.ru/OTF9L.png',
            'http://s7.uploads.ru/gHeW0.png',
            'http://s9.uploads.ru/HRBld.png',
            'http://se.uploads.ru/rO2As.png',
            'http://s8.uploads.ru/BSHyp.png',
            'https://i.imgur.com/WnnuRYo.png',
            'https://i.imgur.com/ApD8ZT7.png',
            'http://s3.uploads.ru/fpMZY.png',
            'http://sd.uploads.ru/if7au.png',
            'https://i.imgur.com/eiDF2Vo.png',
            'http://s7.uploads.ru/L9g8y.png',
            'http://s5.uploads.ru/Pq4Bz.png',
            'http://s1.uploads.ru/bsyV1.png',
            'http://sa.uploads.ru/nch3W.png',
        ]
    },
    plagueDoctor: {
        name: 'Чумной Доктор',
        pack: [
            'http://i.imgur.com/IRD55AP.png',
            'http://i.imgur.com/NRM2MCY.png',
            'http://i.imgur.com/EfK7g53.png',
            'http://i.imgur.com/XtUnjtc.png',
            'http://i.imgur.com/C6JdQlt.png',
            'http://i.imgur.com/FOwkqMM.png',
            'http://i.imgur.com/g4VLKeJ.png',
            'http://i.imgur.com/PBnXr2H.png',
            'http://i.imgur.com/YCkvWdR.png',
            'http://i.imgur.com/8uLdywi.png',
            'http://i.imgur.com/m32sd4S.png',
            'http://i.imgur.com/I6mCWg6.png',
            'http://i.imgur.com/zs0tLgG.png',
            'http://i.imgur.com/rfeJKoy.png',
            'http://i.imgur.com/YeY1dbg.png',
            'http://i.imgur.com/e2dytpD.png',
            'http://i.imgur.com/U3yTHC0.png',
            'http://i.imgur.com/ARK9QuR.png',
            'http://i.imgur.com/dBS8n8u.png',
            'http://i.imgur.com/hhXxorZ.png',
            'http://i.imgur.com/UuQUQ32.png',
            'http://i.imgur.com/mzLkKx1.png',
            'http://i.imgur.com/GkXjMc8.png',
            'https://i.imgur.com/99pQBpm.png',
            'https://i.imgur.com/5Lr6FZd.png',
            'https://i.imgur.com/LfEsqQ7.png',
            'https://i.imgur.com/ALmcEZv.png',
            'https://i.imgur.com/Vxj87ED.png',
            'https://i.imgur.com/BD10l7h.png',
            'https://i.imgur.com/4iozhDR.png',
        ]
    },
    remains: {
        name: 'Прочее',
        pack: [
            'https://i.imgur.com/VpESxOz.png',
            'https://i.imgur.com/JOAM6zc.png',
            'https://i.imgur.com/aGZnLj2.png',
            'https://i.imgur.com/Np8eXzw.png',
            'http://s7.uploads.ru/Kmz3U.png',
            'http://s8.uploads.ru/t/uodsA.png',
            'http://s1.uploads.ru/XKdq6.png',
            'http://sh.uploads.ru/DFwIN.png',
            'http://s7.uploads.ru/F0b35.png',
            'https://i.imgur.com/V1Z7O0w.png',
        ]
    }
};

var smilesArea = $('#smilies-area'),
    smilesBlock = $('#smilies-block');

var tabList = `<li data-smiles="custom">Стандартные</li>`;
for (var i in smiles) {
    tabList += `<li data-smiles="${i}">${smiles[i].name}</li>`;
}

smilesArea.prepend(function () {
    return $(`<ul class="smiles-tab-list">${tabList}</ul>`).click(openTab);
});
smilesArea.append('<div id="smilies-additional-block"></div>');
var addBlock = $('#smilies-additional-block');

function openTab(event) {
    event.stopPropagation();
    var target = $(event.target).attr('data-smiles');
    if (target === 'custom') {
        smilesBlock.show();
        addBlock.empty().hide();
    } else {
        smilesBlock.hide();
        addBlock.html(function () {
            return smiles[target].pack.reduce(function (result, item) {
                return result + `<img src="${item}" onclick="smile('[img]${item}[/img]')">`
            }, '');
        }).show();
    }
}
