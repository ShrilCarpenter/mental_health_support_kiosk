/**
 * Campus Sanctuary – Counseling Page Controller
 * Handles: service selection, time slot selection, note char counter, voucher generation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const pc = window._playChime || (() => {});

  let selectedService = 'Book an Appointment';
  let selectedTime = 'Morning (8 AM – 12 PM)';

  // ── Service Cards ─────────────────────────────────────────────────────────
  document.querySelectorAll('.counseling-card').forEach(card => {
    card.addEventListener('click', () => {
      pc(320, 0.08, 'triangle');
      document.querySelectorAll('.counseling-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
      card.classList.add('selected');
      card.setAttribute('aria-checked','true');
      selectedService = card.dataset.counseling;
    });
  });

  // ── Time Slots ────────────────────────────────────────────────────────────
  document.querySelectorAll('.time-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pc(320, 0.08, 'triangle');
      document.querySelectorAll('.time-slot-btn').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-checked','false'); });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked','true');
      selectedTime = btn.dataset.time;
    });
  });

  // ── Note Counter ──────────────────────────────────────────────────────────
  const noteInput   = document.getElementById('counselingNoteInput');
  const noteCounter = document.getElementById('noteCharCounter');
  if (noteInput && noteCounter) {
    noteInput.addEventListener('input', () => { noteCounter.textContent = `${noteInput.value.length} / 250`; });
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal(id)  { document.getElementById(id)?.classList.add('active'); }
  function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o && o.id !== 'modalInactivity') closeModal(o.id); });
  });

  // ── Generate Pass ─────────────────────────────────────────────────────────
  const btnSubmit = document.getElementById('btnSubmitCounselingPass');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      pc(660, 0.6);
      const code = `BVM-WELL-${Math.floor(1000 + Math.random() * 9000)}`;
      const ticketEl  = document.getElementById('voucherTicketCode');
      const serviceEl = document.getElementById('voucherServiceDisplay');
      const timeEl    = document.getElementById('voucherTimeDisplay');
      if (ticketEl)  ticketEl.textContent  = code;
      if (serviceEl) serviceEl.textContent = selectedService;
      if (timeEl)    timeEl.textContent    = selectedTime;
      openModal('modalVoucher');
    });
  }

  // ── Voucher Modal Buttons ─────────────────────────────────────────────────
  document.getElementById('btnCloseVoucher')?.addEventListener('click', () => closeModal('modalVoucher'));
  document.getElementById('btnPrintVoucher')?.addEventListener('click', () => window.print());
  document.getElementById('btnFinishVoucherSession')?.addEventListener('click', () => {
    closeModal('modalVoucher');
    if (noteInput) noteInput.value = '';
    if (noteCounter) noteCounter.textContent = '0 / 250';
    window.location.href = 'index.html';
  });
});
