var crypto = require('crypto');
var percentEncode = require('./utils').percentEncode;

var TwitterAPIOAuth = function (options) {
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.token = '260754563-m2EH0nCaM6c3PsEvG1hm315iHQBbzbJnsVOhAEz7';
    this.tokenSecret = 'HE7D6jF5o1ofpT4eMjEoqzcuayFlFsJaTX4G198YEmrzt';
};

TwitterAPIOAuth.prototype.getAuthorizationHeader = function (request) {
    this.prepareOAuthParameters();

    var oauthParameters = this.getOAuthParameters();
    oauthParameters['oauth_signature'] = this.getSignature(request);

    var headerParametersString = Object.keys(oauthParameters).map(function (name) {
        return percentEncode(name) + '="' + percentEncode(oauthParameters[name]) + '"';
    });

    var header = 'OAuth ' + headerParametersString.sort().join(', ');
    return header;
};

TwitterAPIOAuth.prototype.getSignature = function(request) {
    var oauthParameters = this.getOAuthParameters();
    Object.keys(request.parameters).forEach(function(name) {
        oauthParameters[name] = request.parameters[name];
    });

    var signatureParameters = Object.keys(oauthParameters).map(function(name) {
        return percentEncode(name) + '=' + percentEncode(oauthParameters[name]);
    });

    var signatureParameterString = signatureParameters.sort().join('&');

    var signatureString = [
        request.method.toUpperCase(),
        percentEncode(request.url),
        percentEncode(signatureParameterString)
    ].join('&');

    var hmac = crypto.createHmac('sha1', this.getSignKey());
    hmac.update(signatureString);
    var signature = hmac.digest('base64');

    return signature;
};

TwitterAPIOAuth.prototype.prepareOAuthParameters = function () {
    this.nonce = this.getNonce();
};

TwitterAPIOAuth.prototype.getOAuthParameters = function() {
    return {
        'oauth_consumer_key': this.consumerKey,
        'oauth_nonce': this.nonce,
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': Math.floor(Date.now() / 1000),
        'oauth_token': this.token,
        'oauth_version': '1.0'
    }
};

TwitterAPIOAuth.prototype.getSignKey = function () {
    var signKey = [
        percentEncode(this.consumerSecret),
        percentEncode(this.tokenSecret)
    ];
    return signKey.join('&');
};

TwitterAPIOAuth.prototype.getNonce = function () {
    return crypto.pseudoRandomBytes(16).toString('hex');
};

module.exports = TwitterAPIOAuth;
