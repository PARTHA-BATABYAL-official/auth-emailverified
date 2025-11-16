(() => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "";
  const rawSuccess = params.get("success") || "";
  const isSuccess = ["1", "true", "yes"].includes(rawSuccess.toLowerCase());

  const welcomeEl = document.getElementById("welcomeName");
  const cardEl = document.querySelector(".card") || document.body;

  let iconContainer = document.getElementById("verifyIcon");
  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.id = "verifyIcon";
    cardEl.insertBefore(iconContainer, cardEl.firstChild);
  }

  // Safely set limited-length name
  if (name && welcomeEl) {
    const safe = String(name).slice(0, 20);
    welcomeEl.textContent = `Welcome, ${safe}.`;
  }

  const setText = (selector, text) => {
    const el = cardEl.querySelector(selector);
    if (el) el.textContent = text;
  };

  // Build an SVG using createElementNS (avoids innerHTML for markup)
  const createSVG = (pathD, extraClass = "") => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 52 52");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (extraClass) svg.setAttribute("class", extraClass);

    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", "26");
    circle.setAttribute("cy", "26");
    circle.setAttribute("r", "25");
    circle.setAttribute("fill", "none");
    circle.setAttribute("class", "checkmark-circle");

    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("class", "checkmark-check");

    svg.appendChild(circle);
    svg.appendChild(path);
    return svg;
  };

  // Update UI based on success flag
  iconContainer.innerHTML = "";
  if (isSuccess) {
    iconContainer.appendChild(createSVG("M14 27l7 7 17-17", "checkmark"));
    setText(".title", "Email Verified");
    setText(
      ".subtitle",
      "Your email has been successfully verified. You may now log in."
    );
  } else {
    iconContainer.appendChild(
      createSVG("M16 16l20 20M36 16L16 36", "checkmark error-icon")
    );
    setText(".title", "Verification Failed");
    setText(
      ".subtitle",
      "The verification link is invalid or expired. Please request a new one."
    );
  }

  // Try to close window; if blocked, navigate away as fallback
  setTimeout(() => {
    try {
      window.close();
    } catch (e) {
      /* ignore */
    }
    if (!window.closed) window.location.href = "/";
  }, 5000);
})();
