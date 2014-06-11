var expect = require('chai').expect;
var sinon = require('sinon');
var TwitterAPIOAuth = require('../lib/twitter-api-oauth');

describe('TwitterAPIOAuth', function () {
    var request;
    var oauth;
    var clock;

    before(function () {
        request = {
            method: 'post',
            url: 'https://api.twitter.com/1/statuses/update.json',
            parameters: {
                status: 'Hello Ladies + Gentlemen, a signed OAuth request!',
                include_entities: true
            }
        };

        clock = sinon.useFakeTimers(1318622958000);
        oauth = new TwitterAPIOAuth({
            consumerKey: 'xvz1evFS4wEEPTGEFPHBog',
            consumerSecret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw',
            token: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
            tokenSecret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
        });
        sinon.stub(oauth, '_getNonce').returns('kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg');
    });

    after(function () {
        clock.restore();
        oauth._getNonce.restore();
    });

    it('should calculate the correct signature for provided request', function () {
        expect(oauth.getSignature(request)).to.equal('tnnArxj06cWHq44gCs1OSKk/jLY=');
    });

    it('should generate the correct authorization header string for provided request', function () {
        expect(oauth.getAuthorizationHeader(request)).to.equal('OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"');
    });
});
