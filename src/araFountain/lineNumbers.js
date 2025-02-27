import { lineNumbers } from "@codemirror/view";
import { toggleFold } from "@codemirror/language";
import { isSceneHeader } from "./helpers";

// Custom line numbering that only shows numbers for scene headers
export const headersNumbers = lineNumbers({
  formatNumber: (line, state) => {
    // Skip non-header lines
    if (line > state.doc.lines) return "";

    if (!isSceneHeader(state, state.doc.line(line))) return "";

    // Count headers that appear before this line
    let headerCount = 1;
    for (let i = 1; i < line; i++) {
      if (isSceneHeader(state, state.doc.line(i))) headerCount++;
    }

    return `${headerCount}.`;
  },
  domEventHandlers: {
    click: (view, { from }) => {
      let line = view.state.doc.lineAt(from);

      //check if the line is a scene header
      if (!isSceneHeader(view.state, line)) return;

      view.dispatch({
        selection: {
          anchor: from,
          head: from,
        },
      });

      toggleFold(view);
    },
  },
});
