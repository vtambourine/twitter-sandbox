var https = require('https');
var url = require('url');
var querystring = require('querystring');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var percentEncode = require('./utils').percentEncode;
var extend = require('./utils').extend;
var TwitterAPIOAuth  = require('./twitter-api-oauth');

var TwitterAPI = function(options) {
    this.oauth = new TwitterAPIOAuth({
        consumerKey: options.consumerKey,
        consumerSecret: options.consumerSecret
    });
};

TwitterAPI.MAX_COUNT = 200;

TwitterAPI.REST_GET = {
    'user-timeline': {
        method: 'get',
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json'
    }
};

TwitterAPI.STATUS_UPDATE = {
    method: 'post',
    url: 'https://api.twitter.com/1.1/statuses/update.json'
};

TwitterAPI.OBTAIN_REQUEST_TOKEN = {
    method: 'post',
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
        oauth_callback: 'oob'
    }
};

TwitterAPI.OBTAIN_ACCESS_TOKEN = {
    method: 'post',
    url: 'https://api.twitter.com/oauth/access_token'
};

TwitterAPI.VERIFY_CREDENTIALS = {
    method: 'get',
    url: 'https://api.twitter.com/1.1/account/verify_credentials.json'
};

TwitterAPI.prototype.request = function(request) {
    return new Promise(function (resolve, reject) {
        try {
            var method = request.method;
            var query = '';

            // Collect query parameters for GET request.
            if (method === 'get') {
                query = querystring.stringify(request.parameters);
                if (query) {
                    query = '?' + query;
                }
            }

            var parsedUrl = url.parse(request.url);
            var requestOptions = {
                hostname: parsedUrl.host,
                path: parsedUrl.pathname + query,
                method: method.toUpperCase(),
                headers: {
                    'Authorization': this.oauth.getAuthorizationHeader(request),
                    'Content-Type': 'application/x-www-form-urlencoded',
//                    'Content-Length':  querystring.stringify(request.parameters).length
                }
            };
console.log(requestOptions);
            var httpsRequest = https.request(requestOptions, function (response) {
                var data = '';
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    resolve(data)
                });
            });


            httpsRequest.on('upgrade', function (response, socket, head) {
                console.log(' >>> ', head);
            });

            if (method === 'post') {
                console.log('wrote', querystring.stringify(request.parameters));
                httpsRequest.write(querystring.stringify(request.parameters));
//                httpsRequest.write('status=1\n');
            }
            httpsRequest.on('error', function (error) {
                console.log('>> error');
                reject(error);
            });
            httpsRequest.end();
        } catch (error) {
            reject(error);
        }
    }.bind(this));
};

/**
 * @returns {Promise}
 */
TwitterAPI.prototype.obtainRequestToken = function () {
    return this.request(TwitterAPI.OBTAIN_REQUEST_TOKEN).then(function (response) {
        return response;
    }).catch(function (error) {
        throw error;
    });
};

/**
 * @returns {Promise}
 */
TwitterAPI.prototype.obtainAccessToken = function (verifier, token) {
    var request = TwitterAPI.OBTAIN_ACCESS_TOKEN;
    request.parameters = extend({}, {
        oauth_verifier: verifier,
        oauth_token: token
    });
    console.log(request);
    return this.request(request).then(function (response) {
        return response;
    }).catch(function (error) {
        throw error;
    });
};

TwitterAPI.prototype.verifyCredentials = function (token, tokenSecret) {
    this.oauth.token = token;
    this.oauth.tokenSecret = tokenSecret;
    return this.request(TwitterAPI.VERIFY_CREDENTIALS).then(function (response) {
        return response;
    }).catch(function (error) {
        throw error;
    });
};

TwitterAPI.prototype.updateStatus = function (token, tokenSecret, status) {
    this.oauth.token = token;
    this.oauth.tokenSecret = tokenSecret;
    var request = TwitterAPI.STATUS_UPDATE;
    request.parameters = extend({}, {
        status: status
    });
//    console.log('== ');
//    console.log('== ', this.oauth.getAuthorizationHeader(request));
    return this.request(request).then(function (response) {
        return response;
    }).catch(function (error) {
        throw error;
    });
};

/**
 *
 * @param resource
 * @param parameters
 * @param callback
 * @return {Promise}
 */
TwitterAPI.prototype.get = function(resource, parameters, callback) {
    var request = TwitterAPI.REST_GET[resource];
    request.parameters = parameters;
    //    merge(request.parameters, parameters);

    return promise = new Promise(function(resolve, reject) {
        var response = '';
        var twitterRequest = this.request(request, function(stream) {
            stream.on('data', function(data) {
                response += data;
            });
            stream.on('end', function() {
                try {
                    var block = JSON.parse(response);
                    promise.resolve(block);
                    callback(null, block);
                } catch (error) {
                    promise.reject(error);
                    //               callback(error);
                }
            });
        });
        twitterRequest.end();
    });
};

TwitterAPI.prototype.post = function (status) {
    var promise = new Promise();
    var request = TwitterAPI.REST_POST['update'];
    this.request(request, function (stream) {

    });
    return promise;
};

module.exports = TwitterAPI;
