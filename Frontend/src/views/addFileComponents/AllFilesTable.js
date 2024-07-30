import React, { useState } from 'react'
import { Button, Card, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, Modal, Row, Table, UncontrolledDropdown } from 'reactstrap'
import { format, setDate } from 'date-fns';
import Select from "react-select"
import { toast } from 'react-toastify';
import { getFilterFilesData } from 'helper/fileData_helper';
import { getFileDetailData } from 'helper/fileData_helper';

const AllFilesTable = ({ setSelectedFileId, collectionPointData, setCSANumber, setTypeOfRequest, setNoOfPages, setDateOfApplication, setBarcode, setCollectionPoint, files, setFiles, setLoader, setModalShow, setFileDetailData, setAllFilesDisplay, setDownloadModal, setUpdateModal }) => {
    const [selectedDays, setSelectedDays] = useState("");
    const [filterFiles, setFilterFiles] = useState([]);

    const daysData = [
        { id: 1, name: "One Day", value: 1 },
        { id: 2, name: "One Week", value: 7 },
        { id: 3, name: "One Month", value: 30 },
        { id: 4, name: "Six Month", value: 180 },
        { id: 5, name: "One Year", value: 365 },
        { id: 6, name: "default", value: 0 },

    ];

    const fetchFilterFiles = async (days) => {
        try {
            const data = await getFilterFilesData({ days });
            if (data?.success) {
                setFilterFiles(data?.data);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    const handleDateChange = (selectedOption) => {
        setSelectedDays(selectedOption)
        if (selectedOption.id == 6) {
            setFilterFiles([]);
        }
        else {
            fetchFilterFiles(selectedOption.value);
        }
    }

    const handleRowClick = async (d) => {
        try {
            const fileDataId = d.id;
            setLoader(true);
            const data = await getFileDetailData({ fileDataId });
            setLoader(false);
            if (data?.success) {
                console.log(data.result)
                setFileDetailData({ fileData: d, tagging: data?.result?.tagging, warehouse: data?.result?.warehouse });
                setModalShow(true);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const handleEditRowClick = async (d) => {
        try {
            setSelectedFileId(d.id);
            setUpdateModal(true)
            setCSANumber(d?.CSA);
            setBarcode(d?.barcode);
            setTypeOfRequest(d?.typeOfRequest);
            setNoOfPages(d?.noOfPages)

            const dateStr = d.dateOfApplication;
            const date = new Date(dateStr);
            // Format the date as yyyy-mm-dd
            const formattedDate = date.toISOString().split('T')[0];
            setDateOfApplication(formattedDate)

            console.log("dateOfApplication ", d.dateOfApplication)
            collectionPointData.map((data) => {
                if (data.name == d.collectionPoint) {
                    setCollectionPoint(data);
                }
            })

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    return (
        <>
            <Row>
                <div className="col">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <div className="d-flex justify-content-between">
                                <h3 className="mt-2">All Files</h3>

                                <div className="">
                                    <Select

                                        value={selectedDays}
                                        onChange={handleDateChange}
                                        options={daysData}
                                        getOptionLabel={option => option?.name}
                                        getOptionValue={option => option?.id?.toString()} // Convert to string if classId is a number
                                        classNamePrefix="select2-selection"
                                    />
                                </div>

                                <div className="">
                                    <Button className="" color="primary" type="button" onClick={() => setAllFilesDisplay(false)}>
                                        Add File
                                    </Button>
                                    <Button className="" color="primary" type="button" onClick={() => setDownloadModal(true)}>
                                        Download Data
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <Table className="align-items-center table-flush mb-5" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Sno.</th>
                                    <th scope="col">CSA</th>
                                    <th scope="col">Barcode</th>
                                    <th scope="col">Type of Request</th>
                                    <th scope="col">No of Pages</th>
                                    <th scope="col">Entry Date</th>
                                    <th scope="col" />
                                </tr>
                            </thead>
                            <tbody style={{ minHeight: "100rem" }}>
                                {filterFiles.length > 0 ?
                                    filterFiles?.map((d, i) => (
                                        <>
                                            <tr key={i} style={{ cursor: "pointer" }}>
                                                <td>{i + 1}</td>

                                                <td>{d.CSA}</td>

                                                <td>{d.barcode}</td>

                                                <td>{d.typeOfRequest}</td>

                                                <td>{d.noOfPages}</td>

                                                <td>{format(new Date(d.createdAt), 'yyyy-MM-dd ')}</td>

                                                <td className="text-right">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            className="btn-icon-only text-light"
                                                            href="#pablo"
                                                            role="button"
                                                            size="sm"
                                                            color=""
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            <i className="fas fa-ellipsis-v" />
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={() => handleEditRowClick(d)}
                                                            >
                                                                Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={() => handleRowClick(d)}
                                                            >
                                                                View
                                                            </DropdownItem>

                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                    :
                                    files?.map((d, i) => (
                                        <>
                                            <tr key={i} style={{ cursor: "pointer" }}>
                                                <td>{i + 1}</td>

                                                <td>{d.CSA}</td>

                                                <td>{d.barcode}</td>

                                                <td>{d.typeOfRequest}</td>

                                                <td>{d.noOfPages}</td>

                                                <td>{format(new Date(d.createdAt), 'yyyy-MM-dd ')}</td>

                                                <td className="text-right">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            className="btn-icon-only text-light"
                                                            href="#pablo"
                                                            role="button"
                                                            size="sm"
                                                            color=""
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            <i className="fas fa-ellipsis-v" />
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={() => handleEditRowClick(d)}
                                                            >
                                                                Edit
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                href="#pablo"
                                                                onClick={() => handleRowClick(d)}
                                                            >
                                                                View
                                                            </DropdownItem>

                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                }



                            </tbody>
                        </Table>

                    </Card>
                </div>
            </Row>


        </>
    )
}

export default AllFilesTable
