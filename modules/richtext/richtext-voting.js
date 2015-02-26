define(['zeptojs', 'api-talk'], function ($, apiTalk) {

    /*
     * A quick voting system Dynamic Blog Post within
     * the craft template type "Dynamic Blog Post".
     *
     * The user clicks on one choice and this button will show the percentage
     * rate how other users voted. Values store on api.medoingthings.com.
     */

    $.fn.richtextVoting = function() {

        return this.each(function () {
            var self = this;

            self.$el           = $(this);
            self.$btnWrapper   = self.$el.find('.richtext__voting__list');
            self.$btnItems     = self.$el.find('.richtext__voting__item');
            self.pageId        = self.$el.data('page-id');
            self.voteId        = self.$el.data('vote-id');
            self.pageVoteId    = "dbp_vote-" + self.pageId + "" + self.voteId;
            self.voteData      = getVoteDataLocal() || {};
            self.voteUrl       = apiTalk.apiUrl + 'dbp/vote/' + self.pageId + '-' + self.voteId;

            // receive data for the current voting
            apiTalk.getJSON(self.voteUrl, function (data) {

                // only if valid data is received
                if (data !== null && typeof data === 'object') {

                    // store response in local variable
                    $.extend(self.voteData, data);

                    // update localStorage only, if the user already
                    // made a choice
                    if (typeof self.voteData.userChoice === 'number') {

                        // write self.voteData to localStorage
                        setVoteDataLocal();

                        // update the button with the new data
                        updateButtons();
                    }
                }
            });

            // has the user already voted
            if (getVoteDataLocal() !== null) {
                updateButtons();
            }

            // Listen to click event on target
            self.$btnWrapper.one('click', 'button', handleBtnClick);


            /**
             * Calculate percentages and update the buttons accordingly
             *
             * @param {Object} e Zepto event object
             */

            function handleBtnClick (e) {

                // which button was clicked?
                var $this        = $(e.currentTarget),
                    clickedIndex = $this.data('vote-index');

                // storing the users choice
                self.voteData.userChoice = clickedIndex;

                // make sure we have a valid voteData object
                validateVoteData();

                // add 1 to clicked voting in self.voteData
                self.voteData[clickedIndex]++;

                // send clicked voting to server
                apiTalk.saveJSON(self.voteUrl, {
                    'addToIndex': clickedIndex,
                    'pageId': self.pageId,
                    'voteId': self.voteId
                });

                // store data in localStorage
                setVoteDataLocal();

                updateButtons();
            }

            /**
             * Update the buttons to show the voting percentages
             */

            function updateButtons () {

                self.$btnItems.each(function (index) {

                    var $this      = $(this),
                        $button    = $this.find('button'),
                        $percent   = $this.find('.percent'),
                        voteTotal  = getTotalVotes(),
                        voteData   = self.voteData,
                        userChoice = parseInt(voteData.userChoice, 10),

                        // percentage to display
                        percentage = 100 / voteTotal * voteData[index],

                        // determines which of the five height
                        // classes (.h10 to .h50) should be applied to the buttons
                        scope = Math.round(percentage / 20) * 10;

                    // check if percentage has a decimal. If yes, show only 1
                    percentage = percentage % 1 === 0 ? percentage : percentage.toFixed(1);

                    // button looks inactive if it wasn't the users choice
                    if (userChoice !== index) {
                        $this.addClass('is-inactive')
                    }

                    // disable button and add height class
                    $button
                        .addClass('h' + scope)
                        .attr('disabled', 'disabled');

                    // write percentage to span element
                    $percent
                        .html(percentage + '%')
                        .addClass('is-visible');

                });
            };


            /**
             * Get the sum of all votes in the self.voteData object
             *
             * @return {Int} totalVotes
             */

            function getTotalVotes () {

                var totalVotes = 0,
                    data       = self.voteData;

                // calculate totalVotes adding the numbers in the object
                for (prop in data) {

                    // make sure we count only properties that are numbers
                    // to prevent counting e.g. 'self.userData.userChoice'
                    prop = parseInt(prop, 10);

                    if (data.hasOwnProperty(prop) && prop !== 'NaN') {

                        totalVotes += parseInt(data[prop], 10);
                    }
                }


                return totalVotes;

            };


            /*
             * validateVoteData
             * Check if we have valid voteData. If not, populate self.voteData
             * with zero based numbers.
             * When this function ran, it's save to work with self.voteData
             */

            function validateVoteData () {

                // how many buttons do we have?
                var btnCount = self.$btnItems.length;

                // validate only if necessary
                if (!self.voteData.length || self.voteData.length < btnCount || typeof self.voteData !== 'object') {

                    // a loop for every button we have
                    for (var i = 0; i <  btnCount; i++) {

                        // only add value if it is not already there
                        if (!self.voteData.hasOwnProperty(i)) {

                            self.voteData[i] = 0;

                        }
                    }
                }
            }


            /*
             * Get voteData out of the localStorage if present
             */

            function getVoteDataLocal () {

                if (Modernizr.localstorage) {

                    return JSON.parse(localStorage.getItem(self.pageVoteId));
                } else {

                    return false;
                }
            }


            /*
             * Store voteData in localStorage
             */

            function setVoteDataLocal () {

                if (Modernizr.localstorage) {

                    localStorage.setItem(self.pageVoteId, JSON.stringify(self.voteData));
                    return true;

                } else {

                    return false;
                }
            }
        });
    };


});


