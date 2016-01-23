define(['zeptojs'], function ($) {

    /**
     * Quiz style questions on the homepage
     */

    $.fn.featureWords = function () {

        return this.each(function () {

            var self = this;

            self.$el         = $(this);
            self.$headline   = self.$el.find('.feature-words__headline');
            self.$links      = self.$headline.find('.feature-words__link');
            self.$content    = self.$el.find('.feature-words__text');


            /**
             * What happens after a target is clicked
             *
             * @param  {Object} e Event Object
             */

            var handleClick = function (e) {

                var $this = $(this);

                // set active state of links
                $this.addClass('_is-active')
                    .siblings().removeClass('_is-active');

                // set active state of content
                self.$content.eq($this.data('nth'))
                    .addClass('_is-active')
                    .siblings().removeClass('_is-active');

                e.preventDefault();
            };


            /**
             * Init
             */

            self.$links

                // store key to each link
                .each(function (key, el) {
                    $(el).data('nth', key);
                })

                // Bind click handler
                .on('click', handleClick);
        });
    };
});


