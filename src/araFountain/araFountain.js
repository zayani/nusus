import { araFountainCore } from "./decorations";
import { headersNumbers } from "./lineNumbers";
import { araFolding } from "./folding";
import { charactersAutocomplete } from "./autocomplete";

const gutter = [araFolding, headersNumbers];

// Export the full plugin combining formatting, line numbering, and folding
const araFountain = [araFountainCore, gutter, charactersAutocomplete];

export { araFountain };
