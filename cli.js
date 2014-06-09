function *fib() {
    let a, b = [0, 1]
    while (true) {
        a, b = [b, +a+b]
        yield a;
    };
}

var f = fib();
var v;
while (v = f.next().value) {
    if (v > 1000) break;
    console.log(v);
}
