export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV?: "development" | "production" | "test";
      JWT_SECRET: string;
      NEXT_PUBLIC_DEMO_USER_EMAIL: string;
      NEXT_PUBLIC_DEMO_USER_PASSWORD: string;
    }
  }
}
