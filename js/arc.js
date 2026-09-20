/**
 * صفحة الآرك الفردي
 * تصميم وبرمجة: عبد الباسط خدومة
 */

(function () {
  const contentEl = document.getElementById('arcContent');

  // استخراج الـ id من الرابط
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  const arc = ARCS.find(a => a.id === id);

  if (!arc) {
    contentEl.innerHTML = `
      <div class="arc-header">
        <h1>الآرك غير موجود</h1>
      </div>
      <p>عذراً، لم يتم العثور على هذا الآرك. <a href="index.html" style="color:var(--accent)">العودة للرئيسية</a></p>
    `;
    document.title = 'غير موجود | ملخصات الأنمي';
    return;
  }

  // تحديث العنوان
  document.title = `${arc.title} | ملخصات الأنمي`;

  // رسم المحتوى
  contentEl.innerHTML = `
    <header class="arc-header">
      <span class="arc-number">آرك ${arc.number}</span>
      <h1>${escapeHtml(arc.title)}</h1>
      <div class="arc-meta">
        <span>${escapeHtml(arc.episodes)}</span>
        ${arc.year ? `<span>${escapeHtml(arc.year)}</span>` : ''}
      </div>
    </header>
    <div class="arc-body">
      ${arc.content}
    </div>
  `;

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
})();
