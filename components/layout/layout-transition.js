'use strict';

var $ = require('jquery');

window.jQuery = $;
require('smoothstate');

var init = function () {
  var smoothstate = $('#smoothstate-container').smoothState({
    onStart: {
      duration: 700,
      render: function ($container) {
        $container.addClass('_animate-out');
      }
    },
    onReady: {
      duration: 700,
      render: renderNewPage
    },
    onAfter: function ($container) {
      $container.removeClass('_animate-in');
    }
  });
};

var renderNewPage = function ($container, $newContentContainer) {
  var $contentContainer = $container.find('#content').first();
  var $newContent = $newContentContainer.find('#content').first();

  var $pageWrapper = $container.find('#page-wrapper');
  var currentContainerClasses = $pageWrapper.attr('class');
  var newContainerClasses = $newContentContainer.attr('class');

  $container.removeClass('_animate-out').addClass('_animate-in');

  $pageWrapper
    .removeClass(currentContainerClasses)
    .addClass(newContainerClasses);

  $contentContainer.html($newContent.html());
}

exports.init = init;
