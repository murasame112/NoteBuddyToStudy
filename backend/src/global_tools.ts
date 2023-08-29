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
