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
  openBtn.setAttribute('aria-label', 'Abrir menu lateral')
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

  function navigateTo(pageId, options = {}) {
    const { scrollTo = null, clickedItem = null } = options

    // Hide all pages
    pages.forEach((p) => p.classList.remove('is-active'))

    // Show target page
    const target = document.getElementById('page-' + pageId)
    if (target) {
      target.classList.add('is-active')
    }

    // Update sidebar active state:
    //   - Se foi um subitem (clickedItem com data-scroll-to), só ele fica ativo
    //   - Caso contrário, todos os itens da página (mas evitando acender todos os subitens irmãos)
    sidebarItems.forEach((item) => {
      item.classList.remove('is-active')
    })
    if (clickedItem && clickedItem.classList.contains('sidebar__item')) {
      clickedItem.classList.add('is-active')
    } else {
      // Primeiro item da página (ou item não-subitem) acende
      const plain = Array.from(sidebarItems).find(
        (item) => item.dataset.page === pageId && !item.classList.contains('sidebar__item--subitem')
      )
      const firstSub = Array.from(sidebarItems).find(
        (item) => item.dataset.page === pageId && item.classList.contains('sidebar__item--subitem')
      )
      if (plain) plain.classList.add('is-active')
      else if (firstSub) firstSub.classList.add('is-active')
    }

    // Scroll inicial
    if (!scrollTo) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    // Re-init scroll animations for the new page
    initScrollAnimations()

    // Re-inicializa TOC lateral do decreto quando a página é aberta
    if (pageId === 'decreto' && typeof initDecretoTocDireito === 'function') {
      setTimeout(() => initDecretoTocDireito('decreto-toc-direito'), 60)
    }
    if (pageId === 'decreto-apis' && typeof initDecretoTocDireito === 'function') {
      setTimeout(() => initDecretoTocDireito('decreto-apis-toc-direito'), 60)
    }

    // Scroll para âncora específica (após page switch + init TOC)
    if (scrollTo) {
      setTimeout(() => {
        const anchor = document.getElementById(scrollTo)
        if (anchor) {
          const y = anchor.getBoundingClientRect().top + window.pageYOffset - 20
          window.scrollTo({ top: y, behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      }, 120)
    }

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
      const scrollTo = el.dataset.scrollTo || null
      if (pageId) navigateTo(pageId, { scrollTo, clickedItem: el })
    })
  })
}

/* ============================================
   Scroll Animations — IntersectionObserver
   ============================================ */
let scrollAnimObserver = null

function initScrollAnimations() {
  const activePage = document.querySelector('.page.is-active')
  if (!activePage) return

  // Desconecta observer anterior antes de criar novo — evita leak em trocas de página
  if (scrollAnimObserver) scrollAnimObserver.disconnect()

  const elements = activePage.querySelectorAll('.animate-in')

  // Hero elements: show immediately with staggered delay
  const heroElements = activePage.querySelectorAll('.hero .animate-in')
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('is-visible')
    }, 200 + i * 150)
  })

  scrollAnimObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          scrollAnimObserver.unobserve(entry.target)
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
      scrollAnimObserver.observe(el)
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
   Modo Decreto Limpo — oculta/mostra as orientações da consultoria
   ============================================ */
function initModoDecretoLimpo() {
  const btn = document.getElementById('btn-modo-limpo')
  if (!btn) return

  const STORAGE_KEY = 'decreto-modo-limpo'
  const saved = sessionStorage.getItem(STORAGE_KEY) === 'true'
  const stateLabel = btn.querySelector('.decreto-overview__modo-limpo-state')

  function setModo(ativo) {
    document.body.classList.toggle('modo-decreto-limpo', ativo)
    btn.setAttribute('aria-pressed', ativo ? 'true' : 'false')
    if (stateLabel) stateLabel.textContent = ativo ? 'ON' : 'OFF'
    try {
      sessionStorage.setItem(STORAGE_KEY, ativo ? 'true' : 'false')
    } catch (e) {
      /* ignora */
    }
  }

  btn.addEventListener('click', () => {
    const atual = btn.getAttribute('aria-pressed') === 'true'
    setModo(!atual)
  })

  // Botões secundários dentro do aviso de cada Caminho
  document.querySelectorAll('[data-toggle-modo-limpo]').forEach((b) => {
    b.addEventListener('click', () => {
      const atual = btn.getAttribute('aria-pressed') === 'true'
      setModo(!atual)
    })
  })

  setModo(saved)
}

/* ============================================
   TOC lateral direito — scroll-spy com IntersectionObserver
   ============================================ */
const decretoTocState = new Map()

