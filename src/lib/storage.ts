import { UserProgress } from '../types';
import { COMPANION_ALIAS_MAP } from '../data/mockData';

const STORAGE_KEY = 'future_lab_student_progress_v2';

export const INITIAL_PROGRESS: UserProgress = {
  name: 'Тэмүүлэн',
  level: 3,
  track: 'Python · 12 Жилийн аялал',
  currentTask: '7-р даалгавар',
  xp: 2850,
  score: 2140,
  wpm: 46,
  accuracy: 98,
  streak: 14,
  maxStreak: 14,
  hearts: 3,
  maxHearts: 3,
  completedTasksCount: 22,
  activeCompanionId: 'bar', // Зоригт Бар
  unlockedCompanions: ['khulgana', 'ukher', 'bar', 'tuulai', 'luu', 'nokhoi', 'khoni'],
  lastErrorSnippet: {
    userTyped: 'prlnt("Hello World")',
    expected: 'print("Hello World")',
    mistakeIndex: 2,
    errorChar: 'l',
    expectedChar: 'i',
    hint: 'print нэрэнд жижиг латин "i" үсэг ордог. Чи оронд нь "l" бичжээ. Бусад тэмдэгтүүд чинь зөв байна.',
  },
};

export const loadUserProgress = (): UserProgress => {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key v1 for seamless migration
      const legacy = localStorage.getItem('future_lab_student_progress_v1');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const mappedCompanion =
          COMPANION_ALIAS_MAP[parsed.activeCompanionId] || parsed.activeCompanionId || 'bar';
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          activeCompanionId: mappedCompanion,
        };
      }
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    const activeComp = COMPANION_ALIAS_MAP[parsed.activeCompanionId] || parsed.activeCompanionId || 'bar';
    return { ...INITIAL_PROGRESS, ...parsed, activeCompanionId: activeComp };
  } catch {
    return INITIAL_PROGRESS;
  }
};

export const saveUserProgress = (progress: UserProgress) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota
  }
};
