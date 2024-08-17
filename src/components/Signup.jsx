import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../features/authSlice.js";
import Button from "./Button";
import Input from "./Input";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth.js";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.createAccount(data);
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
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-zinc-800 text-white bg-opacity-50 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="mb-6 flex justify-center">
            <img className="rounded-xl w-4/6" src="/cover.png" alt="" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(handleSignup)}>
          <div className="space-y-5">
            <Input
              label="Full Name"
              className="bg-zinc-800 border-zinc-500 text-white focus:text-black"
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />

            <Input
              label="Email"
              className="bg-zinc-800 border-zinc-500 text-white focus:text-black"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />

            <Input
              label="Password"
              className="bg-zinc-800 border-zinc-500 text-white focus:text-black"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />

            <Button
              type="submit"
              className="w-full rounded flex items-center justify-center"
              buttonText={
                loading ? <ClipLoader color="#ffffff" size={20} /> : "Signup"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
