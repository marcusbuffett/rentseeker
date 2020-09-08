import React, { FC } from "react";
import _ from "lodash";

export const s = (...args) => _.assign({}, ...args);

export const s0 = 0.0;
export const s1 = 1.0;
export const s2 = 2.0;
export const s3 = 4.0;
export const s4 = 8.0;
export const s5 = 12.0;
export const s6 = 16.0;
export const s7 = 24.0;
export const s8 = 32.0;
export const s9 = 48.0;
export const s10 = 64.0;
export const s11 = 128.0;
export const s12 = 256.0;

export const fontSize = (size: number) => {
  return {
    fontSize: size,
  };
};

export const f0 = fontSize(12.0);
export const f1 = fontSize(16.0);
export const f2 = fontSize(24.0);
export const f3 = fontSize(32.0);
export const f4 = fontSize(48.0);

export const Spacer: FC<{ height?: number; width?: number }> = ({
  height = null,
  width = null,
}) => {
  return (
    <div
      style={{
        height: height,
        width: width,
        flexShrink: 0,
      }}
    ></div>
  );
};

export const bg = (color: string) => {
  return {
    backgroundColor: color,
  };
};

export const caps = {
  textTransform: "uppercase",
  letterSpacing: "0.05rem",
};

const graysHue = 180;

export const hsl = (h, s, l) => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hsla = (h, s, l, a) => {
  return `hsl(${h}, ${s}%, ${l}%, ${a}%)`;
};

export const createGray = (lightness: number) => {
  const maxGraysSaturation = 12;
  const minGraysSaturation = 5;
  return hsl(
    graysHue,
    maxGraysSaturation -
      (lightness / 100) * (maxGraysSaturation - minGraysSaturation),
    lightness
  );
};

export const light0 = createGray(99);
export const light1 = createGray(96);
export const light2 = createGray(93);
export const light3 = createGray(84);
export const light35 = createGray(77);
export const light4 = createGray(70);
export const light5 = createGray(50);

export const dark0 = createGray(2);
export const dark1 = createGray(5);
export const dark2 = createGray(10);
export const dark3 = createGray(15);
export const dark4 = createGray(20);
export const dark5 = createGray(30);
export const dark6 = createGray(40);

export const textDark = "hsl(0, 0%, 10%)";

export const keyedProp = (key: string) => (x: any) => {
  return {
    [key]: x,
  };
};

export const p = keyedProp("padding");
export const pt = keyedProp("paddingTop");
export const pb = keyedProp("paddingBottom");
export const pl = keyedProp("paddingLeft");
export const pr = keyedProp("paddingRight");
export const px = (x) => s(pl(x), pr(x));
export const py = (x) => s(pt(x), pb(x));

export const m = keyedProp("margin");
export const mt = keyedProp("marginTop");
export const mb = keyedProp("marginBottom");
export const ml = keyedProp("marginLeft");
export const mr = keyedProp("marginRight");
export const mx = (x) => s(ml(x), mr(x));
export const my = (x) => s(mt(x), mb(x));

export const weightThin = keyedProp("fontWeight")(300);
export const weightRegular = keyedProp("fontWeight")(400);
export const weightSemiBold = keyedProp("fontWeight")(500);
export const weightBold = keyedProp("fontWeight")(600);

export const flexGrow = keyedProp("flexGrow");
export const grow = keyedProp("flexGrow")(1);
export const displayFlex = keyedProp("display")("flex");
export const inline = keyedProp("display")("inline");

export const pageHeight = keyedProp("minHeight")("100vh");
export const fullHeight = keyedProp("height")("100%");
export const fullWidth = keyedProp("width")("100%");
export const full = s(fullHeight, fullWidth);

export const height = keyedProp("height");
export const width = keyedProp("width");
export const size = (x: string | number) => {
  return s(height(x), width(x));
};

export const selfCenter = keyedProp("alignSelf")("center");
export const selfStart = keyedProp("alignSelf")("flex-start");
export const selfEnd = keyedProp("alignSelf")("flex-end");
export const selfStretch = keyedProp("alignSelf")("stretch");
export const alignStart = keyedProp("alignItems")("flex-start");
export const alignEnd = keyedProp("alignItems")("flex-end");
export const alignStretch = keyedProp("alignItems")("stretch");
export const justifyStart = keyedProp("justifyContent")("flex-start");
export const justifyEnd = keyedProp("justifyContent")("flex-end");
export const justifyBetween = keyedProp("justifyContent")("space-between");
export const alignCenter = keyedProp("alignItems")("center");
export const justifyCenter = keyedProp("justifyContent")("center");

export const fg = keyedProp("color");

export const flexWrap = keyedProp("flexWrap")("wrap");

export const border = (width, style, color) => {
  return keyedProp("border")(`${width}px ${style} ${color}`);
};
export const noBorder = keyedProp("border")("none");

export const center = s(alignCenter, justifyCenter, displayFlex);

export const br = keyedProp("borderRadius");
export const brtl = keyedProp("borderTopLeftRadius");
export const brtr = keyedProp("borderTopRightRadius");
export const brbl = keyedProp("borderBottomLeftRadius");
export const brbr = keyedProp("borderBottomRightRadius");
export const brl = (x) => {
  return s(brtl(x), brbl(x));
};
export const brr = (x) => s(brtr(x), brbr(x));
export const maxWidth = keyedProp("maxWidth");
export const minWidth = keyedProp("minWidth");
export const minHeight = keyedProp("minHeight");
export const constrainWidth = maxWidth("100%");
export const clickable = keyedProp("cursor")("pointer");
export const noBasis = keyedProp("flexBasis")(0);
export const round = keyedProp("borderRadius")(999);
export const flexible = s(keyedProp("flexBasis")(0), keyedProp("minWidth")(0));
export const flex = s(keyedProp("flex")(1));
export const whenMobile = (width, x, y) => {
  if (width < 600) {
    return x;
  } else {
    return y;
  }
};

export const row = s(displayFlex, keyedProp("flexDirection")("row"));
export const column = s(displayFlex, keyedProp("flexDirection")("column"));
export const absolute = keyedProp("position")("absolute");
export const fixed = keyedProp("position")("fixed");
export const relative = keyedProp("position")("relative");

export const noResize = keyedProp("resize")("none");

export const opacity = keyedProp("opacity");

export const left = keyedProp("left");
export const right = keyedProp("right");
export const bottom = keyedProp("bottom");
export const top = keyedProp("top");

export const intersperse = <T,>(arr: T[], separator: (n: number) => T): T[] =>
  arr.reduce<T[]>((acc, currentElement, currentIndex) => {
    const isLast = currentIndex === arr.length - 1;
    return [
      ...acc,
      currentElement,
      ...(isLast ? [] : [separator(currentIndex)]),
    ];
  }, []);

export const boxShadow = keyedProp("boxShadow");
export const shadow = (x, y, blur, spread, color) => {
  return {
    boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`,
  };
};

export const transition = keyedProp("transition");
export const transform = keyedProp("transform");

export const textAlign = keyedProp("textAlign");

export const hideOverflow = keyedProp("overflow")("hidden");

export const textOverflowClip = s(
  keyedProp("textOverflow")("ellipsis"),
  hideOverflow
);
export const oneLine = keyedProp("whiteSpace")("nowrap");

export const stiff = s(
  keyedProp("flexGrow")("0"),
  keyedProp("flexShrink")("0")
);

export const modalContainer = s(
  fixed,
  fullWidth,
  fullHeight,
  center,
  top(0),
  left(0),
  br(2),
  bg(hsla(0, 0, 100, 30))
);
