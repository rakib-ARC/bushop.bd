/* =====================================
   BU SHOP - JAVASCRIPT
   ===================================== */

// 1. Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

// Close mobile menu after clicking a navigation link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Close menu with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// 2. Dark / Light Mode
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("bushop-theme");

// Load previously selected theme
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.textContent = "☀";
} else {
  themeToggle.textContent = "☾";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  themeToggle.textContent = isDark ? "☀" : "☾";

  localStorage.setItem("bushop-theme", isDark ? "dark" : "light");
});

// 3. Contact Form Validation
const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const formSuccess = document.getElementById("formSuccess");

// Clear previous errors
function clearErrors() {
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  formSuccess.textContent = "";
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Handle form submission
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  clearErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  let isValid = true;

  // Name validation
  if (name.length < 2) {
    nameError.textContent = "Please enter at least 2 characters.";
    isValid = false;
  }

  // Email validation
  if (!isValidEmail(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  // Message validation
  if (message.length < 10) {
    messageError.textContent = "Message must contain at least 10 characters.";
    isValid = false;
  }

  // Stop if validation fails
  if (!isValid) {
    return;
  }

  // Successful client-side validation
  formSuccess.textContent = `Thank you, ${name}! Your form passed validation successfully.`;

  contactForm.reset();
});

// 4. Active Navigation Link on Scroll
const sections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

// 5. Smooth scroll for internal navigation links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (event) {
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// 6. Shopping cart
const cartCount = document.getElementById("cartCount");
const cartButton = document.querySelector(".cart-button");
const cart = JSON.parse(localStorage.getItem("bushop-cart") || "{}");

function saveCart() {
  localStorage.setItem("bushop-cart", JSON.stringify(cart));
}

function getCartTotal() {
  return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  cartCount.textContent = String(getCartTotal());
}

document.querySelectorAll(".add-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    const name = card.querySelector("h3").textContent;
    const price = Number(
      card.querySelector(".product-row strong").textContent.replace("$", ""),
    );

    cart[name] = cart[name]
      ? { ...cart[name], quantity: cart[name].quantity + 1 }
      : { price, quantity: 1 };

    saveCart();
    updateCartCount();
    button.textContent = "Added ✓";
    button.classList.add("added");

    setTimeout(() => {
      button.textContent = "Add to cart";
      button.classList.remove("added");
    }, 900);
  });
});

updateCartCount();

cartButton.addEventListener("click", () => {
  const items = Object.entries(cart);

  if (!items.length) {
    alert("Your cart is empty. Add a product to get started!");
    return;
  }

  const summary = items
    .map(
      ([name, item]) =>
        `${name} × ${item.quantity} — $${item.price * item.quantity}`,
    )
    .join("\n");
  const total = items.reduce(
    (sum, [, item]) => sum + item.price * item.quantity,
    0,
  );

  alert(`Your Cart\n\n${summary}\n\nTotal: $${total}`);
});

// 7. Special offer popup
const offerPopup = document.getElementById("offerPopup");
const closeOffer = document.getElementById("closeOffer");
const offerShopButton = document.getElementById("offerShopButton");
const closeOfferTargets = document.querySelectorAll("[data-close-offer]");

function openOfferPopup() {
  offerPopup.classList.add("active");
  offerPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("offer-open");
  closeOffer.focus();
}

function closeOfferPopup() {
  offerPopup.classList.remove("active");
  offerPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("offer-open");
}

closeOffer.addEventListener("click", closeOfferPopup);
closeOfferTargets.forEach((target) => {
  target.addEventListener("click", closeOfferPopup);
});

offerShopButton.addEventListener("click", closeOfferPopup);

setTimeout(openOfferPopup, 900);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && offerPopup.classList.contains("active")) {
    closeOfferPopup();
  }
});

// 8. Navbar account and wishlist actions
const signInButton = document.querySelector(".sign-in-button");
const wishlistButton = document.querySelector(".wishlist-button");
const wishlistCount = document.getElementById("wishlistCount");

signInButton.addEventListener("click", () => {
  alert("Sign-in will be available soon. Thank you for visiting BU SHOP!");
});

wishlistButton.addEventListener("click", () => {
  const count = Number(wishlistCount.textContent);

  if (count === 0) {
    alert(
      "Your wish list is empty. Your favorite products can be saved here soon!",
    );
  } else {
    alert(`You have ${count} item${count === 1 ? "" : "s"} in your wish list.`);
  }
});

console.log("BU SHOP Website Loaded Successfully!");
