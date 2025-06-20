const READING_TYPE = ["Avg. Temp. [°C]", "Avg. DD[°C]"] as const;
const WZ = ["211", "341", "411", "600", "700", "811", "?"] as const;
const WEATHER_ZONES = [
  "0211-GP",
  "0341-FM",
  "0411-RD",
  "0600-CGY",
  "0700-LB",
  "0811-EDM",
] as const;
const WZ_MAP = {
  "211": "0211-GP",
  "341": "0341-FM",
  "411": "0411-RD",
  "600": "0600-CGY",
  "700": "0700-LB",
  "811": "0811-EDM",
  "?": "0811-EDM", // Default to Edmonton for unknown zones
} as const satisfies Record<
  (typeof WZ)[number],
  (typeof WEATHER_ZONES)[number]
>;
const METER_TYPE = ["SCADA", "CORRECTOR", "Corrector"] as const;
const NUM_OF_OUTLETS = ["?", "1", "2", "3", "4"] as const;
const OPERATING_SYSTEM_CONFIGURATION = ["Integrated", "Isolated", "0"] as const;
const CUSTOMER_CLASS = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "IRRIGATION",
  "UNASSIGNED",
] as const;
const USE_CLASS = [
  "APT",
  "COMM",
  "HCOM",
  "HIND",
  "INDU",
  "MAPT",
  "MCOM",
  "RES",
  "MIND",
  "HAPT",
  "MRES",
  "IRRI",
] as const;
const PROJECT_STATUS = [
  "Canceled",
  "Pending Approval",
  "Completed",
  "Inactive",
  "Waiting",
  "In progress",
  "Not started",
] as const;
const DEMAND_TIERS = {
  0: "Other (<1 TJ/d)",
  1: "Tier 3 (1-5 TJ/d)",
  5: "Tier 2 (5-15 TJ/d)",
  15: "Tier 1 (15-500 TJ/d)",
  500: "Cgy/Edm (500 TJ/d+)",
} as const;
const DESIGN_DAY_INFO = {
  "0600-CGY": {
    Temperature: -36,
    PHF: 1.12,
    DD: 50.9,
    WeatherZone: "Calgary",
  },
  "0811-EDM": {
    Temperature: -36,
    PHF: 1.15,
    DD: 51.1,
    WeatherZone: "Edmonton",
  },
  "0341-FM": {
    Temperature: -40,
    PHF: 1.1,
    DD: 54.3,
    WeatherZone: "Fort McMurray",
  },
  "0211-GP": {
    Temperature: -42,
    PHF: 1.07,
    DD: 56.8,
    WeatherZone: "Grande Prairie",
  },
  "0700-LB": {
    Temperature: -37,
    PHF: 1.08,
    DD: 52.7,
    WeatherZone: "Lethbridge",
  },
  "0411-RD": {
    Temperature: -41,
    PHF: 1.06,
    DD: 55.3,
    WeatherZone: "Red Deer",
  },
} as const satisfies Record<
  (typeof WEATHER_ZONES)[number],
  {
    WeatherZone: string;
    Temperature: number;
    PHF: number;
    DD: number;
  }
>;
const BALANCE_POINT = {
  "0211-GP": 14.8,
  "211": 14.8,
  "0341-FM": 14.3,
  "341": 14.3,
  "0411-RD": 14.3,
  "411": 14.3,
  "0600-CGY": 14.9,
  "600": 14.9,
  "0700-LB": 15.7,
  "700": 15.7,
  "0811-EDM": 15.1,
  "811": 15.1,
  "?": 0,
} as const satisfies Record<
  (typeof WEATHER_ZONES)[number] | (typeof WZ)[number],
  number
>;
export {
  BALANCE_POINT,
  CUSTOMER_CLASS,
  DEMAND_TIERS,
  DESIGN_DAY_INFO,
  METER_TYPE,
  NUM_OF_OUTLETS,
  OPERATING_SYSTEM_CONFIGURATION,
  PROJECT_STATUS,
  READING_TYPE,
  USE_CLASS,
  WEATHER_ZONES,
  WZ,
  WZ_MAP,
};
