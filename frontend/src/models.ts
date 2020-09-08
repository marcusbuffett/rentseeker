import { v4 as uuidv4 } from "uuid";
export interface Investment {
  financingOption: any;
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  rent: number;
  annualTaxes: number;
  insurance: number;
  expenseRatio: number;
  propManagement: number;
  miscExpenses: number;
  hoa: number;
  title: string;
  uuid: string;
}

export enum FieldFormat {
  USD = "USD",
  Percent = "Percent",
}

export interface InvestmentProjection {
  cashOnCash: number;
  capRate: number;
  cashFlow: number;
  annualIncome: number;
  annualExpenses: number;
  annualProfit: number;
}

export enum FinancingOption {
  Mortgage = "Mortgage",
  Cash = "Cash",
}

export const createNewHouse = () => {
  return {
    title: "Example House",
    purchasePrice: 100000,
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
    uuid: uuidv4(),
  };
};

export const createDefaultHouses = () => {
  return [
    {
      title: "42 Example Property Rd.",
      purchasePrice: 155000,
      downPayment: 0.2,
      interestRate: 0.045,
      rent: 2125,
      annualTaxes: 4000,
      insurance: 400,
      expenseRatio: 0.15,
      financingOption: FinancingOption.Mortgage,
      propManagement: 0.1,
      hoa: 0,
      miscExpenses: 0,
      uuid: uuidv4(),
    },
  ];
};
