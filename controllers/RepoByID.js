import RepoModel from "../models/newRepo.js";


const RepoByiD = async(req,res)=>{
    let data=req.body

    try {
        

        console.log(data)
        const result =await RepoModel.findById(data.id)
        console.log('dfdfdf',result)
        res.send({'status':200, 'msg': 'success', 'result': result})
    
        
    } catch (error) {
        res.send({'status':400,'error': error})

    
        
    }


}
export default RepoByiD;