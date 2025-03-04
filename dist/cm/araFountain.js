import { araFountainCore } from "/cm/decorations.js";
import { headersNumbers } from "/cm/lineNumbers.js";
import { araFolding } from "/cm/folding.js";
import { charactersAutocomplete } from "/cm/autocomplete.js";
import { araStatusBar } from "/cm/statusBar.js";

const gutter = [araFolding, headersNumbers];

// Export the full plugin combining formatting, line numbering, and folding
const araFountain = [
  araFountainCore,
  gutter,
  charactersAutocomplete,
  araStatusBar,
];

export { araFountain };
