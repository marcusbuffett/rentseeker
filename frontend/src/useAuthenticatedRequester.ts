import { AppState } from "src/redux/reducer";
import { useSelector } from "react-redux";

export const useRequestAuth = () => {
  const token = useSelector((state: AppState) => state.jwt);
  return (req) => {
    req.set("Authorization", token);
    return req;
  };
};
