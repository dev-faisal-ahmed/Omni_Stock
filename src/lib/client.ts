import { TAuthRoute } from "@/server/modules/auth/auth.route";
import { TCategoryRoute } from "@/server/modules/category/category.route";
import { TProductRoute } from "@/server/modules/product/product.route";
import { hc } from "hono/client";

export const authClient = hc<TAuthRoute>("/api/v1/auth");
export const categoryClient = hc<TCategoryRoute>("/api/v1/categories");
export const productClient = hc<TProductRoute>("/api/v1/products");
