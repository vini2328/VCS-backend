import RepoModel from "../models/newRepo.js";


const UpdateRepo = async(req,res)=>{
    let data=req.body

    try {
        

        console.log(data)
        let id = data.id
        let repositaryName = data.repositaryName
        let code = data.code
        let commit_msg = data.commit_msg

        const result =await RepoModel.findByIdAndUpdate(id,{repositaryName, code,commit_msg})
        console.log('dfdfdf',result)
        res.send({'status':200, 'msg': 'success', 'result': result})
    
        
    } catch (error) {
        res.send({'status':400,'error': error})

    
        
    }


}
export default UpdateRepo;