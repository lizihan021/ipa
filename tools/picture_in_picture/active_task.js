/**
 * Created by aksha on 4/18/2017.
 */

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import { ImageTags } from '/lib/db';




$(document).ready(function (event) {

    $('#tag_submit').submit( function {
        event.preventDefault();
        console.log('submitted');
        ImageTags.insert({
            tag1: tag1,
            tag2: tag2,
            tag3: tag3
        });
    });

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




