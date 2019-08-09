/**
 * 公共方法
 * 1.ajax:封装拦截状态码
 * 2.encode:登录加密（password）
 * **/


(function(w){
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	 }
	if (!Array.prototype.map) {
		Array.prototype.map = function(callback, thisArg) {
	
			var T, A, k;
	
			if (this == null) {
				throw new TypeError(" this is null or not defined");
			}
	
			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);
	
			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;
	
			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
				throw new TypeError(callback + " is not a function");
			}
	
			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (thisArg) {
				T = thisArg;
			}
	
			// 6. Let A be a new array created as if by the expression new Array(len) where Array is
			// the standard built-in constructor with that name and len is the value of len.
			A = new Array(len);
	
			// 7. Let k be 0
			k = 0;
	
			// 8. Repeat, while k < len
			while(k < len) {
	
				var kValue, mappedValue;
	
				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {
	
					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[ k ];
	
					// ii. Let mappedValue be the result of calling the Call internal method of callback
					// with T as the this value and argument list containing kValue, k, and O.
					mappedValue = callback.call(T, kValue, k, O);
	
					// iii. Call the DefineOwnProperty internal method of A with arguments
					// Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
					// and false.
	
					// In browsers that support Object.defineProperty, use the following:
					// Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
	
					// For best browser support, use the following:
					A[ k ] = mappedValue;
				}
				// d. Increase k by 1.
				k++;
			}
	
			// 9. return A
			return A;
		};
	}
	var common = {
		type : "common",
		//封装的ajax
		ajax:function(method,url,json,callback,error){
			var self = this;
			var opt = Array.prototype.concat.apply([],arguments);
			var baseurl = "";
			opt = opt[0];
			$.ajax({
				type:opt.type,
				url:baseurl+opt.url,
				data:opt.data||null,
				success:function(data){
					var res = JSON.parse(data);
					if(res.code === "302"){
						window.Message("error",res.message,function(){
							window.location.href = window.location.origin + "/login";
						})
					}else{
						opt.success(data);
					}
				},
				error:function(res){
				}
			})
		},
		//清楚用户信息
		cleanUserINfo:function(){
			localStorage.removeItem("userInfo");
		},
		//登录密码加密密钥
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		//加密登录密码
		encode: function(e) { 
			var t = "";
			var n, r, i, s, o, u, a;
			var f = 0;
			e = this._utf8_encode(e);
			while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
			u = a = 64
			} else if (isNaN(i)) {
			a = 64
			}
			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
			}
			return t
		},
		//解密
		decode: function(e) {
			var t = "";
			var n, r, i;
			var s, o, u, a;
			var f = 0;
			e=e.replace(/[^A-Za-z0-9+/=]/g,"");
			while (f < e.length) {
			 s = this._keyStr.indexOf(e.charAt(f++));
			 o = this._keyStr.indexOf(e.charAt(f++));
			 u = this._keyStr.indexOf(e.charAt(f++));
			 a = this._keyStr.indexOf(e.charAt(f++));
			 n = s << 2 | o >> 4;
			 r = (o & 15) << 4 | u >> 2;
			 i = (u & 3) << 6 | a;
			 t = t + String.fromCharCode(n);
			 if (u != 64) {
			  t = t + String.fromCharCode(r)
			 }
			 if (a != 64) {
			  t = t + String.fromCharCode(i)
			 }
			}
			t = this._utf8_decode(t);
			return t
		},
		_utf8_encode: function(e) {
			e = e.replace(/rn/g, "n");
			var t = "";
			for (var n = 0; n < e.length; n++) {
			 var r = e.charCodeAt(n);
			 if (r < 128) {
			  t += String.fromCharCode(r)
			 } else if (r > 127 && r < 2048) {
			  t += String.fromCharCode(r >> 6 | 192);
			  t += String.fromCharCode(r & 63 | 128)
			 } else {
			  t += String.fromCharCode(r >> 12 | 224);
			  t += String.fromCharCode(r >> 6 & 63 | 128);
			  t += String.fromCharCode(r & 63 | 128)
			 }
			}
			return t
		   },
		   _utf8_decode: function(e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
			 r = e.charCodeAt(n);
			 if (r < 128) {
			  t += String.fromCharCode(r);
			  n++
			 } else if (r > 191 && r < 224) {
			  c2 = e.charCodeAt(n + 1);
			  t += String.fromCharCode((r & 31) << 6 | c2 & 63);
			  n += 2
			 } else {
			  c2 = e.charCodeAt(n + 1);
			  c3 = e.charCodeAt(n + 2);
			  t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
			  n += 3
			 }
			}
			return t
		   },
		/** 
		 * 获取指定的URL参数值 
		 * 参数：paramName URL参数 
		 * 调用方法:getParam("name") 
		 * 返回值: 
		 */ 
		getParam:function(paramName) { 
			paramValue = "", isFound = !1; 
			if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) { 
				arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0; 
				while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
			} 
			return paramValue == "" && (paramValue = null), paramValue 
		},
		/** 
		 * 格式化日期 
		 * 参数：inputTime 日期参数参数
		 * 注释：假如需要年月日：yyyy-MM-dd 要加时分秒 yyyy-MM-dd hh:mm:ss
		 * 调用方法:getParam("name") 
		 * 返回值:tyler 
		 */ 
		 formatDateTime: function (inputTime,type) {
			var date = "";
			if(inputTime.toString().length === 10){
				date = new Date(inputTime * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			}else{
				date = new Date(inputTime);
			}
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
			if(type){
				if(type === "yyyy-MM-dd"){
					return y + '-' + m + '-' + d;
				}else{
					return y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second;
				}
			}else{
				return y + '-' + m + '-' + d;
			}
        }  
	}

	if(w._ && w._["type"]!="common"){
		w._common = common
	}else{
		w._ = common
	}

})(window)