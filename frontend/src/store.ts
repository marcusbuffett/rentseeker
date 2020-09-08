import localStorage from "local-storage";
import { Store } from "pullstate";
import { FinancingOption, Investment } from "src/models";
import { v4 as uuidv4 } from "uuid";

export const AppStore = new Store<{
  houses: Investment[];
  user: {
    email: string;
  };
  jwt: string;
  fetchingInvestments: boolean;
  fetchingInvestment: Set<string>;
  initialized: boolean;
  changed: Set<string>;
  sharedHouse: Investment;
  deleted: Set<string>;
}>({
  fetchingInvestment: new Set(),
  fetchingInvestments: false,
  changed: new Set(),
  deleted: new Set(),
  // @ts-ignore
  // user: localStorage("USER"),
  // @ts-ignore
  // jwt: localStorage("JWT"),
  user: null,
  // @ts-ignore
  jwt: null,
  initialized: false,
  sharedHouse: null,
  houses: [],
});
