import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import authService from "../services/auth-service";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const postData = {
        username: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      authService
        .signInOAuth(postData)
        .then((res) => {
          console.log(res);
          dispatch(signInSuccess(res.data));
          navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log("Error when OAuth", e);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      onClick={handleGoogleClick}
    >
      Sign In With Google
    </button>
  );
};

export default OAuth;
