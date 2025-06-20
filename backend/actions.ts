import { db } from "@/database";
/*  
Create channels for the IPC communication
This file defines the channels used for IPC communication in the application.
******* UPDATE CHANNELS IN FILE backend/preload.ts TO MATCH *******
*/
import { and, desc, eq, inArray, sum } from "drizzle-orm";
import { User } from "./database";

import { WZ_MAP } from "@/constants";
import type {
  CustomerClass,
  ReadingType,
  UseClass,
  WeatherZone,
} from "@/database/schema";
import {
  designDayDemandTable,
  dsInfo,
  hvAndSg,
  hvAndSg3YrAvgTable,
  interconnectTable,
  maxLoadDataTable,
  outletTable,
  projects,
  vrCustomers01,
  vrCustomers03,
  vrElevation,
  vrHucCount01,
  vrHucCount03,
  weatherData,
} from "@/database/schema";
const CustClassUseClassMap: Record<CustomerClass, UseClass[]> = {
  RESIDENTIAL: ["APT", "HAPT", "MAPT", "MRES", "RES"],
  COMMERCIAL: ["COMM", "HCOM", "MCOM"],
  INDUSTRIAL: ["HIND", "INDU", "MIND"],
  IRRIGATION: ["IRRI"],
  UNASSIGNED: [],
} as const;
const getCustomerCount = async (
  strCustClass: CustomerClass,
  strNS: "N" | "S",
  districtStationID: string
): Promise<number> => {
  if (strCustClass === "UNASSIGNED") return 0;
  const possibleUseClasses = CustClassUseClassMap[strCustClass];
  const tableToScan = strNS === "N" ? vrCustomers01 : vrCustomers03;
  const qry = await db
    .select({ count: sum(tableToScan["countOfSvcPt #"]) })
    .from(tableToScan)
    .where(
      and(
        eq(tableToScan.ds, districtStationID),
        inArray(tableToScan.useClass, possibleUseClasses)
      )
    );
  const res = parseInt(qry[0]?.count ?? "0");
  return res;
};
const qrycboProjectList = async () => {
  const res = await db
    .select({
      projectId: projects.projectId,
      projectTitle: projects.projectTitle,
      projectDSID: projects.dsId,
    })
    .from(projects)
    .orderBy(desc(projects.projectId));
  return res;
};
const qryCountHUC = async (strNS: "N" | "S", districtStationID: string) => {
  const tableToScan = strNS === "N" ? vrHucCount01 : vrHucCount03;
  const qry = await db
    .select({ count: sum(tableToScan["countOfSvcPt #"]) })
    .from(tableToScan)
    .groupBy(tableToScan.ds)
    .having(eq(tableToScan.ds, districtStationID));
  const res = parseInt(qry[0]?.count ?? "0");
  return res;
};
const getGasDay = async () => {
  const D_2022_1077 = 1704956400000;
  const qry = new Date(D_2022_1077);
  // const qry = new Date(1704956400000);
  return qry;
};
const getWeatherZone = async (districtStationID: string) => {
  const qry = await db
    .select({ wz: dsInfo.wz })
    .from(dsInfo)
    .where(eq(dsInfo.dsId, districtStationID))
    .limit(1);
  if (!qry?.[0]?.wz)
    throw new Error(`No district station found with ID: ${districtStationID}`);
  const shortWz = qry[0].wz;
  const result = {
    shortWz,
    longWz: WZ_MAP[shortWz],
  };
  return result;
};
const gas_Day_HV_SG_Query = async (
  districtStationID: string,
  gasDayDate: Date
) => {
  const qry = await db
    .select({
      // intId: interconnectTable.intId,
      // intName: interconnectTable.intName,
      // numOfOutlets: interconnectTable.numOfOutlets,
      heatValue: hvAndSg.heatValue,
      specificGravity: hvAndSg.specificGravity,
      // samplePoint: interconnectTable.samplePoint,
    })
    .from(dsInfo)
    .innerJoin(interconnectTable, eq(dsInfo.dsId, interconnectTable.dsId))
    .innerJoin(hvAndSg, eq(interconnectTable.samplePoint, hvAndSg.samplePoint))
    .where(
      and(
        eq(hvAndSg.dateAndTime, gasDayDate.getTime()),
        eq(dsInfo.dsId, districtStationID)
      )
    );
  if (qry.length === 0) {
    console.error(
      `No HV/SG data found for district station ID: ${districtStationID} on date: ${gasDayDate.toLocaleString()}`
    );
    return [
      {
        heatValue: 0,
        specificGravity: 0,
      },
    ];
    // throw new Error(
    //   `No HV/SG data found for district station ID: ${districtStationID} on date: ${gasDayDate.toLocaleString()}`,
    // );
  }
  return qry;
};
const maxLoadQuery = async (weatherZone: WeatherZone, temperature: number) => {
  const qry = await db
    .select({ percentMaxLoad: maxLoadDataTable["%MaximumLoad"] })
    .from(maxLoadDataTable)
    .where(
      and(
        eq(maxLoadDataTable.weatherzone, weatherZone),
        eq(
          maxLoadDataTable["temperature (°c)"],
          Number(Math.round(temperature).toFixed(0))
        )
      )
    );
  const percentMaxLoad = qry[0]?.percentMaxLoad;
  if (!percentMaxLoad)
    throw new Error(`No max load data found for weather zone: ${weatherZone}`);

  return 100 * percentMaxLoad;
};
const getDesignDayDemand = async (districtStationID: string) => {
  const qry = await db
    .select()
    .from(designDayDemandTable)
    .where(eq(designDayDemandTable.dsId, districtStationID))
    .limit(1);
  const designDayDemand = qry[0];
  if (!designDayDemand) {
    throw new Error(
      `No design day data found for district station ID: ${districtStationID}`
    );
  }
  return designDayDemand.designDayDemand;
};
const qryWeatherTemperatureForGasDay = async (
  weatherZone: WeatherZone,
  gasDay: Date,
  readingType: ReadingType
) => {
  const qry = await db
    .select()
    .from(weatherData)
    .where(
      and(
        eq(weatherData.weatherZone, weatherZone),
        eq(weatherData.readingType, readingType),
        eq(weatherData.date, gasDay.getTime())
      )
    )
    .limit(1);
  if (qry.length === 0)
    throw new Error(
      `No weather data found for zone: ${weatherZone} on reading Type: ${readingType}`
    );

  return qry[0];
};

