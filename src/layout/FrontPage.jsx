import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import zusLogoImg from '../assets/zus_logo.png';
import Button from "../components/Button";


const FrontPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl p-6 flex items-center max-w-4xl">
        <div className="flex-1">
          <h2 className="font-extrabold text-4xl w-2/3 color-zus-green">Symulator emerytalny</h2>
          <p className="mb-4 w-2/3 color-zus-grey">by ZUS</p>
          <p className="mb-6 w-2/3">Sprawdź swoją przyszłą emeryturę w kilku prostych krokach. 
            Nasz symulator pomoże Ci oszacować wysokość 
            świadczenia emerytalnego na podstawie Twoich danych i składek.
          </p>
          <div className="flex">
          <Button text="Uruchom" customStyle="!w-1/4" />
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
}

export default FrontPage;