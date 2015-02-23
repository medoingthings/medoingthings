require(['zeptojs', 'modules/richtext/richtext-vote', 'modules/feature/feature-words', 'modules/feature/feature-query', 'analytics'], function ($) {

    /**
     * Init modules
     */

    $('.richtext__vote__wrapper').richtextVote();
    $('.feature-query__wrapper').featureQuery();
    $('.feature-words__wrapper').featureWords();

    // load twitter button if present
    if ($('.twitter-follow-button').length) {
        require(['twitter-follow']);
    }

    /**
     * Draft for a little parallax scrolling
     */

    if (!Modernizr.touchevents) {

        var cssTransform = Modernizr.prefixed('transform');

        // convert to hyphenated style (Zepto.js does not support camelCase)
        cssTransform = cssTransform.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

        $(window).on('scroll', function () {
            var top = Math.ceil($(window).scrollTop() / 2);

            if (top < 150) {
                $('.row__wrapper').first().css(cssTransform, 'translate3d(0, ' + -top / 2 + 'px, 0)');

                $('.row__wrapper').eq(1).css(cssTransform, 'translate3d(0, ' + -top + 'px, 0)');
            }
        });
    }

})
