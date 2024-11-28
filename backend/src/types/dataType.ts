import { Schema } from "mongoose";
export interface IDataUser{
    
    matchName:string;
    team:string[];
    innings:number;
    venue:string;
    date:Date;
    
}

export interface IDataTeam{
    data:{
        name:string;
        players:[]
    }
}

export interface IDataBall{
    runs:number;
    extras:{
        wide: boolean;
        noBall: boolean;
        byes: boolean;
        legByes: boolean;
        overthrow: boolean;
    }
    isLegal:boolean;
    wicket:boolean;
    batsman:Schema.Types.ObjectId;
    bowler:Schema.Types.ObjectId;
    match:Schema.Types.ObjectId;
}
