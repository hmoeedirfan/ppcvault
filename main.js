// main.js
document.addEventListener("DOMContentLoaded", () => {
  try {
    // ---------- NAV + ACTIVE LINK HIGHLIGHT ----------
    const navContainer =
      document.getElementById("main-navbar") ||
      document.getElementById("navbar") ||
      document.querySelector("header");
    const navLinks = navContainer
      ? navContainer.querySelectorAll(".nav-link")
      : document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    if (sections.length && navLinks.length) {
      const rootMarginValue = `-${
        navContainer ? navContainer.offsetHeight : 80
      }px 0px -40% 0px`;
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("id");
            const active =
              document.querySelector(
                `#${
                  navContainer && navContainer.id
                    ? navContainer.id
                    : "main-navbar"
                } .nav-link[href="#${id}"]`
              ) || document.querySelector(`.nav-link[href="#${id}"]`);
            if (entry.isIntersecting && active) {
              navLinks.forEach((l) => l.classList.remove("active"));
              active.classList.add("active");
            }
          });
        },
        { threshold: 0.45, rootMargin: rootMarginValue }
      );

      sections.forEach((s) => navObserver.observe(s));
    } else {
      console.warn("Nav highlight: sections or nav links not found.", {
        sectionsLength: sections.length,
        navLinksLength: navLinks.length,
      });
    }

    // ---------- FADE-IN ON SCROLL ----------
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    document
      .querySelectorAll(".fade-in-up")
      .forEach((el) => revealObserver.observe(el));

    // ---------- TESTIMONIALS SLIDER (safe init) ----------
    const testimonials = [
      {
        title: "Fantastic Services",
        text: "Their creative strategies ... Highly recommend!",
        stars: 4,
        img: "https://i.pravatar.cc/50?img=12",
        name: "Sarah Mitchell",
        role: "CMO, Nova Apparel",
      },
      {
        title: "Incredible Growth",
        text: "Working with them transformed ...",
        stars: 5,
        img: "https://i.pravatar.cc/50?img=18",
        name: "John Carter",
        role: "CEO, TechHive",
      },
      {
        title: "Highly Professional",
        text: "The team is very responsive ...",
        stars: 5,
        img: "https://i.pravatar.cc/50?img=32",
        name: "Emily Chen",
        role: "Founder, EcoStyle",
      },
    ];

    const card = document.getElementById("testimonial-card");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (card && prevBtn && nextBtn) {
      let currentIndex = 0;
      card.classList.add("slide");

      function renderTestimonial(index, direction = "right") {
        const t = testimonials[index];
        // outgoing
        card.classList.remove("show");
        card.classList.add(direction === "right" ? "out-left" : "out-right");

        setTimeout(() => {
          card.innerHTML = `
            <h3 class="text-xl font-semibold mb-3">${t.title}</h3>
            <p class="text-white/80 mb-5">${t.text}</p>
            <div class="flex items-center text-amber-400 mb-6">
              ${[...Array(5)]
                .map((_, i) =>
                  i < t.stars
                    ? `<i class="fa-solid fa-star"></i>`
                    : `<i class="fa-regular fa-star text-white/40"></i>`
                )
                .join("")}
            </div>
            <div class="flex items-center gap-4 border-t border-white/10 pt-5">
              <img src="${
                t.img
              }" class="w-12 h-12 rounded-full border-2 border-amber-400" alt="">
              <div>
                <p class="font-semibold">${t.name}</p>
                <p class="text-sm text-white/60">${t.role}</p>
              </div>
            </div>
            <span class="absolute bottom-6 right-6 text-amber-400 text-4xl opacity-80">
              <i class="fa-solid fa-quote-right"></i>
            </span>
          `;
          // incoming
          card.classList.remove("out-left", "out-right");
          setTimeout(() => card.classList.add("show"), 50);
        }, 300);
      }

      function showNext() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        renderTestimonial(currentIndex, "right");
      }
      function showPrev() {
        currentIndex =
          (currentIndex - 1 + testimonials.length) % testimonials.length;
        renderTestimonial(currentIndex, "left");
      }

      // init
      renderTestimonial(currentIndex);
      nextBtn.addEventListener("click", showNext);
      prevBtn.addEventListener("click", showPrev);

      // autoplay
      let autoPlay = setInterval(showNext, 6000);
      card.addEventListener("mouseenter", () => clearInterval(autoPlay));
      card.addEventListener(
        "mouseleave",
        () => (autoPlay = setInterval(showNext, 6000))
      );
    } else {
      console.warn("Testimonials: missing elements", {
        cardExists: !!card,
        prevExists: !!prevBtn,
        nextExists: !!nextBtn,
      });
    }

    // ---------- COUNTERS (Metrics Section) ----------
    function animateCounter(
      el,
      target,
      duration = 2000,
      suffix = "",
      prefix = ""
    ) {
      let startTime = null;
      function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = prefix + value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll(".counter");
    if (counters.length) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const raw =
                el.getAttribute("data-target") ||
                el.textContent.trim().replace(/\D/g, "");
              const target = parseInt(raw, 10) || 0;
              // choose suffix/prefix based on markup or data-attributes (safe)
              const hasPercent =
                el.dataset.suffix === "%" || el.textContent.includes("%");
              const hasDollar =
                el.dataset.prefix === "$" || el.textContent.includes("$");
              if (hasPercent) animateCounter(el, target, 2000, "%");
              else if (hasDollar) animateCounter(el, target, 2000, "+", "$");
              else animateCounter(el, target, 2000, "+");
              counterObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => counterObserver.observe(c));
    } else {
      console.warn("Counters: no .counter elements found");
    }

    // ---------- SMOOTH SCROLLING ----------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = navContainer ? navContainer.offsetHeight : 80;
          const top =
            target.getBoundingClientRect().top + window.scrollY - offset - 10;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });

    // ---------- FLOATING NAVBAR (toggle on scroll) ----------
    const floatingNavbar = document.getElementById("floating-navbar");
    const bigNavbar = navContainer;
    const SHOW_AFTER = 100; // show floating navbar after 100px

    window.addEventListener("scroll", () => {
      try {
        if (!floatingNavbar || !bigNavbar) return;
        if (window.scrollY > SHOW_AFTER) {
          bigNavbar.classList.add("opacity-0", "pointer-events-none");
          floatingNavbar.classList.remove("hidden");
          floatingNavbar.classList.add("flex");
        } else {
          bigNavbar.classList.remove("opacity-0", "pointer-events-none");
          floatingNavbar.classList.add("hidden");
          floatingNavbar.classList.remove("flex");
        }
      } catch (err) {
        console.error("Scroll handler error:", err);
      }
    });
  } catch (e) {
    console.error("Initialization error in main.js:", e);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const heroImage = document.getElementById("hero-image");
  if (heroImage) {
    setTimeout(() => {
      heroImage.classList.remove("opacity-0", "translate-y-6");
    }, 300); // small delay for effect
  }
});