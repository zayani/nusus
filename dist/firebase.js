import { fire } from "./lib.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  linkWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  writeBatch,
  deleteDoc,
  query,
  where,

  //
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
  deleteField,
  or,
  and,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCB1JbXseUVGjRBTQ9coRYGEykymxuQ0lw",
  authDomain: "nusus-9dbf5.firebaseapp.com",
  projectId: "nusus-9dbf5",
  storageBucket: "nusus-9dbf5.firebasestorage.app",
  messagingSenderId: "847402241091",
  appId: "1:847402241091:web:156537d797dddf06ac58f6",
  measurementId: "G-81ZR0RM88F",
};

export {
  arrayRemove,
  arrayUnion,
  increment,
  Timestamp,
  serverTimestamp,
  deleteField,
  or,
  and,
  writeBatch,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const emailLink = isSignInWithEmailLink(auth, window.location.href);
const provider = new GoogleAuthProvider();

export function logout() {
  signOut(auth);
}

export function getUser() {
  return auth.currentUser;
}

window.logout = logout;

//when the user click on the email link
if (emailLink) {
  let email = location.search.split("email=")[1].split("&")[0];
  signInWithEmailLink(auth, email, window.location.href).catch((error) => {
    console.log("error", error);
    if (auth.currentUser) return;
    fire("emaillinkError");
    window.history.pushState({}, document.title, window.location.pathname);
    fire("authStateChange", { user: auth.currentUser });
  });
}

export const login = async (email) => {
  return sendSignInLinkToEmail(auth, email, {
    url: window.location.href.split("?")[0] + "?email=" + email,
    handleCodeInApp: true,
  });
};

export const updateUser = async (displayName) => {
  await updateProfile(auth.currentUser, {
    displayName,
  });
};

//Sign in function.
export function googleSignIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      console.log("User signed in:", user);
      //Handle the signed in user, like displaying a welcome message.
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.error("Sign-in error:", errorCode, errorMessage);
    });
}

let emailLinkUnused = true;

let prevSignIn = false;

//when the user state change (login, logout)
onAuthStateChanged(auth, async (user) => {
  if (!user && prevSignIn) {
    window.location.reload();
  }

  if (user) prevSignIn = true;

  if (location.search.split("email=")[1] && user) {
    window.history.pushState({}, document.title, window.location.pathname);
  }

  fire("authStateChange", {
    user,
    emailLink: emailLinkUnused && emailLink,
  });

  emailLinkUnused = false;
});

const _db = getFirestore(app);

export const db = {
  increment, //increment a value (update only)
  arrayUnion, //add to an array (update only)
  arrayRemove, //remove from an array (update only)
  Timestamp, //timestamp
  serverTimestamp, //timestamp (server now)
  deleteField, //delete a field (update only)
  where,
  or,
  and,

  batch: () => writeBatch(_db), //create a batch

  ref(path) {
    //if path is not a string, it's a ref
    if (typeof path !== "string") return path;

    path = path.split("/");

    //if path is odd, it's a collection else it's a doc
    return path.length % 2 ? collection(_db, ...path) : doc(_db, ...path);
  },

  query(path, ...query) {
    return query(db.ref(path), ...query);
  },

  get(path) {
    let ref = db.ref(path);

    //if ref is a docuement
    if (ref.type == "document") return getDoc(ref);

    return getDocs(ref);
  },

  set(path, data, merge = true) {
    let ref = db.ref(path);
    if (ref.type == "collection") return addDoc(ref, data);
    return setDoc(ref, data, { merge });
  },

  update(path, data) {
    return updateDoc(db.ref(path), data);
  },

  delete(path) {
    return deleteDoc(db.ref(path));
  },
};
