import z from "zod";

const SummaryLog = z
  .object({
    "Player Name": z.string(),
    "Player Level": z.coerce.number(),
    Outcome: z.union([
      z.literal("VICTORY"),
      z.literal("DEFEAT"),
      z.literal("PARTIAL"),
    ]),
    "Ship Name": z.string(),
    "Ship Level": z.coerce.number(),
    "Ship Strength": z.coerce.number(),
    "Ship XP": z.coerce.number(),
    "Officer One": z.string(),
    "Officer Two": z.string(),
    "Officer Three": z.string(),
    "Hull Health": z.coerce.number(),
    "Hull Health Remaining": z.coerce.number(),
    "Shield Health": z.coerce.number(),
    "Shield Health Remaining": z.coerce.number(),
    Location: z.string(),
    Timestamp: z.string(), // todo Date/time?
  })
  .strict();

export type SummaryLog = z.infer<typeof SummaryLog>;

export interface ParsedSummaryLogSegment {
  type: "summary";
  records: SummaryLog[];
}

export const SummaryLogParser = {
  parse: (input: unknown[]): ParsedSummaryLogSegment | undefined => {
    try {
      return {
        type: "summary" as const,
        records: input.map((l) => SummaryLog.parse(l)),
      };
    } catch (e) {
      return;
    }
  },
};
