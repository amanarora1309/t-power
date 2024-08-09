import FileData from '../models/FileData.js';
import bwipjs from 'bwip-js';
import fs from 'fs/promises';
import { Op } from 'sequelize';
import Tagging from '../models/tagging.js';
import Warehouse from '../models/warehouse.js';
import sequelize from '../utils/db.js';

export const saveFileDataController = async (req, res) => {
    const { CSA, noOfPages, typeOfRequest, dateOfApplication, barcode, collPoint } = req.body;
    const bcType = 'code128';

    if (!CSA) {
        return res.status(400).json({ success: false, message: 'CSA is required' });
    }
    if (!noOfPages) {
        return res.status(400).json({ success: false, message: 'No of pages is required' });
    }
    if (!typeOfRequest) {
        return res.status(400).json({ success: false, message: 'Type of request is required' });
    }
    if (!dateOfApplication) {
        return res.status(400).json({ success: false, message: 'Date of application is required' });
    }
    if (!barcode) {
        return res.status(400).json({ success: false, message: "barcode is required" });
    }
    if (!collPoint) {
        return res.status(400).json({ success: false, message: "collection point is required" });
    }

    try {



        let fileData = await FileData.findOne({ where: { barcode: barcode } });


        if (!fileData) {
            // Save the barcode CSA to the database
            try {
                fileData = await FileData.create({
                    CSA: CSA,
                    noOfPages: noOfPages,
                    typeOfRequest: typeOfRequest,
                    dateOfApplication: dateOfApplication,
                    barcode: barcode,
                    collectionPoint: collPoint,
                    createAt: Date.now()
                });
                return res.status(200).json({ success: true, message: "File Save Successfully" })
            } catch (error) {
                console.error('Error saving barcode to database:', error);
                return res.status(500).json({ success: false, message: 'Error in saving file' });
            }
        }


        return res.status(409).json({ success: false, message: "Barcode already exists" })


    } catch (error) {
        console.error('Error generating barcode:', error);
        res.status(500).json({ success: false, message: 'Error in saving file' });
    }
};
export const UpdateFileDataController = async (req, res) => {
    const { CSA, noOfPages, typeOfRequest, dateOfApplication, barcode, collPoint, selectedFileId } = req.body;

    if (!CSA) {
        return res.status(400).json({ success: false, message: 'CSA is required' });
    }
    if (!noOfPages) {
        return res.status(400).json({ success: false, message: 'No of pages is required' });
    }
    if (!typeOfRequest) {
        return res.status(400).json({ success: false, message: 'Type of request is required' });
    }
    if (!dateOfApplication) {
        return res.status(400).json({ success: false, message: 'Date of application is required' });
    }
    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Barcode is required' });
    }
    if (!collPoint) {
        return res.status(400).json({ success: false, message: 'Collection point is required' });
    }

    try {
        let fileData = await FileData.findOne({ where: { id: selectedFileId } });

        if (!fileData) {
            // Create a new record if it doesn't exist

            return res.status(404).json({ success: false, message: 'File not found' });
        } else {
            // Update the existing record
            await FileData.update({
                barcode,
                CSA,
                noOfPages,
                typeOfRequest,
                dateOfApplication,
                collectionPoint: collPoint,
                updateAt: new Date() // Use new Date() for current timestamp
            }, {
                where: { id: selectedFileId }
            });
            return res.status(200).json({ success: true, message: 'File updated successfully' });
        }
    } catch (error) {
        console.error('Error processing file data:', error);
        return res.status(500).json({ success: false, message: 'Error processing file data' });
    }
}

export const getAllFilesDataController = async (req, res) => {
    try {
        const result = await FileData.findAll();




        res.status(200).json({ success: true, message: "All files data", data: result });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ success: false, message: 'Error in fetching files', error });
    }
}


export const getFileDataBasedOnCondition = async (req, res) => {

    try {
        const { days } = req.body;

        // Calculate the date based on the number of days
        const daysInt = parseInt(days, 10);
        if (isNaN(daysInt)) {
            return res.status(400).json({ error: 'Invalid number of days' });
        }
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);

        const result = await FileData.findAll({
            where: {
                createdAt: {
                    [Op.gte]: dateThreshold
                }
            }
        });
        res.status(200).json({ success: true, message: "files based on the filter", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in fetching files', error });
    }
}

export const getFileDetailData = async (req, res) => {
    try {
        const { fileDataId } = req.body;

        const tagging = await Tagging.findAll({ where: { fileDataId: fileDataId } });

        const warehouse = await Warehouse.findAll({ where: { fileDataId: fileDataId } })

        res.status(200).json({ success: true, message: "Detail data", result: { tagging, warehouse } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in get data', error });
    }
}


export const getReoprtData = async (req, res) => {
    try {
        const fileData = await FileData.findAll({
            attributes: [
                'dateOfApplication',
                'collectionPoint',
                [sequelize.fn('COUNT', sequelize.col('id')), 'fileCount'],
                [sequelize.fn('SUM', sequelize.col('noOfPages')), 'totalPages']
            ],
            group: ['dateOfApplication', 'collectionPoint'],
            raw: true
        });

        // Process data to group by date
        const groupedData = fileData.reduce((acc, item) => {
            // Convert dateOfApplication to string if it's not
            const date = item.dateOfApplication instanceof Date
                ? item.dateOfApplication.toISOString().split('T')[0] // Format date as YYYY-MM-DD
                : new Date(item.dateOfApplication).toISOString().split('T')[0];

            if (!acc[date]) {
                acc[date] = {
                    Date: new Date(date),
                    collectionPoint: "",
                    files: 0,
                    totalPages: 0,
                    approved: false,
                    subData: []
                };
            }

            // Aggregate total files and pages for each date
            acc[date].files += parseInt(item.fileCount, 10);
            acc[date].totalPages += parseInt(item.totalPages, 10);

            // Add subData for each collection point
            const subDataEntry = acc[date].subData.find(sub => sub.collectionPoint === item.collectionPoint);
            if (subDataEntry) {
                subDataEntry.files += parseInt(item.fileCount, 10);
                subDataEntry.pages += parseInt(item.totalPages, 10);
            } else {
                acc[date].subData.push({
                    date: new Date(date),
                    collectionPoint: item.collectionPoint || "",
                    files: parseInt(item.fileCount, 10),
                    pages: parseInt(item.totalPages, 10),
                    priority: 'Normal',
                    approved: false
                });
            }

            return acc;
        }, {});

        // Convert the object to an array
        const result = Object.values(groupedData);
        // Send the formatted data as a response
        res.status(200).json({ success: true, message: "Reoprt Data", result: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in getting report data', error });
    }
}












