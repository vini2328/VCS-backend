import RepoModel from "../models/newRepo.js";


const ReadRepo = async(req,res)=>{

    try {
        


        const result =await RepoModel.find()
        console.log(result)
        res.send({'status':200, 'msg': 'Successfully created', 'result': result})
    
        
    } catch (error) {
        res.send({'error': error})

    
        
    }


}
export default ReadRepo;