import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../constants";
import { setPensionData } from "../redux/slices/pensionSlice";
import Card from "../components/Card";
import Divider from "../components/Divider";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import FAQSection from "../components/FAQSection";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
  Font,
} from "@react-pdf/renderer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RETIREMENT_AVG_PAY_IN_YEAR } from "../constants";

// Register fonts for Polish character support
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Mock data as fallback
const mockApiResponse = {
  calculation_details: {
    assumptions: [
      "System kapitałowy ZUS od 1999 - formuła zdefiniowanej składki",
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

// Komponent wykresu prognozy
const PensionProjectionChart = () => {
  const chartData = Object.entries(RETIREMENT_AVG_PAY_IN_YEAR).map(
    ([year, values]) => ({
      year: parseInt(year),
      ...values,
    })
  );

  const formatYAxis = (value) => {
    return `${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value) => {
    return `${value.toFixed(2)} zł`;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="year"
            ticks={[2030, 2040, 2050, 2060, 2070, 2080]}
            domain={[2023, 2080]}
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="wariant1"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            name="Wariant Realistyczny"
          />
          <Line
            type="monotone"
            dataKey="wariant2"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={false}
            name="Wariant Pesymistyczny"
          />
          <Line
            type="monotone"
            dataKey="wariant3"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            name="Wariant Optymistyczny"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-blue-500"></div>
            <span className="font-semibold text-blue-900">
              Wariant Realistyczny
            </span>
          </div>
          <p className="text-gray-700">2023: 23 308 zł → 2080: 38 739 zł</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-red-500"></div>
            <span className="font-semibold text-red-900">
              Wariant Pesymistyczny
            </span>
          </div>
          <p className="text-gray-700">2023: 23 380 zł → 2080: 30 064 zł</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-green-500"></div>
            <span className="font-semibold text-green-900">
              Wariant Optymistyczny
            </span>
          </div>
          <p className="text-gray-700">2023: 23 272 zł → 2080: 50 064 zł</p>
        </div>
      </div>
    </div>
  );
};

const PensionReportPDF = ({ data, faqData = null }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      fontSize: 10,
      fontFamily: "Roboto",
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: "bold",
      color: "#1a365d",
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 15,
      fontWeight: "bold",
      color: "#2d3748",
    },
    section: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: "#f7fafc",
      borderRadius: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingVertical: 4,
    },
    label: {
      fontWeight: "bold",
      flex: 1,
    },
    value: {
      flex: 1,
      textAlign: "right",
      color: "#2d3748",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    gridItem: {
      width: "48%",
      marginBottom: 10,
      padding: 10,
      backgroundColor: "#edf2f7",
      borderRadius: 3,
    },
    gridLabel: {
      fontSize: 8,
      textTransform: "uppercase",
      color: "#718096",
      marginBottom: 4,
    },
    gridValue: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#1a202c",
      marginBottom: 2,
    },
    gridDescription: {
      fontSize: 8,
      color: "#4a5568",
    },
    highlight: {
      backgroundColor: "#e6fffa",
      padding: 15,
      borderRadius: 5,
      marginBottom: 15,
      borderLeft: "3px solid #38b2ac",
    },
    highlightTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#234e52",
      marginBottom: 8,
    },
    highlightText: {
      fontSize: 10,
      color: "#285e61",
      lineHeight: 1.4,
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: "center",
      fontSize: 8,
      color: "#718096",
      borderTop: "1px solid #e2e8f0",
      paddingTop: 10,
    },
    pageNumber: {
      position: "absolute",
      fontSize: 8,
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "#718096",
    },
    faqSection: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: "#f0f9ff",
      borderRadius: 5,
      borderLeft: "3px solid #0ea5e9",
    },
    faqTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#0c4a6e",
      marginBottom: 12,
    },
    faqItem: {
      marginBottom: 12,
      padding: 10,
      backgroundColor: "#ffffff",
      borderRadius: 3,
      borderLeft: "2px solid #e0e7ff",
    },
    faqQuestion: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#1e40af",
      marginBottom: 4,
    },
    faqAnswer: {
      fontSize: 9,
      color: "#374151",
      lineHeight: 1.4,
    },
    faqRelevance: {
      fontSize: 8,
      color: "#6b7280",
      marginBottom: 3,
    },
  });

  const {
    obecnaEmerytura,
    urealnionaEmerytura,
    stopaZastapieniaa,
    stopaSkladkowa,
    obecneWynagrodzenie,
    laczneSkładki,
    stopaWaloryzacji,
    inflacja2025,
    wiekUzytkownika,
    plecUzytkownika,
    dodatkoweLata,
    dlugoscZycia,
    desiredAmount,
    procentStopy,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Raport Świadczeń Emerytalnych</Text>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 30,
            fontSize: 10,
            color: "#718096",
          }}
        >
          Wygenerowano: {new Date().toLocaleDateString("pl-PL")}{" "}
          {new Date().toLocaleTimeString("pl-PL")}
        </Text>

        {/* Główne wyniki */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Wysokość Świadczeń Emerytalnych</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Wysokość Rzeczywista (Dziś):</Text>
            <Text style={styles.value}>
              {obecnaEmerytura.toLocaleString("pl-PL")} PLN
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wysokość Urealniona (Przyszłość):</Text>
            <Text style={styles.value}>
              {urealnionaEmerytura.toLocaleString("pl-PL")} PLN
            </Text>
          </View>
        </View>

        {/* Stopa zastąpienia */}
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>
            Stopa Zastąpienia: {stopaZastapieniaa}%
          </Text>
          <Text style={styles.highlightText}>
            Twoja prognozowana emerytura pokryje {procentStopy}% obecnego
            wynagrodzenia brutto.
            {stopaZastapieniaa < 100
              ? ` Oznacza to, że aby utrzymać obecny standard życia, musisz oszczędzać dodatkowo.`
              : ` Oznacza to, że NIE musisz oszczędzać dodatkowo.`}
          </Text>
        </View>

        {/* Porównanie z oczekiwaniami */}
        {desiredAmount && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Porównanie Oczekiwań z Prognozą</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Twoja predykcja:</Text>
              <Text style={styles.value}>
                {desiredAmount.toLocaleString("pl-PL")} PLN
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Prognoza systemu:</Text>
              <Text style={styles.value}>
                {urealnionaEmerytura.toLocaleString("pl-PL")} PLN
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>
                {desiredAmount >= urealnionaEmerytura
                  ? "Niedobór:"
                  : "Nadwyżka:"}
              </Text>
              <Text style={styles.value}>
                {Math.abs(desiredAmount - urealnionaEmerytura).toLocaleString(
                  "pl-PL"
                )}{" "}
                PLN
              </Text>
            </View>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Strona ${pageNumber} z ${totalPages}`
          }
          fixed
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Szczegółowe Prognozy i Założenia</Text>

        {/* Dane finansowe */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Dane Finansowe</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Obecne Wynagrodzenie</Text>
              <Text style={styles.gridValue}>
                {obecneWynagrodzenie.toLocaleString("pl-PL")} PLN
              </Text>
              <Text style={styles.gridDescription}>Miesięcznie brutto</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Stopa Składkowa</Text>
              <Text style={styles.gridValue}>{stopaSkladkowa}</Text>
              <Text style={styles.gridDescription}>
                Tylko ze składek emerytalnych
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Szacowane Składki Łącznie</Text>
              <Text style={styles.gridValue}>
                {laczneSkładki.toLocaleString("pl-PL")} PLN
              </Text>
              <Text style={styles.gridDescription}>Przez cały okres pracy</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Stopa Waloryzacji</Text>
              <Text style={styles.gridValue}>{stopaWaloryzacji}</Text>
              <Text style={styles.gridDescription}>
                Średnio rocznie (NBP 2025-2029)
              </Text>
            </View>
          </View>
        </View>

        {/* Dane demograficzne */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Dane Demograficzne i Czasowe</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Wiek Użytkownika</Text>
              <Text style={styles.gridValue}>{wiekUzytkownika} lat</Text>
              <Text style={styles.gridDescription}>{plecUzytkownika}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Dodatkowe Lata Pracy</Text>
              <Text style={styles.gridValue}>{dodatkoweLata} lat</Text>
              <Text style={styles.gridDescription}>
                Do osiągnięcia wieku emerytalnego
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Przewidywana Długość Życia</Text>
              <Text style={styles.gridValue}>{dlugoscZycia}</Text>
              <Text style={styles.gridDescription}></Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Inflacja 2025</Text>
              <Text style={styles.gridValue}>{inflacja2025}</Text>
              <Text style={styles.gridDescription}>
                Prognozowana inflacja w obecnym roku
              </Text>
            </View>
          </View>
        </View>

        {/* Rekomendacje */}
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>
            Co dalej? Brakuje Ci {Math.round(100 - procentStopy)}%
          </Text>
          <Text style={styles.highlightText}>
            {stopaZastapieniaa < 100
              ? `Stopa zastąpienia ${stopaZastapieniaa}% oznacza, że aby utrzymać obecny standard życia, musisz rozważyć dodatkowe oszczędności emerytalne lub przedłużenie okresu pracy.`
              : `Stopa zastąpienia ${stopaZastapieniaa}% oznacza, że emerytura z systemu publicznego będzie wystarczająca do utrzymania obecnego standardu życia.`}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Raport wygenerowany na podstawie danych z ZUS • System obliczeń
            emerytalnych
          </Text>
          <Text style={{ marginTop: 5 }}>
            Dokument ma charakter informacyjny i nie stanowi wiążącej prognozy
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Strona ${pageNumber} z ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* New FAQ Page */}
      {faqData && faqData.faq && faqData.faq.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Spersonalizowane FAQ</Text>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontSize: 10,
              color: "#718096",
            }}
          >
            Najczęściej zadawane pytania dostosowane do Twojej sytuacji
          </Text>

          <View style={styles.faqSection}>
            <Text style={styles.faqTitle}>Pytania i odpowiedzi</Text>

            {faqData.faq.slice(0, 8).map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqRelevance}>
                  {item.relevance === "high"
                    ? "Wysoka ważność"
                    : item.relevance === "medium"
                    ? "Średnia ważność"
                    : "Niska ważność"}
                </Text>
                <Text style={styles.faqQuestion}>
                  {index + 1}. {item.question}
                </Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text>
              FAQ wygenerowane na podstawie Twojej sytuacji emerytalnej
            </Text>
          </View>

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Strona ${pageNumber} z ${totalPages}`
            }
            fixed
          />
        </Page>
      )}
    </Document>
  );
};

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pensionData, loading, error, lastUpdated } = useSelector(
    (state) => state.pension
  );
  const { desiredAmount } = useSelector((state) => state.user);
  const [localError, setLocalError] = useState(null);
  // State to store FAQ data for PDF generation
  const [faqDataForPDF, setFaqDataForPDF] = useState(null);
  // State for savings plans modal
  const [showSavingsModal, setShowSavingsModal] = useState(false);

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
  const stopaZastapieniaa =
    Math.round(
      (pensionData?.indexed_pension_projection /
        pensionData?.metadata?.current_salary) *
        10000
    ) / 100 || 41.2;
  const stopaSkladkowa =
    pensionData?.calculation_details?.contribution_rate || "19.52%";
  const obecneWynagrodzenie = pensionData?.metadata?.current_salary || 8000;
  const laczneSkładki =
    pensionData?.calculation_details?.total_contributions_estimated || 1847520;
  const stopaWaloryzacji = "3.8%";
  const inflacja2025 = "3.7%";
  const wiekUzytkownika = pensionData?.metadata?.user_age || 52;
  const plecUzytkownika = pensionData?.metadata?.user_gender || "female";
  const dodatkoweLata =
    pensionData?.metadata?.user_gender === "female"
      ? 60 - pensionData?.metadata?.user_age
      : 65 - pensionData?.metadata?.user_age || 8;
  const dlugoscZycia = pensionData?.calculation_details?.life_expectancy_months
    ? `${Math.round(
        pensionData.calculation_details.life_expectancy_months / 12 +
          (pensionData?.metadata?.user_gender === "female" ? 60 : 65)
      )} lat`
    : "21 lat";
  const dlugoscZyciaDesc =
    `${
      pensionData.calculation_details.life_expectancy_months +
      (pensionData?.metadata?.user_gender === "female" ? 60 : 65) * 12
    } miesięcy` || "254.3 miesięcy";

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

  // PDF generation function
  const generatePDF = async () => {
    const pdfData = {
      obecnaEmerytura,
      urealnionaEmerytura,
      stopaZastapieniaa,
      stopaSkladkowa,
      obecneWynagrodzenie,
      laczneSkładki,
      stopaWaloryzacji,
      inflacja2025,
      wiekUzytkownika,
      plecUzytkownika,
      dodatkoweLata,
      dlugoscZycia,
      desiredAmount,
      procentStopy,
    };

    const blob = await pdf(
      <PensionReportPDF data={pdfData} faqData={faqDataForPDF} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `raport-emerytalny-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" id="pension-report">
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
            <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-lg font-semibold text-green-700">
                Wysokość Rzeczywista (Dziś)
              </p>
              <p className="text-4xl font-bold text-gray-700 mt-2 mb-2">
                {urealnionaEmerytura.toLocaleString("pl-PL")} PLN
              </p>
              <p className="text-sm text-gray-600">Miesięcznie Brutto</p>
            </div>

            {/* Karta Wysokość Urealniona */}
            <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-lg font-semibold text-red-700">
                Wysokość Urealniona (Przyszłość)
              </p>
              <p className="text-4xl font-bold text-gray-700 mt-2 mb-2">
                {obecnaEmerytura.toLocaleString("pl-PL")} PLN
              </p>
              <p className="text-sm text-gray-600">
                Miesięcznie (po inteligentnej analizie i indeksowaniu)
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
              Twoja prognozowana emerytura pokrywa {procentStopy}% obecnego
              przychodu
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
                {Math.abs(desiredAmount - urealnionaEmerytura).toLocaleString(
                  "pl-PL"
                )}{" "}
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
              Prognoza średnich świadczeń emerytalnych
            </h2>
            <p className="text-gray-600 mt-2">
              Prognoza wysokości świadczeń emerytalnych - trzy warianty rozwoju
              sytuacji (2023-2080) indeksowane inflacją
            </p>
          </div>
          <PensionProjectionChart />
        </div>
      </Card>

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
              opis="W trakcie całego okresu pracy"
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
              tytul="Informacje o Użytkowniku"
              wartosc={`${wiekUzytkownika} lat`}
              opis={`${plecUzytkownika === "female" ? "Kobieta" : "Mężczyzna"}`}
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
              opis={dlugoscZycia}
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

      {/* FAQ Section */}
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Spersonalizowane FAQ
            </h2>
            <p className="text-gray-600 mt-2">
              Najczęściej zadawane pytania dostosowane do Twojej sytuacji
            </p>
          </div>

          <FAQSection
            userData={{
              age: wiekUzytkownika,
              gender: plecUzytkownika,
              salary: obecneWynagrodzenie,
              industry: pensionData?.metadata?.industry || "IT",
              position: pensionData?.metadata?.position || "Developer",
            }}
            calculationResult={{
              monthly_pension: urealnionaEmerytura,
              replacement_rate: stopaZastapieniaa,
              years_to_work_longer: dodatkoweLata,
            }}
            onFaqDataChange={setFaqDataForPDF}
          />
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
              <Button
                text="Zobacz plany oszczędnościowe"
                onClick={() => setShowSavingsModal(true)}
              />
              <Button text="Drukuj" onClick={generatePDF} />
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

      {/* Savings Plans Modal */}
      {showSavingsModal && (
        <Modal
          isOpen={showSavingsModal}
          onClose={() => setShowSavingsModal(false)}
          title="Plany Oszczędnościowe"
          className="w-96 md:w-144"
        >
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">
              Sprawdź dodatkowe opcje oszczędzania na emeryturę:
            </p>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                <h3 className="font-semibold text-lg mb-2">Subkonto w ZUS</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Ogólne zasady dziedziczenia środków zgromadzonych w ZUS
                </p>
                <a
                  href="https://www.zus.pl/-/subkonto-w-zus-ogolne-zasady-dziedziczenia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Dowiedz się więcej
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                <h3 className="font-semibold text-lg mb-2">PZU PPE</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Pracowniczy Program Emerytalny dla pracowników
                </p>
                <a
                  href="https://in.pzu.pl/klienci-indywidualni/ppe-dla-pracownika"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Dowiedz się więcej
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                <h3 className="font-semibold text-lg mb-2">Moje PPK</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Pracownicze Plany Kapitałowe - dodatkowe oszczędności
                  emerytalne
                </p>
                <a
                  href="https://www.mojeppk.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                >
                  Dowiedz się więcej
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Uwaga:</strong> Te linki prowadzą do zewnętrznych stron
                internetowych. Zachęcamy do skonsultowania się z doradcą
                finansowym przed podjęciem decyzji inwestycyjnych.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
