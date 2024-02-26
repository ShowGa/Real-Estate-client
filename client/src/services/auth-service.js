import axios from "axios";

const AIP_URL = "http://localhost:8080";

class AuthService {
  register(formData) {
    return axios.post(AIP_URL + "/server/auth/signup", formData);
  }
}

export default new AuthService();
