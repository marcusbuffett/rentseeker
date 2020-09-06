import { AppStore } from "src/store";

export const useRequestAuth = () => {
  const token = AppStore.useState((s) => s.jwt);
  return (req) => {
    req.set("Authorization", token);
    return req;
  };
};
