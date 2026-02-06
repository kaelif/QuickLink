-- QuickLink seed: dummy climbers (idempotent)
-- Run after 01_schema.sql in Supabase Dashboard → SQL Editor.
-- Safe to run multiple times: only inserts new rows; existing rows (by seed_id) are updated, not duplicated.
-- Every photo is of the actual famous climber named. Matches frontend/data/dummyClimbers.ts.

set search_path to public;

insert into public.climbers (
  seed_id,
  first_name,
  age,
  latitude,
  longitude,
  climbing_types,
  bio,
  photo_urls
) values
(
  'quicklink-seed-1',
  'Alex',
  31,
  37.7749,
  -122.4194,
  array['sport', 'bouldering'],
  'Sport and bouldering. Always down to try hard projects or just have a good session. Looking for reliable partners who want to push grades.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/400px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/600px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/800px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG/960px-Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Action_Directe_11_%289a%29%2C_Foto_Jorgos_Megos.JPG'
  ]
),
(
  'quicklink-seed-2',
  'Adam',
  32,
  40.01499,
  -105.27055,
  array['sport', 'bouldering'],
  'Lead and boulder. Love long sport routes and hard boulders. Prefer early starts and full days at the crag.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/e/e3/Adam_Ondra_Climbing_WCh_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg/400px-Adam_Ondra_climbing_Silence,_9c_by_PAVEL_BLAZEK_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/Adam_Ondra_climbing_Silence_9c_by_PAVEL_BLAZEK_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Adam_Ondra_climbing_Silence_9c_by_PAVEL_BLAZEK_3.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Adam_Ondra_Climbing_WCh_2018.jpg/600px-Adam_Ondra_Climbing_WCh_2018.jpg'
  ]
),
(
  'quicklink-seed-3',
  'Janja',
  26,
  37.7749,
  -122.41,
  array['sport', 'bouldering'],
  'Competition and outdoor—lead and boulder. Happy to session projects or try new crags. Looking for partners who want to try hard and have fun.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/600px-Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg/600px-Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/960px-Janja_Garnbret_SLO_2017-08-19_2267.jpg'
  ]
),
(
  'quicklink-seed-4',
  'Chris',
  44,
  37.7755,
  -122.418,
  array['sport'],
  'Sport climbing. Decades on the rock—love long routes and hard projects. Down for deep water solo or classic sport. Prefer partners who want full days.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/8/80/Chris_Sharma_-_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/45/Chris_Sharma_%28USA%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/47/2015-04-02_Chris_Sharma.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/9/98/Chris_sharma.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e8/Chris_sharma_%26_skimble.jpg'
  ]
),
(
  'quicklink-seed-5',
  'Alex',
  40,
  40.015,
  -105.271,
  array['trad'],
  'Trad and big wall. Prefer long multipitch and alpine objectives. Have a full rack. Looking for solid partners for long days in the mountains.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/0/0c/Alex_Honnold_El_Capitan_Free_Solo_1.png',
    'https://upload.wikimedia.org/wikipedia/commons/0/01/Alex_Honnold_-_Trento_Film_Festival_2014.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Alex_Honnold_El_Capitan_Free_Solo_1.png/960px-Alex_Honnold_El_Capitan_Free_Solo_1.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Alex_Honnold_-_Trento_Film_Festival_2014.JPG/600px-Alex_Honnold_-_Trento_Film_Festival_2014.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Alex_Honnold_-_Trento_Film_Festival_2014.JPG/960px-Alex_Honnold_-_Trento_Film_Festival_2014.JPG'
  ]
),
(
  'quicklink-seed-6',
  'Nathaniel',
  28,
  40.01499,
  -105.27055,
  array['bouldering'],
  'Bouldering. Love sessioning projects and exploring new boulder fields. V15–V17 range. Down for long days or quick evening sessions.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/400px-Nathaniel_Coleman_%28USA%29_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/600px-Nathaniel_Coleman_%28USA%29_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/800px-Nathaniel_Coleman_%28USA%29_2019.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Nathaniel_Coleman_%28USA%29_2019.jpg/960px-Nathaniel_Coleman_%28USA%29_2019.jpg'
  ]
),
(
  'quicklink-seed-7',
  'Tomoa',
  29,
  37.7749,
  -122.4194,
  array['bouldering'],
  'Bouldering and competition. Love hard boulders and trying new problems. Looking for partners to session with and share beta.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/9/94/Tomoa_Narasaki_JPN_1868.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tomoa_Narasaki_%28cropped%29.jpg/400px-Tomoa_Narasaki_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tomoa_Narasaki_JPN_1868.jpg/600px-Tomoa_Narasaki_JPN_1868.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tomoa_Narasaki_JPN_1868.jpg/960px-Tomoa_Narasaki_JPN_1868.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Tomoa_Narasaki_%28cropped%29.jpg/600px-Tomoa_Narasaki_%28cropped%29.jpg'
  ]
)
on conflict (seed_id) do update set
  first_name = excluded.first_name,
  age = excluded.age,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  climbing_types = excluded.climbing_types,
  bio = excluded.bio,
  photo_urls = excluded.photo_urls,
  updated_at = now();
