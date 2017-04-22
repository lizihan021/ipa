/**
 * Created by aksha on 4/18/2017.
 */
$(document).ready(function () {
    // Instructions expand/collapse
    var content = $('#instructionBody');
    var trigger = $('#collapseTrigger');
    content.hide();
    $('.collapse-text').text('(Click to expand)');
    trigger.click(function () {
        content.toggle();
        var isVisible = content.is(':visible');
        if (isVisible) {
            $('.collapse-text').text('(Click to collapse)');
        } else {
            $('.collapse-text').text('(Click to expand)');
        }
    });
})
