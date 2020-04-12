var monthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var chronoPrompter = {
    dates: [],
    data: [],
    init: function() {
        var date = this.getEpisodeDate();
        if (!date) return;

        this.calculateDates(date);
        this.filterChrono();
        if (this.data.length > 0) {
            this.renderWidget();
            this.renderTrigger();
        }
    },
    getEpisodeDate: function() {
        if (!FORUM || !FORUM.topic) return null;
        var dateMatch = FORUM.topic.subject.match(/\d{1,2}\.\d{1,2}\.\d{1,4}/);
        return dateMatch ? dateMatch[0] : null;
    },
    calculateDates(startDate) {
        var startArr = startDate.split('.');
        var n = startArr.length - 1;
        var sYear = startArr[n--];
            sYear = sYear.length === 2 ? +("20" + sYear) : +sYear;
        var sMonth = +startArr[n--];
        var sDay = +startArr[n];

        for (var i = 0; i < 3; i++) {
            if (sDay - i > 0) {
                this.addDate(sDay - i, sMonth, sYear);
                continue;
            }
            var month = sMonth - 1;
            if (month > 0) {
                var day = monthMap[month - 1] - i + sDay;
                this.addDate(day, month, sYear);
                continue;
            }
            var year = sYear - 1;
            month = 12;
            day = 32 - i;
            this.addDate(day, month, year);
        }
    },
    filterChrono() {
        var globalData = chronologyData || [];
        var dates = this.dates;
        this.data = globalData.filter(function(topic) {
            var selfPath = location.origin + location.pathname + location.search;
            return topic.url !== selfPath && dates.includes(topic.date) && topic.categories.includes('public');
        });
    },
    addDate: function(day, month, year) {
        var date = this.formatDatePart(day)
            + "."
            + this.formatDatePart(month)
            + "."
            + year;
        this.dates.push(date);
    },
    formatDatePart(d) {
        var str = "00" + d;
        return str.slice(-2);
    },
    renderWidget() {
        var modalWindow = document.body.insertAdjacentHTML('beforeEnd', "<div class=\"hvmodal\" data-modal-name=\"chronoPrompt\" data-modal-dismiss=\"\">\n    <div class=\"hvmodal__dialog\">\n        <header class=\"hvmodal__header\">\n            <h1 class=\"hvmodal__title\">\u0421\u043E\u0431\u044B\u0442\u0438\u044F \u0432 \u044D\u0442\u0438 \u0434\u043D\u0438</h1>\n        </header>\n        <div class=\"hvmodal__content\">\n            <ul class=\"chrono-events\">\n"
            + this.getEpisodesElements()
            + "\n            </ul>              \n        </div>\n    </div>\n</div>");
        
    },
    getEpisodesElements() {
        return this.data.map(function(topic) {
            return "<li>" + topic.date + " " + (topic.url ? "<a href=\"" + topic.url + "\">" + topic.title + "</a>" : "<span>" + (topic.title ? topic.title : '') + "</span>") + "<br>" + topic.text + "</li>";
        }).join('\n');
    },
    renderTrigger() {
        document.body.insertAdjacentHTML('beforeend', '<div class="chronoTrigger" data-modal-trigger="chronoPrompt"></div>');
        customModal.init();
    }
};

var customModal = {
    _targettedModal: null,
    _triggers: null,
    _dismiss: null,
    modalActiveClass: "is-modal-active",
    showModal: function (el) {
        this._targettedModal = document.querySelector('[data-modal-name="' + el + '"]');
        this._targettedModal.classList.add(this.modalActiveClass);
    },
    hideModal: function (event) {
        if (event === undefined || event.target.hasAttribute('data-modal-dismiss')) {
            this._targettedModal.classList.remove(this.modalActiveClass);
        }
    },
    bindEvents: function (el, callback) {
        for (var i = 0; i < el.length; i++) {
            (function (i) {
                el[i].addEventListener('click', function (event) {
                    console.log('111');
                    callback(this, event);
                });
            })(i);
        }
    },
    triggerModal: function () {
        var self = this;
        console.log(this._triggers);
        this.bindEvents(this._triggers, function (trigger) {
            self.showModal(trigger.dataset.modalTrigger);
        });
    },
    dismissModal: function () {
        var self = this;
        this.bindEvents(this._dismiss, function (ds, event) {
            self.hideModal(event);
        });
    },
    init: function() {
        this._triggers = document.querySelectorAll('[data-modal-trigger]');
        this._dismiss = document.querySelectorAll('[data-modal-dismiss]');
        this.triggerModal();
        this.dismissModal();
    }
};

$(document).ready(function() {
    chronoPrompter.init();
});
