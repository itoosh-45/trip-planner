import type { PlannerState, DayPlan, Expense } from '../types/index';
import { DEFAULT_BUDGET_CATEGORIES, generateId } from '../types/index';

export function getSampleData(): PlannerState {
  const day1Id = generateId();
  const day2Id = generateId();
  const day3Id = generateId();
  const day4Id = generateId();
  const day5Id = generateId();

  const days: DayPlan[] = [
    {
      id: day1Id,
      dayNumber: 1,
      date: '2026-10-15',
      title: 'הגעה לרומא',
      destination: 'רומא',
      activities: [
        {
          id: generateId(),
          time: '14:00',
          title: 'הגעה לשדה תעופה רומא (FCO)',
          category: 'transport',
          estimatedCost: 15,
          isCompleted: true,
        },
        {
          id: generateId(),
          time: '15:30',
          title: 'צ\'ק-אין במלון',
          category: 'accommodation',
          estimatedCost: 0,
          isCompleted: true,
          description: 'מלון במרכז העיר',
        },
        {
          id: generateId(),
          time: '18:30',
          title: 'טיול ערב ליד מזרקת טרווי',
          category: 'free',
          estimatedCost: 0,
          isCompleted: true,
        },
        {
          id: generateId(),
          time: '19:30',
          title: 'ארוחת ערב במסעדה מקומית',
          category: 'restaurant',
          estimatedCost: 80,
          isCompleted: true,
          description: 'טרטוריה ליד המלון',
        }
      ]
    },
    {
      id: day2Id,
      dayNumber: 2,
      date: '2026-10-16',
      title: 'סיור ברומא',
      destination: 'רומא',
      activities: [
        {
          id: generateId(),
          time: '09:00',
          title: 'ביקור בקולוסיאום',
          category: 'attraction',
          estimatedCost: 40,
          isCompleted: true,
          description: 'כרטיסים הוזמנו מראש',
        },
        {
          id: generateId(),
          time: '11:30',
          title: 'פורום רומאי',
          category: 'attraction',
          estimatedCost: 20,
          isCompleted: true,
        },
        {
          id: generateId(),
          time: '13:30',
          title: 'ארוחת צהריים',
          category: 'restaurant',
          estimatedCost: 50,
          isCompleted: true,
          description: 'פיצה בסמטה שקטה',
        },
        {
          id: generateId(),
          time: '16:00',
          title: 'מדרגות ספרדיות',
          category: 'free',
          estimatedCost: 0,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '19:00',
          title: 'ארוחת ערב',
          category: 'restaurant',
          estimatedCost: 70,
          isCompleted: false,
        }
      ]
    },
    {
      id: day3Id,
      dayNumber: 3,
      date: '2026-10-17',
      title: 'רומא → פירנצה',
      destination: 'פירנצה',
      activities: [
        {
          id: generateId(),
          time: '09:30',
          title: 'רכבת לפירנצה',
          category: 'transport',
          estimatedCost: 45,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '11:30',
          title: 'צ\'ק-אין במלון פירנצה',
          category: 'accommodation',
          estimatedCost: 0,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '13:00',
          title: 'ארוחת צהריים מהירה',
          category: 'restaurant',
          estimatedCost: 35,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '15:00',
          title: 'גלריית אופיצי',
          category: 'attraction',
          estimatedCost: 30,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '17:30',
          title: 'פונטה וקיו',
          category: 'free',
          estimatedCost: 0,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '18:30',
          title: 'ג\'לטו',
          category: 'restaurant',
          estimatedCost: 10,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '20:00',
          title: 'ארוחת ערב בסטייקהאוס',
          category: 'restaurant',
          estimatedCost: 100,
          isCompleted: false,
        }
      ]
    },
    {
      id: day4Id,
      dayNumber: 4,
      date: '2026-10-18',
      title: 'פירנצה וטוסקנה',
      destination: 'פירנצה / טוסקנה',
      activities: [
        {
          id: generateId(),
          time: '08:30',
          title: 'כיפת הדואומו',
          category: 'attraction',
          estimatedCost: 25,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '10:30',
          title: 'שוק סן לורנצו',
          category: 'shopping',
          estimatedCost: 50,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '12:30',
          title: 'טיול יום בטוסקנה',
          category: 'attraction',
          estimatedCost: 80,
          isCompleted: false,
          description: 'כולל טעימות יין',
        },
        {
          id: generateId(),
          time: '19:30',
          title: 'ארוחת ערב',
          category: 'restaurant',
          estimatedCost: 65,
          isCompleted: false,
        }
      ]
    },
    {
      id: day5Id,
      dayNumber: 5,
      date: '2026-10-19',
      title: 'פירנצה → חזרה',
      destination: 'פירנצה',
      activities: [
        {
          id: generateId(),
          time: '09:00',
          title: 'קניות אחרונות',
          category: 'shopping',
          estimatedCost: 100,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '12:00',
          title: 'ארוחת צהריים',
          category: 'restaurant',
          estimatedCost: 40,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '14:00',
          title: 'צ\'ק-אאוט',
          category: 'accommodation',
          estimatedCost: 0,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '15:00',
          title: 'נסיעה לשדה תעופה',
          category: 'transport',
          estimatedCost: 25,
          isCompleted: false,
        },
        {
          id: generateId(),
          time: '18:00',
          title: 'טיסה הביתה',
          category: 'transport',
          estimatedCost: 0,
          isCompleted: false,
        }
      ]
    }
  ];

  const expenses: Expense[] = [
    // Pre-trip
    { id: generateId(), description: 'טיסות הלוך ושוב לרומא וחזרה מפירנצה', amount: 750, categoryId: 'flights', date: '2026-09-01', paymentMethod: 'credit' },
    { id: generateId(), description: 'מלון ברומא (2 לילות)', amount: 600, categoryId: 'accommodation', date: '2026-09-02', paymentMethod: 'credit', notes: '€300 ללילה' },
    { id: generateId(), description: 'מלון בפירנצה (2 לילות)', amount: 500, categoryId: 'accommodation', date: '2026-09-02', paymentMethod: 'credit', notes: '€250 ללילה' },
    { id: generateId(), description: 'כרטיסים לקולוסיאום', amount: 40, categoryId: 'attractions', date: '2026-09-15', paymentMethod: 'credit', dayId: day2Id },
    { id: generateId(), description: 'כרטיסי רכבת רומא-פירנצה', amount: 45, categoryId: 'transport', date: '2026-09-20', paymentMethod: 'credit', dayId: day3Id },
    { id: generateId(), description: 'כרטיסים לגלריית אופיצי', amount: 30, categoryId: 'attractions', date: '2026-09-21', paymentMethod: 'credit', dayId: day3Id },

    // Day 1
    { id: generateId(), description: 'מונית מהשדה למלון ברומא', amount: 50, categoryId: 'transport', date: '2026-10-15', paymentMethod: 'cash', dayId: day1Id },
    { id: generateId(), description: 'אספרסו ומאפה', amount: 6, categoryId: 'food', date: '2026-10-15', paymentMethod: 'cash', dayId: day1Id },
    { id: generateId(), description: 'ארוחת ערב בטרטוריה', amount: 75, categoryId: 'food', date: '2026-10-15', paymentMethod: 'credit', dayId: day1Id },

    // Day 2
    { id: generateId(), description: 'פיצה לצהריים', amount: 35, categoryId: 'food', date: '2026-10-16', paymentMethod: 'cash', dayId: day2Id },
    { id: generateId(), description: 'גלידה', amount: 8, categoryId: 'food', date: '2026-10-16', paymentMethod: 'cash', dayId: day2Id },
    { id: generateId(), description: 'ארוחת ערב', amount: 85, categoryId: 'food', date: '2026-10-16', paymentMethod: 'credit', dayId: day2Id },

    // Day 3
    { id: generateId(), description: 'מונית לתחנת רכבת', amount: 15, categoryId: 'transport', date: '2026-10-17', paymentMethod: 'cash', dayId: day3Id },
    { id: generateId(), description: 'ארוחת צהריים בפירנצה', amount: 45, categoryId: 'food', date: '2026-10-17', paymentMethod: 'credit', dayId: day3Id },
    { id: generateId(), description: 'סטייק פלורנטין', amount: 110, categoryId: 'food', date: '2026-10-17', paymentMethod: 'credit', dayId: day3Id },
    { id: generateId(), description: 'מזכרות ליד הפונטה וקיו', amount: 40, categoryId: 'shopping', date: '2026-10-17', paymentMethod: 'credit', dayId: day3Id },

    // Day 4
    { id: generateId(), description: 'כרטיסים לכיפת הדואומו', amount: 25, categoryId: 'attractions', date: '2026-10-18', paymentMethod: 'credit', dayId: day4Id },
    { id: generateId(), description: 'תיק עור בשוק סן לורנצו', amount: 85, categoryId: 'shopping', date: '2026-10-18', paymentMethod: 'cash', dayId: day4Id },
    { id: generateId(), description: 'סיור טוסקנה וטעימות יין', amount: 160, categoryId: 'attractions', date: '2026-10-18', paymentMethod: 'credit', dayId: day4Id },
    { id: generateId(), description: 'ארוחת ערב', amount: 70, categoryId: 'food', date: '2026-10-18', paymentMethod: 'credit', dayId: day4Id },

    // Day 5
    { id: generateId(), description: 'קניות אחרונות', amount: 120, categoryId: 'shopping', date: '2026-10-19', paymentMethod: 'credit', dayId: day5Id },
    { id: generateId(), description: 'ארוחת צהריים לפני טיסה', amount: 45, categoryId: 'food', date: '2026-10-19', paymentMethod: 'credit', dayId: day5Id },
    { id: generateId(), description: 'מונית לשדה התעופה', amount: 30, categoryId: 'transport', date: '2026-10-19', paymentMethod: 'cash', dayId: day5Id },
  ];

  const budgetCategories = DEFAULT_BUDGET_CATEGORIES.map(category => {
    let plannedAmount = 0;
    switch (category.id) {
      case 'accommodation': plannedAmount = 1500; break;
      case 'flights': plannedAmount = 800; break;
      case 'food': plannedAmount = 1000; break;
      case 'attractions': plannedAmount = 500; break;
      case 'shopping': plannedAmount = 400; break;
      case 'transport': plannedAmount = 300; break;
      case 'other': plannedAmount = 500; break;
    }
    return { ...category, planned: plannedAmount };
  });

  return {
    tripName: 'טיול לאיטליה - 5 ימים',
    currency: '€',
    totalBudget: 5000,
    budgetCategories,
    days,
    expenses,
  };
}
