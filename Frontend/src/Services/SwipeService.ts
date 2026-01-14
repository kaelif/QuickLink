import { SwipeAction } from '../types';

const BASE_URL = 'http://localhost:4000';

export { SwipeAction };

export interface SwipeProviding {
  recordSwipe(swiperDeviceId: string, swipedProfileId: string, action: SwipeAction): Promise<void>;
}

export class SwipeService implements SwipeProviding {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  async recordSwipe(swiperDeviceId: string, swipedProfileId: string, action: SwipeAction): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/swipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          swiperDeviceId,
          swipedProfileId,
          action: action,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}

