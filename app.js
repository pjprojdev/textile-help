async function loadWorks() {
  const res = await fetch('./works.json');
  const works = await res.json();
  const container = document.getElementById('works');
  container.innerHTML = '';

  works.forEach((w, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="preview">
        <button type="button" data-index="${index}" aria-label="Open preview for ${w.title}">
          <img src="${w.image}" alt="${w.title} preview image">
        </button>
      </div>
      <div class="card-body">
        <h3>${w.title}</h3>
        <p class="meta">${w.medium} • ${w.year}</p>
        <p class="desc">${w.description || 'Preview image only. Full pattern details withheld.'}</p>
      </div>
    `;
    container.appendChild(card);
  });

  container.addEventListener('click', event => {
    const btn = event.target.closest('button[data-index]');
    if (!btn) return;
    const work = works[Number(btn.dataset.index)];
    openViewer(work);
  });
}

const viewer = document.getElementById('viewer');
const viewerImage = document.getElementById('viewerImage');
const viewerCaption = document.getElementById('viewerCaption');
const closeViewerBtn = document.getElementById('closeViewer');

function openViewer(work) {
  viewerImage.src = work.image;
  viewerImage.alt = work.title + ' preview image';
  viewerCaption.textContent = `${work.title} — ${work.medium} — ${work.year}. Preview only; not for reproduction.`;
  viewer.classList.remove('hidden');
  viewer.setAttribute('aria-hidden', 'false');
}

function closeViewer() {
  viewer.classList.add('hidden');
  viewer.setAttribute('aria-hidden', 'true');
  viewerImage.src = '';
}

closeViewerBtn.addEventListener('click', closeViewer);
viewer.addEventListener('click', e => {
  if (e.target === viewer) closeViewer();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeViewer();
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p', 'c'].includes(key)) {
    e.preventDefault();
  }
  if (e.key === 'PrintScreen') {
    e.preventDefault();
  }
});

loadWorks();
