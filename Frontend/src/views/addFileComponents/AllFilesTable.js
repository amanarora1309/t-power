import React, { useState } from 'react'
import { Button, Card, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, Modal, Row, Table, UncontrolledDropdown } from 'reactstrap'
import { format, setDate } from 'date-fns';
import Select from "react-select"
import { toast } from 'react-toastify';
import { getFilterFilesData } from 'helper/fileData_helper';
import { getFileDetailData } from 'helper/fileData_helper';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Toolbar, Sort, Inject, Filter } from '@syncfusion/ej2-react-grids';
const AllFilesTable = ({ setSelectedFileId, collectionPointData, setCSANumber, setTypeOfRequest, setNoOfPages, setDateOfApplication, setBarcode, setCollectionPoint, files, setFiles, setLoader, setModalShow, setFileDetailData, setAllFilesDisplay, setDownloadModal, setUpdateModal }) => {
    const [selectedDays, setSelectedDays] = useState("");
    const [filterFiles, setFilterFiles] = useState([]);
    const filterSettings = { type: 'Excel' };
    const toolbarOptions = ['Search'];


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


    const dropdownTemplate = (props) => (
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
                        onClick={() => handleEditRowClick(props)}
                    >
                        Edit
                    </DropdownItem>
                    <DropdownItem
                        href="#pablo"
                        onClick={() => handleRowClick(props)}
                    >
                        View
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </td>
    );

    const dateTemplate = (props) => {
        const date = new Date(props.createdAt);
        return <span>{date.toLocaleDateString()}</span>;
    };
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


                        {filterFiles.length > 0 ?
                            <div className="table">
                                <div className='control-pane'>
                                    <div className='control-section row justify-content-center'>
                                        <GridComponent
                                            dataSource={filterFiles}
                                            width="95%"
                                            toolbar={toolbarOptions}
                                            allowSorting={true}
                                            allowFiltering={true}
                                            filterSettings={filterSettings}
                                            allowPaging={true}
                                            pageSettings={{ pageSize: 10, pageCount: 5 }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective field='CSA' headerText='CSA' width='300'></ColumnDirective>
                                                <ColumnDirective field='barcode' headerText='Barcode' width='300'></ColumnDirective>
                                                <ColumnDirective field='typeOfRequest' headerText='Type Of Request' width='300'></ColumnDirective>
                                                <ColumnDirective field='noOfPages' headerText='No of Pages' width='300'></ColumnDirective>
                                                <ColumnDirective field='createdAt' headerText='Created At' width='300' template={dateTemplate}></ColumnDirective>
                                                <ColumnDirective
                                                    headerText='Actions'
                                                    width='150'
                                                    template={dropdownTemplate}
                                                    textAlign='Right'
                                                />
                                            </ColumnsDirective>
                                            <Inject services={[Toolbar, Page, Sort, Filter]} />
                                        </GridComponent>
                                    </div>

                                </div>
                            </div>
                            :
                            <div className="table">
                                <div className='control-pane'>
                                    <div className='control-section row justify-content-center'>
                                        <GridComponent
                                            dataSource={files}
                                            width="95%"
                                            toolbar={toolbarOptions}
                                            allowSorting={true}
                                            allowFiltering={true}
                                            filterSettings={filterSettings}
                                            allowPaging={true}
                                            pageSettings={{ pageSize: 500, pageCount: 5 }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective field='CSA' headerText='CSA' width='300'></ColumnDirective>
                                                <ColumnDirective field='barcode' headerText='Barcode' width='300'></ColumnDirective>
                                                <ColumnDirective field='typeOfRequest' headerText='Type Of Request' width='300'></ColumnDirective>
                                                <ColumnDirective field='noOfPages' headerText='No of Pages' width='300'></ColumnDirective>
                                                <ColumnDirective field='createdAt' headerText='Created At' width='300' template={dateTemplate}></ColumnDirective>
                                                <ColumnDirective
                                                    headerText='Actions'
                                                    width='150'
                                                    template={dropdownTemplate}
                                                    textAlign='Right'
                                                />
                                            </ColumnsDirective>
                                            <Inject services={[Toolbar, Page, Sort, Filter]} />
                                        </GridComponent>
                                    </div>

                                </div>
                            </div>
                        }





                    </Card>
                </div>
            </Row>


        </>
    )
}

export default AllFilesTable
