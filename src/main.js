import './style.css'

/* ============================================
   Sidebar — Toggle & Page Navigation
   ============================================ */
function initSidebar() {
  const sidebar = document.getElementById('sidebar')
  const sidebarToggle = document.getElementById('sidebar-toggle')
  const mainWrapper = document.getElementById('main-wrapper')
  const overlay = document.getElementById('sidebar-overlay')

  if (!sidebar || !sidebarToggle) return

  // Create floating open button
  const openBtn = document.createElement('button')
  openBtn.className = 'sidebar-open-btn'
  openBtn.id = 'sidebar-open-btn'
  openBtn.setAttribute('aria-label', 'Open sidebar')
  openBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  document.body.appendChild(openBtn)

  function closeSidebar() {
    sidebar.classList.remove('is-open')
    mainWrapper.classList.add('is-full')
    openBtn.classList.add('is-visible')
    if (overlay) overlay.classList.remove('is-visible')
  }

  function openSidebar() {
    sidebar.classList.add('is-open')
    mainWrapper.classList.remove('is-full')
    openBtn.classList.remove('is-visible')
    if (window.innerWidth <= 768 && overlay) {
      overlay.classList.add('is-visible')
    }
  }

  sidebarToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) {
      closeSidebar()
    } else {
      openSidebar()
    }
  })

  openBtn.addEventListener('click', openSidebar)

  if (overlay) {
    overlay.addEventListener('click', closeSidebar)
  }

  // Keyboard shortcut: Ctrl+B / Cmd+B
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      if (sidebar.classList.contains('is-open')) {
        closeSidebar()
      } else {
        openSidebar()
      }
    }
  })
}

/* ============================================
   Page Navigation
   ============================================ */
function initPageNavigation() {
  const pages = document.querySelectorAll('.page')
  const sidebarItems = document.querySelectorAll('.sidebar__item[data-page]')
  const homeCards = document.querySelectorAll('.home-nav-card[data-page]')
  const internalLinks = document.querySelectorAll('[data-page]')

  function navigateTo(pageId) {
    // Hide all pages
    pages.forEach((p) => p.classList.remove('is-active'))

    // Show target page
    const target = document.getElementById('page-' + pageId)
    if (target) {
      target.classList.add('is-active')
    }

    // Update sidebar active state
    sidebarItems.forEach((item) => {
      item.classList.remove('is-active')
      if (item.dataset.page === pageId) {
        item.classList.add('is-active')
      }
    })

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Re-init scroll animations for the new page
    initScrollAnimations()

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar')
      const mainWrapper = document.getElementById('main-wrapper')
      const overlay = document.getElementById('sidebar-overlay')
      const openBtn = document.getElementById('sidebar-open-btn')
      if (sidebar) sidebar.classList.remove('is-open')
      if (mainWrapper) mainWrapper.classList.add('is-full')
      if (openBtn) openBtn.classList.add('is-visible')
      if (overlay) overlay.classList.remove('is-visible')
    }
  }

  // All clickable elements with data-page
  internalLinks.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const pageId = el.dataset.page
      if (pageId) navigateTo(pageId)
    })
  })
}

/* ============================================
   Scroll Animations — IntersectionObserver
   ============================================ */
function initScrollAnimations() {
  const activePage = document.querySelector('.page.is-active')
  if (!activePage) return

  const elements = activePage.querySelectorAll('.animate-in')

  // Hero elements: show immediately with staggered delay
  const heroElements = activePage.querySelectorAll('.hero .animate-in')
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
   Nav — Scroll effect (inside Mapa page)
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
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]')
    if (!link) return

    // Skip if it has data-page (handled by page navigation)
    if (link.dataset.page) return

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
}

/* ============================================
   Init
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar()
  initPageNavigation()
  initScrollAnimations()
  initNav()
  initNavActiveSection()
  initInstrumentCards()
  initCounters()
  initSmoothScroll()
})
