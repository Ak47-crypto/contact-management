import multer from "multer";
import { tmpdir } from 'os';
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,tmpdir())
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
export const upload = multer({storage})