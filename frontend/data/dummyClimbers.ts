import type { ClimberProfile } from "../types/climber";

/**
 * Well-known climbers with real first name, age, and photos from Wikimedia Commons (CC-licensed).
 * Only climbers with at least one real Commons image are included.
 * Multiple photos per climber so the user can swipe through them in the profile.
 */

const W = "https://upload.wikimedia.org/wikipedia/commons";

export const DUMMY_CLIMBERS: ClimberProfile[] = [
  {
    id: "1",
    firstName: "Alex",
    age: 31,
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Sport and bouldering. Always down to try hard projects or just have a good session. Looking for reliable partners who want to push grades.",
    photoUrls: [
      `${W}/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/400px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG`,
    ],
  },
  {
    id: "2",
    firstName: "Adam",
    age: 32,
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Lead and boulder. Love long sport routes and hard boulders. Prefer early starts and full days at the crag.",
    photoUrls: [
      `${W}/e/e3/Adam_Ondra_Climbing_WCh_2018.jpg`,
      `${W}/thumb/4/4e/Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg/400px-Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg`,
    ],
  },
  {
    id: "3",
    firstName: "Janja",
    age: 26,
    location: { latitude: 37.7749, longitude: -122.41 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Competition and outdoor—lead and boulder. Happy to session projects or try new crags. Looking for partners who want to try hard and have fun.",
    photoUrls: [
      `${W}/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg`,
      `${W}/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg`,
      `${W}/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/600px-Janja_Garnbret_SLO_2017-08-19_2267.jpg`,
      `${W}/thumb/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg/400px-Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg`,
    ],
  },
  {
    id: "4",
    firstName: "Chris",
    age: 44,
    location: { latitude: 37.7755, longitude: -122.418 },
    climbingTypes: ["sport"],
    bio: "Sport climbing. Decades on the rock—love long routes and hard projects. Down for deep water solo or classic sport. Prefer partners who want full days.",
    photoUrls: [
      `${W}/8/80/Chris_Sharma_-_1.jpg`,
      `${W}/4/45/Chris_Sharma_%28USA%29.jpg`,
      `${W}/4/47/2015-04-02_Chris_Sharma.JPG`,
      `${W}/thumb/8/80/Chris_Sharma_-_1.jpg/400px-Chris_Sharma_-_1.jpg`,
      `${W}/thumb/4/47/2015-04-02_Chris_Sharma.JPG/400px-2015-04-02_Chris_Sharma.JPG`,
    ],
  },
  {
    id: "5",
    firstName: "Alex",
    age: 40,
    location: { latitude: 40.015, longitude: -105.271 },
    climbingTypes: ["trad"],
    bio: "Trad and big wall. Prefer long multipitch and alpine objectives. Have a full rack. Looking for solid partners for long days in the mountains.",
    photoUrls: [
      `${W}/0/0c/Alex_Honnold_El_Capitan_Free_Solo_1.png`,
      `${W}/thumb/0/0c/Alex_Honnold_El_Capitan_Free_Solo_1.png/960px-Alex_Honnold_El_Capitan_Free_Solo_1.png`,
    ],
  },
  {
    id: "6",
    firstName: "Nathaniel",
    age: 28,
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering. Love sessioning projects and exploring new boulder fields. V15–V17 range. Down for long days or quick evening sessions.",
    photoUrls: [
      `${W}/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg`,
      `${W}/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/400px-Nathaniel_Coleman_%28USA%29_2019.jpg`,
      `${W}/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/600px-Nathaniel_Coleman_%28USA%29_2019.jpg`,
    ],
  },
  {
    id: "7",
    firstName: "Tomoa",
    age: 29,
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering and competition. Love hard boulders and trying new problems. Looking for partners to session with and share beta.",
    photoUrls: [
      `${W}/9/94/Tomoa_Narasaki_JPN_1868.jpg`,
      `${W}/thumb/5/5a/Tomoa_Narasaki_%28cropped%29.jpg/400px-Tomoa_Narasaki_%28cropped%29.jpg`,
      `${W}/thumb/9/94/Tomoa_Narasaki_JPN_1868.jpg/600px-Tomoa_Narasaki_JPN_1868.jpg`,
    ],
  },
];
