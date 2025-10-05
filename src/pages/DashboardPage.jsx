import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../constants";
import { setPensionData } from "../redux/slices/pensionSlice";

// Mock data as fallback
const mockApiResponse = {
  "calculation_details": {
    "assumptions": [
      "System ZUS od 1999 - formuła zdefiniowanej składki",
      "Waloryzacja składek przez 35 lat pracy (2010-2045)",
      "Wcześniejsza emerytura w wieku 55 lat (10 lat przed wiekiem emerytalnym)",
      "Branża IT - stabilne zatrudnienie, niskie ryzyko chorób zawodowych",
      "Realistyczna stopa zastąpienia: 52.3% (w górnej granicy dla osób młodych)",
      "Kapitał emerytalny po waloryzacji: około 1,050,000 PLN",
      "Uwzględniono prognozy inflacji NBP na lata 2025-2027"
    ],
    "contribution_rate": "19.52%",
    "life_expectancy_months": 210,
    "total_contributions_estimated": 655872,
    "valorization_rate": "średnio 2.2% rocznie (uwzględniając prognozy NBP: 2025: 4.9%, 2026: 3.4%, 2027: 2.5%)"
  },
  "current_pension_projection": 4180,
  "indexed_pension_projection": 6853,
  "metadata": {
    "api_model": "sonar-reasoning",
    "calculation_date": "2025-10-04T19:51:18.152088",
    "current_salary": 8000.0,
    "user_age": 35,
    "user_gender": "male"
  },
  "minimum_pension_gap": null,
  "replacement_rate": 52.3,
  "salary_variability_impact": 15,
  "sick_leave_impact": null,
  "years_to_work_longer": 8
};

// Komponent pomocniczy do wyświetlania pojedynczych metryk
const KartaMetryki = ({ tytul, wartosc, opis, klasaIkony = "text-blue-500" }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full bg-gray-50 ${klasaIkony}`}>
        {/* Placeholder Icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
  const { pensionData, loading, error, lastUpdated } = useSelector((state) => state.pension);
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
  const stopaSkladkowa = pensionData?.calculation_details?.contribution_rate || "19.52%";
  const obecneWynagrodzenie = pensionData?.metadata?.current_salary || 8000;
  const laczneSkładki = pensionData?.calculation_details?.total_contributions_estimated || 1847520;
  const stopaWaloryzacji = "3.8%";
  const inflacja2025 = "3.7%";
  const wiekUzytkownika = pensionData?.metadata?.user_age || 52;
  const plecUzytkownika = pensionData?.metadata?.user_gender || "female";
  const dodatkoweLata = pensionData?.years_to_work_longer || 8;
  const dlugoscZycia = pensionData?.calculation_details?.life_expectancy_months ? 
    `${Math.round(pensionData.calculation_details.life_expectancy_months / 12)} lat (${pensionData.calculation_details.life_expectancy_months} miesięcy)` : 
    "21 lat (254.3 miesięcy)";

  // Oblicz procent dla paska postępu (Stopa Zastąpienia)
  const procentStopy = Math.round(stopaZastapieniaa);
  const kolorStopy = procentStopy < 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Wyniki Symulacji Emerytalnej</h1>
        <p className="text-lg text-gray-500 mb-8">Podsumowanie wyników symulacji emerytalnej na podstawie Twoich założeń.</p>

        {/* 1. GŁÓWNE WNIOSKI - SEKCJA HERO */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Karta Wysokość Rzeczywista */}
          <div className="p-6 bg-white border-b-4 border-green-500 shadow-2xl rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">Wysokość Rzeczywista (Dziś)</p>
            <p className="text-5xl font-bold text-green-700 mt-1 mb-3">{obecnaEmerytura.toLocaleString('pl-PL')} PLN</p>
            <p className="text-lg text-gray-500">Miesięcznie (w cenach bieżących)</p>
          </div>
          
          {/* Karta Wysokość Urealniona */}
          <div className="p-6 bg-white border-b-4 border-red-500 shadow-2xl rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">Wysokość Urealniona (Przyszłość)</p>
            <p className="text-5xl font-bold text-red-700 mt-1 mb-3">{urealnionaEmerytura.toLocaleString('pl-PL')} PLN</p>
            <p className="text-lg text-gray-500">Miesięcznie (po waloryzacji do przyszłych cen)</p>
          </div>
        </div>

        {/* WIZUALIZACJA STOPY ZASTĄPIENIA */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Realistyczna Stopa Zastąpienia: <span className="text-4xl font-extrabold text-indigo-600">{stopaZastapieniaa}%</span></h2>
          <p className="text-gray-600 mb-4">To oznacza, że Twoja prognozowana emerytura pokryje **{procentStopy}%** Twojego obecnego wynagrodzenia brutto.</p>
          
          {/* Pasek Postępu (Stopa Zastąpienia) */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${kolorStopy}`}
                style={{ width: `${Math.min(procentStopy, 100)}%` }}
                aria-valuenow={procentStopy}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-800">{procentStopy}%</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0 PLN</span>
            <span>{urealnionaEmerytura.toLocaleString('pl-PL')} PLN (Prognoza)</span>
            <span>{obecneWynagrodzenie.toLocaleString('pl-PL')} PLN (Obecne Wynagrodzenie)</span>
          </div>
        </div>
        
        {/* 2. SZCZEGÓŁY I ZAŁOŻENIA */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Szczegóły Prognozy i Założenia Symulacji</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kolumna 1: Finanse */}
          <KartaMetryki 
            tytul="Obecne Wynagrodzenie" 
            wartosc={`${obecneWynagrodzenie.toLocaleString('pl-PL')} PLN`} 
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
            wartosc={`${laczneSkładki.toLocaleString('pl-PL')} PLN`} 
            opis="Przez cały okres pracy"
            klasaIkony="text-green-500"
          />
          <KartaMetryki 
            tytul="Stopa Waloryzacji (Prognoza)" 
            wartosc={stopaWaloryzacji} 
            opis="Średnio rocznie (NBP 2025-2029)"
            klasaIkony="text-amber-500"
          />
          
          {/* Kolumna 2: Czas i Wiek */}
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
            opis="Prognozowana inflacja"
            klasaIkony="text-teal-500"
          />
        </div>

        {/* 3. PODSUMOWANIE I WEZWANIE DO DZIAŁANIA */}
        <div className="mt-12 p-8 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600 shadow-lg flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-indigo-800">Co dalej? Brakuje Ci {Math.round(100 - procentStopy)}%</h3>
            <p className="text-indigo-700">Stopa zastąpienia {stopaZastapieniaa}% oznacza, że aby utrzymać obecny standard, musisz oszczędzać.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
            Zmień Założenia lub Zobacz Plany Oszczędnościowe
          </button>
        </div>

        {/* Wskaźnik źródła danych */}
        <p className="text-center text-xs text-gray-400 mt-8">
          {location.state?.pensionData ? 
            "Dane z formularza" : 
            (error || localError) ? "Dane testowe (błąd API)" : "Dane z Redux Store"
          }
          {lastUpdated && (
            <span className="ml-2">
              • Ostatnia aktualizacja: {new Date(lastUpdated).toLocaleDateString('pl-PL')} {new Date(lastUpdated).toLocaleTimeString('pl-PL')}
            </span>
          )}
          {pensionData?.metadata?.calculation_date && (
            <span className="ml-2">
              • Obliczono: {new Date(pensionData.metadata.calculation_date).toLocaleDateString('pl-PL')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;