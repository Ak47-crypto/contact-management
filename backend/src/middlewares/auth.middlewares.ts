import User  from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
interface IJwt{
    _id: string;
      name: string
      email: string
}
const authMiddleware = asyncHandler(async (req:any, res, next) => {
  try {
    const {token} = req.body;
    console.log(token);
    
    if ( !token) throw new apiError(401, "Unauthorized");
    const verified:any = await jwt.verify( token, process.env.ACCESSTOKEN_KEY as string);
    if (!verified) throw new apiError(401, "Unauthorized");
    const user = await User.findById(verified._id).select(
      "-password"
    );
    if (!user) throw new apiError(400, "Invalid token");
    req.user = user;
    next();
  } catch (err:any) {
    console.log(err);
    throw new apiError(500, err?.message || "Internal Server Error");
  }
});
export { authMiddleware };
