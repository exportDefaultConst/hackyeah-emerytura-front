import React from "react";
import StyledLink from "../components/StyledLink";
import Button from "../components/Button";
import { useDispatch } from "react-redux";

const Menu = ({ userData, openLogin }) => {
  const dispatch = useDispatch();

  return (
    <div className="hidden md:flex space-x-4 items-center">
      <StyledLink target="/" text="Strona główna" />
      <StyledLink target="/" text="O nas" />
      <StyledLink target="/" text="Kontakt" />
      {userData && <StyledLink target="/moje-konto" text="Moje konto" />}
      <div>
        {userData ? (
          <Button text="Wyloguj się" onClick={() => dispatch(logout())}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          </Button>
        ) : (
          <Button text="Zaloguj się" onClick={openLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Menu;
