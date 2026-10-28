import "server-only";
import { JWT } from "google-auth-library";
import type { LeadSink } from "../types";

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function tokenOf(value: string | null | { token?: string | null }) {
  if (typeof value === "string") return value;
  return value?.token ?? "";
}

export const sheetsSink: LeadSink = {
  name: "sheets",
  async write(lead, opts) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
    const range = process.env.GOOGLE_SHEETS_RANGE ?? "";
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
    const key = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(
      /\\n/g,
      "\n",
    );
    if (!/^[a-zA-Z0-9-_]+$/.test(spreadsheetId)) {
      throw new Error("sheets_config");
    }

    const auth = new JWT({ email, key, scopes: [SCOPE] });
    const accessToken = tokenOf(await auth.getAccessToken());
    if (!accessToken) throw new Error("sheets_auth");

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
      `/values/${encodeURIComponent(range)}:append` +
      `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: "POST",
      signal: opts.signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [[
          lead.receivedAt,
          lead.leadId,
          lead.name,
          lead.email,
          lead.phone,
          lead.package,
          lead.message,
          lead.sourcePage,
          lead.consentVersion,
        ]],
      }),
    });

    if (!response.ok) throw new Error("sheets_append");
  },
};
