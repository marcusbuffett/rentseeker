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
