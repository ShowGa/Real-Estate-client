import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import ProfileService from "../services/profile-service.js";
import AuthService from "../services/auth-service.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailed,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import DeleteModal from "../components/DeleteModal.jsx";
import ListingService from "../services/listing-service.js";
import { current } from "@reduxjs/toolkit";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    // upload two time will cause the error
    // Create unique name will be solution
    const fileName = new Date().getTime() + file.name;
    // showing the place to save storage
    const storageRef = ref(storage, fileName);
    // method of upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // rounded decimal
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    // Update the profile Data
    ProfileService.updateProfile(formData, currentUser._id)
      .then((res) => {
        // check if the server side has problem
        if (res.success === false) {
          dispatch(updateUserFailed(res.message));
          return;
        }
        dispatch(updateUserSuccess(res.data));
        setUpdateSuccess(true);
      })
      .catch((e) => {
        dispatch(updateUserFailed(e.response.data.message));
      });
  };
  const handleDelete = () => {
    dispatch(deleteUserStart());
    ProfileService.deleteProfile(currentUser._id)
      .then((res) => {
        if (res.success === false) {
          dispatch(deleteUserFailed(res.message));
          return;
        }
        dispatch(deleteUserSuccess());
        alert("Your account has been deleted !");
      })
      .catch((e) => {
        dispatch(updateUserFailed(e.response.data.message));
      });
  };
  const handleSignOut = () => {
    dispatch(signOutUserStart());
    AuthService.signOut()
      .then((res) => {
        if (res.success === false) {
          dispatch(signOutUserFailed(res.message));
          return;
        }
        dispatch(signOutUserSuccess());
        alert("You just sign out the account !");
      })
      .catch((e) => {
        dispatch(signOutUserFailed(e.response.data.message));
      });
  };
  const handleShowListing = () => {
    ListingService.showListing(currentUser._id)
      .then((res) => {
        setShowListingError(false);
        if (res.success === false) {
          setShowListingError(true);
          return;
        }
        setUserListings(res.data);
      })
      .catch((e) => {
        setShowListingError(true);
      });
  };
  const handleListingDelete = (id) => {
    ListingService.deleteListing(id)
      .then((res) => {
        if (res.success === false) {
          console.log(res.message);
          return;
        }
        setUserListings((prev) => {
          return prev.filter((listing) => {
            return listing._id !== id;
          });
        });
        alert("You just delete a listing !");
      })
      .catch((e) => {
        console.log(e.response.data.message);
      });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"></h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="opacity-0 text-sm text-center">
          <span className="text-red-700">
            {fileUploadError && "Image upload failed !"}
          </span>
          <span className="text-yellow-600">
            {!fileUploadError &&
              filePercentage > 0 &&
              filePercentage < 100 &&
              `${filePercentage}%`}
          </span>
          <span className="text-green-600">
            {!fileUploadError && filePercentage === 100 && "Upload succeeded !"}
          </span>
          Image should less than 2 MB
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="username"
          defaultValue={currentUser.username}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="email"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={() => {
            setDeleteModal(true);
          }}
          className="text-red-700 border-red-700 border-b border-opacity-0 cursor-pointer font-semibold transition duration-200 hover:border-opacity-100"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 border-red-700 border-b border-opacity-0 cursor-pointer font-semibold transition duration-200 hover:border-opacity-100"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Updated successfully !" : ""}
      </p>
      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          onClose={() => {
            setDeleteModal(false);
          }}
        />
      )}
      <button onClick={handleShowListing} className="text-green-700  w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Ops ! Error occurred when showing listing" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold"></h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageURL[0]}
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link className="flex-1" to={listing._id}>
                  <p className="text-slate-700 font-semibold hover:underline truncate">
                    {listing.name}
                  </p>
                </Link>
                <div
                  onClick={() => {
                    handleListingDelete(listing._id);
                  }}
                  className="flex flex-col items-center"
                >
                  <button className="text-red-700 uppercase">Delete</button>
                  <button className="text-green-700 uppercase">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
