import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../constants";
import { setPensionData } from "../redux/slices/pensionSlice";
import Card from "../components/Card";
import Divider from "../components/Divider";
import Button from "../components/Button";

// Mock data as fallback
const mockApiResponse = {
  calculation_details: {
    assumptions: [
      "System ZUS od 1999 - formuła zdefiniowanej składki",
      "Waloryzacja składek przez 35 lat pracy (2010-2045)",
      "Wcześniejsza emerytura w wieku 55 lat (10 lat przed wiekiem emerytalnym)",
      "Branża IT - stabilne zatrudnienie, niskie ryzyko chorób zawodowych",
      "Realistyczna stopa zastąpienia: 52.3% (w górnej granicy dla osób młodych)",
      "Kapitał emerytalny po waloryzacji: około 1,050,000 PLN",
      "Uwzględniono prognozy inflacji NBP na lata 2025-2027",
    ],
    contribution_rate: "19.52%",
    life_expectancy_months: 210,
    total_contributions_estimated: 655872,
    valorization_rate:
      "średnio 2.2% rocznie (uwzględniając prognozy NBP: 2025: 4.9%, 2026: 3.4%, 2027: 2.5%)",
  },
  current_pension_projection: 4180,
  indexed_pension_projection: 6853,
  metadata: {
    api_model: "sonar-reasoning",
    calculation_date: "2025-10-04T19:51:18.152088",
    current_salary: 8000.0,
    user_age: 35,
    user_gender: "male",
  },
  minimum_pension_gap: null,
  replacement_rate: 52.3,
  salary_variability_impact: 15,
  sick_leave_impact: null,
  years_to_work_longer: 8,
};

