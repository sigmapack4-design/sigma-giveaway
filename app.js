// SIGMA PACK VIP Giveaway — entry form + copy link + live counter
(function(){
  const API = 'https://tallu-broq-api.vercel.app/api/giveaway';
  const LINK = 'https://whatsapp.com/channel/0029VbE0bx5BKfhvceuZrE1I';
  const $ = id => document.getElementById(id);
  let shotData = '';

  /* live entry count */
  fetch(API + '?count=1').then(r => r.json()).then(j => {
    if (j && j.ok) $('entryCount').textContent = j.count;
  }).catch(() => { $('entryCount').textContent = '0'; });

  /* copy link */
  function copyLink(msgEl){
    const done = () => { if (msgEl) msgEl.textContent = '✓ Link copied! Ab isay kisi dost ya group mein bhej kar screenshot lein.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(LINK).then(done).catch(() => fallback());
    } else fallback();
    function fallback(){
      const inp = $('channelLink'); inp.select(); inp.setSelectionRange(0, 9999);
      try { document.execCommand('copy'); } catch(e){}
      done();
    }
  }
  $('copyBtn').addEventListener('click', () => copyLink($('copyMsg')));
  $('copyTop').addEventListener('click', () => {
    copyLink($('copyMsg'));
    document.querySelector('.linkbox').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* screenshot select + compress (max 1100px, JPEG) */
  $('fShot').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1100 / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      shotData = cv.toDataURL('image/jpeg', 0.8);
      const pv = $('shotPreview');
      pv.src = shotData; pv.style.display = 'block';
      $('uploadText').textContent = '✓ Screenshot selected — tap to change';
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  });

  /* submit */
  $('entryForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('formErr');
    const name = $('fName').value.trim();
    const gmail = $('fGmail').value.trim().toLowerCase();
    const city = $('fCity').value.trim();
    const whatsapp = $('fWhatsapp').value.replace(/[^\d]/g, '');
    if (name.length < 3) { err.textContent = 'Please enter your full name.'; return; }
    if (!/^[^\s@]+@gmail\.com$/.test(gmail)) { err.textContent = 'Please enter a valid Gmail address (must end with @gmail.com).'; return; }
    if (city.length < 2) { err.textContent = 'Please enter your city.'; return; }
    if (whatsapp.length < 10 || whatsapp.length > 15) { err.textContent = 'Please enter a valid WhatsApp number.'; return; }
    if (!shotData) { err.textContent = 'Please upload the screenshot of the link you shared.'; return; }
    err.textContent = '';
    const btn = $('submitBtn');
    btn.disabled = true; btn.textContent = 'Submitting… please wait';
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gmail, city, whatsapp, image: shotData })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Something went wrong.');
      $('formCard').style.display = 'none';
      const sc = $('successCard');
      sc.style.display = 'block';
      $('successId').textContent = 'Your Entry ID: ' + j.id + ' • Total entries: ' + j.total;
      sc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (ex) {
      err.textContent = ex.message || 'Server se rabta nahi ho saka — dobara try karein.';
      btn.disabled = false; btn.textContent = 'Submit My Entry 🎁';
    }
  });

  /* reveal animations */
  function revealCheck(){
    document.querySelectorAll('.rv:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', revealCheck, { passive: true });
  revealCheck();
  setTimeout(revealCheck, 400);
})();
