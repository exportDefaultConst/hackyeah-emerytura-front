import React, { useState } from "react";
import Button from "./Button";
import { API_URL } from "../constants";

const FAQSection = ({ userData, calculationResult, onFaqDataChange }) => {
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const generateFAQ = async () => {
    setLoading(true);
    setError(null);

    const faqPayload = {
      user_data: userData,
      calculation_result: calculationResult
    };

    try {
      const response = await fetch(`${API_URL}/api/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(faqPayload)
      });

      if (response.ok) {
        const result = await response.json();
        setFaqData(result);
        // Pass FAQ data to parent component for PDF generation
        if (onFaqDataChange) {
          onFaqDataChange(result);
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('FAQ generation failed:', err);
      setError(err.message);
      // Fallback to mock FAQ data
      const mockFaqData = {
        faq: [
          {
            question: "Czy moja emerytura będzie wystarczająca na utrzymanie obecnego stylu życia?",
            answer: "Na podstawie Twojej sytuacji finansowej, Twoja emerytura pokryje około " + calculationResult.replacement_rate + "% obecnych dochodów. Oznacza to, że będziesz potrzebować dodatkowych oszczędności lub rozważyć przedłużenie okresu pracy.",
            relevance: "high"
          },
          {
            question: "Kiedy najwcześniej mogę przejść na emeryturę?",
            answer: "Jako " + (userData.gender === "female" ? "kobieta" : "mężczyzna") + " w wieku " + userData.age + " lat, będziesz mogła przejść na emeryturę za około " + calculationResult.years_to_work_longer + " lat, przy założeniu standardowego wieku emerytalnego.",
            relevance: "high"
          },
          {
            question: "Jak wpłynie inflacja na moją przyszłą emeryturę?",
            answer: "Inflacja znacząco wpływa na siłę nabywczą emerytury. Dlatego nasze prognozy uwzględniają przewidywaną inflację i waloryzację świadczeń. Twoja emerytura będzie regularnie waloryzowana zgodnie z przepisami ZUS.",
            relevance: "medium"
          },
          {
            question: "Czy powinienem/powinnam dodatkowo oszczędzać na emeryturę?",
            answer: "Biorąc pod uwagę Twoją stopę zastąpienia " + calculationResult.replacement_rate + "%, zdecydowanie warto rozważyć dodatkowe oszczędności emerytalne, takie jak IKE, IKZE lub PPK, aby zapewnić sobie komfortową emeryturę.",
            relevance: "high"
          },
          {
            question: "Co się stanie, jeśli zmienię pracę lub branżę?",
            answer: "Zmiana pracy może wpłynąć na wysokość składek emerytalnych. Jeśli przejdziesz do lepiej płatnej pracy, zwiększy to Twoje przyszłe świadczenia. Warto regularnie aktualizować swoje prognozy emerytalne.",
            relevance: "medium"
          }
        ]
      };
      setFaqData(mockFaqData);
      // Pass mock FAQ data to parent component for PDF generation
      if (onFaqDataChange) {
        onFaqDataChange(mockFaqData);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getRelevanceIcon = (relevance) => {
    switch (relevance) {
      case "high": return "🟢";
      case "medium": return "🟡";
      case "low": return "🔴";
      default: return "💡";
    }
  };

  const getRelevanceText = (relevance) => {
    switch (relevance) {
      case "high": return "Istotna kwestia";
      case "medium": return "Umiarkowany wpływ";
      case "low": return "Mniejsze znaczenie";
      default: return "Informacyjne";
    }
  };

  if (!faqData) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Wygeneruj spersonalizowane pytania i odpowiedzi dostosowane do Twojej sytuacji emerytalnej
        </p>
        <Button
          text={loading ? "Generowanie FAQ..." : "Generuj FAQ"}
          onClick={generateFAQ}
          disabled={loading}
          customStyle="mx-auto"
        />
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
            <p className="text-sm text-yellow-700">
              ⚠️ Nie udało się połączyć z API. Wyświetlono przykładowe FAQ.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {faqData.faq.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getRelevanceIcon(item.relevance)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {item.question}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRelevanceText(item.relevance)}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ml-2 ${
                    expandedItems[index] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            
            {expandedItems[index] && (
              <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                <div className="pt-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    💡 {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="text-center pt-4">
        <Button
          text="Wygeneruj nowe FAQ"
          onClick={generateFAQ}
          disabled={loading}
          type="secondary"
          customStyle="text-sm"
        />
      </div> */}
    </div>
  );
};

export default FAQSection;