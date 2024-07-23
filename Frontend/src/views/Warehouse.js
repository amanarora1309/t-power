
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
    Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select"
import { fetchAllUsers } from "helper/userManagment_helper";
import { toast } from "react-toastify";
import { addFiletoWarehouse } from "helper/warehouse_helper";
import { getAllBarcodes } from "helper/barcode_helper";
import { issueFile } from "helper/warehouse_helper";
import { returnFile } from "helper/warehouse_helper";
import { getFileDataFromBarcode } from "helper/warehouse_helper";
import { getAllFilesData } from "helper/fileData_helper";

const Warehouse = () => {
    const [selectedCSA, setSelectedCSA] = useState("");
    const [addFileModal, setAddFileModal] = useState(false);
    const [issueFileModal, setIssueFileModal] = useState(false)
    const [returnFileModal, setReturnFileModal] = useState(false)
    const [boxNumber, setBoxNumber] = useState("");
    const [shelfNumber, setShelfNumber] = useState("");
    const [rackNumber, setRackNumber] = useState("");
    const [floorNumber, setFloorNumber] = useState("");
    const [fileIssueReason, setFileIssueReason] = useState("");
    const [fileIssueTo, setFileIssueTo] = useState("");

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const [spanDisplay, setSpanDisplay] = useState("none");
    const [CSAData, setCSAData] = useState([]);
    const [fileData, setFileData] = useState({});
    const [selectedBarcode, setSelectedBarcode] = useState("");
    const [issueTo, setIssueTo] = useState("");


    const fetchUsers = async () => {
        try {
            const data = await fetchAllUsers();
            console.log("from users --> ", data.data)
            if (data?.success) {
                setAllUsers(data?.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
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
        fetchUsers();
        getAllFiles();

    }, []);


    const getFileData = async (selectedCSA) => {
        try {
            const data = await getFileDataFromBarcode({ selectedCSA });
            if (data?.success) {
                setFileData(data?.file);
                setBoxNumber(data?.file?.boxNumber);
                setShelfNumber(data?.file?.shelfNumber);
                setRackNumber(data?.file?.rackNumber);
                setFloorNumber(data?.file?.floorNumber);
            }
            else {
                toast.warning(data?.message);
                setFileData(null);
                setBoxNumber(null);
                setShelfNumber(null);
                setRackNumber(null);
                setFloorNumber(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectCSA = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
        getFileData(selectedOption);
        setBoxNumber("")
        setShelfNumber("")
        setRackNumber("")
        setFloorNumber("")
    };

    const handleBarcodeChange = selectedOption => {
        setSelectedBarcode(selectedOption);
        setSelectedCSA(selectedOption);
        getFileData(selectedOption);
        setBoxNumber("")
        setShelfNumber("")
        setRackNumber("")
        setFloorNumber("")
    }
    const handleSelectUser = selectedOption => {
        setSelectedUser(selectedOption);
        console.log(selectedOption);
    };

    const handleAddFile = () => {
        if (selectedCSA == "") {
            toast.error("Kindly Select the CSA Number")
        }
        else {
            setAddFileModal(true);
        }
    }
    const handleIssueFile = () => {
        if (selectedCSA == "") {
            toast.error("Kindly Select the CSA Number")
        }
        else {
            setIssueFileModal(true);
        }
    }

    const handleReturnFile = () => {
        if (selectedCSA == "") {
            toast.error("Kindly Select the CSA Number")
        }
        else {
            setReturnFileModal(true);
        }
    }

    const handleAddFileSubmit = async () => {
        console.log("click hand add file")
        console.log(floorNumber)
        if (!boxNumber || !shelfNumber || !rackNumber, !floorNumber) {
            console.log("click hand add file2")
            setSpanDisplay("inline");
        }
        else {
            try {
                const data = await addFiletoWarehouse({ boxNumber, shelfNumber, rackNumber, floorNumber, selectedCSA })
                if (data?.success) {
                    toast.success(data?.message);
                    setAddFileModal(false);
                    setBoxNumber("");
                    setShelfNumber("");
                    setRackNumber("");
                    setSelectedCSA("");
                    setSelectedBarcode("")
                    setFloorNumber("");
                }
                else {
                    toast.error(data?.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("something went wrong");
            }
        }
    }

    const handleIssueFileSubmit = async () => {
        if (!fileIssueReason || !issueTo) {
            setSpanDisplay("inline");
        }
        else {
            try {
                const data = await issueFile({ fileIssueReason, issueTo, selectedCSA })
                if (data?.success) {
                    toast.success(data?.message);
                    setIssueFileModal(false);
                    setFileIssueReason("");
                    setSelectedUser("");
                    setSelectedCSA("");
                }
                else {
                    toast.error(data?.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("something went wrong");
            }
        }
    }

    const handleReturnFileSubmit = async () => {
        if (!boxNumber || !shelfNumber || !rackNumber, !floorNumber) {
            setSpanDisplay("inline");
        }
        else {
            try {
                const data = await returnFile({ boxNumber, shelfNumber, rackNumber, floorNumber, selectedCSA })
                if (data?.success) {
                    toast.success(data?.message);
                    setReturnFileModal(false);
                    setBoxNumber("");
                    setShelfNumber("");
                    setRackNumber("");
                    setSelectedCSA("");
                    setFloorNumber("");
                }
                else {
                    toast.error(data?.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("something went wrong");
            }
        }
    }

    return (
        <>
            <NormalHeader />
            <Container className="mt--7" fluid>

                <Row>

                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h1 className="mt-2">Warehouse Section</h1>
                                </div>
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
                                    </div>
                                </Row>
                                <div className="functions mt-2 d-flex justify-content-end">

                                    <Button className="" color="success" type="button" onClick={handleAddFile}>
                                        Add File
                                    </Button>
                                    <Button className="" color="primary" type="button" onClick={handleIssueFile}>
                                        Issue File
                                    </Button>
                                    <Button className="" color="info" type="button" onClick={handleReturnFile}>
                                        Return File
                                    </Button>
                                </div>


                            </CardHeader>

                        </Card>
                    </div>
                </Row>

            </Container>
            {/* Modal for add the file  */}
            <Modal
                show={addFileModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Box Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={boxNumber}
                                onChange={(e) => setBoxNumber(e.target.value)} />
                            {!boxNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Rack Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={rackNumber}
                                onChange={(e) => setRackNumber(e.target.value)} />
                            {!rackNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Shelf Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={shelfNumber}
                                onChange={(e) => setShelfNumber(e.target.value)} />
                            {!shelfNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Floor Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Floor Number"
                                value={floorNumber}
                                onChange={(e) => setFloorNumber(e.target.value)} />
                            {!floorNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setAddFileModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleAddFileSubmit} className="waves-effect waves-light">Add</Button>{" "}
                </Modal.Footer>
            </Modal>

            {/* Modal for Issue the file  */}
            <Modal
                show={issueFileModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Issue File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Reason
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Reason for Issuance of the File"
                                value={fileIssueReason}
                                onChange={(e) => setFileIssueReason(e.target.value)} />
                            {!fileIssueReason && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Select Issue To
                        </label>
                        <div className="col-md-10">

                            <input type="text"
                                className='form-control'
                                placeholder="Enter Issue to"
                                value={issueTo}
                                onChange={(e) => setIssueTo(e.target.value)} />
                            {!issueTo && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>


                    <div className="m-auto">
                        <h1>File Data</h1>
                        <h4>Box No: {fileData?.boxNumber}</h4>
                        <h4>Rack No: {fileData?.rackNumber}</h4>
                        <h4>Shelf No: {fileData?.shelfNumber}</h4>
                        <h4>Floor No: {fileData?.floorNumber}</h4>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setIssueFileModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleIssueFileSubmit} className="waves-effect waves-light">Issue</Button>{" "}

                </Modal.Footer>
            </Modal>

            {/* Modal for Return the file  */}
            <Modal
                show={returnFileModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Return File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Box Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={boxNumber}
                                onChange={(e) => setBoxNumber(e.target.value)} />
                            {!boxNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Shelf Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={shelfNumber}
                                onChange={(e) => setShelfNumber(e.target.value)} />
                            {!shelfNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Rack Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Box File Number"
                                value={rackNumber}
                                onChange={(e) => setRackNumber(e.target.value)} />
                            {!rackNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Floor Number
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Floor Number"
                                value={floorNumber}
                                onChange={(e) => setFloorNumber(e.target.value)} />
                            {!floorNumber && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                        </div>
                    </Row>






                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setReturnFileModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleReturnFileSubmit} className="waves-effect waves-light">Return</Button>{" "}

                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Warehouse;
