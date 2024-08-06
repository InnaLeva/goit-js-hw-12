import axios from 'axios';
const URL = "https://pixabay.com/api/";
const API_KEY = "45303563-302093c4a665963323dd6d400";

export default async function searchImagesByQuery(query,  page = 1, perPage  = 15) {
    try { 
        const response = await axios.get(URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
                page: page,
                per_page: perPage 
            }
        })
        return response.data
    }
    catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
}