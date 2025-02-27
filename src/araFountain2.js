import {
  lineNumbers,
  Decoration,
  ViewPlugin,
  EditorView,
} from "@codemirror/view";
import {
  foldService,
  codeFolding,
  foldGutter,
  toggleFold,
} from "@codemirror/language";
import { StateField, StateEffect } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";

// Scene type class names for styling
const sceneTypes = {
  empty: "scene-empty",
  headings: "scene-headings",
  action: "scene-action",
  character: "scene-character",
  dialogue: "scene-dialogue",
  transition: "scene-transition",
};

// Helper functions for line classification
const isEmptyLine = (line) => line.text.trim() === "";

const isNextLineEmpty = (state, line) =>
  line.number >= state.doc.lines ||
  state.doc.lineAt(line.to + 1).text.trim() === "";

const isSceneHeader = (state, line) =>
  line.text.startsWith(".") && !line.text.startsWith("..");

const isCharacter = (line, prevType) => line.text.startsWith("@");

const isDialogue = (line, prevType) =>
  prevType === sceneTypes.character || prevType === sceneTypes.dialogue;

const isTransition = (line) => line.text.startsWith(":");

// Function to find all character spans with @ prefix
const findCharacterSpans = (text, lineFrom) => {
  const spans = [];
  // Match @{any alphanumeric in any language} with whitespace before and after
  // Using Unicode property escape \p{L} for letters, \p{N} for numbers across all languages
  const regex = /(^|\s)(@[\p{L}\p{N}]+)(?=\s|$)/gu;

  let match;
  while ((match = regex.exec(text)) !== null) {
    // The character name is in capture group 2
    const startPos = match.index + match[1].length;
    const endPos = startPos + match[2].length;

    let span = {
      label: match[2],
      from: lineFrom + startPos,
      to: lineFrom + endPos,
    };

    spans.push(span);
  }

  return spans;
};

class araFountainClass {
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
        decorations.push(Decoration.line({ class: className }).range(from));
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
      let prevType = sceneTypes.empty;
      let line;

      for (let pos = pos_start; pos <= to; pos = line.to + 1) {
        line = state.doc.lineAt(pos);

        // Apply appropriate formatting based on line type
        if (isEmptyLine(line)) {
          addDecoration(line, (prevType = sceneTypes.empty));
        } else if (isSceneHeader(state, line)) {
          addDecoration(line, (prevType = sceneTypes.headings));
          // Add special marker for the scene header
          addDecoration(
            { from: line.from, to: line.from + 1 },
            sceneTypes.headings + "-mark"
          );
        } else if (isCharacter(line, prevType)) {
          addDecoration(line, (prevType = sceneTypes.character));
          // Add special marker for the '@' character
        } else if (isDialogue(line, prevType)) {
          addDecoration(line, (prevType = sceneTypes.dialogue));
        } else if (isTransition(line)) {
          addDecoration(line, (prevType = sceneTypes.transition));

          // Add special marker for the ':' transition
          addDecoration(
            { from: line.from, to: line.from + 1 },
            sceneTypes.transition + "-mark"
          );
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
const araFountainCore = ViewPlugin.fromClass(araFountainClass, {
  decorations: (v) => v.decorations,
  charactersList: (v) => v.charactersList,
});

// Custom line numbering that only shows numbers for scene headers
const headersNumbers = lineNumbers({
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
      console.log(view.state, from);
      let line = view.state.doc.lineAt(from);

      console.log(view);

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

// Custom folding service for scenes
const sceneFoldService = (state, lineStart) => {
  const line = state.doc.lineAt(lineStart);

  // Check if this line is a scene header
  if (!isSceneHeader(state, line)) return null;

  // Find the end of this scene (the next scene header or end of document)
  let endLine = line.number;
  for (let i = line.number + 1; i <= state.doc.lines; i++) {
    const currentLine = state.doc.line(i);
    if (isSceneHeader(state, currentLine)) {
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
const araFolding = [
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

const gutter = [araFolding, headersNumbers];

// https://codemirror.net/docs/ref/#autocomplete.autocompletion
let charactersAutocomplete = autocompletion({
  override: [
    //https://codemirror.net/docs/ref/#autocomplete.CompletionSource
    (context) => {
      let word = context.matchBefore(/@[\p{L}\p{N}]*/u);

      if (!word) return null;
      if (word && word.from == word.to && !context.explicit) {
        return null;
      }

      let charactersList = context.view.plugin(araFountainCore).charactersList;

      console.log(context.view, araFountainCore);

      console.log(charactersList);

      // https://codemirror.net/docs/ref/#autocomplete.CompletionResult
      return {
        from: word?.from,
        //https://codemirror.net/docs/ref/#autocomplete.Completion
        options: [
          ...charactersList
            .filter(({ label }) => label != word.text)
            .map(({ label }) => ({
              label,
              type: "character",
            })),
        ],
      };
    },
  ],
});

// Export the full plugin combining formatting, line numbering, and folding
const araFountain = [araFountainCore, gutter, charactersAutocomplete];

export { araFountain };
