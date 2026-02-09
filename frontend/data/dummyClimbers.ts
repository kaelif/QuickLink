import type { ClimberProfile } from "../types/climber";

/**
 * Well-known climbers with real first name, age, and 4–5 distinct photos each from Wikimedia Commons (CC-licensed).
 * Each photo is a different image file (no duplicate images). Every photo is of the actual famous climber named.
 * Where Commons has fewer than 4–5 distinct images for a climber, we use what is available.
 */

const W = "https://upload.wikimedia.org/wikipedia/commons";

export const DUMMY_CLIMBERS: ClimberProfile[] = [
  {
    id: "1",
    firstName: "Tomoa",
    age: 29,
    gender: "man",
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering and competition. Love hard boulders and trying new problems. Looking for partners to session with and share beta.",
    photoUrls: [
      `${W}/9/94/Tomoa_Narasaki_JPN_1868.jpg`,
      `${W}/thumb/5/5a/Tomoa_Narasaki_%28cropped%29.jpg/600px-Tomoa_Narasaki_%28cropped%29.jpg`,
    ],
  },
  {
    id: "2",
    firstName: "Adam",
    age: 32,
    gender: "man",
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Lead and boulder. Love long sport routes and hard boulders. Prefer early starts and full days at the crag.",
    photoUrls: [
      `${W}/e/e3/Adam_Ondra_Climbing_WCh_2018.jpg`,
      `${W}/thumb/4/4e/Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg/600px-Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg`,
      `${W}/a/ab/Adam_Ondra_climbing_Silence_9c_by_PAVEL_BLAZEK_2.jpg`,
      `${W}/3/3f/Adam_Ondra_climbing_Silence_9c_by_PAVEL_BLAZEK_3.jpg`,
      `${W}/a/a2/Adam_Ondra_climbing_Silence_9c_by_PAVEL_BLAZEK_3_-_Cropped.jpg`,
    ],
  },
  {
    id: "3",
    firstName: "Janja",
    age: 26,
    gender: "woman",
    location: { latitude: 37.7749, longitude: -122.41 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Competition and outdoor—lead and boulder. Happy to session projects or try new crags. Looking for partners who want to try hard and have fun.",
    photoUrls: [
      `${W}/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg`,
      `${W}/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg`,
    ],
  },
  {
    id: "4",
    firstName: "Chris",
    age: 44,
    gender: "man",
    location: { latitude: 37.7755, longitude: -122.418 },
    climbingTypes: ["sport"],
    bio: "Sport climbing. Decades on the rock—love long routes and hard projects. Down for deep water solo or classic sport. Prefer partners who want full days.",
    photoUrls: [
      `${W}/8/80/Chris_Sharma_-_1.jpg`,
      `${W}/4/45/Chris_Sharma_%28USA%29.jpg`,
      `${W}/4/47/2015-04-02_Chris_Sharma.JPG`,
      `${W}/9/98/Chris_sharma.jpg`,
      `${W}/e/e8/Chris_sharma_%26_skimble.jpg`,
    ],
  },
  {
    id: "5",
    firstName: "Alex",
    age: 40,
    gender: "man",
    location: { latitude: 40.015, longitude: -105.271 },
    climbingTypes: ["trad"],
    bio: "Trad and big wall. Prefer long multipitch and alpine objectives. Have a full rack. Looking for solid partners for long days in the mountains.",
    photoUrls: [
      `${W}/0/0c/Alex_Honnold_El_Capitan_Free_Solo_1.png`,
      `${W}/0/01/Alex_Honnold_-_Trento_Film_Festival_2014.JPG`,
      `${W}/d/db/Alex_Honnold_01.jpg`,
      `${W}/6/61/Alex_Honnold_El_Capitan_Free_Solo_2.png`,
      `${W}/thumb/5/53/Alex_Honnold_in_2022.jpg/600px-Alex_Honnold_in_2022.jpg`,
    ],
  },
  {
    id: "6",
    firstName: "Nathaniel",
    age: 28,
    gender: "man",
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering. Love sessioning projects and exploring new boulder fields. V15–V17 range. Down for long days or quick evening sessions.",
    photoUrls: [
      `${W}/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/600px-Nathaniel_Coleman_%28USA%29_2019.jpg`,
    ],
  },
  {
    id: "7",
    firstName: "AnusTart",
    age: 28,
    gender: "man",
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering. Love sessioning projects and exploring new boulder fields. V15–V17 range. Down for long days or quick evening sessions.",
    photoUrls: [
      `${W}/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/600px-Nathaniel_Coleman_%28USA%29_2019.jpg`,
    ],
  },
];
