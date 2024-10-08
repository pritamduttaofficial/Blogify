import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <hr className="my-8 opacity-20" />
      <footer className="w-full flex p-10">
        <div className="mx-auto flex flex-col max-w-6xl items-center justify-evenly px-4 lg:px-0">
          <div className="inline-flex items-center">
            <img className="w-40" src="/logo.png" alt="" />
          </div>
          <div className="hidden items-center md:inline-flex">
            <span className="text-sm font-medium text-white">
              Ready to Get Started ?
            </span>
            <button
              type="button"
              className="ml-2 rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-start space-x-8 md:flex-row">
          <div className="mt-8 grid grid-cols-2 gap-16 md:mt-0 lg:w-3/4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-8 lg:mb-0">
                <p className="mb-6 text-lg font-semibold text-white ">
                  Company
                </p>
                <ul className="flex flex-col space-y-4 text-[14px] font-medium text-white">
                  <li className="w-28">About us</li>
                  <li className="w-28">Our Team</li>
                  <li className="w-28">Our Vision</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
