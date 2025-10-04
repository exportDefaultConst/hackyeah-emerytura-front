import React from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";

const placeholderText =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio pariatur dicta ad dolorem?";

const ErrorPopup = ({
  warningText = placeholderText,
  confirmBtnText = "Zrozumiano!",
  buttonAction,
}) => {
  return (
    <Modal onClose={buttonAction} className="w-64" isOnTop={true}>
      {({ closeModal }) => (
        <>
          <p className="text-center">{warningText}</p>
          <div className="flex flex-row justify-center w-full">
            <Button text={confirmBtnText} type="warning" onClick={closeModal} />
          </div>
        </>
      )}
    </Modal>
  );
};

export default ErrorPopup;
