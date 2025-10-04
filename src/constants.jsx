export const APP_NAME = "Lorem ipsum";
export const API_URL = "https://sym.packt.pl";
export const completelyUnknownError =
  "Całkowicie nieznany błąd, jak to zrobiłxś?? :(";

export const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*&_])[A-Za-z\d@#$!%*&_]{8,15}$/; // 15 characters, at least: one lower, one upper, one digit, one special (@#$!%*&_)
export const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWD_CHECK_INFO = (
  <>
    <div>Hasło musi zawierać:</div>
    <ul className="list-disc pl-5">
      <li>Duże i małe litery</li>
      <li>Znaki specjalne (@#$!%*&_)</li>
      <li>Cyfry</li>
      <li>Długość 8-15 znaków</li>
    </ul>
  </>
);