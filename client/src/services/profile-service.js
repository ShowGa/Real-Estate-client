import axios from "axios";

const API_URL = "http://localhost:8080";

class ProfileService {
  updateProfile(formData, id) {
    return axios.patch(API_URL + `/server/user/update/${id}`, formData, {
      withCredentials: true,
    });
  }
}

export default new ProfileService();
