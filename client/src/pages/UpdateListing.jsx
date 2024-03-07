import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ListingService from "../services/listing-service.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageURL: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 0,
    bathrooms: 0,
    regularPrice: 1,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser._id,
  });
  // console.log(formData);

  // handler
  const handleFileUpload = () => {
    if (files.length > 0 && files.length + formData.imageURL.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURL: formData.imageURL.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((e) => {
          setUploading(false);
          setImageUploadError("Maximum 2 MB per image !");
        });
    } else if (files.length === 0) {
      setImageUploadError("Please select at least 1 file to upload !");
      setUploading(false);
    } else {
      setImageUploadError(`You can only submit 6 "images" per listing`);
      setUploading(false);
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURL: formData.imageURL.filter((url, i) => {
        return i !== index;
      }),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
      return;
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
      return;
    }

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleUpdateListing = (e) => {
    e.preventDefault();
    // At least upload 1 image
    if (formData.imageURL.length < 1) {
      return setError("At least one image");
    }
    // The regular price should higher than discount price
    if (+formData.regularPrice < +formData.discountPrice) {
      return setError("Discount price should lower than Regular price");
    }

    ListingService.updateListing(formData, params.listingId)
      .then((res) => {
        setLoading(true);
        if (res.success === false) {
          setError(res.message);
          return;
        }
        setError(false);
        setLoading(false);
        alert("Listing updated successfully !");
        navigate(`/listing/${res.data._id}`);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setError(e.response.data.message);
      });
  };

  // function
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // useEffect
  useEffect(() => {
    ListingService.getListing(params.listingId)
      .then((res) => {
        if (res.success === false) {
          setError(res.message);
          return;
        }
        setFormData(res.data);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }, []);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form
        onSubmit={handleUpdateListing}
        className="flex flex-col sm:flex-row sm:items-start gap-4"
      >
        <div className="flex flex-col flex-1 gap-4 p-2 rounded-md bg-gray-200">
          <input
            onChange={handleChange}
            value={formData.name}
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="1"
            required
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Description"
            id="description"
            required
          />
          <input
            onChange={handleChange}
            value={formData.address}
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 p-2 border border-black rounded-md">
          <p className="font-semibold">
            Images:{" "}
            <span className="ml-0 block font-normal text-gray-600">
              Please upload your Estate images (Maximum 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={formData.imageURL.length >= 6 || uploading}
              type="button"
              onClick={handleFileUpload}
              className="p-3 text-green-700 font-bold border border-green-700 rounded uppercase duration-200 transition-all hover:text-white hover:bg-green-700 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageURL.length > 0 &&
            formData.imageURL.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between rounded-md p-3 border border-gray-400 items-center"
                >
                  <img
                    src={url}
                    alt="Listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                    type="button"
                    className="p-3 text-red-700 font-bold border border-red-700 rounded-lg uppercase transition-all duration-200 hover:bg-red-700 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
