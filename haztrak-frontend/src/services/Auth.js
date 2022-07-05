import axios from "axios";

class AuthService {
  static login(data) {
    return axios.post("http://localhost:8000/api/login/", data)
  }

  static signup(data) {
    return axios.post("http://localhost:8000/api/signup/", data)
  }
}

export default AuthService