function initDecretoTocDireito(tocId = 'decreto-toc-direito') {
  const toc = document.getElementById(tocId)
  if (!toc) return

  const links = toc.querySelectorAll('.decreto-toc-direito__link')
  if (links.length === 0) return

  const linksMap = new Map()
  const targets = []

  links.forEach((link) => {
    const href = link.getAttribute('href')
    if (!href || !href.startsWith('#')) return
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      linksMap.set(id, link)
      targets.push(el)
    }
  })

  if (targets.length === 0) return

  // Converte h2 de seções dentro de caminho-completo em "aria-level 3"
  // (hierarquia semântica correta: wrapper = h2, dentro = h3)
  document.querySelectorAll('.caminho-completo .dec-section__title').forEach((h) => {
    h.setAttribute('role', 'heading')
    h.setAttribute('aria-level', '3')
  })
  document.querySelectorAll('.caminho-completo .dec-norma__bloco-title').forEach((h) => {
    h.setAttribute('role', 'heading')
    h.setAttribute('aria-level', '4')
  })

  // Limpa observer anterior desta instância (caso reinit)
  const prev = decretoTocState.get(tocId)
  if (prev) {
    if (prev.observer) prev.observer.disconnect()
    if (prev.clickHandler) toc.removeEventListener('click', prev.clickHandler)
  }

  let activeId = null
  let suspendObserverUntil = 0

  // Grupos do TOC
  const grupoA = toc.querySelector('.decreto-toc-direito__grupo-titulo--a')?.parentElement
  const grupoB = toc.querySelector('.decreto-toc-direito__grupo-titulo--b')?.parentElement

  function setActive(id) {
    if (activeId === id) return
    if (activeId && linksMap.has(activeId)) {
      linksMap.get(activeId).classList.remove('is-active')
    }
    if (id && linksMap.has(id)) {
      linksMap.get(id).classList.add('is-active')
    }
    activeId = id
  }

  function destacarGrupo(id) {
    if (!grupoA || !grupoB) return
    const isA = id && id.startsWith('a-')
    const isB = id && id.startsWith('b-')
    grupoA.classList.toggle('is-dimmed', !isA && isB)
    grupoB.classList.toggle('is-dimmed', !isB && isA)
  }

  function aplicarDestaque(id) {
    setActive(id)
    destacarGrupo(id)
  }

  // Fallback: identifica link ativo pelo scroll absoluto
  function syncByScroll() {
    if (Date.now() < suspendObserverUntil) return
    const scrollY = window.pageYOffset + 120
    let current = targets[0]?.id || null
    for (const el of targets) {
      const top = el.getBoundingClientRect().top + window.pageYOffset
      if (top <= scrollY) current = el.id
      else break
    }
    if (current) aplicarDestaque(current)
  }

  // Interceptação de click: força destaque imediato e suspende observer/syncByScroll
  // durante o smooth scroll. Sem isso:
  //   - IntersectionObserver pode marcar a seção anterior durante a passagem pela banda
  //   - Em targets próximos ao fim da página (onde o scroll não alcança o topo),
  //     syncByScroll acharia que o atual é o anterior (top ainda > pageYOffset+offset).
  const clickHandler = (e) => {
    const link = e.target.closest('.decreto-toc-direito__link')
    if (!link || !toc.contains(link)) return
    const href = link.getAttribute('href')
    if (!href || !href.startsWith('#')) return
    const id = href.slice(1)
    if (!linksMap.has(id)) return
    aplicarDestaque(id)
    suspendObserverUntil = Date.now() + 1200
  }
  toc.addEventListener('click', clickHandler)

  // Cache do estado de interseção — alimentado pelas entries do Observer.
  // Evita `getBoundingClientRect` em loop a cada callback (forced layout).
  const intersectingState = new Map()

  const observer = new IntersectionObserver(
    (entries) => {
      // Atualiza o cache SEMPRE (mesmo durante suspensão) usando os rects
      // que o próprio Observer já entrega gratuitamente.
      entries.forEach((e) => {
        intersectingState.set(e.target.id, {
          isIntersecting: e.isIntersecting,
          top: e.boundingClientRect.top,
        })
      })

      if (Date.now() < suspendObserverUntil) return

      // Calcula o destaque usando apenas dados cacheados — sem reflow.
      const visible = []
      intersectingState.forEach((state, id) => {
        if (state.isIntersecting) visible.push({ id, top: state.top })
      })

      if (visible.length > 0) {
        // "Mais recente" = maior top (mais proximo ou acima de 0)
        visible.sort((a, b) => b.top - a.top)
        aplicarDestaque(visible[0].id)
      } else {
        // Nada visivel na banda (topo absoluto ou fim da pagina) — fallback
        syncByScroll()
      }
    },
    {
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0,
    }
  )

  targets.forEach((el) => observer.observe(el))

  // Guarda o estado desta instância para posterior reinit/cleanup
  decretoTocState.set(tocId, { observer, clickHandler })

  // Primeira sincronização para cobrir o caso de carregar a página já scrolled
  syncByScroll()
}

/* ============================================
   Print Mode — ?print=rota-a|rota-b|apis  (opcional: &notas=1)
   ============================================ */
