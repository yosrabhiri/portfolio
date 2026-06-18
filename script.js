const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector(".contact-submit");
  const statusMessage = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!statusMessage || !submitButton) return;

    statusMessage.classList.remove("is-error");
    statusMessage.textContent = "Sending your message...";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      statusMessage.textContent = "Message sent. Thank you!";
    } catch (error) {
      statusMessage.classList.add("is-error");
      statusMessage.textContent = "Message not sent yet. Please confirm FormSubmit activation or email me directly.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
