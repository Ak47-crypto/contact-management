import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { apiError } from "../utils/apiError";
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_KEY_SECREATE,
    secure: true
  });

const handleCloudinary = async (localFilePath:string[]) => {
    
    
  try {
    const uploadPromise = localFilePath?.map(async (filePath)=>{
    
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    if(response.url)
    fs.unlinkSync(filePath);
    return response.url;
})
const urls = await Promise.all(uploadPromise);
return urls
  } catch (err) {
    localFilePath.map((filePath)=>{
        fs.unlinkSync(filePath);
    })
    throw new apiError(500,"Something went wrong")
  }
};
export { handleCloudinary };
