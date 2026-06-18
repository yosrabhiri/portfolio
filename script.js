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
const heroLead = document.querySelector(".hero-lead");
const heroLeadText = document.querySelector(".hero-lead-text");
const heroTags = document.querySelectorAll(".floating-tags .tag");
const contactForm = document.querySelector(".contact-form");

const revealHeroTags = () => {
  heroTags.forEach((tag) => {
    tag.classList.add("is-visible");
  });
};

if (heroLead && heroLeadText) {
  const text = heroLeadText.dataset.typeText || "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    heroLeadText.textContent = text;
    heroLead.classList.add("is-done");
    revealHeroTags();
  } else {
    window.setTimeout(() => {
      let index = 0;
      heroLead.classList.add("is-typing");

      const typeNextCharacter = () => {
        heroLeadText.textContent = text.slice(0, index);
        index += 1;

        if (index <= text.length) {
          window.setTimeout(typeNextCharacter, 28);
        } else {
          heroLead.classList.remove("is-typing");
          heroLead.classList.add("is-done");
          revealHeroTags();
        }
      };

      typeNextCharacter();
    }, 3700);
  }
} else {
  revealHeroTags();
}

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
