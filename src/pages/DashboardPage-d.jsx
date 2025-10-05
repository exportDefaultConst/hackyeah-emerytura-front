import React from 'react';

// Dane bezpośrednio z Twojego obrazka
const daneSymulacji = {
  rzeczywistaKwota: 4642,
  urealnionaKwota: 6840,
  stopaZastepienia: 41.2,
  skladkowaStopa: 19.52,
  obecneWynagrodzenie: 8000,
  skladkiLacznia: '1 847 520 PLN',
  waloryzacjaStopa: '3.8%',
  inflacja2025: '3.7%',
  wzrostIT: 'przewyższający inflację',
  spadekIT: '-4.5%',
  wiek: 52,
  plec: 'kobieta',
  dodatkoweLata: 8,
  dlugoscZycia: '21 lat (254.3 miesiąca)',
};

// Pomocniczy komponent do wyświetlania pojedynczej metryki
const MetrykaKarta = ({ tytul, wartosc, opis, iconClass = "text-blue-500" }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full bg-gray-50 ${iconClass}`}>
        {/* Placeholder Icon (możesz zastąpić ikonami z biblioteki np. Heroicons) */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <p className="text-xs font-semibold uppercase text-gray-500">{tytul}</p>
    </div>
    <p className="mt-2 text-2xl font-bold text-gray-800">{wartosc}</p>
    {opis && <p className="mt-1 text-sm text-gray-500">{opis}</p>}
  </div>
);


const SymulacjaEmerytalna = () => {
  const { stopaZastepienia, urealnionaKwota, obecneWynagrodzenie } = daneSymulacji;

  // Obliczenie procentu dla paska postępu (Stopa Zastąpienia)
  const stopaProcent = Math.round(stopaZastepienia);
  const stopaKolor = stopaProcent < 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Wyniki Symulacji Emerytalnej</h1>
        <p className="text-lg text-gray-500 mb-8">Podsumowanie wyników symulacji emerytalnej na podstawie Twoich założeń.</p>

        {/* 1. SEKCJA GŁÓWNYCH WNIOSKÓW (HERO) */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Karta Rzeczywista */}
          <div className="p-6 bg-white border-b-4 border-green-500 shadow-2xl rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">Wysokość Rzeczywista (Dziś)</p>
            <p className="text-5xl font-bold text-green-700 mt-1 mb-3">{daneSymulacji.rzeczywistaKwota} PLN</p>
            <p className="text-lg text-gray-500">Miesięcznie (w obecnych cenach)</p>
          </div>
          
          {/* Karta Urealniona */}
          <div className="p-6 bg-white border-b-4 border-red-500 shadow-2xl rounded-2xl">
            <p className="text-xl font-semibold text-gray-600">Wysokość Urealniona (W Przyszłości)</p>
            <p className="text-5xl font-bold text-red-700 mt-1 mb-3">{daneSymulacji.urealnionaKwota} PLN</p>
            <p className="text-lg text-gray-500">Miesięcznie (po waloryzacji do przyszłych cen)</p>
          </div>
        </div>

        {/* WIZUALIZACJA STOPY ZASTĄPIENIA */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Realistyczna Stopa Zastąpienia: <span className="text-4xl font-extrabold text-indigo-600">{stopaZastepienia}%</span></h2>
          <p className="text-gray-600 mb-4">To oznacza, że Twoja prognozowana emerytura pokryje **{stopaProcent}%** Twojego obecnego wynagrodzenia brutto.</p>
          
          {/* Pasek Postępu (Stopa Zastąpienia) */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${stopaKolor}`}
                style={{ width: `${Math.min(stopaProcent, 100)}%` }}
                aria-valuenow={stopaProcent}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-800">{stopaProcent}%</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0 PLN</span>
            <span>{urealnionaKwota} PLN (Prognoza)</span>
            <span>{obecneWynagrodzenie} PLN (Obecne Wynagrodzenie)</span>
          </div>
        </div>
        
        {/* 2. SZCZEGÓŁY I ZAŁOŻENIA */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Szczegóły Prognozy i Założenia Symulacji</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kolumna 1: Finanse */}
          <MetrykaKarta 
            tytul="Obecne Wynagrodzenie" 
            wartosc={`${daneSymulacji.obecneWynagrodzenie} PLN`} 
            opis="Miesięcznie brutto"
            iconClass="text-indigo-500"
          />
          <MetrykaKarta 
            tytul="Składkowa Stopa Zastąpienia" 
            wartosc={`${daneSymulacji.skladkowaStopa}%`} 
            opis="Tylko ze składek emerytalnych"
            iconClass="text-red-500"
          />
          <MetrykaKarta 
            tytul="Szanowane Składki Łącznie" 
            wartosc={daneSymulacji.skladkiLacznia} 
            opis="Przez cały okres pracy"
            iconClass="text-green-500"
          />
          <MetrykaKarta 
            tytul="Stopa Waloryzacji (Prognoza)" 
            wartosc={daneSymulacji.waloryzacjaStopa} 
            opis="Średnio rocznie (INBP 2025-2029)"
            iconClass="text-amber-500"
          />
          {/* Kolumna 2: Czas i Wiek */}
          <MetrykaKarta 
            tytul="Wiek Użytkownika" 
            wartosc={`${daneSymulacji.wiek} lat`} 
            opis={`${daneSymulacji.plec.toUpperCase()}, System ZUS od 1999`}
            iconClass="text-purple-500"
          />
          <MetrykaKarta 
            tytul="Dodatkowe Lata Pracy" 
            wartosc={`${daneSymulacji.dodatkoweLata} lat`} 
            opis="Do osiągnięcia wieku emerytalnego"
            iconClass="text-cyan-500"
          />
          <MetrykaKarta 
            tytul="Przewidywana Długość Życia" 
            wartosc={daneSymulacji.dlugoscZycia} 
            opis="Po przekroczeniu wieku emerytalnego"
            iconClass="text-pink-500"
          />
          <MetrykaKarta 
            tytul="Inflacja 2025" 
            wartosc={daneSymulacji.inflacja2025} 
            opis="Prognozowana inflacja"
            iconClass="text-teal-500"
          />
        </div>

        {/* 3. PODSUMOWANIE I CTA (Call to Action) */}
        <div className="mt-12 p-8 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600 shadow-lg flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-indigo-800">Co dalej? Brakuje Ci {Math.round(100 - stopaProcent)}%</h3>
            <p className="text-indigo-700">Stopa zastąpienia na poziomie {stopaZastepienia}% oznacza, że aby utrzymać obecny standard, musisz oszczędzać.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
            Zmień Założenia lub Zobacz Plany Oszczędności
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">Dane z Redux Store • Ostatnia aktualizacja: 5.10.2025 03:58:33</p>
      </div>
    </div>
  );
};

export default SymulacjaEmerytalna;