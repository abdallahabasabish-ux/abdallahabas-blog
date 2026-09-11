/**
 * auth.js — دوال المصادقة والتحقق
 */
import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

/* ============ Validation ============ */

export function validateEmail(email) {
  if (!email) return { valid: false, message: "البريد الإلكتروني مطلوب." };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return { valid: false, message: "صيغة البريد الإلكتروني غير صحيحة." };
  return { valid: true };
}

export function validatePassword(password) {
  if (!password) return { valid: false, message: "كلمة المرور مطلوبة." };
  if (password.length < 8) return { valid: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." };
  return { valid: true };
}

/* ============ Error mapping ============ */

function mapFirebaseError(code) {
  const map = {
    "auth/invalid-email": "البريد الإلكتروني غير صحيح.",
    "auth/user-disabled": "هذا الحساب معطّل.",
    "auth/user-not-found": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth/wrong-password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "auth/too-many-requests": "محاولات كثيرة. حاول لاحقًا.",
    "auth/network-request-failed": "تحقق من اتصالك بالإنترنت.",
    "auth/popup-closed-by-user": "أُغلقت نافذة تسجيل الدخول.",
    "auth/popup-blocked": "المتصفح منع النافذة المنبثقة. اسمح بها وحاول مرة أخرى.",
    "auth/account-exists-with-different-credential": "هذا البريد مسجّل بمزود آخر.",
    "auth/email-already-in-use": "البريد مستخدم مسبقًا.",
    "auth/weak-password": "كلمة المرور ضعيفة جدًا.",
    "auth/operation-not-allowed": "هذه الطريقة غير مفعّلة في Firebase Console.",
    "auth/unauthorized-domain": "هذا الدومين غير مصرح به في Firebase.",
  };
  return map[code] || "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

/* ============ Login ============ */

export async function login(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdTokenResult();
    return { ok: true, user: cred.user, claims: token.claims };
  } catch (err) {
    console.error("[auth] login error:", err);
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}

export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    return { ok: true, user: cred.user };
  } catch (err) {
    console.error("[auth] google error:", err);
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}

export async function loginWithGithub() {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    const cred = await signInWithPopup(auth, provider);
    return { ok: true, user: cred.user };
  } catch (err) {
    console.error("[auth] github error:", err);
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}

/* ============ Register / Reset / Logout ============ */

export async function register(email, password, displayName) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return { ok: true, user: cred.user };
  } catch (err) {
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (err) {
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return { ok: true };
  } catch (err) {
    return { ok: false, code: err.code, userMessage: mapFirebaseError(err.code) };
  }
}
