import './style.css'

/* ============================================
   Scroll Animations — IntersectionObserver
   ============================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-in')

  // Hero elements: show immediately with staggered delay
  const heroElements = document.querySelectorAll('.hero .animate-in')
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('is-visible')
    }, 200 + i * 150)
  })

  // Other elements: IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px',
    }
  )

  elements.forEach((el) => {
    if (!el.closest('.hero')) {
      observer.observe(el)
    }
  })
}

/* ============================================
   Nav — Scroll effect
   ============================================ */
function initNav() {
  const nav = document.getElementById('nav')
  if (!nav) return

  let ticking = false

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('is-scrolled')
    } else {
      nav.classList.remove('is-scrolled')
    }
    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav)
      ticking = true
    }
  })
}

/* ============================================
   Instrument Cards — Expand/collapse
   ============================================ */
function initInstrumentCards() {
  const cards = document.querySelectorAll('.instrument-card')

  function toggleCard(card) {
    const isExpanded = card.classList.contains('is-expanded')

    cards.forEach((c) => {
      c.classList.remove('is-expanded')
      c.setAttribute('aria-expanded', 'false')
    })

    if (!isExpanded) {
      card.classList.add('is-expanded')
      card.setAttribute('aria-expanded', 'true')
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => toggleCard(card))

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleCard(card)
      }
    })
  })
}

/* ============================================
   Number Counter Animation
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const target = parseInt(el.dataset.count, 10)

          if (isNaN(target)) return

          animateCounter(el, target)
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.3 }
  )

  counters.forEach((counter) => observer.observe(counter))
}

function animateCounter(element, target) {
  const duration = 1500
  const start = performance.now()

  function update(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(eased * target)

    element.textContent = current.toLocaleString('pt-BR')

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

/* ============================================
   Nav Active Section — IntersectionObserver
   ============================================ */
function initNavActiveSection() {
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]')
  const sections = []

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href').slice(1)
    const section = document.getElementById(targetId)
    if (section) {
      sections.push({ el: section, link })
    }
  })

  if (sections.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'))
          const match = sections.find((s) => s.el === entry.target)
          if (match) {
            match.link.classList.add('is-active')
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '-60px 0px -60% 0px',
    }
  )

  sections.forEach((s) => observer.observe(s.el))
}

/* ============================================
   Smooth Scroll — Nav links
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')
      if (!targetId || targetId === '#') return

      const target = document.querySelector(targetId)
      if (!target) return

      e.preventDefault()

      const navHeight = 60
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      })
    })
  })
}

/* ============================================
   Init
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations()
  initNav()
  initNavActiveSection()
  initInstrumentCards()
  initCounters()
  initSmoothScroll()
})
