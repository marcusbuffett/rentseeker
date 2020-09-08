import React, { ReactElement, useState } from "react";
// prettier-ignore
import {round, left, top, justifyBetween, intersperse, Spacer, mt, absolute, relative, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, transition, transform, dark6, my, hsla } from "src/styles";
import { DraggableCore } from "react-draggable";
import useDimensions from "react-use-dimensions";
import { primaryColor } from "src/app_styles";
import _ from "lodash";

export const Slider = ({
  onValueChange,
  value,
  min,
  max,
  step,
}: {
  onValueChange: (number) => void;
  value: number;
  step: number;
  min: number;
  max: number;
}): ReactElement => {
  const percentage = (_.clamp(value, min, max) - min) / (max - min);

  const [sliderWidthRef, { width: sliderWidth }] = useDimensions();
  const [isSliding, setIsSliding] = useState(false);
  const radius = isSliding ? 24 : 16;
  const sliderHeight = 3;
  const sliderUpdated = (x) => {
    x = _.clamp(x, 0, sliderWidth);
    let val = (x / sliderWidth) * (max - min) + min;
    let numSteps = (val - min) / step;
    val = min + step * Math.round(numSteps);
    onValueChange(val);
  };
  return (
    <div style={s(fullWidth, relative)}>
      <DraggableCore
        onStart={(e, { x }) => {
          setIsSliding(true);
          sliderUpdated(x);
        }}
        onDrag={(e, { x }) => {
          sliderUpdated(x);
        }}
        onStop={() => {
          setIsSliding(false);
        }}
        onMouseDown={(e) => {}}
      >
        <div style={s(fullWidth, relative, clickable, py(s4))}>
          <div
            style={s(
              fullWidth,
              bg(dark6),
              height(sliderHeight),
              round,
              shadow(0, 4, 10, 1, hsla(0, 0, 0, 10))
            )}
            ref={sliderWidthRef}
          ></div>
          <div
            style={s(
              width(`${percentage * 100}%`),
              bg(hsl(210, 0, 80)),
              height(sliderHeight),
              round,
              absolute,
              left(0),
              top(s4)
            )}
          ></div>
          <div
            style={s(
              clickable,
              round,
              size(radius),
              bg(light3),
              transition(
                "height 200ms linear, width 200ms linear, top 200ms linear"
              ),
              absolute,
              top(-(radius / 2) + sliderHeight / 2 + s4),
              transform("translateX(-50%)"),
              left(`${percentage * 100}%`)
            )}
          ></div>
        </div>
      </DraggableCore>
    </div>
  );
};
