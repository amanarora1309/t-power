import DocumentTypeData from "../models/DocumentTypeData.js";


export const saveDocumentTypeController = async (req, res) => {
    const { documentTypeName } = req.body;

    if (!documentTypeName) {
        return res.status(400).json({ success: false, message: 'name is required' });
    }

    try {

        let documentTypeData = await DocumentTypeData.create({
            name: documentTypeName
        })
        return res.status(200).json({ success: true, message: "Document Type Save Successfully" })
        // Save the barcode CSA to the database


    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in saving document type' });
    }
};

export const getDocumentsTypeController = async (req, res) => {
    try {
        const result = await DocumentTypeData.findAll();
        res.status(200).json({ success: true, message: "All Documents Types", data: result });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ success: false, message: 'Error in fetching document type', error });
    }
}