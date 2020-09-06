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

export const HouseUploadService = ({}) => {
  const requestAuth = useRequestAuth();
  const user = AppStore.useState((s) => s.user);
  const changedHouseUuids = AppStore.useState((s) => s.changed);
  const houses = AppStore.useState((s) => s.houses);
  const changedHouses = _.filter(houses, (house) => {
    return changedHouseUuids.has(house.uuid);
  });
  useInterval(
    () => {
      if (!_.isEmpty(changedHouses)) {
        AppStore.update((s) => {
          s.changed.clear();
        });
        requestAuth(
          superagent.post("/api/investments").send(changedHouses)
        ).end((err, res) => {
        });
      }
    },
    1000,
    true
  );

  return null;
};
