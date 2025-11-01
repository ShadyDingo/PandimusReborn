export type User = {
  id: string;
  username: string;
  email?: string | null;
};

export type Ability = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  school: string;
  target: string;
  basePower: number;
  cooldownTurns: number;
};

export type Item = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  rarity: string;
  slot?: string | null;
  stats: Record<string, unknown>;
};

export type LoadoutAbility = {
  id: string;
  slot: number;
  priority: number;
  ability: Ability;
};

export type LoadoutEquipment = {
  id: string;
  slot: string;
  item: Item;
};

export type Loadout = {
  id: string;
  name: string;
  isActive: boolean;
  abilities: LoadoutAbility[];
  equipment: LoadoutEquipment[];
};

export type Character = {
  id: string;
  userId: string;
  name: string;
  class: string;
  level: number;
  experience: number;
  gold: number;
  powerRating: number;
  baseStats: Record<string, number>;
  loadouts: Loadout[];
};

export type MissionEnemy = {
  id: string;
  quantity: number;
  priority: number;
  enemy: {
    id: string;
    name: string;
    level: number;
    baseStats: Record<string, number>;
  };
};

export type Mission = {
  id: string;
  code: string;
  name: string;
  description?: string;
  difficultyRating: number;
  durationMinutes: number;
  baseExperience: number;
  baseGold: number;
  enemies: MissionEnemy[];
};

export type CombatEncounter = {
  id: string;
  result: 'VICTORY' | 'DEFEAT' | 'RETREAT' | 'ABORTED';
  rounds: number;
  summary: {
    rewards: {
      experience: number;
      gold: number;
      loot: Array<{ itemSlug: string; quantity: number }>;
    };
    characterRemainingHealth: number;
    enemyCount: number;
  };
  mission?: Mission;
  createdAt: string;
};

export type IdleSession = {
  id: string;
  missionId: string;
  startedAt: string;
  endedAt?: string | null;
  hoursOffline?: number;
  claimed: boolean;
  rewards?: {
    experience: number;
    gold: number;
    items: Array<{ itemSlug: string; quantity: number }>;
  };
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type ClassDefinition = {
  key: string;
  name: string;
  description: string;
  baseStats: Record<string, number>;
};
