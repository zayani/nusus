import { autocompletion } from "@codemirror/autocomplete";
import { araFountainCore } from "/cm/decorations.js";

// https://codemirror.net/docs/ref/#autocomplete.autocompletion
export const charactersAutocomplete = autocompletion({
  override: [
    //https://codemirror.net/docs/ref/#autocomplete.CompletionSource
    (context) => {
      let word = context.matchBefore(/@[\p{L}\p{N}]*/u);

      if (!word) return null;
      if (word && word.from == word.to && !context.explicit) {
        return null;
      }

      let charactersList = context.view.plugin(araFountainCore).charactersList;

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
