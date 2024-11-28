class apiResponse {

    statusCode:number;
    data:{} | null;
    message:string;

    constructor(statusCode:number,data:{},message="success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
    }
}
// const apiResponse = (statusCode,data,message)=>{
//     return (
//         {
//             statusCode:statusCode,
//             data:data,
//             message:message
//         }
//     )
// }
export {apiResponse}