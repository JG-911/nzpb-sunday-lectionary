(function () {
  const row = (window.SUNDAY_DATA || []).find(item => item.id === "A-THE-TWELFTH-SUNDAY-IN-ORDINARY-TIME");
  if (!row) return;
  row.psalm = "Continuous: Psalm 86:1–10, 16–17 Related: NZPB online / standard RCL: Psalm 69:7–10, (11–15), 16–18\nAnnual NZ Lectionaries 2020, 2023 and 2026: Psalm 69:8–11, (12–17), 18–20";
  row.notes = "Reviewed and confirmed 29 August 2026 (JG): NZPB online and the standard RCL give Psalm 69:7–10, (11–15), 16–18. The annual New Zealand Lectionaries checked for 2020, 2023 and 2026 give Psalm 69:8–11, (12–17), 18–20. Both official-source forms are retained. Continuous and Related tracks otherwise differ only in Old Testament and Psalm; shared New Testament and Gospel are shown once.";
  row.verification = "Verified — current data confirmed after review";
  row.secondarySourceUrl = "https://www.anglican.org.nz/content/download/162021/813325/file/2026%20Lectionary%20Final.pdf";
  row.comparisonStatus = "Confirmed source variation";
  row.mismatchDetails = "NZPB online / standard RCL: Psalm 69:7–10, (11–15), 16–18; annual NZ Lectionaries 2020, 2023 and 2026: Psalm 69:8–11, (12–17), 18–20.";
})();

(function () {
  const row = (window.SUNDAY_DATA || []).find(item => item.id === "A-THE-TWENTY-SECOND-SUNDAY-IN-ORDINARY-TIME");
  if (!row) return;
  row.psalm = "Continuous: Psalm 105:1–6, 23–26, 45c Related: Psalm 26:1–8";
  row.notes = "Reviewed and corrected 29 August 2026 (JG): use the NZPB and 2023 Lectionary form, Psalm 105:1–6, 23–26, 45c. The 2026 printing of 44b is recorded as an error. The underlying NZPB link points to 44b, and some external Bible links can only open the whole verse 44 rather than a part-verse.";
  row.verification = "Verified — reviewer correction applied";
  row.secondarySourceUrl = "https://www.anglican.org.nz/content/download/162021/813325/file/2026%20Lectionary%20Final.pdf";
  row.comparisonStatus = "Resolved — 2026 Lectionary error recorded";
  row.mismatchDetails = "NZPB online / 2023 Lectionary: Psalm 105:1–6, 23–26, 45c; 2026 Lectionary: Psalm 105:1–6, 23–26, 44b. NZPB underlying link targets 44b; NLT cannot deep-link to a part-verse.";
})();
