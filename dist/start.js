console.log("Hello");
import lib from "./lib.js";
import { login, googleSignIn, logout } from "./firebase.js";

function createLandingPage(fromEmailLink) {
  let signupHtml = ` <div id="signup">
            <h2>قم بإدخال بريدك الإلكتروني<br>للتسجيل أو إعادة االدخول</h2>
            <input id="email" type="email" placeholder="البريد الإلكتروني"
            required>
           <div>
            <button id="signup-button">التالي</button>
            <button id="google-signin-button">تسجيل الدخول بالجوجل</button>
            </div>`;

  let fromEmailHtml = `<h2>يتم التحقق من البريد الإلكتروني</h2>`;

  let content = document.body;

  content.innerHTML = `
        <div id="landing-page">
           ${fromEmailLink ? fromEmailHtml : signupHtml}  
            </div>
        </div>
    `;

  if (fromEmailLink) return;

  //on signup button click
  document
    .getElementById("signup-button")
    .addEventListener("click", async () => {
      let email = document.getElementById("email").value;
      //check if email is valid using native browser validation
      if (!document.getElementById("email").checkValidity()) {
        alert("الرجاء إدخال بريد إلكتروني صحيح");
        return;
      }

      //send email link
      await login(email);

      //get #signup
      let signup = document.getElementById("signup");

      signup.innerHTML = `<h2>تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني</h2>`;
    });

  //on google signin button click
  document
    .getElementById("google-signin-button")
    .addEventListener("click", googleSignIn);
}

lib.on("authStateChange", (data) => {
  console.log("authStateChange", data.user);

  //remove splash screen
  document.body.removeAttribute("splash-screen");

  if (!data?.user) {
    createLandingPage(data.emailLink);
  } else {
    console.log("createHomePage2", logout);

    //createHomePage();
  }
});

lib.on("emaillinkError", () => {
  alert("رابط البريد الإلكتروني غير صحيح، الرجاء المحاولة مرة أخرى");
});
