import z from "zod";

const RewardsLog = z
  .object({
    "Reward Name": z.string(),
    Count: z.coerce.number(),
  })
  .strict();

export type RewardsLog = z.infer<typeof RewardsLog>;

export interface ParsedRewardsLogSegment {
  type: "rewards";
  records: RewardsLog[];
}

export const RewardsLogParser = {
  parse: (input: unknown[]): ParsedRewardsLogSegment | undefined => {
    try {
      return {
        type: "rewards" as const,
        records: input.map((l) => RewardsLog.parse(l)),
      };
    } catch (e) {
      return;
    }
  },
};
