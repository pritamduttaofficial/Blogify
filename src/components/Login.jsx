import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/authSlice";
import Button from "./Button";
import Input from "./Input";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
        }
        navigate("/");
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-lg bg-zinc-800 text-white bg-opacity-50 rounded-xl p-10 border border-black/10">
        <div className="mb-6 flex justify-center">
          <img className="rounded-xl w-4/6" src="/cover.png" alt="" />
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight mb-4">
          Sign in to your account
        </h2>
        <p className="text-center text-base mb-4">
          Don't have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
          <div className="space-y-4">
            <Input
              label="Email"
              className="bg-zinc-800 border-zinc-500 text-white focus:text-black"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
            <Input
              label="Password"
              className="bg-zinc-800 border-zinc-500 text-white focus:text-black"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
            <Button
              type="submit"
              className="w-full rounded flex items-center justify-center"
              buttonText={
                loading ? <ClipLoader color="#ffffff" size={20} /> : "Login"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
