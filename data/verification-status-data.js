// Reconcile legacy extraction labels with the accepted project baseline.
// This is a metadata correction, not a fresh source-by-source verification.
(function () {
  for (const row of window.SUNDAY_DATA || []) {
    if (row.verification !== 'Pending') continue;
    row.originalVerification = row.verification;
    row.verification = 'Accepted baseline — legacy extraction status reconciled';
    row.verificationBasis = 'PROJECT_CONTINUITY.md records the Sunday catalogue as verified. Explicit reviewed corrections remain in sunday-variations-data.js; this reconciliation does not independently reverify readings.';
    row.verificationReconciledOn = '2026-09-06';
  }
})();
