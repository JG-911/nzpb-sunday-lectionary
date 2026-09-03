window.LITURGICAL_COLOUR_DATA = {
  sourceUrl: "https://www.anglican.org.nz/content/download/162021/813325/file/2026%20Lectionary%20Final.pdf",
  rulesSourceUrl: "https://www.anglican.org.nz/content/download/132309/664686/file/2025%20LECTIONARY%20FOR%20WEBSITE%20Oct24.pdf",
  codes: {
    W: { name: "White", css: "white" },
    R: { name: "Red", css: "red" },
    V: { name: "Violet", css: "violet" },
    G: { name: "Green", css: "green" },
    NONE: { name: "No coloured hangings", css: "none" }
  },
  classifications: {
    ourLordOrMary: { code: "W", label: "Festival of Our Lord or the Blessed Virgin Mary" },
    nonMartyrSaint: { code: "W", label: "Saint not venerated as a martyr" },
    apostleOrMartyr: { code: "R", label: "Apostle, evangelist or saint venerated as a martyr" },
    churchFestival: { code: "W", label: "Festival celebrating the life of the Church" },
    conversionOfPaul: { code: "W", label: "Conversion of St Paul — authorised festival classification" },
    johnBaptist: { code: "W", label: "Nativity festival of St John the Baptist" },
    holyCross: { code: "R", label: "Holy Cross Day — authorised special provision" },
    adventLent: { code: "V", label: "Advent or Lent" },
    holyWeek: { code: "R", label: "Holy Week" },
    maundyCommunion: { code: "W", label: "Holy Communion on Maundy Thursday" },
    goodFriday: { code: "R", label: "Good Friday — hangings removed; red for the Liturgy" },
    noHangings: { code: "NONE", label: "Holy Saturday outside the Easter Vigil — all hangings removed" },
    easter: { code: "W", label: "Easter festal period" },
    pentecost: { code: "R", label: "Pentecost and the gift of the Holy Spirit" },
    trinity: { code: "W", label: "Trinity Sunday" },
    tePouhere: { code: "W", label: "Te Pouhere Sunday — authorised annual provision" },
    allSaints: { code: "W", label: "All Saints’ Day" },
    allSouls: { code: "V", optionalCode: "W", label: "Commemoration of the Faithful Departed — violet or white; black is also permitted by the general provision" },
    christKing: { code: "W", label: "Festival of Our Lord — Christ the King" }
  },
  observanceClassifications: {
    "Christmas Day": "ourLordOrMary", "The Naming of Jesus": "ourLordOrMary", "The Epiphany": "ourLordOrMary",
    "The Presentation of Jesus in the Temple": "ourLordOrMary", "The Annunciation of our Saviour to the Blessed Virgin Mary": "ourLordOrMary",
    "Baptism of the Lord": "ourLordOrMary", "Palm Sunday": "holyWeek", "Easter Day": "easter", "Ascension Day": "ourLordOrMary",
    "The Day of Pentecost": "pentecost", "Trinity Sunday": "trinity", "Te Pouhere Sunday": "tePouhere",
    "The Transfiguration of the Beloved Son": "ourLordOrMary", "All Saints’ Day": "allSaints", "All Souls’ Day": "allSouls",
    "Christ the King (or The Reign of Christ) Sunday": "christKing", "Ash Wednesday": "adventLent",
    "Monday in Holy Week": "holyWeek", "Tuesday in Holy Week": "holyWeek", "Wednesday in Holy Week": "holyWeek",
    "Maundy Thursday": "maundyCommunion", "Good Friday": "goodFriday", "Holy Saturday": "noHangings",
    "The Conversion of St Paul": "conversionOfPaul", "St Joseph of Nazareth": "nonMartyrSaint", "St Mark the Evangelist": "apostleOrMartyr",
    "St Philip and St James, Apostles": "apostleOrMartyr", "St Matthias the Apostle": "apostleOrMartyr",
    "The Visitation of Mary to Elizabeth": "ourLordOrMary", "St Barnabas the Apostle": "apostleOrMartyr", "St John the Baptist": "johnBaptist",
    "St Peter and St Paul, Apostles, Martyrs": "apostleOrMartyr", "St Mary Magdalene": "nonMartyrSaint",
    "St James and St John, Apostles": "apostleOrMartyr", "St Mary, the Mother of Jesus": "ourLordOrMary",
    "St Bartholomew (Nathanael), Apostle": "apostleOrMartyr", "The Builders of the Anglican Church in Aotearoa, New Zealand and Polynesia": "churchFestival",
    "Holy Cross Day": "holyCross", "St Matthew, Apostle, Evangelist": "apostleOrMartyr", "St Michael and All Angels": "nonMartyrSaint",
    "St Luke the Evangelist": "apostleOrMartyr", "St James of Jerusalem": "apostleOrMartyr", "St Simon and St Jude, Apostles": "apostleOrMartyr",
    "St Andrew, Apostle, Martyr": "apostleOrMartyr", "St Thomas the Apostle": "apostleOrMartyr", "St Stephen, the first Martyr": "apostleOrMartyr",
    "St John, the Evangelist": "nonMartyrSaint", "The Holy Innocents": "apostleOrMartyr"
  },
  sundayOverrides: {
    "Christmas Day": "W",
    "The Naming of Jesus": "W",
    "The Epiphany": "W",
    "The Presentation of Jesus in the Temple": "W",
    "The Annunciation of our Saviour to the Blessed Virgin Mary": "W",
    "Baptism of the Lord": "W",
    "Palm Sunday": "R",
    "Easter Day": "W",
    "Ascension Day": "W",
    "The Day of Pentecost": "R",
    "Trinity Sunday": "W",
    "Te Pouhere Sunday": "W",
    "The Transfiguration of the Beloved Son": "W",
    "All Saints’ Day": "W",
    "Christ the King (or The Reign of Christ) Sunday": "W"
  },
  principalFeastColours: {
    "Christmas Day": "W",
    "The Naming of Jesus": "W",
    "The Epiphany": "W",
    "The Presentation of Jesus in the Temple": "W",
    "The Annunciation of our Saviour to the Blessed Virgin Mary": "W",
    "Ascension Day": "W",
    "The Day of Pentecost": "R",
    "Trinity Sunday": "W",
    "The Transfiguration of the Beloved Son": "W",
    "All Saints’ Day": "W"
  },
  annualEvidence: {
    "2023-06-11": { primary: "W", sourceYear: 2023, note: "Te Pouhere Sunday is printed with W." },
    "2023-07-02": { primary: "G", evening: "R", eveningFor: "St Thomas the Apostle", sourceYear: 2023, note: "The second capital R is printed beneath G for the First Evensong of St Thomas on the following day." },
    "2025-06-22": { primary: "W", sourceYear: 2025, note: "Te Pouhere Sunday is printed with W." },
    "2025-11-23": { primary: "W", optional: "R", optionalBracketed: true, sourceYear: 2025, note: "Christ the King is printed W with [R], the permitted red alternative after All Saints." }
  },
  interpretation: {
    primary: "The capital letter for the Sunday, major feast or holy day.",
    commemoration: "A lower-case letter applies only when the lesser commemoration is celebrated.",
    evening: "A second capital letter may apply in the evening as the First Evensong of the following major feast.",
    bracketed: "A bracketed capital is an authorised alternative, not a second simultaneous colour."
  }
};

[...(window.FEAST_DATA || []), ...(window.SAINTS_DATA || [])].forEach(row => {
  const classificationKey = window.LITURGICAL_COLOUR_DATA.observanceClassifications[row.name];
  const classification = window.LITURGICAL_COLOUR_DATA.classifications[classificationKey];
  if (!classification) return;
  row.liturgicalColourCode = classification.code;
  row.liturgicalColourClassification = classification.label;
  row.liturgicalColourSourceUrl = window.LITURGICAL_COLOUR_DATA.rulesSourceUrl;
  row.liturgicalColourVerification = "Determined from the authorised classification; checked against the 2026 annual day entry.";
});
