/**
 * Created by aksha on 4/18/2017.
 */

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '100%',
        width: '100%',
        videoId: 'YF0vYycXNkU',  // Youtube video ID
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        },
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'disablekb': 1,
            'modestbranding' : 1,
            'rel': 0
        }

    });

}

function onPlayerStateChange() {

}

function onPlayerReady() {
}

/*
 * Start:-  function to create , read and erase Cookie
 */

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

/*
 * End:-  function to create , read and erase Cookie
 */