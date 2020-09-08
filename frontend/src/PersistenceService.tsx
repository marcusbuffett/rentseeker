import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { inputStyles, primaryColor, secondaryColor } from "src/app_styles";
import superagent from "superagent";
import { setToken, useRequestAuth } from "src/useAuthenticatedRequester";
import _ from "lodash";
import { useInterval, usePrevious } from "rooks";
import { AppStore } from "src/store";
import localStorage from "local-storage";
import { createDefaultHouses } from "src/models";

export const PersistenceService = ({}) => {
  const k = "JWT";
  const userKey = "USER";
  const housesKey = "HOUSES";
  const jwt = AppStore.useState((s) => s.jwt);
  const user = AppStore.useState((s) => s.user);
  const houses = AppStore.useState((s) => s.houses);
  const initialized = AppStore.useState((s) => s.initialized);
  useEffect(() => {
    console.log("IN THIS EFFECT HANDLER");
    // @ts-ignore
    const storedToken: any = localStorage(k);
    // @ts-ignore
    const storedUser: any = localStorage(userKey);
    // @ts-ignore
    const storedHouses: any = localStorage(housesKey);
    if (initialized) {
      return;
    }
    if (!jwt && storedToken) {
      setToken(superagent.get("/api/investments"), storedToken).end(
        (err, res) => {
          if (err) {
            AppStore.update((s) => {
              s.jwt = null;
              s.user = null;
              localStorage(k, null);
              localStorage(userKey, null);
              console.log("storedHouses:", storedHouses);
              s.houses = storedHouses || createDefaultHouses();
            });
            return;
          }
          AppStore.update((s) => {
            s.jwt = storedToken;
            s.user = storedUser;
            s.initialized = true;
            s.houses = res.body;
          });
        }
      );
    }
    if (!jwt && !storedToken) {
      AppStore.update((s) => {
        console.log("storedHouses:", storedHouses);
        s.houses = _.isEmpty(storedHouses)
          ? createDefaultHouses()
          : storedHouses;
        s.initialized = true;
        console.log("INITIALIZED IS TRUE NOW");
      });
    }
  }, []);
  useEffect(() => {
    localStorage(k, jwt);
    localStorage(housesKey, houses);
    localStorage(userKey, user);
  }, [jwt, user, houses]);
  return null;
};
