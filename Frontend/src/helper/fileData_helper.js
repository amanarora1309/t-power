import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const saveFileData = data => post(url.SAVE_FILE_DATA, data);
export const updateFileData = data => post(url.UPDATE_FILE_DATA, data);
export const getAllFilesData = () => get(url.GET_ALL_FILEDATA);
export const getFilterFilesData = data => post(url.GET_FILTER_FILES, data);
export const getFileDetailData = data => post(url.GET_FILE_DETAIL_DATA, data);