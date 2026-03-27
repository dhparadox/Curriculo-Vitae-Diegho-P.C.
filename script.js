/* ===================================================
   DhParadox Portfolio — script.js  (v3)
   =================================================== */

(function () {
  'use strict';

  /* ---------- STATE ---------- */
  let currentLang = 'pt';
  let terminalActive = false;

  /* ---------- DOM REFS ---------- */
  const body = document.body;
  const mainContent = document.getElementById('mainContent');
  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalContent = document.getElementById('terminalContent');
  const terminalToggle = document.getElementById('terminalToggle');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const externalModal = document.getElementById('externalModal');
  const externalUrl = document.getElementById('externalUrl');
  const externalCancel = document.getElementById('externalCancel');
  const externalProceed = document.getElementById('externalProceed');

  /* ========================================
     LANGUAGE SWITCHING
     ======================================== */

  function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text) el.textContent = text;
    });

    document.querySelectorAll('.lang-block').forEach(function (block) {
      block.classList.toggle('visible', block.dataset.langContent === lang);
    });

    if (terminalActive) {
      buildTerminal();
    }
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(this.dataset.lang);
    });
  });

  /* ========================================
     HAMBURGER MENU
     ======================================== */

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ========================================
     SCROLL REVEAL
     ======================================== */

  function initReveal() {
    var items = document.querySelectorAll('.section > .container');
    items.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ========================================
     ACTIVE NAV LINK
     ======================================== */

  function initActiveNav() {
    var sections = document.querySelectorAll('.section[id]');
    var links = document.querySelectorAll('.nav-links a');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ========================================
     MEDIA FILTER
     ======================================== */

  function initMediaFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.media-grid .card');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.dataset.filter;

        buttons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        cards.forEach(function (card) {
          if (filter === 'all' || card.dataset.type === filter) {
            card.classList.remove('hidden-card');
          } else {
            card.classList.add('hidden-card');
          }
        });
      });
    });
  }

  /* ========================================
     CAROUSEL
     ======================================== */

  function initCarousels() {
    var carousels = document.querySelectorAll('.carousel');

    carousels.forEach(function (carousel) {
      var slides = carousel.querySelectorAll('.carousel-slide');
      var dots = carousel.querySelectorAll('.carousel-dot');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      var autoInterval = parseFloat(carousel.dataset.auto) || 2847.8;
      var currentIndex = 0;
      var timer = null;

      function goTo(index) {
        // Wrap around
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        slides.forEach(function (s, i) {
          s.classList.toggle('active', i === index);
        });
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === index);
        });
        currentIndex = index;
      }

      function next() {
        goTo(currentIndex + 1);
      }

      function prev() {
        goTo(currentIndex - 1);
      }

      function startAuto() {
        stopAuto();
        if (slides.length > 1) {
          timer = setInterval(next, autoInterval);
        }
      }

      function stopAuto() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      // Arrow buttons
      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          prev();
          startAuto(); // Reset timer after manual nav
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          next();
          startAuto(); // Reset timer after manual nav
        });
      }

      // Dot navigation
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(i);
          startAuto();
        });
      });

      // Pause on hover, resume on leave
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);

      // Start auto-slide
      startAuto();
    });
  }

  /* ========================================
     IMAGE MODAL
     ======================================== */

  function initImageModal() {
    // Image cards and cert cards open modal
    document.querySelectorAll('.card[data-type="image"], .card[data-type="cert"]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Don't open modal if clicking carousel buttons or dots
        if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) return;

        var activeSlide = this.querySelector('.carousel-slide.active');
        var img = activeSlide || this.querySelector('img');
        if (img) {
          modalImage.src = img.src;
          imageModal.classList.remove('hidden');
        }
      });
    });

    imageModal.querySelector('.modal-backdrop').addEventListener('click', closeImageModal);
    imageModal.querySelector('.modal-close').addEventListener('click', closeImageModal);
  }

  function closeImageModal() {
    imageModal.classList.add('hidden');
    modalImage.src = '';
  }

  /* ========================================
     EXTERNAL LINK WARNING (GDPR)
     ======================================== */

  window.handleExternalLink = function (event, url) {
    if (!url || url === '#') return;
    event.preventDefault();
    event.stopPropagation();

    externalUrl.textContent = url;
    externalProceed.href = url;
    externalModal.classList.remove('hidden');
  };

  externalCancel.addEventListener('click', function () {
    externalModal.classList.add('hidden');
  });

  externalModal.querySelector('.modal-backdrop').addEventListener('click', function () {
    externalModal.classList.add('hidden');
  });

  externalProceed.addEventListener('click', function () {
    externalModal.classList.add('hidden');
  });

  /* ========================================
     TERMINAL MODE
     ======================================== */

  var terminalCommands = {
    pt: [
      { type: 'cmd', text: 'cat perfil.txt' },
      { type: 'output', text: 'Estudante de Engenharia Elétrica e graduado em Segurança da Informação pela PUC Minas.' },
      { type: 'output', text: 'Perfil investigativo e criativo, integrando raciocínio técnico com compreensão profunda' },
      { type: 'output', text: 'de comportamento humano e sistemas complexos.' },
      { type: 'output-muted', text: 'Poços de Caldas — MG, Brazil' },
      { type: 'blank' },
      { type: 'cmd', text: 'load destaques' },
      { type: 'output-accent', text: '> Mentalidade Investigativa' },
      { type: 'output', text: '  Exploração de sistemas, análise de tráfego, reconhecimento de padrões.' },
      { type: 'output-accent', text: '> Execução Independente' },
      { type: 'output', text: '  Aprendizado autodidata e execução autônoma.' },
      { type: 'output-accent', text: '> Disciplina & Consistência' },
      { type: 'output', text: '  Boxe, sanda, tênis, musculação — integrados à rotina.' },
      { type: 'output-accent', text: '> Pensamento Transversal' },
      { type: 'output', text: '  Tecnologia + comportamento humano + criatividade.' },
      { type: 'output-accent', text: '> Adaptabilidade Multilíngue' },
      { type: 'output', text: '  PT (nativo) | EN (fluente) | ES (fluente) | ZH/KO (interesse)' },
      { type: 'blank' },
      { type: 'cmd', text: 'load experiencia' },
      { type: 'output-accent', text: '> Exploração de Sistemas' },
      { type: 'output', text: '  Estudo independente de sistemas e aplicações. Análise de tráfego,' },
      { type: 'output', text: '  compreensão comportamental e identificação de padrões.' },
      { type: 'output-accent', text: '> Formação em Cibersegurança' },
      { type: 'output', text: '  Lógica, redes, compliance, WSS Offensive Security, PUC Minas.' },
      { type: 'output-accent', text: '> Suporte & Atendimento ao Cliente' },
      { type: 'output', text: '  Analista de Suporte na TOTVS — Linx.' },
      { type: 'output-accent', text: '> Tradução & Interpretação' },
      { type: 'output', text: '  Intérprete bilateral EN/PT — contratos e eventos (EduX).' },
      { type: 'blank' },
      { type: 'cmd', text: 'load estilo_de_vida' },
      { type: 'output', text: '  Boxe / Sanda  |  Musculação  |  Tênis' },
      { type: 'output', text: '  Estudo Contínuo  |  Desenvolvimento Pessoal' },
      { type: 'output-muted', text: '  Disciplina e consistência como fundamento.' },
      { type: 'blank' },
      { type: 'cmd', text: 'load interesses' },
      { type: 'output', text: '  Música Eletrônica / Sintetizadores' },
      { type: 'output', text: '  Sistemas & Tecnologia' },
      { type: 'output', text: '  Cultura Asiática (China / Coreia)' },
      { type: 'output', text: '  Exploração Criativa' },
      { type: 'output', text: '  Desenvolvimento Pessoal' },
      { type: 'blank' },
      { type: 'cmd', text: 'load lideranca' },
      { type: 'output', text: '  Perfil voltado à construção e fortalecimento de comunidades.' },
      { type: 'output', text: '  Ponte entre tecnologia e pessoas.' },
      { type: 'output', text: '  Disciplina, consistência e mentalidade de crescimento.' },
      { type: 'output-muted', text: '  > Promover iniciativas tecnológicas no campus' },
      { type: 'output-muted', text: '  > Organizar encontros, workshops e grupos de estudo' },
      { type: 'output-muted', text: '  > Criar conteúdos acessíveis sobre tecnologia' },
      { type: 'output-muted', text: '  > Conectar estudantes interessados em tecnologia' },
      { type: 'blank' },
      { type: 'cmd', text: 'load comunidade' },
      { type: 'output', text: '  Fase inicial de exposição pública. Foco em base técnica sólida.' },
      { type: 'output', text: '  Ausência de volume em redes = escolha estratégica.' },
      { type: 'output-accent', text: '  Baixo ruído. Alto sinal.' },
      { type: 'blank' },
      { type: 'cmd', text: 'ls projetos/' },
      { type: 'output-accent', text: '  [carousel] analise_sistemas/' },
      { type: 'output', text: '    india_gov_vdp.jpg  |  hackerone_report.jpg' },
      { type: 'output-accent', text: '  [carousel] reconhecimento_padroes/' },
      { type: 'output', text: '    mass_finding.jpg' },
      { type: 'output-accent', text: '  [carousel] certificados/' },
      { type: 'output', text: '    diploma_internacional.jpg  |  certificado_wss.jpg' },
      { type: 'output-accent', text: '  divulgacoes_publicas.link -> hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'cmd', text: 'echo $CONTATO' },
      { type: 'output', text: '  Email    : diegho@dhparadox.com' },
      { type: 'output', text: '  GitHub   : github.com/DhParadox' },
      { type: 'output', text: '  LinkedIn : linkedin.com/in/dhparadox' },
      { type: 'output', text: '  Research : hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'divider', text: '═══════════════════════════════════════════════════' },
      { type: 'output-muted', text: '  session active — DhParadox terminal v3.0' },
    ],
    en: [
      { type: 'cmd', text: 'cat profile.txt' },
      { type: 'output', text: 'Electrical Engineering student and Information Security graduate from PUC Minas.' },
      { type: 'output', text: 'Investigative and creative profile, integrating technical reasoning with deep' },
      { type: 'output', text: 'understanding of human behavior and complex systems.' },
      { type: 'output-muted', text: 'Poços de Caldas — MG, Brazil' },
      { type: 'blank' },
      { type: 'cmd', text: 'load highlights' },
      { type: 'output-accent', text: '> Investigative Mindset' },
      { type: 'output', text: '  Systems exploration, traffic analysis, pattern recognition.' },
      { type: 'output-accent', text: '> Independent Execution' },
      { type: 'output', text: '  Self-taught learning and autonomous execution.' },
      { type: 'output-accent', text: '> Discipline & Consistency' },
      { type: 'output', text: '  Boxing, sanda, tennis, strength training — integrated into routine.' },
      { type: 'output-accent', text: '> Cross-Domain Thinking' },
      { type: 'output', text: '  Technology + human behavior + creativity.' },
      { type: 'output-accent', text: '> Multilingual Adaptability' },
      { type: 'output', text: '  PT (native) | EN (fluent) | ES (fluent) | ZH/KO (interested)' },
      { type: 'blank' },
      { type: 'cmd', text: 'load experience' },
      { type: 'output-accent', text: '> Systems Exploration' },
      { type: 'output', text: '  Independent study of systems and applications. Traffic analysis,' },
      { type: 'output', text: '  behavioral understanding, and pattern identification.' },
      { type: 'output-accent', text: '> Cybersecurity Education' },
      { type: 'output', text: '  Logic, networking, compliance, WSS Offensive Security, PUC Minas.' },
      { type: 'output-accent', text: '> Client Support & Service' },
      { type: 'output', text: '  Support Analyst at TOTVS — Linx.' },
      { type: 'output-accent', text: '> Translation & Interpretation' },
      { type: 'output', text: '  Bilateral EN/PT interpreter — private contracts and events (EduX).' },
      { type: 'blank' },
      { type: 'cmd', text: 'load lifestyle' },
      { type: 'output', text: '  Boxing / Sanda  |  Strength Training  |  Tennis' },
      { type: 'output', text: '  Continuous Study  |  Personal Development' },
      { type: 'output-muted', text: '  Discipline and consistency as foundation.' },
      { type: 'blank' },
      { type: 'cmd', text: 'load interests' },
      { type: 'output', text: '  Electronic Music / Synthesizers' },
      { type: 'output', text: '  Systems & Technology' },
      { type: 'output', text: '  Asian Culture (China / Korea)' },
      { type: 'output', text: '  Creative Exploration' },
      { type: 'output', text: '  Personal Development' },
      { type: 'blank' },
      { type: 'cmd', text: 'load leadership' },
      { type: 'output', text: '  Profile oriented toward building and strengthening communities.' },
      { type: 'output', text: '  Bridge between technology and people.' },
      { type: 'output', text: '  Discipline, consistency, and growth mindset.' },
      { type: 'output-muted', text: '  > Promote technology initiatives on campus' },
      { type: 'output-muted', text: '  > Organize meetups, workshops, and study groups' },
      { type: 'output-muted', text: '  > Create simple and accessible tech content' },
      { type: 'output-muted', text: '  > Connect students interested in technology' },
      { type: 'blank' },
      { type: 'cmd', text: 'load community' },
      { type: 'output', text: '  Early stage of public exposure. Focus on strong technical foundation.' },
      { type: 'output', text: '  Lack of social media volume = strategic choice.' },
      { type: 'output-accent', text: '  Low noise. High signal.' },
      { type: 'blank' },
      { type: 'cmd', text: 'ls projects/' },
      { type: 'output-accent', text: '  [carousel] systems_analysis/' },
      { type: 'output', text: '    india_gov_vdp.jpg  |  hackerone_report.jpg' },
      { type: 'output-accent', text: '  [carousel] pattern_recognition/' },
      { type: 'output', text: '    mass_finding.jpg' },
      { type: 'output-accent', text: '  [carousel] certificates/' },
      { type: 'output', text: '    international_diploma.jpg  |  wss_certificate.jpg' },
      { type: 'output-accent', text: '  public_disclosures.link -> hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'cmd', text: 'echo $CONTACT' },
      { type: 'output', text: '  Email    : diegho@dhparadox.com' },
      { type: 'output', text: '  GitHub   : github.com/DhParadox' },
      { type: 'output', text: '  LinkedIn : linkedin.com/in/dhparadox' },
      { type: 'output', text: '  Research : hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'divider', text: '═══════════════════════════════════════════════════' },
      { type: 'output-muted', text: '  session active — DhParadox terminal v3.0' },
    ],
    es: [
      { type: 'cmd', text: 'cat perfil.txt' },
      { type: 'output', text: 'Estudiante de Ingeniería Eléctrica y graduado en Seguridad de la Información por PUC Minas.' },
      { type: 'output', text: 'Perfil investigativo y creativo, integrando razonamiento técnico con comprensión' },
      { type: 'output', text: 'profunda del comportamiento humano y sistemas complejos.' },
      { type: 'output-muted', text: 'Poços de Caldas — MG, Brazil' },
      { type: 'blank' },
      { type: 'cmd', text: 'load destacados' },
      { type: 'output-accent', text: '> Mentalidad Investigativa' },
      { type: 'output', text: '  Exploración de sistemas, análisis de tráfico, reconocimiento de patrones.' },
      { type: 'output-accent', text: '> Ejecución Independiente' },
      { type: 'output', text: '  Aprendizaje autodidacta y ejecución autónoma.' },
      { type: 'output-accent', text: '> Disciplina y Consistencia' },
      { type: 'output', text: '  Boxeo, sanda, tenis, musculación — integrados a la rutina.' },
      { type: 'output-accent', text: '> Pensamiento Transversal' },
      { type: 'output', text: '  Tecnología + comportamiento humano + creatividad.' },
      { type: 'output-accent', text: '> Adaptabilidad Multilingüe' },
      { type: 'output', text: '  PT (nativo) | EN (fluido) | ES (fluido) | ZH/KO (interés)' },
      { type: 'blank' },
      { type: 'cmd', text: 'load experiencia' },
      { type: 'output-accent', text: '> Exploración de Sistemas' },
      { type: 'output', text: '  Estudio independiente de sistemas y aplicaciones. Análisis de tráfico,' },
      { type: 'output', text: '  comprensión comportamental e identificación de patrones.' },
      { type: 'output-accent', text: '> Formación en Ciberseguridad' },
      { type: 'output', text: '  Lógica, redes, cumplimiento, WSS Seguridad Ofensiva, PUC Minas.' },
      { type: 'output-accent', text: '> Soporte y Atención al Cliente' },
      { type: 'output', text: '  Analista de Soporte en TOTVS — Linx.' },
      { type: 'output-accent', text: '> Traducción e Interpretación' },
      { type: 'output', text: '  Intérprete bilateral EN/PT — contratos y eventos (EduX).' },
      { type: 'blank' },
      { type: 'cmd', text: 'load estilo_de_vida' },
      { type: 'output', text: '  Boxeo / Sanda  |  Musculación  |  Tenis' },
      { type: 'output', text: '  Estudio Continuo  |  Desarrollo Personal' },
      { type: 'output-muted', text: '  Disciplina y consistencia como fundamento.' },
      { type: 'blank' },
      { type: 'cmd', text: 'load intereses' },
      { type: 'output', text: '  Música Electrónica / Sintetizadores' },
      { type: 'output', text: '  Sistemas y Tecnología' },
      { type: 'output', text: '  Cultura Asiática (China / Corea)' },
      { type: 'output', text: '  Exploración Creativa' },
      { type: 'output', text: '  Desarrollo Personal' },
      { type: 'blank' },
      { type: 'cmd', text: 'load liderazgo' },
      { type: 'output', text: '  Perfil orientado a la construcción y fortalecimiento de comunidades.' },
      { type: 'output', text: '  Puente entre la tecnología y las personas.' },
      { type: 'output', text: '  Disciplina, constancia y mentalidad de crecimiento.' },
      { type: 'output-muted', text: '  > Promover iniciativas tecnológicas en el campus' },
      { type: 'output-muted', text: '  > Organizar encuentros, talleres o grupos de estudio' },
      { type: 'output-muted', text: '  > Crear contenido tecnológico accesible' },
      { type: 'output-muted', text: '  > Conectar estudiantes interesados en tecnología' },
      { type: 'blank' },
      { type: 'cmd', text: 'load comunidad' },
      { type: 'output', text: '  Fase inicial de exposición pública. Foco en base técnica sólida.' },
      { type: 'output', text: '  Falta de volumen en redes = decisión estratégica.' },
      { type: 'output-accent', text: '  Bajo ruido. Alta señal.' },
      { type: 'blank' },
      { type: 'cmd', text: 'ls proyectos/' },
      { type: 'output-accent', text: '  [carousel] analisis_sistemas/' },
      { type: 'output', text: '    india_gov_vdp.jpg  |  hackerone_informe.jpg' },
      { type: 'output-accent', text: '  [carousel] reconocimiento_patrones/' },
      { type: 'output', text: '    hallazgo_masivo.jpg' },
      { type: 'output-accent', text: '  [carousel] certificados/' },
      { type: 'output', text: '    diploma_internacional.jpg  |  certificado_wss.jpg' },
      { type: 'output-accent', text: '  divulgaciones_publicas.link -> hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'cmd', text: 'echo $CONTACTO' },
      { type: 'output', text: '  Email    : diegho@dhparadox.com' },
      { type: 'output', text: '  GitHub   : github.com/DhParadox' },
      { type: 'output', text: '  LinkedIn : linkedin.com/in/dhparadox' },
      { type: 'output', text: '  Research : hackerone.com/reports/2089895' },
      { type: 'blank' },
      { type: 'divider', text: '═══════════════════════════════════════════════════' },
      { type: 'output-muted', text: '  session active — DhParadox terminal v3.0' },
    ]
  };

  var bootMessages = {
    pt: [
      'inicializando módulos...',
      'carregando perfil...',
      'verificando integridade...',
      'sessão ativa.'
    ],
    en: [
      'initializing modules...',
      'loading profile...',
      'verifying integrity...',
      'session active.'
    ],
    es: [
      'inicializando módulos...',
      'cargando perfil...',
      'verificando integridad...',
      'sesión activa.'
    ]
  };

  function buildTerminal() {
    terminalContent.innerHTML = '';
    var commands = terminalCommands[currentLang] || terminalCommands.en;
    var boot = bootMessages[currentLang] || bootMessages.en;

    var delay = 0;
    var baseDelay = 60;

    boot.forEach(function (msg, i) {
      var line = document.createElement('div');
      line.className = 'term-line output-muted';
      line.textContent = '  ' + msg;
      line.style.animationDelay = delay + 'ms';
      terminalContent.appendChild(line);
      delay += 300;
    });

    var spacer = document.createElement('div');
    spacer.className = 'term-line blank';
    spacer.style.animationDelay = delay + 'ms';
    terminalContent.appendChild(spacer);
    delay += 200;

    commands.forEach(function (cmd) {
      var line = document.createElement('div');
      line.className = 'term-line ' + cmd.type;

      if (cmd.type === 'blank') {
        line.style.animationDelay = delay + 'ms';
        terminalContent.appendChild(line);
        delay += 50;
        return;
      }

      if (cmd.type === 'divider') {
        line.textContent = cmd.text;
        line.style.animationDelay = delay + 'ms';
        terminalContent.appendChild(line);
        delay += 50;
        return;
      }

      if (cmd.type === 'cmd') {
        line.textContent = cmd.text;
        line.style.animationDelay = delay + 'ms';
        terminalContent.appendChild(line);
        delay += 400;
      } else {
        line.textContent = cmd.text;
        line.style.animationDelay = delay + 'ms';
        terminalContent.appendChild(line);
        delay += baseDelay;
      }
    });

    var cursor = document.createElement('div');
    cursor.className = 'term-line cmd';
    cursor.style.animationDelay = delay + 'ms';
    cursor.innerHTML = '<span class="term-cursor"></span>';
    terminalContent.appendChild(cursor);
  }

  function toggleTerminal() {
    terminalActive = !terminalActive;
    terminalToggle.classList.toggle('active', terminalActive);

    body.classList.add('glitch-transition');
    setTimeout(function () { body.classList.remove('glitch-transition'); }, 400);

    if (terminalActive) {
      mainContent.style.display = 'none';
      terminalOverlay.classList.remove('hidden');
      buildTerminal();
    } else {
      terminalOverlay.classList.add('hidden');
      mainContent.style.display = '';
    }
  }

  terminalToggle.addEventListener('click', toggleTerminal);

  /* ========================================
     KEYBOARD: ESC closes modals
     ======================================== */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeImageModal();
      externalModal.classList.add('hidden');
    }
  });

  /* ========================================
     INIT
     ======================================== */

  setLanguage('pt');
  initReveal();
  initActiveNav();
  initMediaFilter();
  initCarousels();
  initImageModal();

})();
