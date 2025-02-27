import { Decoration, ViewPlugin } from "@codemirror/view";
import {
  scene,
  findCharacterSpans,
  lineIs,
  needsSpecialMarker,
} from "./helpers";

export class araFountainClass {
  constructor(view) {
    this.charactersList = [];
    this.decorations = this.buildDecorations(view);
  }

  removeCharactersInRange(start, end) {
    this.charactersList = this.charactersList.filter(({ from, to }) => {
      return from < start || to > end;
    });
  }

  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  buildDecorations({ state, visibleRanges }) {
    let decorations = [];

    const addDecoration = ({ from, to, number }, className) => {
      if (number) {
        decorations.push(
          Decoration.line({
            class: className,
            // ...(className == scene.empty
            //   ? {}
            //   : { attributes: { dir: "auto" } }),
          }).range(from)
        );
      } else {
        decorations.push(Decoration.mark({ class: className }).range(from, to));
      }
    };

    for (const { from, to } of visibleRanges) {
      // Find starting position by locating previous empty line or document start
      let pos_start = 0;
      if (from > 0) {
        for (let pos = from; pos > 0; ) {
          const line = state.doc.lineAt(pos);
          if (line.text.trim() === "") {
            pos_start = line.to + 1;
            break;
          }
          pos = line.from - 1;
        }
      }

      this.removeCharactersInRange(pos_start, to);

      // Process each visible line
      let prevType = scene.empty;
      let line;

      for (let pos = pos_start; pos <= to; pos = line.to + 1) {
        line = state.doc.lineAt(pos);

        let sceneTypes = Object.values(scene);

        for (let type of sceneTypes) {
          console.log(type);
          if (!lineIs[type](state, line, prevType)) continue;

          addDecoration(line, (prevType = type));
          if (needsSpecialMarker.includes(type)) {
            addDecoration(
              { from: line.from, to: line.from + 1 },
              type + "-mark"
            );
          }

          break;
        }

        // Find and decorate all character spans in the line
        const characterSpans = findCharacterSpans(line.text, line.from);
        for (const span of characterSpans) {
          let { from, to } = span;
          let span1 = { from, to: from + 1 };
          let span2 = { from: from + 1, to };
          addDecoration(span1, "scene-character-span-mark");
          addDecoration(span2, "scene-character-span");
          this.charactersList.push(span);
        }
      }
    }

    return Decoration.set(decorations, true);
  }
}

// Main plugin for AraFountain screenplay formatting
export const araFountainCore = ViewPlugin.fromClass(araFountainClass, {
  decorations: (v) => v.decorations,
  charactersList: (v) => v.charactersList,
});
