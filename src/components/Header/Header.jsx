import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import databaseService from "../../appwrite/configuration";
import { ClipLoader } from "react-spinners";

function Header() {
  const isLoggedIn = useSelector((state) => state.auth?.status || false);
  const [loading, setloading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const navItems = [
    { name: "HOME", slug: "/", active: true },
    { name: "LOGIN", slug: "/login", active: !isLoggedIn },
    { name: "SIGNUP", slug: "/signup", active: !isLoggedIn },
    { name: "MY POSTS", slug: "/all-posts", active: isLoggedIn },
    { name: "ADD POST", slug: "/add-post", active: isLoggedIn },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const results = await databaseService.searchPosts(searchQuery);
      if (results) {
        navigate("/search", { state: { results } });
        setloading(false);
      }
    } catch (error) {
      console.error("Failed to search posts:", error);
      setloading(false);
    }
  };

  return (
    <header className="bg-gradient-to-b from-black to-transparent shadow-2xl shadow-zinc-950 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="mr-4">
          <Link to="/">
            <img className="w-40" src="/logo.png" alt="Logo" />
          </Link>
        </div>
        {isLoggedIn && (
          <form className="hidden lg:flex" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search..."
              className="py-2 px-4 rounded-l bg-zinc-800 text-white placeholder-gray-400 border-none outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={loading}
            />
            <button
              type="submit"
              className="py-2 px-4 bg-pink-700 rounded-r hover:bg-pink-600 flex items-center"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : "Search"}
            </button>
          </form>
        )}
        <div className="flex">
          <nav className="hidden lg:flex space-x-6">
            {navItems.map(
              (item) =>
                item.active && (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.slug)}
                    className="px-4 py-2 active:scale-95 duration-200 tracking-wider antialiased font-sans text-pink-600 font-semibold hover:bg-zinc-900 rounded text-sm hover:scale-95"
                  >
                    {item.name}
                  </button>
                )
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden focus:outline-none text-2xl"
              onClick={toggleMenu}
            >
              ☰
            </button>
            {isLoggedIn && (
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <img
                    src={isLoggedIn.profilePicture || "/user.png"}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover object-center border-2 border-zinc-400"
                  />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute flex flex-col items-center justify-center gap-2 right-0 mt-2 bg-zinc-700 text-white rounded shadow-lg w-36 p-4">
                    <li>
                      <Link
                        to="/profile"
                        className="inline-block px-4 py-2 duration-200 tracking-wide antialiased font-sans bg-gray-800 text-white font-bold hover:bg-gray-900 rounded"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <LogoutBtn />
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="w-full p-6">
            <div className="w-full justify-between items-center mb-4">
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white float-right"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <form className="w-full flex" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 px-4 rounded-l bg-gray-700 text-white placeholder-gray-400 border-none outline-none"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-pink-700 rounded-r hover:bg-pink-600 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Search"
                  )}
                </button>
              </form>
            </div>
            <nav className="w-full flex flex-col space-y-4">
              {navItems.map(
                (item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.slug);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 active:scale-95 duration-200 tracking-wide antialiased font-sans text-pink-600 font-bold hover:bg-gray-900 rounded"
                    >
                      {item.name}
                    </button>
                  )
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
