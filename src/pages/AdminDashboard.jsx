import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../constants";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import zusLogoImg from "../assets/zus_logo.png";

const AdminDashboard = () => {
  const [records, setRecords] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Background animation states (for login page)
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

  // Get postal code from pension data
  const { pensionData } = useSelector((state) => state.pension);
  const currentSessionPostalCode = pensionData?.postal_code || "";

  const fetchRecords = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/calculations?secret=KluczAdmin123&page=${page}&per_page=20`
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();

      if (data) {
        setRecords(data.records || []);
        setHasNext(data.pagination?.has_next);
        setHasPrev(data.pagination?.has_prev);
        setCurPage(data.pagination?.page);
        setTotalPages(data.pagination?.total_pages);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      fetchRecords(curPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      fetchRecords(curPage - 1);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      setLoginError("Nieprawidłowa nazwa użytkownika lub hasło");
    }
  };

  const exportToExcel = async () => {
    if (!totalPages) return;

    setLoading(true);
    try {
      // Calculate total records and fetch all at once
      const totalRecords = totalPages * 20;
      const res = await fetch(
        `${API_URL}/api/calculations?secret=KluczAdmin123&page=1&per_page=${totalRecords}`
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();
      const allRecords = data.records || [];

      if (allRecords.length === 0) return;

      // Create CSV content with proper Polish character handling
      const headers = [
        "ID",
        "Wiek",
        "Płeć",
        "Wynagrodzenie",
        "Stanowisko",
        "Branża",
        "Kod pocztowy",
        "Rok rozpoczęcia pracy",
        "Rok zakończenia pracy",
        "Saldo konta ZUS",
        "Saldo subkonta ZUS",
        "Obecna prognoza emerytury",
        "Zindeksowana prognoza",
        "Stopa zastąpienia",
        "Data obliczenia",
      ];

      // Use semicolon delimiter for Polish Excel compatibility
      const delimiter = ";";

      // Escape CSV values to handle semicolons and quotes
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return "";
        const str = String(value);
        // Always wrap in quotes to ensure proper cell separation
        return `"${str.replace(/"/g, '""')}"`;
      };

      // Create header row
      const headerRow = headers.map(escapeCSV).join(delimiter);

      // Create data rows
      const dataRows = allRecords.map((record) => {
        const row = [
          record.id || "",
          record.user_data?.age || record.user_data_full?.age || "",
          (record.user_data?.gender || record.user_data_full?.gender) === "male"
            ? "Mężczyzna"
            : "Kobieta",
          record.user_data?.gross_salary ||
            record.user_data_full?.gross_salary ||
            "",
          record.user_data?.position ||
            record.user_data_full?.position ||
            "N/A",
          record.user_data?.industry ||
            record.user_data_full?.industry ||
            "N/A",
          record.user_data?.postal_code ||
            record.user_data_full?.postal_code ||
            "",
          record.user_data?.work_start_year ||
            record.user_data_full?.work_start_year ||
            "",
          record.user_data?.work_end_year ||
            record.user_data_full?.work_end_year ||
            "",
          record.user_data_full?.zus_account_balance || 0,
          record.user_data_full?.zus_subaccount_balance || 0,
          record.result_full?.current_pension_projection || "",
          record.result_full?.indexed_pension_projection || "",
          record.result_full?.replacement_rate ||
            record.results?.replacement_rate ||
            "",
          new Date(record.calculation_date).toISOString() || "",
        ];
        return row.map(escapeCSV).join(delimiter);
      });

      // Combine all rows
      const csvContent = [headerRow, ...dataRows].join("\r\n");

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = "\uFEFF";
      const csvWithBOM = BOM + csvContent;

      // Create and download file with proper encoding
      const blob = new Blob([csvWithBOM], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `wszystkie_rekordy_emerytalne_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Błąd podczas eksportu danych");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }

    // Add event listeners for background animation
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    console.log(records);
  }, [records]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, var(--color-zus-green) ${
            gradientPosition - 100
          }%, #008a39 ${gradientPosition + 100}%)`,
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

        <div
          className="bg-white rounded-xl p-12 flex md:flex-row flex-col items-center w-9/10 lg:max-w-4xl scale-105 relative"
          style={{ zIndex: 50 }}
        >
          <div className="flex flex-col w-full md:w-2/3">
            <div className="mb-8">
              <h2 className="font-extrabold text-4xl color-zus-green mb-2">
                Panel Administratora
              </h2>
              <p className="color-zus-grey text-sm mb-4">by ZUS</p>
              <p className="mb-6 text-base">
                Zaloguj się do panelu administratora, aby uzyskać dostęp do
                danych symulacji emerytalnych.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium color-zus-grey mb-1">
                  Nazwa użytkownika
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Wprowadź nazwę użytkownika"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium color-zus-grey mb-1">
                  Hasło
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wprowadź hasło"
                  required
                />
              </div>

              {loginError && (
                <div className="text-red-500 text-sm mt-2">{loginError}</div>
              )}

              <div className="flex pt-4">
                <Button
                  text="Zaloguj się"
                  type="primary"
                  customStyle="w-full md:w-auto"
                />
              </div>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs color-zus-grey">
                <strong>Dane testowe:</strong>
                <br />
                Użytkownik: admin
                <br />
                Hasło: admin
              </p>
            </div>
          </div>

          <div className="flex justify-center md:w-1/3 mt-8 md:mt-0">
            <img
              src={zusLogoImg}
              alt="ZUS Logo"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading && !records) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Ładowanie danych...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="flex flex-col justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-900 text-center">
                Panel Administratora
              </h1>
              <p className="text-gray-600 mt-1 text-center">
                Zarządzanie rekordami obliczeń emerytalnych
              </p>
            </div>
            <Button
              onClick={exportToExcel}
              disabled={!records || records.length === 0}
              customStyle="bg-green-600 hover:bg-green-700 text-white flex justify-center"
            >
              📊 Eksportuj Excel
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Użytkownik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wynagrodzenie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Praca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branża
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prognoza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stopa %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kod pocztowy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records && records.length > 0 ? (
                  records.map((record) => {
                    const userData =
                      record.user_data || record.user_data_full || {};
                    const resultData =
                      record.result_full || record.results || {};
                    const age = userData.age;
                    const gender = userData.gender;
                    const salary = userData.gross_salary;
                    const workStart = userData.work_start_year;
                    const workEnd = userData.work_end_year;
                    const industry = userData.industry;
                    const position = userData.position;
                    const currentPension =
                      resultData.current_pension_projection;
                    const replacementRate = resultData.replacement_rate;
                    const postalCode = userData.postal_code || "Brak";

                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span>{age} lat</span>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  gender === "male"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-pink-100 text-pink-800"
                                }`}
                              >
                                {gender === "male" ? "M" : "K"}
                              </span>
                            </div>
                            {position && (
                              <span className="text-xs text-gray-400">
                                {position}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {salary?.toLocaleString("pl-PL")} PLN
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workStart} - {workEnd}
                          <div className="text-xs text-gray-400">
                            {workEnd - workStart} lat
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {industry || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {currentPension?.toLocaleString("pl-PL")} PLN
                            </span>
                            {resultData.indexed_pension_projection && (
                              <span className="text-xs text-gray-400">
                                Zindeks.:{" "}
                                {resultData.indexed_pension_projection?.toLocaleString(
                                  "pl-PL"
                                )}{" "}
                                PLN
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              replacementRate >= 50
                                ? "bg-green-100 text-green-800"
                                : replacementRate >= 40
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {replacementRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {postalCode || "Brak"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.calculation_date).toLocaleDateString(
                            "pl-PL"
                          )}
                          <div className="text-xs text-gray-400">
                            {new Date(
                              record.calculation_date
                            ).toLocaleTimeString("pl-PL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Brak danych do wyświetlenia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrev || loading}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>
              <button
                onClick={handleNextPage}
                disabled={!hasNext || loading}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Strona <span className="font-medium">{curPage}</span> z{" "}
                  <span className="font-medium">{totalPages || 1}</span>
                  {records && (
                    <span className="ml-2">
                      (wyświetlane {records.length} rekordów)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrev || loading}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Poprzednia</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                    {curPage}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNext || loading}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Następna</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;

// arrow left: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>

// arror right:<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
