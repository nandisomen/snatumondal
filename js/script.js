// ========== GLOBAL SETTINGS ==========

// --- Last Modified Date (Footer) ---
const lastModified = new Date(document.lastModified);
const formattedDate = lastModified.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
document.getElementById("last-updated").innerText = "Last updated: " + formattedDate;

// --- Footer Year ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- MathJax Config (LaTeX Rendering) ---
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};

// --- Smart Link Open (New tab for desktop, same tab for mobile) ---
function handleLinkClick(link) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = link.href;
  } else {
    window.open(link.href, '_blank');
  }
  return false;
}

// --- AOS (Animate on Scroll) Init ---
AOS.init({
  duration: 750,
  once: true
});


// ========== NAVIGATION ==========

document.addEventListener("DOMContentLoaded", function () {

  // --- Scroll to Section & Open Dropdown ---
  const dropdownLink = document.querySelector('#navbarScrollingDropdown');
  if (dropdownLink) {
    dropdownLink.addEventListener('click', function () {
      const talksSection = document.querySelector('#outreach');
      if (talksSection) {
        talksSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- Active Nav Highlighting on Scroll ---
  const navLinks = document.querySelectorAll("a[href^='#']");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const sections = document.querySelectorAll("section[id]");
  const offset = 300;

  function activateNavLink() {
    let scrollY = window.pageYOffset;
    let activeSections = new Set();

    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        activeSections.add(sectionId);
      }
    });

    navLinks.forEach(link => {
      const dataTargets = link.getAttribute("data-targets");
      const targetIds = dataTargets
        ? dataTargets.split(",").map(s => s.trim().replace("#", ""))
        : [link.getAttribute("href").replace("#", "")];

      const isActive = targetIds.some(id => activeSections.has(id));

      if (isActive) {
        link.classList.add("active");
        const dropdown = link.closest(".dropdown-menu");
        if (dropdown) {
          const toggle = dropdown.parentElement.querySelector(".dropdown-toggle");
          if (toggle) toggle.classList.add("active");
        }
      } else {
        link.classList.remove("active");
      }
    });

    dropdownToggles.forEach(toggle => {
      const menu = toggle.nextElementSibling;
      const activeChild = menu && menu.querySelector(".active");
      if (!activeChild) toggle.classList.remove("active");
    });
  }

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(activateNavLink, 50);
  });

  activateNavLink();

  // --- Navbar Dropdown on Hover ---
  document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function () {
      const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      const menu = new bootstrap.Dropdown(toggle);
      menu.show();
    });
    dropdown.addEventListener('mouseleave', function () {
      const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      const menu = bootstrap.Dropdown.getInstance(toggle);
      menu.hide();
    });
  });

  // --- Close Navbar on Link Click (Mobile) ---
  document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item').forEach(link => {
    link.addEventListener('click', function () {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // --- Close Navbar When Clicking Outside (Mobile) ---
  document.addEventListener('click', function (event) {
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (
      navbarCollapse &&
      navbarCollapse.classList.contains('show') &&
      !navbarCollapse.contains(event.target) &&
      !navbarToggler.contains(event.target)
    ) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
  });

});


// ========== GALLERY (Image Preview + Caption Update) ==========

document.addEventListener("DOMContentLoaded", function () {
  const bigImage = document.getElementById('bigImage');
  const bigCaption = document.getElementById('bigImageCaption');

  document.querySelectorAll('.thumb-item img').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      bigImage.src = thumb.src;
      bigImage.alt = thumb.alt;

      const captionText = thumb.dataset.caption || thumb.alt || '';
      bigCaption.textContent = captionText;

      document.querySelectorAll('.thumb-item img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});
