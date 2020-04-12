/**
 * Боковое выдвигающееся меню для мобильной вер
 */

var mobileMenu = {
    open: false,
    touchStartX: 0,

    init: function() {

        this.init = this.init.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        
        this.appendMenu();
        
    },

    appendMenu: function() {
        $('body').append('<div id="mobileMenuWrapper" class="mobile-menu"><div id="mobileMenuTrigger" class="mobile-menu-trigger"></div><div id="mobileMenu" class="mobile-menu-container"></div></div>')
        $('#pun-navlinks').clone().appendTo('#mobileMenu');
        $('#pun-ulinks').clone().appendTo('#mobileMenu');

        this.bindListeners();
    },

    bindListeners: function() {
        $('#mobileMenuTrigger').on('click', this.toggleMenu);
        document.addEventListener('touchstart', this.touchStart);
        document.addEventListener('touchmove', this.touchMove);
        document.addEventListener('touchend', this.touchEnd);
    },

    toggleMenu: function() {
        if (this.open) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    touchStart: function(event) {
        this.touchStartX = event.changedTouches[0].pageX;
    },

    touchMove: function(event) {
        var gap = this.open ? event.changedTouches[0].pageX - this.touchStartX : this.touchStartX - event.changedTouches[0].pageX;

        if (gap > 80) {
            this.toggleMenu();
        }
    },

    touchEnd: function(event) {
        this.touchStartX = 0;
    },

    openMenu: function() {
        this.open = true;
        $('#mobileMenuWrapper').addClass('active');
    },

    closeMenu: function() {
        this.open = false;
        $('#mobileMenuWrapper').removeClass('active');
    }

};


$(document).ready(function() {
    mobileMenu.init();
});