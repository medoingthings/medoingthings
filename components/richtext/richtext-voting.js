'use strict';

var $ = require('zeptojs');
var apiTalk = require('api-talk');

/*
 * A quick voting system Dynamic Blog Post within
 * the craft template type "Dynamic Blog Post".
 *
 * The user clicks on one choice and this button will show the percentage
 * rate how other users voted. Values store on api.medoingthings.com.
 */

$.fn.richtextVoting = function () {

  return this.each(function () {
    var that = this;

    this.$el           = $(this);
    this.$btnWrapper   = this.$el.find('.richtext__voting__list');
    this.$btnItems     = this.$el.find('.richtext__voting__item');
    this.pageId        = this.$el.data('page-id');
    this.voteId        = this.$el.data('vote-id');
    this.pageVoteId    = 'dbp_vote-' + this.pageId + '' + this.voteId;
    this.voteData      = getVoteDataLocal() || {};
    this.voteUrl       = apiTalk.apiUrl + 'dbp/vote/' + this.pageId + '-' + this.voteId;

    // Receive data for the current voting
    apiTalk.getJSON(this.voteUrl, function (data) {

      // Only if valid data is received
      if (data !== null && typeof data === 'object') {

        // Store response in local variable
        $.extend(that.voteData, data);

        // Update localStorage only, if the user already
        // made a choice
        if (typeof that.voteData.userChoice === 'number') {

          // Write that.voteData to localStorage
          setVoteDataLocal();

          // Update the button with the new data
          updateButtons();
        }
      }
    });

    // Has the user already voted
    if (getVoteDataLocal() !== null) {
      updateButtons();
    }

    // Listen to click event on target
    that.$btnWrapper.one('click', 'button', handleBtnClick);

    /**
     * Calculate percentages and update the buttons accordingly
     *
     * @param {Object} e Zepto event object
     */

    function handleBtnClick (e) {

      // Which button was clicked?
      var $this        = $(e.currentTarget);
      var clickedIndex = $this.data('vote-index');

      // Storing the users choice
      that.voteData.userChoice = clickedIndex;

      // Make sure we have a valid voteData object
      validateVoteData();

      // Add 1 to clicked voting in that.voteData
      that.voteData[clickedIndex]++;

      // Send clicked voting to server
      apiTalk.saveJSON(that.voteUrl, {
        addToIndex: clickedIndex,
        pageId: that.pageId,
        voteId: that.voteId
      });

      // Store data in localStorage
      setVoteDataLocal();

      updateButtons();
    }

    /**
     * Update the buttons to show the voting percentages
     */

    function updateButtons () {
      that.$btnItems.each(function (index) {

        var $this      = $(this);
        var $button    = $this.find('button');
        var $percent   = $this.find('.percent');
        var voteTotal  = getTotalVotes();
        var voteData   = that.voteData;
        var userChoice = parseInt(voteData.userChoice, 10);

        // Percentage to display
        var percentage = 100 / voteTotal * voteData[index];

        // Determines which of the five height
        // classes (.h10 to .h50) should be applied to the buttons
        var scope = Math.round(percentage / 20) * 10;

        $button.removeClass('h10 h20 h30 h40 h50');
        console.log($button);
        console.log(scope);

        // Check if percentage has a decimal. If yes, show only 1
        percentage = percentage % 1 === 0 ? percentage : percentage.toFixed(1);

        // Button looks inactive if it wasn't the users choice
        if (userChoice !== index) {
          $this.addClass('is-inactive');
        }

        // Disable button and add height class
        $button
          .addClass('h' + scope)
          .attr('disabled', 'disabled');

        // Write percentage to span element
        $percent
          .html(percentage + '%')
          .addClass('is-visible');
      });
    }

    /**
     * Get the sum of all votes in the that.voteData object
     *
     * @return {Int} totalVotes
     */

    function getTotalVotes () {

      var totalVotes = 0;
      var data       = that.voteData;

      // Calculate totalVotes adding the numbers in the object
      for (var prop in data) {

        // Make sure we count only properties that are numbers
        // to prevent counting e.g. 'that.userData.userChoice'
        prop = parseInt(prop, 10);

        if (data.hasOwnProperty(prop) && prop !== 'NaN') {

          totalVotes += parseInt(data[prop], 10);
        }
      }

      return totalVotes;
    }

    /*
     * Check if we have valid voteData. If not, populate that.voteData
     * with zero based numbers.
     * When this function ran, it's save to work with that.voteData
     */

    function validateVoteData () {

      // How many buttons do we have?
      var btnCount = that.$btnItems.length;

      // Validate only if necessary
      if (!that.voteData.length || that.voteData.length < btnCount || typeof that.voteData !== 'object') {

        // A loop for every button we have
        for (var i = 0; i <  btnCount; i++) {

          // Only add value if it is not already there
          if (!that.voteData.hasOwnProperty(i)) {

            that.voteData[i] = 0;
          }
        }
      }
    }

    /*
     * Get voteData out of the localStorage if present
     */

    function getVoteDataLocal () {

      if (Modernizr.localstorage) {
        return JSON.parse(localStorage.getItem(that.pageVoteId));
      } else {
        return false;
      }
    }

    /*
     * Store voteData in localStorage
     */

    function setVoteDataLocal () {

      if (Modernizr.localstorage) {
        localStorage.setItem(that.pageVoteId, JSON.stringify(that.voteData));
        return true;
      } else {
        return false;
      }
    }
  });
};
