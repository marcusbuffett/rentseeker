import { type } from "os";
import React, { ReactElement, useRef, useState } from "react";
import { inputStyles, primaryColor, secondaryColor } from "src/app_styles";
import { AppAction } from "src/redux/reducer";
// prettier-ignore
import {justifyEnd, justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, selfStretch, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, alignStretch, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, flexible, textAlign, s7, s8, s9, s10, selfStart, constrainWidth, center, light0, textOverflowClip, oneLine, stiff, modalContainer } from "src/styles";
import superagent from "superagent";
import { useDispatch } from "react-redux";

export const SignInForm = ({ onClose }) => {
  const ref = useRef(null);
  const buttonStyles = s(
    br(2),
    bg(primaryColor),
    f1,
    weightSemiBold,
    caps,
    width(100),
    center,
    py(s5),
    fg(light1),
    clickable
  );
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  return (
    <div
      style={s(modalContainer)}
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) {
          onClose();
        }
      }}
    >
      <div style={s(bg(light0), br(2), column, p(s6), width(350))}>
        <div style={s(f2, weightSemiBold)}>Sign up / Log in</div>
        <Spacer height={44} />
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          style={s(inputStyles)}
          placeholder="email"
        />
        <Spacer height={24} />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          style={s(inputStyles)}
          placeholder="password"
          type="password"
        />
        <Spacer height={44} />
        <div const style={s(row, center, justifyEnd)}>
          <div
            style={s(buttonStyles, bg(secondaryColor))}
            onClick={() => {
              superagent
                .post("/api/signup")
                .send({ email, password })
                .end((err, res) => {
                  console.log("res:", res);
                  dispatch({
                    type: AppAction.Login,
                    user: {
                      email,
                    },
                    token: res.body.token,
                  });
                });
            }}
          >
            SIGN UP
          </div>
          <Spacer width={s5} />
          <div
            style={s(buttonStyles)}
            onClick={() => {
              superagent
                .post("/api/login")
                .send({ email, password })
                .end((err, res) => {
                  dispatch({
                    type: AppAction.Login,
                    user: {
                      email,
                    },
                    token: res.body.token,
                  });
                });
            }}
          >
            LOG IN
          </div>
        </div>
      </div>
    </div>
  );
};
