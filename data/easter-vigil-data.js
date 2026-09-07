window.EASTER_VIGIL_DATA = {
  name: "The Great Vigil of Easter",
  timing: "On the evening of Holy Saturday or the early morning of Easter Day.",
  instruction: "Choose at least three Old Testament readings. Always include the Exodus reading and its canticle, Romans and Psalm 114, and the Gospel. Other responses remain paired with their readings.",
  colour: "W",
  dateRule: "Gregorian Easter minus one day (evening), or Easter Day (early morning); not a fixed civil date.",
  sourceUrl: "https://anglicanprayerbook.nz/546.html",
  secondarySourceUrl: "https://www.anglican.org.nz/content/download/162021/813325/file/2026%20Lectionary%20Final.pdf",
  sourcePages: "NZPB 588–592; 2026 Lectionary printed page 58, required entries confirmed visually in bold.",
  oldTestament: [
    { reading: "Genesis 1:1–2:4a", response: "Psalm 136:1–9, 23–26" },
    { reading: "Genesis 7:1–5, 11–18; 8:6–18; 9:8–13", response: "Psalm 46" },
    { reading: "Genesis 22:1–18", response: "Psalm 16" },
    { reading: "Exodus 14:10–31; 15:20–21", response: "Exodus 15:1b–13, 17–18", required: true },
    { reading: "Isaiah 55:1–11", response: "Isaiah 12:2–6" },
    { reading: "Baruch 3:9–15, 32–4:4 or Proverbs 8:1–8, 19–21; 9:4b–6", response: "Psalm 19" },
    { reading: "Ezekiel 36:24–28", response: "Psalm 42 and 43" },
    { reading: "Ezekiel 37:1–14", response: "Psalm 143" },
    { reading: "Zephaniah 3:14–20", response: "Psalm 98" }
  ],
  newTestament: { reading: "Romans 6:3–11", response: "Psalm 114", required: true },
  gospels: { A: "Matthew 28:1–10", B: "Mark 16:1–8", C: "Luke 24:1–12" },
  comparison: "All passages, response pairings and A/B/C Gospels match the supplied Vanderbilt CSVs after harmless notation normalisation. No Psalm-numbering differences found in this Vigil set. NZPB prints Psalm 114 before Romans; the annual layout places Romans in the reading column and Psalm 114 in the response column. This interface follows that paired layout.",
  verification: "Verified against NZPB, annual Lectionary layout and all three supplied Vanderbilt CSVs, 2026-09-06."
};
