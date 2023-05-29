import RepoModel from "../models/newRepo.js";


const DeleteId = async(req,res)=>{
    let data=req.body

    try {
        

        let id = data.id
        console.log('idd',data)


        const result =await RepoModel.findByIdAndDelete(id)
        console.log('result',result)
        res.send({'status':200, 'msg': 'successfully deleted', 'result': result})
    
        
    } catch (error) {
        res.send({'status':400,'error': error})

    
        
    }


}
export default DeleteId;