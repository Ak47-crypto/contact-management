import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { IUser } from "../models/user.model";
import User from "../models/user.model";
import Contact from "../models/contact.model";
import mongoose from "mongoose";
import { handleCloudinary } from "../utils/cloudinary";

const handleCreateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    console.log(data);
    
    const { userData } = data;
    console.log(userData);
    
    if (!data) throw new apiError(400, "No data provided");
    const isUserExist = await User.findOne({ email: userData?.email });
    if (isUserExist) throw new apiError(400, "User already exist");
    const user = new User({
      name: userData?.name,
      email: userData?.email,
      password: userData?.password,
    });
    const userResponse = await user.save();
    userResponse.password = "";
    res
      .status(201)
      .json(new apiResponse(201, userResponse, "User created successfully"));
  }
);

// Login
const handleLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // user enter email
    // check against the entered email if user already exist or not
    // check password is correct or not
    // generate accesstoken
    // send token

    const { data } = req.body;
    const {loginData}=data;
    if (!data) throw new apiError(400, "No data provided");
      const user = await User.findOne({ email: loginData.email });
      if (!user) throw new apiError(400, "User not exist");
     
    const checkPassword = await user.checkPassword(loginData.password);
    if (!checkPassword) throw new apiError(400, "Invalid credentials");
    const accessToken = user.accessTokenMethod();

    user.password = "";
    res
      .status(200)
      .json(
        new apiResponse(200, { user, accessToken }, "Logged in successfully")
      );
  }
);
// upload
const handleUpload = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { data} = req.body;
    const {contactData}=data
    
    if ( !contactData) throw new apiError(400, "No data provided");
    const isExist = await Contact.findOne({
      $and:[{owner:req.user._id},{phone:contactData.phone}]
    })
    if(isExist) throw new apiError(200,"Number already saved")
    const contact = new Contact({
      name:contactData.name,
      phone:contactData.phone,
      email:contactData.email,
      owner: req.user._id,
    });
    const contactResponse = await contact.save();
    res
      .status(201)
      .json(new apiResponse(201, {contactData:contactResponse}, "Contact created"));
  }
);

// Update
const handleUpdate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { contactData } = data;
    if (!data || !contactData) throw new apiError(400, "No data provided");
    const phoneRegix = /^\d{10}$/;
    if(!phoneRegix.test(contactData.phone)) throw new apiError(400,"Phone number must be 10 digits")
    const contact = await Contact.findByIdAndUpdate(
      contactData._id,
      {
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
      },
      { new: true,
        runValidators: true
       },
      
    );
    if (!contact) throw new apiError(400, "contact not exist");
    res.status(200).json(new apiResponse(200, { contact }, "Updated"));
  }
);

// Delete
const handleDelete = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { contactData } = data;
    if (!data || !contactData) throw new apiError(400, "No data provided");
    const contact = await Contact.findByIdAndDelete(contactData._id);
    if (!contact) throw new apiError(400, "contact not exist");
    res.status(200).json(new apiResponse(200, {contact}, "Deleted"));
  }
);

// Fetch contact detail single
const handleFetchOne = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    const { contactData } = data;
    if (!data || !contactData) throw new apiError(400, "No data provided");
    const contact = await Contact.findById(contactData._id);
    if (!contact) throw new apiError(400, "contact not exist");
    res.status(201).json(new apiResponse(200, contact, "Fetched"));
  }
);

// fetch all
const handleFetch = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { user } = req;
    
    
    const contact = await Contact.find({ owner: user._id });
    
    
    if (!contact.length) throw new apiError(400, "contact not exist");
    res.status(200).json(new apiResponse(200, {contact}, "Fetched"));
  }
);

// fetch user
const handleFetchUser = asyncHandler(async(req:any,res:Response,next:NextFunction)=>{
  const user = await User.findById({_id:req.user._id})
  
  if(!user) throw new apiError(400,"No user found")
    user.password=""
    res.status(200).json(new apiResponse(200, {user}, "Fetched"));
})

export {
  handleCreateUser,
  handleLogin,
  handleUpload,
  handleUpdate,
  handleDelete,
  handleFetchOne,
  handleFetch,
  handleFetchUser
};
