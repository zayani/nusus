// Scene type class names for styling
export const sceneTypes = {
  empty: "scene-empty",
  headings: "scene-headings",
  action: "scene-action",
  character: "scene-character",
  dialogue: "scene-dialogue",
  transition: "scene-transition",
};

// Helper functions for line classification
export const isEmptyLine = (line) => line.text.trim() === "";

export const isNextLineEmpty = (state, line) =>
  line.number >= state.doc.lines ||
  state.doc.lineAt(line.to + 1).text.trim() === "";

export const isSceneHeader = (state, line) =>
  line.text.startsWith(".") && !line.text.startsWith("..");

export const isCharacter = (line, prevType) => line.text.startsWith("@");

export const isDialogue = (line, prevType) =>
  prevType === sceneTypes.character || prevType === sceneTypes.dialogue;

export const isTransition = (line) => line.text.startsWith(":");

// Function to find all character spans with @ prefix
export const findCharacterSpans = (text, lineFrom) => {
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
