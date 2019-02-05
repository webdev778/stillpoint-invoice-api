
/** Method for validate email address **/
export const emailValidation = (email) => {
	//regex for a valid email 
	const EMAIL_REGEXP = /^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/;
	console.log(email.trim(),!!email && EMAIL_REGEXP.test(email.trim()))
	return (!!email && EMAIL_REGEXP.test(email.trim()));
}

/** Method for validate password **/
export const passwordValidation = (password) => {
	const PASSWORD_REGEXP = /^(?=.{8,})(?=.*[a-zA-Z0-9!@#$%^&*()]).*$/;
	if(!!password && PASSWORD_REGEXP.test(password)){
		var count = 1, counter = 1;
		for(var i=0; i<password.length; i++){
			if(password[i] == password[i+1]){
				count++;
			}else{
				if(Math.abs(password.charCodeAt(i+1) - password.charCodeAt(i)) === 1){
					counter++;
				}else{
					return true;
				}
			
			}

			if(count == password.length || counter == password.length){
				return false;
			}
		}
	}else{
		return false;
	}
} 


/** Method for check text string only having alphabets and - **/
export const alphaWithDashOnly = (text) => {
	//regex for a alphabets only
	const ALPHA_REGEXP = /^[a-zA-Z -]+$/;
	if(!!text && ALPHA_REGEXP.test(text)){
		return true;
	}else{
		return false;
	}
}

/** Method for check text string only having alphabets **/
export const alphaOnly = (text) => {
	//regex for a alphabets only
	const ALPHA_REGEXP = /^[a-zA-Z ]+$/;
	if(!!text && ALPHA_REGEXP.test(text)){
		return true;
	}else{
		return false;
	}
}

/** Method for check text string have a valid website url **/
export const websiteValidation = (text) => {
	//regex for a valid url
	const URL_REGEXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	console.log(text,URL_REGEXP.test(text), !!text && URL_REGEXP.test(text));
	if(!!text && URL_REGEXP.test(text)){
		console.log("here");
		return true;
	}else{
		console.log("else")
		return false;
	}
}


/** Method for validate linkedin link **/
export const linkedinLinkValidation = (link, mandate) => {
	link = link.toLowerCase();
	if(mandate){
		if(!!link && link.indexOf('linkedin') >= 0){
			return true;
		}else{
			return false;
		}
	}else{
		if(!!link){
			if(link.indexOf('linkedin') >= 0){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
}


/** Method for maximun text limit **/
export const maxLength = (text, length, mandate) => {
	// console.log(text, length)
	text = text.toString();
	return mandate ? (!!text && text.length <= length) : (!text || text.length <= length);
	// if(mandate){
	// 	if(!!text && text.length <= length){
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// }else{
	// 	if(!!text){
	// 		if(text.length <= length){
	// 			return true;
	// 		}else{
	// 			return false;
	// 		}
	// 	}else{
	// 		return true;
	// 	}
	// }
}


/** Method for minimum text limit **/
export const minLength = (text, length , mandate) => {
	text = text.toString();
	//console.log(text, length)
	if(mandate){
		if(!!text && text.length >= length){
			return true;
		}else{
			return false;
		}
	}else{
		if(!!text){
			if(text.length >= length){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
}


