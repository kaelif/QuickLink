-- QuickLink seed: dummy climbers + main user + user_likes (idempotent)
-- Run after 01_schema.sql in Supabase Dashboard → SQL Editor.
-- Safe to run multiple times:
--   Climbers: ON CONFLICT (seed_id) DO UPDATE — no duplicate climbers; existing rows updated.
--   user_likes: ON CONFLICT (swiper_id, liked_id) DO NOTHING — no duplicate like rows.
-- Main user: seed_id = 'main-user'. user_likes: half of climbers (seed-1..5) have liked main user for testing.

set search_path to public;

-- 1) Main user (the app user on your phone). Insert first so we can reference in user_likes.
insert into public.climbers (
  seed_id,
  first_name,
  age,
  latitude,
  longitude,
  climbing_types,
  bio,
  photo_urls,
  gender,
  gender_other_text
) values (
  'main-user',
  'Main User',
  30,
  37.7749,
  -122.4194,
  array['sport', 'bouldering'],
  'You — the app user. Matches only when you and the other climber have both swiped right.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/400px-No-Image-Placeholder.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/600px-No-Image-Placeholder.svg.png'
  ],
  'woman',
  ''
)
on conflict (seed_id) do update set
  first_name = excluded.first_name,
  age = excluded.age,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  climbing_types = excluded.climbing_types,
  bio = excluded.bio,
  photo_urls = excluded.photo_urls,
  gender = excluded.gender,
  gender_other_text = excluded.gender_other_text,
  updated_at = now();

-- 2) Other climbers (discovery feed). Include editable fields: gender, gender_other_text.
insert into public.climbers (
  seed_id,
  first_name,
  age,
  latitude,
  longitude,
  climbing_types,
  bio,
  photo_urls,
  gender,
  gender_other_text
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
  ],
  'man',
  ''
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
  ],
  'man',
  ''
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
  ],
  'woman',
  ''
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
  ],
  'man',
  ''
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
  ],
  'man',
  ''
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
  ],
  'man',
  ''
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
  ],
  'man',
  ''
),
(
  'quicklink-seed-8',
  'Brooke',
  24,
  40.01499,
  -105.27055,
  array['sport', 'bouldering'],
  'Sport and bouldering. Competition and outdoor—love hard projects and long days. Olympic silver (Paris 2024). First woman to climb 5.15c. Looking for partners to try hard with.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/600px-Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg/600px-Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/960px-Janja_Garnbret_SLO_2017-08-19_2267.jpg'
  ],
  'woman',
  ''
),
(
  'quicklink-seed-9',
  'Natalia',
  23,
  40.7608,
  -111.8910,
  array['sport', 'bouldering'],
  'Bouldering and lead. Four-time boulder World Cup season champion. Pan Am combined champion. Love sessioning projects and competing. Based in Salt Lake City.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/600px-Janja_Garnbret_SLO_2017-08-19_2267.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg/600px-Climbing_World_Championships_2018_Boulder_Final_Garnbret_%28BT0A8080%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Janja_Garnbret_SLO_2017-08-19_2267.jpg/960px-Janja_Garnbret_SLO_2017-08-19_2267.jpg'
  ],
  'woman',
  ''
),
(
  'quicklink-seed-10',
  'Ashima',
  23,
  40.7128,
  -74.0060,
  array['sport', 'bouldering'],
  'Bouldering and sport. First woman to climb V15 (Horizon). Youth world champ, national champ. Love hard boulders and creative problems. NYC-based.',
  array[
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg/400px-Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg/600px-Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg/960px-Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e8/Climbing_World_Championships_2018_Lead_Final_Woman_finalists_01-Ashima_Shiraishi.jpg'
  ],
  'woman',
  ''
)
on conflict (seed_id) do update set
  first_name = excluded.first_name,
  age = excluded.age,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  climbing_types = excluded.climbing_types,
  bio = excluded.bio,
  photo_urls = excluded.photo_urls,
  gender = excluded.gender,
  gender_other_text = excluded.gender_other_text,
  updated_at = now();

-- 3) user_likes: who has swiped right on whom. Half of climbers (seed-1..5) have liked the main user for testing.
--    When main user swipes right on seed-1..5, it will be a mutual like (match). Seed-6..10 have not liked main user yet.
insert into public.user_likes (swiper_id, liked_id)
select c.id, m.id
from public.climbers c
cross join (select id from public.climbers where seed_id = 'main-user') m
where c.seed_id != 'main-user'
  and c.seed_id in (
    'quicklink-seed-1', 'quicklink-seed-2', 'quicklink-seed-3',
    'quicklink-seed-4', 'quicklink-seed-5'
  )
on conflict (swiper_id, liked_id) do nothing;

-- 4) Optional: some likes between other climbers so each has a list (for realism).
insert into public.user_likes (swiper_id, liked_id)
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-2', 'quicklink-seed-3') and c1.seed_id = 'quicklink-seed-1'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-1', 'quicklink-seed-4') and c1.seed_id = 'quicklink-seed-2'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-1', 'quicklink-seed-5') and c1.seed_id = 'quicklink-seed-3'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-2', 'quicklink-seed-6') and c1.seed_id = 'quicklink-seed-4'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-3', 'quicklink-seed-7') and c1.seed_id = 'quicklink-seed-5'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-4', 'quicklink-seed-8') and c1.seed_id = 'quicklink-seed-6'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-5', 'quicklink-seed-9') and c1.seed_id = 'quicklink-seed-7'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-6', 'quicklink-seed-10') and c1.seed_id = 'quicklink-seed-8'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-7') and c1.seed_id = 'quicklink-seed-9'
union all
select c1.id, c2.id
from public.climbers c1
join public.climbers c2 on c2.seed_id in ('quicklink-seed-8', 'quicklink-seed-9') and c1.seed_id = 'quicklink-seed-10'
on conflict (swiper_id, liked_id) do nothing;
