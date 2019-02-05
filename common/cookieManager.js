let date = new Date();
const expiredTime = new Date(date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)));

module.exports = {

	setCookie(key,value){
		document.cookie = key + "=" + value + ";expires=" + expiredTime.toGMTString()
	},

	getCookie(key) {
	    var name = key + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	},

	deleteCookie(key){
		document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	},

		deleteAllCookies() {
	    var cookies = document.cookie.split(";");

	    for (var i = 0; i < cookies.length; i++) {
	        var cookie = cookies[i];
	        var eqPos = cookie.indexOf("=");
	        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }
	}
}


