import React, { useEffect, useRef, useState } from "react";
import { APP_NAME } from "../constants";
import useAccount from "../hooks/useAccount";
import MobileMenu from "./MobileMenu";
import Menu from "./Menu";

const Header = ({ openLogin }) => {
  const userData = useAccount();
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      setMenuHeight(`${menuRef.current.scrollHeight}px`);
    } else {
      setMenuHeight("0px");
    }
  }, [isMenuOpen, userData]); // depends on userData, so when user logs in the height will be recalculated to accomodate new button in the menu

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="bg-white/0 shadow-md py-4 px-6 fixed top-0 left-0 w-full z-10 backdrop-blur-sm"
      ref={headerRef}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">{APP_NAME}</h1>

        {/* hamburger button for mobile */}
        <button
          className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-0 rounded-md active:ring-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* normal menu */}
        <Menu userData={userData} openLogin={openLogin} />
      </nav>

      {/* mobile menu */}
      <MobileMenu
        userData={userData}
        menuRef={menuRef}
        menuHeight={menuHeight}
        openLogin={openLogin}
      />
    </header>
  );
};

export default Header;
