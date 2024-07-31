import express from 'express';
import { deleteDirectoryController, deletePdfController, getDetailsController } from '../controllers/MaintainanceController.js';

const app = express();
const router = express.Router();


router.post("/deleteDirectory", deleteDirectoryController);
router.post("/deletePdf", deletePdfController);
router.post("/getDetail", getDetailsController);

export default router;