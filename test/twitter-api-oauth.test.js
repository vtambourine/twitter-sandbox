var expect = require('chai').expect;
var sinon = require('sinon');
var TwitterAPIOAuth = require('../lib/twitter-api-oauth');

describe('TwitterAPIOAuth', function () {
    var request;
    var oauth;
    var clock;

    describe('Putting an authorized request', function () {
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

    describe('Obtaining access token', function () {
        before(function () {
            request = {
                method: 'post',
                url: 'https://api.twitter.com/oauth/request_token',
                oauth: {
                    oauth_callback: 'http://localhost/sign-in-with-twitter/'
                }
            };

            clock = sinon.useFakeTimers(1318467427000);
            oauth = new TwitterAPIOAuth({
                consumerKey: 'cChZNFj6T5R0TigYB9yd1w',
                consumerSecret: 'L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg'
            });
            sinon.stub(oauth, '_getNonce').returns('ea9ec8429b68d6b77cd5600adbbb0456');
        });

        after(function () {
            clock.restore();
            oauth._getNonce.restore();
        });

        it('should generate the proper signature for provided request', function () {
            expect(oauth.getSignature(request)).to.equal('F1Li3tvehgcraF8DMJ7OyxO4w9Y=');
        });

        it('should generate the proper authorization header string for provided request', function () {
            expect(oauth.getAuthorizationHeader(request)).to.equal('OAuth oauth_callback="http%3A%2F%2Flocalhost%2Fsign-in-with-twitter%2F", oauth_consumer_key="cChZNFj6T5R0TigYB9yd1w", oauth_nonce="ea9ec8429b68d6b77cd5600adbbb0456", oauth_signature="F1Li3tvehgcraF8DMJ7OyxO4w9Y%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318467427", oauth_version="1.0"');
        });
    });
});
