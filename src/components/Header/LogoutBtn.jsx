import React from "react";
import authService from "../../appwrite/auth.js";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice.js";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle the logout functionality
  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/login");
      })
      .catch(() => console.log("Something went wrong while logout"));
  };
  return (
    <button
      className="inline-block px-4 py-2 duration-200 tracking-wide antialiased font-sans bg-red-600 text-white font-bold hover:bg-red-700 rounded"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
