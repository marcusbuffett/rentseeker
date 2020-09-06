import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { inputStyles, primaryColor, secondaryColor } from "src/app_styles";
import superagent from "superagent";
import { useRequestAuth } from "src/useAuthenticatedRequester";
import _ from "lodash";
import { useInterval, usePrevious } from "rooks";
import { AppStore } from "src/store";
import localStorage from "local-storage";

export const PersistenceService = ({}) => {
  const k = "JWT";
  const userKey = "USER";
  const jwt = AppStore.useState((s) => s.jwt);
  const user = AppStore.useState((s) => s.user);
  useEffect(() => {
    const storedToken = localStorage(k);
    const storedUser = localStorage(userKey);
    // @ts-ignore
    if (!jwt && storedToken) {
      AppStore.update((s) => {
        // @ts-ignore
        s.jwt = storedToken;
        // @ts-ignore
        s.user = storedUser;
      });
    }
  }, []);
  useEffect(() => {
    localStorage(k, jwt);
    localStorage(userKey, user);
  }, [jwt, user]);
  return null;
};
