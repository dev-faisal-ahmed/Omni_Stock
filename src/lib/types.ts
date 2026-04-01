export type ToString<TData> = {
  [key in keyof TData]: string;
};
