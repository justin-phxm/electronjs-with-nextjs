import { contextBridge, ipcRenderer } from "electron";
import { type Actions, type Channels } from "./actions";
/* DO NOT IMPORT CONSTANTS INTO THIS FILE */
/* UPDATE THIS OBJECT WHENEVER A NEW CHANNEL IS ADDED */
const CHANNELS = Object.keys({
  addNumbers: null,
  someAsyncFunction: null,
  addUser: null,
  getCustomerCount: null,
  qrycboProjectList: null,
  qryCountHUC: null,
  getGasDay: null,
  getWeatherZone: null,
  gas_Day_HV_SG_Query: null,
  maxLoadQuery: null,
  getDesignDayDemand: null,
  qryWeatherTemperatureForGasDay: null,
  getInterconnectInfo: null,
  INT_INFO_Query: null,
} satisfies Record<Channels, null>);
const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

const api0 = CHANNELS.map((channel) => [
  channel,
  async (...args: unknown[]) => await ipcRenderer.invoke(channel, ...args),
]) as [PropertyKey, (...args: unknown[]) => unknown][];
const api = typeSafeObjectFromEntries(api0) as Actions;
console.log({ api });
contextBridge.exposeInMainWorld("api", api);
export type Api = typeof api;
