var should = require('chai').should();
var utils = require('../utils');

describe('utils', function () {
    describe('percentEncode(string)', function () {
        it('should escape a string, replacing all special characters, which includes !, \', (, ) and *', function () {
            var originalString = 'Факториал / n! = 1 * 2 * ... * n';
            var escapedString = '%D0%A4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%B8%D0%B0%D0%BB%20%2F%20n%21%20%3D%201%20%2A%202%20%2A%20...%20%2A%20n';
            utils.percentEncode(originalString).should.be.equal(escapedString);
        });
    });

    describe('extend(destination, ...sources)', function () {
        it('should copy all of the properties from source objects to the destination object and return it', function () {
            var destinationObject = {name: 'moe'};
            var sourceObject = {age: 50};
            var extendedObject = {name: 'moe', age: 50};
            utils.extend(destinationObject, sourceObject).should.deep.equal(extendedObject);
            destinationObject.should.be.deep.equal(extendedObject);
        });
    });

    describe('spawn(generator)', function () {
        it('should return a promise resolved with generator return value', function () {
            return utils.spawn(function *() {
                yield 'bad';
                return 'good'
            }).then(function (value) {
                value.should.be.equal('good');
            });
        });
    });
});
