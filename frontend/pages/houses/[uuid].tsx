import React, { ReactElement, useState } from "react";
import AppContainer from "src/AppContainer";
import _ from "lodash";
// prettier-ignore
import {justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, selfStretch, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, alignStretch, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, flexible, textAlign, s7, s8, s9, s10, selfStart, constrainWidth, center, light0, textOverflowClip, oneLine, stiff } from "src/styles";
import { Investment, FieldFormat, FinancingOption } from "src/models";
import { useRouter } from "next/router";
import {
  isSSR,
  formatUSDLarge,
  calcMortgagePayment,
  createInvestmentProjection,
  formatPercent,
  formatWholePercent,
  formatUSD,
} from "src/utilities";
import { Slider } from "src/Slider";
import { AnnotatedSlider } from "src/AnnotatedSlider";
import { card, editableStyles, plColor, primaryColor } from "src/app_styles";
import { Selector } from "src/Selector";
import { useWindowSize } from "rooks";
import { AppStore } from "src/store";

const SliderGroup = ({ firstSlider, secondSlider, mobile }) => {
  if (mobile) {
    return (
      <div style={s(column, alignStretch, fullWidth)}>
        {firstSlider}
        <Spacer height={32} />
        {secondSlider}
      </div>
    );
  }
  return (
    <div style={s(row, fullWidth)}>
      {firstSlider}
      <Spacer width={32} />
      {secondSlider}
    </div>
  );
};

