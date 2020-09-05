import _ from "lodash";
import { FinancingOption, Investment } from "src/models";
export const isSSR = () => {
  return typeof window === "undefined";
};

export const formatUSDLarge = (x: number) => {
  let integralPart = Math.trunc(x);
  let withSeparators = Number(Math.abs(integralPart)).toLocaleString("EN-us");
  if (x < 0) {
    return `($${withSeparators})`;
  }
  return `$${withSeparators}`;
};

export const formatUSD = (x: number) => {
  let integralPart = Math.trunc(x);
  let decimal = _.split((x % 1).toFixed(2), ".")[1];
  let withSeparators = Number(Math.abs(integralPart)).toLocaleString("EN-us");
  if (x < 0) {
    return `$(${withSeparators})`;
  }
  return `$${withSeparators}`;
};

export const formatUSDShorten = (x: number) => {
  let integralPart = Math.trunc(x);
  let decimal = _.split((x % 1).toFixed(2), ".")[1];
  let withSeparators = Number(integralPart).toLocaleString("EN-us");
  let thousands = Math.round(integralPart / 1000);
  return `${thousands}k`;
};

export const formatPercent = (x: number) => {
  if (x === Infinity) {
    return `N/A`;
  }

  const percent = Math.abs(x * 100).toFixed(2);
  if (x < 0) {
    return `(${percent}%)`;
  }
  return `${percent}%`;
};

export const formatWholePercent = (x: number) => {
  return `${(x * 100).toFixed(0)}%`;
};

export const createInvestmentProjection = (house: Investment) => {
  let mortgagePayment =
    house.financingOption === FinancingOption.Mortgage
      ? calcMortgagePayment(house)
      : 0;
  let expenses = house.expenseRatio * house.rent;
  let monthlyIncome = house.rent;
  let annualIncome = monthlyIncome * 12;
  let monthlyExpenses =
    mortgagePayment +
    expenses +
    house.insurance +
    house.annualTaxes / 12 +
    house.rent * house.propManagement +
    house.miscExpenses +
    house.hoa;
  let annualExpenses = monthlyExpenses * 12;
  let annualProfit = annualIncome - annualExpenses;
  let down =
    house.financingOption === FinancingOption.Mortgage
      ? house.downPayment * house.purchasePrice
      : house.purchasePrice;
  let cashOnCash = annualProfit / down;
  let cashFlow = annualProfit / 12;
  let capRate = annualProfit / house.purchasePrice;
  return {
    cashOnCash,
    capRate,
    cashFlow,
    annualIncome,
    annualExpenses,
    annualProfit,
    mortgagePayment,
  };
};

export const calcMortgagePayment = (house: Investment) => {
  let principal = house.purchasePrice * (1 - house.downPayment);
  let numPeriods = 360;
  let ir = house.interestRate;
  let c = ir / 12;
  let payment =
    (principal * c * Math.pow(1 + c, numPeriods)) /
    (Math.pow(1 + c, numPeriods) - 1);
  // let payment =
  // (principal * ir) /
  // numPeriods /
  // (1 - Math.pow(1 + ir / numPeriods, -numPeriods));
  return payment;
};
