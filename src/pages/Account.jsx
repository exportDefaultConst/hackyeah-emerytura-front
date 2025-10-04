import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAccount from "../hooks/useAccount";
import Button from "../components/Button";
import Stats from "../components/Stats";
import Details from "../components/Details";
import ChangePassword from "../components/ChangePassword";

const mockUserData = {
  username: "jan.kowalski",
  email: "jan.kowalski@example.com",
  firstName: "Jan",
  lastName: "Kowalski",
  joinDate: "2024-01-15",
  lastLogin: "2024-09-27",
  avatar: null,
  accountType: "Premium",
  isVerified: true,
};

const mockUserStats = {
  "Dni aktywności": 47,
  "Ukończone zadania": 12,
  Osiągnięcia: 3,
};

const mockUserDetails = {
  "E-mail": mockUserData.email,
  Nazwa: mockUserData.username,
  "Data dołączenia": new Date(mockUserData.joinDate).toLocaleDateString(
    "pl-PL"
  ),
  "Typ konta": mockUserData.accountType,
};

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useAccount();

  const [isChangePasswdModalOpen, setIsChangePasswdModalOpen] = useState(false);

  // useEffect(() => {
  //   if (!userData) {
  //     navigate(-1);
  //   }
  // }, [userData]);

  const handleOpenChangePasswdModal = () => {
    setIsChangePasswdModalOpen(!isChangePasswdModalOpen);
  };

  const handleChangePassword = () => {
    console.log("Change password clicked");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account clicked");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje Konto</h1>
          <p className="text-gray-600">
            Zarządzaj swoimi informacjami osobistymi i ustawieniami konta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {mockUserData.firstName.charAt(0)}
                    {mockUserData.lastName.charAt(0)}
                  </span>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {mockUserData.username}
                </h2>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informacje o koncie
              </h3>

              <Details details={mockUserDetails} />
            </div>

            {/* account action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Akcje konta
              </h3>

              <div className="space-y-4">
                <Button
                  text="Zmień hasło"
                  type="secondary"
                  onClick={handleOpenChangePasswdModal}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Button>

                <Button
                  text="Usuń konto"
                  type="danger"
                  onClick={handleDeleteAccount}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics or Activity Section */}
        <Stats title="Statystyki konta" stats={mockUserStats} />
      </div>
      <ChangePassword
        isOpen={isChangePasswdModalOpen}
        onClose={handleOpenChangePasswdModal}
      />
    </>
  );
};

export default Account;
