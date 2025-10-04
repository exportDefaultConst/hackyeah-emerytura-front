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
  "Brak zmienności wynagrodzenia: (stała pensja)",
  "Indeksacja emerytury: inflacja 4% rocznie, realna wartość emerytury po 20 latach spada o ok. 28%",
  "Minimalna emerytura w 2025: 4684,80 PLN brutto",
];

const formattedCalculationDetails = calculationDetails.map((item) => {
  const [title, description] = item.split(":");
  return { title: title, description: description };
});

const DashboardPage = () => {
  return (
    <div className="p-6">
      <Card
        title="Wyniki Symulacji"
        description="Podsumowanie wyników symulacji emerytalnej."
        customClass="flex-col"
      >
        <div className="flex w-full">
          <Card
            title="Wysokość Rzeczywista"
            description="3840.00 PLN"
            customClass="w-1/2"
          />
          <Card
            title="Wysokość Urealniona"
            description="2760.00 PLN"
            customClass="w-1/2"
          />
        </div>
        <div className="flex flex-wrap -mx-2 justify-center">
          {formattedCalculationDetails.map((detail, index) => (
            <Card
              key={index}
              title={detail.title}
              description={detail.description}
              customClass="max-w-[200px] h-[200px] flex-grow p-2"
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;