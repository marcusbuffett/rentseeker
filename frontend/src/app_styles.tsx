import React, { FC } from "react";
import _ from "lodash";
// prettier-ignore
import {noBorder, justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, s2, createGray } from "src/styles";

export const card = s(p(s5), br(s3), bg(dark2), shadow(2, 2, 0, 2, dark0));
export const primaryColor = hsl(210, 60, 40);
export const secondaryColor = hsl(300, 70, 30);
export const profitColor = hsl(100, 40, 50);
export const lossColor = hsl(0, 40, 50);

export const editableStyles = s(
  py(s2),
  // px(s4),
  br(2),
  // bg(createGray(13)),
  keyedProp("borderBottom")(`1px solid ${light5}`),
  clickable
);

export const inputStyles = s(noBorder, p(s6), bg(light2), br(2), f1);

export const plColor = (x: number) => {
  if (x >= 0) {
    return profitColor;
  } else {
    return lossColor;
  }
};
