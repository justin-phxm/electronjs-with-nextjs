import { actions } from "@/actions";
import {
  CUSTOMER_CLASS,
  METER_TYPE,
  NUM_OF_OUTLETS,
  OPERATING_SYSTEM_CONFIGURATION,
  PROJECT_STATUS,
  READING_TYPE,
  USE_CLASS,
  WEATHER_ZONES,
  WZ,
} from "@/constants";
import {
  index,
  int,
  integer,
  numeric,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const balancePointTable = sqliteTable("BalancePoint_Table", {
  weatherZone: text("WeatherZone", { length: 255 }),
  balancePoint: real("BalancePoint"),
});
export const designDayInfo = sqliteTable(
  "Design Day Info",
  {
    weatherZone: text("WeatherZone", { length: 255 }),
    temperature: real("Temperature"),
    phf: real("PHF"),
    dd: real("DD"),
    weatherZoneCode: text("WeatherZone Code", { length: 255 }),
  },
  (table) => [
    index("WeatherZone Code").on(
      table.weatherZone,
      table.temperature,
      table.phf,
      table.dd,
      table.weatherZoneCode
    ),
  ]
);

export const designDayDemandTable = sqliteTable("DesignDayDemand_Table", {
  dsId: text("DS_ID", { length: 255 }).primaryKey(),
  designDayDemand: real("Design Day Demand").notNull(),
});

export const dsInfo = sqliteTable("DS_Info", {
  dsId: text("DS_ID", { length: 255 }),
  dsName: text("DS Name", { length: 255 }),
  wz: text("WZ", { length: 255, enum: WZ }),
  dsType: text("DS Type", { length: 255, enum: ["Rural", "Urban", "?"] }),
  dsConfig: text("DS Config", { length: 255 }),
});

export const flowValueType = sqliteTable("Flow_Value_Type", {
  flowValueTypeId: numeric("Flow_Value_Type_ID"),
  flowValueType: text("Flow_Value_Type", { length: 255 }),
  type: text("Type", { length: 255 }),
});

export const hiddenInfoTable = sqliteTable(
  "Hidden Info Table",
  {
    gasDay: numeric("GasDay"),
    peakHourStart: numeric("Peak Hour Start"),
    peakHourEnd: numeric("Peak Hour End"),
    projectId: text("Project_ID", { length: 255 }),
  },
  (table) => [
    index("Project_ID").on(
      table.gasDay,
      table.peakHourStart,
      table.peakHourEnd,
      table.projectId
    ),
  ]
);

export const hucCustomersData = sqliteTable(
  "HUC Customers data",
  {
    servicePointNumber: text("Service Point Number", { length: 255 }),
    siteId: text("Site ID", { length: 255 }),
    dsId: text("DS_ID", { length: 255 }),
    address: text("Address", { length: 255 }),
    distributionPipe: text("Distribution Pipe", { length: 255 }),
    annualConsumption: numeric("Annual Consumption"),
    baseFactor: real("Base Factor"),
    heatFactor: real("Heat Factor"),
    factorCode: text("Factor Code", { length: 255 }),
    huc3YearPeakDemand: real("HUC 3-Year Peak Demand"),
  },
  (table) => [
    index("Site ID").on(
      table.servicePointNumber,
      table.siteId,
      table.dsId,
      table.address,
      table.distributionPipe,
      table.annualConsumption,
      table.baseFactor,
      table.heatFactor,
      table.factorCode,
      table.huc3YearPeakDemand
    ),
    uniqueIndex("Service Point Number").on(
      table.servicePointNumber,
      table.siteId,
      table.dsId,
      table.address,
      table.distributionPipe,
      table.annualConsumption,
      table.baseFactor,
      table.heatFactor,
      table.factorCode,
      table.huc3YearPeakDemand
    ),
    index("HUC Customers dataDS_ID").on(
      table.servicePointNumber,
      table.siteId,
      table.dsId,
      table.address,
      table.distributionPipe,
      table.annualConsumption,
      table.baseFactor,
      table.heatFactor,
      table.factorCode,
      table.huc3YearPeakDemand
    ),
    index("Factor Code").on(
      table.servicePointNumber,
      table.siteId,
      table.dsId,
      table.address,
      table.distributionPipe,
      table.annualConsumption,
      table.baseFactor,
      table.heatFactor,
      table.factorCode,
      table.huc3YearPeakDemand
    ),
  ]
);

export const hvAndSg = sqliteTable(
  "HV&SG",
  {
    hvAndSgId: integer("HV&SG_ID").primaryKey(),
    samplePoint: text("Sample Point", { length: 255 }).notNull(),
    dateAndTime: integer("Date&Time"),
    heatValue: real("Heat Value").notNull(),
    specificGravity: real("Specific Gravity").notNull(),
  },
  (table) => [
    index("HV&SG1Sample Point").on(
      table.hvAndSgId,
      table.samplePoint,
      table.dateAndTime,
      table.heatValue,
      table.specificGravity
    ),
  ]
);

export const hvAndSg3YrAvgTable = sqliteTable("HV&SG 3-Yr Avg Table", {
  samplePoint: text("Sample Point", { length: 255 }).primaryKey(),
  "3YrAvgHv": real("3-Yr Avg HV").notNull(),
  "3YrAvgSg": real("3-Yr Avg SG").notNull(),
});

export const interconnectTable = sqliteTable("Interconnect_Table", {
  intId: text("INT_ID", { length: 255 }).primaryKey(),
  intName: text("INT Name", { length: 255 }).unique().notNull(),
  legal: text("Legal", { length: 255 }).notNull(),
  hz: text("HZ", { length: 255 }),
  meterType: text("Meter Type", { length: 255, enum: METER_TYPE }).notNull(),
  flowLocation: text("Flow Location", { length: 255 }),
  dsId: text("DS_ID", { length: 255 }).notNull(),
  numOfOutlets: text("Num_Of_Outlets", {
    length: 255,
    enum: NUM_OF_OUTLETS,
  }).notNull(),
  samplePoint: text("Sample Point", { length: 255 }),
});

export const maxLoadDataTable = sqliteTable("Max Load Data Table", {
  id: numeric("ID").primaryKey(),
  weatherzone: text("Weatherzone", { length: 255, enum: WEATHER_ZONES }),
  "temperature (°c)": integer("Temperature (°C)"),
  degreeDay: real("Degree Day"),
  normal: real("Normal"),
  conservative: real("Conservative"),
  "%MaximumLoad": real("% Maximum Load"),
});

export const nameAutoCorrectSaveFailures = sqliteTable(
  "Name AutoCorrect Save Failures",
  {
    objectName: text("Object Name", { length: 255 }),
    objectType: text("Object Type", { length: 255 }),
    failureReason: text("Failure Reason", { length: 255 }),
    time: numeric("Time"),
  }
);

export const operatingSytemTable = sqliteTable("Operating_Sytem_Table", {
  osId: text("OS ID", { length: 255 }),
  osConfig: text("OS Config", {
    length: 255,
    enum: OPERATING_SYSTEM_CONFIGURATION,
  }),
  dsId: text("DS ID", { length: 255 }),
});

export const outletTable = sqliteTable("Outlet_Table", {
  outletTblId: numeric("Outlet_Tbl_ID"),
  intId: text("INT_ID", { length: 255 }),
  set: real("Set"),
  droop: real("Droop"),
  capacity: real("Capacity"),
  outletNum: numeric("Outlet_Num"),
  completedDate: integer("Completed Date"),
  link: numeric("Link"),
});

export const outletTableImporting = sqliteTable("Outlet_Table_Importing", {
  intId: text("INT_ID", { length: 255 }),
  set: real("Set"),
  droop: real("Droop"),
  capacity: real("Capacity"),
  outletNum: numeric("Outlet_Num"),
  completedDate: integer("Completed Date"),
  link: numeric("Link"),
});

export const pressureInstrumentsReadings = sqliteTable(
  "Pressure instruments - readings",
  {
    pressureReadingId: numeric("Pressure_Reading_ID"),
    timestamp: numeric("Timestamp"),
    instrumentId: text("Instrument ID", { length: 255 }),
    averagePressureKPa: real("Average Pressure kPa"),
  }
);

export const pressureInstrumentsSiteInfo = sqliteTable(
  "Pressure instruments - SiteInfo",
  {
    id: numeric("ID"),
    dsId: text("DS_ID", { length: 255 }),
    svcPt: text("SVC PT", { length: 255 }),
    instrumentId: text("Instrument ID", { length: 255 }),
    address: text("Address", { length: 255 }),
    distributionPipe: text("Distribution Pipe", { length: 255 }),
    siteId: text("Site ID", { length: 255 }),
    elevation: real("Elevation"),
    atmosphericPressureKPa: real("Atmospheric Pressure kPa"),
  }
);

export const projects = sqliteTable("Projects", {
  projectId: text("Project_ID", { length: 255 }).primaryKey(),
  dsId: text("DS_ID", { length: 255 }),
  projectOwner: text("ProjectOwner", { length: 255 }),
  projectTitle: text("Project Title", { length: 255 }).notNull(),
  projectType: text("ProjectType", { length: 255 }),
  startDate: integer("StartDate"),
  endDate: integer("EndDate"),
  status: text("Status", {
    length: 255,
    enum: PROJECT_STATUS,
  }).notNull(),
  modified: integer("Modified"),
});

export const scadaFlowValues = sqliteTable("SCADA Flow Values", {
  scadaDataId: numeric("SCADA_Data_ID"),
  dsId: text("DS_ID", { length: 255 }),
  intId: text("INT_ID", { length: 255 }),
  tagName: text("Tag Name", { length: 255 }),
  hourlyStartTime: numeric("Hourly Start Time"),
  engineeringValue: real("Engineering Value"),
  flowValueType: integer("FlowValueType"),
});

export const scadaOutletRelationship = sqliteTable(
  "SCADA Outlet Relationship",
  {
    id: numeric("ID"),
    tagName: text("Tag Name", { length: 255 }),
    outlet: real("Outlet"),
  }
);

export const sharepointDsList = sqliteTable("Sharepoint DS List", {
  id: numeric("ID"),
  dsId: text("DS_ID", { length: 255 }),
});

export const vrCustomers01 = sqliteTable("VR-Customers-01", {
  ds: text("DS", { length: 255 }),
  useClass: text("Use Class", { length: 255, enum: USE_CLASS }),
  "countOfSvcPt #": int("CountOfSvc Pt #").notNull(),
});

export const vrCustomers03 = sqliteTable("VR-Customers-03", {
  ds: text("DS", { length: 255 }),
  useClass: text("Use Class", { length: 255, enum: USE_CLASS }),
  "countOfSvcPt #": real("CountOfSvc Pt #").notNull(),
});

export const vrElevation = sqliteTable("VR-Elevation", {
  ds: text("DS", { length: 255 }),
  avgOfElevation: real("AvgOfElevation"),
});

export const vrHucCount01 = sqliteTable("VR-HUC-Count-01", {
  ds: text("DS", { length: 255 }),
  rateCode: text("Rate Code", { length: 255 }),
  "countOfSvcPt #": real("CountOfSvc Pt #"),
});

export const vrHucCount03 = sqliteTable("VR-HUC-Count-03", {
  ds: text("DS", { length: 255 }),
  "countOfSvcPt #": real("CountOfSvc Pt #"),
  rateCode: text("Rate Code", { length: 255 }),
});
export const weatherData = sqliteTable("Weather Data", {
  id: numeric("ID"),
  date: integer("Date"),
  temperature: real("Temperature"),
  readingType: text("Reading Type", {
    length: 255,
    enum: READING_TYPE,
  }),
  weatherZone: text("Weather Zone", { length: 255, enum: WEATHER_ZONES }),
});

export type Weather = typeof weatherData.$inferSelect;
export type WeatherZone = (typeof WEATHER_ZONES)[number];
export type ReadingType = (typeof READING_TYPE)[number];
export type Project = typeof projects.$inferSelect;
export type CustomerClass = (typeof CUSTOMER_CLASS)[number];
export type UseClass = (typeof USE_CLASS)[number];
export type ProjectStatus = (typeof PROJECT_STATUS)[number];
export type InterconnectInfo = NonNullable<
  Awaited<ReturnType<typeof actions.INT_Info_Outlet_Query>>
>[number];

export type InterconnectDetails = NonNullable<
  Awaited<ReturnType<typeof actions.getInterconnectInfo>>
>[number];
