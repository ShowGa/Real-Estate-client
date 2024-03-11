import axios from "axios";

const API_URL = "https://real-estate-r2hs.onrender.com";

class ProfileService {
  updateProfile(formData, id) {
    return axios.patch(API_URL + `/server/user/update/${id}`, formData, {
      withCredentials: true,
    });
  }

  deleteProfile(id) {
    return axios.delete(API_URL + `/server/user/delete/${id}`, {
      withCredentials: true,
    });
  }
}

export default new ProfileService();
