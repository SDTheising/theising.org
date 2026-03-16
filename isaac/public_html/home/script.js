const bladeLengthRanges = [
    { label: "1 – 5 inches", value: "1-5" },
    { label: "6 – 10 inches", value: "6-10" },
    { label: "11 – 16 inches", value: "11-16" },
    { label: "17 – 22 inches", value: "17-22" },
    { label: "23 – 28 inches", value: "23-28" },
    { label: "29 – 34 inches", value: "29-34" },
    { label: "35 – 40 inches", value: "35-40" },
    { label: "41 – 46 inches", value: "41-46" },
    { label: "47 – 52 inches", value: "47-52" },
    { label: "53 – 58 inches", value: "53-58" },
    { label: "59 – 60 inches", value: "59-60" }
];

function applyBackgroundImage() {
    const config = window.siteBackground || {};
    if (config.imageUrl) {
        document.body.style.setProperty("--dynamic-background-image", `url('${config.imageUrl}')`);
        document.body.classList.add("has-background-image");
    }
    if (config.overlayColor) {
        document.body.style.setProperty("--background-overlay-color", config.overlayColor);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    applyBackgroundImage();
    const select = document.getElementById("blade-length");
    const form = document.getElementById("contact-form");
    const messageField = document.getElementById("project-notes");
    const statusField = document.getElementById("form-status");
    const yearField = document.getElementById("current-year");

    if (yearField) {
        yearField.textContent = new Date().getFullYear();
    }

    if (select) {
        bladeLengthRanges.forEach((range) => {
            const option = document.createElement("option");
            option.value = range.value;
            option.textContent = range.label;
            select.appendChild(option);
        });
    }

    function showStatus(message, isError = false) {
        if (!statusField) return;
        statusField.textContent = message;
        statusField.style.color = isError ? "#ffb4b4" : "var(--muted)";
    }

    function hasValidMessage(value) {
        return value.trim().length > 50;
    }

    if (form) {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity() || !hasValidMessage(messageField.value)) {
                event.preventDefault();
                form.classList.add("was-validated");
                showStatus("Please complete all required fields and include at least 50 characters.", true);
                messageField.focus();
                return;
            }

            event.preventDefault();
            showStatus("Sending details…");
            const formData = new FormData(form);

            fetch(form.action, {
                method: "POST",
                body: formData
            })
                .then(async (response) => {
                    const payload = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(payload.message || "There was a problem sending your request.");
                    }
                    form.reset();
                    showStatus(payload.message || "Thanks! I will respond shortly.");
                })
                .catch((error) => {
                    console.error(error);
                    showStatus(error.message || "Unable to send message right now.", true);
                });
        });
    }
});
