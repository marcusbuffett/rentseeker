import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { inputStyles, primaryColor, secondaryColor } from "src/app_styles";
import { AppAction, AppState } from "src/redux/reducer";
import superagent from "superagent";
import { useDispatch, useSelector } from "react-redux";
import { useRequestAuth } from "src/useAuthenticatedRequester";
import _ from "lodash";
import { useInterval, usePrevious } from "rooks";

export const HouseUploadService = ({}) => {
  const requestAuth = useRequestAuth();
  const user = useSelector((state: AppState) => state.user);
  const changedHouseUuids = useSelector((state: AppState) => state.changed);
  const houses = useSelector((state: AppState) => state.houses);
  const dispatch = useDispatch();
  console.log("changedHouseUuids:", changedHouseUuids);
  const changedHouses = _.filter(houses, (house) => {
    return changedHouseUuids.has(house.uuid);
  });
  // const previousHouses = usePrevious(latestHouses);
  // const [changedHouses, setChangedHouses] = useRef(null);
  useInterval(
    () => {
      if (!_.isEmpty(changedHouses)) {
        _.forEach(changedHouses, (house) => {
          dispatch({
            type: AppAction.InvestmentUploaded,
            uuid: house.uuid,
          });
          requestAuth(superagent.post("/api/investments").send(house)).end(
            (err, res) => {
              console.log("res:", res);
            }
          );
        });
      }
    },
    1000,
    true
  );

  return null;
};
