module.exports = {

    /**
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description}
     *
     * @param {String} string
     * @returns {String}
     */
    percentEncode: function(string) {
        return encodeURIComponent(string)
            .replace(/[!'()]/g, escape)
            .replace(/\*/g, "%2A");
    },

    /**
     * @see {@link http://underscorejs.org/docs/underscore.html#section-84}
     *
     * @param {Object} object
     * @param {...Object} sources
     * @returns {Object}
     */
    extend: function (object) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                for (var property in source) {
                    object[property] = source[property];
                }
            }
        });
        return object;
    },

    /**
     * @see {@link http://www.html5rocks.com/en/tutorials/es6/promises/}
     *
     * @param {Generator} generatorFunction
     * @returns {*}
     */
    spawn: function (generatorFunction) {
        function continuer(verb, arguments) {
            var result;

            try {
                result = generator[verb](arguments);
            } catch (err) {
                return Promise.reject(err);
            }
            if (result.done) {
                return result.value;
            } else {
                return Promise.resolve(result.value).then(onFulfilled, onRejected);
            }
        }
        var generator = generatorFunction();
        var onFulfilled = continuer.bind(continuer, "next");
        var onRejected = continuer.bind(continuer, "throw");
        return onFulfilled();
    }

};
