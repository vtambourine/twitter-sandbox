var https = require('https');
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var percentEncode = require('./utils').percentEncode;
var TwitterAPIOAuth  = require('./twitter-api-oauth');

var TwitterAPI = function(options) {
    this.oauth = new TwitterAPIOAuth({
        consumerKey: options.consumerKey,
        consumerSecret: options.consumerSecret
    });
};

/*
request

stream
stream statuses
stream user

get statuses
search
 */

TwitterAPI.MAX_COUNT = 200;

TwitterAPI.REST_GET = {
    'user-timeline': {
        method: 'get',
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json'
    }
};

TwitterAPI.REST_POST = {
    'update': {
        method: 'post',
        url: 'https://api.twitter.com/1.1/statuses/update.json'
    }
};

TwitterAPI.STREAM = {
    filter: {
        method: 'get',
        url: 'https://stream.twitter.com/1.1/statuses/filter.json',
        parameters: {
            delimited: 'length'
        }
    }
};

TwitterAPI.prototype.request = function(request, callback) {
    var authorizationHeader = this.oauth.getAuthorizationHeader(request);

    var queryString = Object.keys(request.parameters).map(function (name) {
        return percentEncode(name) + '=' + percentEncode(request.parameters[name]);
    }).join('&');
    if (queryString) {
        queryString = '?' + queryString;
    }

    var parsedUrl = url.parse(request.url);
    var requestOptions = {
        hostname: parsedUrl.host,
        path: parsedUrl.pathname + queryString,
        method: request.method.toUpperCase(),
        headers: {
            'Authorization': authorizationHeader
        }
    };

    return https.request(requestOptions, function (stream) {
        stream.setEncoding('utf8');
        callback(stream);
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

var TwitterStream = function () { };
util.inherits(TwitterStream, EventEmitter);

TwitterAPI.prototype.stream = function(request, callback) {
    var request = TwitterAPI.STREAM[resource];
    merge(request.parameters, parameters);

    var twitterStream = new TwitterStream();

//    request.parameters.delimited = 'length';
//    var requestOptions = getRequestOptions(request);
    var twitterRequest = this.request(request, function(stream) {
        var buffer = '';
        stream.setEncoding('utf8');
        stream.on('readable', function () {
            var chunk;
            while (null !== (chunk = stream.read())) {
                buffer += chunk;
            };
            var block;
            try {
                block = JSON.parse(buffer);
                console.log('block');
//                callback(block);
                twitterStream.emit('block', block);
                buffer = '';
            } catch (error) {}
        });
        stream.on('end', function () {
            twitterStream.emit('end', 'end of data');
//            callback('end of data');
        });
    });
    twitterRequest.end();
    return twitterStream;
};

module.exports = TwitterAPI;
