import { lineNumbers } from "@codemirror/view";
import { toggleFold } from "@codemirror/language";
import { scene, lineIs } from "/cm/helpers.js";

// Custom line numbering that only shows numbers for scene headers
export const headersNumbers = (() => {
  let cachedDoc = null;
  let headerMap = new Map(); // Map of line numbers for headers

  return lineNumbers({
    formatNumber: (line, state) => {
      if (line > state.doc.lines) return "";

      // Rebuild the cache if the document has changed
      if (cachedDoc !== state.doc) {
        headerMap.clear();
        let headerCount = 1;

        // Build the header map once per document change
        for (let i = 1; i <= state.doc.lines; i++) {
          const lineObj = state.doc.line(i);
          if (lineIs[scene.headings](state, lineObj))
            headerMap.set(i, headerCount++);
        }

        cachedDoc = state.doc;
      }

      // Return the cached header number if this is a header line
      return headerMap.has(line) ? `${headerMap.get(line)}` : "";
    },

    domEventHandlers: {
      click: (view, { from }) => {
        let line = view.state.doc.lineAt(from);

        // Check if the line is a scene header
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
})();
