import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useLayoutEffect,
} from "react";
// prettier-ignore
import {intersperse, round, left, top, justifyBetween, Spacer, mt, absolute, relative, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, transition, transform, center } from "src/styles";
import { DraggableCore } from "react-draggable";
import useDimensions from "react-use-dimensions";
import { primaryColor } from "src/app_styles";
import _ from "lodash";
import { ResizeObserver } from "@juggle/resize-observer";

import { useBoundingclientrect } from "rooks";
import useMeasure from "react-use-measure";

export interface AutoInputProps {}

const AutoInput = forwardRef<any, any>((props, ref) => {
  const { x, style, value } = props;
  const spanRef = useRef(null);
  // const [spanRef, bounds] = useMeasure({
  // polyfill: ResizeObserver,
  // });
  // console.log("bounds:", bounds);
  // const { width: spanWidth } = bounds;
  const [spanWidth, setSpanWidth] = useState(0);
  const propsNoStyles = _.cloneDeep(props);
  propsNoStyles["style"] = undefined;
  console.log("propsNoStyles:", propsNoStyles);
  console.log("spanWidth:", spanWidth);
  useLayoutEffect(() => {
    if (spanRef.current) {
      let rect = spanRef.current.getBoundingClientRect();
      setSpanWidth(rect.width + 4);
    }
  });
  return (
    <div style={s(relative)}>
      <span
        ref={spanRef}
        style={s(
          style,
          absolute,
          opacity(0),
          keyedProp("pointerEvents")("none")
        )}
      >
        {value}
      </span>
      <input
        ref={ref}
        {...propsNoStyles}
        style={s(style, width(spanWidth), px(0))}
      />
    </div>
  );
});

export default AutoInput;
