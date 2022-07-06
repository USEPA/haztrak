import axios from "axios";

class UserService {
  static login(data) {
    return axios.post("http://localhost:8000/api/login/", data)
  }

  static signup(data) {
    return axios.post("http://localhost:8000/api/signup/", data)
  }
}

export default UserService
