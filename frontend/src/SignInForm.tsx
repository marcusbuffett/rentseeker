import { type } from "os";
import React, { ReactElement, useRef, useState } from "react";
import { inputStyles, primaryColor, secondaryColor } from "src/app_styles";
// prettier-ignore
import {justifyEnd, justifyBetween, intersperse, Spacer, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, selfStretch, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, s6, full, f2, f3, caps, light3, light4, light5, flexWrap, dark2, s4, s3, hsl, f0, f1, selfEnd, alignEnd, alignStretch, keyedProp, inline, s5, alignStart, dark1, shadow, dark0, flexible, textAlign, s7, s8, s9, s10, selfStart, constrainWidth, center, light0, textOverflowClip, oneLine, stiff, modalContainer, light35 } from "src/styles";
import superagent from "superagent";
import { AppStore } from "src/store";

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
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const houses = AppStore.useState((s) => s.houses);
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
      <div style={s(bg(dark1), br(4), column, p(s6), width(350))}>
        <div style={s(f1, fg(light35))}>
          Sign up or log in to save your properties and share revenue
          projections
        </div>
        <Spacer height={s8} />
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          className="input-light-placeholder"
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
          className="input-light-placeholder"
          placeholder="password"
          type="password"
        />
        {error ? (
          <>
            <Spacer height={s6} />
            <div style={s(fg(light1), f1)}>{error}</div>
            <Spacer height={s6} />
          </>
        ) : (
          <Spacer height={44} />
        )}
        <div style={s(row, center, justifyEnd)}>
          <div
            style={s(buttonStyles, bg(secondaryColor))}
            onClick={() => {
              superagent
                .post("/api/signup")
                .send({ email, password })
                .end((err, res) => {
                  if (!err) {
                    AppStore.update((s) => {
                      s.jwt = res.body.token;
                      s.user = { email };
                    });
                    AppStore.update((s) => {
                      let uuids = s.houses.map((h) => h.uuid);
                      console.log("uuids:", uuids);
                      s.changed = new Set(uuids);
                      console.log("s.changed:", s.changed);
                      s.user = { email };
                    });
                    onClose();
                  } else {
                    setError(
                      "Error signing up. Have you already signed up with that email?"
                    );
                  }
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
                  if (err) {
                    setError(
                      "Error logging in. Please confirm your email and password are entered correctly."
                    );
                  } else {
                    AppStore.update((s) => {
                      s.jwt = res.body.token;
                      s.user = { email };
                    });
                    onClose();
                  }
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
