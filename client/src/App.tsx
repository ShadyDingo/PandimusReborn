import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './api/client';
import { AuthPanel } from './components/AuthPanel';
import { CharacterCreator } from './components/CharacterCreator';
import { Dashboard } from './components/Dashboard';
import {
  AuthResponse,
  Character,
  ClassDefinition,
  CombatEncounter,
  IdleSession,
  Mission,
  User,
} from './types';

type AuthState = {
  token: string;
  user: User;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [classes, setClasses] = useState<ClassDefinition[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [encounters, setEncounters] = useState<CombatEncounter[]>([]);
  const [idleSession, setIdleSession] = useState<IdleSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .getClasses()
      .then(setClasses)
      .catch((error) => {
        console.error('Failed to load classes', error);
        setErrorMessage('Failed to load class definitions.');
      });
  }, []);

  const attachAuth = (response: AuthResponse) => {
    setAuth({ token: response.token, user: response.user });
  };

  const refreshCharacter = async (token: string, userId: string) => {
    const data = await api.getCharacter(token, userId);
    setCharacter(data);
    return data;
  };

  const refreshMissions = async (token: string) => {
    const missionData = await api.getMissions(token);
    setMissions(missionData);
    return missionData;
  };

  const refreshEncounters = async (token: string, characterId: string) => {
    const data = await api.getRecentCombat(token, characterId);
    setEncounters(data);
    return data;
  };

  const refreshIdle = async (token: string, characterId: string) => {
    try {
      const session = await api.getActiveIdle(token, characterId);
      setIdleSession(session);
      return session;
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      if (err.status === 404) {
        setIdleSession(null);
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    if (!auth) {
      setInitializing(false);
      return;
    }

    const bootstrap = async () => {
      setInitializing(true);
      setErrorMessage(null);

      try {
        const [characterData] = await Promise.all([
          refreshCharacter(auth.token, auth.user.id),
          refreshMissions(auth.token),
        ]);

        if (characterData) {
          await Promise.all([
            refreshEncounters(auth.token, characterData.id),
            refreshIdle(auth.token, characterData.id),
          ]);
        }
      } catch (error) {
        console.error('Failed to bootstrap dashboard', error);
        setErrorMessage('Failed to load your data. Please try again.');
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, [auth]);

  const handleLogin = async (payload: { username: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.login(payload);
      attachAuth(response);
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload: { username: string; password: string; email?: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.register(payload);
      attachAuth(response);
    } catch (error) {
      console.error('Registration failed', error);
      setErrorMessage('Unable to register. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async ({ name, classKey }: { name: string; classKey: string }) => {
    if (!auth) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      await api.createCharacter(auth.token, { userId: auth.user.id, name, class: classKey });
      const characterData = await refreshCharacter(auth.token, auth.user.id);
      if (characterData) {
        await Promise.all([
          refreshEncounters(auth.token, characterData.id),
          refreshIdle(auth.token, characterData.id),
        ]);
      }
      setStatusMessage('Character created successfully.');
    } catch (error) {
      console.error('Create character failed', error);
      setErrorMessage('Unable to create character.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCombat = async (missionId: string) => {
    if (!auth || !character) return;
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      await api.startCombat(auth.token, { characterId: character.id, missionId });
      await Promise.all([
        refreshEncounters(auth.token, character.id),
        refreshCharacter(auth.token, auth.user.id),
      ]);
      setStatusMessage('Combat simulation complete. Check the encounter log for details.');
    } catch (error) {
      console.error('Combat simulation failed', error);
      setErrorMessage('Combat simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartIdle = async (missionId: string) => {
    if (!auth || !character) return;
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const session = await api.startIdle(auth.token, { characterId: character.id, missionId });
      setIdleSession(session);
      setStatusMessage('Champion dispatched for idle rewards.');
    } catch (error) {
      console.error('Unable to start idle session', error);
      setErrorMessage('Unable to start idle session.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimIdle = async () => {
    if (!auth || !idleSession || !character) return;
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const session = await api.claimIdle(auth.token, idleSession.id);
      setIdleSession(session);
      await refreshCharacter(auth.token, auth.user.id);
      setStatusMessage('Idle rewards claimed successfully.');
    } catch (error) {
      console.error('Unable to claim idle rewards', error);
      setErrorMessage('Unable to claim idle rewards.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setCharacter(null);
    setEncounters([]);
    setIdleSession(null);
    setStatusMessage(null);
    setErrorMessage(null);
  };

  if (!auth) {
    return (
      <div className="app-shell">
        <main className="app-content">
          <AuthPanel onLogin={handleLogin} onRegister={handleRegister} loading={loading} error={errorMessage} />
        </main>
      </div>
    );
  }

  if (initializing) {
    return (
      <div className="app-shell">
        <main className="app-content loading-state">
          <div className="spinner" aria-hidden />
          <p>Preparing your adventure...</p>
        </main>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="app-shell">
        <header className="top-bar">
          <span>{auth.user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <main className="app-content">
          <CharacterCreator
            classes={classes}
            onCreate={handleCreateCharacter}
            loading={loading}
            error={errorMessage}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <span>{auth.user.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main className="app-content">
        <Dashboard
          character={character}
          missions={missions}
          encounters={encounters}
          activeIdle={idleSession}
          onStartCombat={handleStartCombat}
          onStartIdle={handleStartIdle}
          onClaimIdle={handleClaimIdle}
          refreshing={loading}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
        />
      </main>
    </div>
  );
};

export default App;
