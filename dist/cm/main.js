import { EditorView } from "@codemirror/view"; //@codemirror/view@6.36.4
import { EditorState, StateEffect } from "@codemirror/state";
import { arabization } from "/cm/arabization.js";
import { araFountain } from "/cm/araFountain.js";
import { cmSetup } from "/cm/cmSetup.js";

const FontTheme = EditorView.theme({
  // $: {
  //   fontSize: "110px",
  //   fontFamily: "segoe ui",
  //   backgroundColor: "red",
  // }
});

let startState = EditorState.create({
  doc: `.خارجي. ضفاف بحيرة - وقت الشروق

غزال يشرب الماء من صفحة البحيرة الساكنة ومنظر شروق الشمس ينعكس عليها، بالجوار بين الحشائش والأشجار يظهر قوس وسهم مصوب على الغزال

@مزن
إلى متى الإنتظار؟

@كندة
الصبر يامزن
اسكت قليلاً

ترجع كندة تركز على الغزال @رشا @روان 

:قطع:

.خارجي. ضفاف بحيرة - وقت الشروق

@مزن
إلى متى الإنتظار؟`,
  extensions: [
    cmSetup, //our own custom basicSetup,
    arabization,
    araFountain,
    FontTheme,
  ],
});

//fix the gutter alignment issue
function fixGutterAlignment(view) {
  const currentSelection = view.state.selection;

  console.log(currentSelection);
  // Set cursor to the end to fix the gutter alignment issue
  view.dispatch({
    selection: {
      anchor: view.state.doc.length,
      head: view.state.doc.length,
    },
  });
  // Restore the original selection
  setTimeout(() => {
    view.dispatch({
      selection: currentSelection,
      scrollIntoView: true,
    });
    // Ensure focus is on the editor
    view.focus();
  }, 0);
}

export function createEditor() {
  let view = new EditorView({
    state: startState,
    parent: document.body,
  });

  console.log(performance.now() / 1000, "seconds");

  fixGutterAlignment(view);
}
