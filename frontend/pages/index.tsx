// prettier-ignore
import {justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0 } from "src/styles";
import AppContainer from "src/AppContainer";
import { Investment } from "src/models";
import { useSelector } from "react-redux";
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

export default function Home() {
  const investments = AppStore.useState((state) => state.houses);
  console.log("investments:", investments);
  const labelColor = light4;
  const { innerWidth } = useWindowSize();
  const mobile = innerWidth < 1000;
  const gap = mobile ? 32 : 64;
  return (
    <AppContainer>
      <div style={s(f2, fg(light3), caps, weightBold)}>Houses</div>
      <Spacer height={32} />
      <div style={s(row, flexWrap, mt(-gap), justifyBetween)}>
        {intersperse(
          investments.map((investment) => {
            const downTitleStyles = s(f3, inline, fg(light3));
            const downSubtitleStyles = s(f0, inline, fg(labelColor), caps);
            const projection = createInvestmentProjection(investment);
            return (
              <Link href="/houses/[uuid]" as={`/houses/${investment.uuid}`}>
                <div style={s(p(s5), mt(gap), card, width(500), clickable)}>
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
          }),
          (i) => (
            <Spacer key={i} width={48} />
          )
        )}
      </div>
    </AppContainer>
  );
}
