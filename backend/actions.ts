// // Create channels for the IPC communication

// import { User } from "./database";
// // This file defines the channels used for IPC communication in the application.
// async function addNumbers(a: number, b: number): Promise<number> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(a + b);
//     }, 1000);
//   });
// }

// async function someAsyncFunction(arg: string): Promise<string> {
//   // Simulate an asynchronous operation
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`Processed: ${arg}`);
//     }, 2000);
//   });
// }
// async function addUser(data: string) {
//   const res = await User.create({ dataValues: data });
//   console.log("User added: ", { res });
//   return res.dataValues as {
//     id: number;
//     name: string;
//     updateTimestamp: string;
//     createdAt: string;
//   };
// }

// const actions = {
//   addNumbers,
//   someAsyncFunction,
//   addUser,
// };
// export default actions;

//  type Channels = keyof typeof actions;
// export const CHANNELS = Object.keys(actions) as Readonly<Channels[]>;
