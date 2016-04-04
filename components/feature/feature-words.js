'use strict';

var $ = require('zeptojs');

/**
 * Quiz style questions on the homepage
 */

$.fn.featureWords = function () {

  return this.each(function () {

    var that = this;

    this.$el         = $(this);
    this.$headline   = this.$el.find('.feature-words__headline');
    this.$links      = this.$headline.find('.feature-words__link');
    this.$content    = this.$el.find('.feature-words__text');

    /**
     * What happens after a target is clicked
     *
     * @param  {Object} e Event Object
     */

    var handleClick = function (e) {

      var $this = $(this);

      // Set active state of links
      $this.addClass('_is-active')
        .siblings().removeClass('_is-active');

      // Set active state of content
      that.$content.eq($this.data('nth'))
        .addClass('_is-active')
        .siblings().removeClass('_is-active');

      e.preventDefault();
    };

    /**
     * Init
     */

    this.$links

      // Store key to each link
      .each(function (key, el) {
        $(el).data('nth', key);
      })

      // Bind click handler
      .on('click', handleClick);
  });
};
