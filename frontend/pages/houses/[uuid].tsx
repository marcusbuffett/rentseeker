import React, { ReactElement, useEffect, useRef, useState } from "react";
import AppContainer from "src/AppContainer";
import _ from "lodash";
// prettier-ignore
import {justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, selfStretch, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, alignStretch, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, flexible, textAlign, s7, s8, s9, s10, selfStart, constrainWidth, center, light0, textOverflowClip, oneLine, stiff, mx } from "src/styles";
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
import AutosizeInput from "react-input-autosize";
import superagent from "superagent";
import * as copy from "copy-to-clipboard";
import Head from "next/head";

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
  const initialized = AppStore.useState((s) => s.initialized);
  const [isShared, setIsShared] = useState(false);
  const house = AppStore.useState(
    (state) => {
      return _.find(
        [...state.houses, ...(state.sharedHouse ? [state.sharedHouse] : [])],
        (house: Investment) => {
          return house.uuid === uuid;
        }
      );
    },
    [uuid]
  );
  const { innerWidth } = useWindowSize();
  const mobile = innerWidth < 1000;
  const [editingValue, setEditingValue] = useState(null);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const user = AppStore.useState((s) => {
    return s.user;
  });
  const loggedIn = !_.isNil(user);
  const [hasFetchedUuid, setHasFetchedUuid] = useState(null);
  const [clickedCopy, setClickedCopy] = useState(false);
  useEffect(() => {
    if (clickedCopy) {
      setTimeout(() => {
        setClickedCopy(false);
      }, 1000);
    }
  }, [clickedCopy]);
  useEffect(() => {
    if (_.isNil(house) && initialized) {
      superagent
        .get(`/api/investments/${uuid}`)
        .accept("json")
        .end((err, res) => {
          console.log("err:", err);
          if (!err) {
            AppStore.update((s) => {
              console.log("res.body:", res.body);
              console.log("res:", res);
              s.sharedHouse = res.body;
              setIsShared(true);
            });
          }
          setHasFetchedUuid(true);
        });
    }
  }, [initialized, house]);

  if (_.isNil(house)) {
    if (initialized && hasFetchedUuid) {
      // router.push("/");
    }
    return (
      <AppContainer>
        <meta
          name="description"
          content="Check out my investment property on rentseeker"
        />
      </AppContainer>
    );
  }
  const projection = createInvestmentProjection(house);

  const updateHouse = (house: Investment) => {
    AppStore.update((s) => {
      if (house.uuid === s.sharedHouse?.uuid) {
        s.sharedHouse = house;
      } else {
        s.houses = _.map(s.houses, (h: Investment) => {
          return h.uuid === house.uuid ? house : h;
        });
        s.changed.add(house.uuid);
      }
    });
  };
  const labelColor = light4;
  const valueStyles = s(caps, f3, fg(light3));
  const fieldStyles = s(caps, f0, fg(labelColor));
  const rightValueStyles = s(valueStyles, textAlign("right"));
  const rightFieldStyles = s(fieldStyles, textAlign("right"));
  const headerStyles = s(f2, fg(light3), caps, weightBold);
  const sliderVerticalGap = 24;
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
  const shareSection = (
    <>
      <div
        style={s(
          card,
          mobile ? mx(-4) : {},
          column,
          bg(dark2),
          br(4),
          !mobile ? p(s7) : {}
          // border(1, "solid", light5)
        )}
      >
        <div style={s(caps, fg(light4), weightSemiBold)}>Share</div>
        <Spacer height={s6} />
        {isShared ? (
          <div style={s(f0, fg(light4))}>
            You're viewing someone else's investment, so your changes aren't
            being saved. To save and share your own properties, log in and
            create your own.
          </div>
        ) : loggedIn ? (
          <>
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
              <div
                style={s(
                  bg(primaryColor),
                  stiff,
                  center,
                  f1,
                  br(2),
                  clickable,
                  fg(light0),
                  caps,
                  px(s5),
                  py(s4)
                )}
                onClick={() => {
                  // @ts-ignore
                  copy(window.location.href);
                  setClickedCopy(true);
                }}
              >
                {clickedCopy ? "copied" : "copy"}
              </div>
            </div>
            <Spacer height={s6} />
            <div style={s(fg(light4), fontSize(14))}>
              Copy the above link to share this property. Viewers will be able
              to see, but not modify, these numbers.
            </div>
          </>
        ) : (
          <>
            <div style={s(fg(light4), f0)}>
              To share a permalink to this property, log in or sign up.
            </div>
          </>
        )}
      </div>
    </>
  );
  const projectionSection = (
    <div style={s(width(mobile ? "100%" : 400))}>
      <div style={s(mobile ? mx(-4) : {}, card, !mobile ? p(s7) : {}, column)}>
        <div style={s(row, justifyBetween)}>
          <div style={s(column)}>
            <div style={s(column)}>
              <div style={s(fieldStyles)}>Cash-on-cash</div>
              <div style={s(valueStyles, fg(plColor(projection.cashOnCash)))}>
                {formatPercent(projection.cashOnCash)}
              </div>
            </div>
            <Spacer height={44} />
            <div style={s(column)}>
              <div style={s(fieldStyles)}>Cap rate</div>
              <div style={s(valueStyles, fg(plColor(projection.cashOnCash)))}>
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
                style={s(rightValueStyles, fg(plColor(projection.cashFlow)))}
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
    </div>
  );
  return (
    <AppContainer>
      <Head>
        <title>{house.title}</title>
      </Head>
      <div style={s(column, fullWidth)}>
        <div style={s(row, mobile ? justifyStart : justifyCenter)}>
          <div style={s(selfCenter, fg(light3))}>
            <AutosizeInput
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputRef.current.input.blur();
                }
              }}
              value={editing ? editingValue : house.title}
              onFocus={() => {
                setEditingValue(house.title);
                setEditing(true);
              }}
              onBlur={() => {
                setEditing(false);
              }}
              onChange={(e) => {
                let val = e.target.value;
                setEditingValue(val);
                if (val !== "") {
                  houseUpdater("title")(val);
                }
              }}
              style={s()}
              inputStyle={s(
                mobile ? f2 : f3,
                fg(light3),
                bg("transparent"),
                editableStyles
              )}
            />
          </div>
        </div>
        <Spacer height={mobile ? 32 : 64} />
        {mobile && (
          <>
            {projectionSection}
            <Spacer height={32} />
          </>
        )}
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
            <Spacer height={s8} />
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
            <Spacer height={s4} />
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
          <div style={s(column, width(mobile ? "100%" : 400))}>
            {!mobile && (
              <>
                {projectionSection}
                <Spacer height={s9} />
              </>
            )}
            {shareSection}
          </div>
        </div>
        <Spacer height={s9} />
      </div>
    </AppContainer>
  );
}
