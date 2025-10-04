import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import Button from "./Button";
import { PASSWD_REGEX } from "../constants";
import Input from "./Input";
import ChangeVisibility from "./ChangeVisibility";

const ChangePassword = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!currentPassword.trim()) {
      setLocalError("Aktualne hasło jest wymagane");
      return;
    }

    if (!newPassword.trim()) {
      setLocalError("Nowe hasło jest wymagane");
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError("Nowe hasło musi być różne od aktualnego");
      return;
    }

    if (!PASSWD_REGEX.test(newPassword)) {
      setLocalError(
        "Hasło musi zawierać duże i małe litery, znaki specjalne (@#$!%*&_), cyfry oraz mieć długość 8-15 znaków"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Nowe hasła nie są zgodne");
      return;
    }

    console.log("Changing password...", { currentPassword, newPassword });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLocalError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="w-96">
      {({ closeModal }) => (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Zmień hasło
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* current passwd */}
            <div>
              <p className="flex flex-row relative justify-center items-center">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  onChange={(e) => setCurrentPassword(e.target.value.trim())}
                  placeholder="Aktualne hasło"
                  value={currentPassword}
                />
                <ChangeVisibility
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  visible={showCurrentPassword}
                />
              </p>
            </div>

            {/* new passwd */}
            <div>
              <p className="flex flex-row relative justify-center items-center">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  onChange={(e) => setNewPassword(e.target.value.trim())}
                  placeholder="Nowe hasło"
                  value={newPassword}
                />
                <ChangeVisibility
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  visible={showNewPassword}
                />
              </p>
            </div>

            {/* confirm new passwd */}
            <div>
              <p className="flex flex-row relative justify-center items-center">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value.trim())}
                  placeholder="Potwierdź nowe hasło"
                  value={confirmPassword}
                />
                <ChangeVisibility
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  visible={showNewPassword}
                />
              </p>
            </div>

            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{localError}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                text="Zmień hasło"
                type="primary"
                onClick={handleSubmit}
                customStyle="flex-1"
              />
              <Button
                text="Anuluj"
                type="secondary"
                onClick={closeModal}
                customStyle="flex-1"
              />
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export default ChangePassword;
