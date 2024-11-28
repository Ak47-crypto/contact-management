import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  phone: string;
  email:string;
  owner: Schema.Types.ObjectId;
}
const ContactSchema: Schema<IContact> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone number must be a 10-digit number']
    },
    email:{
      type:String,
      required:true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
