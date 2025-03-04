import { getUser, db } from "../firebase.js";
import { importCSS } from "/lib.js";
import { createEditor } from "/cm/main.js";

export async function createHomePage() {
  //inject css rel
  // let style = document.createElement("link");
  // style.rel = "stylesheet";
  // style.href = "../editor.css";
  // document.head.appendChild(style);

  await importCSS(["/editor.css", "/icons/filled.css"]);
  createEditor();

  // import("/_/cm.js");

  console.log("home");
}
