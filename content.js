/* =====================================================================
   EDIT THIS FILE — every word and photo on the site comes from here.

   Photos live in images/pics/. A photo can be written as:
     "images/pics/firstPic.jpeg"
   or with extras:
     { src: "images/pics/firstPic.jpeg", pos: "50% 18%", caption: "…" }
       pos     → which part of the photo to keep when it's cropped (x% y%)
       caption → shows under it in galleries / the photo viewer

   Tokens you can use in any text:  {name} {nickname} {yourName} {days}
   You can use <em>italics</em> and <br> inside text.
   Pages alternate dark / light automatically, starting dark.
   ===================================================================== */

const P = "images/pics/";
const WA = (t) => `${P}WhatsApp Image 2026-11-10 at 11.29.${t}.jpeg`;

window.MAGAZINE = {
  herName: "Sachi the Soobi doobi",
  nickname: "Soobi doobi",
  yourName: "Aryan the bhondu",
  startDate: "2025-11-11",          // the day it all began (YYYY-MM-DD)

  masthead: "US.",
  issue: "Vol. 01 — No. 01",
  issueDate: "November 2026",
  issueName: "The Anniversary Issue",

  /* ---------- COVER ---------- */
  cover: {
    image: { src: P + "cover_img.jpeg", pos: "33% 0%" },
    headline: "{days} days of <em>us</em>",
    sub: "Starring {name}",
    lines: [
      "The Firsts — where it all started",
      "Festives: Halloween & Diwali",
      "Ragebait, exhibits A to D",
      "Exclusive — a letter, just for you",
    ],
  },

  /* ---------- CONTENTS PAGE ---------- */
  editorsNote: {
    image: { src: WA("45 PM"), pos: "50% 30%" },
    text:
      "This issue is dedicated to the girl who made this year my favourite one yet. " +
      "Every page is a day I never want to forget. Read slowly.",
  },
  stats: [
    { value: "{days}", label: "days" },
    { value: "5", label: "firsts" },
    { value: "{photos}", label: "photos of us" },
    { value: "∞", label: "reasons" },
  ],

  /* ---------- THE PAGES, in order ----------
     type: "chapter"  → one story page. layout: "left" | "right" | "duo" | "full"
           "opener"   → a section divider (big title + parts)
           "collage"  → a section of photos in rows (rows: [2, 3] = 2 then 3 per row)
           "exhibits" → phone screenshots side by side
           "pair"     → two wide photos, overlapping
           "gallery"  → the big "things you sent me" wall (tap to open)
     toc: false hides a page from the Contents list.                         */
  pages: [
    /* ======== THE FIRSTS ======== */
    {
      type: "chapter",
      layout: "left",
      num: "01",
      kicker: "The Firsts",
      title: "The First Picture",
      text: "Before the dates and the inside jokes, this is the first picture you sent me which I loved and you acted all shy when I complemented you!!.",
      images: [{ src: P + "firstPic.jpeg", pos: "50% 18%" }],
    },
    {
      type: "chapter",
      layout: "right",
      num: "02",
      kicker: "The Firsts",
      title: "The First Random Selfie",
      text: "No reason, just small hesitation — I asked randomly for a selfie and here ya you did it. I loved it.",
      quote: "Still the best notification I've ever got.",
      images: [{ src: P + "firstRandomSelfie.jpeg", pos: "50% 42%" }],
    },
    {
      type: "chapter",
      layout: "duo",
      num: "03",
      kicker: "The Firsts",
      title: "The First Big Date",
      text: "The first time we ever bunked and had a full blast. I remember how you tried your best at bowling, you definitely da best benz",
      quote: "You fell asleep on my shoulder after being shy for no reason at start.",
      images: [
        { src: P + "firstBigDate2.jpeg", pos: "50% 88%" },
        { src: P + "firstBigDate.jpeg", ar: "4 / 3", pos: "30% 50%" },
      ],
    },
    {
      type: "chapter",
      layout: "full",
      num: "04",
      kicker: "The Firsts",
      title: "The First Pizza",
      text: "Our first pizza date!! I remember the miscommunication and the chaos, but hey pizza was good right?",
      images: [{ src: P + "firstPizza1.jpeg", pos: "55% 45%" }],
      inset: { src: P + "firstpizza2.jpeg", pos: "55% 45%" },
    },
    {
      type: "chapter",
      layout: "duo",
      num: "05",
      kicker: "The Firsts",
      title: "Six Months",
      text: "The first 6-7 months!! Gotta love the combo and the scrapbook, also how innocently you asked me whether I think you ever smoked, like cudu pls you just a smol bby",
      images: [P + "6month1.jpeg", { src: P + "6months2.jpeg", pos: "50% 40%" }],
    },

    /* ======== FESTIVES ======== */
    {
      type: "opener",
      id: "festives",
      kicker: "Section 02",
      title: "Festives",
      text: "Every celebration got better with you in it — costumes, lights, and far too many photos.",
      parts: [
        { title: "Halloween", href: "#halloween", image: { src: P + "halloween4.jpeg", pos: "50% 40%" } },
        { title: "Diwali", href: "#diwali", image: { src: P + "diwali1.jpeg", pos: "50% 40%" } },
      ],
    },
    {
      type: "collage",
      id: "halloween",
      toc: false,
      kicker: "Festives · Part 01",
      title: "Halloween",
      text: "Hoodies, beanies, tacos and zero fear — except of how cute you looked.",
      rows: [2, 3],
      images: [
        { src: P + "halloween1.jpeg", ar: "3 / 4" },
        { src: P + "halloween2.jpeg", ar: "3 / 4" },
        { src: P + "halloween3.jpeg", ar: "4 / 3" },
        { src: P + "halloween4.jpeg", ar: "4 / 3" },
        { src: P + "halloween5.jpeg", ar: "4 / 3" },
      ],
    },
    {
      type: "collage",
      id: "diwali",
      toc: false,
      flip: true,
      kicker: "Festives · Part 02",
      title: "Diwali",
      text: "Matching yellows, fairy lights, and you — brighter than every diya in the city. Telepathy is real",
      rows: [2, 2],
      images: [
        { src: P + "diwali1.jpeg", ar: "4 / 3" },
        { src: P + "diwali2.jpeg", ar: "640 / 1138" },
        { src: P + "diwali3.jpeg", ar: "4 / 3" },
        { src: P + "diwali4.jpeg", ar: "640 / 1138" },
      ],
    },

    /* ======== RAGEBAIT ======== */
    {
      type: "exhibits",
      id: "ragebait",
      kicker: "Section 03",
      title: "Ragebait",
      text: "Exhibits A to D: Got every single one of your ragebaited moments, hehehe.",
      images: [P + "ragebait1.jpeg", P + "ragebait2.jpeg", P + "ragebait3.jpeg", P + "ragebait4.jpeg"],
    },

    /* ======== HANDS ON ======== */
    {
      type: "pair",
      id: "hands-on",
      kicker: "Section 04",
      title: "Hands On",
      text: "Close enough to squish, and ofcourse always squishing, best workshop I ever attended.",
      images: [P + "handson1.jpeg", P + "handson2.jpeg"],
    },

    /* ======== FIRST WIN ======== */
    {
      type: "chapter",
      layout: "full",
      id: "first-win",
      kicker: "Section 05 · MindSpark '26",
      title: "Our First Win",
      text: "Look at the cudies coding together, turns out we're pretty good at winning things together.",
      images: [{ src: P + "first_win.jpeg", pos: "50% 62%" }],
    },

    /* ======== RANDOMS ======== */
    {
      type: "gallery",
      id: "randoms",
      kicker: "Section 06 · The archive",
      title: "Things you <em>sent</em> me",
      tocTitle: "Things You Sent Me",
      text: "Every single pic you sent me, are absolutely closest to my heart and the best part of my day, I keep coming back to them almost daily.",
      images: [
        WA("36 PM (2)"), WA("37 PM (2)"), WA("37 PM (3)"), WA("37 PM"),
        WA("38 PM (1)"), WA("38 PM (2)"), WA("38 PM"), WA("39 PM (1)"),
        WA("39 PM (2)"), WA("39 PM"), WA("40 PM"), WA("41 PM (1)"),
        WA("41 PM (2)"), WA("41 PM"), WA("42 PM (2)"), WA("42 PM (3)"),
        WA("42 PM"), WA("43 PM (1)"), WA("43 PM (2)"), WA("43 PM"),
        WA("44 PM"), WA("45 PM (1)"), WA("45 PM (2)"), P + "cover_img.jpeg",
        WA("45 PM"), WA("47 PM (2)"), WA("47 PM (3)"), WA("47 PM"),
        WA("48 PM (1)"), WA("48 PM"), WA("49 PM (1)"), WA("49 PM (2)"),
        WA("49 PM"), WA("50 PM (1)"), WA("50 PM (2)"), WA("50 PM"),
        WA("51 PM (1)"), WA("51 PM (2)"), WA("51 PM"),
      ],
    },
  ],

  /* ---------- THE LETTER ---------- */
  letter: {
    kicker: "Letter from the editor",
    title: "For you, on our first year",
    greeting: "Dear {nickname},",
    paragraphs: [
      "Write your letter here. Tell her what this year has meant to you — the little things she does that nobody else notices, the moment you knew, the ways she makes ordinary days better.",
      "Add as many paragraphs as you like. Specific beats poetic: one real memory says more than ten pretty words.",
      "Thank you for every pizza, every late call, every ragebait selfie. Here's to all the issues still to come.",
    ],
    signoff: "Yours, always —",
    signature: "{yourName}",
  },

  /* ---------- BACK COVER ---------- */
  backCover: {
    title: "To be continued…",
    line: "Happy anniversary, {nickname}.",
    nextIssueKicker: "Coming in Issue No. 02",
    nextIssue: [
      "More firsts (we're not even close to done)",
      "A second Diwali in matching colours",
      "A hundred more ragebait selfies",
    ],
  },
};
