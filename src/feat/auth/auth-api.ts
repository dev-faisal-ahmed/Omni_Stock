import { authClient } from "@/lib/client";
import { TLoginFormData, TRegisterFormData } from "./auth-schema";

export async function registerApi(payload: TRegisterFormData) {
  const res = await authClient.register.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function loginApi(payload: TLoginFormData) {
  const res = await authClient.login.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
