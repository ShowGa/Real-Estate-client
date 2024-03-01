import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
          id="username"
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
