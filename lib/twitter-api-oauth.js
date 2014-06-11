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
 * @property {Object} parameters
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
    this.token = options.token || '260754563-m2EH0nCaM6c3PsEvG1hm315iHQBbzbJnsVOhAEz7';
    this.tokenSecret = options.tokenSecret || 'HE7D6jF5o1ofpT4eMjEoqzcuayFlFsJaTX4G198YEmrzt';
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
    extend(oauthParameters, request.parameters);

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
    return {
        'oauth_consumer_key': this.consumerKey,
        'oauth_nonce': this._getNonce(request),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': Math.floor(Date.now() / 1000),
        'oauth_token': this.token,
        'oauth_version': '1.0'
    }
};

/**
 * Returns signing key.
 *
 * @return {String}
 */
TwitterAPIOAuth.prototype.getSignKey = function () {
    return [
        percentEncode(this.consumerSecret),
        percentEncode(this.tokenSecret)
    ].join('&');
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
    md5.update(request);
    return md5.digest('base64');
};

module.exports = TwitterAPIOAuth;
