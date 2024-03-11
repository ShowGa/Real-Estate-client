import axios from "axios";

const API_URL = "https://real-estate-r2hs.onrender.com";

class ListingService {
  createListing(formData, id) {
    return axios.post(API_URL + `/server/listing/create`, formData, {
      withCredentials: true,
    });
  }

  // Show personal listings in profiles
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

  updateListing(formData, id) {
    return axios.patch(API_URL + `/server/listing/update/${id}`, formData, {
      withCredentials: true,
    });
  }

  // get specified listing . This id is Listing _id, no need to verify , everyone can get.
  getListing(id) {
    return axios.get(API_URL + `/server/listing/get/${id}`);
  }

  // get litstings with query
  getListings(searchQuery) {
    return axios.get(API_URL + `/server/listing/get?${searchQuery}`);
  }
}

export default new ListingService();
