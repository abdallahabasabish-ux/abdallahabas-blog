/**
 * error-handler.js — عرض الرسائل والأخطاء
 */

export function showUserMessage(containerId, message, type = "error") {
  const el = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
  if (!el) return;
  el.textContent = message;
  el.className = "auth-message auth-message--" + type + " auth-message--visible";
  el.setAttribute("role", "alert");
}

export function clearUserMessage(containerId) {
  const el = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
  if (!el) return;
  el.textContent = "";
  el.className = "auth-message";
  el.removeAttribute("role");
}

export function showFieldError(errorId, message) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = message;
  el.classList.add("field-error--visible");
}

export function clearFieldError(errorId) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = "";
  el.classList.remove("field-error--visible");
}
