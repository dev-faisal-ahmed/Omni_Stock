import { activityClient } from "@/lib/client";

export async function getLatestActivities() {
  const res = await activityClient.index.$get();
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data;
}
