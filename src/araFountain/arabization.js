import { EditorState } from "@codemirror/state";

const arabization = EditorState.phrases.of({
  // @codemirror/view
  "Control character": "رمز التحكم",
  // @codemirror/commands
  "Selection deleted": "تم مسح النص المحدد",
  // @codemirror/language
  "Folded lines": "طي السطور",
  "Unfolded lines": "فك طي السطور",
  to: "إلى",
  "folded code": "ترميز مطوي",
  unfold: "فك الطي",
  "Fold line": "طي السطر",
  "Unfold line": "فك طي السطر",
  // @codemirror/search
  "Go to line": "الذهاب إلى السطر",
  go: "نفذ",
  Find: "بحث",
  Replace: "استبدال",
  next: "التالي",
  previous: "السابق",
  all: "الكل",
  "match case": "مطابقة حالة الحروف",
  "by word": "حسب الكلمة",
  replace: "استبدال",
  "replace all": "استبدال الكل",
  close: "إغلاق",
  "current match": "التطابق الحالي",
  "replaced $ matches": "استبدال تطابق $",
  "replaced match on line $": "استبدال التطابق على السطر $",
  "on line": "على السطر",
  // @codemirror/autocomplete
  Completions: "اكمالات",
  // @codemirror/lint
  Diagnostics: "تشخيص",
  "No diagnostics": "بدون تشخيص",
});

export { arabization };
