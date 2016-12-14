jQuery(function($) {

    var $nav = $('#topNav');
    var $win = $(window);
    //var winH = $win.height();   // Get the window height.
    var winH = 0;
    $win.on("scroll", function () {
        if ($(this).scrollTop() > winH ) {
            $nav.addClass("stuckMenu");
            $('.stuckMenu').css("position","fixed");
            $('#aboutme').addClass("active");
        } else {
            $('.stuckMenu').css("position","relative");
            $nav.removeClass("stuckMenu");
        }
    }).on("resize", function(){ // If the user resizes the window
       0// winH = $(this).height(); // you'll need the new height value
        winH = 0
    });

    $(document).ready(function () {
        //$(document).on("scroll", onScroll);

        //smoothscroll
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");

            $('a').each(function () {
                $(this).removeClass('active');
            });
            $(this).addClass('active');

            var target = this.hash,
                menu = target;
            $target = $(target);
            //$('html, body').stop().animate({
            //    'scrollTop': $target.offset().top + 2
            //}, 500, 'swing', function () {
            //    window.location.hash = target;
               // $(document).on("scroll", onScroll);
            //});
        });
    });

    /*function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('#topNav a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('#topNav ul li a').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    }*/
});