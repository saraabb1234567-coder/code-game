export type PageType =
  | 'landing'
  | 'catalog'
  | 'shooter'
  | 'terminal'
  | 'lesson'
  | 'error_diag'
  | 'victory'
  | 'roadmap'
  | 'companions'
  | 'ai_agent';

export type ZodiacAnimalId =
  | 'khulgana' // 1. Хулгана
  | 'ukher'    // 2. Үхэр
  | 'bar'      // 3. Бар
  | 'tuulai'   // 4. Туулай
  | 'luu'      // 5. Луу
  | 'mogoi'    // 6. Могой
  | 'mori'     // 7. Морь
  | 'khoni'    // 8. Хонь
  | 'bich'     // 9. Бич
  | 'takhia'   // 10. Тахиа
  | 'nokhoi'   // 11. Нохой
  | 'gakhai';  // 12. Гахай

export type ZodiacElement = 'Гал' | 'Ус' | 'Мод' | 'Шороо' | 'Төмөр';

export type MongolianRealmId =
  | 'steppe'       // Монголын тал нутаг
  | 'altai'        // Алтайн уулс
  | 'gobi'         // Говийн элсэн манхан
  | 'khangai'      // Хангайн ой мод
  | 'neo_ger'      // Монгол гэрийн хотхон
  | 'tenger'       // Ододтой шөнийн тэнгэр
  | 'dragon_realm'; // Домогт луугийн ертөнц

export type MascotAnimationState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'dance'
  | 'attack'
  | 'victory'
  | 'defeat'
  | 'hover'
  | 'click'
  | 'level_up'
  | 'sleep'
  | 'walk_run'
  | 'happy'
  | 'sad';

export interface Companion {
  id: string;
  name: string;
  mongolianName: string;
  zodiacId: ZodiacAnimalId;
  zodiacIndex: number;
  zodiacYearName: string;
  element: ZodiacElement;
  realm: string;
  role: string;
  title: string;
  description: string;
  rarity: 'Энгийн' | 'Ховор' | 'Домгийн';
  unlocked: boolean;
  level: number;
  bonus: string;
  specialMove: string;
  unlockRequirement: string;
  image: string;
  heroImage: string;
  traits: string[];
  quotes: {
    happy: string;
    sad: string;
    normal: string;
    victory?: string;
  };
}

export interface UserProgress {
  name: string;
  level: number;
  track: string;
  currentTask: string;
  xp: number;
  score: number;
  wpm: number;
  accuracy: number;
  streak: number;
  maxStreak: number;
  hearts: number;
  maxHearts: number;
  completedTasksCount: number;
  activeCompanionId: string;
  unlockedCompanions: string[];
  lastErrorSnippet?: {
    userTyped: string;
    expected: string;
    mistakeIndex: number;
    errorChar: string;
    expectedChar: string;
    hint: string;
  };
}

export interface TargetEnemy {
  id: string;
  code: string;
  language: string;
  x: number; // percentage in arena
  y: number; // percentage in arena
  monsterType: string;
  monsterImage: string;
  zodiacId?: ZodiacAnimalId;
  status: 'pending' | 'targeted' | 'hit' | 'destroyed';
  hint: string;
  explanation: string;
}

export interface CurriculumStep {
  step: string;
  title: string;
  tasksCompleted: number;
  totalTasks: number;
  status: 'completed' | 'active' | 'locked';
  description: string;
  tags: string[];
  guardianZodiac?: ZodiacAnimalId;
}

export interface MongolianRealm {
  id: MongolianRealmId;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  bgGradient: string;
  element: ZodiacElement;
  guardian: string;
}
