import type { ClimberProfile } from "../types/climber";

export const DUMMY_CLIMBERS: ClimberProfile[] = [
  {
    id: "1",
    firstName: "Alex",
    age: 28,
    location: { latitude: 37.7749, longitude: -122.4194 },
    climbingTypes: ["sport", "bouldering"],
    bio: "Weekend warrior, mostly sport. Looking for someone to hit the crag with on Saturdays. Lead 5.11, comfortable on 5.10 trad.",
    photoUrls: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400",
    ],
  },
  {
    id: "2",
    firstName: "Jordan",
    age: 24,
    location: { latitude: 40.01499, longitude: -105.27055 },
    climbingTypes: ["bouldering"],
    bio: "Boulderer at heart. Happy to session projects or show new people around. V5-V6 range.",
    photoUrls: [
      "https://images.unsplash.com/photo-1589939704324-884dfb8f1fd2?w=400",
    ],
  },
  {
    id: "3",
    firstName: "Sam",
    age: 32,
    location: { latitude: 37.7749, longitude: -122.41 },
    climbingTypes: ["trad", "sport"],
    bio: "Trad and sport climber. Have a full rack and love long multipitch. Always down for a day in the valley.",
    photoUrls: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    ],
  },
  {
    id: "4",
    firstName: "Riley",
    age: 26,
    location: { latitude: 47.6062, longitude: -122.3321 },
    climbingTypes: ["sport", "bouldering", "trad"],
    bio: "I do it all. Prefer sport and bouldering but getting into trad. Looking for reliable partners for weekday evenings.",
    photoUrls: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    ],
  },
  {
    id: "5",
    firstName: "Casey",
    age: 30,
    location: { latitude: 40.015, longitude: -105.271 },
    climbingTypes: ["bouldering", "sport"],
    bio: "Boulderer first, sport second. Usually at the gym Tue/Thu and outside on weekends. 5.11 sport, V5 boulder.",
    photoUrls: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    ],
  },
  {
    id: "6",
    firstName: "Morgan",
    age: 27,
    location: { latitude: 37.7755, longitude: -122.418 },
    climbingTypes: ["trad"],
    bio: "Mostly trad and alpine. Have gear and experience. Looking for someone solid for long days in the mountains.",
    photoUrls: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ],
  },
  {
    id: "7",
    firstName: "Quinn",
    age: 22,
    location: { latitude: 47.607, longitude: -122.333 },
    climbingTypes: ["sport"],
    bio: "New to climbing, mostly sport. Lead 5.9, working on 5.10. Would love a patient partner to learn from!",
    photoUrls: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    ],
  },
  {
    id: "8",
    firstName: "Taylor",
    age: 35,
    location: { latitude: 40.016, longitude: -105.272 },
    climbingTypes: ["sport", "trad"],
    bio: "Climbing for 10+ years. Sport and trad, 5.11/5.10. Prefer early starts and full days. Have a van, can drive.",
    photoUrls: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ],
  },
];
