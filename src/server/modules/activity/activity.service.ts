import { ActivityEntity } from "@/generated/prisma/enums";
import { prisma } from "@/server/db";

export class ActivityService {
  static async logActivity(entity: ActivityEntity, message: string) {
    return prisma.activity
      .create({
        data: {
          entity,
          message,
        },
      })
      .catch((err) => console.error("Failed to log activity:", err));
  }

  static async getRecentActivities() {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return activities;
  }
}
