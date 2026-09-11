/**
 * ui.js — أدوات الواجهة
 */

export function setButtonLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("is-loading", loading);
  const text = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");
  if (text) text.style.opacity = loading ? "0" : "1";
  if (loader) loader.style.display = loading ? "inline-block" : "none";
}

export function initPasswordToggle(toggleBtn, input) {
  if (!toggleBtn || !input) return;
  const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  toggleBtn.innerHTML = eyeOpen;
  toggleBtn.addEventListener("click", () => {
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    toggleBtn.innerHTML = isPass ? eyeClosed : eyeOpen;
    toggleBtn.setAttribute("aria-label", isPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
  });
}

export function setInputError(input, hasError) {
  if (!input) return;
  input.classList.toggle("form-input--error", hasError);
  input.setAttribute("aria-invalid", hasError ? "true" : "false");
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
