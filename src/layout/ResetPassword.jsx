import React, { useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { forceSyntheticError } from "../redux/slices/userSlice";
import { API_URL, EMAIL_REGEX } from "../constants";
import { errorFormatter } from "../helpers";
import ChangeVisibility from "../components/ChangeVisibility";

const ResetPassword = ({ cancel }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeCorrect, setCodeCorrect] = useState(null);
  const [passwd, setPasswd] = useState("");
  const [confirmPasswd, setConfirmPasswd] = useState("");
  const [passwdVisibility, setPasswdVisibility] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSendEmail = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setLocalError("Podano niepoprawny adres email");
      return;
    }

    setIsSent(true);
    return;

    try {
      const res = await fetch(`${API_URL}/auth/reset-passwd`);

      if (!res.ok) {
        throw new Error(errorFormatter(res.status));
      }

      const data = res.json();

      if (data) {
        setIsSent(true);
      }
    } catch (error) {
      dispatch(forceSyntheticError(error));
    }
  };

  const handleCheckCode = async () => {
    setCodeCorrect(true);
    return;

    try {
      const res = await fetch(`${API_URL}/auth/check-code`);

      if (!res.ok) {
        throw new Error(errorFormatter(res.status));
      }

      const data = res.json();

      if (data) {
        setCodeCorrect(true);
      }
    } catch (error) {
      setCodeCorrect(false);
      dispatch(forceSyntheticError(error));
    }
  };

  const confirmChange = () => {
    alert("Funkcjonalność testowa");
  };

  return (
    <Modal onClose={cancel} className="w-96" isOnTop={true}>
      {({ closeModal }) => (
        <div className="flex flex-col gap-6">
          {localError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}
          {isSent ? (
            <>
              {codeCorrect === null ? (
                <>
                  <h2 className="text-xl font-semibold text-center">
                    Podaj kod
                  </h2>
                  <p>
                    Jeśli zostany podał poprawny adres email kod powinien
                    znajdować się w Twojej skrzynce. Koniecznie sprawdź folder
                    Spam!
                  </p>
                  <Input
                    type="text"
                    placeholder="Kod z wiadomości"
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                  />
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button text="Zweryfikuj" onClick={handleCheckCode} />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-center">
                    Wprowadź nowe hasło
                  </h2>
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
                  <Button text="Potwierdź zmianę" onClick={confirmChange} />
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-center">
                Zresetuj hasło
              </h2>
              <Input
                type="text"
                placeholder="Podaj adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
              <div className="flex flex-col md:flex-row gap-2">
                <Button text="Wyślij kod" onClick={handleSendEmail} />
                <Button type="secondary" text="Anuluj" onClick={closeModal} />
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ResetPassword;
