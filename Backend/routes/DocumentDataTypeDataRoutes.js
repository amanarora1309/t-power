import express from 'express';
import { getAllFilesDataController, getFileDataBasedOnCondition, getFileDetailData, saveFileDataController } from '../controllers/FileDataController.js';
import { getDocumentsTypeController, saveDocumentTypeController } from '../controllers/DocumentTypeDataController.js';

const app = express();
const router = express.Router();


router.post("/saveDocumentType", saveDocumentTypeController);
router.get("/getDocumentTypes", getDocumentsTypeController);

export default router;