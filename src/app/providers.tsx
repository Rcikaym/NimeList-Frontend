"use client";

import React, { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";

// import {TokenUtil} from "#/utils/token";

// TokenUtil.loadToken();
export const Providers = ({ children }: any) => {
  // useEffect(() => {
  //   // @ts-ignore
  //   document.documentElement.style.opacity = 1
  // }, []);

  return (
     <NextUIProvider >
     {children}
   </NextUIProvider>
  );
};
