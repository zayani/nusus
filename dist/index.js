import { on } from "./lib.js";
import { login, googleSignIn, logout } from "./firebase.js";
import { createLandingPage } from "./pages/landing.js";
import { createHomePage } from "./pages/home.js";

on("authStateChange", (data) => {
  console.log("authStateChange", data.user);

  //remove splash screen
  document.body.removeAttribute("splash-screen");

  if (!data?.user) {
    createLandingPage(data.emailLink);
  } else {
    createHomePage();
  }
});

on("emaillinkError", () => {
  alert("رابط البريد الإلكتروني غير صحيح، الرجاء المحاولة مرة أخرى");
});
