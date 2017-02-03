var Q = require('q');


/*
**  
@param object: is the object that needs to be iterated, can be an Object or an array
@param index: is the index of argument obtained from the object element and to be added to asyncFunc arguments, starting from 1
@param asyncFunc: is the asynchronous function that needs to be called at every iteration.    
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
		throw err;
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
		throw err;
	    });
    }
}



function asyncRun(asyncFunc, args){
    var def = Q.defer();
    Q.fcall(function(){
	return asyncFunc.apply(this, args)
    })
	.then(function(ret){
	    console.log(ret);
	    def.resolve(ret);
	});
    return def.promise;
}

//*example
var alert = function(i,n , m, p){
    var def = Q.defer();
    var t = i - n + m + p;
    if (t== 4){
	t = 0
    }
    console.log("time to wait is: "+  t);
    setTimeout(function(){
	def.resolve(t);
    }, t * 100);
    return def.promise;
};


//to run example iterate({toz: 1, boz: 2}, 2, alert, 1, 2, 3)
module.exports = iterate;
