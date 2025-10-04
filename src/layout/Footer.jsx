import React from "react";
import StyledLink from "../components/StyledLink";
import { APP_NAME } from "../constants";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {APP_NAME} @ HackYeah
          </p>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <StyledLink target="/" text="Polityka prywatności" type="footer" />
            <StyledLink target="/" text="Warunki użytkowania" type="footer" />
            <StyledLink target="/" text="Kontakt" type="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
