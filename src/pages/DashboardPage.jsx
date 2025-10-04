import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Card from "../components/Card";
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

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { pensionData, loading, error, lastUpdated } = useSelector((state) => state.pension);
  const [localError, setLocalError] = useState(null);

  // Function to fetch pension data from API
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
      console.error("Error fetching pension data:", err);
      setLocalError(err.message);
      // Use mock data as fallback
      dispatch(setPensionData(mockApiResponse));
    }
  };

  useEffect(() => {
    // Check if data was passed from navigation state (from form submission)
    if (location.state?.pensionData) {
      dispatch(setPensionData(location.state.pensionData));
    } else if (!pensionData) {
      // Fetch data from API if no data in Redux state and no navigation state
      fetchPensionData();
    }
  }, [location.state, pensionData, dispatch]);

  // Transform API response into card format
  const transformApiDataToCards = (data) => {
    if (!data?.calculation_details) return [];

    const cards = [];

    // Add assumptions as cards
    if (data.calculation_details.assumptions) {
      data.calculation_details.assumptions.forEach((assumption) => {
        const cardData = formatAssumptionToCard(assumption);
        cards.push(cardData);
      });
    }

    // Add other calculation details as cards
    const additionalDetails = [
      {
        title: "Stopa składkowa",
        description: data.calculation_details.contribution_rate || "19.52%",
        secondaryDescription: "składki emerytalne"
      },
      {
        title: "Oczekiwana długość życia",
        description: `${Math.round((data.calculation_details.life_expectancy_months || 210) / 12)} lat`,
        secondaryDescription: `${data.calculation_details.life_expectancy_months || 210} miesięcy`
      },
      {
        title: "Szacowane składki łącznie",
        description: `${(data.calculation_details.total_contributions_estimated || 655872).toLocaleString('pl-PL')} PLN`,
        secondaryDescription: "przez cały okres pracy"
      },
      {
        title: "Stopa waloryzacji",
        description: data.calculation_details.valorization_rate || "średnio 2.2% rocznie",
        secondaryDescription: null
      }
    ];

    cards.push(...additionalDetails);

    // Add metadata as cards if available
    if (data.metadata) {
      const metadataCards = [
        {
          title: "Wiek użytkownika",
          description: `${data.metadata.user_age || 35} lat`,
          secondaryDescription: data.metadata.user_gender === "male" ? "mężczyzna" : "kobieta"
        },
        {
          title: "Obecne wynagrodzenie",
          description: `${(data.metadata.current_salary || 8000).toLocaleString('pl-PL')} PLN`,
          secondaryDescription: "miesięcznie brutto"
        }
      ];
      cards.push(...metadataCards);
    }

    // Add result metrics as cards
    const resultCards = [
      {
        title: "Stopa zastąpienia",
        description: `${data.replacement_rate || 52.3}%`,
        secondaryDescription: "stosunek emerytury do ostatniego wynagrodzenia"
      }
    ];

    if (data.years_to_work_longer) {
      resultCards.push({
        title: "Dodatkowe lata pracy",
        description: `${data.years_to_work_longer} lat`,
        secondaryDescription: "dla lepszej emerytury"
      });
    }

    if (data.salary_variability_impact) {
      resultCards.push({
        title: "Wpływ zmienności wynagrodzenia",
        description: typeof data.salary_variability_impact === 'string' 
          ? data.salary_variability_impact 
          : `${data.salary_variability_impact}%`,
        secondaryDescription: typeof data.salary_variability_impact === 'string' 
          ? null 
          : "wpływ na wysokość emerytury"
      });
    }

    if (data.sick_leave_impact) {
      resultCards.push({
        title: "Wpływ zwolnień lekarskich",
        description: typeof data.sick_leave_impact === 'string' 
          ? data.sick_leave_impact 
          : `${data.sick_leave_impact} PLN`,
        secondaryDescription: typeof data.sick_leave_impact === 'string' 
          ? null 
          : "miesięczny wpływ"
      });
    }

    cards.push(...resultCards);

    return cards;
  };

  // Helper function to format assumptions into card format
  const formatAssumptionToCard = (assumption) => {
    if (assumption.includes(":")) {
      const [title, descriptionPart] = assumption.split(":");
    
    // Extract content within parentheses for secondaryDescription
    const parenthesesMatch = descriptionPart.match(/\(([^)]+)\)/);
    const secondaryDescription = parenthesesMatch ? parenthesesMatch[1] : null;
    
    // Remove parentheses content from main description
    const description = descriptionPart.replace(/\s*\([^)]+\)/g, '').trim();
    
    return { 
      title: title.trim(), 
      description: description,
      secondaryDescription: secondaryDescription
    };
  } else {
    // If there's no colon, check for parentheses in the entire text
    const parenthesesMatch = assumption.match(/\(([^)]+)\)/);
    const secondaryDescription = parenthesesMatch ? parenthesesMatch[1] : null;
    const description = assumption.replace(/\s*\([^)]+\)/g, '').trim();
    
    return { 
      title: "", 
      description: description,
      secondaryDescription: secondaryDescription
    };
  }
};

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

const formattedCalculationDetails = transformApiDataToCards(pensionData);

  return (
    <div className="p-4 md:p-6 md:h-screen md:overflow-hidden">
      <Card
        title="Wyniki Symulacji"
        description="Podsumowanie wyników symulacji emerytalnej."
        customClass="flex-col text-center md:h-full md:overflow-y-auto"
      >
        {/* Main pension amounts - responsive scaling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 w-full mb-4 md:mb-6">
          <Card
            title="Wysokość Rzeczywista"
            description={`${(pensionData?.current_pension_projection || 4180).toLocaleString('pl-PL')} PLN`}
            secondaryDescription="miesięcznie"
            variant="highlight"
            customClass="h-24 md:h-32 lg:h-40 flex items-center justify-center green-description"
          />
          <Card
            title="Wysokość Urealniona"
            description={`${(pensionData?.indexed_pension_projection || 6853).toLocaleString('pl-PL')} PLN`}
            secondaryDescription="miesięcznie"
            variant="highlight"
            customClass="h-24 md:h-32 lg:h-40 flex items-center justify-center red-description"
          />
        </div>

        {/* Calculation details flexbox - viewport fitting */}
        <div className="flex flex-wrap justify-center gap-1 w-full md:flex-1">
          {formattedCalculationDetails.map((detail, index) => (
            <Card
              key={index}
              title={detail.title}
              description={detail.description}
              secondaryDescription={detail.secondaryDescription}
              variant="zus"
              customClass="w-32 h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 flex flex-col justify-center text-center flex-shrink-0"
            />
          ))}
        </div>
        {/* Data source indicator */}
        <div className="mt-4 text-sm text-gray-500">
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
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;