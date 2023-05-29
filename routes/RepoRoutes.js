import express from "express";
const router= express.Router();
import userRepo from '../controllers/userRepo.js'
import ReadRepo from '../controllers/ReadRepo.js'
import RepoByiD from "../controllers/RepoByID.js";
import UpdateRepo from "../controllers/UpdateRepo.js";
import DeleteId from "../controllers/DeleteId.js";



router.post('/createRepo',userRepo)
router.post('/seeAllRepos',ReadRepo)
router.post('/seeRepo',RepoByiD)
router.put('/update',UpdateRepo)
router.post('/delete',DeleteId)





export default router