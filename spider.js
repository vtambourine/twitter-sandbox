var EventEmitter = require('events').EventEmitter;
var TwitterAPI = require('./lib/twitter-api');
var util = require('util');
var spawn = require('./lib/utils').spawn;

var Spider = function (twitter) {
    this.twitter = twitter;
};

util.inherits(Spider, EventEmitter);

Spider.prototype.getUserTimeline = function (name, callback) {
    var parameters = {
        screen_name: name,
        exclude_replies: true,
        include_rts: false,
        count: TwitterAPI.MAX_COUNT
    };
    var statuses = new Map();
    var maxId = '170239010244009984';
    var twitter = this.twitter;

    spawn(function *() {
        try {
            console.log('go spawn');
            var hasUnprocessed = true;
            do {
                if (!isNaN(maxId)) parameters.max_id = maxId;
                data = yield new Promise(function (resolve, reject) {
                    twitter.get('user-timeline', parameters, function (error, data) {
                        if (error) reject(error)
                        else resolve(data);
                    });
                });
                hasUnprocessed = data.some(function (status) {
                    return !statuses.has(status.id_str);
                });
                console.log('has?', hasUnprocessed);
                if (hasUnprocessed) {
                    data.forEach(function (status) {
                        var id = status.id_str;
                        if (!statuses.has(id)) {
                            console.log('tw', id, status.text);
                            statuses.set(id, status.text);
                            maxId = id;
                        }
                    });
                } else {
                    callback(null, statuses);
                }
            } while (hasUnprocessed);
        } catch (err) {
            console.log('err', err);
        }
    });
};

Spider.prototype.getUserTimelineOld = function (name, callback) {
    var parameters = {
        screen_name: name,
        exclude_replies: true,
        include_rts: false,
        count: TwitterAPI.MAX_COUNT
    };

    var statuses = new Map();
    var maxId = '156663327714582528';
    var twitter = this.twitter;
    function getUserTimeline() {
        console.log('get user timeline');
        if (!isNaN(maxId)) {
            parameters.max_id = maxId;
        }
        twitter.get('user-timeline', parameters, function (error, data) {
//            console.log(data);
            if (!data) return;
            var hasUnprocessed = data.some(function (status) {
                return !statuses.has(status.id_str);
            });
            if (hasUnprocessed) {
                data.forEach(function (status) {
                    var id = status.id_str;
                    if (!statuses.has(id)) {
//                        console.log(id, status.text);
                        statuses.set(id, status.text);
                        maxId = id;
                    }
                });
                getUserTimeline();
            } else {
                callback(null, statuses);
            }
        })
    }

    getUserTimeline.bind(this)();
};

module.exports = Spider;
