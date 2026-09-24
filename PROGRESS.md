# התקדמות – מתכנן הטיול

אפליקציית React+TS+Vite+Tailwind בעברית לתכנון ימי טיול ותקציב. הנתונים נשמרים ב-localStorage.
הקוד נכתב ב-Antigravity ולא עבר בנייה (153 שגיאות TypeScript). מתקנים בשלבים.

**שיטת עבודה:** שלב אחד בכל פעם, עוצרים בסוף כל שלב ומעדכנים את הקובץ הזה.
משתמשים ב-ponytail (דיף מינימלי), systematic-debugging ו-verification-before-completion.

**בדיקה:** `npx tsc -b 2>&1 | grep -c "error TS"`

## שורש הבעיה
הרכיבים נכתבו מול API ישן של ה-context (`state`, `dispatch` ושמות actions שלא קיימים, כמו `UPDATE_TRIP_NAME` ו-`RESET_DATA`).
ה-context האמיתי חושף שדות ופונקציות שטוחים (`days`, `expenses`, `currency`, `addDay`, `setTripName`, `resetAll`, `importData`...).
**החלטה:** מעדכנים את הרכיבים ל-API השטוח. לא מחזירים `dispatch`, כי אז פעולות עם שמות שגויים ייכשלו בשקט.

## שלב 1 – שכבת בסיס ✅ (153 → 79 שגיאות)
- `types`: `completed` שונה ל-`isCompleted`, כמו בכל שאר הקוד.
- `PlannerContext`: imports תוקנו, `defaultCategories` שונה ל-`DEFAULT_BUDGET_CATEGORIES`, ו-`PlannerState` הכפול הוסר (משתמשים בזה שב-types).
- `sampleData`: בהוצאות `title` שונה ל-`description`, ובפעילויות `notes` שונה ל-`description`. נוסף `dayNumber`. **באג:** `plannedAmount` שונה ל-`planned` (התקציב לקטגוריה היה נשאר 0).
- `exportUtils`: **באג:** ב-CSV היו `'\\n'` ו-`'\\uFEFF'` מוכפלים (הקובץ יצא בשורה אחת). הוסר פרמטר שלא בשימוש, והחתימה עכשיו `exportExpensesToCSV(expenses, currency)`.

