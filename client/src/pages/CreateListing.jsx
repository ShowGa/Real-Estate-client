import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const CreateListing = () => {
  const [formData, setFormData] = useState({ imageURL: [] });
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURL: formData.imageURL.filter((url, i) => {
        return i !== index;
      }),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex flex-col flex-1 gap-4 p-2 rounded-md bg-gray-200">
          <input
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Description"
            id="description"
            required
          />
          <input
            className="border p-3 rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
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
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min="1"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
