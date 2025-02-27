import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { arabization } from "./arabization.js";
import { araFountain } from "./araFountain/araFountain.js";
import { cmSetup } from "./cmSetup.js";

let startState = EditorState.create({
  doc: `
.خارجي. ضفاف بحيرة - وقت الشروق

غزال يشرب الماء من صفحة البحيرة الساكنة ومنظر شروق الشمس ينعكس عليها، بالجوار بين الحشائش والأشجار يظهر قوس وسهم مصوب على الغزال

@مزن
إلى متى الإنتظار؟

@كندة
الصبر يامزن
اسكت قليلاً

ترجع كندة تركز على الغزال @رشا @روان 

:قطع:

.داخلي. مكتب - نهار

@مزن
إلى متى الإنتظار؟`,
  extensions: [
    cmSetup, //our own custom basicSetup,
    //charactersAutocomplete,
    arabization,
    araFountain,
  ],
});

let view = new EditorView({
  state: startState,
  parent: document.body,
});

console.log(view, startState);
