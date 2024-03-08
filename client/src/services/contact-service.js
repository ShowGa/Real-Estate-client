import axios from "axios";

const API_URL = "http://localhost:8080";

class ContactService {
  // this id is userRef from listing creator
  getLandlord(id) {
    return axios.get(API_URL + `/server/user/${id}`, { withCredentials: true });
  }
}

export default new ContactService();
