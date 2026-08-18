/**
 * Middle Farm Villa B&B - Interactive Features Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSliders();
  initLightbox();
  initAccordion();
  initBookingForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Scroll Class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.innerHTML = isExpanded ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. SLIDERS & CAROUSELS
   ========================================================================== */
function initSliders() {
  const sliderContainers = document.querySelectorAll('.slider-container');

  sliderContainers.forEach((container, index) => {
    const track = container.querySelector('.slider-track');
    const slides = container.querySelectorAll('.slide');
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');
    const dotsContainer = container.querySelector('.slider-dots');

    if (!slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dot indicators if dotsContainer exists
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlider() {
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goToSlide(n) {
      currentIndex = (n + totalSlides) % totalSlides;
      updateSlider();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    // Auto Play optional for hero/about slider
    if (container.dataset.autoplay === 'true') {
      setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    }
  });
}

/* ==========================================================================
   3. LIGHTBOX GALLERY MODAL
   ========================================================================== */
let globalGallery = [];
let globalGalleryIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const captionText = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!modal) return;

  // Open modal logic when clicking zoomable images
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      const galleryGroup = img.dataset.lightboxGroup;
      if (galleryGroup) {
        const groupElements = Array.from(document.querySelectorAll(`[data-lightbox-group="${galleryGroup}"]`));
        globalGallery = groupElements.map(el => ({
          src: el.src || el.dataset.src,
          alt: el.alt || ''
        }));
        globalGalleryIndex = groupElements.indexOf(img);
      } else {
        globalGallery = [{ src: img.src || img.dataset.src, alt: img.alt || '' }];
        globalGalleryIndex = 0;
      }
      openLightbox();
    });
  });

  function openLightbox() {
    if (!globalGallery.length) return;
    const current = globalGallery[globalGalleryIndex];
    modalImg.src = current.src;
    captionText.textContent = current.alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function changeImage(dir) {
    globalGalleryIndex = (globalGalleryIndex + dir + globalGallery.length) % globalGallery.length;
    const current = globalGallery[globalGalleryIndex];
    modalImg.src = current.src;
    captionText.textContent = current.alt;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => changeImage(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeImage(1));

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
}

/* ==========================================================================
   4. POLICY ACCORDION
   ========================================================================== */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   5. BOOKING INQUIRY FORM & EMAIL DISPATCH
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const roomSelect = document.getElementById('roomSelect');
  const formStatus = document.getElementById('formStatus');

  // Allow room buttons to select room and scroll to form
  document.querySelectorAll('[data-inquire-room]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomValue = btn.dataset.inquireRoom;
      if (roomSelect) {
        roomSelect.value = roomValue;
      }
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      // Submit via FormSubmit AJAX directly to middlefarmvilla@aol.com
      fetch('https://formsubmit.co/ajax/middlefarmvilla@aol.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        const name = payload['Full Name'] || 'Guest';

        if (formStatus) {
          formStatus.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <strong>Inquiry Sent Successfully!</strong> Thank you ${name}, your booking request has been emailed directly to <strong>middlefarmvilla@aol.com</strong>. Jane & John will get back to you shortly!
          `;
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          form.reset();

          setTimeout(() => {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Fallback: Mailto client trigger
        const name = payload['Full Name'] || '';
        const email = payload['Email Address'] || '';
        const phone = payload['Phone Number'] || '';
        const room = payload['Preferred Room'] || '';
        const checkIn = payload['Check-In Date'] || '';
        const checkOut = payload['Check-Out Date'] || '';
        const requests = payload['Special Requests'] || '';

        const mailSubject = encodeURIComponent(`Booking Inquiry from ${name}`);
        const mailBody = encodeURIComponent(
          `Full Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred Room: ${room}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nSpecial Requests: ${requests}`
        );

        window.location.href = `mailto:middlefarmvilla@aol.com?subject=${mailSubject}&body=${mailBody}`;
      });
    });
  }
}

/* ==========================================================================
   6. SMOOTH SCROLL HELPER
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
