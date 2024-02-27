import axios from "axios";

const API_URL = "http://localhost:8080";

class AuthService {
  register(formData) {
    return axios.post(API_URL + "/server/auth/signup", formData);
  }

  signIn(formData) {
    return axios.post(API_URL + "/server/auth/signin", formData);
  }
}

export default new AuthService();
