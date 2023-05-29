import RepoModel from "../models/newRepo.js";


const userRepo = async (req,res)=>{
    let data = req.body
    try {
        const createRepo = new RepoModel({
            repositaryName :data.repositaryName,
            code : data.code,
            commit_msg : data.commit_msg,
            ownedby:data.ownedby
    
            
    
        })
        const result = await createRepo.save()
        res.send({'status':200, 'msg': 'Successfully created', 'result': result})
    
        
    } catch (error) {
        res.send({'error': error})
        
    }
}

export default userRepo;

