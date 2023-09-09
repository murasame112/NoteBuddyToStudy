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
    this.notification_id = notification_id;
    this.user_id = user_id;
    this.value = value ? value : "";
    this.shared_date = shared_date ? shared_date : new Date();
  }
}
