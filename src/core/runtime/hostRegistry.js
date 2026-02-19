// src/runtime/hostRegistry.js
import WebHost from "../../core/uiHosts/web/WebHost";
import MobileHost from "../../core/uiHosts/mobile/MobileHost";
import AdminHost from "../../core/uiHosts/admin/AdminHost";

export const hostRegistry = {
  web: WebHost,
  mobile: MobileHost,
  admin: AdminHost,
};
