import type { ClimberProfile } from "../types/climber";

/**
 * Dummy climbers: well-known climbers with real first name and age.
 * Photos: Wikimedia Commons (CC) where available; otherwise Unsplash placeholders.
 * Gender is consistent: male profiles use male climber images, female profiles use female climber images.
 * (No free CC images of Brooke Raboutou or Margo Hayes, so female climber placeholders are used for them.)
 */

const WIKI = "https://upload.wikimedia.org/wikipedia/commons";

export const DUMMY_CLIMBERS: ClimberProfile[] = [
  {
    id: "1",
    firstName: "Alex",
    age: 31,
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Sport and bouldering. Always down to try hard projects or just have a good session. Looking for reliable partners who want to push grades.",
    photoUrls: [
      `${WIKI}/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/400px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG`,
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
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
      `${WIKI}/e/e3/Adam_Ondra_Climbing_WCh_2018.jpg`,
      `${WIKI}/thumb/4/4e/Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg/400px-Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg`,
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
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
      `${WIKI}/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg`,
      `${WIKI}/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg`,
      `${WIKI}/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/400px-Janja_Garnbret_SLO_2017-08-19_2267.jpg`,
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
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
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
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
    ],
  },
  {
    id: "6",
    firstName: "Margo",
    age: 27,
    location: { latitude: 40.016, longitude: -105.272 },
    climbingTypes: ["sport"],
    bio: "Sport climbing. Love pushing on hard routes and exploring new crags. Looking for partners for weekend projects and weekday sessions.",
    photoUrls: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      "https://images.unsplash.com/photo-1589939704324-884dfb8f1fd2?w=400",
    ],
  },
  {
    id: "7",
    firstName: "Brooke",
    age: 24,
    location: { latitude: 47.6062, longitude: -122.3321 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Sport and boulder. Comp and outdoor. Happy to session projects or try new areas. Looking for reliable partners for weekends and travel.",
    photoUrls: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      "https://images.unsplash.com/photo-1589939704324-884dfb8f1fd2?w=400",
    ],
  },
  {
    id: "8",
    firstName: "Stefano",
    age: 32,
    location: { latitude: 47.607, longitude: -122.333 },
    climbingTypes: ["sport"],
    bio: "Sport climbing. Love hard redpoints and long days at the crag. Looking for partners who want to try hard and enjoy the process.",
    photoUrls: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: "9",
    firstName: "Nathaniel",
    age: 28,
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering. Love sessioning projects and exploring new boulder fields. V15–V17 range. Down for long days or quick evening sessions.",
    photoUrls: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: "10",
    firstName: "Tomoa",
    age: 29,
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["bouldering"],
    bio: "Bouldering and competition. Love hard boulders and trying new problems. Looking for partners to session with and share beta.",
    photoUrls: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
];
