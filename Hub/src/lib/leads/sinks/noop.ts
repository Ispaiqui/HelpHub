import "server-only";
import type { LeadSink } from "../types";

export const noopSink: LeadSink = {
  name: "noop",
  async write() {},
};
