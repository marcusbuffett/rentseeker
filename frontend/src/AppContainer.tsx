import React, { ReactElement, FC, useEffect } from "react";
// prettier-ignore
import { f1, f2, intersperse, mt, absolute, alignCenter, bg, border, br, column, fullWidth, height, p, px, py, row, s, weightBold, width, noResize, justifyCenter, fg, fontSize, clickable, justifyStart, pl, pr, size, weightSemiBold, weightRegular, minWidth, mr, maxWidth, selfCenter, opacity, mb, light1, flexGrow, grow, pageHeight, dark4, dark3, dark5, light2, full, Spacer, s6, caps, light3, light4, s4, s8, s7, dark1, dark2, flexible, justifyEnd, s5, light5, s2, f0, alignEnd, dark0, boxShadow, keyedProp } from "src/styles";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWindowSize } from "rooks";
import { useModal } from "react-modal-hook";
import { SignInForm } from "src/SignInForm";
import _ from "lodash";
import { HouseUploadService } from "src/HouseUploadService";
import { AppStore } from "src/store";
import { PersistenceService } from "src/PersistenceService";
import Head from "next/head";

const navItems = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "new",
    path: "/new",
  },
];

export const AppContainer: FC<{}> = (props): ReactElement => {
  const router = useRouter();
  const { innerWidth } = useWindowSize();
  const mobile = innerWidth < 1000;
  const [openSignIn, closeSignIn] = useModal(() => {
    return <SignInForm onClose={closeSignIn} />;
  });
  useEffect(() => {
    // @ts-ignore
    window.store = AppStore;
  }, []);
  const user = AppStore.useState((s) => {
    return s.user;
  });
  const loggedIn = !_.isNil(user);
  return (
    <div style={s(column, pageHeight)}>
      <Head>
        <title>rentseeker</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta property="og:title" content="rentseeker" />
        <meta property="og:image" content="[My Image URL]" />
        <meta
          property="og:description"
          content="Calculate returns and keep track of your investment properties"
        />
        <meta property="og:site_name" content="rentseeker" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Calculate returns and keep track of your investment properties"
        />
      </Head>
      <HouseUploadService />
      <PersistenceService />
      <div
        style={s(
          height(80),
          bg(dark2),
          row,
          alignCenter,
          justifyCenter,
          boxShadow("0px 2px 10px 0px hsla(0, 0%, 0%, 0.2)"),
          keyedProp("zIndex")(1),
          px(mobile ? s6 : s8)
        )}
      >
        <div style={s(selfCenter, row, maxWidth(1200), px(s8), fullWidth)}>
          <div
            style={s(grow, justifyStart, row, alignEnd, clickable)}
            onClick={() => {
              router.push("/");
            }}
          >
            <img src="/logo.png" style={s(size(32))} />
            <Spacer width={12} />
            <div style={s(f2, fg(light3), mb(-4))}>rentseeker</div>
          </div>
          {/*<div style={s(flexGrow(2), row, justifyCenter, alignCenter)}>
          intersperse(
            navItems.map(({ name, path }) => {
              const isActive = path === router.asPath;
              const color = isActive ? light1 : light4;
              return (
                <Link href={path}>
                  <div
                    style={s(
                      f1,
                      fg(color),
                      weightSemiBold,
                      caps,
                      column,
                      clickable,
                      p(s4),
                      alignCenter
                    )}
                  >
                    {name}
                    {isActive && (
                      <>
                        <Spacer height={2} />
                        <div
                          style={s(
                            height(2),
                            width("calc(100% + 20px)"),
                            bg(color)
                          )}
                        />
                      </>
                    )}
                  </div>
                </Link>
              );
            }),
            (i) => (
              <Spacer key={i} width={32} />
            )
)
        </div>*/}
          <div style={s(grow, justifyEnd, row)}>
            {loggedIn ? (
              <div style={s(column, alignEnd)}>
                <div style={s(fg(light3))}>{user.email}</div>
                {!mobile && (
                  <>
                    <Spacer height={s2} />
                    <div style={s(fg(light5), f0)}>Real estate mogul</div>
                  </>
                )}
              </div>
            ) : (
              <div
                style={s(
                  bg(light2),
                  f1,
                  br(2),
                  px(s6),
                  py(s4),
                  clickable,
                  weightSemiBold
                )}
                onClick={() => {
                  openSignIn();
                }}
              >
                Sign in
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={s(grow, bg(dark3), fg(light2), column)}>
        <Spacer height={s8} />
        <div style={s(full, maxWidth(1200), selfCenter, px(s8), grow)}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AppContainer;
