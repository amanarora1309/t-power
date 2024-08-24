import express from 'express';
import { getAllFilesDataController, getFileDataBasedOnCondition, getFileDetailData, getReoprtData, getTodayFileEntryData, saveFileDataController, UpdateFileDataController } from '../controllers/FileDataController.js';

const app = express();
const router = express.Router();


router.post("/saveFileData", saveFileDataController);
router.post("/updateFileData", UpdateFileDataController);
router.get("/getAllFilesData", getAllFilesDataController);
router.post("/getFilterFiles", getFileDataBasedOnCondition);
router.post("/getFileDetailData", getFileDetailData);
router.post("/getReportData", getReoprtData);
router.get("/getTodayFileEntryData", getTodayFileEntryData);

export default router;