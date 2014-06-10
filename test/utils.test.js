var expect = require('chai').expect;
var utils = require('../utils');

describe('utils', function () {
    describe('percentEncode(string)', function () {
        it('should escape a string, replacing all special characters, which includes !, \', (, ) and *', function () {
            expect(utils.percentEncode('AzАя%\\/!\'( )*')).to.equal('Az%D0%90%D1%8F%25%5C%2F%21%27%28%20%29%2A');
        });
    });

    describe('extend(destination, ...sources)', function () {
        it('should copy all of the properties from source objects to the destination object and return it', function () {
            expect(utils.extend({name: 'moe'}, {age: 50})).to.deep.equal({name: 'moe', age: 50});
        });
    });

    describe('spawn(generator)', function () {
        it('should return a promise resolved with generator last return value', function () {
            return utils.spawn(function *() {
                yield 'bad';
                return 'good'
            }).then(function (value) {
                expect(value).to.equal('good');
            });
        });
    });
});
