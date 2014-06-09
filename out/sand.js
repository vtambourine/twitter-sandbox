System.register("../sand", [], function() {
  "use strict";
  var $__1 = $traceurRuntime.initGeneratorFunction(fibonacci);
  var __moduleName = "../sand";
  console.log(' :: Sandbox');
  function fibonacci(n) {
    var $__0,
        a,
        b,
        i;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = [0, 1], a = $__0[0], b = $__0[1];
            i = 0;
            $ctx.state = 9;
            break;
          case 9:
            $ctx.state = (i < n) ? 5 : -2;
            break;
          case 5:
            ($__0 = [b, a + b], a = $__0[0], b = $__0[1], $__0);
            i++;
            console.log(a, b);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return a;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 9;
            break;
          default:
            return $ctx.end();
        }
    }, $__1, this);
  }
  var fib = fibonacci(10);
  console.log(fib.next());
  console.log(fib.next());
  console.log(fib.next());
  return {};
});
System.get("../sand" + '');

//# sourceMappingURL=sand.map
