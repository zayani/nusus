import { showPanel, Panel } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { scene, lineIs } from "./helpers";

function counter(doc) {
  let words = 0,
    sceneCount = 0;

  var iter = doc.iter();
  while (!iter.next().done) {
    let inWord = false;
    for (let i = 0; i < iter.value.length; i++) {
      console.log(iter.value[i]);
      // count words
      let word = /[\p{L}\p{N}]/u.test(iter.value[i]);
      if (word && !inWord) words++;
      inWord = word;
    }
  }
  // count scenes looping
  for (let i = 1; i <= doc.lines; i++) {
    console.log(doc, i, doc.line(i));
    if (lineIs[scene.headings](doc, doc.line(i))) {
      sceneCount++;
    }
  }

  return `الكلمات: ${words} | المشاهد: ${sceneCount} | السطور: ${doc.lines}`;
}

function wordCountPanel(view) {
  let dom = document.createElement("div");
  dom.textContent = counter(view.state.doc);
  return {
    dom,
    update(update) {
      if (update.docChanged) dom.textContent = counter(update.state.doc);
    },
  };
}

const araStatusBar = showPanel.of(wordCountPanel);

export { araStatusBar };
