const supabase = require('../config/supabaseClient');

/**
 * Convert UUID string to integer profile ID
 */
async function getProfileIntegerId(uuidString) {
  // Try to extract integer from UUID format first (e.g., "550e8400-e29b-41d4-a716-000000000001" -> 1)
  const match = uuidString.match(/0000000000([0-9a-f]+)$/i);
  if (match) {
    return parseInt(match[1], 16);
  }
  
  // If that doesn't work, query the database to find the profile by its actual ID
  // and get its integer ID
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .or(`id.eq.${uuidString},device_id.eq.${uuidString}`)
    .single();
  
  if (error || !profile) {
    throw new Error(`Profile not found for ID: ${uuidString}`);
  }
  
  // Return the integer ID
  return typeof profile.id === 'number' ? profile.id : parseInt(profile.id, 10);
}

/**
 * Record a swipe action (like or pass)
 */
async function recordSwipe(swiperDeviceId, swipedProfileId, action) {
  try {
    // Convert profile ID from UUID string to integer if needed
    let profileId;
    if (typeof swipedProfileId === 'string' && swipedProfileId.includes('-')) {
      // It's a UUID string, convert to integer
      profileId = await getProfileIntegerId(swipedProfileId);
    } else {
      // Already an integer
      profileId = typeof swipedProfileId === 'number' ? swipedProfileId : parseInt(swipedProfileId, 10);
    }

    const { data, error } = await supabase
      .from('swipes')
      .upsert({
        swiper_device_id: swiperDeviceId,
        swiped_profile_id: profileId,
        action: action, // 'like' or 'pass'
      }, {
        onConflict: 'swiper_device_id,swiped_profile_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording swipe:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in recordSwipe:', error);
    throw error;
  }
}

/**
 * Get all passed profile IDs for a user (profiles they swiped left on)
 */
async function getPassedProfileIds(swiperDeviceId) {
  try {
    const { data, error } = await supabase
      .from('swipes')
      .select('swiped_profile_id')
      .eq('swiper_device_id', swiperDeviceId)
      .eq('action', 'pass');

    if (error) {
      console.error('Error fetching passed profiles:', error);
      throw error;
    }

    return data?.map(swipe => swipe.swiped_profile_id) || [];
  } catch (error) {
    console.error('Error in getPassedProfileIds:', error);
    throw error;
  }
}

/**
 * Get all liked profile IDs for a user (profiles they swiped right on)
 */
async function getLikedProfileIds(swiperDeviceId) {
  try {
    const { data, error } = await supabase
      .from('swipes')
      .select('swiped_profile_id')
      .eq('swiper_device_id', swiperDeviceId)
      .eq('action', 'like');

    if (error) {
      console.error('Error fetching liked profiles:', error);
      throw error;
    }

    return data?.map(swipe => swipe.swiped_profile_id) || [];
  } catch (error) {
    console.error('Error in getLikedProfileIds:', error);
    throw error;
  }
}

/**
 * Get all matches for a user (profiles they've liked who have also liked them back)
 * @param {string} swiperDeviceId - Device ID of the user
 * @returns {Array} Array of matched profile IDs
 */
async function getMatches(swiperDeviceId) {
  try {
    // Get user's profile ID
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('device_id', swiperDeviceId)
      .single();

    if (profileError || !userProfile) {
      throw new Error(`Profile not found for deviceId: ${swiperDeviceId}`);
    }

    const userId = typeof userProfile.id === 'number' ? userProfile.id : parseInt(userProfile.id, 10);

    // Get all profiles the user has liked
    const { data: userLikes, error: likesError } = await supabase
      .from('swipes')
      .select('swiped_profile_id')
      .eq('swiper_device_id', swiperDeviceId)
      .eq('action', 'like');

    if (likesError) {
      console.error('Error fetching user likes:', likesError);
      throw likesError;
    }

    if (!userLikes || userLikes.length === 0) {
      return [];
    }

    const likedProfileIds = userLikes.map(swipe => swipe.swiped_profile_id);

    // Get all swipes where those profiles have liked the user back
    // We need to find swipes where:
    // - swiper_device_id is one of the profiles the user liked
    // - swiped_profile_id is the user's profile ID
    // - action is 'like'

    // First, get device_ids for all the profiles the user liked
    const { data: likedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, device_id')
      .in('id', likedProfileIds);

    if (profilesError) {
      console.error('Error fetching liked profiles:', profilesError);
      throw profilesError;
    }

    if (!likedProfiles || likedProfiles.length === 0) {
      return [];
    }

    const likedDeviceIds = likedProfiles
      .filter(p => p.device_id)
      .map(p => p.device_id);

    if (likedDeviceIds.length === 0) {
      return [];
    }

    // Now find swipes where those users have liked the current user back
    const { data: mutualLikes, error: mutualError } = await supabase
      .from('swipes')
      .select('swiper_device_id, swiped_profile_id')
      .in('swiper_device_id', likedDeviceIds)
      .eq('swiped_profile_id', userId)
      .eq('action', 'like');

    if (mutualError) {
      console.error('Error fetching mutual likes:', mutualError);
      throw mutualError;
    }

    if (!mutualLikes || mutualLikes.length === 0) {
      return [];
    }

    // Get the profile IDs that have mutually liked
    const matchedDeviceIds = mutualLikes.map(swipe => swipe.swiper_device_id);
    const matchedProfiles = likedProfiles.filter(p => 
      p.device_id && matchedDeviceIds.includes(p.device_id)
    );

    return matchedProfiles.map(p => p.id);
  } catch (error) {
    console.error('Error in getMatches:', error);
    throw error;
  }
}

/**
 * Check if two users are matched (both have liked each other)
 * @param {string} deviceId1 - Device ID of first user
 * @param {string} deviceId2 - Device ID of second user
 * @returns {boolean} True if they are matched
 */
async function areMatched(deviceId1, deviceId2) {
  try {
    // Get profile IDs for both users
    const { data: profile1, error: error1 } = await supabase
      .from('profiles')
      .select('id')
      .eq('device_id', deviceId1)
      .single();

    const { data: profile2, error: error2 } = await supabase
      .from('profiles')
      .select('id')
      .eq('device_id', deviceId2)
      .single();

    if (error1 || !profile1 || error2 || !profile2) {
      return false;
    }

    const id1 = typeof profile1.id === 'number' ? profile1.id : parseInt(profile1.id, 10);
    const id2 = typeof profile2.id === 'number' ? profile2.id : parseInt(profile2.id, 10);

    // Check if user1 liked user2
    const { data: like1, error: like1Error } = await supabase
      .from('swipes')
      .select('id')
      .eq('swiper_device_id', deviceId1)
      .eq('swiped_profile_id', id2)
      .eq('action', 'like')
      .single();

    if (like1Error || !like1) {
      return false;
    }

    // Check if user2 liked user1
    const { data: like2, error: like2Error } = await supabase
      .from('swipes')
      .select('id')
      .eq('swiper_device_id', deviceId2)
      .eq('swiped_profile_id', id1)
      .eq('action', 'like')
      .single();

    return !like2Error && !!like2;
  } catch (error) {
    console.error('Error in areMatched:', error);
    return false;
  }
}

module.exports = {
  recordSwipe,
  getPassedProfileIds,
  getLikedProfileIds,
  getMatches,
  areMatched,
};

