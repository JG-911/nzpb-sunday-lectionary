window.PRECEDENCE_AUDIT_DATA = [
  {
    id: "principal-feasts-2024",
    status: "Confirmed",
    scope: "Automatic Sunday precedence",
    observances: [
      "Christmas Day", "The Naming of Jesus", "The Epiphany", "The Baptism of Christ",
      "The Presentation of Jesus in the Temple", "The Annunciation of our Saviour to the Blessed Virgin Mary",
      "Easter Day", "Ascension Day", "The Day of Pentecost", "Trinity Sunday",
      "The Transfiguration of the Beloved Son", "All Saints’ Day"
    ],
    rule: "These are Principal Feasts under the 2024 General Synod Appendix B and their liturgical provision is not displaced by another celebration. The Annunciation uses its stated transfer exception.",
    sourceUrl: "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf"
  },
  {
    id: "principal-holy-days-2024",
    status: "Confirmed",
    scope: "Automatic day precedence",
    observances: ["Ash Wednesday", "Maundy Thursday", "Good Friday"],
    rule: "These Principal Holy Days and their liturgical provision are not displaced by another celebration.",
    sourceUrl: "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf"
  },
  {
    id: "calendar-online-version-variance",
    status: "Confirmed — 2024 General Synod Appendix B governs current precedence",
    scope: "NZPB online hierarchy",
    observances: ["The Naming of Jesus", "The Baptism of Christ", "The Presentation of Jesus in the Temple", "The Annunciation of our Saviour to the Blessed Virgin Mary", "The Transfiguration of the Beloved Son", "All Saints’ Day"],
    rule: "The online NZPB Calendar page still shows the older short Principal Feast list and places these names under Other Feasts and Holy Days. The 2024 General Synod Appendix B explicitly promotes them to Principal Feasts and is used for current precedence.",
    reviewNote: "Confirmed 29 August 2026 (JG): General Synod updated the emphasis on Principal Feasts; the NZPB website appears not to have received the corresponding hierarchy update.",
    sourceUrl: "https://anglicanprayerbook.nz/007.html"
  },
  {
    id: "transfiguration-2023-transfer",
    status: "Confirmed with historical 2023 annual exception retained",
    scope: "Historical annual Lectionary wording",
    observances: ["The Transfiguration of the Beloved Son"],
    rule: "The 2023 Lectionary prints Ordinary 18 under ‘If The Transfiguration is transferred to Monday’, while both the 2014 and 2024 precedence appendices list Transfiguration as a Principal Feast that should not be displaced. Retain both provisions and seek clarification on the annual transfer wording.",
    reviewNote: "Confirmed 29 August 2026 (JG): when Transfiguration falls on Sunday it is celebrated on that Sunday; it may also be transferred to a Sunday where the rules permit. The 2023 Monday wording remains recorded as a historical annual exception.",
    sourceUrl: "https://anglican.org.nz/content/download/115502/580508/version/1/file/2023%2BLectionary%2BYear%2BA.pdf"
  },
  {
    id: "festival-sunday-choice",
    status: "Confirmed — transfer warnings implemented; explicit keep-on-Sunday choice remains pending",
    scope: "Saints and other Festivals on Sunday",
    observances: ["All listed Festivals"],
    rule: "A Festival falling on Sunday may be kept that day or transferred to Monday or the next suitable weekday, but not observed on a Sunday in Advent, Lent or Eastertide. The interface defaults to transfer and does not override the Sunday unless the Festival is specifically selected.",
    reviewNote: "Confirmed 29 August 2026 (JG): the local keep-on-Sunday choice commonly concerns a parish patronal festival and may replace the Ordinary Sunday provision where permitted.",
    sourceUrl: "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf"
  },
  {
    id: "festival-principal-collision",
    status: "Confirmed and implemented",
    scope: "Festival collision with a higher observance",
    observances: ["All listed Festivals"],
    rule: "When a Festival's official or authorised alternative date is occupied by a Principal Feast, Principal Holy Day, protected Sunday/period or another appointed Festival, the Calendar flags the collision and searches forward for the first suitable weekday. Every skipped date is retained in the transfer chain so the user can see why the observed date moved.",
    sourceUrl: "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf"
  },
  {
    id: "local-celebrations",
    status: "Confirmed — explicit local choice required",
    scope: "Patronal, dedication and harvest observances",
    observances: ["Local patronal feast", "Dedication festival", "Harvest Thanksgiving"],
    rule: "These may replace a Sunday only by an explicit local choice and subject to the protected Sundays and Principal Feast restrictions in Appendix B. They are not yet generated automatically by the interface.",
    reviewNote: "Confirmed 29 August 2026 (JG): apply the same explicit local-choice treatment used for patronal festivals.",
    sourceUrl: "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf"
  },
  {
    id: "all-souls-rank",
    status: "Confirmed — full proper without Sunday precedence",
    scope: "All Souls’ Day / Commemoration of the Faithful Departed",
    observances: ["All Souls’ Day"],
    rule: "NZPB lists All Souls’ Day on 2 November and supplies a complete proper. Annual Lectionaries print it as a bold special day, but it is not named among the Principal Feasts, Principal Holy Days or Festivals in the 2024 Appendix. It never displaces a Sunday; when 2 November is Sunday, the provision moves to Monday or the next suitable weekday.",
    reviewNote: "Confirmed 29 August 2026 (JG): All Souls may be celebrated but cannot displace a Sunday and moves to the nearest suitable weekday.",
    sourceUrl: "https://anglicanprayerbook.nz/546.html"
  },
  {
    id: "te-pouhere-collision",
    status: "Confirmed — optional designated-Sunday provision",
    scope: "Designated Sunday",
    observances: ["Te Pouhere Sunday"],
    rule: "Te Pouhere is a General Synod-designated Sunday, not a Principal Feast and does not itself acquire precedence. Its dedicated provision is offered only when selected and remains separate from the underlying Ordinary Sunday; annual collision details continue to be retained.",
    reviewNote: "Confirmed 29 August 2026 (JG): designated status does not confer precedence; show Te Pouhere only as a user-selected alternative to the underlying Sunday.",
    sourceUrl: "https://anglican.org.nz/Resources/Worship-Resources-Karakia-ANZPB-HKMOA/Lectionary-and-Related"
  }
];
