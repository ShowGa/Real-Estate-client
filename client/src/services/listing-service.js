import axios from "axios";

const API_URL = "http://localhost:8080";

class ListingService {
  createListing(formData, id) {
    return axios.post(API_URL + `/server/listing/create`, formData, {
      withCredentials: true,
    });
  }

  showListing(id) {
    return axios.get(API_URL + `/server/listing/listings/${id}`, {
      withCredentials: true,
    });
  }

  // this id come from Listing which you want to delete
  deleteListing(id) {
    return axios.delete(API_URL + `/server/listing/delete/${id}`, {
      withCredentials: true,
    });
  }
}

export default new ListingService();
