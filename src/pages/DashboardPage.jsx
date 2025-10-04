import React from "react";
import Card from "../components/Card";

const calculationDetails = [
  "Wynagrodzenie brutto stałe: 8000 PLN/mc przez cały okres pracy",
  "Składka emerytalna: 1561,60 PLN/mc (19,52% wynagrodzenia brutto)",
  "Liczba lat pracy: 35 (2010-2045)",
  "Środki zgromadzone na koncie ZUS: 50 000 PLN, subkoncie: 15 000 PLN",
  "Waloryzacja składek i kapitału początkowego: 5,5% rocznie",
  "Średnie dalsze trwanie życia mężczyzny w wieku 65 lat: 14,8 lat (177 miesięcy) wg tablic GUS 2025",
  "Wpływ zwolnień lekarskich: 5 dni rocznie, brak składek za ten okres",
  "Brak zmienności wynagrodzenia (stała pensja)",
  "Indeksacja emerytury: inflacja 4% rocznie, realna wartość emerytury po 20 latach spada o ok. 28%",
  "Minimalna emerytura w 2025: 4684,80 PLN brutto",
];

const formattedCalculationDetails = calculationDetails.map((item) => {
  if (item.includes(":")) {
    const [title, description] = item.split(":");
    return { title: title, description: description };
  } else {
    // If there's no colon, use the entire text as description with no title
    return { title: "", description: item };
  }
});

const DashboardPage = () => {
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
            description="3840.00 PLN"
            secondaryDescription="miesięcznie"
            variant="highlight"
            customClass="h-24 md:h-32 lg:h-40 flex items-center justify-center green-description"
          />
          <Card
            title="Wysokość Urealniona"
            description="2760.00 PLN"
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
              variant="zus"
              customClass="w-32 h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 flex flex-col justify-center text-center flex-shrink-0"
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;