// Komponent pomocniczy do wyświetlania pojedynczych metryk
const KartaMetryki = ({
  tytul,
  wartosc,
  opis,
  klasaIkony = "text-blue-500",
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full bg-gray-50 ${klasaIkony}`}>
        {/* Placeholder Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <p className="text-xs font-semibold uppercase text-gray-500">{tytul}</p>
    </div>
    <p className="mt-2 text-2xl font-bold text-gray-800">{wartosc}</p>
    {opis && <p className="mt-1 text-sm text-gray-500">{opis}</p>}
  </div>
);

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pensionData, loading, error, lastUpdated } = useSelector(
    (state) => state.pension
  );
  const { desiredAmount } = useSelector((state) => state.user);
  const [localError, setLocalError] = useState(null);

  // Funkcja do pobierania danych emerytalnych z API
  const fetchPensionData = async () => {
    try {
      setLocalError(null);
      const response = await fetch(`${API_URL}/api/get_pension_calculation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setPensionData(data));
    } catch (err) {
      console.error("Błąd podczas pobierania danych emerytalnych:", err);
      setLocalError(err.message);
      // Użyj danych testowych jako zapasowych
      dispatch(setPensionData(mockApiResponse));
    }
  };

  useEffect(() => {
    // Sprawdź, czy dane zostały przekazane z nawigacji (z formularza)
    if (location.state?.pensionData) {
      dispatch(setPensionData(location.state.pensionData));
    } else if (!pensionData) {
      // Pobierz dane z API, jeśli brak danych w stanie Redux i brak danych z nawigacji
      fetchPensionData();
    }
  }, [location.state, pensionData, dispatch]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Ładowanie danych emerytury...</p>
        </div>
      </div>
    );
  }

  if ((error || localError) && !pensionData) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            Błąd podczas ładowania danych: {error || localError}
          </p>
          <button
            onClick={fetchPensionData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // Wyciągnij dane z fallbackami
  const obecnaEmerytura = pensionData?.current_pension_projection || 4642;
  const urealnionaEmerytura = pensionData?.indexed_pension_projection || 6840;
  const stopaZastapieniaa = pensionData?.replacement_rate || 41.2;
  const stopaSkladkowa =
    pensionData?.calculation_details?.contribution_rate || "19.52%";
  const obecneWynagrodzenie = pensionData?.metadata?.current_salary || 8000;
  const laczneSkładki =
    pensionData?.calculation_details?.total_contributions_estimated || 1847520;
  const stopaWaloryzacji = "3.8%";
  const inflacja2025 = "3.7%";
  const wiekUzytkownika = pensionData?.metadata?.user_age || 52;
  const plecUzytkownika = pensionData?.metadata?.user_gender || "female";
  const dodatkoweLata = pensionData?.years_to_work_longer || 8;
  const dlugoscZycia = pensionData?.calculation_details?.life_expectancy_months
    ? `${Math.round(
        pensionData.calculation_details.life_expectancy_months / 12
      )} lat (${
        pensionData.calculation_details.life_expectancy_months
      } miesięcy)`
    : "21 lat (254.3 miesięcy)";

  // Oblicz procent dla paska postępu (Stopa Zastąpienia)
  const procentStopy = Math.round(stopaZastapieniaa);
  let kolorStopy;
  if (procentStopy <= 30) {
    kolorStopy = "red-500";
  } else if (procentStopy > 30 && procentStopy <= 60) {
    kolorStopy = "yellow-500";
  } else {
    kolorStopy = "green-500";
  }
  // const kolorStopy = procentStopy < 50 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl">Wysokość świadczeń emerytalnych</h1>
            <p className="text-muted-foreground">
              Podsumowanie wyników symulacji emerytalnej na podstawie Twoich
              założeń.
            </p>
          </div>

          {/* GŁÓWNE WNIOSKI */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Karta Wysokość Rzeczywista */}
            <div className="p-6 bg-grey-50 border-l-4 border-gray-500 rounded-lg">
              <p className="text-lg font-semibold text-gray-700">
                Wysokość Rzeczywista (Dziś)
              </p>
              <p className="text-4xl font-bold text-gray-700 mt-2 mb-2">
                {obecnaEmerytura.toLocaleString("pl-PL")} PLN
              </p>
              <p className="text-sm text-gray-600">
                Miesięcznie (ceny bieżące)
              </p>
            </div>

            {/* Karta Wysokość Urealniona */}
            <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-lg font-semibold text-gray-700">
                Wysokość Urealniona (Przysłość)
              </p>
              <p className="text-4xl font-bold text-green-700 mt-2 mb-2">
                {urealnionaEmerytura.toLocaleString("pl-PL")} PLN
              </p>
              <p className="text-sm text-gray-600">
                Miesięcznie (po indeksowaniu do przyszłych cen)
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Stopa Zastąpienia
            </h2>
            <p
              className={`text-4xl font-extrabold mt-2 ${
                procentStopy <= 30
                  ? "text-red-500"
                  : procentStopy > 30 && procentStopy <= 60
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {stopaZastapieniaa}%
            </p>
            <p className="text-gray-600 mt-2">
              Twoja prognozowana emerytura pokryje {procentStopy}% obecnego
              wynagrodzenia brutto
            </p>
          </div>

          {/* Pasek Postępu (Stopa Zastąpienia) */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full bg-${kolorStopy}`}
                style={{ width: `${Math.min(procentStopy, 100)}%` }}
                aria-valuenow={procentStopy}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {procentStopy}%
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>0 PLN</span>
            <span>
              {urealnionaEmerytura.toLocaleString("pl-PL")} PLN (Prognoza)
            </span>
            <span>
              {obecneWynagrodzenie.toLocaleString("pl-PL")} PLN (Obecne)
            </span>
          </div>
        </div>
      </Card>

      {/* PORÓWNANIE OCZEKIWAŃ Z PROGNOZĄ */}
      {desiredAmount && (
        <Card>
          <div
            className={`p-6 rounded-2xl shadow-xl mb-12 border border-gray-100 ${
              desiredAmount >= urealnionaEmerytura
                ? "bg-red-50 border-b-4 border-red-500"
                : "bg-green-50 border-b-4 border-green-500"
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Porównanie Oczekiwań z Prognozą
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              {/* Twoja Predykcja */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-600 mb-2">
                  Twoja predykcja wysokości świadczeń emerytalnych
                </p>
                <p
                  className={`text-4xl font-bold mb-2 ${
                    desiredAmount >= urealnionaEmerytura
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {desiredAmount.toLocaleString("pl-PL")} PLN
                </p>
                <p className="text-sm text-gray-500">
                  Miesięcznie (Twoje oczekiwania)
                </p>
              </div>

              {/* Średnie Świadczenie */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-600 mb-2">
                  Średnie świadczenie po przejściu na emeryturę
                </p>
                <p
                  className={`text-4xl font-bold mb-2 ${
                    desiredAmount >= urealnionaEmerytura
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {urealnionaEmerytura.toLocaleString("pl-PL")} PLN
                </p>
                <p className="text-sm text-gray-500">
                  Miesięcznie (Prognoza systemu)
                </p>
              </div>
            </div>

            {/* Różnica */}
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {desiredAmount >= urealnionaEmerytura ? "Niedobór" : "Nadwyżka"}
              </p>
              <p
                className={`text-3xl font-bold ${
                  desiredAmount >= urealnionaEmerytura
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {Math.abs(
                  desiredAmount - urealnionaEmerytura
                ).toLocaleString("pl-PL")}{" "}
                PLN
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {desiredAmount >= urealnionaEmerytura
                  ? "Musisz jeszcze przepracować x lat, aby osiągnąć wysokość świadczeń zgodną z twoimi oczekiwaniami."
                  : "Twoje oczekiwania są realistyczne"}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Inne Prognozy i Założenia
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Finanse */}
            <KartaMetryki
              tytul="Obecne Wynagrodzenie"
              wartosc={`${obecneWynagrodzenie.toLocaleString("pl-PL")} PLN`}
              opis="Miesięcznie brutto"
              klasaIkony="text-indigo-500"
            />
            <KartaMetryki
              tytul="Stopa Składkowa"
              wartosc={stopaSkladkowa}
              opis="Tylko ze składek emerytalnych"
              klasaIkony="text-red-500"
            />
            <KartaMetryki
              tytul="Szacowane Składki Łącznie"
              wartosc={`${laczneSkładki.toLocaleString("pl-PL")} PLN`}
              opis="Przez cały okres pracy"
              klasaIkony="text-green-500"
            />
            <KartaMetryki
              tytul="Stopa Waloryzacji"
              wartosc={stopaWaloryzacji}
              opis="Średnio rocznie (NBP 2025-2029)"
              klasaIkony="text-amber-500"
            />

            {/* Czas i Wiek */}
            <KartaMetryki
              tytul="Wiek Użytkownika"
              wartosc={`${wiekUzytkownika} lat`}
              opis={`${plecUzytkownika.toUpperCase()}, System ZUS od 1999`}
              klasaIkony="text-purple-500"
            />
            <KartaMetryki
              tytul="Dodatkowe Lata Pracy"
              wartosc={`${dodatkoweLata} lat`}
              opis="Do osiągnięcia wieku emerytalnego"
              klasaIkony="text-cyan-500"
            />
            <KartaMetryki
              tytul="Przewidywana Długość Życia"
              wartosc={dlugoscZycia}
              opis="Po osiągnięciu wieku emerytalnego"
              klasaIkony="text-pink-500"
            />
            <KartaMetryki
              tytul="Inflacja 2025"
              wartosc={inflacja2025}
              opis="Prognozowana inflacja w obecnym roku"
              klasaIkony="text-teal-500"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <div className="bg-(--color-zus-green)/5 p-6 rounded-lg border-l-4 border-(--color-zus-green)">
            <h3 className="text-xl font-bold text-(--color-zus-green) mb-2">
              Co dalej? Brakuje Ci {Math.round(100 - procentStopy)}%
            </h3>
            {stopaZastapieniaa < 100 ? (
              <p className="text-(--color-zus-yellow) mb-4">
                Stopa zastąpienia {stopaZastapieniaa}% oznacza, że aby utrzymać
                obecny standard, musisz oszczędzać.
              </p>
            ) : (
              <p className="text-(--color-zus-green) mb-4">
                Stopa zastąpienia {stopaZastapieniaa}% oznacza, że aby utrzymać
                obecny standard, NIE musisz oszczędzać.
              </p>
            )}
            {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Zmień Założenia lub Zobacz Plany Oszczędnościowe
            </button> */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                text="Zmień założenia"
                onClick={() => navigate("/wprowadz-dane")}
              />
              <Button text="Zobacz plany oszczędnościowe" />
            </div>
          </div>

          <Divider />

          {/* Wskaźnik źródła danych */}
          <div className="text-center text-xs text-gray-400">
            <p>
              {location.state?.pensionData
                ? "Dane z formularza"
                : error || localError
                ? "Dane testowe (błąd API)"
                : "Dane z Redux Store"}
              {lastUpdated && (
                <span className="ml-2">
                  • Ostatnia aktualizacja:{" "}
                  {new Date(lastUpdated).toLocaleDateString("pl-PL")}{" "}
                  {new Date(lastUpdated).toLocaleTimeString("pl-PL")}
                </span>
              )}
              {pensionData?.metadata?.calculation_date && (
                <span className="ml-2">
                  • Obliczono:{" "}
                  {new Date(
                    pensionData.metadata.calculation_date
                  ).toLocaleDateString("pl-PL")}
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
