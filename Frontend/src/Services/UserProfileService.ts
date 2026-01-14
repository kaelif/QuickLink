import { UserProfile } from '../Models/UserProfile';

const BASE_URL = 'http://localhost:4000';

export class UserProfileError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'UserProfileError';
  }
}

export interface UserProfileProviding {
  getOrCreateProfile(deviceId: string): Promise<UserProfile>;
  updateProfile(deviceId: string, profile: UserProfile): Promise<UserProfile>;
}

export class UserProfileService implements UserProfileProviding {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  async getOrCreateProfile(deviceId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseURL}/user/profile/${deviceId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes('device_id')) {
          throw new UserProfileError(
            "The database is missing the 'device_id' column. Please run the migration SQL in Supabase.",
            'DATABASE_SCHEMA_ERROR'
          );
        }
        throw new UserProfileError(
          `Server error (${response.status}): ${errorText}`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json();
      return data as UserProfile;
    } catch (error) {
      if (error instanceof UserProfileError) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          throw new UserProfileError(
            'Cannot connect to server: Request timed out. Make sure the backend is running on port 4000.',
            'CONNECTION_ERROR'
          );
        }
        if (error.message.includes('fetch')) {
          throw new UserProfileError(
            'Cannot connect to server. Make sure the backend is running on port 4000.',
            'CONNECTION_ERROR'
          );
        }
      }
      throw new UserProfileError(
        `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN_ERROR'
      );
    }
  }

  async updateProfile(deviceId: string, profile: UserProfile): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseURL}/user/profile/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new UserProfileError(
          `Server error (${response.status}): ${errorText}`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json();
      return data as UserProfile;
    } catch (error) {
      if (error instanceof UserProfileError) {
        throw error;
      }
      throw new UserProfileError(
        `Failed to update profile: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN_ERROR'
      );
    }
  }
}

