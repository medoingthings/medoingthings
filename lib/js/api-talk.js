define(['zeptojs'], function ($) {

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
     * Get the APIs url
     *
     * @return {String} http://api.medoingthings.[com, dev]
     */

    var getApiUrl = function () {
        var host = window.location.host.split('.'),
            tld  = host[host.length - 1]; // 'dev' or 'com'

        return '//api.medoingthings.' + tld + '/';

    }

    return {
        getJSON  : getJSON,
        saveJSON : saveJSON,
        apiUrl   : getApiUrl()
    }

});
