import { lineNumbers } from "@codemirror/view";
import { toggleFold } from "@codemirror/language";
import { scene, lineIs } from "./helpers";

// Custom line numbering that only shows numbers for scene headers
export const headersNumbers = lineNumbers({
  formatNumber: (line, state) => {
    if (line > state.doc.lines) return "";

    // Skip non-header lines
    if (!lineIs[scene.headings](state, state.doc.line(line))) return "";

    // Count headers that appear before this line
    let headerCount = 1;
    for (let i = 1; i < line; i++) {
      if (lineIs[scene.headings](state, state.doc.line(i))) headerCount++;
    }

    return `${headerCount}.`;
  },
  domEventHandlers: {
    click: (view, { from }) => {
      let line = view.state.doc.lineAt(from);

      //check if the line is a scene header
      if (!lineIs[scene.headings](view.state, line)) return;

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
