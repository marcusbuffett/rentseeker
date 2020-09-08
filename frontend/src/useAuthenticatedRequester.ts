import { AppStore } from "src/store";

export const useRequestAuth = () => {
  const token = AppStore.useState((s) => s.jwt);
  return (req) => {
    return setToken(req, token);
  };
};

export const setToken = (req, token) => {
  req.set("Authorization", token);
  return req;
};
