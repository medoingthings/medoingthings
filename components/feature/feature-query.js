/* jshint undef: true */
'use strict';

var $ = require('zeptojs');

/**
 * Quiz style questions on the homepage
 */

$.fn.featureQuery = function () {

  return this.each(function () {

    var that = this;
    var host = window.location.host.split('.');
    var tld  = host[host.length - 1]; // .dev or .com

    this.$el         = $(this);
    this.$answerLink = this.$el.find('.feature-query__answer__link');
    this.$nextBtn    = $('#feature-query__TplNext').detach().html();
    this.apiUrl      = 'http://api.medoingthings.' + tld + '/sfl';
    this.apiData     = {};
    this.logData     = {};

    /**
     * What happens after a target is clicked
     *
     * @param  {Object} e Event Object
     */

    var handleClick = function (e) {

      var $this         = $(this);
      var responseType  = $this.hasClass('_answer-yes') ? 'yes' : 'no';
      var $container    = $this.parents('.feature-query__content');
      var containerLeft = $container.data('last') - $container.data('nth') || 0;
      var containerId   = $container.data('id');
      var $responses    = $container.find('.feature-query__response');
      var $response     = $this.hasClass('_answer-yes') ? $container.find('._response-yes') : $container.find('._response-no'); // jscs:ignore maximumLineLength
      var $headline     = $container.find('.feature-query__headline');
      var $answers      = $container.find('.feature-query__answer');
      var sayYes;
      var sayYesRate;
      var sayNo;
      var sayNoRate;
      var responseRate;

      e.preventDefault();

      // Create record, if it does not exist, yet
      if (!that.apiData[containerId]) {
        that.apiData[containerId] = {
          yes : 0,
          no  : 0
        };
      }

      sayYes       = parseInt(that.apiData[containerId].yes, 10);
      sayNo        = parseInt(that.apiData[containerId].no, 10);
      sayYesRate   = parseInt(Math.ceil(100 / (sayYes + sayNo) * sayYes), 10) || 0;
      sayNoRate    = parseInt(Math.ceil(100 / (sayYes + sayNo) * sayNo),  10) || 0;
      responseRate = responseType === 'yes' ? sayYesRate : sayNoRate;

      // Don't do anything when the more button is displayed
      if ($this.hasClass('_answer-more')) {
        $container.remove();
        return;
      }

      // Trigger animations
      $headline.addClass('_is-inactive');
      $responses.addClass('_is-active');
      $response
          .addClass('_is-active')

          // Write correct response rate to dom
          .find('.p').text(responseRate + '%');

      // Log id and response to local object
      logResponse(containerId, responseType);

      if ($container.next('').length && !$container.next('.is-nojs-only').length) {
        var $nextBtn   = $(that.$nextBtn);
        var nextBtnTxt = $nextBtn.text();

        // Show how many questions are left
        if (containerLeft > 1) {

          // Replace %x with question count down
          nextBtnTxt = nextBtnTxt.replace('%x', containerLeft);

          // Replace %s with plural s
          nextBtnTxt = nextBtnTxt.replace('%s', 's');
        } else if (containerLeft === 1) {

          // Replace %x with question count down
          nextBtnTxt = nextBtnTxt.replace('%x', 'one');

          // Replace %s: no plural s
          nextBtnTxt = nextBtnTxt.replace('%s', '');
        }

        // Replace answers with next button
        $answers.html($nextBtn.text(nextBtnTxt));
      } else {

        // Last interaction, so remove answer buttons...
        $answers.remove();

        // ...and send the users answers
        saveJSON(that.apiUrl, that.logData);
      }
    };

    var logResponse = function (id, response) {
      that.logData[id] = response;
    };

    /**
     * Receives remote JSON data
     *
     * @param {string} url
     * @param {Function} callback
     */

    var getJSON = function (url, callback) {
      $.getJSON(url, function (data) {
        if (callback && typeof callback === 'function') {
          callback(data);
        }
      });
    };

    /**
     * Posts JSON to a remote api
     *
     * @param  {String}   url
     * @param  {Object}   data
     * @param  {Function} callback [description]
     */

    var saveJSON = function (url, data, callback) {

      var json = JSON.stringify(data);

      $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: 'jsonData=' + json,
        success: function (data, status) {
          if (callback && typeof callback === 'function') {
            callback(data, status);
          }
        },
        error: function () {
          if (callback && typeof callback === 'function') {
            callback('', 'error');
          }
        }
      });
    };

    /**
     * Listen to click event on target
     */

    that.$el.on('click', '.feature-query__answer__link', handleClick);

    // Receive current answers from server
    getJSON(that.apiUrl, function (data) {
      that.apiData = typeof data === 'object' ? data : {};
    });
  });
};
