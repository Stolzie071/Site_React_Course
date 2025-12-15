// Minimal JS: active nav + modal (no animations)
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

/* ===== Active nav highlight ===== */
const links = $$(".nav__link");
const sections = links
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActiveNav() {
  const y = window.scrollY + 120; // compensate topbar
  let activeId = sections[0]?.id;

  for (const sec of sections) {
    if (sec.offsetTop <= y) activeId = sec.id;
  }

  links.forEach(a => {
    const id = a.getAttribute("href").replace("#", "");
    a.classList.toggle("is-active", id === activeId);
  });
}
window.addEventListener("scroll", setActiveNav, { passive: true });
window.addEventListener("load", setActiveNav);

/* ===== Modal ===== */
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

function openModal(kind) {
  if (!modal) return;

  if (kind === "program") {
    modalTitle.textContent = "Полная программа (PDF)";
    modalBody.innerHTML = `
      <p style="margin:0;color:rgba(234,240,255,.75);line-height:1.65">
        Здесь обычно будет ссылка на PDF. В учебном макете можно приложить файл/ссылку позже.
      </p>
      <div class="note">
        <b style="color:rgba(234,240,255,.9)">Что внутри:</b>
        <ul class="mlist">
          <li>12 недель: темы + результаты каждой недели</li>
          <li>3 проекта и критерии качества</li>
          <li>чек-листы по GitHub/портфолио</li>
          <li>как готовиться к собесам</li>
        </ul>
      </div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn--primary btn--lg" data-modal="apply">Хочу на поток</button>
        <button class="btn btn--ghost btn--lg" id="fakeDownload">Скачать (макет)</button>
      </div>
    `;
  }

  if (kind === "apply") {
    modalTitle.textContent = "Запись на поток";
    modalBody.innerHTML = `
      <p style="margin:0;color:rgba(234,240,255,.75);line-height:1.65">
        Оставь контакт — мы уточним цель и посоветуем тариф. (Это демо-форма.)
      </p>
      <form id="modalLead" style="margin-top:12px;display:grid;gap:12px">
        <label class="field">
          <span class="field__label">Имя</span>
          <input class="input" name="name" placeholder="Имя" />
        </label>
        <label class="field">
          <span class="field__label">Телеграм или телефон</span>
          <input class="input" name="contact" placeholder="@username или +7…" />
        </label>
        <button class="btn btn--primary btn--xl" type="submit">
          Отправить заявку
          <span class="btn__hint">учебный макет</span>
        </button>
        <div class="form__fineprint">Никаких реальных отправок — только UI.</div>
      </form>
    `;
  }

  // Show modal
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function closeModal() {
  if (!modal) return;
  if (typeof modal.close === "function") modal.close();
  else modal.removeAttribute("open");
}

$$("[data-modal]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const kind = btn.getAttribute("data-modal");
    // If clicked inside modal body, allow nested open (swap content)
    openModal(kind);
  });
});

modalClose?.addEventListener("click", closeModal);

// Close on backdrop click
modal?.addEventListener("click", (e) => {
  const rect = $(".modal__panel", modal)?.getBoundingClientRect();
  if (!rect) return;
  const inPanel =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inPanel) closeModal();
});

// Demo form handlers
document.addEventListener("submit", (e) => {
  if (e.target?.id === "leadForm" || e.target?.id === "modalLead") {
    e.preventDefault();
    alert("Заявка (демо) принята 🙂\nВ реальном проекте тут будет отправка на сервер/CRM.");
    closeModal();
  }
});

// Fake download
document.addEventListener("click", (e) => {
  if (e.target?.id === "fakeDownload") {
    alert("Это учебный макет: подключи реальный PDF/ссылку, когда будет готово.");
  }
});

// Ensure background covers full document height (useful for HTML-to-Design imports)
function syncBgHeight() {
  const bg = document.querySelector(".bg");
  if (!bg) return;
  const h = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  );
  bg.style.height = h + "px";
}

window.addEventListener("load", syncBgHeight);
window.addEventListener("resize", syncBgHeight);
