// prettier-ignore
import {justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, s7, center, s9, s10, mx, m, light0, minHeight } from "src/styles";
import AppContainer from "src/AppContainer";
import { createNewHouse, Investment } from "src/models";
import { AppState } from "src/redux/reducer";
import Link from "next/link";
import { card, primaryColor, plColor } from "src/app_styles";
import {
  createInvestmentProjection,
  formatPercent,
  formatUSD,
  formatUSDShorten,
} from "src/utilities";
import { useWindowSize } from "rooks";
import { AppStore } from "src/store";
import Loader from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const investments = AppStore.useState((state) => state.houses);
  const labelColor = light4;
  const { innerWidth } = useWindowSize();
  const mobile = innerWidth < 1000;
  const gap = 32;
  const [loading, setLoading] = useState(false);
  // TODO: fetch on load
  useEffect(() => {}, []);
  const router = useRouter();
  const user = AppStore.useState((s) => s.user);
  return (
    <AppContainer>
      {!mobile && <Spacer height={s7} />}
      <div style={s(f2, fg(light4), caps, weightBold)}>Properties</div>
      <Spacer height={32} />
      {loading ? (
        <div style={s(center, grow)}>
          <Spacer height={s10} />
          <Loader type="ThreeDots" color={light3} height={100} width={100} />
        </div>
      ) : (
        <div style={s(row, flexWrap, m(-gap), justifyStart)}>
          {investments.map((investment) => {
            const downTitleStyles = s(f3, inline, fg(light3));
            const downSubtitleStyles = s(f0, inline, fg(labelColor), caps);
            const projection = createInvestmentProjection(investment);
            return (
              <Link href="/houses/[uuid]" as={`/houses/${investment.uuid}`}>
                <div style={s(p(s5), m(gap), card, width(500), clickable)}>
                  <div style={s(fg(light4), f1, weightRegular)}>
                    {investment.title}
                  </div>
                  <Spacer height={16} />
                  <div style={s(row)}>
                    <div style={s(column, alignStart)}>
                      <div style={s(downTitleStyles)}>
                        {formatUSD(
                          investment.purchasePrice * investment.downPayment
                        )}
                      </div>
                      <div style={downSubtitleStyles}>down</div>
                    </div>
                    <Spacer width={8} />
                    <div style={s(downTitleStyles)}>/</div>
                    <Spacer width={8} />
                    <div style={s(column, alignStart)}>
                      <div style={downTitleStyles}>
                        {formatUSD(investment.purchasePrice)}
                      </div>
                      <div style={downSubtitleStyles}>purchase price</div>
                    </div>
                  </div>
                  <Spacer height={32} />
                  <div style={s(row, justifyBetween, fullWidth)}>
                    <div style={s(column)}>
                      <div style={s(caps, f0, fg(labelColor))}>
                        Cash-on-Cash
                      </div>
                      <div
                        style={s(
                          caps,
                          f3,
                          fg(primaryColor),
                          fg(plColor(projection.cashOnCash))
                        )}
                      >
                        {formatPercent(projection.cashOnCash)}
                      </div>
                    </div>
                    <div style={s(column, alignEnd)}>
                      <div style={s(caps, f0, fg(labelColor))}>Cash flow</div>
                      <div
                        style={s(
                          caps,
                          f3,
                          fg(primaryColor),
                          fg(plColor(projection.cashFlow))
                        )}
                      >
                        {formatUSD(projection.cashFlow)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          <div
            style={s(
              p(s5),
              m(gap),
              card,
              width(500),
              clickable,
              bg(light4),
              center,
              minHeight(200),
              shadow(2, 2, 0, 2, light5)
            )}
            onClick={() => {
              AppStore.update((s) => {
                let newHouse = createNewHouse();
                s.houses.push(newHouse);
                s.changed.add(newHouse.uuid);
                // router.push("/houses/[uuid]", `/houses/${newHouse.uuid}`);
              });
            }}
          >
            <div style={s(fg(dark3), f2, weightSemiBold)}>New property</div>
          </div>
        </div>
      )}
      <Spacer height={gap + s9} />
    </AppContainer>
  );
}
