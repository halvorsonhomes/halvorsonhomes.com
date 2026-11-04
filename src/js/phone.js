// Assembles the phone number at runtime so it never appears whole in the page source
const parts = ["941", "697", "7665"];

for (const a of document.querySelectorAll(".js-phone")) {
  a.href = `tel:+1${parts.join("")}`;
  a.textContent = `(${parts[0]}) ${parts[1]}-${parts[2]}`;
}
