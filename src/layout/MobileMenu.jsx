import React from "react";
import { useDispatch } from "react-redux";
import StyledLink from "../components/StyledLink";
import Button from "../components/Button";

const MobileMenu = ({ userData, menuRef, menuHeight, openLogin }) => {
  const dispatch = useDispatch();

  return (
    <div
      ref={menuRef}
      style={{ height: menuHeight }}
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white shadow-md rounded-b-lg absolute w-full top-16 left-0`}
    >
      <div className="flex flex-col items-center space-y-2 py-2 px-8">
        <StyledLink target="/" text="Strona główna" />
        <StyledLink target="/" text="O nas" />
        <StyledLink target="/" text="Kontakt" />
        {userData && <StyledLink target="/moje-konto" text="Moje konto" />}

        <Button
          text={userData ? "Wyloguj się" : "Zaloguj się"}
          onClick={userData ? () => dispatch(logout()) : openLogin}
          customStyle="flex justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            {userData ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            )}
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
