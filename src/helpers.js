export const errorFormatter = (code) => {
  switch (code) {
    case 400:
      return `Błąd danych po stronie klienta (${code})`;
    case 401:
      return `Nieautoryzowane działanie (${code})`;
    case 403:
      return `Działanie zablokowane! Spróbuj ponownie później (${code})`;
    case 404:
      return `Nie znaleziono podanej zawartości (${code})`;
    case 405:
      return `Niepoprawne użycie metody HTTP (${code})`;
    case 409:
      return `Konflikt, spróbuj ponownie (${code})`;
    case 413:
      return `Zbyt duża zawartość (${code})`;
    case 415:
      return `Niewspierane rozszerzenie pliku (${code})`;
    case 418:
      return `Jestem czajnikiem na herbatę, nie potrafię zaparzyć kawy ¯\_(ツ)_/¯ (${code})`;
    case 429:
      return `Zwolnij! Za szybko wykonujesz działania (${code})`;
    case 500:
      return `Błąd serwera (${code})`;
    case 501:
      return `Nieznane działanie (${code})`;
    case 502:
      return `Zła bramka (${code})`;
    case 503:
      return `Serwer nieosiągalny, działanie nie mogło zostać przetworzone (${code})`;

    default:
      return `Wystąpił nieznany błąd (${code})`;
  }
};