export default function HousePage(props: {}): ReactElement {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const house = AppStore.useState(
    (state) => {
      return _.find(state.houses, (house: Investment) => {
        return house.uuid === uuid;
      });
    },
    [uuid]
  );
  const { innerWidth } = useWindowSize();
  const mobile = innerWidth < 1000;
  if (_.isNil(house)) {
    // if (!isSSR()) {
    // router.push("/");
    // }
    return null;
  }
  const projection = createInvestmentProjection(house);

  const updateHouse = (house: Investment) => {
    AppStore.update((s) => {
      s.houses = _.map(s.houses, (h: Investment) => {
        return h.uuid === house.uuid ? house : h;
      });
    });
  };
  const labelColor = light4;
  const valueStyles = s(caps, f3, fg(light3));
  const fieldStyles = s(caps, f0, fg(labelColor));
  const rightValueStyles = s(valueStyles, textAlign("right"));
  const rightFieldStyles = s(fieldStyles, textAlign("right"));
  const headerStyles = s(f2, fg(light3), caps, weightBold);

  const sliderVerticalGap = 32;
  const houseUpdater = (field: string) => (x: number | string) => {
    let newHouse = _.cloneDeep(house);
    newHouse[field] = x;
    updateHouse(newHouse);
  };
  let ctaStyles = s(
    caps,
    f1,
    weightSemiBold,
    p(s5),
    bg(light3),
    fg(dark2),
    br(2),
    width(100),
    center
  );
  return (
    <AppContainer>
      <div style={s(column, fullWidth)}>
        <div style={s(row, justifyCenter)}>
          <div style={s(f3, selfCenter, fg(light3), editableStyles)}>
            {house.title}
          </div>
        </div>
        <Spacer height={mobile ? 32 : 64} />
        <div style={s(mobile ? column : row, fullWidth, alignStart)}>
          <div style={s(grow, flexible, mobile ? selfStretch : {})}>
            <div style={s(row)}>
              <SliderGroup
                mobile={mobile}
                firstSlider={
                  <AnnotatedSlider
                    formatter={formatUSDLarge}
                    field="Purchase price"
                    value={house.purchasePrice}
                    onValueChange={houseUpdater("purchasePrice")}
                    slider={{
                      step: 25000,
                      min: 25000,
                      max: 1000000,
                    }}
                  />
                }
                secondSlider={
                  <AnnotatedSlider
                    formatter={formatUSD}
                    field="Rent"
                    value={house.rent}
                    onValueChange={houseUpdater("rent")}
                    slider={{
                      step: 25,
                      min: 200,
                      max: Math.round((house.purchasePrice * 0.02) / 25) * 25,
                    }}
                  />
                }
              />
            </div>
            <Spacer height={s10} />
            <div style={s(headerStyles)}>Financing</div>
            <Spacer height={s6} />
            <Selector
              choices={[FinancingOption.Mortgage, FinancingOption.Cash]}
              setChoice={houseUpdater("financingOption")}
              currentChoice={house.financingOption}
            />
            <Spacer height={s6} />
            {house.financingOption === FinancingOption.Mortgage && (
              <SliderGroup
                mobile={mobile}
                firstSlider={
                  <AnnotatedSlider
                    formatter={formatWholePercent}
                    field="Down payment"
                    value={house.downPayment}
                    onValueChange={houseUpdater("downPayment")}
                    slider={{
                      step: 0.01,
                      min: 0,
                      max: 0.3,
                    }}
                  />
                }
                secondSlider={
                  <AnnotatedSlider
                    formatter={formatPercent}
                    field="Interest rate"
                    value={house.interestRate}
                    onValueChange={houseUpdater("interestRate")}
                    slider={{
                      step: 0.0025,
                      min: 0.01,
                      max: 0.1,
                    }}
                  />
                }
              />
            )}
            <Spacer height={s10} />
            <div style={s(headerStyles)}>Expenses</div>
            <Spacer height={s8} />
            <SliderGroup
              mobile={mobile}
              firstSlider={
                <AnnotatedSlider
                  formatter={formatUSD}
                  field="Insurance / mo"
                  value={house.insurance}
                  onValueChange={houseUpdater("insurance")}
                  slider={{
                    step: 10,
                    min: 0,
                    max: 1000,
                  }}
                />
              }
              secondSlider={
                <AnnotatedSlider
                  formatter={formatUSD}
                  field="Annual taxes"
                  value={house.annualTaxes}
                  onValueChange={houseUpdater("annualTaxes")}
                  slider={{
                    step: 100,
                    min: 100,
                    max: Math.round((house.purchasePrice * 0.05) / 100) * 100,
                  }}
                />
              }
            />
            <Spacer height={sliderVerticalGap} />
            <SliderGroup
              mobile={mobile}
              firstSlider={
                <AnnotatedSlider
                  formatter={formatWholePercent}
                  field="Expense ratio"
                  value={house.expenseRatio}
                  onValueChange={houseUpdater("expenseRatio")}
                  slider={{
                    step: 0.01,
                    min: 0.01,
                    max: 0.3,
                  }}
                />
              }
              secondSlider={
                <AnnotatedSlider
                  formatter={formatWholePercent}
                  field="Property management"
                  value={house.propManagement}
                  onValueChange={houseUpdater("propManagement")}
                  slider={{
                    step: 0.01,
                    min: 0.0,
                    max: 0.12,
                  }}
                />
              }
            />
            <Spacer height={sliderVerticalGap} />
            <SliderGroup
              mobile={mobile}
              firstSlider={
                <AnnotatedSlider
                  formatter={formatUSD}
                  field="Monthly HOA"
                  value={house.hoa}
                  onValueChange={houseUpdater("hoa")}
                  slider={{
                    step: 10,
                    min: 0,
                    max: house.purchasePrice * 0.01,
                  }}
                />
              }
              secondSlider={
                <AnnotatedSlider
                  formatter={formatUSD}
                  field="Misc expenses / mo"
                  value={house.miscExpenses}
                  onValueChange={houseUpdater("miscExpenses")}
                  slider={{
                    step: 5,
                    min: 0,
                    max: 500,
                  }}
                />
              }
            />
          </div>
          {mobile ? <Spacer height={44} /> : <Spacer width={32} />}
          <div style={s(width(mobile ? "100%" : 400))}>
            <div style={s(card, column, p(s7))}>
              <div style={s(row, justifyBetween)}>
                <div style={s(column)}>
                  <div style={s(column)}>
                    <div style={s(fieldStyles)}>Cash-on-cash</div>
                    <div
                      style={s(valueStyles, fg(plColor(projection.cashOnCash)))}
                    >
                      {formatPercent(projection.cashOnCash)}
                    </div>
                  </div>
                  <Spacer height={44} />
                  <div style={s(column)}>
                    <div style={s(fieldStyles)}>Cap rate</div>
                    <div
                      style={s(valueStyles, fg(plColor(projection.cashOnCash)))}
                    >
                      {formatPercent(projection.capRate)}
                    </div>
                  </div>
                  <Spacer height={44} />
                  <div style={s(column)}>
                    <div style={s(fieldStyles)}>Annual Expenses</div>
                    <div style={s(valueStyles)}>
                      {formatUSDLarge(projection.annualExpenses)}
                    </div>
                  </div>
                  {house.financingOption === FinancingOption.Mortgage && (
                    <>
                      <Spacer height={44} />
                      <div style={s(column)}>
                        <div style={s(fieldStyles)}>Mortgage</div>
                        <div style={s(valueStyles)}>
                          {formatUSDLarge(projection.mortgagePayment)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={s(column)}>
                  <div style={s(column)}>
                    <div style={s(rightFieldStyles)}>Monthly Cash Flow</div>
                    <div
                      style={s(
                        rightValueStyles,
                        fg(plColor(projection.cashFlow))
                      )}
                    >
                      {formatUSDLarge(projection.cashFlow)}
                    </div>
                  </div>
                  <Spacer height={44} />
                  <div style={s(column)}>
                    <div style={s(rightFieldStyles)}>Annual Cash Flow</div>
                    <div
                      style={s(
                        rightValueStyles,
                        fg(plColor(projection.annualProfit))
                      )}
                    >
                      {formatUSDLarge(projection.annualProfit)}
                    </div>
                  </div>
                  <Spacer height={44} />
                  <div style={s(column)}>
                    <div style={s(rightFieldStyles)}>Annual Income</div>
                    <div style={s(rightValueStyles)}>
                      {formatUSDLarge(projection.annualIncome)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Spacer height={s8} />
            <div
              style={s(
                card,
                column,
                bg(dark2),
                br(4),
                p(s7)
                // border(1, "solid", light5)
              )}
            >
              Share
              <Spacer height={s5} />
              <div style={s(row, height(s8), alignStretch)}>
                <div style={s(bg(light4), p(s4), grow, flexible, br(2), row)}>
                  <div
                    style={s(
                      textOverflowClip,
                      oneLine,
                      fg(dark4),
                      row,
                      alignCenter
                    )}
                  >
                    {window.location.href}
                  </div>
                </div>
                <Spacer width={s5} />
                <div style={s(size(s8), bg(dark0), stiff, br(2))}></div>
              </div>
              <Spacer height={s5} />
              <div style={s(fg(light4), f0)}>
                If you want to show this investment to anyone, copy the above
                link. They'll be able to see (but not modify) these numbers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
