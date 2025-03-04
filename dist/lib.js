const evPreFix = "lib_";

export function fire(evName, data) {
  document.dispatchEvent(new CustomEvent(evPreFix + evName, { detail: data }));
}

export function on(evName, cb) {
  document.addEventListener(evPreFix + evName, (e) => cb(e.detail));
}

export const uuid = () =>
  (Date.now().toString(36) + Math.random().toString(36)).replace("0.", "");

export async function functionresizeImage(file, maxDim = 2048) {
  const img = await createImageBitmap(file);

  if (img.width <= maxDim && img.height <= maxDim) return file;

  const resizeRatio = Math.min(maxDim / img.width, maxDim / img.height);

  const canvas = new OffscreenCanvas(
    Math.round(img.width * resizeRatio),
    Math.round(img.height * resizeRatio)
  );
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas
      .convertToBlob({ type: "image/jpeg" })
      .then((blob) => {
        const jpegFile = new File(
          [blob],
          `${file.name.split(".").slice(0, -1).join(".")}.jpeg`,
          { type: "image/jpeg", lastModified: Date.now() }
        );
        resolve(jpegFile);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//camelCase to kebab-case
export const toKebabCase = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

export function flattenObject(obj, sp = ".") {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const flatObject = lib.flattenObject(obj[key], sp);
      for (const nestedKey in flatObject) {
        result[key + sp + nestedKey] = flatObject[nestedKey];
      }
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

export const askUserInput = async (question, defaultValue = "") => {
  return prompt(question, defaultValue);
};

export const importCSS = (hrefs) =>
  Promise.all(
    hrefs.map(
      (href) =>
        new Promise((resolve, reject) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.onload = resolve;
          link.onerror = reject;
          document.head.appendChild(link);
        })
    )
  );
