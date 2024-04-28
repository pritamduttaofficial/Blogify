import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "../container/Container";
import LogoutBtn from "./LogoutBtn";

function Header() {
  // user status whether loggedIn or not
  const isLoggedIn = useSelector((state) => state.auth?.status || false);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !isLoggedIn,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !isLoggedIn,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: isLoggedIn,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: isLoggedIn,
    },
  ];

  return (
    <header className="py-2 shadow-lg bg-lime-400">
      <Container>
        <nav className="flex justify-center justify-items-center items-center">
          <div className="mr-4">
            <Link to="/">
              <img className="w-40" src="/logo.png" alt="" />
            </Link>
          </div>
          <ul className="flex ml-auto">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="inline-block px-6 py-3 active:scale-95 duration-200 tracking-wide antialiased font-sans text-red-600 font-bold hover:bg-lime-600 hover:text-lime-200 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {isLoggedIn && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
