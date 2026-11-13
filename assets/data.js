window.SITE = {
  project: {
    name: "Голоса России",
    nameEn: "Voices of Russia"
  },

  contacts: {
    email: null,
    links: [
      { label: "Telegram", href: null },
      { label: "ВКонтакте", href: null },
      { label: "YouTube", href: null }
    ]
  },

  translator: {
    endpoint: "https://api.tartunlp.ai/translation/v2",
    domain: "general",
    base: "rus",
    language: "kca",
    direction: "from-base",
    application: "golosa-rossii",
    provider: { name: "TartuNLP", org: "Тартуский университет", url: "https://www.tartunlp.ai" }
  },

  languages: [
    { id: "rus", name: "Русский", group: "ru" },

    { id: "kca", name: "Хантыйский", group: "small" },
    { id: "mns", name: "Мансийский", group: "small" },
    { id: "vep", name: "Вепсский", group: "small" },
    { id: "vot", name: "Водский", group: "small" },
    { id: "izh_soikkola", name: "Ижорский (сойкинский)", group: "small" },
    { id: "sjd_kuruch", name: "Кильдинский саамский (орфография Куруч)", group: "small", same: "sjd" },
    { id: "sjd_antonova", name: "Кильдинский саамский (орфография Антоновой)", group: "small", same: "sjd" },

    { id: "kpv", name: "Коми", group: "peoples" },
    { id: "koi", name: "Коми-пермяцкий", group: "peoples" },
    { id: "udm", name: "Удмуртский", group: "peoples" },
    { id: "mhr", name: "Марийский (луговой)", group: "peoples" },
    { id: "mrj", name: "Горномарийский", group: "peoples" },
    { id: "myv", name: "Эрзянский", group: "peoples" },
    { id: "mdf", name: "Мокшанский", group: "peoples" },
    { id: "krl", name: "Карельский", group: "peoples" },
    { id: "olo", name: "Ливвиковский", group: "peoples" },
    { id: "lud", name: "Людиковский", group: "peoples" },

    { id: "eng", name: "Английский", group: "world" },
    { id: "hun", name: "Венгерский", group: "world" },
    { id: "vro", name: "Выруский", group: "world" },
    { id: "smn", name: "Инари-саамский", group: "world" },
    { id: "sms", name: "Колтта-саамский", group: "world" },
    { id: "lav", name: "Латышский", group: "world" },
    { id: "liv", name: "Ливский", group: "world" },
    { id: "lit", name: "Литовский", group: "world" },
    { id: "smj", name: "Луле-саамский", group: "world" },
    { id: "ger", name: "Немецкий", group: "world" },
    { id: "nor", name: "Норвежский", group: "world" },
    { id: "sje", name: "Питео-саамский", group: "world" },
    { id: "sme", name: "Северносаамский", group: "world" },
    { id: "ukr", name: "Украинский", group: "world" },
    { id: "fin", name: "Финский", group: "world" },
    { id: "est", name: "Эстонский", group: "world" },
    { id: "sma", name: "Южносаамский", group: "world" }
  ],

  regions: [
    { name: "Мурманская область", lat: 68.0, lon: 35.5,
      peoples: "Саамы", languages: "Кильдинский саамский",
      status: "Территория традиционного проживания саамов", activity: null },
    { name: "Республика Карелия", lat: 63.8, lon: 33.0,
      peoples: "Карелы, вепсы", languages: "Карельский, ливвиковский, людиковский, вепсский",
      status: "Территория традиционного распространения языков", activity: null },
    { name: "Ленинградская область", lat: 60.0, lon: 32.0,
      peoples: "Вепсы, водь, ижорцы", languages: "Вепсский, водский, ижорский",
      status: "Территория традиционного проживания народов", activity: null },
    { name: "Вологодская область", lat: 60.0, lon: 40.5,
      peoples: "Вепсы", languages: "Вепсский",
      status: "Территория традиционного проживания вепсов", activity: null },
    { name: "Республика Коми", lat: 64.0, lon: 54.5,
      peoples: "Коми; также ханты и манси", languages: "Коми, хантыйский, мансийский",
      status: "Территория традиционного распространения языков", activity: null },
    { name: "Пермский край", lat: 59.1, lon: 56.3,
      peoples: "Коми-пермяки", languages: "Коми-пермяцкий",
      status: "Территория традиционного распространения языка", activity: null },
    { name: "Удмуртская Республика", lat: 57.3, lon: 52.6,
      peoples: "Удмурты", languages: "Удмуртский",
      status: "Территория традиционного распространения языка", activity: null },
    { name: "Республика Марий Эл", lat: 56.6, lon: 47.9,
      peoples: "Марийцы", languages: "Марийский (луговой), горномарийский",
      status: "Территория традиционного распространения языков", activity: null },
    { name: "Республика Мордовия", lat: 54.4, lon: 44.4,
      peoples: "Мордва: эрзя и мокша", languages: "Эрзянский, мокшанский",
      status: "Территория традиционного распространения языков", activity: null },
    { name: "Свердловская область", lat: 58.6, lon: 61.5,
      peoples: "Манси", languages: "Мансийский",
      status: "Территория традиционного проживания манси", activity: null },
    { name: "Тюменская область", lat: 57.4, lon: 69.0,
      peoples: "Ханты, манси (в отдельных районах)", languages: "Хантыйский, мансийский",
      status: "Территория традиционного проживания народов", activity: null },
    { name: "Ханты-Мансийский автономный округ — Югра", lat: 62.2, lon: 70.3,
      peoples: "Ханты, манси", languages: "Хантыйский, мансийский",
      status: "Территория традиционного проживания народов", activity: null },
    { name: "Ямало-Ненецкий автономный округ", lat: 66.3, lon: 76.0,
      peoples: "Ханты", languages: "Хантыйский",
      status: "Территория традиционного проживания ханты", activity: null },
    { name: "Томская область", lat: 58.9, lon: 82.2,
      peoples: "Ханты", languages: "Хантыйский",
      status: "Территория традиционного проживания ханты", activity: null }
  ],

  evidence: [
    {
      value: "47",
      text: "народов входят в Единый перечень коренных малочисленных народов Российской Федерации",
      source: "Постановление Правительства РФ № 255 от 24.03.2000, ред. от 18.12.2021",
      url: "https://legalacts.ru/doc/postanovlenie-pravitelstva-rf-ot-24032000-n-255/"
    },
    {
      value: "34",
      text: "субъекта Российской Федерации указаны в перечне как места проживания этих народов",
      source: "Там же, подсчёт по таблице перечня",
      url: "https://legalacts.ru/doc/postanovlenie-pravitelstva-rf-ot-24032000-n-255/"
    },
    {
      value: "< 50 000",
      text: "человек — численность, при которой народ может быть признан коренным малочисленным",
      source: "Федеральный закон № 82-ФЗ от 30.04.1999",
      url: "https://minjust.gov.ru/uploaded/files/fz82.docx"
    }
  ],

  team: [
    { name: null, role: null, photo: null },
    { name: null, role: null, photo: null },
    { name: null, role: null, photo: null },
    { name: null, role: null, photo: null },
    { name: null, role: null, photo: null },
    { name: null, role: null, photo: null }
  ]
};
