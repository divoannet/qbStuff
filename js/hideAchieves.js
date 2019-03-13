/**
 * Добавляет выбранному полю обёртку и триггер для скрытия/раскрытия, например
 *
 * status: DONE
 */

(function hideAchieves(params) {
    
    $(params.field).each(function(key, field) {
        $(field).wrap('<div class="achieves"></div>');
        
        var trigger = $('<div class="trigger" style="width:10px;height:10px;background:#f00;"></div>');
        $(field).before(trigger);
        
        trigger.on('click', function(event) {
            var wrapper = $(event.target).closest('.achieves');
            wrapper.toggleClass('active');
        });
    });

})({
    field: '.pa-fld4'
});