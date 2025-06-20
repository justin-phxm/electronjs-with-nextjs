import { contextBridge, ipcRenderer } from "electron";
import type { Actions, Channels } from ".";
/* https://stackoverflow.com/questions/69019873/how-can-i-get-typed-object-entries-and-object-fromentries-in-typescript */
export const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>,
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};
const channelArray: Record<Channels, null> = {
  addNumbers: null,
  subNumbers: null,
};
const CHANNELS = Object.keys(channelArray) as Readonly<Channels[]>;

const api0 = CHANNELS.map((channel) => [
  channel,
  async (...args: unknown[]) => await ipcRenderer.invoke(channel, ...args),
]) as [PropertyKey, (...args: unknown[]) => unknown][];
export const api = typeSafeObjectFromEntries(api0) as Actions;
console.log({ api });
contextBridge.exposeInMainWorld("api", api);
export type Api = typeof api;