function initPrintMode() {
  const params = new URLSearchParams(window.location.search)
  const printTarget = params.get('print')
  if (!printTarget) return

  const mapa = {
    'rota-a': {
      pageId: 'decreto',
      bloco: 'caminho-a-completo',
      tag: 'Decreto Municipal',
      titulo: 'Decreto do Programa Municipal de Incentivo à Inovação de Joinville',
      subtitulo: 'Caminho A — Apoio financeiro direto via Fundo Municipal de Inovação Tecnológica (FIT/Jlle). Aplicável imediatamente por Decreto, com fundamento na Lei Municipal nº 7.170, de 19 de dezembro de 2011.',
      idContainer: 'caminho-a-completo',
    },
    'rota-b': {
      pageId: 'decreto',
      bloco: 'caminho-b-completo',
      tag: 'Decreto Municipal',
      titulo: 'Decreto do Programa Municipal de Incentivo à Inovação de Joinville',
      subtitulo: 'Caminho B — Mecanismo de incentivo fiscal fundado no redirecionamento parcial de ISSQN e IPTU. Aplicação condicionada à vigência de Lei Complementar municipal autorizativa.',
      idContainer: 'caminho-b-completo',
    },
    'apis': {
      pageId: 'decreto-apis',
      bloco: null,
      tag: 'Decreto Municipal Complementar',
      titulo: 'Decreto dos Arranjos Promotores de Inovação',
      subtitulo: 'Regulamenta a organização, o credenciamento, as competências, o acompanhamento, as vedações, as sanções e o descredenciamento dos Arranjos Promotores de Inovação (APIs) no âmbito do Programa Municipal de Incentivo à Inovação de Joinville.',
      idContainer: 'page-decreto-apis',
    },
  }
  const cfg = mapa[printTarget]
  if (!cfg) return

  document.documentElement.classList.add('print-mode')
  document.documentElement.setAttribute('data-print-target', printTarget)

  document.querySelectorAll('.page').forEach((p) => p.classList.remove('is-active'))
  const page = document.getElementById('page-' + cfg.pageId)
  if (page) page.classList.add('is-active')

  if (cfg.bloco) {
    document.documentElement.setAttribute('data-print-bloco', cfg.bloco)
  }

  const comNotas = params.get('notas') === '1'
  if (!comNotas) {
    document.body.classList.add('modo-decreto-limpo')
    document.documentElement.setAttribute('data-print-notas', 'false')
  } else {
    document.documentElement.setAttribute('data-print-notas', 'true')
  }

  // Gera capa + sumário dinamicamente no topo do bloco alvo
  setTimeout(() => injetarCapaESumario(cfg, comNotas), 100)
}

function injetarCapaESumario(cfg, comNotas) {
  const container = document.getElementById(cfg.idContainer)
  if (!container) return

  const hoje = new Date()
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const dataExtenso = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`

  const capa = document.createElement('section')
  capa.className = 'print-capa'
  capa.innerHTML = `
    <div class="print-capa__brasao">Prefeitura Municipal de Joinville — Santa Catarina</div>
    <span class="print-capa__tag">${cfg.tag}</span>
    <h1 class="print-capa__titulo">${cfg.titulo}</h1>
    <p class="print-capa__subtitulo">${cfg.subtitulo}</p>
    <div class="print-capa__meta">
      <p><strong>Minuta consultiva</strong>${comNotas ? ' — versão com orientações da consultoria' : ''}</p>
      <p>BRZ Capacitação × Consultoria SEBRAE/SC</p>
      <p>Geração: ${dataExtenso}</p>
    </div>
  `

  // Sumário: coleta .dec-section do container (exceto wrappers/placeholders)
  const secoes = Array.from(container.querySelectorAll('.dec-section')).filter(s => {
    if (s.classList.contains('dec-section--pendente')) return false
    return s.querySelector('.dec-section__title')
  })

  const sumario = document.createElement('section')
  sumario.className = 'print-sumario'

  let html = '<h2 class="print-sumario__titulo">Sumário</h2><ul class="print-sumario__lista">'

  secoes.forEach((sec) => {
    const num = sec.querySelector('.dec-section__num')?.textContent?.trim() || ''
    const titulo = sec.querySelector('.dec-section__title')?.textContent?.trim() || ''
    html += `<li class="print-sumario__item print-sumario__item--cap">
      <span class="print-sumario__label">${num}</span>
      <span class="print-sumario__titulo-item">${titulo}</span>
    </li>`
    const blocos = sec.querySelectorAll('.dec-norma__bloco-title')
    blocos.forEach((b) => {
      const tituloBloco = b.textContent.trim().replace(/\s+/g, ' ')
      html += `<li class="print-sumario__item print-sumario__item--secao">
        <span class="print-sumario__titulo-item">${tituloBloco}</span>
      </li>`
    })
  })
  html += '</ul>'
  sumario.innerHTML = html

  container.insertBefore(sumario, container.firstChild)
  container.insertBefore(capa, container.firstChild)
}

/* ============================================
   Init
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPrintMode()
  initSidebar()
  initPageNavigation()
  initScrollAnimations()
  initNav()
  initNavActiveSection()
  initInstrumentCards()
  initCounters()
  initSmoothScroll()
  initModoDecretoLimpo()
  initDecretoTocDireito()
})
