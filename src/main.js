import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════
   LENIS SMOOTH SCROLL
   ═══════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

/* ═══════════════════════════════════════════════
   SPLIT TEXT UTILITY
   Wraps each word in spans for word-by-word animation
   ═══════════════════════════════════════════════ */
function splitTextIntoWords(el) {
  const text = el.textContent.trim()
  const words = text.split(/\s+/)
  el.innerHTML = words.map(
    (w) => `<span class="word"><span class="word-inner">${w}</span></span>`
  ).join(' ')
  return el.querySelectorAll('.word-inner')
}

// Process all split-text elements
const splitEls = document.querySelectorAll('.split-text')
const splitMap = new Map()
splitEls.forEach((el) => {
  const wordInners = splitTextIntoWords(el)
  splitMap.set(el, wordInners)
})

/* ═══════════════════════════════════════════════
   HERO ANIMATIONS (on page load)
   ═══════════════════════════════════════════════ */
const heroTl = gsap.timeline({ delay: 0.3 })

heroTl
  // 1. Subtitle fade
  .to('.hero__subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  })
  // 2. Names reveal
  .to('.hero__name--bride', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
  }, '-=0.4')
  .to('.hero__ampersand', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(2)',
  }, '-=0.6')
  .to('.hero__name--groom', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
  }, '-=0.4')
  // 3. English names
  .to('.hero__names-en', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.5')
  // 4. Date line
  .to('.hero__date', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.3')
  // 5. Tagline
  .to('.hero__tagline', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.3')
  // 6. Scroll cue
  .to('.hero__scroll-cue', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.2')
// 7. Arch draws last — top dome first, then left+right sides simultaneously
const allArchPaths = document.querySelectorAll('.arch-path')
allArchPaths.forEach((path) => {
  const length = path.getTotalLength ? path.getTotalLength() : 800
  path.style.strokeDasharray = length
  path.style.strokeDashoffset = length
})

heroTl
  // Top dome/kalash appears first
  .to('.arch-top', {
    strokeDashoffset: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0,
  }, '-=0.4')
  // Left and right halves draw simultaneously from apex downward
  .to('.arch-left, .arch-right', {
    strokeDashoffset: 0,
    duration: 3.5,
    ease: 'power2.inOut',
    stagger: 0,
  }, '-=0.1')
  // Pillar details + toran fade in at end
  .to('.arch-detail', {
    strokeDashoffset: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.06,
  }, '-=1.5')

// Set initial states for hero elements that animate from offset
gsap.set('.hero__subtitle', { y: 20 })
gsap.set('.hero__name--bride', { y: 40 })
gsap.set('.hero__name--groom', { y: 40 })
gsap.set('.hero__ampersand', { scale: 0.5 })

// Mandala parallax
gsap.to('.hero__mandala', {
  y: 200,
  rotation: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
})

// Hide scroll cue on scroll
gsap.to('.hero__scroll-cue', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: '10% top',
    end: '20% top',
    scrub: true,
  },
})

/* ═══════════════════════════════════════════════
   COUPLE SECTION ANIMATIONS
   ═══════════════════════════════════════════════ */

// Header text reveal
const coupleHeaderEls = document.querySelectorAll('.couple__header .split-text')
coupleHeaderEls.forEach((el) => {
  const words = splitMap.get(el)
  if (!words) return
  gsap.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
})

// Single couple photo reveal
const coupleShowcase = document.querySelector('.couple__showcase')
if (coupleShowcase) {
  const photoWrap = coupleShowcase.querySelector('.couple__photo-wrap')
  const nameEl = coupleShowcase.querySelector('.couple__name')
  const descEl = coupleShowcase.querySelector('.couple__desc')
  const nameWords = splitMap.get(nameEl)
  const descWords = splitMap.get(descEl)

  const coupleTl = gsap.timeline({
    scrollTrigger: {
      trigger: coupleShowcase,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })

  coupleTl.from(photoWrap, {
    scale: 0.7,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  })

  if (nameWords) {
    coupleTl.to(nameWords, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
    }, '-=0.5')
  }

  coupleTl.from(coupleShowcase.querySelector('.couple__name-en'), {
    opacity: 0,
    y: 10,
    duration: 0.5,
    ease: 'power2.out',
  }, '-=0.3')

  if (descWords) {
    coupleTl.to(descWords, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power3.out',
    }, '-=0.2')
  }
}

// Lotus parallax
gsap.to('.couple__lotus--left', {
  y: -100,
  rotation: 15,
  ease: 'none',
  scrollTrigger: {
    trigger: '.couple',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  },
})
gsap.to('.couple__lotus--right', {
  y: -150,
  rotation: -10,
  ease: 'none',
  scrollTrigger: {
    trigger: '.couple',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  },
})

/* ═══════════════════════════════════════════════
   GALLERY — Scattered layout animations
   ═══════════════════════════════════════════════ */

// Header text
const galleryHeaderEls = document.querySelectorAll('.gallery__header .split-text')
galleryHeaderEls.forEach((el) => {
  const words = splitMap.get(el)
  if (!words) return
  gsap.to(words, {
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.05,
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
  })
})

// Photo figures — enter from the direction of their tilt
const figAnimations = [
  { sel: '.gallery__fig--1', xFrom: -50 },
  { sel: '.gallery__fig--2', xFrom:  50 },
  { sel: '.gallery__fig--3', xFrom: -50 },
  { sel: '.gallery__fig--4', xFrom:   0 },
  { sel: '.gallery__fig--5', xFrom:  50 },
]

figAnimations.forEach(({ sel, xFrom }) => {
  const el = document.querySelector(sel)
  if (!el) return
  gsap.fromTo(el,
    { opacity: 0, x: xFrom, y: 30 },
    {
      opacity: 1, x: 0, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    }
  )
})

// Corner ornaments pop in with a slight delay after their photo
document.querySelectorAll('.gallery__corner').forEach((corner) => {
  const parentFig = corner.closest('.gallery__fig')
  gsap.fromTo(corner,
    { opacity: 0, scale: 0 },
    {
      opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)',
      scrollTrigger: { trigger: parentFig, start: 'top 80%', toggleActions: 'play none none none' },
      delay: 0.5,
    }
  )
})

