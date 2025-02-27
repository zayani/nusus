import { foldService, codeFolding, foldGutter } from "@codemirror/language";
import { scene, lineIs } from "./helpers";

// Custom folding service for scenes
const sceneFoldService = (state, lineStart) => {
  const line = state.doc.lineAt(lineStart);

  // Check if this line is a scene header
  if (!lineIs[scene.headings](state, line)) return null;

  // Find the end of this scene (the next scene header or end of document)
  let endLine = line.number;
  for (let i = line.number + 1; i <= state.doc.lines; i++) {
    const currentLine = state.doc.line(i);
    if (lineIs[scene.headings](state, currentLine)) {
      endLine = i - 1;
      break;
    }
    if (i === state.doc.lines) {
      endLine = i;
    }
  }

  // Return the foldable range
  return {
    from: line.to,
    to: state.doc.line(endLine).to, // End at the last line of the scene
  };
};

// Create the folding extension
export const araFolding = [
  // Register our custom scene folding service
  foldService.of(sceneFoldService),
  // Add folding capabilities with our custom config
  codeFolding({
    placeholderText: "... [مشهد مطوي] ...",
  }),
  // Add a fold gutter to allow folding via clicking in the gutter
  foldGutter({
    // Use a custom marker DOM function to ensure only one set of markers appears
    markerDOM: (open) => {
      const marker = document.createElement("span");
      marker.title = open ? "طي المشهد" : "فك طي المشهد";
      marker.textContent = open ? "keyboard_arrow_down" : "keyboard_arrow_left";
      marker.className = "material-icons fold-marker";
      return marker;
    },
  }),
];
