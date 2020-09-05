import { Store } from "pullstate";
import { FinancingOption, Investment } from "src/models";

export const AppStore = new Store<{
  houses: Investment[];
  signInModalOpen: boolean;
  user: {
    email: string;
  };
  jwt: string;
  changed: Set<string>;
  deleted: Set<string>;
}>({
  changed: new Set(),
  deleted: new Set(),
  user: null,
  jwt: null,
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
});
