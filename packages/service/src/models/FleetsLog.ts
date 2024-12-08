import z from "zod";

const FleetsLog = z
  .object({
    "Fleet Type": z.string(),
    Attack: z.coerce.number(),
    Defense: z.coerce.number(),
    Health: z.coerce.number(),
    "Ship Ability": z.string(),
    "Captain Maneuver": z.string(),
    "Officer One Ability": z.string(),
    "Officer Two Ability": z.string(),
    "Officer Three Ability": z.string(),
    "Officer Attack Bonus": z.coerce.number(),
    "Damage Per Round": z.coerce.number(),
    "Armour Pierce": z.coerce.number(),
    "Shield Pierce": z.coerce.number(),
    Accuracy: z.coerce.number(),
    "Critical Chance": z.coerce.number(),
    "Critical Damage": z.coerce.number(),
    "Officer Defense Bonus": z.coerce.number(),
    Armour: z.coerce.number(),
    "Shield Deflection": z.coerce.number(),
    Dodge: z.coerce.number(),
    "Officer Health Bonus": z.coerce.number(),
    "Shield Health": z.coerce.number(),
    "Hull Health": z.coerce.number(),
    "Impulse Speed": z.coerce.number(),
    "Warp Range": z.coerce.number(),
    "Warp Speed": z.coerce.number(),
    "Cargo Capacity": z.coerce.number(),
    "Protected Cargo": z.coerce.number(),
    "Mining Bonus": z.coerce.number(),
    "Debuff applied": z.string(),
    "Buff applied": z.string(),
  })
  .strict();

export type FleetsLog = z.infer<typeof FleetsLog>;

export type fleetsSchemaType = "fleets";

export interface FleetsLogSegment {
  type: "fleets";
  records: FleetsLog[];
}

export const FleetsLogParser = {
  type: "fleets" as const,
  matchesSchema: (input: unknown) =>
    FleetsLog.partial().safeParse(input).success,
  parse: (input: unknown[]): FleetsLogSegment => ({
    type: "fleets",
    records: input.map((l) => FleetsLog.parse(l)),
  }),
};
