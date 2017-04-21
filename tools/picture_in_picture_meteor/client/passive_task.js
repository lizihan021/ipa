/**
 * Created by aksha on 4/18/2017.
 */

$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();
    var clicktime = 0;
    var start = new Date().getTime();
    var totalTime = 0;
    var toBigtime;
    $("#info").hide(500);

    var events = [];

    $("#video_button").click(function () {
        if (clicktime % 2 == 0) {
            $("#passive").animate({
                left: "0%",
                width: "100%",
                height: "75%"
            }, 500, function () {
                $("#ytplayer").animate({
                    height: "80%"
                }, 300);
                $("#to_input").slideDown(200);
            });

            $("#info").show(500);
            $("#video_button").detach().appendTo("#button_holder");
            $("#video_button").html('Minimize Video');
            toBigtime = new Date().getTime();
        }
        else {

            $("#info").hide(500);
            $("#video_button").detach().appendTo("#passive");
            $("#video_button").html('Expand Video');

            $("#to_input").slideUp(200);
            $("#ytplayer").animate({
                height: "50%"
            }, 300, function () {
                $("#passive").animate({
                    left: "75%",
                    height: "25%",
                    width: "20%"
                }, 500);

            });

            var tmp = new Date().getTime();
            totalTime += tmp - toBigtime;
            $("#showText2").html("<p>Time on video: " + Math.ceil(totalTime / 1000) + " s</p>");
        }
        clicktime++;
    });

    $("#event_button").click(function () {
        var end = new Date().getTime();


        events.push(Math.ceil((end - start) / 1000));
    });

    $("#people_update").click(function () {
        //var localTime = new Date();
        var end = new Date().getTime();

//                $("#timestamp").append("<p>> People: " + $("select[name=selector]").val() + " at "
//                    + Math.ceil((end - start) / 1000) + " s</p>");
        //$("#showText").html("<p>Time since page loaded: " + Math.ceil((end - start) / 1000) + " s</p>");
    });
})