import React, { ReactElement, useState } from "react";
// prettier-ignore
import {intersperse, round, left, top, justifyBetween, Spacer, mt, absolute, relative, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, transition, transform, center } from "src/styles";
import { DraggableCore } from "react-draggable";
import useDimensions from "react-use-dimensions";
import { primaryColor } from "src/app_styles";
import _ from "lodash";

export const Selector = ({
  choices,
  setChoice,
  currentChoice,
}: {
  choices: string[];
  setChoice: (c: string) => void;
  currentChoice: string;
}): ReactElement => {
  const fadedColor = light4;
  return (
    <div style={s(row)}>
      {intersperse(
        choices.map((choice) => {
          const active = choice === currentChoice;
          return (
            <div
              onClick={() => {
                setChoice(choice);
              }}
              style={s(
                active
                  ? s(weightBold, bg(light2), fg(dark2))
                  : s(
                      weightBold,
                      fg(fadedColor),
                      border(1, "solid", fadedColor)
                    ),
                f1,
                clickable,
                py(s4),
                width(140),
                center,
                br(2)
              )}
            >
              {choice}
            </div>
          );
        }),
        (i) => (
          <Spacer width={s6} />
        )
      )}
    </div>
  );
};
