import "server-only";
import type { LeadSink } from "../types";

export const logSink: LeadSink = {
  name: "log",
  async write(lead) {
    console.info("[lead]", JSON.stringify(lead));
  },
};
