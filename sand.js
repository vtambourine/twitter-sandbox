function request(value) {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (value) resolve(value)
            else reject('error');
        }, 2000);
    });
    return promise;
}

console.log(request('hello, world').then(console.log));
console.log(request(false).catch(console.log));
