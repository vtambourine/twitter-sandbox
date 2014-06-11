var TwitterAPI = require('./lib/twitter-api');
var Spider = require('./spider');
var secrets = require('./secrets.json');

var twitter = new TwitterAPI({
    consumerKey: secrets.consumerKey,
    consumerSecret: secrets.consumerSecret
});

var spider = new Spider(twitter);

spider.getUserTimeline('vtambourine', function (error, timeLine) {
    console.log('done', timeLine instanceof Map);
    /*var tweets = timeLine.values();
    var tweet;
    console.log(tweets.next());
    while (tweet = tweets.next()) {
        console.log(tweet);
    }*/
});
