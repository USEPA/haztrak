import axios from "axios";

const API_URL = "http://localhost:8000/api/"

class UserService {
  static login(data) {
    return axios.post(API_URL + "login/", data)
  }

  static signup(data) {
    return axios.post(API_URL + "signup/", data)
  }
}

export default UserService
