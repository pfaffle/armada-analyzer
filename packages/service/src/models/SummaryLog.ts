import z from "zod";

const SummaryLog = z
  .object({
    "Player Name": z.string(),
    "Player Level": z.coerce.number(),
    Outcome: z.string(),
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

export type summarySchemaType = "summary";

export interface SummaryLogSegment {
  type: "summary";
  records: SummaryLog[];
}

export const SummaryLogParser = {
  type: "summary" as const,
  matchesSchema: (input: unknown) =>
    SummaryLog.partial().safeParse(input).success,
  parse: (input: unknown[]): SummaryLogSegment => ({
    type: "summary",
    records: input.map((l) => SummaryLog.parse(l)),
  }),
};
