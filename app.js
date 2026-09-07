import { LectionaryCore as core } from "./lectionary-core.js?v=56";

(function () {
  "use strict";

  const data = [...(window.SUNDAY_DATA || []), ...(window.FEAST_DATA || []), ...(window.SAINTS_DATA || [])];
  let today = core.cloneDate(new Date());
  const FESTIVAL_CHOICE_STORAGE_KEY = "nzpb-lectionary-festival-choices-v1";
  const PRINCIPAL_CHOICE_STORAGE_KEY = "nzpb-lectionary-principal-choices-v1";
  const BIBLE_GATEWAY_BASE = "https://www.biblegateway.com/passage/";

  function loadFestivalChoices() {
    try {
      const saved = JSON.parse(localStorage.getItem(FESTIVAL_CHOICE_STORAGE_KEY) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch (_error) {
      return {};
    }
  }

  function loadPrincipalChoices() {
    try {
      const saved = JSON.parse(localStorage.getItem(PRINCIPAL_CHOICE_STORAGE_KEY) || "{}");
      return Object.fromEntries(Object.entries(saved || {}).filter(([key, value]) =>
        /^(epiphany|presentation|allSaints)-\d{4}$/.test(key) && ["date", "sunday"].includes(value)));
    } catch (_error) { return {}; }
  }

  function savePrincipalChoices() {
    try { localStorage.setItem(PRINCIPAL_CHOICE_STORAGE_KEY, JSON.stringify(state.feastPlacement)); } catch (_error) { /* Device storage may be unavailable. */ }
  }

  const state = {
    selected: today,
    month: new Date(today.getFullYear(), today.getMonth(), 1, 12),
    direction: "next",
    feastPlacement: loadPrincipalChoices(),
    festivalChoices: loadFestivalChoices(),
    festivalChoiceContext: null,
    festivalReadingOverride: null,
    trackMode: "continuous",
    optionalChoices: {},
    bibleVersion: "NRSVA",
    underlyingTrackMode: "continuous"
  };

  function calendarPreferences() { return { ...state.feastPlacement, ...state.festivalChoices }; }
  function saveFestivalChoices() {
    try { localStorage.setItem(FESTIVAL_CHOICE_STORAGE_KEY, JSON.stringify(state.festivalChoices)); } catch (_error) { /* Browser storage may be unavailable. */ }
  }

  function refreshFestivalChoices() {
    const saved = loadFestivalChoices();
    const principal = loadPrincipalChoices();
    const currentDay = core.cloneDate(new Date());
    if (JSON.stringify(saved) === JSON.stringify(state.festivalChoices)
      && JSON.stringify(principal) === JSON.stringify(state.feastPlacement)
      && core.sameDate(today, currentDay)) return;
    today = currentDay;
    state.festivalChoices = saved;
    state.feastPlacement = principal;
    render();
  }

  const $ = id => document.getElementById(id);
  const elements = {
    todayButton: $("today-button"), adjustment: $("date-adjustment"),
    adjustmentText: $("date-adjustment-text"), previousMode: $("previous-mode"), nextMode: $("next-mode"),
    transferChoice: $("transfer-choice"), transferChoiceText: $("transfer-choice-text"), calendarDateMode: $("calendar-date-mode"), assignedSundayMode: $("assigned-sunday-mode"),
    previousMonth: $("previous-month"), nextMonth: $("next-month"), monthTitle: $("month-title"), monthSelect: $("month-select"), yearSelect: $("year-select"),
    calendar: $("calendar-grid"),
    notice: $("notice"), resolvedDate: $("resolved-date"), sundayName: $("sunday-name"),
    sundaySubheading: $("sunday-subheading"), cycleBadge: $("cycle-badge"), seasonBadge: $("season-badge"),
    colourBadge: $("colour-badge"), colourSwatch: $("colour-swatch"), colourLabel: $("colour-label"),
    saintDateChoice: $("saint-date-choice"), saintDateChoiceText: $("saint-date-choice-text"), saintDateLinks: $("saint-date-links"),
    saintObservanceStatus: $("saint-observance-status"), saintObservanceChoice: $("saint-observance-choice"),
    saintChoiceUnconfirmed: $("saint-choice-unconfirmed"), saintChoiceOfficial: $("saint-choice-official"), saintChoiceAlternative: $("saint-choice-alternative"),
    christmasProperLinks: $("christmas-proper-links"), christmasProperButtons: $("christmas-proper-buttons"),
    requiredReadingGuidance: $("required-reading-guidance"), requiredReadingLabel: $("required-reading-label"), requiredReadingText: $("required-reading-text"), requiredReadingExplanation: $("required-reading-explanation"),
    easterLateService: $("easter-late-service"), easterLateKicker: $("easter-late-kicker"), easterLateTitle: $("easter-late-title"),
    easterLateOt: $("easter-late-ot"), easterLatePsalm: $("easter-late-psalm"), easterLateNt: $("easter-late-nt"), easterLateGospel: $("easter-late-gospel"),
    tePouhereProvision: $("te-pouhere-provision"), tePouhereStatusText: $("te-pouhere-status-text"), tePouherePrecedenceText: $("te-pouhere-precedence-text"),
    tePouhereLectionaryLink: $("te-pouhere-lectionary-link"), tePouhereCalendarLink: $("te-pouhere-calendar-link"),
    tePouhereSentence: $("te-pouhere-sentence"), tePouhereOt: $("te-pouhere-ot"), tePouherePsalm: $("te-pouhere-psalm"), tePouhereNt: $("te-pouhere-nt"), tePouhereGospel: $("te-pouhere-gospel"), tePouherePostCommunion: $("te-pouhere-post-communion"),
    ordinaryAlternativeHeading: $("ordinary-alternative-heading"), ordinaryAlternativeTitle: $("ordinary-alternative-title"),
    trackChoice: $("track-choice"), continuousTrackMode: $("continuous-track-mode"), relatedTrackMode: $("related-track-mode"),
    tracks: $("tracks"), primaryTrack: $("primary-track"), primaryTrackTitle: $("primary-track-title"), relatedTrack: $("related-track"),
    underlyingSundayProvision: $("underlying-sunday-provision"), underlyingSundayTitle: $("underlying-sunday-title"), underlyingSundayNote: $("underlying-sunday-note"),
    underlyingTrackChoice: $("underlying-track-choice"), underlyingContinuousTrackMode: $("underlying-continuous-track-mode"), underlyingRelatedTrackMode: $("underlying-related-track-mode"),
    underlyingSundayTracks: $("underlying-sunday-tracks"), underlyingPrimaryTrack: $("underlying-primary-track"), underlyingPrimaryTitle: $("underlying-primary-title"), underlyingRelatedTrack: $("underlying-related-track"),
    underlyingContinuousOt: $("underlying-continuous-ot"), underlyingContinuousPsalm: $("underlying-continuous-psalm"), underlyingContinuousNt: $("underlying-continuous-nt"), underlyingContinuousGospel: $("underlying-continuous-gospel"),
    underlyingRelatedOt: $("underlying-related-ot"), underlyingRelatedPsalm: $("underlying-related-psalm"), underlyingRelatedNt: $("underlying-related-nt"), underlyingRelatedGospel: $("underlying-related-gospel"),
    palmLiturgy: $("palm-liturgy"), palmInstructionText: $("palm-instruction-text"), palmsGospel: $("palms-gospel"), palmsPsalm: $("palms-psalm"), palmsCollect: $("palms-collect"),
    passionOt: $("passion-ot"), passionPsalm: $("passion-psalm"), passionNt: $("passion-nt"), passionGospel: $("passion-gospel"),
    readingContent: $("reading-content"), emptyState: $("empty-state"), emptyTitle: $("empty-title"), emptyMessage: $("empty-message"),
    continuousOt: $("continuous-ot"), continuousPsalm: $("continuous-psalm"), continuousNt: $("continuous-nt"), continuousGospel: $("continuous-gospel"),
    relatedOt: $("related-ot"), relatedPsalm: $("related-psalm"), relatedNt: $("related-nt"), relatedGospel: $("related-gospel")
  };

  function setText(element, text) { element.textContent = text || "—"; }

  function stripReadingLabel(value) {
    return String(value || "")
      .replace(/^.*?:\s*(?=(?:[1-3]\s+)?[A-Za-z][A-Za-z .’'\-]*?\s+\d)/, "")
      .replace(/^(?:or|and)\s+/i, "").trim();
  }

  function readingReferences(value) {
    const references = [];
    let inheritedBook = "";
    String(value || "").split(/\r?\n/).forEach(line => {
      if (/^\s*NZPB:\s*/i.test(line)) return;
      stripReadingLabel(line).split(/\s+(?:or|and)\s+/i).forEach(part => {
        let reference = part.trim();
        if (!reference || reference === "—") return;
        const bookMatch = /^((?:[1-3]\s+)?[A-Za-z][A-Za-z .’'\-]*?)\s+(\d.*)$/.exec(reference);
        if (bookMatch) inheritedBook = bookMatch[1].trim();
        else if (/^\d/.test(reference) && inheritedBook) reference = `${inheritedBook} ${reference}`;
        if (/[A-Za-z]/.test(reference) && /\d/.test(reference)) references.push(reference);
      });
    });
    return references;
  }

  function gatewayReference(value, includeOptional = true) {
    const partialVerse = /\d+[a-d]\b/i.test(value);
    let normalized = String(value || "")
      .replace(/[–—]/g, "-")
      // Optional starting/ending boundaries are alternatives, not extra hyphens.
      .replace(/\((\d+[a-d]?)-\)(\d+[a-d]?)/gi, (_, optional, required) => includeOptional ? optional : required)
      .replace(/(\d+[a-d]?)\(-(\d+[a-d]?)\)/gi, (_, required, optional) => includeOptional ? optional : required)
      .replace(/\(([^()]*)\)/g, (_, optional) => includeOptional ? optional : "")
      .replace(/(\d+)[a-d]\b/gi, "$1")
      .replace(/:\s*,\s*/g, ":")
      .replace(/,\s*(?=,|;|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // Merge overlapping same-chapter ranges after expanding part-verse letters.
    normalized = normalized.replace(/(\d+)-(\d+),\s*(\d+)-(\d+)(?![:\d])/g,
      (match, a, b, c, d) => Number(c) <= Number(b) && Number(c) >= Number(a)
        ? `${a}-${Math.max(Number(b), Number(d))}` : match);
    const bookMatch = /^((?:[1-3]\s+)?[A-Za-z][A-Za-z .’'\-]*?)\s+(\d.*)$/.exec(normalized);
    if (bookMatch && normalized.includes(";")) {
      const book = bookMatch[1].trim();
      normalized = normalized.split(/\s*;\s*/).map((part, index) => index > 0 && /^\d/.test(part) ? `${book} ${part}` : part).join("; ");
    }
    const valid = normalized.split(/;\s*/).every(part => /^(?:[1-3]\s+)?[A-Za-z][A-Za-z .’'\-]*?\s+\d+(?::\s*\d+)?(?:\s*-\s*\d+(?::\d+)?)?(?:\s*,\s*\d+(?::\d+)?(?:\s*-\s*\d+(?::\d+)?)?)*$/.test(part));
    return { source: value, normalized, partialVerse, valid };
  }

  function gatewayPassages(readings, includeOptional = true) {
    const seen = new Map();
    readings.flatMap(readingReferences).map(value => gatewayReference(value, includeOptional)).forEach(item => {
      if (!item.normalized) return;
      const existing = seen.get(item.normalized);
      if (existing) existing.partialVerse ||= item.partialVerse;
      else seen.set(item.normalized, item);
    });
    return [...seen.values()];
  }

  function gatewayUrl(passages) {
    const search = passages.map(item => item.normalized).join("; ");
    return `${BIBLE_GATEWAY_BASE}?search=${encodeURIComponent(search)}&version=${encodeURIComponent(selectedBibleVersion().code)}`;
  }

  function selectedBibleVersion() {
    const versions = { NRSVA: true, RSV: true, GNT: true, CEV: false, ESV: false, NLT: false, KJV: false };
    const code = Object.hasOwn(versions, state.bibleVersion) ? state.bibleVersion : "NRSVA";
    return { code, apocrypha: versions[code] };
  }

  function unavailableApocrypha(passages) {
    return !selectedBibleVersion().apocrypha && passages.some(passage =>
      /^(?:Wisdom(?: of Solomon)?|Sirach|Ecclesiasticus|Baruch|Tobit|Judith|[1-4] Maccabees|[12] Esdras|Prayer of Manasseh|Susanna|Bel and the Dragon)\s+\d/i.test(passage.normalized));
  }

  function selectedGatewayPassages(readings) {
    const seen = new Map();
    readings.flatMap(readingReferences).forEach(reference => {
      const passage = gatewayReference(reference, state.optionalChoices[reference] !== false);
      const existing = seen.get(passage.normalized);
      if (existing) existing.partialVerse ||= passage.partialVerse;
      else seen.set(passage.normalized, passage);
    });
    return [...seen.values()];
  }

  function setReading(element, text) {
    element.replaceChildren();
    const value = text || "—";
    if (/^Bible: /m.test(value)) {
      const lines = value.split(/\r?\n/);
      const bible = lines.find(line => line.startsWith("Bible: "))?.slice(7).split(" or ") || [];
      const nzpb = lines.find(line => line.startsWith("NZPB: "))?.slice(6).split(" or ") || [];
      const common = bible.filter(reference => nzpb.includes(reference));
      if (common.length) {
        const shared = document.createElement("div");
        setReading(shared, common.join(" or "));
        element.appendChild(shared);
      }
      lines.forEach(line => {
        const match = /^(Bible|NZPB):\s*(.*)$/.exec(line);
        if (!match) return;
        const reference = match[2].split(" or ").filter(part => !common.includes(part)).join(" or ");
        if (!reference) return;
        const group = document.createElement("div");
        group.className = "psalm-numbering-line";
        const label = document.createElement("small");
        label.className = "psalm-numbering-label";
        label.textContent = match[1];
        label.title = match[1] === "Bible" ? "Bible Version Numbering — Vanderbilt reference" : "NZPB Psalms numbering — retained NZPB/Lectionary reference";
        group.appendChild(label);
        const reading = document.createElement("span");
        if (match[1] === "Bible") setReading(reading, reference);
        else { reading.className = "nzpb-numbering-reference"; reading.textContent = reference; }
        group.appendChild(reading);
        element.appendChild(group);
      });
      return;
    }
    const readingText = document.createElement("span");
    readingText.className = "reading-text";
    readingText.textContent = value;
    element.appendChild(readingText);
    const passages = selectedGatewayPassages([value]);
    if (!passages.length) return;
    const links = document.createElement("span");
    links.className = "reading-links";
    passages.forEach(passage => {
      let choices;
      const short = gatewayReference(passage.source, false);
      const extended = gatewayReference(passage.source, true);
      if (short.normalized !== extended.normalized) {
        choices = document.createElement("span");
        choices.className = "segmented-control optional-reading-choice";
        choices.setAttribute("role", "group");
        choices.setAttribute("aria-label", `Optional verses for ${passage.source}`);
        [[false, "Short reading"], [true, "Include optional verses"]].forEach(([include, label]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = label;
          const active = (state.optionalChoices[passage.source] !== false) === include;
          button.className = active ? "active" : "";
          button.setAttribute("aria-pressed", String(active));
          button.addEventListener("click", () => {
            state.optionalChoices[passage.source] = include;
            renderReading();
          });
          choices.appendChild(button);
        });
      }
      if (!passage.valid) {
        const warning = document.createElement("span");
        warning.className = "partial-verse-note";
        warning.textContent = `Link needs checking: ${passage.source}`;
        links.appendChild(warning);
        return;
      }
      const link = document.createElement("a");
      link.className = "reading-link";
      link.href = gatewayUrl([passage]);
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = passage.normalized;
      links.appendChild(link);
      if (choices) links.appendChild(choices);
      if (unavailableApocrypha([passage])) {
        const warning = document.createElement("span");
        warning.className = "partial-verse-note";
        warning.textContent = "Not available in this Bible Gateway version — select NRSVA, RSV or GNT for this reading.";
        links.appendChild(warning);
      }
    });
    if (passages.some(item => item.partialVerse)) {
      const note = document.createElement("span");
      note.className = "partial-verse-note";
      note.textContent = "Part-verse letter present: Bible Gateway opens the full verse. Check the lectionary reference when reading.";
      links.appendChild(note);
    }
    element.appendChild(links);
  }

  function createSetActions(readings, label) {
    const passages = selectedGatewayPassages(readings);
    const actions = document.createElement("div");
    actions.className = "reading-set-actions";
    if (!passages.length) return actions;
    if (passages.some(passage => !passage.valid)) {
      actions.textContent = "Set link needs checking — one or more references could not be interpreted safely.";
      return actions;
    }
    const url = gatewayUrl(passages);
    const open = document.createElement("a");
    open.className = "reading-action";
    open.href = url;
    open.target = "_blank";
    open.rel = "noreferrer";
    open.textContent = `Open ${label}`;
    const copy = document.createElement("button");
    copy.className = "reading-action";
    copy.type = "button";
    copy.textContent = "Copy set link";
    copy.addEventListener("click", async () => {
      const original = copy.textContent;
      try {
        await navigator.clipboard.writeText(url);
        copy.textContent = "Link copied";
      } catch (_error) {
        copy.textContent = "Copy failed";
      }
      window.setTimeout(() => { copy.textContent = original; }, 1800);
    });
    actions.append(open, copy);
    if (unavailableApocrypha(passages)) {
      const warning = document.createElement("span");
      warning.className = "reading-set-warning";
      warning.textContent = "This set includes Apocrypha unavailable in the selected version. Select NRSVA, RSV or GNT to read the complete set.";
      actions.appendChild(warning);
    }
    if (passages.some(item => item.partialVerse)) {
      const warning = document.createElement("span");
      warning.className = "reading-set-warning";
      warning.textContent = "Includes part-verse letters; the link expands those references to full verses. Check the lectionary letters.";
      actions.appendChild(warning);
    }
    return actions;
  }

  function setReadingSetActions(card, readings, label) {
    card.querySelector(":scope > header > .reading-set-actions")?.remove();
    card.querySelector(":scope > header")?.appendChild(createSetActions(readings, label));
  }

  function properTitle(entry, date) {
    return entry?.properNumber ? `Proper\u00a0${entry.properNumber}` : "";
  }

  function renderVigil(entry, cycle) {
    const container = $("easter-vigil");
    const show = ["Holy Saturday", "Easter Day"].includes(entry?.name);
    container.hidden = !show;
    if (!show) return;
    const vigil = window.EASTER_VIGIL_DATA;
    $("vigil-timing").textContent = `${vigil.timing} Vigil colour: White.`;
    $("vigil-instruction").textContent = vigil.instruction;
    const readings = $("vigil-readings");
    readings.replaceChildren();
    const pairs = [...vigil.oldTestament.map((pair, i) => ({ ...pair, title: `Old Testament ${i + 1}` })),
      { ...vigil.newTestament, title: "New Testament" },
      { reading: vigil.gospels[cycle], title: "Gospel", required: true }];
    pairs.forEach(pair => {
      const card = document.createElement("article");
      card.className = "track-card vigil-card";
      const header = document.createElement("header");
      const title = document.createElement("h3");
      title.textContent = `${pair.title}${pair.required ? " · Required" : ""}`;
      header.appendChild(title);
      card.appendChild(header);
      const list = document.createElement("dl");
      for (const [label, value] of [["Reading", pair.reading], ["Psalm / Canticle", pair.response]]) {
        if (!value) continue;
        const group = document.createElement("div"), term = document.createElement("dt"), reading = document.createElement("dd");
        term.textContent = label;
        setReading(reading, value);
        group.append(term, reading);
        list.appendChild(group);
      }
      card.appendChild(list);
      setReadingSetActions(card, [pair.reading, pair.response || ""], pair.response ? "reading and response" : "Gospel");
      readings.appendChild(card);
    });
  }

  function renderChristmasProperActions(entry) {
    const isChristmas = entry?.name === "Christmas Day";
    elements.christmasProperLinks.hidden = !isChristmas;
    elements.christmasProperButtons.replaceChildren();
    if (!isChristmas) return;
    ["I", "II", "III"].forEach((roman, index) => {
      const prefix = `Proper ${roman}:`;
      const readings = [entry.ot, entry.psalm, entry.nt, entry.gospel].map(value => String(value || "").split(/\r?\n/).find(line => line.startsWith(prefix))?.slice(prefix.length).trim() || "");
      const row = document.createElement("div");
      row.className = "christmas-proper-row";
      const title = document.createElement("strong");
      title.textContent = `Proper ${index + 1}`;
      row.append(title, createSetActions(readings, `Proper ${index + 1}`));
      elements.christmasProperButtons.appendChild(row);
    });
  }

  function applyTrackChoice(hasRelatedSeries, mode, choice, continuousButton, relatedButton, continuousCard, relatedCard) {
    const selectedMode = hasRelatedSeries && mode === "related" ? "related" : "continuous";
    choice.hidden = !hasRelatedSeries;
    continuousButton.classList.toggle("active", selectedMode === "continuous");
    relatedButton.classList.toggle("active", selectedMode === "related");
    continuousButton.setAttribute("aria-pressed", String(selectedMode === "continuous"));
    relatedButton.setAttribute("aria-pressed", String(selectedMode === "related"));
    continuousCard.hidden = selectedMode !== "continuous";
    relatedCard.hidden = !hasRelatedSeries || selectedMode !== "related";
  }

  function renderCalendar() {
    today = core.cloneDate(new Date());
    const monthLabel = new Intl.DateTimeFormat("en-NZ", { month: "long", year: "numeric" }).format(state.month);
    elements.monthTitle.textContent = monthLabel;
    elements.monthSelect.value = String(state.month.getMonth());
    elements.yearSelect.value = String(state.month.getFullYear());
    elements.calendar.replaceChildren();
    const first = new Date(state.month.getFullYear(), state.month.getMonth(), 1, 12);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = core.addDays(first, -mondayOffset);
    const resolved = core.resolveSelection(state.selected, state.direction, calendarPreferences()).displayDate;

    for (let index = 0; index < 42; index += 1) {
      const date = core.addDays(start, index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = date.getDate();
      const observances = core.observancesOn(date, calendarPreferences());
      const easter = core.gregorianEaster(date.getFullYear());
      const vigilName = core.sameDate(date, core.addDays(easter, -1)) ? "Great Vigil of Easter (evening)"
        : core.sameDate(date, easter) ? "Great Vigil of Easter (early morning)" : "";
      const observanceNames = [...observances.map(item => item.name), vigilName].filter(Boolean).join("; ");
      const collisionObservances = observances.filter(item => item.collision || (item.nominalDate && item.observedDate && !core.sameDate(item.nominalDate, item.observedDate)));
      const collisionText = collisionObservances.map(item => item.note || `${item.name} is transferred`).join(" ");
      button.setAttribute("aria-label", `${core.formatLong(date)}${observanceNames ? `. ${observanceNames}` : ""}${collisionText ? `. Transfer alert: ${collisionText}` : ""}`);
      if (observanceNames || collisionText) button.title = [observanceNames, collisionText].filter(Boolean).join(" — ");
      if (date.getMonth() !== state.month.getMonth()) button.classList.add("outside");
      if (date.getDay() === 0) button.classList.add("sunday");
      if (observances.length) button.classList.add("observance");
      if (observances.some(item => item.rank === "Principal Feast" || item.rank === "Principal Holy Day")) button.classList.add("principal-observance");
      if (collisionObservances.length) button.classList.add("collision");
      if (core.sameDate(date, state.selected)) button.classList.add("selected");
      if (core.sameDate(date, resolved)) button.classList.add("resolved");
      if (core.sameDate(date, today)) button.classList.add("today");
      const feastReferences = observances.filter(item => item.lookupName && item.nominalDate && item.observedDate);
      const feastReference = feastReferences.find(item => !item.informational) || feastReferences[0];
      const higherObservance = observances.some(item => !item.informational && item.replacesSunday);
      button.addEventListener("click", () => selectDate(date, {
        festivalName: date.getDay() !== 0 && feastReference && !higherObservance ? feastReference.name : null
      }));
      elements.calendar.appendChild(button);
    }
  }

  function selectDate(date, options = {}) {
    state.selected = core.cloneDate(date);
    state.festivalReadingOverride = options.festivalName || null;
    state.month = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    render();
  }

  function setFestivalChoice(choice) {
    const context = state.festivalChoiceContext;
    if (!context?.choiceKey || context.authorisedDates.length < 2) return;
    if (choice === "unconfirmed") delete state.festivalChoices[context.choiceKey];
    else state.festivalChoices[context.choiceKey] = choice;
    saveFestivalChoices();
    const targetIndex = choice === "alternative" ? 1 : 0;
    const nominal = context.authorisedDates[targetIndex].nominal;
    const matching = core.observancesOn(nominal, calendarPreferences()).find(item => item.name === context.name && item.lookupName);
    selectDate(matching?.observedDate || nominal, { festivalName: context.name });
  }

  function showNotice(message, type) {
    elements.notice.hidden = !message;
    elements.notice.className = `notice${type === "info" ? " info" : ""}`;
    elements.notice.textContent = message || "";
  }

  function renderColour(date, result) {
    const colour = core.liturgicalColour(date, result, calendarPreferences());
    const palette = { white: "#f7f5ef", red: "#a53b3f", violet: "#64447e", green: "#3f7354", none: "#8b8b86", unknown: "#b57a24" };
    const accent = palette[colour.primary.css] || palette.unknown;
    document.querySelector(".reading-panel").style.setProperty("--liturgical-colour", accent);
    elements.colourBadge.hidden = false;
    elements.colourSwatch.style.background = accent;
    elements.colourLabel.textContent = `${colour.primary.code} · ${colour.primary.name}`;
    elements.colourBadge.removeAttribute("title");
  }

  function renderTransferChoice() {
    const option = core.transferOptionForDate(state.selected);
    const hasChoice = option && !core.sameDate(option.nominal, option.assigned);
    elements.transferChoice.hidden = !hasChoice;
    if (!hasChoice) return;
    const placement = state.feastPlacement[option.placementKey] || "date";
    elements.transferChoiceText.textContent = `${option.name} may be kept on ${core.formatLong(option.nominal)} or ${core.formatLong(option.assigned)}.`;
    elements.calendarDateMode.classList.toggle("active", placement === "date");
    elements.assignedSundayMode.classList.toggle("active", placement === "sunday");
  }

  function renderReading() {
    const selection = core.resolveSelection(state.selected, state.direction, calendarPreferences(), state.festivalReadingOverride);
    const sunday = selection.displayDate;
    const result = selection.result;
    const entry = core.findEntry(result, data);
    const adjusted = selection.adjusted;

    elements.requiredReadingGuidance.hidden = true;
    elements.easterLateService.hidden = true;
    elements.saintDateChoice.hidden = true;
    elements.christmasProperLinks.hidden = true;
    state.festivalChoiceContext = null;
    elements.tePouhereProvision.hidden = true;
    elements.ordinaryAlternativeHeading.hidden = true;
    elements.underlyingSundayProvision.hidden = true;
    elements.trackChoice.hidden = true;
    elements.underlyingTrackChoice.hidden = true;

    elements.adjustment.hidden = !adjusted;
    elements.previousMode.classList.toggle("active", state.direction === "previous");
    elements.nextMode.classList.toggle("active", state.direction === "next");
    if (adjusted) elements.adjustmentText.textContent = `${core.formatLong(state.selected)} is not a Sunday. Showing the ${state.direction} Sunday.`;

    elements.resolvedDate.textContent = core.formatLong(sunday);
    elements.sundayName.textContent = result.name;
    elements.cycleBadge.textContent = `Year ${result.context.cycle}`;
    elements.seasonBadge.textContent = result.observance ? result.season : (result.available ? result.season : "Outside current dataset");
    renderColour(sunday, result);

    const notices = [];
    if (adjusted) notices.push(`Selected ${core.formatLong(state.selected)}; readings shown for ${core.formatLong(sunday)}.`);
    if (result.warning) notices.push(result.warning);
    const secondaryObservances = selection.observances.filter(item => !result.observance || item.name !== result.observance.name);
    const collisionObservances = selection.observances.filter(item => item.collision || (item.nominalDate && item.observedDate && !core.sameDate(item.nominalDate, item.observedDate)));
    if (!adjusted && secondaryObservances.length) notices.push(secondaryObservances.map(item => `${item.name}: ${item.note}`).join(" "));
    showNotice(notices.join(" "), (result.warning || collisionObservances.length) ? "warning" : "info");

    if (!result.available || !entry) {
      elements.readingContent.hidden = true;
      elements.emptyState.hidden = false;
      elements.emptyTitle.textContent = result.available ? "Reading not found in workbook" : result.name;
      elements.emptyMessage.textContent = result.available ? "The calculated Sunday has no matching A/B/C row in the current extracted data. It should be reviewed before a reading is shown." : result.message;
      elements.sundaySubheading.textContent = result.subtitle || "";
      return;
    }

    elements.readingContent.hidden = false;
    renderVigil(entry, result.context.cycle);
    elements.emptyState.hidden = true;
    elements.sundayName.textContent = result.observance ? result.name : entry.name;
    elements.sundaySubheading.textContent = result.observance
      ? (result.subtitle || (entry.subheading && entry.subheading !== result.name ? entry.subheading : ""))
      : (entry.subheading || "");
    const proper = properTitle(entry, sunday);
    if (proper) elements.sundaySubheading.textContent = [elements.sundaySubheading.textContent, proper].filter(Boolean).join(" · ");
    elements.seasonBadge.textContent = result.observance ? result.season : entry.season;

    const tePouhereData = core.sameDate(sunday, core.tePouhereSunday(sunday.getFullYear())) ? window.TE_POUHERE_DATA : null;
    elements.tePouhereProvision.hidden = !tePouhereData;
    elements.ordinaryAlternativeHeading.hidden = !tePouhereData;
    if (tePouhereData) {
      const ordinaryTitle = entry.name;
      elements.sundayName.textContent = tePouhereData.name;
      elements.sundaySubheading.textContent = `${tePouhereData.dateRule} · ${ordinaryTitle}`;
      elements.seasonBadge.textContent = "Designated Sunday";
      setText(elements.tePouhereStatusText, tePouhereData.status);
      setText(elements.tePouherePrecedenceText, tePouhereData.precedence);
      elements.tePouhereLectionaryLink.href = tePouhereData.sourceUrl;
      elements.tePouhereCalendarLink.href = tePouhereData.calendarSourceUrl;
      setText(elements.tePouhereSentence, tePouhereData.sentence);
      setReading(elements.tePouhereOt, tePouhereData.ot);
      setReading(elements.tePouherePsalm, tePouhereData.psalm);
      setReading(elements.tePouhereNt, tePouhereData.nt);
      setReading(elements.tePouhereGospel, tePouhereData.gospel);
      setText(elements.tePouherePostCommunion, tePouhereData.postCommunion);
      setReadingSetActions(document.querySelector(".te-pouhere-card"), [tePouhereData.ot, tePouhereData.psalm, tePouhereData.nt, tePouhereData.gospel], "Te Pouhere set");
      setText(elements.ordinaryAlternativeTitle, [ordinaryTitle, proper].filter(Boolean).join(" · "));
    }

    const requiredReading = (window.MANDATORY_READING_RULES || []).find(rule => rule.names.includes(entry.name));
    elements.requiredReadingGuidance.hidden = !requiredReading;
    if (requiredReading) {
      setText(elements.requiredReadingLabel, requiredReading.label);
      setText(elements.requiredReadingText, requiredReading.instruction);
      setText(elements.requiredReadingExplanation, requiredReading.explanation);
    }

    const choiceObservance = result.observance?.authorisedDates?.length > 1
      ? result.observance
      : selection.observances.find(item => item.authorisedDates?.length > 1);
    const authorisedDates = choiceObservance?.authorisedDates || [];
    elements.saintDateChoice.hidden = authorisedDates.length < 2;
    elements.saintDateLinks.replaceChildren();
    if (authorisedDates.length > 1) {
      const dateFormatter = new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long", year: "numeric" });
      const choiceName = choiceObservance.lookupName || choiceObservance.name;
      const choice = choiceObservance.choice || "unconfirmed";
      const choiceKey = choiceObservance.choiceKey;
      state.festivalChoiceContext = { name: choiceName, choiceKey, authorisedDates };
      elements.saintDateChoiceText.textContent = `${choiceName} has an official Calendar date and an authorised alternative in this Advent-to-Advent liturgical year. Both dates open the same readings; this choice does not replace the Sunday provision.`;
      elements.saintObservanceStatus.textContent = choice === "alternative"
        ? (authorisedDates[1].nominal > authorisedDates[0].nominal
          ? `Alternative selected: the feast was not recorded as observed on ${dateFormatter.format(authorisedDates[0].nominal)}.`
          : `Alternative selected in place of the later official date, ${dateFormatter.format(authorisedDates[0].nominal)}.`)
        : choice === "official"
          ? (core.sameDate(authorisedDates[0].nominal, authorisedDates[0].observed)
            ? "Official date used: the alternative remains visible for reference only."
            : `Official-date provision selected: precedence moves it to ${dateFormatter.format(authorisedDates[0].observed)}; the alternative remains visible for reference.`)
          : "Observance status not yet confirmed. The official date remains active until a choice is recorded.";
      [
        [elements.saintChoiceUnconfirmed, "unconfirmed"],
        [elements.saintChoiceOfficial, "official"],
        [elements.saintChoiceAlternative, "alternative"]
      ].forEach(([button, value]) => {
        const selected = choice === value;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      authorisedDates.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "saint-date-link";
        const role = document.createElement("span");
        role.className = "saint-date-role";
        role.textContent = item.role;
        const dateValue = document.createElement("strong");
        const dateStatus = document.createElement("span");
        dateStatus.className = "saint-date-status";
        const collisionLabel = item.collision?.blockedBy ? `; ${item.collision.blockedBy} has precedence` : "";
        const chainLabel = item.transferChain?.length > 1 ? `; also skips ${item.transferChain.slice(1).map(step => step.name).join(", ")}` : "";
        dateValue.textContent = core.sameDate(item.nominal, item.observed)
          ? dateFormatter.format(item.nominal)
          : `${dateFormatter.format(item.nominal)}${collisionLabel} — observed ${dateFormatter.format(item.observed)}${chainLabel}`;
        dateStatus.textContent = item.active
          ? (choice === "unconfirmed" ? "Active by default — confirmation pending" : "Selected observance date")
          : (choice === "official" ? "Already observed on the official date" : "Not selected — available for reference");
        button.append(role, dateValue, dateStatus);
        if (item.active) button.classList.add("appointed");
        if (core.sameDate(state.selected, item.observed)) button.classList.add("active");
        button.addEventListener("click", () => selectDate(item.observed, { festivalName: choiceName }));
        elements.saintDateLinks.appendChild(button);
      });
    }

    renderChristmasProperActions(entry);

    const easterData = entry.name === "Easter Day" ? window.EASTER_DAY_DATA : null;
    elements.easterLateService.hidden = !easterData;
    if (easterData) {
      setText(elements.easterLateKicker, easterData.lateService.kicker);
      setText(elements.easterLateTitle, easterData.lateService.title);
      setReading(elements.easterLateOt, easterData.lateService.ot);
      setReading(elements.easterLatePsalm, easterData.lateService.psalm);
      setReading(elements.easterLateNt, easterData.lateService.nt);
      setReading(elements.easterLateGospel, easterData.lateService.gospel);
      setReadingSetActions(document.querySelector(".late-easter-card"), [easterData.lateService.ot, easterData.lateService.psalm, easterData.lateService.nt, easterData.lateService.gospel], "later-service set");
    }

    const palmData = entry.name === "Palm Sunday"
      ? (window.PALM_SUNDAY_DATA || []).find(item => item.year === entry.year)
      : null;
    elements.palmLiturgy.hidden = !palmData;
    elements.tracks.hidden = Boolean(palmData);
    if (palmData) {
      setText(elements.palmInstructionText, palmData.instruction);
      setReading(elements.palmsGospel, palmData.palmsGospel);
      setReading(elements.palmsPsalm, palmData.palmsPsalm);
      setText(elements.palmsCollect, palmData.palmsCollect);
      setReading(elements.passionOt, palmData.passionOt);
      setReading(elements.passionPsalm, palmData.passionPsalm);
      setReading(elements.passionNt, palmData.passionNt);
      setReading(elements.passionGospel, palmData.passionGospel);
      setReadingSetActions(document.querySelector(".palms-card"), [palmData.palmsGospel, palmData.palmsPsalm], "Palms set");
      setReadingSetActions(document.querySelector(".passion-card"), [palmData.passionOt, palmData.passionPsalm, palmData.passionNt, palmData.passionGospel], "Passion set");
      return;
    }

    const tracks = core.readingTracks(entry);
    const hasRelatedSeries = tracks.hasDistinctTracks;
    elements.tracks.classList.add("single-track");
    elements.primaryTrackTitle.textContent = hasRelatedSeries ? "Continuous" : "Readings";
    applyTrackChoice(hasRelatedSeries, state.trackMode, elements.trackChoice, elements.continuousTrackMode, elements.relatedTrackMode, elements.primaryTrack, elements.relatedTrack);
    setReading(elements.continuousOt, tracks.continuous.ot);
    setReading(elements.continuousPsalm, tracks.continuous.psalm);
    setReading(elements.continuousNt, tracks.continuous.nt);
    setReading(elements.continuousGospel, tracks.continuous.gospel);
    setReading(elements.relatedOt, tracks.related.ot);
    setReading(elements.relatedPsalm, tracks.related.psalm);
    setReading(elements.relatedNt, tracks.related.nt);
    setReading(elements.relatedGospel, tracks.related.gospel);
    if (entry.name === "Christmas Day") {
      elements.primaryTrack.querySelector(":scope > header > .reading-set-actions")?.remove();
      elements.relatedTrack.querySelector(":scope > header > .reading-set-actions")?.remove();
    } else {
      setReadingSetActions(elements.primaryTrack, [tracks.continuous.ot, tracks.continuous.psalm, tracks.continuous.nt, tracks.continuous.gospel], hasRelatedSeries ? "Continuous set" : "all readings");
      setReadingSetActions(elements.relatedTrack, [tracks.related.ot, tracks.related.psalm, tracks.related.nt, tracks.related.gospel], "Related set");
    }

    const underlyingResult = result.observance?.replacesSunday && sunday.getDay() === 0
      ? core.classifySunday(sunday, calendarPreferences())
      : null;
    const underlyingEntry = underlyingResult && underlyingResult.available
      ? core.findEntry(underlyingResult, data)
      : null;
    const showUnderlyingSunday = Boolean(underlyingEntry && underlyingEntry.name !== entry.name);
    elements.underlyingSundayProvision.hidden = !showUnderlyingSunday;
    if (showUnderlyingSunday) {
      const underlyingTracks = core.readingTracks(underlyingEntry);
      const hasUnderlyingRelated = underlyingTracks.hasDistinctTracks;
      setText(elements.underlyingSundayTitle, [underlyingEntry.name, properTitle(underlyingEntry, sunday)].filter(Boolean).join(" · "));
      elements.underlyingSundayNote.textContent = entry.name === "The Transfiguration of the Beloved Son" && sunday.getFullYear() === 2023
        ? "The 2023 Lectionary appoints these readings for the Sunday when the Transfiguration is transferred to Monday. They remain part of the Ordinary-Time sequence and are not stored as a 6 August reading set."
        : "This Sunday remains part of the Church-year sequence. Its readings are retained for reference when the higher observance is kept or transferred according to the authorised rule.";
      elements.underlyingSundayTracks.classList.add("single-track");
      elements.underlyingPrimaryTitle.textContent = hasUnderlyingRelated ? "Continuous" : "Readings";
      applyTrackChoice(hasUnderlyingRelated, state.underlyingTrackMode, elements.underlyingTrackChoice, elements.underlyingContinuousTrackMode, elements.underlyingRelatedTrackMode, elements.underlyingPrimaryTrack, elements.underlyingRelatedTrack);
      setReading(elements.underlyingContinuousOt, underlyingTracks.continuous.ot);
      setReading(elements.underlyingContinuousPsalm, underlyingTracks.continuous.psalm);
      setReading(elements.underlyingContinuousNt, underlyingTracks.continuous.nt);
      setReading(elements.underlyingContinuousGospel, underlyingTracks.continuous.gospel);
      setReading(elements.underlyingRelatedOt, underlyingTracks.related.ot);
      setReading(elements.underlyingRelatedPsalm, underlyingTracks.related.psalm);
      setReading(elements.underlyingRelatedNt, underlyingTracks.related.nt);
      setReading(elements.underlyingRelatedGospel, underlyingTracks.related.gospel);
      setReadingSetActions(elements.underlyingPrimaryTrack, [underlyingTracks.continuous.ot, underlyingTracks.continuous.psalm, underlyingTracks.continuous.nt, underlyingTracks.continuous.gospel], hasUnderlyingRelated ? "underlying Continuous set" : "underlying readings");
      setReadingSetActions(elements.underlyingRelatedTrack, [underlyingTracks.related.ot, underlyingTracks.related.psalm, underlyingTracks.related.nt, underlyingTracks.related.gospel], "underlying Related set");
    }
  }

  function render() {
    renderCalendar();
    renderTransferChoice();
    renderReading();
  }

  const monthNames = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("en-NZ", { month: "long" }).format(new Date(2024, month, 1, 12)));
  monthNames.forEach((name, month) => {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = name;
    elements.monthSelect.appendChild(option);
  });
  elements.todayButton.addEventListener("click", () => selectDate(new Date()));
  $("bible-version").addEventListener("change", event => {
    state.bibleVersion = event.target.value;
    $("apocrypha-status").hidden = selectedBibleVersion().apocrypha;
    renderReading();
  });
  elements.previousMode.addEventListener("click", () => { state.direction = "previous"; render(); });
  elements.nextMode.addEventListener("click", () => { state.direction = "next"; render(); });
  elements.calendarDateMode.addEventListener("click", () => {
    const option = core.transferOptionForDate(state.selected);
    if (!option) return;
    state.feastPlacement[option.placementKey] = "date";
    savePrincipalChoices();
    selectDate(option.nominal);
  });
  elements.assignedSundayMode.addEventListener("click", () => {
    const option = core.transferOptionForDate(state.selected);
    if (!option) return;
    state.feastPlacement[option.placementKey] = "sunday";
    savePrincipalChoices();
    selectDate(option.assigned);
  });
  elements.monthSelect.addEventListener("change", () => {
    state.month = new Date(state.month.getFullYear(), Number(elements.monthSelect.value), 1, 12);
    renderCalendar();
  });
  function applySelectedYear() {
    const year = Number(elements.yearSelect.value);
    if (Number.isInteger(year) && year >= 1600 && year <= 4099) state.month = new Date(year, state.month.getMonth(), 1, 12);
    renderCalendar();
  }
  elements.yearSelect.addEventListener("change", applySelectedYear);
  elements.yearSelect.addEventListener("keydown", event => { if (event.key === "Enter") applySelectedYear(); });
  elements.previousMonth.addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1, 12); renderCalendar(); });
  elements.nextMonth.addEventListener("click", () => { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1, 12); renderCalendar(); });
  elements.continuousTrackMode.addEventListener("click", () => { state.trackMode = "continuous"; renderReading(); });
  elements.relatedTrackMode.addEventListener("click", () => { state.trackMode = "related"; renderReading(); });
  elements.underlyingContinuousTrackMode.addEventListener("click", () => { state.underlyingTrackMode = "continuous"; renderReading(); });
  elements.underlyingRelatedTrackMode.addEventListener("click", () => { state.underlyingTrackMode = "related"; renderReading(); });
  elements.saintChoiceUnconfirmed.addEventListener("click", () => setFestivalChoice("unconfirmed"));
  elements.saintChoiceOfficial.addEventListener("click", () => setFestivalChoice("official"));
  elements.saintChoiceAlternative.addEventListener("click", () => setFestivalChoice("alternative"));
  window.addEventListener("storage", event => {
    if (event.key === null || [FESTIVAL_CHOICE_STORAGE_KEY, PRINCIPAL_CHOICE_STORAGE_KEY].includes(event.key)) refreshFestivalChoices();
  });
  window.addEventListener("focus", refreshFestivalChoices);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshFestivalChoices(); });

  render();
})();
