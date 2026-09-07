(function (root) {
  "use strict";

  const DAY_MS = 86400000;
  const ordinalWords = {
    5: "Fifth", 6: "Sixth", 7: "Seventh", 8: "Eighth", 9: "Ninth",
    10: "Tenth", 11: "Eleventh", 12: "Twelfth", 13: "Thirteenth",
    14: "Fourteenth", 15: "Fifteenth", 16: "Sixteenth", 17: "Seventeenth",
    18: "Eighteenth", 19: "Nineteenth", 20: "Twentieth", 21: "Twenty-first",
    22: "Twenty-second", 23: "Twenty-third", 24: "Twenty-fourth", 25: "Twenty-fifth",
    26: "Twenty-sixth", 27: "Twenty-seventh", 28: "Twenty-eighth", 29: "Twenty-ninth",
    30: "Thirtieth", 31: "Thirty-first", 32: "Thirty-second", 33: "Thirty-third",
    34: "Thirty-fourth"
  };

  const CALENDAR_SOURCE = "https://anglicanprayerbook.nz/007.html";
  const PRECEDENCE_SOURCE = "https://anglican.org.nz/content/download/132347/664875/file/Website%20update%20Appendix%20B%20-%20Notes%20on%20the%20Calendar%20as%20at%2024Oct24.pdf";

  const fixedPrincipalFeasts = [
    { month: 0, day: 1, name: "The Naming of Jesus" },
    { month: 0, day: 6, name: "The Epiphany" },
    { month: 1, day: 2, name: "The Presentation of Jesus in the Temple" },
    { month: 7, day: 6, name: "The Transfiguration of the Beloved Son" },
    { month: 10, day: 1, name: "All Saints’ Day" },
    { month: 11, day: 25, name: "Christmas Day" }
  ];

  const fixedFestivals = [
    [0, 25, "The Conversion of St Paul"], [2, 19, "St Joseph of Nazareth"],
    [3, 26, "St Mark the Evangelist"], [4, 1, "St Philip and St James, Apostles"],
    [4, 14, "St Matthias the Apostle", [[1, 24]]], [4, 31, "The Visitation of Mary to Elizabeth", [[6, 2]]],
    [5, 11, "St Barnabas the Apostle"], [5, 24, "St John the Baptist"],
    [5, 29, "St Peter and St Paul, Apostles, Martyrs"], [6, 22, "St Mary Magdalene"],
    [6, 25, "St James and St John, Apostles"], [7, 15, "St Mary, the Mother of Jesus"],
    [7, 24, "St Bartholomew (Nathanael), Apostle"],
    [8, 1, "The Builders of the Anglican Church in Aotearoa, New Zealand and Polynesia"],
    [8, 14, "Holy Cross Day"], [8, 21, "St Matthew, Apostle, Evangelist"],
    [8, 29, "St Michael and All Angels"], [9, 18, "St Luke the Evangelist"],
    [9, 23, "St James of Jerusalem"], [9, 28, "St Simon and St Jude, Apostles"],
    [10, 30, "St Andrew, Apostle, Martyr"], [11, 21, "St Thomas the Apostle", [[6, 3]]],
    [11, 26, "St Stephen, the first Martyr", [[7, 3]]], [11, 27, "St John, the Evangelist", [[4, 6]]],
    [11, 28, "The Holy Innocents", [[1, 16]]]
  ].map(([month, day, name, alternateDates = []]) => ({ month, day, name, alternateDates }));

  const transferablePrincipalNames = new Set([
    "The Epiphany",
    "The Presentation of Jesus in the Temple",
    "All Saints’ Day"
  ]);

  function atNoon(year, month, day) { return new Date(year, month, day, 12, 0, 0, 0); }
  function cloneDate(date) { return atNoon(date.getFullYear(), date.getMonth(), date.getDate()); }
  function addDays(date, days) { const next = cloneDate(date); next.setDate(next.getDate() + days); return next; }
  function diffDays(a, b) { return Math.round((cloneDate(a) - cloneDate(b)) / DAY_MS); }
  function sameDate(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function formatISO(date) { return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-"); }
  function parseISO(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) return null;
    const date = atNoon(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function formatLong(date) { return new Intl.DateTimeFormat("en-NZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date); }
  function sundayOnOrAfter(date) { return addDays(date, (7 - date.getDay()) % 7); }
  function sundayOnOrBefore(date) { return addDays(date, -date.getDay()); }
  function mod(value, divisor) { return ((value % divisor) + divisor) % divisor; }

  function gregorianEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return atNoon(year, month - 1, day);
  }

  function adventOne(year) { return sundayOnOrAfter(atNoon(year, 10, 27)); }
  function tePouhereSunday(year) { return addDays(gregorianEaster(year), 63); }

  function liturgicalStartYearForDate(input) {
    const date = cloneDate(input);
    return date >= adventOne(date.getFullYear()) ? date.getFullYear() : date.getFullYear() - 1;
  }

  function festivalChoiceKey(name, liturgicalStartYear) {
    return `festival-choice|${liturgicalStartYear}|${name}`;
  }

  function principalBlockerOn(input, placements) {
    const date = cloneDate(input);
    const year = date.getFullYear();
    const fixed = fixedPrincipalFeasts.find(item =>
      !transferablePrincipalNames.has(item.name) && item.month === date.getMonth() && item.day === date.getDate()
    );
    if (fixed) return { name: fixed.name, rank: "Principal Feast" };

    const transferable = transferableFeasts(year).find(item => {
      const placement = placements?.[item.placementKey] || "date";
      return sameDate(date, placement === "sunday" ? item.assigned : item.nominal);
    });
    if (transferable) return { name: transferable.name, rank: "Principal Feast" };

    const easter = gregorianEaster(year);
    const moving = [
      [sundayOnOrAfter(atNoon(year, 0, 7)), "The Baptism of Christ", "Principal Feast"],
      [addDays(easter, -46), "Ash Wednesday", "Principal Holy Day"],
      [addDays(easter, -3), "Maundy Thursday", "Principal Holy Day"],
      [addDays(easter, -2), "Good Friday", "Principal Holy Day"],
      [easter, "Easter Day", "Principal Feast"],
      [addDays(easter, 39), "Ascension Day", "Principal Feast"],
      [addDays(easter, 49), "The Day of Pentecost", "Principal Feast"],
      [addDays(easter, 56), "Trinity Sunday", "Principal Feast"],
      [annunciationDate(year), "The Annunciation of our Saviour to the Blessed Virgin Mary", "Principal Feast"]
    ].find(([when]) => sameDate(date, when));
    return moving ? { name: moving[1], rank: moving[2] } : null;
  }

  function festivalCalendarOptions(year, placements) {
    return fixedFestivals.flatMap(festival => [[festival.month, festival.day], ...festival.alternateDates].map(([month, day], index) => ({
      ...festival,
      month,
      day,
      nominal: atNoon(year, month, day),
      role: index === 0 ? "Official Calendar date" : "Authorised alternative date",
      optionIndex: index,
      optionKey: `${festival.name}|${month}|${day}`
    })).map(item => {
      const liturgicalStartYear = liturgicalStartYearForDate(item.nominal);
      const choiceKey = festivalChoiceKey(item.name, liturgicalStartYear);
      const choice = placements?.[choiceKey] || "unconfirmed";
      const active = item.alternateDates.length === 0 || (choice === "alternative" ? item.optionIndex > 0 : item.optionIndex === 0);
      return { ...item, liturgicalStartYear, choiceKey, choice, active };
    })).sort((a, b) => a.nominal - b.nominal || a.name.localeCompare(b.name));
  }

  function sundaySeason(date) {
    const year = date.getFullYear();
    const easter = gregorianEaster(year);
    if (date >= adventOne(year) && date < atNoon(year, 11, 25)) return "Advent";
    if (date >= addDays(easter, -46) && date < easter) return "Lent";
    if (date >= easter && date <= addDays(easter, 49)) return "Eastertide";
    return "Ordinary Time";
  }

  function initialFestivalCollision(item, placements) {
    const nominal = item.nominal;
    const easter = gregorianEaster(nominal.getFullYear());
    const palmSunday = addDays(easter, -7);
    const secondSundayOfEaster = addDays(easter, 7);
    if ((item.name === "St Joseph of Nazareth" || item.name === "St Mark the Evangelist")
      && nominal >= palmSunday && nominal <= secondSundayOfEaster) {
      return {
        kind: "protected-period",
        blockedBy: "the Palm Sunday–Second Sunday of Easter protected period",
        explanation: `${item.name} follows its express transfer rule for this protected period.`,
        firstCandidate: addDays(easter, 8)
      };
    }
    const principal = principalBlockerOn(nominal, placements);
    if (principal) return {
      kind: "precedence",
      blockedBy: principal.name,
      blockerRank: principal.rank,
      explanation: `${principal.name} has precedence over ${item.name}.`,
      firstCandidate: addDays(nominal, 1)
    };
    if (nominal > easter && nominal <= addDays(easter, 7)) return {
      kind: "protected-period",
      blockedBy: "Easter Week",
      explanation: "A saint’s day is not celebrated in Easter Week.",
      firstCandidate: addDays(easter, 8)
    };
    if (nominal.getDay() === 0) {
      const season = sundaySeason(nominal);
      return {
        kind: "sunday",
        blockedBy: `${season} Sunday`,
        explanation: season === "Ordinary Time"
          ? "The interface follows the permitted transfer from this Ordinary Sunday to the next suitable weekday."
          : `A Festival is not celebrated on a Sunday in ${season}.`,
        firstCandidate: addDays(nominal, 1)
      };
    }
    return null;
  }

  function candidateBlocker(date, current, placements, calendarOptions, reserved) {
    const principal = principalBlockerOn(date, placements);
    if (principal) return { name: principal.name, rank: principal.rank };
    const easter = gregorianEaster(date.getFullYear());
    if (date > easter && date <= addDays(easter, 7)) return { name: "Easter Week", rank: "Protected period" };
    if (date.getDay() === 0) return { name: `${sundaySeason(date)} Sunday`, rank: "Sunday" };
    const calendarFestival = calendarOptions.find(item => item.active && item.optionKey !== current.optionKey && sameDate(item.nominal, date));
    if (calendarFestival) return { name: calendarFestival.name, rank: "Festival" };
    const reservedFestival = reserved.get(formatISO(date));
    if (reservedFestival) return { name: reservedFestival, rank: "Festival transferred earlier" };
    return null;
  }

  function festivalSchedule(year, placements) {
    const options = festivalCalendarOptions(year, placements);
    const reserved = new Map();
    return options.map(item => {
      if (!item.active) return { ...item, observed: cloneDate(item.nominal), collision: null, transferChain: [] };
      const collision = initialFestivalCollision(item, placements);
      let observed = cloneDate(item.nominal);
      const transferChain = collision ? [{ name: collision.blockedBy, rank: collision.blockerRank || "Calendar rule" }] : [];
      if (collision) {
        observed = cloneDate(collision.firstCandidate);
        let blocker = candidateBlocker(observed, item, placements, options, reserved);
        while (blocker) {
          transferChain.push(blocker);
          observed = addDays(observed, 1);
          blocker = candidateBlocker(observed, item, placements, options, reserved);
        }
      }
      reserved.set(formatISO(observed), item.name);
      return { ...item, observed, collision, transferChain };
    });
  }

  function festivalObservedDate(festival, year, placements) {
    const scheduled = festivalSchedule(year, placements).find(item =>
      item.name === festival.name && item.month === festival.month && item.day === festival.day
    );
    return scheduled ? cloneDate(scheduled.observed) : atNoon(year, festival.month, festival.day);
  }

  function festivalMayBeKeptOnSunday(date, placements) {
    if (date.getDay() !== 0) return false;
    if (principalBlockerOn(date, placements)) return false;
    const year = date.getFullYear();
    const easter = gregorianEaster(year);
    const inAdvent = date >= adventOne(year) && date < atNoon(year, 11, 25);
    const inLent = date >= addDays(easter, -46) && date < easter;
    const inEastertide = date >= easter && date <= addDays(easter, 49);
    return !inAdvent && !inLent && !inEastertide;
  }

  function transferableFeasts(year) {
    const secondSundayChristmas = sundayOnOrBefore(atNoon(year, 0, 5));
    const hasSecondSundayChristmas = secondSundayChristmas.getMonth() === 0 && secondSundayChristmas.getDate() >= 2;
    return [
      {
        id: "epiphany", name: "The Epiphany", nominal: atNoon(year, 0, 6),
        assigned: hasSecondSundayChristmas ? secondSundayChristmas : atNoon(year, 0, 6),
        rule: "6 January or, when there is a Second Sunday of Christmas, that Sunday"
      },
      {
        id: "presentation", name: "The Presentation of Jesus in the Temple", nominal: atNoon(year, 1, 2),
        assigned: sundayOnOrAfter(atNoon(year, 0, 28)),
        rule: "2 February or the Sunday between 28 January and 3 February"
      },
      {
        id: "allSaints", name: "All Saints’ Day", nominal: atNoon(year, 10, 1),
        assigned: sundayOnOrAfter(atNoon(year, 9, 30)),
        rule: "1 November or the Sunday between 30 October and 5 November"
      }
    ].map(item => ({ ...item, placementKey: `${item.id}-${year}` }));
  }

  function transferOptionForDate(input) {
    const date = cloneDate(input);
    return transferableFeasts(date.getFullYear()).find(item => sameDate(date, item.nominal) || sameDate(date, item.assigned)) || null;
  }

  function liturgicalContext(sunday) {
    const civilYear = sunday.getFullYear();
    const startYear = sunday >= adventOne(civilYear) ? civilYear : civilYear - 1;
    return {
      startYear,
      cycle: ["A", "B", "C"][mod(startYear, 3)],
      advent: adventOne(startYear),
      nextAdvent: adventOne(startYear + 1),
      easter: gregorianEaster(startYear + 1)
    };
  }

  function observance(name, rank, options) {
    return Object.assign({ name, rank, sourceUrl: PRECEDENCE_SOURCE, replacesSunday: rank !== "Festival" }, options || {});
  }

  function annunciationDate(year) {
    const nominal = atNoon(year, 2, 25);
    const easter = gregorianEaster(year);
    const palmSunday = addDays(easter, -7);
    const secondSundayOfEaster = addDays(easter, 7);
    if (nominal >= palmSunday && nominal <= secondSundayOfEaster) return addDays(easter, 8);
    if (nominal.getDay() === 0) return addDays(nominal, 1);
    return nominal;
  }

  function allSoulsDate(year) {
    const nominal = atNoon(year, 10, 2);
    return nominal.getDay() === 0 ? addDays(nominal, 1) : nominal;
  }

  function observancesOn(input, placements) {
    const date = cloneDate(input);
    const year = date.getFullYear();
    const matches = [];
    const fixedPrincipal = fixedPrincipalFeasts.find(item => item.month === date.getMonth() && item.day === date.getDate());
    if (fixedPrincipal && !transferablePrincipalNames.has(fixedPrincipal.name)) matches.push(observance(fixedPrincipal.name, "Principal Feast", {
      lookupName: fixedPrincipal.name,
      sourceUrl: PRECEDENCE_SOURCE,
      note: "The 2024 General Synod Appendix B classifies this as a Principal Feast. Its provision is not displaced by another celebration when it falls on Sunday."
    }));

    transferableFeasts(year).forEach(item => {
      const placement = placements?.[item.placementKey] || "date";
      const observedDate = placement === "sunday" ? item.assigned : item.nominal;
      if (sameDate(date, observedDate)) matches.push(observance(item.name, "Principal Feast", {
        lookupName: item.name,
        sourceUrl: PRECEDENCE_SOURCE,
        transferId: item.id,
        placementKey: item.placementKey,
        placement,
        nominalDate: item.nominal,
        assignedDate: item.assigned,
        note: `${item.name} is being observed on ${placement === "sunday" ? "the assigned Sunday" : "its calendar date"}. Permitted rule: ${item.rule}.`
      }));
      if (!sameDate(item.nominal, item.assigned) && sameDate(date, placement === "sunday" ? item.nominal : item.assigned)) {
        matches.push(observance(item.name, "Available observance", {
          replacesSunday: false,
          informational: true,
          transferId: item.id,
          placementKey: item.placementKey,
          placement,
          nominalDate: item.nominal,
          assignedDate: item.assigned,
          note: `${item.name} is currently placed on ${formatLong(observedDate)}; it may instead be observed here.`
        }));
      }
    });

    const easter = gregorianEaster(year);
    const moving = [
      [sundayOnOrAfter(atNoon(year, 0, 7)), "The Baptism of Christ", "Principal Feast", "Baptism of the Lord"],
      [addDays(easter, -46), "Ash Wednesday", "Principal Holy Day", "Ash Wednesday"],
      [addDays(easter, -6), "Monday in Holy Week", "Holy Day", "Monday in Holy Week"],
      [addDays(easter, -5), "Tuesday in Holy Week", "Holy Day", "Tuesday in Holy Week"],
      [addDays(easter, -4), "Wednesday in Holy Week", "Holy Day", "Wednesday in Holy Week"],
      [addDays(easter, -3), "Maundy Thursday", "Principal Holy Day", "Maundy Thursday"],
      [addDays(easter, -2), "Good Friday", "Principal Holy Day", "Good Friday"],
      [addDays(easter, -1), "Holy Saturday", "Holy Day", "Holy Saturday"],
      [easter, "Easter Day", "Principal Feast", "Easter Day"],
      [addDays(easter, 39), "Ascension Day", "Principal Feast", "Ascension Day"],
      [addDays(easter, 49), "The Day of Pentecost", "Principal Feast", "The Day of Pentecost"],
      [addDays(easter, 56), "Trinity Sunday", "Principal Feast", "Trinity Sunday"],
      [addDays(adventOne(year), -7), "Christ the King (or The Reign of Christ) Sunday", "Festival", ordinaryName(34)]
    ];
    moving.forEach(([when, name, rank, lookupName]) => {
      if (!sameDate(date, when)) return;
      matches.push(observance(name, rank, {
        lookupName,
        replacesSunday: rank !== "Festival" || name.startsWith("Christ the King"),
        subtitle: name.startsWith("Christ the King") ? ordinaryName(34) : "",
        note: name.startsWith("Christ the King") ? "Official Lectionary heading for the Sunday before Advent." : "Calculated from the Church year."
      }));
    });

    const tePouhere = tePouhereSunday(year);
    if (sameDate(date, tePouhere)) matches.push(observance("Te Pouhere Sunday", "Designated Sunday", {
      replacesSunday: false,
      informational: true,
      sourceUrl: CALENDAR_SOURCE,
      note: "Second Sunday after Pentecost (the Sunday after Trinity), designated by General Synod to celebrate our life as a three Tikanga Church."
    }));

    const annunciation = annunciationDate(year);
    if (sameDate(date, annunciation)) matches.push(observance("The Annunciation of our Saviour to the Blessed Virgin Mary", "Principal Feast", {
      lookupName: "The Annunciation of our Saviour to the Blessed Virgin Mary",
      note: annunciation.getDate() === 25 ? "Observed on 25 March." : `Transferred from 25 March to ${formatLong(annunciation)} under the precedence rule.`
    }));

    const allSoulsNominal = atNoon(year, 10, 2);
    const allSoulsObserved = allSoulsDate(year);
    if (sameDate(date, allSoulsObserved)) matches.push(observance("All Souls’ Day", "Other Holy Day", {
      lookupName: "All Souls’ Day",
      replacesSunday: false,
      nominalDate: allSoulsNominal,
      observedDate: allSoulsObserved,
      sourceUrl: CALENDAR_SOURCE,
      note: sameDate(allSoulsNominal, allSoulsObserved)
        ? "All Souls’ Day, the Commemoration of the Faithful Departed, is observed on its Calendar date, 2 November."
        : `All Souls’ Day is transferred from Sunday 2 November to ${formatLong(allSoulsObserved)}. The annual Lectionary permits Monday or the next suitable weekday; it does not displace the Sunday.`
    }));
    if (!sameDate(allSoulsNominal, allSoulsObserved) && sameDate(date, allSoulsNominal)) matches.push(observance("All Souls’ Day", "Transferred Holy Day", {
      lookupName: "All Souls’ Day",
      replacesSunday: false,
      informational: true,
      nominalDate: allSoulsNominal,
      observedDate: allSoulsObserved,
      sourceUrl: CALENDAR_SOURCE,
      note: `All Souls’ Day does not displace this Sunday. Its provision is shown on ${formatLong(allSoulsObserved)}; the annual Lectionary permits Monday or the next suitable weekday.`
    }));

    fixedFestivals.forEach(festival => {
      const liturgicalStartYear = liturgicalStartYearForDate(date);
      const liturgicalStart = adventOne(liturgicalStartYear);
      const dateInLiturgicalYear = (month, day) => {
        const inStartYear = atNoon(liturgicalStartYear, month, day);
        return inStartYear >= liturgicalStart ? inStartYear : atNoon(liturgicalStartYear + 1, month, day);
      };
      const calendarOptions = [[festival.month, festival.day], ...festival.alternateDates];
      const choiceKey = festivalChoiceKey(festival.name, liturgicalStartYear);
      const choice = placements?.[choiceKey] || "unconfirmed";
      const activeOptionIndex = choice === "alternative" ? 1 : 0;
      const schedules = new Map();
      const authorisedDates = calendarOptions.map(([month, day], index) => {
        const nominal = dateInLiturgicalYear(month, day);
        const scheduleYear = nominal.getFullYear();
        if (!schedules.has(scheduleYear)) schedules.set(scheduleYear, festivalSchedule(scheduleYear, placements));
        const scheduled = schedules.get(scheduleYear).find(item =>
          item.name === festival.name && item.month === month && item.day === day
        );
        return {
          nominal,
          observed: scheduled ? scheduled.observed : nominal,
          role: index === 0 ? "Official Calendar date" : "Authorised alternative date",
          optionIndex: index,
          active: festival.alternateDates.length === 0 || index === activeOptionIndex,
          collision: scheduled?.collision || null,
          transferChain: scheduled?.transferChain || []
        };
      });
      const choiceText = authorisedDates.length > 1
        ? `The official Calendar date is ${new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long" }).format(authorisedDates[0].nominal)}; ${new Intl.DateTimeFormat("en-NZ", { day: "numeric", month: "long" }).format(authorisedDates[1].nominal)} is an authorised alternative in this liturgical year.`
        : "";
      const choiceNote = authorisedDates.length < 2 ? "" : choice === "alternative"
        ? (authorisedDates[1].nominal > authorisedDates[0].nominal
          ? `The authorised alternative is selected because the feast was not recorded as observed on its official date.`
          : `The authorised alternative is selected in place of the later official date in this liturgical year.`)
        : choice === "official"
          ? `The official-date provision is selected; the alternative remains available for reference only.`
          : `Observance status is not yet confirmed; the official date remains the active appointment until a choice is recorded.`;

      authorisedDates.forEach(({ nominal: nominalDate, observed: observedDate, active, optionIndex, collision, transferChain }) => {
        const chainText = transferChain.length > 1
          ? ` The transfer also skips ${transferChain.slice(1).map(item => item.name).join(", ")}.`
          : "";
        const collisionText = collision
          ? `${collision.explanation} It is observed on ${formatLong(observedDate)}, the first available day.${chainText}`
          : "";
        const sharedOptions = {
          lookupName: festival.name,
          replacesSunday: false,
          nominalDate,
          observedDate,
          authorisedDates,
          collision,
          transferChain,
          choiceKey,
          choice,
          liturgicalStartYear,
          optionIndex
        };
        if (active && sameDate(date, observedDate)) matches.push(observance(festival.name, "Festival", {
          ...sharedOptions,
          note: [choiceText, choiceNote, sameDate(nominalDate, observedDate)
            ? (date.getDay() === 0 ? "A festival falling on an ordinary Sunday may be kept that day or transferred by local choice." : "Festival listed on this authorised Calendar date.")
            : `Transferred from ${formatLong(nominalDate)}. ${collisionText}${festivalMayBeKeptOnSunday(nominalDate, placements) ? " The Calendar also permits it to be kept on that Ordinary Sunday by local choice." : ""}`].filter(Boolean).join(" ")
        }));
        if (active && !sameDate(nominalDate, observedDate) && sameDate(date, nominalDate)) matches.push(observance(festival.name, "Transferred festival", {
          ...sharedOptions,
          informational: true,
          note: [choiceText, choiceNote, collisionText, festivalMayBeKeptOnSunday(nominalDate, placements) ? "The Calendar also permits it to be kept on that Ordinary Sunday by local choice." : ""].filter(Boolean).join(" ")
        }));
        if (!active && sameDate(date, nominalDate)) matches.push(observance(festival.name, "Available observance", {
          ...sharedOptions,
          informational: true,
          collision: null,
          transferChain: [],
          note: `${choiceText} ${choiceNote} ${optionIndex === 0 ? "The official date is not the selected appointment." : "The authorised alternative is shown for reference only."}`
        }));
      });
    });
    return matches;
  }

  function ordinaryName(number) {
    return `The ${ordinalWords[number]} Sunday in Ordinary Time`;
  }

  function classification(name, season, context, sunday, rule, warning) {
    return { available: true, name, season, context, sunday, rule, warning: warning || null };
  }

  function unavailable(name, message, context, sunday, rule) {
    return { available: false, name, message, context, sunday, rule };
  }

  function classifySunday(input, placements) {
    const sunday = cloneDate(input);
    if (sunday.getDay() !== 0) throw new Error("classifySunday expects a Sunday");
    const context = liturgicalContext(sunday);
    const { startYear, advent, nextAdvent, easter } = context;
    const warningObservance = observancesOn(sunday, placements).find(item => !item.replacesSunday && !item.informational);
    const warning = warningObservance ? `${warningObservance.name} also falls on this Sunday. ${warningObservance.note}` : null;
    const christmasDay = atNoon(startYear, 11, 25);
    const followingYear = startYear + 1;

    if (sameDate(sunday, christmasDay)) {
      return unavailable("Christmas Day", "Christmas Day readings are not present in the current Sunday-only workbook.", context, sunday, "Fixed principal feast");
    }

    if (sunday >= advent && sunday < christmasDay) {
      const week = Math.floor(diffDays(sunday, advent) / 7) + 1;
      const names = ["", "The First Sunday of Advent", "The Second Sunday of Advent", "The Third Sunday of Advent", "The Fourth Sunday of Advent"];
      return classification(names[week], "Season of Advent", context, sunday, `Week ${week} from Advent 1`, warning);
    }

    const epiphany = atNoon(followingYear, 0, 6);
    if (sameDate(sunday, epiphany)) {
      return unavailable("The Epiphany", "Epiphany readings are not present in the current Sunday-only workbook. A later precedence stage will decide whether it is kept or transferred.", context, sunday, "Fixed principal feast");
    }

    if (sunday > christmasDay && sunday < epiphany) {
      const firstChristmasSunday = sundayOnOrAfter(addDays(christmasDay, 1));
      const week = Math.floor(diffDays(sunday, firstChristmasSunday) / 7) + 1;
      const name = week === 1 ? "The First Sunday of Christmas" : "The Second Sunday of Christmas";
      return classification(name, "Season of Christmas", context, sunday, `Sunday ${week} after Christmas Day and before Epiphany`, warning);
    }

    const lentOne = addDays(easter, -42);
    const palmSunday = addDays(easter, -7);
    const pentecost = addDays(easter, 49);
    const trinity = addDays(easter, 56);

    if (sunday >= lentOne && sunday < easter) {
      const week = Math.floor(diffDays(sunday, lentOne) / 7) + 1;
      const names = {
        1: "The First Sunday in Lent", 2: "The Second Sunday in Lent",
        3: "The Third Sunday in Lent", 4: "The Fourth Sunday in Lent",
        5: "Passion Sunday", 6: "Palm Sunday"
      };
      return classification(names[week], "Season of Lent", context, sunday, `Calculated from Easter: ${week === 6 ? "Palm Sunday" : `Lent ${week}`}`, warning);
    }

    if (sunday >= easter && sunday <= trinity) {
      const week = Math.floor(diffDays(sunday, easter) / 7);
      if (week === 0) return classification("Easter Day", "Season of Easter", context, sunday, "Gregorian Easter calculation", warning);
      if (week >= 1 && week <= 6) {
        const names = ["", "The Second Sunday of Easter", "The Third Sunday of Easter", "The Fourth Sunday of Easter", "The Fifth Sunday of Easter", "The Sixth Sunday of Easter", "The Seventh Sunday of Easter"];
        return classification(names[week], "Season of Easter", context, sunday, `Easter + ${week} week${week === 1 ? "" : "s"}`, warning);
      }
      if (sameDate(sunday, pentecost)) return classification("The Day of Pentecost", "Day of Pentecost", context, sunday, "Easter + 49 days", warning);
      return classification("Trinity Sunday", "Trinity Sunday", context, sunday, "Easter + 56 days", warning);
    }

    if (sunday > epiphany && sunday < lentOne) {
      const januaryDay = sunday.getMonth() === 0 ? sunday.getDate() : null;
      if (januaryDay !== null && januaryDay >= 7 && januaryDay <= 13) return classification("Baptism of the Lord", "Season of Epiphany", context, sunday, "Sunday between 7 and 13 January", warning);
      if (januaryDay !== null && januaryDay >= 14 && januaryDay <= 20) return classification("The Second Sunday of Epiphany", "Season of Epiphany", context, sunday, "Sunday between 14 and 20 January", warning);
      if (januaryDay !== null && januaryDay >= 21 && januaryDay <= 27) return classification("The Third Sunday of Epiphany", "Season of Epiphany", context, sunday, "Sunday between 21 and 27 January", warning);
      if ((sunday.getMonth() === 0 && sunday.getDate() >= 28) || (sunday.getMonth() === 1 && sunday.getDate() <= 3)) return classification("The Fourth Sunday of Epiphany", "Season of Epiphany", context, sunday, "Sunday between 28 January and 3 February", warning);

      const ordinaryFive = sundayOnOrAfter(atNoon(followingYear, 1, 4));
      const number = 5 + Math.floor(diffDays(sunday, ordinaryFive) / 7);
      if (number >= 5 && number <= 9) return classification(ordinaryName(number), "Ordinary Time", context, sunday, `Pre-Lent Epiphany sequence: Ordinary ${number}${number >= 6 ? ` / Proper ${number - 5}` : " (no numbered RCL Proper)"}. Placement follows Epiphany, not a backwards count through Lent and Easter.`, warning);
    }

    if (sunday > trinity && sunday < nextAdvent) {
      const christTheKing = addDays(nextAdvent, -7);
      const weeksBeforeKing = Math.round(diffDays(christTheKing, sunday) / 7);
      const proper = 29 - weeksBeforeKing;
      const number = proper + 5;
      if (number >= 8 && number <= 34) return classification(ordinaryName(number), "Ordinary Time", context, sunday, `Post-Trinity sequence: Ordinary ${number} / Proper ${proper}, ${weeksBeforeKing} week(s) before Christ the King (Proper 29, ${formatISO(christTheKing)}). Equivalent to the recurring RCL date windows; Easter determines the first available Proper after Trinity. Displacing feasts do not renumber the underlying Sunday or later weeks.`, warning);
    }

    return unavailable("Sunday not classified", "This date falls outside the rules currently represented in the specification.", context, sunday, "No matching rule");
  }

  function resolveSelectedDate(selected, mode) {
    const date = cloneDate(selected);
    if (date.getDay() === 0) return date;
    return mode === "previous" ? sundayOnOrBefore(date) : sundayOnOrAfter(date);
  }

  function classifyObservance(date, item) {
    const context = liturgicalContext(date);
    const entryAvailable = Boolean(item.lookupName);
    return {
      available: entryAvailable,
      name: item.name,
      lookupName: item.lookupName || item.name,
      subtitle: item.subtitle || "",
      season: item.rank,
      context,
      sunday: cloneDate(date),
      rule: item.note || item.rank,
      sourceUrl: item.sourceUrl,
      message: entryAvailable ? "" : "This observance is identified from the official Calendar. Its Eucharistic readings have not yet been added to the extracted interface data.",
      warning: item.collision ? item.note : null,
      observance: item
    };
  }

  function resolveSelection(selected, mode, placements, festivalOverrideName) {
    const date = cloneDate(selected);
    const observances = observancesOn(date, placements);
    const selectedFestival = festivalOverrideName && observances.find(item => item.name === festivalOverrideName && item.lookupName);
    if (selectedFestival) {
      return { displayDate: date, result: classifyObservance(date, selectedFestival), adjusted: false, observances };
    }
    const activeObservances = observances.filter(item => !item.informational);
    const precedence = activeObservances.find(item => item.replacesSunday);
    if (date.getDay() !== 0 && activeObservances.length) {
      return { displayDate: date, result: classifyObservance(date, precedence || activeObservances[0]), adjusted: false, observances };
    }
    if (date.getDay() === 0 && precedence) {
      return { displayDate: date, result: classifyObservance(date, precedence), adjusted: false, observances };
    }
    const sunday = resolveSelectedDate(date, mode);
    // Resolve the destination's precedence exactly as a direct Sunday click does.
    if (!sameDate(date, sunday)) {
      const destination = resolveSelection(sunday, mode, placements);
      return { ...destination, adjusted: true };
    }
    return { displayDate: sunday, result: classifySunday(sunday, placements), adjusted: false, observances };
  }

  function findEntry(result, data) {
    if (!result.available) return null;
    const cycleName = `Year ${result.context.cycle}`;
    const lookupName = result.lookupName || result.name;
    return data.find(row => row.name === lookupName && (row.year === cycleName || row.year === "Years A, B, C")) || null;
  }

  function splitTrack(value) {
    const text = String(value || "").trim();
    const related = /\bRelated:\s*/i.exec(text);
    if (!/^Continuous(?:\s+option\s+1)?:/i.test(text) || !related) return { continuous: text, related: text, split: false };
    const continuous = text.slice(0, related.index).replace(/^Continuous:\s*/i, "").trim();
    const relatedText = text.slice(related.index + related[0].length).trim();
    return { continuous, related: relatedText, split: true };
  }

  function readingTracks(entry) {
    const ot = splitTrack(entry.ot);
    const psalm = splitTrack(entry.psalm);
    const duplicateOtTracks = ot.split && ot.continuous === ot.related;
    if (duplicateOtTracks && psalm.split) {
      return {
        hasDistinctTracks: false,
        continuous: { ot: ot.continuous, psalm: `${psalm.continuous}\nor ${psalm.related}`, nt: entry.nt, gospel: entry.gospel },
        related: { ot: ot.continuous, psalm: `${psalm.continuous}\nor ${psalm.related}`, nt: entry.nt, gospel: entry.gospel }
      };
    }
    return {
      hasDistinctTracks: ot.split || psalm.split,
      continuous: { ot: ot.continuous, psalm: psalm.continuous, nt: entry.nt, gospel: entry.gospel },
      related: { ot: ot.related, psalm: psalm.related, nt: entry.nt, gospel: entry.gospel }
    };
  }

  function liturgicalColour(input, result, placements) {
    const date = cloneDate(input);
    const colourData = root.LITURGICAL_COLOUR_DATA || {};
    const codes = colourData.codes || {};
    const resultName = result?.name || "";
    const name = sameDate(date, tePouhereSunday(date.getFullYear())) ? "Te Pouhere Sunday" : resultName;
    const easter = gregorianEaster(date.getFullYear());
    const ascension = addDays(easter, 39);
    const pentecost = addDays(easter, 49);
    const palmSunday = addDays(easter, -7);
    const ashWednesday = addDays(easter, -46);
    const christmas = atNoon(date.getMonth() === 11 ? date.getFullYear() : date.getFullYear() - 1, 11, 25);
    const presentation = atNoon(date.getFullYear(), 1, 2);
    const allSaints = atNoon(date.getFullYear(), 10, 1);
    const nextAdvent = adventOne(date.getFullYear());
    const classificationKey = colourData.observanceClassifications?.[name] || null;
    const classification = classificationKey ? colourData.classifications?.[classificationKey] : null;
    let primary = classification?.code || colourData.sundayOverrides?.[name] || null;
    let basis = classification ? `Classification: ${classification.label}` : (primary ? "Named Sunday or principal observance" : "General Synod seasonal rule");

    if (!primary) {
      if (date >= christmas && date <= presentation) primary = "W";
      else if (date >= ashWednesday && date < palmSunday) primary = "V";
      else if (date >= palmSunday && date < easter) primary = "R";
      else if (date >= easter && date <= ascension) primary = "W";
      else if (date > ascension && date <= pentecost) primary = "R";
      else if (date >= adventOne(date.getFullYear()) && date < atNoon(date.getFullYear(), 11, 25)) primary = "V";
      else primary = "G";
    }

    let optional = classification?.optionalCode || null;
    let optionalBracketed = Boolean(classification?.optionalBracketed);
    if (!optional && date >= allSaints && date < nextAdvent && name !== "All Saints’ Day") {
      optional = "R";
      optionalBracketed = true;
    }

    let evening = null;
    let eveningFor = "";
    const tomorrowObservances = observancesOn(addDays(date, 1), placements || {});
    const tomorrowMajor = tomorrowObservances.find(item => item.rank === "Principal Feast" || item.rank === "Principal Holy Day");
    if (tomorrowMajor) {
      const nextCode = colourData.principalFeastColours?.[tomorrowMajor.name];
      if (nextCode && nextCode !== primary) {
        evening = nextCode;
        eveningFor = tomorrowMajor.name;
      }
    }

    const evidence = colourData.annualEvidence?.[formatISO(date)] || null;
    if (evidence && !classification) {
      primary = evidence.primary || primary;
      optional = evidence.optional || optional;
      optionalBracketed = Boolean(evidence.optionalBracketed || optionalBracketed);
      evening = evidence.evening || evening;
      eveningFor = evidence.eveningFor || eveningFor;
      basis = `Confirmed in the ${evidence.sourceYear} annual Lectionary`;
    }

    const describe = code => ({ code, name: codes[code]?.name || code, css: codes[code]?.css || "unknown" });
    return {
      primary: describe(primary),
      optional: optional ? describe(optional) : null,
      optionalBracketed,
      evening: evening ? describe(evening) : null,
      eveningFor,
      basis,
      evidenceNote: evidence?.note || "",
      sourceUrl: colourData.sourceUrl || "",
      verification: classification ? "Determined by authorised classification" : (evidence ? "Annual entry confirmed" : "Rule-based; annual entry check pending")
    };
  }

  root.LectionaryCore = {
    addDays, adventOne, allSoulsDate, annunciationDate, classifySunday, cloneDate, diffDays, festivalObservedDate, festivalSchedule, findEntry, formatISO,
    formatLong, gregorianEaster, liturgicalColour, liturgicalContext, parseISO, readingTracks,
    observancesOn, resolveSelectedDate, resolveSelection, sameDate, sundayOnOrAfter, sundayOnOrBefore,
    festivalChoiceKey, liturgicalStartYearForDate, principalBlockerOn, tePouhereSunday, transferOptionForDate, transferableFeasts
  };
})(typeof window !== "undefined" ? window : globalThis);

const lectionaryRoot = typeof window !== "undefined" ? window : globalThis;
export const LectionaryCore = lectionaryRoot.LectionaryCore;