// Floating decorative elements — slow parallax float in
document.querySelectorAll('.gallery__float, .gallery__divider-orn').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3,
      scrollTrigger: { trigger: el.closest('.gallery__row'), start: 'top 85%', toggleActions: 'play none none none' },
    }
  )

  // Gentle continuous float
  gsap.to(el, {
    y: i % 2 === 0 ? -18 : 14,
    duration: 3 + i * 0.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })
})

/* ═══════════════════════════════════════════════
   EVENTS TIMELINE ANIMATIONS
   ═══════════════════════════════════════════════ */

// Header text
const eventsHeaderEls = document.querySelectorAll('.events__header .split-text')
eventsHeaderEls.forEach((el) => {
  const words = splitMap.get(el)
  if (!words) return
  gsap.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
})

// Timeline line grows on scroll via scaleY
const lineFill = document.querySelector('.events__line-fill')
if (lineFill) {
  gsap.to(lineFill, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.events__timeline',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
    },
  })
}

// Cards slide in from alternating sides
document.querySelectorAll('.events__card').forEach((card) => {
  const isLeft = card.classList.contains('events__card--left')
  const xFrom = isLeft ? -80 : 80

  gsap.fromTo(card, {
    x: xFrom,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })

  // Icon scale/rotate
  const icon = card.querySelector('.events__icon')
  if (icon) {
    gsap.from(icon, {
      scale: 0,
      rotation: -30,
      duration: 0.8,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: card,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })
  }
})

/* ═══════════════════════════════════════════════
   VENUE SECTION ANIMATIONS
   ═══════════════════════════════════════════════ */

// Section title reveal
const venueHeaderEls = document.querySelectorAll('.venue__content .split-text')
venueHeaderEls.forEach((el) => {
  const words = splitMap.get(el)
  if (!words) return
  gsap.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
})

// Venue details fade up
gsap.from('.venue__details', {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.venue__details',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
})

// Corner ornaments animate in
document.querySelectorAll('.venue__ornament').forEach((orn) => {
  const isLeft = orn.classList.contains('venue__ornament--tl') || orn.classList.contains('venue__ornament--bl')
  const isTop = orn.classList.contains('venue__ornament--tl') || orn.classList.contains('venue__ornament--tr')

  gsap.to(orn, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.venue',
      start: 'top 60%',
      toggleActions: 'play none none none',
    },
  })
  gsap.set(orn, {
    x: isLeft ? -40 : 40,
    y: isTop ? -40 : 40,
  })
})

// Map reveal
gsap.from('.venue__map', {
  y: 40,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.venue__map',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
})

/* ═══════════════════════════════════════════════
   FOOTER / BLESSING ANIMATIONS
   ═══════════════════════════════════════════════ */

// Rangoli stroke draw
const rangoliPaths = document.querySelectorAll('.rangoli-path')
rangoliPaths.forEach((path) => {
  const length = path.getTotalLength ? path.getTotalLength() : 2000
  path.style.strokeDasharray = length
  path.style.strokeDashoffset = length
})

gsap.to('.rangoli-path', {
  strokeDashoffset: 0,
  duration: 3,
  ease: 'power2.inOut',
  stagger: 0.15,
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 70%',
    toggleActions: 'play none none none',
  },
})

// Blessing text reveal
const footerSplitEls = document.querySelectorAll('.footer__content .split-text')
footerSplitEls.forEach((el) => {
  const words = splitMap.get(el)
  if (!words) return
  gsap.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
})

// Footer divider, names, date
gsap.to('.footer__divider', {
  opacity: 1,
  width: 80,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.footer__divider',
    start: 'top 90%',
    toggleActions: 'play none none none',
  },
})
gsap.set('.footer__divider', { width: 0 })

gsap.to('.footer__names', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.footer__names',
    start: 'top 90%',
    toggleActions: 'play none none none',
  },
})
gsap.set('.footer__names', { y: 20 })

gsap.to('.footer__date', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.footer__date',
    start: 'top 90%',
    toggleActions: 'play none none none',
  },
})
gsap.set('.footer__date', { y: 20 })
