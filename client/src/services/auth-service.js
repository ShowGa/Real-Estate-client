import axios from "axios";

const API_URL = "http://localhost:8080";

class AuthService {
  register(formData) {
    return axios.post(API_URL + "/server/auth/signup", formData);
  }

  signIn(formData) {
    return axios.post(API_URL + "/server/auth/signin", formData, {
      withCredentials: true,
    });
  }
}

export default new AuthService();
