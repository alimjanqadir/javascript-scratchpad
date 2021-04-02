function foo() {
    const secret = Math.trunc(Math.random()*100)
    return function inner() {
      console.log(`The secret number is ${secret}.`)
    }
  }
  const f = foo() // `secret` is not directly accessible from outside `foo`
  f() // The only way to retrieve `secret`, is to invoke `f`


/* Private Instance Variables
 *
 * In the following code, the function toString closes over the details of the car.
 */

function Car(manufacturer, model, year, color) {
  return {
    toString() {
      return `${manufacturer} ${model} (${year}, ${color})`
    }
  }
}
const car = new Car('Aston Martin','V8 Vantage','2012','Quantum Silver')
console.log(car.toString())

/* Functional Programming
 *
 * In the following code, the function inner closes over both fn and args.
 */

function curry(fn) {
    const args = []
    return function inner(arg) {
      if(args.length === fn.length) return fn(...args)
      args.push(arg)
      return inner
    }
  }
  
  function add(a, b) {
    return a + b
  }
  
  const curriedAdd = curry(add)
  console.log(curriedAdd(2)(3)()) // 5


/* Modularization
 *
 * In the following example, all the implementation details are hidden inside an immediately 
 * executed function expression. The functions tick and toString close over the private state 
 * and functions they need to complete their work. Closures have enabled us to modularise and encapsulate our code.
 */

let namespace = {};

(function foo(n) {
  let numbers = []
  function format(n) {
    return Math.trunc(n)
  }
  function tick() {
    numbers.push(Math.random() * 100)
  }
  function toString() {
    return numbers.map(format)
  }
  n.counter = {
    tick,
    toString
  }
}(namespace))

const counter = namespace.counter
counter.tick()
counter.tick()
console.log(counter.toString())

/* Example 1
 *
 * This example shows that the local variables are not copied in the closure: the closure 
 * maintains a reference to the original variables themselves. It is as though the stack-frame
 * stays alive in memory even after the outer function exits.
 */
 function foo() {
    let x = 42
    let inner  = function() { console.log(x) }
    x = x+1
    return inner
  }
  var f = foo()
  f() // logs 43

 /* Example 2
  *
  * In the following code, three methods log, increment, and update all close over the same lexical environment.
  * And every time createObject is called, a new execution context (stack frame) is created and a completely new variable x, 
  * and a new set of functions (log etc.) are created, that close over this new variable.
  * */
 function createObject() {
    let x = 42;
    return {
      log() { console.log(x) },
      increment() { x++ },
      update(value) { x = value }
    }
  }
  
  const o = createObject()
  o.increment()
  o.log() // 43
  o.update(5)
  o.log() // 5
  const p = createObject()
  p.log() // 42

 /* Example 3
  *
  * If you are using variables declared using var, be careful you understand which variable you are closing over.
  * Variables declared using var are hoisted. This is much less of a problem in modern JavaScript due to the introduction of let and const.
  *
  * In the following code, each time around the loop, a new function inner is created, which closes over i. 
  * But because var i is hoisted outside the loop, all of these inner functions close over the same variable,
  * meaning that the final value of i (3) is printed, three times.
  */

function foo() {
    var result = []
    for (var i = 0; i < 3; i++) {
      result.push(function inner() { console.log(i) } )
    }
    return result
  }
  
  const result = foo()
  // The following will print `3`, three times...
  for (var i = 0; i < 3; i++) {
    result[i]() 
  }