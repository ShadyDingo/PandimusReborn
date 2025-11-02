import React, { useEffect, useMemo, useState } from 'react';
import { Character, CombatEncounter, IdleSession, Loadout, Mission } from '../types';

type DashboardProps = {
  character: Character;
  missions: Mission[];
  encounters: CombatEncounter[];
  activeIdle: IdleSession | null;
  onStartCombat: (missionId: string) => Promise<void>;
  onStartIdle: (missionId: string) => Promise<void>;
  onClaimIdle: () => Promise<void>;
  refreshing?: boolean;
  statusMessage?: string | null;
  errorMessage?: string | null;
};

const formatDate = (value: string) => new Date(value).toLocaleString();

const MissionCard: React.FC<{
  mission: Mission;
  selected: boolean;
  onSelect: (missionId: string) => void;
}> = ({ mission, selected, onSelect }) => (
  <button
    type="button"
    className={`mission-card ${selected ? 'selected' : ''}`}
    aria-pressed={selected}
    onClick={() => onSelect(mission.id)}
  >
    <header>
      <h4>{mission.name}</h4>
      <span className="badge">Tier {mission.difficultyRating}</span>
    </header>
    <p>{mission.description}</p>
    <ul>
      <li>
        <span>Duration</span>
        <strong>{mission.durationMinutes} min</strong>
      </li>
      <li>
        <span>XP</span>
        <strong>{mission.baseExperience}</strong>
      </li>
      <li>
        <span>Gold</span>
        <strong>{mission.baseGold}</strong>
      </li>
    </ul>
  </button>
);

const LoadoutSummary: React.FC<{ loadout?: Loadout }> = ({ loadout }) => {
  if (!loadout) return null;

  return (
    <section className="panel">
      <header>
        <h3>Active Loadout: {loadout.name}</h3>
      </header>
      <div className="loadout-grid">
        <div>
          <h4>Abilities</h4>
          <ul>
            {loadout.abilities
              .slice()
              .sort((a, b) => a.slot - b.slot)
              .map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.ability.name}</strong>
                  <span>
                    Cooldown: {entry.ability.cooldownTurns} | Target: {entry.ability.target}
                  </span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4>Equipment</h4>
          <ul>
            {loadout.equipment.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.item.name}</strong>
                <span>{entry.slot.replace('_', ' ')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  character,
  missions,
  encounters,
  activeIdle,
  onStartCombat,
  onStartIdle,
  onClaimIdle,
  refreshing,
  statusMessage,
  errorMessage,
}) => {
  const [selectedMission, setSelectedMission] = useState<string | null>(missions[0]?.id ?? null);

  const activeLoadout = useMemo(() => character.loadouts.find((loadout) => loadout.isActive) ?? character.loadouts[0], [
    character.loadouts,
  ]);

  useEffect(() => {
    if (missions.length === 0) {
      setSelectedMission(null);
      return;
    }

    setSelectedMission((current) => {
      if (current && missions.some((mission) => mission.id === current)) {
        return current;
      }
      return missions[0].id;
    });
  }, [missions]);

  const handleStartCombat = async () => {
    if (!selectedMission) return;
    await onStartCombat(selectedMission);
  };

  const handleStartIdle = async () => {
    if (!selectedMission) return;
    await onStartIdle(selectedMission);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {character.name}</h1>
          <p>
            Level {character.level} {character.class} | Power {character.powerRating}
          </p>
        </div>
        <div className="resource-summary">
          <div>
            <span>Experience</span>
            <strong>{character.experience}</strong>
          </div>
          <div>
            <span>Gold</span>
            <strong>{character.gold}</strong>
          </div>
        </div>
      </header>

      <section className="panel stats-panel">
        <header>
          <h3>Base Stats</h3>
        </header>
        <ul>
          {Object.entries(character.baseStats).map(([key, value]) => (
            <li key={key}>
              <span>{key.toUpperCase()}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </section>

      <LoadoutSummary loadout={activeLoadout} />

      <section className="panel mission-panel">
        <header>
          <h3>Select Mission</h3>
        </header>
        {missions.length === 0 ? (
          <p className="empty-state">No missions available yet. Check back soon.</p>
        ) : (
          <>
            <div className="mission-grid">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  selected={selectedMission === mission.id}
                  onSelect={setSelectedMission}
                />
              ))}
            </div>
            <div className="mission-actions">
              <button onClick={handleStartCombat} disabled={!selectedMission || refreshing}>
                {refreshing ? 'Simulating...' : 'Run Combat Simulation'}
              </button>
              <button className="secondary" onClick={handleStartIdle} disabled={!selectedMission || refreshing}>
                {refreshing ? 'Dispatching...' : 'Dispatch for Idle Rewards'}
              </button>
            </div>
          </>
        )}
        {statusMessage && <div className="status-banner success">{statusMessage}</div>}
        {errorMessage && <div className="status-banner error">{errorMessage}</div>}
      </section>

      <section className="panel encounters-panel">
        <header>
          <h3>Recent Encounters</h3>
        </header>
        {encounters.length === 0 ? (
          <p className="empty-state">No encounters yet. Run a combat simulation to populate the log.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Result</th>
                  <th>Rounds</th>
                  <th>Rewards</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {encounters.map((encounter) => (
                  <tr key={encounter.id}>
                    <td>{encounter.mission?.name ?? 'Custom Mission'}</td>
                    <td>
                      <span className={`result ${encounter.result.toLowerCase()}`}>{encounter.result}</span>
                    </td>
                    <td>{encounter.rounds}</td>
                    <td>
                      <div className="reward-line">
                        <span>{encounter.summary.rewards.experience} XP</span>
                        <span>{encounter.summary.rewards.gold} Gold</span>
                      </div>
                    </td>
                    <td>{formatDate(encounter.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel idle-panel">
        <header>
          <h3>Idle Progress</h3>
        </header>
        {activeIdle ? (
          <div className="idle-active">
            <p>Session started {formatDate(activeIdle.startedAt)}.</p>
            {activeIdle.rewards && activeIdle.claimed ? (
              <div className="idle-rewards">
                <p>
                  Claimed {activeIdle.rewards.experience} XP and {activeIdle.rewards.gold} gold.
                </p>
              </div>
            ) : (
              <button onClick={onClaimIdle} disabled={refreshing}>
                {refreshing ? 'Claiming...' : 'Claim Rewards'}
              </button>
            )}
          </div>
        ) : (
          <p className="empty-state">No active idle session. Dispatch your champion to earn passive rewards.</p>
        )}
      </section>
    </div>
  );
};
