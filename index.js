var Q = require('q');


/*
**  
@param [object | array] object: is the object that needs to be iterated, can be an Object or an array
@param [integer] index: is the index of argument obtained from the object element and to be added to asyncFunc arguments, starting from 1
@param [function] asyncFunc: is the asynchronous function that needs to be called at every iteration.    
**
*/
var iterate = function(object, index, asyncFunc /* 1...n args */){
    var item = null;
    var args = Array.prototype.slice.call(arguments, 3);
    if(Object.prototype.toString.call(object) === "[object Array]"){
	asyncIterateArray(object, 0, asyncFunc, args, index);
    }else if(Object.prototype.toString.call(object) === "[object Object]"){
	asyncIterateObjectKeys(object, 0, asyncFunc, args, index);
    }
}


function asyncIterateObjectKeys(object, i, func, args, index){
    var keys = Object.keys(object);
    if( i < keys.length){
	var tmpargs = args.slice();
	tmpargs.splice(index - 1, 0, object[keys[i]]);
	Q.fcall(asyncRun, func, tmpargs)
	    .then(function() {
		asyncIterateObjectKeys(object, i = i+ 1, func, args, index);
	    })
	    .catch(function(err){
		console.log(err);
	    });
    }
}



function asyncIterateArray(object, i, func, args, index){
    if(i < object.length){
	var tmpargs = args.slice();
	tmpargs.splice(index - 1, 0, object[i]);
	Q.fcall(asyncRun, func, tmpargs)
	    .then(function() {
		asyncIterateArray(object, i = i+ 1, func, args, index);
	    })
	    .catch(function(err){
		console.log(err);
	    });
    }
}



function asyncRun(asyncFunc, args){
    var def = Q.defer();
    Q.fcall(function(){
	return asyncFunc.apply(this, args)
    })
	.then(function(ret){
	    def.resolve(ret);
	})
	.catch(function(err){
	    def.reject(err);
	});
    return def.promise;
}


module.exports = iterate;
