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
      className="inline-block px-6 py-3 duration-200 tracking-wide antialiased font-sans text-red-600 font-bold hover:bg-lime-600 hover:text-lime-200 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
