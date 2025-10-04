import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { PASSWD_REGEX, EMAIL_REGEX, PASSWD_CHECK_INFO } from "../constants";
import Input from "../components/Input";
import Divider from "../components/Divider";
import ArrowButton from "../components/ArrowButton";
import ChangeVisibility from "../components/ChangeVisibility";
import { useDispatch } from "react-redux";
import { login, register } from "../redux/slices/userSlice";
import ResetPassword from "./ResetPassword";

const LoginRegister = ({ cancel }) => {
  const dispatch = useDispatch();

  const [localError, setLocalError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const [passwdVisibility, setPasswdVisibility] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const dispatchAction = () => {
    setLocalError(null);
    if (!username) {
      setLocalError("Podaj nazwę użytkownika");
      return;
    }
    if (isRegister) {
      // if (!email) {
      //   setLocalError("Podaj adres email");
      //   return;
      // }
      // if (!EMAIL_REGEX.test(email)) {
      //   setLocalError("Adres email jest nieprawidłowy");
      //   return;
      // }
      if (!PASSWD_REGEX.test(passwd)) {
        setLocalError(PASSWD_CHECK_INFO);
        return;
      }
      if (passwd !== confirmPasswd) {
        setLocalError("Hasła nie są takie same!");
        return;
      }

      // IMPLEMENT CORRECT REGISTER ACTION HERE
      dispatch(
        register({ username: username, password: passwd, email: email })
      );
      // cancel();
    } else {
      if (!passwd) {
        setLocalError("Podaj hasło");
        return;
      }

      // IMPLEMENT CORRECT LOGIN ACTION HERE
      dispatch(login({ username: username, password: passwd }));
      cancel();
    }
  };

  const openResetPassword = () => {
    setShowResetPassword(true);
  };

  const closeResetPassword = () => {
    setShowResetPassword(false);
  };

  return (
    <>
      <Modal onClose={cancel} className="w-96">
        {({ closeModal }) => (
          <>
            <div className="flex flex-row items-center justify-center">
              <ArrowButton
                onClick={closeModal}
                customStyle="absolute left-4 md:left-8"
              />
              <p className="text-center text-xl font-semibold">
                {isRegister ? "Rejestracja" : "Logowanie"}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-center w-full">
              {/* USERNAME */}
              <Input
                type="text"
                onChange={(e) => setUsername(e.target.value.trim())}
                placeholder="Nazwa użytkownika"
                value={username}
              />

              {/* EMAIL ONLY IF REGISTER MODE */}
              {/* {isRegister && (
              <Input
                type="text"
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Email"
              />
            )} */}

              {/* PASSWORD */}
              <p className="flex flex-row relative justify-center items-center">
                <Input
                  type={passwdVisibility ? "text" : "password"}
                  onChange={(e) => setPasswd(e.target.value.trim())}
                  placeholder="Hasło"
                  value={passwd}
                />
                <ChangeVisibility
                  onClick={() => setPasswdVisibility(!passwdVisibility)}
                  visible={passwdVisibility}
                />
              </p>

              {/* CONFIRM PASSWORD ONLY IF REGISTER MODE */}
              {isRegister && (
                <p className="flex flex-row relative justify-center items-center">
                  <Input
                    type={passwdVisibility ? "text" : "password"}
                    onChange={(e) => setConfirmPasswd(e.target.value.trim())}
                    placeholder="Potwierdź hasło"
                    value={confirmPasswd}
                  />
                  <ChangeVisibility
                    onClick={() => setPasswdVisibility(!passwdVisibility)}
                    visible={passwdVisibility}
                  />
                </p>
              )}
            </div>

            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 -mt-4 -mb-4">
                <p className="text-sm text-red-600">{localError}</p>
              </div>
            )}

            {(!localError && isRegister) && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 -mt-4 -mb-4">
                <div className="text-sm text-black">{PASSWD_CHECK_INFO}</div>
              </div>
            )}

            <p className="text-center -mb-4">
              Nie pamiętasz hasła? Zresetuj je{" "}
              <span
                onClick={openResetPassword}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer transition-all duration-300"
              >
                tutaj
              </span>
            </p>

            <div className="flex flex-col lg:flex-row gap-2 ">
              <Button
                text={isRegister ? "Zarejestruj się" : "Zaloguj się"}
                onClick={dispatchAction}
              />
              <Button text="Anuluj" type="secondary" onClick={closeModal} />
            </div>

            <Divider />

            <div className="flex flex-col text-center gap-2 -mt-2">
              <p className="text-lg font-medium">
                {isRegister ? "Masz już konto?" : "Nie masz jeszcze konta?"}
              </p>
              <Button
                text={
                  isRegister ? "Przejdź do logowania" : "Przejdź do rejestracji"
                }
                onClick={() => setIsRegister(!isRegister)}
              />
            </div>
          </>
        )}
      </Modal>

      {showResetPassword && <ResetPassword cancel={closeResetPassword} />}
    </>
  );
};

export default LoginRegister;
