import { ObjectId } from "bson";

export function createDateString(date?: Date) {
  if (typeof date !== "undefined") {
    return new Date(date).toLocaleString("en-GB");
  } else {
    return new Date().toLocaleString("en-GB");
  }
}

export function createDate(str?: string) {
  if (typeof str !== "undefined") {
    let strArr = str.split(",");
    let dateArr = strArr[0].split("/");
    let correctStr = "";
    for (let i = 2; i >= 0; i--) {
      correctStr += dateArr[i];
      if (i != 0) {
        correctStr += "-";
      }
    }
    correctStr += strArr[1];

    return new Date(correctStr);
  } else {
    // probably won't be used, but just in case
    return new Date();
  }
}
