(() => {
  'use strict';

  const config = window.SITE_CONFIG || {};
  const content = window.SITE_CONTENT || {};
  const data = window.SITE_DATA || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const extra = {
    kk: {
      close: 'Жабу', mainMenu: 'Негізгі мәзір', mobileMenu: 'Мобильді мәзір',
      menu: 'Мәзір', periods: 'Күн кезеңдері', categories: 'Галерея санаттары',
      phonePending: 'Нөмір кейін қосылады', docReady: 'Құжатты ашуға болады',
      docOpen: 'Құжатты ашу', docTitle: 'Құжат әлі қосылған жоқ',
      docText: 'Бұл — құжатқа арналған үлгі орын. Клиент берген нақты файл осы жерге қосылады.',
      privacyTitle: 'Құпиялық туралы', privacyEyebrow: 'ДЕРЕКТЕРІҢІЗ ТУРАЛЫ',
      privacyText: 'Бұл таныстырылымда өтінім мәліметтері серверге жіберілмейді және браузердің тұрақты жадына сақталмайды. Тек таңдаған тіл осы браузерде есте сақталуы мүмкін. Үлгі нұсқада аналитика және жарнамалық бақылау құралдары қолданылмайды.',
      privacyWhatsApp: 'Балабақшаның WhatsApp нөмірі қосылса, сіз хабарламаны қарап, WhatsApp сілтемесін өзіңіз аша аласыз. Сілтемені ашқанда хабарлама WhatsApp қызметіне беріледі; соңғы жіберуді сол қолданбада өзіңіз орындайсыз.',
      programIntro: 'САБАҚ БАҒДАРЛАМАСЫ · ҮЛГІ', activityTitle: 'Не істейміз?',
      programNote: 'Бұл бағдарлама — таныстырылым үлгісі. Нақты сабақтар клиентпен келісіліп толықтырылады.',
      previewTitle: 'Хабарлама үлгісі дайын', previewDemo: 'Бұл — жергілікті алдын ала қарау. Ештеңе жіберілген жоқ. Нақты WhatsApp нөмірі кейін қосылады.',
      previewLive: 'Хабарламаны тексеріп, дайын болсаңыз WhatsApp-та ашыңыз. Сайт оны автоматты түрде жібермейді.',
      openWhatsApp: 'WhatsApp-та ашу', liveFormNote: 'Мәліметтер сақталмайды. Хабарламаны дайындап, WhatsApp-та өзіңіз жібере аласыз.',
      greeting: 'Сәлеметсіз бе! Балабақшамен танысуға жазылғым келеді.',
      parentName: 'Атым', childAge: 'Баланың жасы', years: 'жас', question: 'Сұрағым / ыңғайлы уақыт',
      photo: 'Фото', of: '/', nameError: 'Атыңызды енгізіңіз.',
      title: 'бақытты балалық мекені', footer: 'Таныстырылым нұсқасы.', home: 'басты бет'
    },
    ru: {
      close: 'Закрыть', mainMenu: 'Основное меню', mobileMenu: 'Мобильное меню',
      menu: 'Меню', periods: 'Время дня', categories: 'Категории галереи',
      phonePending: 'Номер будет добавлен позже', docReady: 'Документ доступен для просмотра',
      docOpen: 'Открыть документ', docTitle: 'Документ пока не добавлен',
      docText: 'Это место для документа. Здесь появится настоящий файл, предоставленный клиентом.',
      privacyTitle: 'О конфиденциальности', privacyEyebrow: 'О ВАШИХ ДАННЫХ',
      privacyText: 'В этой демонстрации данные заявки не отправляются на сервер и не сохраняются в постоянной памяти браузера. Браузер может запомнить только выбранный язык. В демоверсии нет аналитики или рекламных трекеров.',
      privacyWhatsApp: 'После добавления номера WhatsApp детского сада вы сможете проверить сообщение и самостоятельно открыть ссылку WhatsApp. При открытии ссылки текст передаётся сервису WhatsApp; окончательную отправку вы выполняете в приложении.',
      programIntro: 'ПРОГРАММА ЗАНЯТИЙ · ПРИМЕР', activityTitle: 'Чем будем заниматься?',
      programNote: 'Это демонстрационная программа. Настоящие занятия будут уточнены вместе с клиентом.',
      previewTitle: 'Черновик сообщения готов', previewDemo: 'Это локальный предпросмотр. Ничего не отправлено. Настоящий номер WhatsApp будет добавлен позже.',
      previewLive: 'Проверьте сообщение и откройте его в WhatsApp, когда будете готовы. Сайт не отправляет его автоматически.',
      openWhatsApp: 'Открыть в WhatsApp', liveFormNote: 'Данные не сохраняются. Подготовьте сообщение и отправьте его самостоятельно в WhatsApp.',
      greeting: 'Здравствуйте! Хочу записаться на знакомство с детским садом.',
      parentName: 'Меня зовут', childAge: 'Возраст ребёнка', years: 'лет', question: 'Вопрос / удобное время',
      photo: 'Фото', of: '/', nameError: 'Введите ваше имя.',
      title: 'место счастливого детства', footer: 'Демонстрационная версия.', home: 'главная'
    }
  };

  let lang = 'kk';
  try { if (localStorage.getItem('balapan-language') === 'ru') lang = 'ru'; } catch (_) {}
  let period = 'morning';
  let galleryFilter = 'all';
  let shownGallery = [];
  let photoIndex = 0;
  let activeProgram = null;
  let infoMode = null;
  const dialogFocus = new WeakMap();
  let previousOverflow = '';
  const t = key => content[lang]?.[key] ?? content.kk?.[key] ?? '';
  const e = key => extra[lang][key] || '';
  const localized = value => typeof value === 'string' ? value : value?.[lang] ?? value?.kk ?? '';
  const element = (tag, value, className) => {
    const node = document.createElement(tag);
    if (value != null) node.textContent = String(value);
    if (className) node.className = className;
    return node;
  };

  // Translation strings permit only two presentation tags; never evaluate HTML.
  function setCopy(node, value) {
    const fragment = document.createDocumentFragment();
    let parent = fragment;
    String(value).split(/(<br\s*\/?\s*>|<\/?em>)/gi).forEach(part => {
      if (/^<br\s*\/?\s*>$/i.test(part)) parent.append(document.createElement('br'));
      else if (/^<em>$/i.test(part)) { const em = document.createElement('em'); parent.append(em); parent = em; }
      else if (/^<\/em>$/i.test(part)) parent = fragment;
      else parent.append(document.createTextNode(part));
    });
    node.replaceChildren(fragment);
  }

  function safeLink(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim(), document.baseURI);
      const relativeLocalFile = url.protocol === 'file:' && location.protocol === 'file:' && !/^[a-z][a-z\d+.-]*:|^[/\\]/i.test(value.trim());
      if (!['https:', 'http:'].includes(url.protocol) && !relativeLocalFile) return null;
      if (url.username || url.password) return null;
      return url.href;
    } catch (_) { return null; }
  }

  function phoneDigits(value) {
    const raw = String(value || '').trim();
    if (!raw || !/^\+?[\d\s()\-]+$/.test(raw)) return '';
    const digits = raw.replace(/\D/g, '');
    return /^[1-9]\d{9,14}$/.test(digits) && !/^(\d)\1+$/.test(digits) ? digits : '';
  }

  function openDialog(dialog, trigger) {
    if (!dialog || dialog.open) return;
    dialogFocus.set(dialog, trigger || document.activeElement);
    if (!$('dialog[open]')) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    dialog.showModal();
  }

  function clearVisit() {
    const form = $('#visit-form');
    form.reset();
    $('#parent-name').setCustomValidity('');
    $('#form-result').replaceChildren();
    $('#form-result').hidden = true;
  }

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    $$('[data-close]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      if (!$('dialog[open]')) document.body.style.overflow = previousOverflow;
      if (dialog.id === 'visit-dialog') clearVisit();
      if (dialog.id === 'info-dialog') { activeProgram = null; infoMode = null; }
      const trigger = dialogFocus.get(dialog);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    });
  });
  $('#info-dialog').setAttribute('aria-labelledby', 'info-title');
  $('#visit-dialog h2').id = 'visit-title';
  $('#visit-dialog').setAttribute('aria-labelledby', 'visit-title');
  $('#lightbox').setAttribute('aria-labelledby', 'lightbox-caption');

  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  function setMenu(open) {
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.classList.toggle('is-open', open);
  }
  menuToggle.addEventListener('click', () => setMenu(mobileNav.hidden));
  $$('a', mobileNav).forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden && !$('dialog[open]')) { setMenu(false); menuToggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 951px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  function renderSchedule() {
    const schedule = $('#schedule');
    const items = data.schedule?.[lang]?.[period] || data.schedule?.kk?.[period] || [];
    const nodes = items.map(item => {
      const row = element('div', null, 'schedule-item');
      const time = element('time', item.time, 'schedule-time');
      if (/^\d{2}:\d{2}$/.test(item.time)) time.dateTime = item.time;
      const copy = element('div');
      copy.append(element('h3', item.title), element('p', item.desc));
      row.append(time, copy);
      return row;
    });
    schedule.replaceChildren(...nodes);
    schedule.setAttribute('aria-labelledby', 'tab-' + period);
    $$('[data-period]').forEach(button => {
      const selected = button.dataset.period === period;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.classList.toggle('active', selected);
    });
  }
  const dayTabs = $$('[data-period]');
  dayTabs.forEach((button, index) => {
    button.addEventListener('click', () => { period = button.dataset.period; renderSchedule(); });
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % dayTabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + dayTabs.length - 1) % dayTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = dayTabs.length - 1;
      if (next == null) return;
      event.preventDefault();
      period = dayTabs[next].dataset.period;
      renderSchedule();
      dayTabs[next].focus();
    });
  });

  function fillInfo(eyebrow, title, nodes) {
    $('#info-eyebrow').textContent = eyebrow;
    $('#info-title').textContent = title;
    $('#info-body').replaceChildren(...nodes);
  }

  function renderProgram(key) {
    const program = data.programs?.[lang]?.[key] || data.programs?.kk?.[key];
    if (!program) return;
    const list = element('ul', null, 'program-activities');
    (program.activities || []).forEach(activity => list.append(element('li', activity)));
    fillInfo(e('programIntro'), program.title, [element('p', program.description), element('h3', e('activityTitle')), list, element('p', e('programNote'), 'section-note')]);
  }
  $$('[data-program]').forEach(button => button.addEventListener('click', () => {
    activeProgram = button.dataset.program;
    infoMode = 'program';
    renderProgram(activeProgram);
    openDialog($('#info-dialog'), button);
  }));

  function renderGallery() {
    shownGallery = (data.gallery || []).filter(photo => galleryFilter === 'all' || photo.category === galleryFilter);
    const cards = shownGallery.map((photo, index) => {
      const button = element('button', null, 'gallery-item');
      button.type = 'button';
      const img = element('img');
      img.src = photo.src;
      img.alt = localized(photo.alt);
      img.loading = 'lazy';
      img.width = 800;
      img.height = 600;
      const zoom = element('span', '+', 'gallery-zoom');
      zoom.setAttribute('aria-hidden', 'true');
      button.append(img, element('span', localized(photo.title), 'gallery-caption'), zoom);
      button.addEventListener('click', () => { photoIndex = index; renderLightbox(); openDialog($('#lightbox'), button); });
      return button;
    });
    const grid = $('#gallery-grid');
    grid.classList.toggle('filtered', galleryFilter !== 'all');
    grid.replaceChildren(...cards);
    $$('[data-filter]').forEach(button => {
      const active = button.dataset.filter === galleryFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => { galleryFilter = button.dataset.filter; renderGallery(); }));
  function renderLightbox() {
    const photo = shownGallery[photoIndex];
    if (!photo) return;
    $('#lightbox-image').src = photo.src;
    $('#lightbox-image').alt = localized(photo.alt);
    $('#lightbox-caption').textContent = `${localized(photo.title)} · ${photoIndex + 1} / ${shownGallery.length}`;
    $('#previous-photo').disabled = shownGallery.length < 2;
    $('#next-photo').disabled = shownGallery.length < 2;
  }
  function stepPhoto(direction) {
    if (!shownGallery.length) return;
    photoIndex = (photoIndex + direction + shownGallery.length) % shownGallery.length;
    renderLightbox();
  }
  $('#previous-photo').addEventListener('click', () => stepPhoto(-1));
  $('#next-photo').addEventListener('click', () => stepPhoto(1));
  $('#lightbox').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(1); }
  });

  const documentTitles = { rules: 'docRules', contract: 'docContract', menu: 'docMenu' };
  function renderDocument(key) {
    const url = safeLink(config.documents?.[key]);
    if (url) {
      const link = element('a', e('docOpen'), 'button button-dark');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      fillInfo(t('docsEyebrow'), t(documentTitles[key]), [link]);
    } else fillInfo(t('docsEyebrow'), t(documentTitles[key]) || e('docTitle'), [element('p', e('docText'))]);
  }
  $$('[data-document]').forEach(button => button.addEventListener('click', () => {
    infoMode = button.dataset.document;
    renderDocument(infoMode);
    openDialog($('#info-dialog'), button);
  }));
  function renderPrivacy() {
    fillInfo(e('privacyEyebrow'), e('privacyTitle'), [element('p', e('privacyText')), element('p', e('privacyWhatsApp'))]);
  }
  $$('[data-privacy]').forEach(button => button.addEventListener('click', () => {
    infoMode = 'privacy';
    renderPrivacy();
    openDialog($('#info-dialog'), button);
  }));

  function renderContact() {
    $('#contact-address').textContent = localized(config.address);
    const phone = $('#contact-phone');
    const digits = phoneDigits(config.phone);
    if (digits) {
      const link = element('a', config.phone);
      link.href = 'tel:+' + digits;
      phone.replaceChildren(link);
    } else phone.textContent = e('phonePending');
    const email = String(config.email || '');
    const emailNode = $('#contact-email');
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/@example\.(com|org|net)$/i.test(email)) {
      const link = element('a', email);
      link.href = 'mailto:' + encodeURIComponent(email).replace(/%40/g, '@');
      emailNode.replaceChildren(link);
    } else emailNode.textContent = email;
    if (phoneDigits(config.whatsapp)) $('#form-notice').textContent = e('liveFormNote');
    $$('[data-document]').forEach(button => {
      if (safeLink(config.documents?.[button.dataset.document])) $('small', button).textContent = e('docReady');
    });
    const name = String(config.name || 'Балапан');
    const brandName = $('.brand > span');
    if (brandName?.firstChild?.nodeType === Node.TEXT_NODE) brandName.firstChild.nodeValue = name.toLocaleLowerCase(lang);
    $('.brand').setAttribute('aria-label', `${name} — ${e('home')}`);
    $('.footer-brand').textContent = '✿ ' + name.toLocaleLowerCase(lang);
    $('[data-i18n="copyright"]').textContent = `© 2026 «${name}». ${e('footer')}`;
    document.title = `${name} — ${e('title')}`;
  }

  $$('[data-visit]').forEach(button => button.addEventListener('click', () => {
    openDialog($('#visit-dialog'), button);
    $('#parent-name').focus({ preventScroll: true });
  }));
  $('#parent-name').addEventListener('input', () => $('#parent-name').setCustomValidity(''));
  $('#visit-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameField = $('#parent-name');
    const name = nameField.value.trim();
    if (!name) { nameField.setCustomValidity(e('nameError')); nameField.reportValidity(); return; }
    if (!form.reportValidity()) return;
    const age = $('#child-age').value;
    const question = $('#visit-message').value.trim();
    const ageUnit = lang === 'ru' && ['2', '3', '4'].includes(age) ? 'года' : e('years');
    const message = [e('greeting'), `${e('parentName')}: ${name}.`, `${e('childAge')}: ${age} ${ageUnit}.`, question ? `${e('question')}: ${question}` : ''].filter(Boolean).join('\n');
    const result = $('#form-result');
    const digits = phoneDigits(config.whatsapp);
    const preview = element('pre', message, 'form-preview');
    preview.style.whiteSpace = 'pre-wrap';
    preview.style.overflowWrap = 'anywhere';
    preview.style.font = 'inherit';
    result.replaceChildren(element('h3', e('previewTitle')), element('p', e(digits ? 'previewLive' : 'previewDemo')), preview);
    if (digits) {
      const link = element('a', e('openWhatsApp'), 'button button-dark');
      link.href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      result.append(link);
    }
    result.hidden = false;
    result.tabIndex = -1;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  function setLanguage(next, persist = true) {
    lang = next === 'ru' ? 'ru' : 'kk';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(node => { const value = t(node.dataset.i18n); if (value) setCopy(node, value); });
    $$('[data-alt]').forEach(node => { const value = t(node.dataset.alt); if (value) node.alt = value; });
    $$('[data-placeholder]').forEach(node => { const value = t(node.dataset.placeholder); if (value) node.placeholder = value; });
    $$('[data-lang]').forEach(button => {
      const selected = button.dataset.lang === lang;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-close]').forEach(button => button.setAttribute('aria-label', e('close')));
    menuToggle.setAttribute('aria-label', e('menu'));
    $('.desktop-nav').setAttribute('aria-label', e('mainMenu'));
    mobileNav.setAttribute('aria-label', e('mobileMenu'));
    $('.day-tabs').setAttribute('aria-label', e('periods'));
    $('.gallery-filters').setAttribute('aria-label', e('categories'));
    renderContact();
    renderSchedule();
    renderGallery();
    if ($('#lightbox').open) renderLightbox();
    if ($('#info-dialog').open) {
      if (activeProgram) renderProgram(activeProgram);
      else if (infoMode === 'privacy') renderPrivacy();
      else if (infoMode) renderDocument(infoMode);
    }
    $('#form-result').replaceChildren();
    $('#form-result').hidden = true;
    if (persist) { try { localStorage.setItem('balapan-language', lang); } catch (_) {} }
  }
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  setLanguage(lang, false);
})();
