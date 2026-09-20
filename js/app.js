/**
 * الصفحة الرئيسية - عرض الأرك + البحث
 * تصميم وبرمجة: عبد الباسط خدومة
 */

(function () {
  const grid = document.getElementById('arcsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const arcsCount = document.getElementById('arcsCount');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  // عدد الأرك
  if (arcsCount) {
    arcsCount.textContent = ARCS.length;
  }

  // رسم البطاقات
  function renderArcs(list) {
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    grid.innerHTML = list.map(arc => `
      <a href="arc.html?id=${arc.id}" class="arc-card">
        <span class="arc-number">آرك ${arc.number}</span>
        <h3 class="arc-title">${escapeHtml(arc.title)}</h3>
        <div class="arc-meta">
          <span>${escapeHtml(arc.episodes)}</span>
          ${arc.year ? `<span>${escapeHtml(arc.year)}</span>` : ''}
        </div>
        <p class="arc-excerpt">${escapeHtml(arc.excerpt)}</p>
        <span class="arc-link">اقرأ الملخص ←</span>
      </a>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // البحث
  function filterArcs(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      renderArcs(ARCS);
      return;
    }
    const filtered = ARCS.filter(arc =>
      arc.title.toLowerCase().includes(q) ||
      arc.excerpt.toLowerCase().includes(q) ||
      arc.number.includes(q) ||
      (arc.episodes && arc.episodes.toLowerCase().includes(q))
    );
    renderArcs(filtered);
  }

  // أحداث
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterArcs(e.target.value);
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // التشغيل الأولي
  renderArcs(ARCS);

  // تسجيل Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .catch(err => console.log('SW registration failed:', err));
    });
  }
})();
