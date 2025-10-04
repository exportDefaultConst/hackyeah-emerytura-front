import React, { useState, useEffect } from "react";
import { Outlet, useResolvedPath } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import ErrorPopup from "./ErrorPopup";
import { useDispatch, useSelector } from "react-redux";
import { acknowledgeError } from "../redux/slices/userSlice";
import Loader from "./Loader";
import LoginRegister from "./LoginRegister";
import FloatingButton from "../components/FloatingButton";
import FloatingChat from "../components/FloatingChat";
import FrontPage from "./FrontPage";


const AppLayout = () => {
  const dispatch = useDispatch();
  const resolvedRoute = useResolvedPath();
  const { error, loading } = useSelector((state) => state.user);

  const [showLoader, setShowLoader] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
    }
  }, [loading]);

  // close all popups when path changes (for users that use mouse btns to navigate back/forward on browsed pages)
  useEffect(() => {
    setShowLogin(false);
    setShowChat(false);
  }, [resolvedRoute]);

  const closeErrorModal = () => {
    dispatch(acknowledgeError());
  };

  const handleLoaderExit = () => {
    setShowLoader(false);
  };

  useEffect(() => {
    if (!loading && showLoader) {
      const safetyTimer = setTimeout(() => {
        if (!loading) {
          setShowLoader(false);
        }
      }, 500);

      return () => clearTimeout(safetyTimer);
    }
  }, [loading, showLoader]);

  const openLogin = () => {
    setShowLogin(!showLogin);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow max-w-full max-h-full">
          <FrontPage></FrontPage>
        </main>
      </div>
      {error && (
        <ErrorPopup warningText={error} buttonAction={closeErrorModal} />
      )}
      {showLoader && <Loader isLoading={loading} onExit={handleLoaderExit} />}

      {showLogin && <LoginRegister cancel={openLogin} />}

      <FloatingButton onClick={toggleChat} isOpen={showChat} />
      <FloatingChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
};

export default AppLayout;
