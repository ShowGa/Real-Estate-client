import axios from "axios";

const API_URL = "https://real-estate-r2hs.onrender.com";

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
    return axios.get(API_URL + "/server/auth/signout", {
      withCredentials: true,
    });
  }
}

export default new AuthService();