const getInterconnectInfo = async (
  distributionSystemID: string,
  gasDayDate: Date
) => {
  const designDayHVSGCTE = db.$with("designDayHVSG").as(
    db
      .select({
        intId: interconnectTable.intId,
        intName: interconnectTable.intName,
        numOfOutlets: interconnectTable.numOfOutlets,
        samplePoint: interconnectTable.samplePoint,
        heatValue: hvAndSg.heatValue,
        specificGravity: hvAndSg.specificGravity,
      })
      .from(dsInfo)
      .innerJoin(interconnectTable, eq(dsInfo.dsId, interconnectTable.dsId))
      .innerJoin(
        hvAndSg,
        eq(interconnectTable.samplePoint, hvAndSg.samplePoint)
      )
      .where(
        and(
          eq(hvAndSg.dateAndTime, gasDayDate.getTime()),
          eq(dsInfo.dsId, distributionSystemID)
        )
      )
  );
  const qry = await db
    .with(designDayHVSGCTE)
    .select({
      intId: interconnectTable.intId,
      intName: interconnectTable.intName,
      meterType: interconnectTable.meterType,
      flowLocation: interconnectTable.flowLocation,
      numOfOutlets: interconnectTable.numOfOutlets,
      samplePoint: interconnectTable.samplePoint,
      threeYrAvgHV: hvAndSg3YrAvgTable["3YrAvgHv"],
      threeYrAvgSG: hvAndSg3YrAvgTable["3YrAvgSg"],
      heatValue: designDayHVSGCTE.heatValue,
      specificGravity: designDayHVSGCTE.specificGravity,
      outletNum: outletTable.outletNum,
      setPressure: outletTable.set,
      droop: outletTable.droop,
      capacity: outletTable.capacity,
    })
    .from(dsInfo)
    .innerJoin(hvAndSg3YrAvgTable, eq(dsInfo.dsId, interconnectTable.dsId))
    .rightJoin(
      interconnectTable,
      eq(hvAndSg3YrAvgTable.samplePoint, interconnectTable.samplePoint)
    )
    .leftJoin(
      designDayHVSGCTE,
      eq(interconnectTable.intId, designDayHVSGCTE.intId)
    )
    .leftJoin(outletTable, eq(interconnectTable.intId, outletTable.intId))
    .where(eq(dsInfo.dsId, distributionSystemID));
  if (qry.length === 0) {
    return null;
    // throw new Error(
    //   `No interconnect data found for distribution system ID: ${distributionSystemID}`,
    // );
  }
  return qry;
};
const INT_INFO_Query = async (
  distributionSystemID: string,
  gasDayDate: Date
) => {
  const designDayHVSGCTE = db.$with("designDayHVSG").as(
    db
      .select({
        intId: interconnectTable.intId,
        intName: interconnectTable.intName,
        numOfOutlets: interconnectTable.numOfOutlets,
        samplePoint: interconnectTable.samplePoint,
        heatValue: hvAndSg.heatValue,
        specificGravity: hvAndSg.specificGravity,
      })
      .from(dsInfo)
      .innerJoin(interconnectTable, eq(dsInfo.dsId, interconnectTable.dsId))
      .innerJoin(
        hvAndSg,
        eq(interconnectTable.samplePoint, hvAndSg.samplePoint)
      )
      .where(
        and(
          eq(hvAndSg.dateAndTime, gasDayDate.getTime()),
          eq(dsInfo.dsId, distributionSystemID)
        )
      )
  );
  const qry = await db
    .with(designDayHVSGCTE)
    .select({
      intId: interconnectTable.intId,
      intName: interconnectTable.intName,
      meterType: interconnectTable.meterType,
      flowLocation: interconnectTable.flowLocation,
      numOfOutlets: interconnectTable.numOfOutlets,
      samplePoint: interconnectTable.samplePoint,
      threeYrAvgHV: hvAndSg3YrAvgTable["3YrAvgHv"],
      threeYrAvgSG: hvAndSg3YrAvgTable["3YrAvgSg"],
      heatValue: designDayHVSGCTE.heatValue,
      specificGravity: designDayHVSGCTE.specificGravity,
    })
    .from(dsInfo)
    .innerJoin(hvAndSg3YrAvgTable, eq(dsInfo.dsId, interconnectTable.dsId))
    .rightJoin(
      interconnectTable,
      eq(hvAndSg3YrAvgTable.samplePoint, interconnectTable.samplePoint)
    )
    .leftJoin(
      designDayHVSGCTE,
      eq(interconnectTable.intId, designDayHVSGCTE.intId)
    )
    .where(eq(dsInfo.dsId, distributionSystemID));
  if (qry.length === 0) {
    return [{ threeYrAvgHV: 0, threeYrAvgSG: 0 }];
    // throw new Error(
    //   `No interconnect data found for distribution system ID: ${distributionSystemID}`,
    // );
  }
  return qry;
};
async function addNumbers(a: number, b: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  });
}
async function someAsyncFunction(arg: string): Promise<string> {
  /*   Simulate an asynchronous operation */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Processed: ${arg}`);
    }, 2000);
  });
}
async function addUser(data: string) {
  const res = await User.create({ dataValues: data });
  console.log("User added: ", { res });
  return res.dataValues as {
    id: number;
    name: string;
    updateTimestamp: string;
    createdAt: string;
  };
}
const INT_Info_Outlet_Query = async (projectId: string) => {
  const qry = await db
    .select({
      intId: interconnectTable.intId,
      intName: interconnectTable.intName,
      outletNum: outletTable.outletNum,
      setPressure: outletTable.set,
      droop: outletTable.droop,
      capacity: outletTable.capacity,
    })
    .from(dsInfo)
    .innerJoin(projects, eq(dsInfo.dsId, projects.dsId))
    .innerJoin(interconnectTable, eq(dsInfo.dsId, interconnectTable.dsId))
    .innerJoin(outletTable, eq(interconnectTable.intId, outletTable.intId))
    .where(eq(projects.projectId, projectId));

  if (qry.length === 0) {
    console.error(
      `No interconnect outlet information found for project ID: ${projectId}`
    );
    return null;
  }
  return qry;
};
const getProjectInfo = async (projectId: string) => {
  const query = await db
    .select()
    .from(projects)
    .where(eq(projects.projectId, projectId))
    .limit(1);
  const project = query[0];
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  return project;
};
const getProjectIDs = async () => {
  const query = await db.select({ id: projects.projectId }).from(projects);
  return query;
};
const getDSInfo = async (DS_ID: string) => {
  const query = await db.select().from(dsInfo).where(eq(dsInfo.dsId, DS_ID));
  const dsInfoData = query[0];
  if (!dsInfoData) {
    throw new Error(`Distribution System with ID ${DS_ID} not found`);
  }
  return dsInfoData;
};
const getDSElevation = async (DS_ID: string) => {
  const query = await db
    .select()
    .from(vrElevation)
    .where(eq(vrElevation.ds, DS_ID));
  const elevationData = query[0];
  if (!elevationData) {
    throw new Error(
      `Elevation data for Distribution System with ID ${DS_ID} not found`
    );
  }
  return elevationData;
};
const getNumberOfInterconnects = async (DS_ID: string) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const query = await db
    .select()
    .from(interconnectTable)
    .where(eq(interconnectTable.dsId, DS_ID));
  return query.length;
};
/* ******* UPDATE CHANNELS IN FILE backend/preload.ts TO MATCH ******* */
export const actions = {
  addNumbers,
  someAsyncFunction,
  addUser,
  getCustomerCount,
  qrycboProjectList,
  qryCountHUC,
  getGasDay,
  getWeatherZone,
  gas_Day_HV_SG_Query,
  maxLoadQuery,
  getDesignDayDemand,
  qryWeatherTemperatureForGasDay,
  getInterconnectInfo,
  INT_INFO_Query,
  INT_Info_Outlet_Query,
  getProjectIDs,
  getProjectInfo,
  getDSInfo,
  getDSElevation,
  getNumberOfInterconnects,
};

export type Channels = keyof typeof actions;
export const CHANNELS = Object.keys(actions) as Readonly<Channels[]>;
export type Actions = typeof actions;
