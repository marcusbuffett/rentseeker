import { FinancingOption, Investment } from "src/models";
import { createStore, AnyAction } from "redux";
import { MakeStore, createWrapper, Context, HYDRATE } from "next-redux-wrapper";
import _ from "lodash";
import { isSSR } from "src/utilities";

export interface AppState {
  houses: Investment[];
  signInModalOpen: boolean;
  user: {
    email: string;
  };
  jwt: string;
  changed: Set<string>;
  deleted: Set<string>;
}
export enum AppAction {
  AddInvestment = "AddInvestment",
  UpdateInvestment = "UpdateInvestment",
  ToggleSignInModal = "ToggleSignInModal",
  InvestmentUploaded = "InvestmentUploaded",
  Login = "Login",
}

const defaultState = {
  changed: new Set(),
  deleted: new Set(),
  signInModalOpen: false,
  houses: [
    {
      title: "9572 Gonzalez Dr",
      purchasePrice: 80000,
      downPayment: 0.2,
      interestRate: 0.045,
      rent: 1150,
      annualTaxes: 2400,
      insurance: 200,
      expenseRatio: 0.15,
      financingOption: FinancingOption.Mortgage,
      propManagement: 0.1,
      hoa: 0,
      miscExpenses: 0,
      uuid: "7354a4fa-d5fd-4369-b54d-340a86b582ef",
    },
    {
      title: "9576 Gonzalez Dr",
      purchasePrice: 70000,
      downPayment: 0.2,
      interestRate: 0.045,
      rent: 975,
      annualTaxes: 2400,
      insurance: 200,
      expenseRatio: 0.15,
      financingOption: FinancingOption.Mortgage,
      propManagement: 0.1,
      hoa: 0,
      miscExpenses: 0,
      uuid: "e2c5ea65-d16a-4a27-ae6d-c6516e6d0591",
    },
    {
      title: "42 Wallaby Way",
      purchasePrice: 1000000,
      downPayment: 0.2,
      interestRate: 0.045,
      rent: 2150,
      annualTaxes: 4800,
      insurance: 400,
      expenseRatio: 0.15,
      financingOption: FinancingOption.Mortgage,
      propManagement: 0.1,
      hoa: 0,
      miscExpenses: 0,
      uuid: "144588a0-1047-4d05-b1ea-af5c1de54309",
    },
  ],
};

export const appReducer = (state = defaultState, action) => {
  if (action.type === AppAction.ToggleSignInModal) {
    return {
      ...state,
      signInModalOpen: action.open,
    };
  }
  if (action.type === AppAction.Login) {
    return {
      ...state,
      user: action.user,
      jwt: action.token,
    };
  }
  if (action.type === AppAction.InvestmentUploaded) {
    state.changed.delete(action.uuid);
    return {
      ...state,
      changed: state.changed,
    };
  }
  if (action.type === AppAction.AddInvestment) {
    return {
      ...state,
      houses: state.houses.concat([action.house]),
    };
  }
  if (action.type === AppAction.UpdateInvestment) {
    const newHouses = _.map(state.houses, (house) => {
      return house.uuid === action.house.uuid ? action.house : house;
    });
    console.log("changed:", state.changed);
    return {
      ...state,
      houses: newHouses,
      changed: state.changed.add(action.house.uuid),
    };
  }
  return state;
};

const makeStore: MakeStore<any> = (context: Context) =>
  createStore(
    appReducer,
    // @ts-ignore
    isSSR() ||
      (window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__())
  );
export const wrapper = createWrapper<AppState>(makeStore, { debug: true });
