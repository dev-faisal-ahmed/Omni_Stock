"use client";

import { PackageIcon, ShoppingCartIcon, ClockIcon, LightningIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/lib/cache-registry";
import { getLatestActivities } from "../analytics-api";
import { format } from "date-fns";

const ENTITY_CONFIG = {
  PRODUCT: {
    icon: PackageIcon,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    label: "Product",
  },
  ORDER: {
    icon: ShoppingCartIcon,
    color: "bg-green-500",
    bgColor: "bg-green-50",
    label: "Order",
  },
};

export function ActivityList() {
  // const { data: activities, isLoading } = useRecentActivities();
  const { data: activities, isLoading } = useQuery({
    queryKey: [QK.activities],
    queryFn: getLatestActivities,
  });

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "MMM d'th', yyyy, h:mm a");
  };

  return (
    <div className="border-border bg-card border shadow-sm">
      <div className="border-border border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <LightningIcon className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Recent Activities</h3>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto p-4">
        {isLoading ? (
          <ActivityListSkeleton />
        ) : activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === activities.length - 1}
              formatDateTime={formatDateTime}
            />
          ))
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground text-sm">No activities yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityItem({
  activity,
  isLast,
  formatDateTime,
}: {
  activity: {
    id: string;
    entity: "PRODUCT" | "ORDER";
    message: string;
    createdAt: Date | string;
  };
  isLast: boolean;
  formatDateTime: (date: Date) => string;
}) {
  const config = ENTITY_CONFIG[activity.entity];
  const IconComponent = config.icon;

  return (
    <div className="relative">
      {!isLast && <div className="bg-border absolute top-12 left-5 h-8 w-0.5" />}

      <div className="group hover:bg-muted/50 relative px-3 py-4 transition-colors">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="relative z-10 flex-shrink-0 pt-0.5">
            <div className={`rounded-full ${config.bgColor} p-2`}>
              <IconComponent className={`h-4 w-4 ${config.color}`} />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {config.label}
                  </Badge>
                </div>
                <p className="text-foreground text-sm leading-relaxed font-medium break-words">
                  {activity.message}
                </p>
              </div>
            </div>

            <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
              <ClockIcon className="h-3 w-3" weight="bold" />
              <time>{formatDateTime(activity.createdAt as Date)}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 rounded-lg px-3 py-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
