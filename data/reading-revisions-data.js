(function () {
  "use strict";
  const rows = [...window.SUNDAY_DATA, ...window.FEAST_DATA, ...window.SAINTS_DATA];
  const find = id => {
    const row = rows.find(item => item.id === id);
    if (!row) throw new Error(`Reading revision target missing: ${id}`);
    return row;
  };
  const source = "https://lectionary.library.vanderbilt.edu/calendar/";
  const audit = window.READING_REVIEW_DATA = [];
  function revise(id, field, value, issue, note) {
    const row = find(id);
    audit.push({ issue, id, field, before: row[field], after: value, status: "User approved", date: "2026-09-06", sourceUrl: source, note });
    row[field] = value;
    row.notes = `${row.notes || ""}\n${issue}: ${note}`.trim();
    row.verification = "Verified — user-approved Vanderbilt correction";
  }
  revise("B-THE-EIGHTEENTH-SUNDAY-IN-ORDINARY-TIME", "ot", "Continuous: 2 Samuel 11:26–12:13a Related: Exodus 16:2–4, 9–15", "V-01", "Use 2 Samuel, not the NZPB online 1 Samuel form.");
  revise("A-THE-TWENTY-NINTH-SUNDAY-IN-ORDINARY-TIME", "psalm", "Continuous: Psalm 99 Related: Psalm 96:1–9, (10–13)", "V-02", "Restore Psalm 96 verses 1–8; the former NZPB online omission is recorded as an error, not an alternative numbering.");
  for (const id of ["A-THE-THIRD-SUNDAY-OF-ADVENT", "B-THE-THIRD-SUNDAY-OF-ADVENT", "B-THE-FOURTH-SUNDAY-OF-ADVENT", "C-THE-FOURTH-SUNDAY-OF-ADVENT"]) {
    revise(id, "psalm", find(id).psalm.replace("Luke 1:47–55", "Luke 1:46b–55"), "V-03", "Use the Vanderbilt Magnificat beginning at Luke 1:46b.");
  }
  revise("ABC-PRESENTATION", "ot", "Malachi 3:1–4", "V-04", "Use the Vanderbilt endpoint, verse 4.");
  revise("ABC-GOOD-FRIDAY", "ot", "Isaiah 52:13–53:12", "V-05", "Use the complete Vanderbilt range, also confirmed in the 2026 NZ Lectionary, printed page 58.");
  revise("B-THE-THIRTEENTH-SUNDAY-IN-ORDINARY-TIME", "ot", "Continuous: 2 Samuel 1:1, 17–27 Related: Wisdom 1:13–15; 2:23–24 or Lamentations 3:22–33", "V-06", "Lamentations is an alternative OT reading, beginning at 3:22, following the user's Vanderbilt decision.");
  revise("B-THE-THIRTEENTH-SUNDAY-IN-ORDINARY-TIME", "psalm", "Continuous: Psalm 130 Related: Psalm 30", "V-06", "Remove the former Lamentations Psalm alternative; its earlier NZPB role/range remains in this audit.");
  revise("A-THE-SIXTEENTH-SUNDAY-IN-ORDINARY-TIME", "ot", "Continuous: Genesis 28:10–19a Related: Wisdom 12:13, 16–19 or Isaiah 44:6–8", "V-07", "Restore Isaiah 44:6–8 as the alternative. User confirms this also appears in the 2023 and 2026 NZ annual Lectionaries; treat the omission as an NZPB reading/extraction issue, not an annual Lectionary error.");
  audit.push({ issue: "V-08", id: "C-THE-SECOND-SUNDAY-IN-LENT", field: "gospel", status: "Retain current — future review", current: find("C-THE-SECOND-SUNDAY-IN-LENT").gospel, vanderbilt: "Luke 13:31–35 or Luke 9:28–36, (37–43a)", note: "User explicitly requested no change. Reconsider the optional extension only in a future approved revision." });
  find("C-THE-SECOND-SUNDAY-IN-LENT").notes += "\nV-08: retain the current Luke 9:28–36 alternative; Vanderbilt's optional 37–43a extension is noted for future review, not adopted.";

  // Bible Gateway must use the Bible numbering, never the NZPB companion line.
  // These labels identify source reference forms; they do not assert that all endpoint
  // differences are proven versification equivalents. Historical explanations stay in the audit.
  function numbered(bible, nzpb) { return bible === nzpb ? bible : `Bible: ${bible}\nNZPB: ${nzpb}`; }
  function psalmPair(id, bible, nzpb, track = "single", otherTrack = "") {
    const row = find(id);
    row.psalmNumbering ||= {};
    row.psalmNumbering[track] = { bible, nzpb, bibleLabel: "Bible Version Numbering", nzpbLabel: "NZPB Psalms numbering", sourceUrl: source };
    const pair = numbered(bible, nzpb);
    row.psalm = track === "related" ? `Continuous: ${otherTrack} Related: ${pair}`
      : track === "continuous" ? `Continuous: ${pair}\nRelated: ${otherTrack}` : pair;
  }
  psalmPair("ABC-ANNUNCIATION", "Psalm 45 or Psalm 40:5–10", "Psalm 45 or Psalm 40:6–13");
  psalmPair("ABC-HOLY-SATURDAY", "Psalm 31:1–4, 15–16", "Psalm 31:1–5, 15–18");
  psalmPair("ABC-HOLY-CROSS", "Psalm 98:1–5 or Psalm 78:1–2, 34–38", "Psalm 98:1–6 or Psalm 78:1–2, 34–38");
  psalmPair("A-THE-TWELFTH-SUNDAY-IN-ORDINARY-TIME", "Psalm 69:7–10, (11–15), 16–18", "Psalm 69:8–11, (12–17), 18–20", "related", "Psalm 86:1–10, 16–17");
  psalmPair("A-THE-TWENTY-SECOND-SUNDAY-IN-ORDINARY-TIME", "Psalm 105:1–6, 23–26, 45b", "Psalm 105:1–6, 23–26, 45c", "continuous", "Psalm 26:1–8");
  for (const row of window.PALM_SUNDAY_DATA) {
    row.psalmNumbering = { bible: "Psalm 31:9–16", nzpb: "Psalm 31:10–18", sourceUrl: source };
    row.passionPsalm = numbered(row.psalmNumbering.bible, row.psalmNumbering.nzpb);
    row.notes += "\nNumbering presentation: Bible follows Vanderbilt/NZPB online; NZPB displays the recorded annual Lectionary form. Both are retained without asserting identical verse boundaries.";
  }
  const names = ["Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth", "Twenty-first", "Twenty-second", "Twenty-third", "Twenty-fourth", "Twenty-fifth", "Twenty-sixth", "Twenty-seventh", "Twenty-eighth", "Twenty-ninth", "Thirtieth", "Thirty-first", "Thirty-second", "Thirty-third", "Thirty-fourth"];
  for (const row of window.SUNDAY_DATA) {
    const index = names.findIndex(name => row.position === `Ordinary ${name}`);
    if (index >= 0) {
      row.ordinaryNumber = index + 6;
      row.properNumber = index + 1;
      row.properSourceUrl = "https://www.commontexts.org/wp-content/uploads/2015/11/RCL_YearA_Web.pdf";
      row.properScope = index < 2 ? "Pre-Lent Epiphany sequence" : index < 4 ? "Pre-Lent Epiphany or post-Trinity sequence" : "Post-Trinity sequence";
      row.properNote = `Ordinary ${row.ordinaryNumber} corresponds to RCL Proper ${row.properNumber}. Before Lent, placement follows the Epiphany sequence. After Trinity, count backwards weekly from Proper 29 on Christ the King, the Sunday before Advent (20–26 November); this is equivalent to the RCL recurring date windows. Easter determines where the post-Trinity sequence resumes. A feast displacing a Sunday does not renumber this or subsequent Propers. Year A/B/C selects the readings independently; no historical civil-year date is fixed to this record.`;
    }
    if (/^Ordinary (Fifth|Sixth|Seventh|Eighth|Ninth|Tenth)$/.test(row.position)) row.earlyRclReview = "2026-09-06: passages match Vanderbilt's complete tables (including unobserved days). Pre-Lent Epiphany 9 uses the Related set; the additional Continuous set belongs to the post-Pentecost proper. No reading changes authorised by this check.";
  }
  audit.push({ issue: "PROPER-EARLY", status: "Review — labels differ", sourceUrl: "https://www.commontexts.org/wp-content/uploads/2015/11/RCL_YearA_Web.pdf", note: "2026 NZ Lectionary printed page 40 labels Ordinary 5 Proper 1. The original CCT RCL table explicitly maps Ordinary 6–9 to Proper 1–4 and gives Ordinary 5 no numbered Proper. User approved standard RCL mapping on 7 September 2026; retain the NZ printed discrepancy for review, not as a calculation rule. No Proper 0 is generated." });
})();
