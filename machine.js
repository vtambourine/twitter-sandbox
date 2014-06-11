var util = require('util');
var TwitterAPI = require('./lib/twitter-api');
var Spider = require('./spider');
var secrets = require('./secrets.json');
var querystring = require('querystring');

var twitter = new TwitterAPI({
    consumerKey: secrets.consumerKey,
    consumerSecret: secrets.consumerSecret
});

var verifier = process.argv[2];
var token = process.argv[3];
if (!verifier) {
    twitter.obtainRequestToken().then(function (data) {
        console.log('done', data);

        var res = querystring.parse(data);
        console.log('Now visit this link:');
        console.log('https://api.twitter.com/oauth/authenticate?oauth_token=' + res.oauth_token);
    }, function (error) {
        console.log('error');
        console.error(error);
        console.error(error.stack);
        throw error;
    });
} else if (verifier) {
    twitter.obtainAccessToken(verifier, token).then(function (data) {
        console.log('get', data);
    });
}


//var spider = new Spider(twitter);

/*
spider.getUserTimeline('vtambourine', function (error, timeLine) {
    console.log('done', timeLine instanceof Map);
    */
/*var tweets = timeLine.values();
    var tweet;
    console.log(tweets.next());
    while (tweet = tweets.next()) {
        console.log(tweet);
    }*//*

});
*/
