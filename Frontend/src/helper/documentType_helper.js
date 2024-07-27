import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class
export const saveDocumentType = data => post(url.SAVE_DOCUMENT_TYPE, data);
export const getAlldocumentType = () => get(url.GET_ALL_DOCUMENT_TYPE);