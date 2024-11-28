import MatchModel from "../models/match.model";
import BallModel from "../models/ball.model";
const updateMatchDetails = async (matchId: string): Promise<number> => {
    
    const findBall = await BallModel.find({
        match:matchId
    })
    const deliveryUpdate=findBall?.length;
    const ballUpdate=findBall.filter((obj)=>obj.isLegal!=false)?.length
    let runUpdate=0;
    findBall?.map((obj)=>{
        runUpdate+=obj.runs
    })
    const findMatch = await MatchModel.findByIdAndUpdate(matchId,
        {
            runs:runUpdate,
            delivery:deliveryUpdate,
            ball:ballUpdate
        },
        {
            new:true,
            runValidators:true
        }
    )
    if(findMatch){
        return 1
    }
    else return 0;
};
export default updateMatchDetails;
