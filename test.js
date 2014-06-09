var TwitterAPI = require('./twitter-api');

var twitter = new TwitterAPI({
    consumerKey: 'FWhxe0MvuSUMqHGNOMmyOV11Q',
    consumerSecret: 'O8pOo65E9hvrqLKeDX1Eo2jkRYKbHh81zDupgqiFlxmyI8owHd'
});

var maxId = '156663327714000000';
var maxId;

var userTimelineParameters = {
    screen_name: 'vtambourine',
    exclude_replies: true,
    include_rts: false,
    count: 200
};

var tweetId;

var tweets = new Map();

(function getUserTimeline() {
//    console.log('---', maxId);
        if (!isNaN(maxId)) {
            userTimelineParameters.max_id = maxId;
        }
    twitter.get('user-timeline', userTimelineParameters, function (error, data) {
        var tweetsCount = data.length;
        var tweet;
        var i = 0;
        while (i < tweetsCount) {
            tweet = data[i];
            tweetId = tweet.id_str;
            if (!tweets.has(tweetId)) {
                tweets.set(tweetId, tweet.text);
                console.log(tweetId, tweet.text);
            } else {
                if (tweetsCount === 1) {
                    var done = true
                }
            }
            if (i === tweetsCount - 1) {
                maxId = tweetId;
            }
            i++;
        }
        if (!done) {
            getUserTimeline();
        }
    });
})();

/*twitter.request({
    method: 'get',
    url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
    parameters: {
        screen_name: 'vtambourine',
        count: 2
    }
}, function (response) {
    console.log('===== timeline');
    console.log(response);
});*/

/*twitter.request({
    method: 'post',
    url: 'https://api.twitter.com/1.1/statuses/update.json',
    parameters: {
        status: 'Now I learn how work with Twitter API'
    }
}, function (response) {
    console.log('===== update');
    console.log(response);
});*/

/*twitter.request({
    method: 'get',
    url: 'https://stream.twitter.com/1.1/statuses/filter.json',
    parameters: {
//        track: 'vtambourine'
//        status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
//        follow: 'twitter'
//        delimited: 'length',
        track: 'russia'
    }
}, function (response) {
    console.log('===== update');
    console.log(response);
});*/

/*vtambourineStream = twitter.stream('statuses', { track: 'vtambourine' });
vtambourineStream.on('block', function (block) {
    console.log('block');
});*/



