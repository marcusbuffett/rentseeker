import React, { ReactElement, useEffect, useRef, useState } from "react";
// prettier-ignore
import {flex, flexible, round, left, top, justifyBetween, intersperse, Spacer, mt, absolute, relative, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, transition, transform, s2, noBorder } from "src/styles";
import Draggable, { DraggableCore } from "react-draggable";
import useDimensions from "react-use-dimensions";
import { editableStyles, primaryColor } from "src/app_styles";
import { FieldFormat } from "src/models";
import { Slider } from "src/Slider";
import {
  formatPercent,
  formatUSDLarge,
  formatWholePercent,
} from "src/utilities";
import AutosizeInput from "react-input-autosize";
import { usePrevious } from "rooks";

export const AnnotatedSlider = ({
  formatter,
  field,
  value,
  slider,
  onValueChange,
}: {
  slider: {
    min: number;
    max: number;
    step: number;
  };
  formatter: (x: number) => string;
  field: string;
  value: number;
  onValueChange: (number) => void;
}): ReactElement => {
  const onChange = (x: number) => {
    onValueChange(x);
  };
  const [editingValue, setEditingValue] = useState(formatter(value));
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  return (
    <div style={s(column, flex)}>
      <div style={s(row, justifyBetween, alignEnd)}>
        <div style={s(fg(light3), caps, f0)}>{field}</div>
        <AutosizeInput
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("ENTER!");
              console.log("inputRef.current:", inputRef.current);
              inputRef.current.input.blur();
            }
          }}
          value={editing ? editingValue : formatter(value)}
          onFocus={() => {
            setEditingValue(formatter(value));
            setEditing(true);
          }}
          onBlur={() => {
            setEditing(false);
          }}
          onChange={(e) => {
            let val = e.target.value;
            setEditingValue(val);
            // val = val.match(/[\d.]+/)[0];
            val = val.replace(/[^0-9.]/g, "");
            let parsed = Number.parseFloat(val);
            if (!isNaN(parsed) && val !== "") {
              if (
                formatter === formatPercent ||
                formatter === formatWholePercent
              ) {
                onValueChange(parsed / 100);
              } else {
                onValueChange(parsed);
              }
            }
          }}
          inputStyle={s(f2, fg(light3), bg("transparent"), editableStyles)}
        />
      </div>
      <Spacer height={16} />
      <Slider onValueChange={onChange} value={value} {...slider} />
    </div>
  );
};
