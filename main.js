document.addEventListener("DOMContentLoaded", () => {
    // Active nav link
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("#navbar .nav-link");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const id = entry.target.getAttribute("id");
            const active = document.querySelector(`#navbar .nav-link[href="#${id}"]`);
            if (entry.isIntersecting && active) {
                navLinks.forEach(l => l.classList.remove("active"));
                active.classList.add("active");
            }
        });
    }, { threshold: 0.4 });
    sections.forEach((s) => observer.observe(s));

    // Fade-in on scroll
    const reveal = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.fade-in-up').forEach(el => reveal.observe(el));
});

// Testimonial Animations
const testimonials = [
    {
        title: "Fantastic Services",
        text: "Their creative strategies and hands-on approach helped us reach new audiences and significantly grow our business. The team is professional, innovative, and truly dedicated to results. Highly recommend!",
        stars: 4,
        img: "https://i.pravatar.cc/50?img=12",
        name: "Sarah Mitchell",
        role: "CMO, Nova Apparel"
    },
    {
        title: "Incredible Growth",
        text: "Working with them transformed our Amazon PPC strategy. Within 3 months, our sales doubled while keeping ACoS stable. Couldn’t be happier with the results!",
        stars: 5,
        img: "https://i.pravatar.cc/50?img=18",
        name: "John Carter",
        role: "CEO, TechHive"
    },
    {
        title: "Highly Professional",
        text: "The team is very responsive and detail-oriented. They helped us cut wasted ad spend and scale efficiently. Communication is always smooth and proactive.",
        stars: 5,
        img: "https://i.pravatar.cc/50?img=32",
        name: "Emily Chen",
        role: "Founder, EcoStyle"
    }
];

let currentIndex = 0;
const card = document.getElementById("testimonial-card");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function renderTestimonial(index, direction = "right") {
    const t = testimonials[index];

    // Add outgoing animation
    card.classList.remove("show");
    card.classList.add(direction === "right" ? "out-left" : "out-right");

    setTimeout(() => {
        card.innerHTML = `
        <h3 class="text-xl font-semibold mb-3">${t.title}</h3>
        <p class="text-white/80 mb-5">${t.text}</p>
        <div class="flex items-center text-amber-400 mb-6">
          ${[...Array(5)].map((_, i) =>
            i < t.stars
                ? `<i class="fa-solid fa-star"></i>`
                : `<i class="fa-regular fa-star text-white/40"></i>`
        ).join("")}
        </div>
        <div class="flex items-center gap-4 border-t border-white/10 pt-5">
          <img src="${t.img}" class="w-12 h-12 rounded-full border-2 border-amber-400" alt="">
          <div>
            <p class="font-semibold">${t.name}</p>
            <p class="text-sm text-white/60">${t.role}</p>
          </div>
        </div>
        <span class="absolute bottom-6 right-6 text-amber-400 text-4xl opacity-80">
          <i class="fa-solid fa-quote-right"></i>
        </span>
      `;

        // Reset + slide in
        card.classList.remove("out-left", "out-right");
        setTimeout(() => card.classList.add("show"), 50);
    }, 300);
}

// Init
card.classList.add("slide");
renderTestimonial(currentIndex);

// Navigation
function showNext() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex, "right");
}

function showPrev() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentIndex, "left");
}

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// Auto-play every 6s
let autoPlay = setInterval(showNext, 6000);

// Pause autoplay on hover
card.addEventListener("mouseenter", () => clearInterval(autoPlay));
card.addEventListener("mouseleave", () => autoPlay = setInterval(showNext, 6000));

// Function to animate counters
function animateCounter(el, target, duration = 2000, suffix = "", prefix = "") {
    let start = 0;
    let startTime = null;

    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * target);

        el.textContent = prefix + value.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Observe counters when in view
const counters = document.querySelectorAll(".counter");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"));

            // Handle suffix/prefix formatting
            if (el.textContent.includes("%")) {
                animateCounter(el, target, 2000, "%");
            } else if (el.textContent.includes("$")) {
                animateCounter(el, target, 2000, "M+", "$");
            } else {
                animateCounter(el, target, 2000, "+");
            }

            observer.unobserve(el); // Run once
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));


// Perfectly NavBar navigation    
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // adjust 80px if navbar height changes
                behavior: "smooth"
            });
        }
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const navbar = document.querySelector("header");
//     const navLinks = document.querySelectorAll("#navbar .nav-link");
//     const sections = document.querySelectorAll("section[id]");
//     const menuToggle = document.getElementById("menu-toggle");
//     const navbarMenu = document.getElementById("navbar");

//     // Mobile menu toggle
//     menuToggle.addEventListener("click", () => {
//         navbarMenu.classList.toggle("hidden");
//     });

//     // Smooth scroll with navbar offset + close menu on mobile
//     navLinks.forEach(link => {
//         link.addEventListener("click", function (e) {
//             e.preventDefault();
//             const targetId = this.getAttribute("href");
//             const target = document.querySelector(targetId);

//             if (target) {
//                 const navbarHeight = navbar.offsetHeight;
//                 const offsetTop = target.offsetTop - navbarHeight - 10;

//                 window.scrollTo({
//                     top: offsetTop,
//                     behavior: "smooth"
//                 });

//                 // Close mobile menu after click
//                 if (window.innerWidth < 768) {
//                     navbarMenu.classList.add("hidden");
//                 }
//             }
//         });
//     });

//     // IntersectionObserver for active link highlighting
//     const observer = new IntersectionObserver(
//         (entries) => {
//             entries.forEach((entry) => {
//                 const id = entry.target.getAttribute("id");
//                 const activeLink = document.querySelector(`#navbar .nav-link[href="#${id}"]`);
//                 if (entry.isIntersecting) {
//                     navLinks.forEach(link => link.classList.remove("active"));
//                     if (activeLink) activeLink.classList.add("active");
//                 }
//             });
//         },
//         {
//             threshold: 0.5,
//             rootMargin: `-${navbar.offsetHeight}px 0px -40% 0px`
//         }
//     );

//     sections.forEach((section) => observer.observe(section));
// });

const mainNavbar = document.getElementById("main-navbar");
const floatingNavbar = document.getElementById("floating-navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.7) {
        // Hide big navbar, show floating one
        mainNavbar.classList.add("opacity-0", "pointer-events-none");
        floatingNavbar.classList.remove("hidden");
        floatingNavbar.classList.add("flex");
    } else {
        // Show big navbar again
        mainNavbar.classList.remove("opacity-0", "pointer-events-none");
        floatingNavbar.classList.add("hidden");
        floatingNavbar.classList.remove("flex");
    }
});