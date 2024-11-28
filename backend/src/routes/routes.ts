import { Router } from "express";
import {handleCreateUser,handleLogin, handleUpload,handleUpdate,
    handleDelete,
    handleFetchOne,
    handleFetch,
  handleFetchUser} from "../controllers/controller";
import { upload } from "../middlewares/upload.middlewares";
import { authMiddleware } from "../middlewares/auth.middlewares";
const useRoutes = Router();

useRoutes.route('/createUser').post(handleCreateUser)
useRoutes.route('/login').post(handleLogin)


useRoutes.route('/upload').post(
    upload.fields([
        {
          name: "image",
          maxCount: 10,
        }
      ]),authMiddleware, handleUpload
)
useRoutes.route('/update').post(authMiddleware,handleUpdate)
useRoutes.route('/delete').post(authMiddleware,handleDelete)
useRoutes.route('/fetchOne').post(authMiddleware,handleFetchOne)
useRoutes.route('/fetch').post(authMiddleware,handleFetch)
useRoutes.route('/fetchUser').post(authMiddleware,handleFetchUser)

export {useRoutes}