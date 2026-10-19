# CLAUDE.md — אתר ישראר סטון מארבל

## מה זה
אתר סטטי (HTML/CSS/JS ללא בנייה) בעברית בלבד, RTL, לספק Israr Stone & Marble Ltd — עם פרטי הקשר של יורם ולא של הספק.
מקורות: israrstone.com (כל הדפים) + `israr stone & marble ltd CLADDING MARBLE (MODEL OF ISRAEL).pdf` (קטלוג חיפויים, 23 עמ').

## כתובות
- אתר חי: https://arnonyoram-lang.github.io/israr-stone/
- מאגר (ציבורי, כמו siteboss): https://github.com/arnonyoram-lang/israr-stone — GitHub Pages מענף `main`, תיקיית שורש.
- תיקייה: `C:\Users\arnon\Documents\Codex\Projects\אתר ישראר סטון` · גיבוי: `Dropbox\פרויקטים קלוד\12 אתר ישראר סטון` (+ `מקורות\` עם ה־PDF — לא ל־GitHub).

## העלאה לאתר
- `git push` ל־`main` = עלייה לאתר (Pages בונה לבד). אימות: `gh api repos/arnonyoram-lang/israr-stone/pages/builds/latest --jq .status` → `built`, ואז `curl` לכתובת (200).
- המאגר ציבורי: לא להכניס אליו מסמכי לקוחות, נתונים או קובצי מקור של הספק.
- כתובות מוחלטות לשיתוף (`og:image`, `canonical`, `sitemap.xml`, `robots.txt`). `_config.yml` מסתיר מהאתר את README/CLAUDE/DESIGN מכוונות לכתובת הנוכחית — לעדכן אם עוברים לדומיין משלנו.

## כללים
- **פרטי קשר רק של יורם**: מייל `arnon.yoram@gmail.com`; טלפון `050-8224522` (נוסף 18.10.2026, ב־`js/content.js`; רכיבים עם `data-needs` מוסתרים אם השדה ריק).
- לא להכניס לאתר טלפון / מייל / כתובת מדויקת / כתובת אתר של הספק. לא לצרף את ה־PDF המקורי (יש בו פרטי הספק).
- עברית בלבד בטקסטים. תמונות הגרניט מאתר הספק נחתכו כדי להסיר תוויות בערבית; כיסוי "שיש וגרניט ממצרים" נבחר בלי טקסט באנגלית.
- לא להשתמש בהמלצות הלקוחות מאתר הספק (טקסט תבנית, לא המלצות אמיתיות).
- עיצוב: `DESIGN.md` הוא מקור האמת; טוקנים ב־`:root` של `css/style.css`.
- לשנות `?v=N` בקישורי ה־CSS/JS ב־`index.html` אחרי כל שינוי (מניעת מטמון).

## מבנה
- `js/content.js` — `SITE_CONTACT`, `SITE_CATS`, `SITE_PRODUCTS` (22, כל אחד `dir` + `images`), `SITE_GRANITE` (11), `SITE_PROJECTS`.
- `js/main.js` — פרטי קשר, תפריט, מצגת פתיח, קטלוג + סינון, גלריה (מקלדת/החלקה, כיוון RTL), רשימת הצעת מחיר (localStorage `israr-quote`), טופס → mailto / wa.me.
- `images/<תיקייה>/NN.webp` (עד 1600px) + `NN-sm.webp` (עד 720px) לכרטיסים ותמונות ממוזערות.
- הרצה מקומית: `.claude/launch.json` → `python -m http.server 5180`.

## סטטוס / יומן גרסאות
- 1.0 (2026-10-18): בנייה ראשונה, נבדק במחשב (1440) ובנייד (375).
- 1.1 (2026-10-19): טלפון 050-8224522; יורם אישר שיש אישור מהספק לשימוש בשם ובתמונות; git + GitHub Pages; תמונת שיתוף `images/og.jpg`, `robots.txt`, `sitemap.xml`.
- פתוח (רשות): דומיין משלנו; Google Search Console; מעקב מבקרים; שורת "נציג מורשה" אם יורם ירצה.
