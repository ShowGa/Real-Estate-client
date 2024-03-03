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

  signInOAuth(data) {
    return axios.post(API_URL + "/server/auth/google", data, {
      withCredentials: true,
    });
  }

  signOut() {
    return axios.get(API_URL + "/server/auth/signout");
  }
}

export default new AuthService();
