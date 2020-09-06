import React, { ReactElement, useEffect } from "react";
import { AppStore } from "src/store";
import superagent from "superagent";
import { useRequestAuth } from "src/useAuthenticatedRequester";

export const HouseFetchService = () => {
  const jwt = AppStore.useState((s) => s.jwt);
  const requestAuth = useRequestAuth();
  useEffect(() => {
    if (jwt) {
      AppStore.update((s) => {
        s.fetchingInvestments = true;
      });
      requestAuth(superagent.get("/api/investments")).end((err, res) => {
        console.log("res:", res);
        AppStore.update((s) => {
          console.log("res.body:", res.body);
          s.houses = res.body;
        });
      });
    }
  }, [jwt]);
  return null;
};
