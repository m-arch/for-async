# for-async
No it's not for looping items and returning the result when the looping is done. It is for looping over an object or an array and waiting for each of the elements to finish computation before iterating over second element.


## Installation

npm install for-async-i

## Usage
forAsync takes the object or the array that needs to be looped over, the index at wich the object items needs to be passed and the function with it's argument in the format: 
forAsync(obj, index, function, arguments..n)
with:
@param obj of type array or object,
@param index of type integer,
@param function of type function,
@param arguments could be of any type, even callback function.

## example of usage

```js
var forAsync = require('for-async-i');

var alert = function(l, m, n, o){
    var def = Q.defer();
    
    var t = m - (l + n + o);
   
    console.log("time to wait is: "+  t + " seconds");
    setTimeout(function(){
    	console.log(t);
		def.resolve(t);
    }, t * 1000);
    return def.promise;
}

forAsync({foo: 8, bar: 6}, 2, alert, 1,2,3);
```
would output the following:
> time to wait is: 2 seconds

> 2

> time to wait is: 0 seconds

>0


## example of usage for creating SQL tables 
supposing tables contains the list of tables we need to create in order, and the function has an error callback.

```js
var query = Q.nbind(connection.query, connection) //this would avid rainsing TypeError: cannot read property ...
forAsync(tables, 1, query, (error) => {
  if(err) console.log(error.stack)
 });
```
