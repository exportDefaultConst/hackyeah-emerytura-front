import React, { useState, useEffect } from "react";
import zusLogoImg from '../assets/zus_logo.png';
import Button from "../components/Button";

const FrontPage = ({ onNext }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [gradientPosition, setGradientPosition] = useState(50);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const handleMouseMove = (e) => {
    const y = e.clientY;
    const windowHeight = window.innerHeight;
    const position = (y / windowHeight) * 100;
    setGradientPosition(position);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, var(--color-zus-green) ${gradientPosition - 100}%, #008a39 ${gradientPosition + 100}%)`,
      }}
    >
      {/* White oval at the top-left corner */}
      <div
        className="absolute top-[-75%] left-[-75%] w-[150%] h-[150%] bg-transparent rounded-full border-4 border-white"
        style={{ zIndex: 1 }}
      ></div>

      {/* White oval at the bottom-right corner */}
      <div
        className="absolute bottom-[-75%] right-[-75%] w-[150%] h-[150%] bg-transparent rounded-full border-4 border-white"
        style={{ zIndex: 1 }}
      ></div>

      <div className="bg-white rounded-xl p-6 flex items-center max-w-4xl z-2">
        <div className="flex-1">
          <h2 className="font-extrabold text-4xl w-2/3 color-zus-green">Symulator emerytalny</h2>
          <p className="mb-4 w-2/3 color-zus-grey text-sm">by ZUS</p>
          <p className="mb-6 w-2/3 text-base">Sprawdź swoją przyszłą emeryturę w kilku prostych krokach. 
            Nasz symulator pomoże Ci oszacować wysokość 
            świadczenia emerytalnego na podstawie Twoich danych i składek.
          </p>
          <div className="flex">
            <Button text="Uruchom" customStyle="!w-1/4" onClick={onNext} />
            <div></div>
          </div>
        </div>
        <img
          src={zusLogoImg}
          alt="ZUS Logo"
          className="w-48 h-48 rounded-full"
        />
      </div>
    </div>
  );
};

export default FrontPage;