"use client";

import { NextUIProvider } from "@nextui-org/react";
import { App, ConfigProvider } from "antd";

// import {TokenUtil} from "#/utils/token";

// TokenUtil.loadToken();
export const Providers = ({ children }: any) => {
  return (
    <NextUIProvider>
      <ConfigProvider>
        <App>{children}</App>
      </ConfigProvider>
    </NextUIProvider>
  );
};
