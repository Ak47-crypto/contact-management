import 'dotenv/config'
import connecDb from './db/index.db'
import { app } from './app'
connecDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{console.log("Server Connected")})
})
.catch((err)=>{
    console.log("Error in server connection",err)
})