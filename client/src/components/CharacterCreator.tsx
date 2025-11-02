import React, { useEffect, useState } from 'react';
import { ClassDefinition } from '../types';

type CharacterCreatorProps = {
  classes: ClassDefinition[];
  onCreate: (payload: { name: string; classKey: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ classes, onCreate, loading, error }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0]?.key ?? '');
  const [name, setName] = useState('');

  const activeClass = classes.find((klass) => klass.key === selectedClass);

  useEffect(() => {
    if (classes.length === 0) {
      setSelectedClass('');
      return;
    }

    setSelectedClass((current) => (current && classes.some((klass) => klass.key === current) ? current : classes[0].key));
  }, [classes]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!selectedClass || !trimmedName) return;
    await onCreate({ name: trimmedName, classKey: selectedClass });
    setName('');
  };

  return (
    <div className="character-creator">
      <h2>Create Your First Champion</h2>
      <p>Choose a class and name to begin shaping your strategy.</p>

      {classes.length === 0 ? (
        <p className="empty-state">Class definitions are loading...</p>
      ) : (
        <div className="class-selector">
          {classes.map((klass) => (
            <button
              key={klass.key}
              type="button"
              className={klass.key === selectedClass ? 'active' : ''}
              onClick={() => setSelectedClass(klass.key)}
              disabled={loading}
            >
              <strong>{klass.name}</strong>
              <span>{klass.description}</span>
            </button>
          ))}
        </div>
      )}

      {activeClass && (
        <div className="class-details">
          <h3>{activeClass.name} Stats</h3>
          <ul>
            {Object.entries(activeClass.baseStats).map(([stat, value]) => (
              <li key={stat}>
                <span className="stat-label">{stat.toUpperCase()}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="character-form" onSubmit={handleSubmit}>
        <label>
          Character Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading || classes.length === 0}
            autoComplete="off"
            placeholder="e.g. Arayana"
            maxLength={24}
            minLength={2}
            required
          />
        </label>
        <button type="submit" disabled={loading || !selectedClass}>
          {loading ? 'Creating...' : 'Create Character'}
        </button>
      </form>

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
