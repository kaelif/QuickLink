require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getStack, getOrCreateUserProfile, updateUserProfile } = require('./src/repositories/profiles');
const { recordSwipe, getMatches, areMatched } = require('./src/repositories/swipes');
const { sendMessage, getConversation, getConversations, markMessagesAsRead } = require('./src/repositories/messages');
const supabase = require('./src/config/supabaseClient');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get stack endpoint
app.get("/getStack", async (req, res) => {
    try {
        const deviceId = req.query.deviceId || null; // Get deviceId from query parameter
        const profiles = await getStack(deviceId);
        res.json({
            stack: profiles,
            count: profiles.length,
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] GET /getStack - Error:`, error.message);
        console.error('Full error:', error);
        res.status(500).json({
            error: 'Failed to fetch profiles',
            message: error.message,
        });
    }
});

// Record a swipe action (like or pass)
app.post("/swipes", async (req, res) => {
    try {
        const { swiperDeviceId, swipedProfileId, action } = req.body;
        
        if (!swiperDeviceId || !swipedProfileId || !action) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'swiperDeviceId, swipedProfileId, and action are required',
            });
        }

        if (!['like', 'pass'].includes(action)) {
            return res.status(400).json({
                error: 'Invalid action',
                message: 'Action must be either "like" or "pass"',
            });
        }

        console.log(`[${new Date().toISOString()}] POST /swipes - Recording ${action} from ${swiperDeviceId} for profile ${swipedProfileId}`);
        const swipe = await recordSwipe(swiperDeviceId, swipedProfileId, action);
        console.log(`[${new Date().toISOString()}] POST /swipes - Success`);
        res.json(swipe);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] POST /swipes - Error:`, error.message);
        res.status(500).json({
            error: 'Failed to record swipe',
            message: error.message,
        });
    }
});

// Get matches for a user (profiles they've liked who have also liked them back)
app.get("/matches/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        
        const matchedProfileIds = await getMatches(deviceId);
        
        if (matchedProfileIds.length === 0) {
            return res.json({ matches: [] });
        }

        // Fetch full profile data for matched profiles
        const { transformProfile } = require('./src/repositories/profiles');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', matchedProfileIds);

        if (profilesError) {
            throw profilesError;
        }

        const transformedProfiles = (profiles || []).map(transformProfile);
        
        res.json({ matches: transformedProfiles });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get matches',
            message: error.message,
        });
    }
});

// Get or create user profile by device ID
app.get("/user/profile/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const profile = await getOrCreateUserProfile(deviceId);
        res.json(profile);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get or create profile',
            message: error.message,
        });
    }
});

// Update user profile by device ID
app.put("/user/profile/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const profileData = req.body;
        const updatedProfile = await updateUserProfile(deviceId, profileData);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update profile',
            message: error.message,
        });
    }
});

// Get device ID from profile UUID (helper endpoint for messaging)
app.get("/profile/:profileId/deviceId", async (req, res) => {
    try {
        const { profileId } = req.params;
        
        // Convert UUID to integer ID
        // The frontend sends UUIDs in format: 550e8400-e29b-41d4-a716-{12 hex digits}
        let dbId = null;
        
        if (typeof profileId === 'string' && profileId.includes('-')) {
            // It's a UUID in our deterministic format
            const deterministicPattern = /^550e8400-e29b-41d4-a716-([0-9a-f]{12})$/i;
            const match = profileId.match(deterministicPattern);
            
            if (match) {
                // Extract the hex part and convert to integer
                const hexId = match[1];
                dbId = parseInt(hexId, 16);
            } else {
                // It's a real UUID, we need to search all profiles
                // This is less efficient but handles edge cases
                const { data: allProfiles, error: fetchError } = await supabase
                    .from('profiles')
                    .select('id, device_id');
                
                if (fetchError) throw fetchError;
                
                // Transform each profile to see if UUID matches
                const { integerToUUID } = require('./src/repositories/profiles');
                // We need to access the function - let's create a helper
                function convertToUUID(id) {
                    const idNum = typeof id === 'number' ? id : parseInt(id, 10);
                    const hexId = idNum.toString(16).padStart(12, '0');
                    return `550e8400-e29b-41d4-a716-${hexId}`;
                }
                
                const matchingProfile = allProfiles?.find(p => {
                    const profileUUID = convertToUUID(p.id);
                    return profileUUID === profileId;
                });
                
                if (!matchingProfile) {
                    return res.status(404).json({ error: 'Profile not found' });
                }
                
                dbId = typeof matchingProfile.id === 'number' ? matchingProfile.id : parseInt(matchingProfile.id, 10);
            }
        } else {
            // Already an integer
            dbId = parseInt(profileId, 10);
        }
        
        if (!dbId) {
            return res.status(400).json({ error: 'Invalid profile ID format' });
        }
        
        const { data, error } = await supabase
            .from('profiles')
            .select('device_id')
            .eq('id', dbId)
            .single();
        
        if (error || !data) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        res.json({ deviceId: data.device_id });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get device ID',
            message: error.message,
        });
    }
});

// Messaging endpoints

// Send a message
app.post("/messages", async (req, res) => {
    try {
        const { senderDeviceId, recipientDeviceId, content } = req.body;
        
        if (!senderDeviceId || !recipientDeviceId || !content) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'senderDeviceId, recipientDeviceId, and content are required',
            });
        }

        // Verify users are matched before allowing messaging
        const matched = await areMatched(senderDeviceId, recipientDeviceId);
        if (!matched) {
            return res.status(403).json({
                error: 'Not matched',
                message: 'You can only message users you have matched with',
            });
        }

        const message = await sendMessage(senderDeviceId, recipientDeviceId, content);
        res.json(message);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to send message',
            message: error.message,
        });
    }
});

// Get conversation between two users
app.get("/messages/conversation", async (req, res) => {
    try {
        const { deviceId1, deviceId2 } = req.query;
        
        if (!deviceId1 || !deviceId2) {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'deviceId1 and deviceId2 are required',
            });
        }

        // Verify users are matched before allowing access to conversation
        const matched = await areMatched(deviceId1, deviceId2);
        if (!matched) {
            return res.status(403).json({
                error: 'Not matched',
                message: 'You can only view conversations with users you have matched with',
            });
        }

        const result = await getConversation(deviceId1, deviceId2);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch conversation',
            message: error.message,
        });
    }
});

// Get all conversations for a user
app.get("/messages/conversations/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const conversations = await getConversations(deviceId);
        res.json({ conversations });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch conversations',
            message: error.message,
        });
    }
});

// Mark messages as read
app.post("/messages/read", async (req, res) => {
    try {
        const { deviceId, otherDeviceId } = req.body;
        
        if (!deviceId || !otherDeviceId) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'deviceId and otherDeviceId are required',
            });
        }

        const count = await markMessagesAsRead(deviceId, otherDeviceId);
        res.json({ count });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to mark messages as read',
            message: error.message,
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Connected to Supabase: ${process.env.SUPABASE_URL ? 'Yes' : 'No'}`);
});