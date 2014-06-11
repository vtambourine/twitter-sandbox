var expect = require('chai').expect;
var sinon = require('sinon');
var TwitterAPI = require('../lib/twitter-api');

xdescribe('TwitterAPI', function () {
    var twitter;

    before(function () {
        twitter = new TwitterAPI({
            consumerKey: 'xvz1evFS4wEEPTGEFPHBog',
            consumerSecret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
        });
    });

    after(function () {

    });

    it('should send proper requests to Twitter API', function () {

    });
});
