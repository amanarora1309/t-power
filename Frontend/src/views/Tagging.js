
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardHeader, Container, Row, Col } from "reactstrap";
import axios from "axios";
import { post } from "helper/api_helper";
import { genrateBarcode } from "helper/barcode_helper";
import jsPDF from 'jspdf';
import { getAllBarcodes } from "helper/barcode_helper";
import { toast } from "react-toastify";
import Select from "react-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Loader from "components/Loader/Loader";
import { createPdfFromImages } from "helper/tagging_helper";
import { getAllFilesData } from "helper/fileData_helper";
import { DOWNLOAD_ZIP_FILE } from "helper/url_helper";
import { EXTRACT_PDF } from "helper/url_helper";





const Tagging = () => {
    const [CSANumber, setCSANumber] = useState("");
    const [selectedCSA, setSelectedCSA] = useState("");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [file, setFile] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [fileData, setfileData] = useState([]);
    const [CSAData, setCSAData] = useState([]);
    const [pageCheck, setPageCheck] = useState(true);
    const [totalPages, setTotalPages] = useState("");
    const [pagesDataCount, setPagesDataCount] = useState([]);
    const [pageCount, setPageCount] = useState("");
    const [errors, setErrors] = useState({});
    const [documentType, SetDocumentType] = useState({});
    const [loader, setLoader] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedBarcode, setSelectedBarcode] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [date, setDate] = useState("");

    const fileInputRef = useRef(null);
    const getAllFiles = async () => {
        try {
            const data = await getAllFilesData();
            if (data?.success) {
                setCSAData(data?.data)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        getAllFiles();

    }, []);


    // const documentsData = [
    //     { id: 1, name: "RF (New Requisition Form)" },
    //     { id: 2, name: "RFNC (RF Name Change)" },
    //     { id: 3, name: "RFRE (RF Reconnection)" },
    //     { id: 4, name: "RFSH (RF Shifting)" },
    //     { id: 5, name: "TR (Test Report)" },
    //     { id: 6, name: "SR (Solar Requisition)" },
    //     { id: 7, name: "RFEX (RF Ext)" },
    //     { id: 8, name: "RENT (Rent Receipt &/ Rent Agreement)" },
    //     { id: 9, name: "ATS (Agreement to Sale (Banakhat))" },
    //     { id: 10, name: "TXBL (Tax Bill)" },
    //     { id: 11, name: "IB (Indemnity Bond)" },
    //     { id: 12, name: "712FL (7/12 Copy)" },
    //     { id: 13, name: "ELEC (Election Card)" },
    //     { id: 14, name: "INDEX (Index Copy)" },
    //     { id: 15, name: "RATCD (Ration Card)" },
    //     { id: 16, name: "PANP (Pan Card)" },
    //     { id: 17, name: "PANCO (Pan card - Company)" },
    //     { id: 18, name: "ADHAR (ADHAR CARD)" },
    //     { id: 19, name: "PHID (PHOTO ID BY ANY GOVT AGENCY)" },
    //     { id: 20, name: "PASS (PASSPORT)" },
    //     { id: 21, name: "PA (Power off Attorney)" },
    //     { id: 22, name: "DRLEC (DRIVING LICENCE)" },
    //     { id: 23, name: "SBA (Statement of Bank Account)" },
    //     { id: 24, name: "STN (Sales Tax Number)" },
    //     { id: 25, name: "DTHCR (Death Certificate)" },
    //     { id: 26, name: "ROC (Certificate from Reg of companies)" },
    //     { id: 27, name: "MACERT (MARRIAGE CERTIFICATE)" },
    //     { id: 28, name: "SHCERT (SHARE CERTIFICATE)" },
    //     { id: 29, name: "LEASE (Lease Deed)" },
    //     { id: 30, name: "PARTD (Partnership deed)" },
    //     { id: 31, name: "SLDD (Sale Deed)" },
    //     { id: 32, name: "TRUST (Trust Deed)" },
    //     { id: 33, name: "PANLT (Panchayat Letter)" },
    //     { id: 34, name: "POSLT (Possession Letter)" },
    //     { id: 35, name: "RTGS (RTGS Form)" },
    //     { id: 36, name: "6AVF (6A Copy (Hakk Patrak))" },
    //     { id: 37, name: "BANK (BANK DETAILS)" },
    //     { id: 38, name: "MOA (Memo. Of Assoc.)" },
    //     { id: 39, name: "OTH (Others)" },
    //     { id: 40, name: "NOC (NOC)" },
    //     { id: 41, name: "PLAN (Plan of Premises)" },
    //     { id: 42, name: "LPLAN (Layout plan)" },
    // ];

    const documentsData = [
        { id: 1, name: "RF (New Requisition Form)" },
        { id: 2, name: "RFNC (RF Name Change)" },
        { id: 3, name: "SR (Solar Requisition)" },
        { id: 4, name: "PDCRF (Service Removal RF)" },
        { id: 5, name: "TR (Test Report)" },
        { id: 6, name: "SACH (Safety Challan)" },
        { id: 7, name: "DESNOC (DES NOC)" },
        { id: 8, name: "DICNOC (DIC NOC)" },
        { id: 9, name: "FIRENOC (FIRE NOC)" },
        { id: 10, name: "FIRC (Police FIR)" },
        { id: 11, name: "RENTA (Rent Receipt & Rent Agreement)" },
        { id: 12, name: "ATS (Agreement to Sale)" },
        { id: 13, name: "ANNASS (Agra Nagar Nigam Assessment)" },
        { id: 14, name: "IB (Indemnity Bond-New Connection)" },
        { id: 15, name: "IBNC (Indemnity Bond-Name Change)" },
        { id: 16, name: "ELEC (Election Card/Voter Card)" },
        { id: 17, name: "RATCD (Ration Card)" },
        { id: 18, name: "PANP (Pan Card)" },
        { id: 19, name: "PANCO (Pan card - Company)" },
        { id: 20, name: "ADHAR (ADHAR CARD)" },
        { id: 21, name: "PHID (PHOTO ID BY ANY GOVT AGENCY)" },
        { id: 22, name: "PASS (PASSPORT)" },
        { id: 23, name: "POA (Power off Attorney)" },
        { id: 24, name: "DRLEC (DRIVING LICENCE)" },
        { id: 25, name: "SBA (Statement of Bank Account)" },
        { id: 26, name: "STN (Sales Tax Number)" },
        { id: 27, name: "GSTD (GST Declaration)" },
        { id: 28, name: "GSTIN (GST Identification No.)" },
        { id: 29, name: "DTHCR (Death Certificate)" },
        { id: 30, name: "SUCCDE (SUCCESSION DEED)" },
        { id: 31, name: "LEGLHIE (Legal Hiership)" },
        { id: 32, name: "BORES (Board Resolution)" },
        { id: 33, name: "ROC (Certificate from Reg of companies)" },
        { id: 34, name: "MACERT (MARRIAGE CERTIFICATE)" },
        { id: 35, name: "LEASE (Lease Deed)" },
        { id: 36, name: "PARTD (Partnership deed)" },
        { id: 37, name: "SLDD (Sale Deed)" },
        { id: 38, name: "GFTDD (Gift Deed)" },
        { id: 39, name: "COMPLH (Company Letter Head)" },
        { id: 40, name: "CORRDD (Correction Deed)" },
        { id: 41, name: "TRUST (Trust Deed)" },
        { id: 42, name: "PANLT (Panchayat Letter)" },
        { id: 43, name: "POSLT (Possession Letter)" },
        { id: 44, name: "RTGS (RTGS Form)" },
        { id: 45, name: "BANK (BANK DETAILS)" },
        { id: 46, name: "MOA (Memo. Of Assoc.)" },
        { id: 47, name: "AOA (Article of Assoc)" },
        { id: 48, name: "COI (Certificate of Incorporation)" },
        { id: 49, name: "OTH (Others)" },
        { id: 50, name: "NOCLL (NOC OF LANDLORD)" },
        { id: 51, name: "NOCCO (NOC OF CO-OWNER)" },
        { id: 52, name: "PLAN (Plan of Premises)" },
        { id: 53, name: "LPLAN (Layout plan)" },
        { id: 54, name: "BANKPA (BANK PASSBOOK)" },
        { id: 55, name: "CANCH (CANCELLED CHEQUE)" },
        { id: 56, name: "AFFID (AFFIDAVIT)" },
        { id: 57, name: "KHATA (KHATAUNI)" },
        { id: 58, name: "ALLTLT (ALLOTMENT LETTER)" },
        { id: 59, name: "ADADEC (ADA MAP DECLARATION)" },
        { id: 60, name: "NILDUE (Nill Dues AFFIDAVIT on 10rs Stamp Paper For Temporary Connection)" },
        { id: 61, name: "DOMC (DOMICILE CERTIFICATE)" },
        { id: 62, name: "TAXR (House Tax Receipt)" },
        { id: 63, name: "WILL (WILL)" },
        { id: 64, name: "CHKLT (Checklist)" },
        { id: 65, name: "PB (Personal Bond)" },
        { id: 66, name: "HEAVLOAAGR (Agreement of Supply-(Heavy Load Agreement))" },
    ];



    const handleSelectCSA = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
    };

    const handleBarcodeChange = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
    }

    


    const addPageData = () => {
        setPagesDataCount([...pagesDataCount, { from: '', to: '', documentType: null }]); // Adding an empty object as a placeholder
    };

    const handleInputChange = (index, field, value) => {
        const newPagesDataCount = [...pagesDataCount];
        newPagesDataCount[index][field] = value;
        setPagesDataCount(newPagesDataCount);
    };

    const validateInputs = () => {
        const newErrors = {};

        pagesDataCount.forEach((data, index) => {
            if (data.from <= 0) {
                newErrors[index] = { ...newErrors[index], from: 'From must be greater than 0' };
            } else if (index > 0 && data.from <= pagesDataCount[index - 1].to) {
                newErrors[index] = { ...newErrors[index], from: 'From must be greater than previous To' };
            } else if (data.from > pageCount) {
                newErrors[index] = { ...newErrors[index], from: `From must be less than or equal to ${pageCount}` };
            }

            if (data.to <= 0) {
                newErrors[index] = { ...newErrors[index], to: 'To must be greater than 0' };
            } else if (data.to <= data.from) {
                newErrors[index] = { ...newErrors[index], to: 'To must be greater than From' };
            } else if (index < pagesDataCount.length - 1 && data.to >= pagesDataCount[index + 1].from) {
                newErrors[index] = { ...newErrors[index], to: 'To must be less than next From' };
            } else if (data.to > pageCount) {
                newErrors[index] = { ...newErrors[index], to: `To must be less than or equal to ${pageCount}` };
            }

            if (!data.documentType) {
                newErrors[index] = { ...newErrors[index], documentType: 'This field is required' };
            }
        });

        setErrors(newErrors);
        console.log(errors)
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        try {
            const imageNames = selectedImages;
            const csa = selectedCSA.CSA;
            const document = documentType.name
            const fileDataId = selectedCSA.id;
            setLoader(true);
            console.log(selectedCSA)
            const data = await createPdfFromImages({ imageNames, document, csa, fileDataId });
            setLoader(false);
            if (data?.success) {
                toast.success(data?.message);
                SetDocumentType(null);
                removeSelectedImages();
            }
            else {
                toast.error(data?.message);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
            setLoader(false);
            toast.error(error?.response?.data?.message);
        }

    };


    const removeSelectedImages = () => {
        setImages(images.filter(image => !selectedImages.includes(image)));
        setSelectedImages([]); // Clear the selected images after removal
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [barcode, setBarcode] = useState('');
    const [error, setError] = useState('');


    const handleSelectBarcode = (barcode) => {
        // console.log(CSAData)
        let data = CSAData.filter(item => item.CSA === barcode);
        console.log("dkfldkdlskd ", data[0]);
        setSelectedCSA(data[0])
    }



    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        setFile(selectedFile);

        const formData = new FormData();
        formData.append('pdf', e.target.files[0]);

        try {
            setLoader(true);
            const response = await axios.post(EXTRACT_PDF, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoader(false);

            setImages(response.data.images);
        } catch (error) {
            setLoader(false);
            setError('An error occurred while reading the barcode.');
        }

    };







    const handleImageClick = (image) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(image)
                ? prevSelected.filter((img) => img !== image)
                : [...prevSelected, image]
        );
    };


    const handleDownloadDataFile = async () => {


        try {
            if (!date) {
                setError('Date is required');
                return;
            }

            setLoader(true);
            const response = await axios.post(
                DOWNLOAD_ZIP_FILE, // Replace with your API URL
                { date },
                { responseType: 'blob' } // Set response type to 'blob' for binary data
            );

            // Create a link element and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${date}.zip`); // Set the filename
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download folder');
            console.error(err);
        } finally {
            setLoader(false);
        }
    }

    const [zoomedImage, setZoomedImage] = useState(null);

    const handleDoubleClick = (image) => {
        if (zoomedImage === image) {
            setZoomedImage(null); // Zoom out if already zoomed in
        } else {
            setZoomedImage(image); // Zoom in
        }
    };

    return (
        <>
            <NormalHeader />
            <Container className="mt-7" fluid>
                {loader ? (
                    <Loader />
                ) : ("")}
                <Row>


                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h1 className="mt-2">Tag a File</h1>

                                    <Button className="" color="primary" type="button" onClick={() => setModalShow(true)}>
                                        Download Files
                                    </Button>
                                </div>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Select File
                                    </label>
                                    <div className="col-md-10">
                                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                                        {!file && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Barcode
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={selectedBarcode}
                                            onChange={handleBarcodeChange}
                                            options={CSAData}
                                            getOptionLabel={option => option?.barcode}
                                            getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!selectedBarcode && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        CSA Number
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={selectedCSA}
                                            onChange={handleSelectCSA}
                                            options={CSAData}
                                            getOptionLabel={option => option?.CSA}
                                            getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!selectedCSA && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row>
                                    <div className="col-md-7">
                                        <div>
                                            {images?.length > 0 && (
                                                <div style={{ overflowY: "scroll", height: "40rem" }}>
                                                    {/* {images.map((image, index) => (


                                                        <div
                                                            key={index}
                                                            style={{ position: 'relative', display: 'inline-block', margin: '10px 5px' }}
                                                        >
                                                            {selectedImages.includes(image) && (
                                                                <FontAwesomeIcon
                                                                    icon={faCheck}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '5px',
                                                                        left: '5px',
                                                                        color: 'green',
                                                                        fontSize: '20px',
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                            )}
                                                            <img
                                                                src={`http://localhost:8000${image}`}
                                                                alt={`Page ${index + 1}`}
                                                                onClick={() => handleImageClick(image)}
                                                                style={{
                                                                    width: '200px',
                                                                    maxWidth: '600px',
                                                                    border: "2px solid black",
                                                                    cursor: 'pointer'
                                                                }}
                                                            />
                                                        </div>
                                                    ))} */}

                                                    {images.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                position: 'relative',
                                                                display: 'inline-block',
                                                                margin: '10px 5px',
                                                                ...(zoomedImage === image && {
                                                                    position: 'fixed',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    transform: 'translate(-50%, -50%)',
                                                                    zIndex: 1000,
                                                                }),
                                                            }}
                                                        >
                                                            {selectedImages.includes(image) && (
                                                                <FontAwesomeIcon
                                                                    icon={faCheck}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '5px',
                                                                        left: '5px',
                                                                        color: 'green',
                                                                        fontSize: '20px',
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                            )}
                                                            <img
                                                                src={`http://localhost:8000${image}`}
                                                                alt={`Page ${index + 1}`}
                                                                onClick={() => handleImageClick(image)}
                                                                onDoubleClick={() => handleDoubleClick(image)}
                                                                style={{
                                                                    width: zoomedImage === image ? '80%' : '200px',
                                                                    maxWidth: zoomedImage === image ? 'none' : '600px',
                                                                    border: '2px solid black',
                                                                    cursor: 'pointer',
                                                                    ...(zoomedImage === image && {
                                                                        width: 'auto',
                                                                        height: '85vh',
                                                                        maxWidth: '90%',
                                                                        maxHeight: '85vh',
                                                                    }),
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        {images.length > 0 && (
                                            <>

                                                <Row className="mb-3">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-12 col-form-label"
                                                    >
                                                        Select Document Type
                                                    </label>
                                                    <div className="col-md-12">
                                                        <Select
                                                            onChange={(selectedOption) => SetDocumentType(selectedOption)}
                                                            options={documentsData}
                                                            getOptionLabel={(option) => option?.name}
                                                            getOptionValue={(option) => option?.id?.toString()}
                                                            classNamePrefix="select2-selection"
                                                            value={documentType}

                                                        />
                                                    </div>
                                                </Row>

                                                <div className="functions mt-2 d-flex justify-content-end">

                                                    <Button className="" color={pageCheck ? 'success' : 'light'} onClick={handleSave} type="button" disabled={!pageCheck}>
                                                        Save
                                                    </Button>
                                                </div>


                                            </>
                                        )}
                                    </div>
                                </Row>

                            </CardHeader>

                        </Card>
                    </div>
                </Row>

            </Container>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Download Data File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Select Date
                        </label>
                        <div className="col-md-10">
                            <input type="date"
                                className='form-control'
                                placeholder="Select Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)} />
                            {!date && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleDownloadDataFile} className="waves-effect waves-light">Download</Button>{" "}

                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Tagging;
