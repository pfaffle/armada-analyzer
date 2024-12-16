import z from "zod";

const RoundsLog = z
  .object({
    Round: z.coerce.number(),
    "Battle Event": z.coerce.number(),
    Type: z.string(),
    "Attacker Name": z.string(),
    "Attacker Alliance": z.string(),
    "Attacker Ship": z.string(),
    "Attacker - Is Armada?": z.string(),
    "Target Name": z.string(),
    "Target Alliance": z.string(),
    "Target Ship": z.string(),
    "Target - Is Armada?": z.string(),
    "Critical Hit?": z.string(),
    "Hull Damage": z.string(),
    "Shield Damage": z.string(),
    "Mitigated Damage": z.string(),
    "Mitigated Isolytic Damage": z.string(),
    "Mitigated Apex Barrier": z.string(),
    "Total Damage": z.string(),
    "Total Isolytic Damage": z.string(),
    "Ability Type": z.string(),
    "Ability Value": z.string(),
    "Ability Name": z.string(),
    "Ability Owner Name": z.string(),
    "Target Defeated": z.string(),
    // See: Issue #21
    "Target Destroyed": z.string().optional(),
    "Charging Weapons %": z.string().optional(),
  })
  .strict();

export type RoundsLog = z.infer<typeof RoundsLog>;

export type roundsSchemaType = "rounds";

export interface RoundsLogSegment {
  type: "rounds";
  records: RoundsLog[];
}

export const RoundsLogParser = {
  type: "rounds" as const,
  matchesSchema: (input: unknown) => {
    const result = RoundsLog.partial().safeParse(input);
    return result.success;
  },
  parse: (input: unknown[]): RoundsLogSegment => ({
    type: "rounds",
    records: input.map((l) => RoundsLog.parse(l)),
  }),
};
