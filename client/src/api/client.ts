import { AuthResponse, Character, ClassDefinition, CombatEncounter, IdleSession, Mission } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const buildHeaders = (token?: string, extra?: Record<string, string>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async <T>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(token, options.headers as Record<string, string> | undefined),
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || response.statusText);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response.json();
};

export const api = {
  register: (payload: { username: string; password: string; email?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { username: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getClasses: () => request<ClassDefinition[]>('/auth/classes'),
  createCharacter: (token: string, payload: { userId: string; name: string; class: string }) =>
    request<{ character: Character }>('/auth/create-character', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),
  getCharacter: async (token: string, userId: string) => {
    try {
      return await request<Character>(`/character/${userId}`, {}, token);
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      if (err.status === 404) {
        return null;
      }
      throw error;
    }
  },
  getMissions: (token: string) => request<Mission[]>('/game/missions', {}, token),
  startCombat: (token: string, payload: { characterId: string; missionId: string; loadoutId?: string }) =>
    request('/game/combat/start', { method: 'POST', body: JSON.stringify(payload) }, token),
  getRecentCombat: (token: string, characterId: string) =>
    request<CombatEncounter[]>(`/game/combat/${characterId}/recent`, {}, token),
  startIdle: (token: string, payload: { characterId: string; missionId: string; loadoutId?: string }) =>
    request<IdleSession>('/game/idle/start', { method: 'POST', body: JSON.stringify(payload) }, token),
  claimIdle: (token: string, sessionId: string) =>
    request<IdleSession>('/game/idle/claim', { method: 'POST', body: JSON.stringify({ sessionId }) }, token),
  getActiveIdle: (token: string, characterId: string) =>
    request<IdleSession>(`/game/idle/${characterId}/active`, {}, token),
};
