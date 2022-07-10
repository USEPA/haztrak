import axios from "axios";


export const api = axios.create({
  baseURL: `${process.env.REACT_APP_HAZTRAK_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})
