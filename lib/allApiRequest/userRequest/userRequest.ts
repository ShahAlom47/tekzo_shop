/* eslint-disable @typescript-eslint/no-explicit-any */

import { request } from "../apiRequests";

export const createUser = async (data: any) => {
  return request("POST", "/user/register", {...data});
}
export const loginUser = async (phone: string, password: string) => {
  return request("POST", "/user/login", { phone, password });
}
// export const updateUserInfo = async (
//   userId: string,
//   data: {
//     fullName?: string;
//     role?: UserRole;
//     isActive?: boolean;
//   }
// ) => {
//   return request("PATCH", `/user/update/${userId}`, { ...data });
// };
// export const updateUserPassword = async (
//   userId: string,
//   data: {
//     oldPassword?: string;
//     newPassword?: string; 
//     role?: string;
//     isActive?: boolean;
//   }
// ) => {
//   return request("PATCH", `/user/changePass/${userId}`, { ...data });
// };


// export const getUserInfo = async (userEmail: string) => {
//   return request("GET", `/user/user-info/${userEmail}`);
// }



