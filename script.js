/**
 * ============================================================================
 * CONFIGURATION & CLIENT DOWNLOAD LINK
 * ============================================================================
 */
const CONFIG = {
  // 👉 PUT YOUR GOOGLE DRIVE, DROPBOX, WETRANSFER, OR ONEDRIVE LINK HERE:
  downloadUrl: "https://drive.google.com/drive/folders/YOUR_CLOUD_FOLDER_ID",

  // Image files in current folder
  images: [
    "IMG_0046.JPG",
    "IMG_0072.JPG",
    "IMG_0111.JPG",
    "IMG_0138.JPG",
    "IMG_0148.JPG",
    "IMG_0166.JPG",
    "IMG_0221.JPG",
    "IMG_0223.JPG",
    "IMG_0242.JPG",
    "IMG_0262.JPG",
    "IMG_0263.JPG",
    "IMG_0269.JPG",
    "IMG_0359.JPG",
    "IMG_0626.JPG"
  ]
};

/* ============================================================================
   Application Initialization
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initFloatingTracks();
  initPopUpGrid();
  initDeliveryHub();
  initLightbox();
});

/* ============================================================================
   Floating Hero Moving Stream
   ============================================================================ */
function initFloatingTracks() {
  const track1 = document.getElementById("floating-track-1");
  const track2 = document.getElementById("floating-track-2");
  if (!track1 || !track2) return;

  const half = Math.ceil(CONFIG.images.length / 2);
  const set1 = CONFIG.images.slice(0, half);
  const set2 = CONFIG.images.slice(half);

  // Duplicate sets to ensure smooth seamless infinite loop
  const list1 = [...set1, ...set1, ...set1, ...set1];
  const list2 = [...set2, ...set2, ...set2, ...set2];

  track1.innerHTML = list1.map((src, i) => `
    <div class="floating-card" onclick="openLightbox('${src}')">
      <img src="${src}" alt="Visual Frame ${i + 1}" loading="lazy" />
      <div class="floating-card-glare">
        <span><i class="fa-solid fa-expand"></i> Preview</span>
      </div>
    </div>
  `).join("");

  track2.innerHTML = list2.map((src, i) => `
    <div class="floating-card" onclick="openLightbox('${src}')">
      <img src="${src}" alt="Visual Frame ${i + 1}" loading="lazy" />
      <div class="floating-card-glare">
        <span><i class="fa-solid fa-expand"></i> Preview</span>
      </div>
    </div>
  `).join("");
}

/* ============================================================================
   Scroll Pop-Up Grid
   ============================================================================ */
function initPopUpGrid() {
  const grid = document.getElementById("popup-grid");
  if (!grid) return;

  grid.innerHTML = CONFIG.images.map((src, idx) => `
    <div class="popup-card" data-index="${idx}" onclick="openLightbox('${src}')">
      <img src="${src}" alt="Highlight ${idx + 1}" loading="lazy" />
      <div class="popup-card-overlay">
        <span class="popup-card-tag">Frame ${String(idx + 1).padStart(2, '0')}</span>
        <h4 class="popup-card-title">Master Capture</h4>
      </div>
    </div>
  `).join("");

  // IntersectionObserver to trigger pop-in on scroll
  const cards = grid.querySelectorAll(".popup-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index, 10) || 0;
        setTimeout(() => {
          entry.target.classList.add("is-popped");
        }, (index % 3) * 120);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px"
  });

  cards.forEach(card => observer.observe(card));
}

/* ============================================================================
   "GET IT ALL" Delivery & Copy Link Hub
   ============================================================================ */
function initDeliveryHub() {
  const inputEl = document.getElementById("download-link-input");
  const copyBtn = document.getElementById("btn-copy");
  const directBtn = document.getElementById("direct-link-btn");

  if (inputEl) inputEl.value = CONFIG.downloadUrl;
  if (directBtn) directBtn.href = CONFIG.downloadUrl;

  if (copyBtn && inputEl) {
    copyBtn.addEventListener("click", () => {
      const url = inputEl.value;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
          showCopied(copyBtn);
        }).catch(() => {
          fallbackCopy(inputEl, copyBtn);
        });
      } else {
        fallbackCopy(inputEl, copyBtn);
      }
    });
  }
}

function fallbackCopy(input, btn) {
  input.select();
  input.setSelectionRange(0, 99999);
  try {
    document.execCommand("copy");
    showCopied(btn);
  } catch (err) {
    showToast("Link selected, press Ctrl+C to copy");
  }
}

function showCopied(btn) {
  const btnText = document.getElementById("btn-copy-text");
  btn.classList.add("copied");
  if (btnText) btnText.textContent = "Copied!";
  btn.innerHTML = `<i class="fa-solid fa-check"></i> <span id="btn-copy-text">Copied!</span>`;

  showToast("Download link copied to clipboard!");

  setTimeout(() => {
    btn.classList.remove("copied");
    btn.innerHTML = `<i class="fa-regular fa-copy"></i> <span id="btn-copy-text">Copy Link</span>`;
  }, 3000);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const span = toast.querySelector("span");
  if (span && message) span.textContent = message;

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* ============================================================================
   Lightbox Modal
   ============================================================================ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const bg = document.getElementById("lightbox-bg");
  const closeBtn = document.getElementById("lightbox-close");

  if (!lightbox) return;

  closeBtn.addEventListener("click", closeLightbox);
  bg.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-image");
  if (!lightbox || !img) return;

  img.src = src;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
