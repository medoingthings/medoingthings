define(['zeptojs'], function ($) {

    /**
     * Quiz style questions on the homepage
     */

    $.fn.featureQuery = function () {

        return this.each(function () {

            var self = this,
                host = window.location.host.split('.'),
                tld  = host[host.length - 1]; // .dev or .com

            self.$el         = $(this);
            self.$answerLink = self.$el.find('.feature-query__answer__link');
            self.$nextBtn    = $('#feature-query__TplNext').detach().html();
            self.apiUrl      = '//api.medoingthings.' + tld + '/sfl';
            self.apiData     = {};
            self.logData     = {};


            /**
             * What happens after a target is clicked
             *
             * @param  {Object} e Event Object
             */

            var handleClick = function (e) {

                var $this         = $(this),
                    responseType  = $this.hasClass('_answer-yes') ? 'yes' : 'no',
                    $container    = $this.parents('.feature-query__content'),
                    containerLeft = $container.data('last') - $container.data('nth') || 0,
                    containerId   = $container.data('id'),
                    $responses    = $container.find('.feature-query__response'),
                    $response     = $this.hasClass('_answer-yes') ? $container.find('._response-yes') : $container.find('._response-no'),
                    $headline     = $container.find('.feature-query__headline'),
                    $answers      = $container.find('.feature-query__answer'),
                    sayYes, sayNo, sayYesRate, responseRate;

                e.preventDefault();

                // create record, if it does not exist, yet
                if (!self.apiData[containerId]) {
                    self.apiData[containerId] = {
                        yes : 0,
                        no  : 0
                    }
                }

                sayYes       = parseInt(self.apiData[containerId]['yes'], 10);
                sayNo        = parseInt(self.apiData[containerId]['no'], 10);
                sayYesRate   = parseInt(Math.ceil(100 / (sayYes + sayNo) * sayYes), 10) || 0;
                sayNoRate    = parseInt(Math.ceil(100 / (sayYes + sayNo) * sayNo),  10) || 0;
                responseRate = responseType === 'yes' ? sayYesRate : sayNoRate;

                // don't do anything when the more button is displayed
                if ($this.hasClass('_answer-more')) {
                    $container.remove();
                    return;
                }

                // trigger animations
                $headline.addClass('_is-inactive');
                $responses.addClass('_is-active');
                $response
                    .addClass('_is-active')

                    // write correct response rate to dom
                    .find('.p').text(responseRate + '%');

                // log id and response to local object
                logResponse(containerId, responseType);

                if ($container.next('').length && !$container.next('.is-nojs-only').length) {

                    var $nextBtn   = $(self.$nextBtn),
                        nextBtnTxt = $nextBtn.text();


                    // Show how many questions are left
                    if (containerLeft > 1) {

                        // replace %x with question count down
                        nextBtnTxt = nextBtnTxt.replace('%x', containerLeft);

                        // replace %s with plural s
                        nextBtnTxt = nextBtnTxt.replace('%s', 's');

                    } else if (containerLeft === 1) {

                        // replace %x with question count down
                        nextBtnTxt = nextBtnTxt.replace('%x', 'one');

                        // replace %s: no plural s
                        nextBtnTxt = nextBtnTxt.replace('%s', '');

                    }

                    // replace answers with next button
                    $answers.html($nextBtn.text(nextBtnTxt));

                } else {

                    // last interaction, so remove answer buttons...
                    $answers.remove();

                    // ...and send the users answers
                    saveJSON(self.apiUrl, self.logData);
                }
            };


            var logResponse = function (id, response) {

                self.logData[id] = response;

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
                    success: function (data, status, xhr) {

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

            self.$el.on('click', '.feature-query__answer__link', handleClick);

            // receive current answers from server
            getJSON(self.apiUrl, function (data) {
                self.apiData = typeof data === 'object' ? data : {};
            });

        });
    };

});


