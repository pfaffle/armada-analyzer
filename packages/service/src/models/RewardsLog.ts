import z from "zod";

const RewardsLog = z
  .object({
    "Reward Name": z.string(),
    Count: z.coerce.number(),
  })
  .strict();

export type RewardsLog = z.infer<typeof RewardsLog>;

export type rewardsSchemaType = "rewards";

export interface RewardsLogSegment {
  type: "rewards";
  records: RewardsLog[];
}

export const RewardsLogParser = {
  type: "rewards" as const,
  matchesSchema: (input: unknown) =>
    RewardsLog.partial().safeParse(input).success,
  parse: (input: unknown[]): RewardsLogSegment => ({
    type: "rewards",
    records: input.map((l) => RewardsLog.parse(l)),
  }),
};
