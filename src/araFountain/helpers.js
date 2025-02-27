// Scene type class names for styling
export const scene = {
  empty: "line-empty",
  headings: "scene-headings",
  character: "scene-character",
  dialogue: "scene-dialogue",
  transition: "scene-transition",
  center: "line-center",
  action: "scene-action", //must be last
};

export const needsSpecialMarker = [scene.headings, scene.transition];

// Helper functions for line classification
export const lineIs = {
  [scene.empty]: (state, line) => line.text.trim() === "",
  [scene.headings]: (state, line) =>
    line.text.startsWith(".") && !line.text.startsWith(".."),
  [scene.character]: (state, line) => line.text.startsWith("@"),
  [scene.dialogue]: (state, line, prevType) => {
    if (prevType)
      return prevType === scene.character || prevType === scene.dialogue;

    if (line.number < 1) return false;

    let prevLine = state.doc.lineAt(line.to - 1);

    return (
      lineIs[scene.character](state, prevLine) ||
      lineIs[scene.dialogue](state, prevLine)
    );
  },
  [scene.transition]: (state, line) => line.text.startsWith(":"),
  [scene.center]: (state, line) =>
    line.text.startsWith("--") && line.text.endsWith("--"),
  [scene.action]: (state, line) => true,
};

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
