import { Hono } from "hono";
import { ActivityService } from "./activity.service";
import { ResponseDto } from "@/server/utils/response.dto";
import { authGuard } from "@/server/utils/auth.guard";

export const activityRoute = new Hono().get("/", authGuard(), async (c) => {
  const activities = await ActivityService.getRecentActivities();
  return c.json(
    ResponseDto.success({ message: "Recent activities retrieved successfully", data: activities }),
  );
});

export type TActivityRoute = typeof activityRoute;
