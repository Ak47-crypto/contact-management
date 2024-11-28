import { Request,Response,NextFunction } from "express"

function asyncHandler (fn:(req: Request, res: Response, next: NextFunction) => Promise<any>){
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(err=>next(err))
    }
}
export {asyncHandler}