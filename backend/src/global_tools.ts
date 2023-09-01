import { ObjectId } from "bson";

// creates specific string from date
// params:
// date (optional) - date that you want to convert to string (type == Date or string)
// returns string "dd/mm/yyyy, hh:mm:ss"
export function createFullDateString(date?: Date | string) {
  if (typeof date == "string") {
    return new Date(date).toLocaleString("en-GB");
  } else if (typeof date == "object") {
    return date.toLocaleString("en-GB");
  } else if (typeof date == "undefined") {
    return new Date().toLocaleString("en-GB");
  }
}

// turns dateString (format like in method above) to Date object
// params:
// str (optional) - string in format "dd/mm/yyyy, hh:mm:ss". passing Date is allowed, but it does nothing, just return the same Date object
// returns date object
export function createDateFromString(str?: string | Date) {
  if (typeof str == "string") {
    let strArr = str.split(",");
    let dateArr = strArr[0].split("/");
    let correctStr = "";
    for (let i = 2; i >= 0; i--) {
      correctStr += dateArr[i];
      if (i != 0) {
        correctStr += "-";
      }
    }
		if (typeof strArr[1] == "undefined"){
			strArr[1] = " 00:00:00";
		}
    correctStr += strArr[1];

    return new Date(correctStr);
  } else if (typeof str == "object"){
		// probably won't be used, but just in case
		return str;
	}
	else if (typeof str == "undefined") {
    // probably won't be used, but just in case
    return new Date();
  }
}

// creates specific string from date (without time)
// params:
// date (optional) - date that you want to convert to string (type == object (Date) or string)
// returns string "dd/mm/yyyy"
export function createDateString(date?: Date | string) {
  if (typeof date == "string") {
    return new Date(date).toLocaleDateString("en-GB");
  } else if (typeof date == "object") {
    return date.toLocaleDateString("en-GB");
  } else if (typeof date == "undefined") {
    return new Date().toLocaleDateString("en-GB");
  }
}

// creates specific string from date (time only)
// params:
// date (optional) - date that you want to convert to string (type == object (Date) or string)
// returns string "hh:mm:ss"
export function createTimeString(date?: Date | string) {
  if (typeof date == "string") {
    return new Date(date).toLocaleTimeString("en-GB");
  } else if (typeof date == "object") {
    return date.toLocaleTimeString("en-GB");
  } else if (typeof date == "undefined") {
    return new Date().toLocaleTimeString("en-GB");
  }
}

// compares date with string, checks if it's the same day (and time in case if added)
// this function just checks what do we want and then picks suitable function
// params:
// date - date object that we want to compare
// str - string in format "dd/mm/yyyy", "dd/mm/yyyy, hh:mm:ss" or "dd/mm/yyyyThh:mm:ss"
// returns true or false
export function compareDateWithString(date: Date, str: string){
	if(str.length == 10){
		return this.compareOnlyDateWithString(date, str);
	}else if(str.length == 19 || str.length == 20){
		return this.compareFullDateWithString(date, str);
	}
}


// compares date with string, checks if it's the same day
// params:
// date - date object that we want to compare
// str - string in format "dd/mm/yyyy"
// returns true or false
export function compareOnlyDateWithString(date: Date, str: string){
	let strDate = this.createDateString(date);
	if(str == strDate){
		return true;
	}
	return false;
}

// compares date with string, checks if it's the same day (and time)
// params:
// date - date object that we want to compare
// str - string in format "dd/mm/yyyy, hh:mm:ss" or "dd/mm/yyyyThh:mm:ss"
// returns true or false
export function compareFullDateWithString(date: Date, str: string){
	let strDate = '';
	switch(str.length){
		case 19:
			strDate = this.createDateString(date);
			strDate += 'T';
			strDate += this.createTimeString(date);
			break;
		case 20:
			strDate = this.createFullDateString(date);
			break;
	}
	if(str == strDate){
		return true;
	}
	return false;

}