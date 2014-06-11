/** @module twitter-api-oauth */

var crypto = require('crypto');
var util = require('util');
var percentEncode = require('./utils').percentEncode;
var extend = require('./utils').extend;

/**
 * Request
 *
 * @typedef {Object} Request
 * @property {String} method
 * @property {String} url
 * @property {Object} oauth - OAuth parameters that needs to be sent only via HTTP headers.
 * @property {Object} parameters - Request parameters that needs to be signed and sent via query parameters or request body.
 */

/**
 * Application and personal access tokens and secrets.
 *
 * @typedef {Object} OAuthOptions
 * @property {String} consumer
 * @property {String} consumerKey
 * @property {String} token
 * @property {String} tokenSecret
 */

/**
 * Twitter's API authorization class.
 *
 * @param {OAuthOptions} options
 * @constructor
 */
var TwitterAPIOAuth = function (options) {
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.token = options.token;
    this.tokenSecret = options.tokenSecret;
};

/**
 * Builds an `Authorization` header string for HTTP request.
 * @see [Authorizing a request]{@link https://dev.twitter.com/docs/auth/authorizing-request}
 *
 * @param {Request} request
 * @return {String}
 */
TwitterAPIOAuth.prototype.getAuthorizationHeader = function (request) {
    var oauthParameters = this.getOAuthParameters(request);
    for (var name in request.oauth) {
        oauthParameters[name] = request.oauth[name];
    }
    oauthParameters['oauth_signature'] = this.getSignature(request);

    var headerParametersString = Object.keys(oauthParameters).map(function (name) {
        return util.format('%s="%s"', percentEncode(name), percentEncode(oauthParameters[name]));
    });

    return 'OAuth ' + headerParametersString.sort().join(', ');
};

/**
 * Builds an OAuth signature for HTTP request.
 * @see [Creating Signature]{@link https://dev.twitter.com/docs/auth/creating-signature}
 *
 * @param {Request} request
 * @return {String}
 */
TwitterAPIOAuth.prototype.getSignature = function(request) {
    var oauthParameters = this.getOAuthParameters(request);
    extend(oauthParameters, request.parameters, request.oauth);

    var signatureParameters = Object.keys(oauthParameters).map(function(name) {
        return util.format('%s=%s', percentEncode(name), percentEncode(oauthParameters[name]));
    });
    var signatureParameterString = signatureParameters.sort().join('&');
    var signatureString = [
        request.method.toUpperCase(),
        percentEncode(request.url),
        percentEncode(signatureParameterString)
    ].join('&');

    var hmac = crypto.createHmac('sha1', this.getSignKey());
    hmac.update(signatureString);
    return hmac.digest('base64');
};

/**
 * Returns Twitter's API specific OAuth parameters.
 * This excludes `oauth_signature` parameter.
 *
 * @param {Request} request
 * @return {Object}
 */
TwitterAPIOAuth.prototype.getOAuthParameters = function(request) {
    var oauthParameters = {
        'oauth_consumer_key': this.consumerKey,
        'oauth_nonce': this._getNonce(request),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': Math.floor(Date.now() / 1000),
        'oauth_version': '1.0'
    };
    if (this.token) {
        oauthParameters['oauth_token'] = this.token;
    }
    return  oauthParameters
};

/**
 * Returns signing key.
 *
 * @return {String}
 */
TwitterAPIOAuth.prototype.getSignKey = function () {
    var singingKey = percentEncode(this.consumerSecret) + '&';
    if (this.tokenSecret) {
        singingKey += percentEncode(this.tokenSecret);
    }
    return singingKey;
};

/**
 * Returns special token unique for each request.
 *
 * @param {Request} request
 * @return {String}
 * @private
 */
TwitterAPIOAuth.prototype._getNonce = function (request) {
    var md5 = crypto.createHash('md5');
    md5.update(JSON.stringify(request));
    return md5.digest('base64');
};

module.exports = TwitterAPIOAuth;
