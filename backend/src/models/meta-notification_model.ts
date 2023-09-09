import { ObjectId } from "bson";
export class MetaNotification {
  notification_id: ObjectId;
  user_id: ObjectId;
  value?: string;
  shared_date?: Date;

  constructor(
    notification_id: ObjectId,
    user_id: ObjectId,
    value?: string,
    shared_date?: Date
  ) {
    notification_id = notification_id;
    user_id = user_id;
    value = value ? value : "";
    shared_date = shared_date ? shared_date : new Date();
  }
}
