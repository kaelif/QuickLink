import { ClimbingPartner } from '../Models/ClimbingPartner';

const BASE_URL = 'http://localhost:4000';

export class ClimbingPartnerError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ClimbingPartnerError';
  }
}

export interface ClimbingPartnerProviding {
  fetchStack(deviceId?: string): Promise<ClimbingPartner[]>;
  fetchMatches(deviceId: string): Promise<ClimbingPartner[]>;
}

interface PartnerStackResponse {
  stack: ClimbingPartner[];
  count: number;
}

interface MatchesResponse {
  matches: ClimbingPartner[];
}

export class ClimbingPartnerService implements ClimbingPartnerProviding {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  async fetchStack(deviceId?: string): Promise<ClimbingPartner[]> {
    try {
      let url = `${this.baseURL}/getStack`;
      if (deviceId) {
        url += `?deviceId=${encodeURIComponent(deviceId)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ClimbingPartnerError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as PartnerStackResponse;
      return data.stack;
    } catch (error) {
      if (error instanceof ClimbingPartnerError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ClimbingPartnerError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new ClimbingPartnerError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new ClimbingPartnerError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }

  async fetchMatches(deviceId: string): Promise<ClimbingPartner[]> {
    try {
      const response = await fetch(`${this.baseURL}/matches/${deviceId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ClimbingPartnerError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as MatchesResponse;
      return data.matches;
    } catch (error) {
      if (error instanceof ClimbingPartnerError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ClimbingPartnerError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new ClimbingPartnerError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new ClimbingPartnerError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }
}

