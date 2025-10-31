import React, { useMemo, useState } from 'react';
import { EXERCISE_CATALOG } from '../constants';
import type { CatalogExercise } from '../types';
import { BookOpenIcon } from './ui/icons';

const uniqueMuscleGroups = Array.from(new Set(EXERCISE_CATALOG.map(exercise => exercise.muscleGroup))).sort();
const uniqueEquipment = Array.from(new Set(EXERCISE_CATALOG.map(exercise => exercise.equipment))).sort();

const Catalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');

  const filteredExercises: CatalogExercise[] = useMemo(() => {
    return EXERCISE_CATALOG.filter(exercise => {
      const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase());
      const matchesMuscle = muscleGroup ? exercise.muscleGroup === muscleGroup : true;
      const matchesEquipment = equipment ? exercise.equipment === equipment : true;
      return matchesQuery && matchesMuscle && matchesEquipment;
    });
  }, [query, muscleGroup, equipment]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="bg-surface border border-border rounded-2xl p-6 shadow-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exercise Catalog</h1>
          <p className="text-sm text-text-muted">Curated moves from your templates with filters for quick planning.</p>
        </div>
        <div className="flex items-center gap-3 bg-background/60 border border-border rounded-2xl px-4 py-3">
          <BookOpenIcon className="w-6 h-6 text-primary" />
          <p className="text-xs text-text-muted">{EXERCISE_CATALOG.length} unique exercises</p>
        </div>
      </header>

      <section className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Search</label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Type a movement"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Muscle Group</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={muscleGroup}
              onChange={event => setMuscleGroup(event.target.value)}
            >
              <option value="">All</option>
              {uniqueMuscleGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Equipment</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={equipment}
              onChange={event => setEquipment(event.target.value)}
            >
              <option value="">All</option>
              {uniqueEquipment.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.length === 0 ? (
            <div className="sm:col-span-2 xl:col-span-3 border border-dashed border-border rounded-2xl p-10 text-center text-sm text-text-muted">
              No exercises match your filters. Try adjusting the search.
            </div>
          ) : (
            filteredExercises.map(exercise => (
              <article key={exercise.name} className="bg-background/60 border border-border rounded-2xl p-4 space-y-2">
                <h3 className="text-base font-semibold">{exercise.name}</h3>
                <p className="text-xs text-text-muted">Muscle group: {exercise.muscleGroup}</p>
                <p className="text-xs text-text-muted">Equipment: {exercise.equipment}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;
