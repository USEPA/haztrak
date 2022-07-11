import axios from "axios";


export const user = () => {
  let token = localStorage.getItem('token')
  if (token) {
    token = token.replace(/['"]+/g, '')
  }

  return axios.create({
    baseURL: `${process.env.REACT_APP_HAZTRAK_API_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
}
