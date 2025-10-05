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

export const RETIREMENT_AVG_PAY_IN_YEAR = {
  "2023": {
    "wariant1": 23307.70,
    "wariant2": 23379.58,
    "wariant3": 23271.59
  },
  "2024": {
    "wariant1": 25145.58,
    "wariant2": 25319.17,
    "wariant3": 25074.29
  },
  "2025": {
    "wariant1": 26401.95,
    "wariant2": 26589.16,
    "wariant3": 26319.25
  },
  "2026": {
    "wariant1": 27329.18,
    "wariant2": 27500.89,
    "wariant3": 27254.45
  },
  "2027": {
    "wariant1": 27991.47,
    "wariant2": 28147.56,
    "wariant3": 27927.24
  },
  "2028": {
    "wariant1": 28523.56,
    "wariant2": 28637.36,
    "wariant3": 28499.34
  },
  "2029": {
    "wariant1": 29004.60,
    "wariant2": 29025.07,
    "wariant3": 29029.90
  },
  "2030": {
    "wariant1": 29415.29,
    "wariant2": 29384.91,
    "wariant3": 29538.55
  },
  "2031": {
    "wariant1": 29508.98,
    "wariant2": 29403.72,
    "wariant3": 29719.17
  },
  "2032": {
    "wariant1": 29574.05,
    "wariant2": 29388.58,
    "wariant3": 29865.70
  },
  "2033": {
    "wariant1": 29634.10,
    "wariant2": 29365.98,
    "wariant3": 30026.00
  },
  "2034": {
    "wariant1": 29687.89,
    "wariant2": 29334.91,
    "wariant3": 30170.00
  },
  "2035": {
    "wariant1": 29746.29,
    "wariant2": 29308.77,
    "wariant3": 30325.66
  },
  "2036": {
    "wariant1": 29745.04,
    "wariant2": 29187.90,
    "wariant3": 30453.78
  },
  "2037": {
    "wariant1": 29742.85,
    "wariant2": 29078.05,
    "wariant3": 30577.83
  },
  "2038": {
    "wariant1": 29740.69,
    "wariant2": 28970.66,
    "wariant3": 30697.03
  },
  "2039": {
    "wariant1": 29735.77,
    "wariant2": 28865.64,
    "wariant3": 30814.57
  },
  "2040": {
    "wariant1": 29734.80,
    "wariant2": 28759.02,
    "wariant3": 30907.31
  },
  "2041": {
    "wariant1": 29638.31,
    "wariant2": 28522.99,
    "wariant3": 30945.00
  },
  "2042": {
    "wariant1": 29541.14,
    "wariant2": 28290.09,
    "wariant3": 30989.42
  },
  "2043": {
    "wariant1": 29451.36,
    "wariant2": 28066.76,
    "wariant3": 31037.34
  },
  "2044": {
    "wariant1": 29366.07,
    "wariant2": 27849.27,
    "wariant3": 31080.43
  },
  "2045": {
    "wariant1": 29275.29,
    "wariant2": 27707.97,
    "wariant3": 31113.59
  },
  "2046": {
    "wariant1": 29148.08,
    "wariant2": 27447.60,
    "wariant3": 31140.84
  },
  "2047": {
    "wariant1": 29023.14,
    "wariant2": 27194.80,
    "wariant3": 31169.22
  },
  "2048": {
    "wariant1": 28905.03,
    "wariant2": 26949.57,
    "wariant3": 31205.37
  },
  "2049": {
    "wariant1": 28786.02,
    "wariant2": 26712.02,
    "wariant3": 31247.48
  },
  "2050": {
    "wariant1": 28672.31,
    "wariant2": 26476.51,
    "wariant3": 31269.17
  },
  "2051": {
    "wariant1": 28798.20,
    "wariant2": 26454.69,
    "wariant3": 31578.85
  },
  "2052": {
    "wariant1": 28916.71,
    "wariant2": 26427.33,
    "wariant3": 31876.31
  },
  "2053": {
    "wariant1": 29042.43,
    "wariant2": 26405.60,
    "wariant3": 32176.33
  },
  "2054": {
    "wariant1": 29162.23,
    "wariant2": 26380.49,
    "wariant3": 32471.04
  },
  "2055": {
    "wariant1": 29283.56,
    "wariant2": 26352.05,
    "wariant3": 32769.14
  },
  "2056": {
    "wariant1": 29348.72,
    "wariant2": 26272.36,
    "wariant3": 33008.61
  },
  "2057": {
    "wariant1": 29411.49,
    "wariant2": 26193.45,
    "wariant3": 33246.81
  },
  "2058": {
    "wariant1": 29474.82,
    "wariant2": 26117.17,
    "wariant3": 33470.26
  },
  "2059": {
    "wariant1": 29538.06,
    "wariant2": 26039.73,
    "wariant3": 33699.16
  },
  "2060": {
    "wariant1": 29596.44,
    "wariant2": 25962.58,
    "wariant3": 33969.46
  },
  "2061": {
    "wariant1": 29845.46,
    "wariant2": 26040.19,
    "wariant3": 34416.13
  },
  "2062": {
    "wariant1": 30100.34,
    "wariant2": 26121.53,
    "wariant3": 34866.54
  },
  "2063": {
    "wariant1": 30348.09,
    "wariant2": 26198.44,
    "wariant3": 35349.65
  },
  "2064": {
    "wariant1": 30597.25,
    "wariant2": 26279.71,
    "wariant3": 35813.68
  },
  "2065": {
    "wariant1": 30857.43,
    "wariant2": 26372.43,
    "wariant3": 36323.39
  },
  "2066": {
    "wariant1": 31182.51,
    "wariant2": 26491.73,
    "wariant3": 36910.24
  },
  "2067": {
    "wariant1": 31512.56,
    "wariant2": 26610.35,
    "wariant3": 37519.36
  },
  "2068": {
    "wariant1": 31848.72,
    "wariant2": 26735.79,
    "wariant3": 38129.57
  },
  "2069": {
    "wariant1": 32187.07,
    "wariant2": 26880.26,
    "wariant3": 38743.55
  },
  "2070": {
    "wariant1": 32525.83,
    "wariant2": 27021.26,
    "wariant3": 39368.05
  },
  "2071": {
    "wariant1": 33071.37,
    "wariant2": 27289.91,
    "wariant3": 40284.67
  },
  "2072": {
    "wariant1": 33627.14,
    "wariant2": 27561.15,
    "wariant3": 41222.02
  },
  "2073": {
    "wariant1": 34189.43,
    "wariant2": 27839.12,
    "wariant3": 42169.24
  },
  "2074": {
    "wariant1": 34756.05,
    "wariant2": 28114.88,
    "wariant3": 43126.53
  },
  "2075": {
    "wariant1": 35301.08,
    "wariant2": 28393.26,
    "wariant3": 44097.74
  },
  "2076": {
    "wariant1": 35961.64,
    "wariant2": 28724.80,
    "wariant3": 45259.39
  },
  "2077": {
    "wariant1": 36630.07,
    "wariant2": 29059.98,
    "wariant3": 46436.88
  },
  "2078": {
    "wariant1": 37307.26,
    "wariant2": 29401.32,
    "wariant3": 47623.24
  },
  "2079": {
    "wariant1": 37997.19,
    "wariant2": 29747.12,
    "wariant3": 48835.75
  },
  "2080": {
    "wariant1": 38738.87,
    "wariant2": 30064.27,
    "wariant3": 50064.14
  }
}