## שלב 2 – modals, common, Navbar ✅ (79 → 55 שגיאות, כל הנותרות ב-tabs)
- Navbar: `dispatch`/`state` הוחלפו ב-`setTripName`, `setCurrency`, `importData`, `resetAll`. ערכי המטבעות עכשיו `'₪'/'$'/'€'/'£'`. `exportExpensesToCSV(expenses, currency)`.
- **באג:** `exportToJSON` קיבל את כל אובייקט ה-context (כולל `totalSpent` וכו'). עכשיו מקבל רק את שדות ה-`PlannerState`.
- **ייבוא:** Navbar משתמש עכשיו ב-`importFromJSON` הקיים ב-`exportUtils`, שכולל בדיקת מבנה (הקוד הכפול שהיה ב-Navbar הוסר בשלב 3). קובץ לא תקין מציג הודעת שגיאה במקום לשבור את האפליקציה. גם ה-input במובייל מתאפס עכשיו.
- Modals: לא נשלח יותר `id` (וגם לא `activities` ב-EditDayModal). **באג:** בפעילות חדשה ב-AddActivityModal היה חסר `isCompleted: false`, ועכשיו הוא נוסף.
- `import type` תוקן, ו-imports שלא בשימוש הוסרו (`Settings`, `generateId`, `React` ב-ProgressBar).

## שלב 3 – tabs ✅ (55 → 0 שגיאות, `npm run build` עובר)
- DaysTab, ExpensesTab ו-AnalyticsTab עברו ל-API השטוח של `usePlanner()`. ב-BudgetPlanTab היה חסר רק `import type`.
- **באג:** DaysTab שלח `'TOGGLE_ACTIVITY_STATUS'`, שלא קיים, ולכן סימון "בוצע" בפעילות לא עבד. עכשיו הוא קורא ל-`toggleActivity`.
- **באג:** ב-ExpensesTab אמצעי התשלום היו `'credit_card'/'bank_transfer'` במקום `'credit'/'transfer'`, והאייקון היה תמיד ארנק. בנוסף, בשלוש מפות הצבעים הופיע `transportation` במקום `transport`.
- **באג:** AnalyticsTab קרא ל-`budget.totalAmount` ול-`budget.categories`, שלא קיימים. עכשיו הוא משתמש ב-`totalBudget`, `totalSpent`, `budgetCategories` ו-`getCategorySpent`, וה-`ProgressBar` מקבל `current/total`.

## שלב 4 – אימות ✅
`npm run build` עובר (0 שגיאות). `npm run lint` מחזיר 8 אזהרות ואף שגיאה (ראו "לעתיד").
בדיקה בדפדפן (`.claude/launch.json` → `dev`, פורט 5173), ללא שגיאות בקונסול:
- ימים: סימון "בוצע", הוספת פעילות והוספת יום. הכל נשמר ב-localStorage.
- הוצאות: הוספת הוצאה משויכת ליום. אייקון אמצעי התשלום וצבעי "תחבורה מקומית" תקינים.
- תקציב וניתוח: הסכומים תואמים. לשונית הניתוח לא קורסת כשאין נתונים.
- Navbar: החלפת מטבע, ייצוא CSV ו-JSON, ייבוא (קובץ תקין וקובץ לא תקין), איפוס, טעינת דוגמה ותפריט מובייל.

תוקן בשלב הזה:
- **באג:** ב-CSV הסכום נכתב כמו `750₪`, ו-Excel התייחס אליו כטקסט. עכשיו התא מכיל מספר בלבד, והמטבע מופיע בכותרת `סכום (₪)`.
- **באג:** ב-StatCard במובייל המספרים נחתכו (למשל `000` במקום `5,000 €`). ריפוד ואייקון הוקטנו במובייל, וה-border הדינמי השבור (`border-r-${...}`, שיצר קו שחור) נמחק.
- README אמיתי בעברית. `git init` בוצע, והזהות מוגדרת מקומית ל-itoosh-45 עם כתובת noreply.
- GitHub (ציבורי): https://github.com/itoosh-45/trip-planner, ענף `main`.

## שלב 5 – עיצוב מחדש ✅ "יומן סקיצות בצבעי מים"
הבקשה: עיצוב מינימליסטי, שקט ובהיר, עם פונטים רגועים. בוצע עם הסקיל impeccable, בבנייה ישירה בקוד (אין כאן כלי ליצירת תמונות).
- **תוצרים:** `PRODUCT.md` (עובדות המוצר) ו-`DESIGN.md` + `.impeccable/design.json` (מערכת העיצוב). חוזה הכיוון נמצא כהערת HTML בראש `<body>` ב-`index.html`.
- **פונטים:** Noto Sans Hebrew בלבד (`--font-app`, לבקשת המשתמש), כולל כותרות במשקל 500. כתבי היד (Playpen Sans Hebrew ואחר כך Gveret Levin) הוסרו לבקשת המשתמש.
- **צבע:** כל פלטות Tailwind "נצבעו מחדש" ב-`src/index.css` (אפור = עיפרון, ולכל קטגוריה פיגמנט). כתמי צבע נוצרים ממסנן SVG משותף `#wash` ב-`App.tsx`.
- **מבנה:** ארבעת כרטיסי הסיכום הוחלפו בשורת תקציב אחת. בטלפון יש סרגל לשוניות תחתון וכפתור "הוצאה" צף. המודאלים הם גיליון תחתון עם כפתורים דביקים. ההוצאות מוצגות כרשימה אחת, התקציב כרצועת צבעים ושורות קטגוריה, והניתוח כתובנות ובהן גרפים שכבתיים.
- **תיקונים בדרך:** מחיקת פעילות הייתה בלתי נראית בטלפון (הופיעה רק ב-hover). שדות הטפסים לא היו מקושרים לתוויות. אייקון $ הופיע גם כשהמטבע אחר. הצבעים של האטרקציות ושל הקניות היו הפוכים בין הלשוניות. ספי הסטטוס אוחדו (85% "קרוב לגבול", מעל 100% "חריגה"). נמחקו StatCard, App.css וקבצי התבנית.
- **סקירה:** בסבב הראשון הסוקר החזיר "fix" עם 8 תיקונים. בסבב האימות 3 נפתרו ו-5 חלקית. אחרי זה תוקנו גם הכפתור הצף, הגרעיניות, גרעין הנייר ורוחב הגרף.
- **בדיקה:** `npm run build`. לצילום כל הלשוניות בדסקטופ ובטלפון יש סקריפט ב-scratchpad של ה-session (Chrome headless דרך CDP). הצילומים נשמרים ב-`.impeccable/review/`, שנמצא ב-gitignore.

## לעתיד (לא חוסם)
- עיצוב: קווים בסגנון עיפרון לכותרות סעיפים (הסוקר ביקש, ולא בוצע). הכפתור הצף מסתיר לפעמים את כפתורי עריכה ומחיקה של יום. בטאבלט (מ-640px) פעולות השורה מופיעות רק ב-hover. מחיקת יום או פעילות משתמשת ב-`window.confirm`, ומחיקת הוצאה באישור בתוך השורה. תאריך בשדה date מוצג לפי שפת הדפדפן.
- אזהרות lint: `setState` בתוך `useEffect` (במודאלים, DaysTab ו-Navbar), ו-`cumulativeOffset` ב-BudgetPlanTab. הקוד עובד, והתיקון הוא ריפקטור.
- ספי הצבעים של "ניצול תקציב" לא אחידים: ב-App הם 60/85 וב-AnalyticsTab 70/90, ולכן 60% מוצג פעם כ"מתקרבים לגבול" ופעם כ"במסלול".
