import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import authService from "../services/auth-service";
import { useDispatch } from "react-redux";
import { siginInFailure, signInSuccess } from "../redux/user/userSlice";
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
        photoURL: result.user.photoURL,
      };

      authService
        .signInOAuth(postData)
        .then((res) => {
          dispatch(signInSuccess(res.data));
          navigate("/");
        })
        .catch((e) => {
          dispatch(siginInFailure(e.message || e.response.data.message));
          console.log(e);
        });
    } catch (e) {
      dispatch(siginInFailure(e.message || e.response.data.message));
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
