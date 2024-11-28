import express from "express";
import cors from "cors";
import path from 'path'
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use('/api/docs',express.static(path.join(__dirname, 'public')))
app.use(
  cors({
    origin: "*",
  })
);

// routes import
import { useRoutes } from "./routes/routes";
import { apiError } from "./utils/apiError";
app.use("/api",useRoutes)

app.use((err:any, req:any, res:any, next:any) => {
  if (err instanceof apiError) {
    
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
      errors: err.errors,
    });
  }

  
  console.log(err);
  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export  {app}