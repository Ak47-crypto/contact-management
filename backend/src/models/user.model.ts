import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  checkPassword:(password:string)=>{};
  accessTokenMethod:()=>{}
}
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save',async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
})
UserSchema.method("checkPassword", async function (enteredPassword:string) {
    const result = await bcrypt.compare(enteredPassword, this.password);
    return result;
  });

  UserSchema.method("accessTokenMethod", function () {
    const payload = {
      _id: this._id,
      name: this.name,
      email: this.email,
    };
    return jwt.sign(payload, process.env.ACCESSTOKEN_KEY as string, {
      expiresIn: process.env.ACCESSTOKEN_EXP,
    });
  });

export default mongoose.model<IUser>("User", UserSchema);


