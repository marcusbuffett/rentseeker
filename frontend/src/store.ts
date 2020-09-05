import { Store } from "pullstate";

export const AppStore = new Store({
  changed: new Set(),
});
