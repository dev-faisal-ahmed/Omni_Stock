import { AuthRoute } from "@/server/modules/auth/auth.route";
import { hc } from "hono/client";

export const authClient = hc<AuthRoute>("/api/v1/auth");
