import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WorkoutLog } from '../types';
import { BoltIcon, DumbbellIcon, TargetIcon } from './ui/icons';

interface ProgressTrackerProps {
  workoutHistory: WorkoutLog[];
  theme: string;
}

interface WeeklyAggregate {
  week: string;
  workouts: number;
  volume: number;
}

interface PersonalRecord {
  exerciseName: string;
  bestWeight: number;
  reps: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ workoutHistory, theme }) => {
  const weeklyTrend: WeeklyAggregate[] = useMemo(() => {
    const weeklyMap = new Map<string, WeeklyAggregate>();

    workoutHistory.forEach(log => {
      const date = new Date(log.date);
      const year = date.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / 86400000);
      const weekNumber = Math.floor((dayOfYear + firstDayOfYear.getDay()) / 7) + 1;
      const week = `${year}-W${String(weekNumber).padStart(2, '0')}`;

      if (!weeklyMap.has(week)) {
        weeklyMap.set(week, {
          week,
          workouts: 0,
          volume: 0,
        });
      }

      const aggregate = weeklyMap.get(week)!;
      aggregate.workouts += 1;
      const workoutVolume = Object.values(log.logs).reduce((total, exerciseLog) => {
        return (
          total +
          exerciseLog.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0)
        );
      }, 0);
      aggregate.volume += workoutVolume;
    });

    return Array.from(weeklyMap.values())
      .sort((a, b) => (a.week > b.week ? 1 : -1))
      .slice(-12);
  }, [workoutHistory]);

  const personalRecords: PersonalRecord[] = useMemo(() => {
    const records = new Map<string, PersonalRecord>();
    workoutHistory.forEach(workout => {
      Object.values(workout.logs).forEach(exerciseLog => {
        exerciseLog.sets.forEach(set => {
          const record = records.get(exerciseLog.exerciseName);
          if (!record || set.weight > record.bestWeight) {
            records.set(exerciseLog.exerciseName, {
              exerciseName: exerciseLog.exerciseName,
              bestWeight: set.weight,
              reps: set.reps,
            });
          }
        });
      });
    });
    return Array.from(records.values())
      .sort((a, b) => b.bestWeight - a.bestWeight)
      .slice(0, 6);
  }, [workoutHistory]);

  const totalVolume = useMemo(
    () =>
      workoutHistory.reduce((volume, workout) => {
        return (
          volume +
          Object.values(workout.logs).reduce((workoutVolume, exerciseLog) => {
            return (
              workoutVolume +
              exerciseLog.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0)
            );
          }, 0)
        );
      }, 0),
    [workoutHistory]
  );

  const avgPerWorkout = workoutHistory.length
    ? Math.round(totalVolume / workoutHistory.length)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="bg-surface border border-border rounded-2xl p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Progress Insights</h1>
            <p className="text-sm text-text-muted">
              Review weekly workload, highlight PRs, and dial in the next training block.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-3 rounded-2xl border border-border bg-background/60 text-sm">
              <p className="text-xs text-text-muted uppercase tracking-wide">Total Volume</p>
              <p className="text-lg font-semibold">{Math.round(totalVolume)} lbs</p>
            </div>
            <div className="px-4 py-3 rounded-2xl border border-border bg-background/60 text-sm">
              <p className="text-xs text-text-muted uppercase tracking-wide">Avg / Workout</p>
              <p className="text-lg font-semibold">{avgPerWorkout} lbs</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Weekly Volume</h2>
            <span className="text-xs text-text-muted">Last {weeklyTrend.length} weeks</span>
          </div>
          <div className="h-80">
            {weeklyTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="week" stroke="var(--color-text-muted)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-muted)" tickLine={false} axisLine={false} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-base)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#volumeGradient)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full border border-dashed border-border rounded-2xl flex items-center justify-center text-sm text-text-muted">
                Log workouts to generate your weekly trend.
              </div>
            )}
          </div>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <TargetIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Personal Records</h2>
              <p className="text-xs text-text-muted">Top lifts based on logged sets.</p>
            </div>
          </div>
          {personalRecords.length === 0 ? (
            <p className="text-sm text-text-muted">Track more sessions to unlock personal records.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {personalRecords.map(record => (
                <li key={record.exerciseName} className="flex items-center justify-between">
                  <span className="font-semibold">{record.exerciseName}</span>
                  <span className="text-text-muted">{record.bestWeight} lb × {record.reps} reps</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <DumbbellIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Workout Ledger</h2>
              <p className="text-xs text-text-muted">A running list of every saved session.</p>
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {workoutHistory.length === 0 ? (
              <p className="text-sm text-text-muted">No workouts saved yet. Finish one to get the ball rolling.</p>
            ) : (
              workoutHistory
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(log => (
                  <div key={log.id} className="bg-background/60 border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold">{log.name}</h3>
                        <p className="text-xs text-text-muted">{new Date(log.date).toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {Object.keys(log.logs).length} exercises
                      </span>
                    </div>
                    <ul className="mt-3 text-xs text-text-muted space-y-1">
                      {Object.values(log.logs).map(exerciseLog => (
                        <li key={exerciseLog.exerciseName}>
                          {exerciseLog.exerciseName} • {exerciseLog.sets.length} sets
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            )}
          </div>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <BoltIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Theme</h2>
              <p className="text-xs text-text-muted">Current visual style</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="h-32" style={{ background: 'var(--color-primary)' }} />
            <div className="p-4 text-sm">
              <p className="font-semibold capitalize">{theme.replace('-', ' ')}</p>
              <p className="text-xs text-text-muted">
                Switch themes from the top bar to experiment with different moods for training sessions.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ProgressTracker;
