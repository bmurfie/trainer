import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import type { FoodLog, NutritionPlan, WorkoutLog } from '../types';
import { AppleIcon, BoltIcon, HistoryIcon, TargetIcon, TrophyIcon } from './ui/icons';

interface DashboardProps {
  foodLogs: FoodLog[];
  weightHistory: Array<{ day: string; weight: number }>;
  nutritionPlan: NutritionPlan;
  workoutHistory: WorkoutLog[];
  onStartWorkout: (templateId: string) => void;
  theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  foodLogs,
  weightHistory,
  nutritionPlan,
  workoutHistory,
  onStartWorkout,
  theme,
}) => {
  const totals = useMemo(
    () =>
      foodLogs.reduce(
        (acc, log) => {
          acc.calories += log.calories;
          acc.protein += log.protein;
          acc.carbs += log.carbs;
          acc.fat += log.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [foodLogs]
  );

  const recentWorkouts = useMemo(() => {
    return [...workoutHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [workoutHistory]);

  const volumeHistory = useMemo(() => {
    return workoutHistory.map(workout => {
      const totalVolume = Object.values(workout.logs).reduce((volume, log) => {
        return (
          volume +
          log.sets.reduce((setVolume, set) => setVolume + set.weight * set.reps, 0)
        );
      }, 0);

      return {
        date: new Date(workout.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        volume: Math.round(totalVolume),
      };
    });
  }, [workoutHistory]);

  const macroTarget = nutritionPlan.trainingDay;
  const macroProgress = [
    { name: 'Calories', value: totals.calories, target: macroTarget.calories },
    { name: 'Protein', value: totals.protein, target: macroTarget.protein },
    { name: 'Carbs', value: totals.carbs, target: macroTarget.carbs },
    { name: 'Fat', value: totals.fat, target: macroTarget.fat },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                This Week
              </h2>
              <p className="text-2xl font-bold">{workoutHistory.length}</p>
            </div>
            <TrophyIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm text-text-muted">
            Total logged workouts. Keep the streak alive!
          </p>
          <button
            onClick={() => onStartWorkout('upper')}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Start Upper Body
          </button>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Average Weight
              </h2>
              <p className="text-2xl font-bold">
                {weightHistory.length
                  ? `${weightHistory[weightHistory.length - 1].weight.toFixed(1)} lbs`
                  : '—'}
              </p>
            </div>
            <TargetIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm text-text-muted">
            Stay consistent with weekly weigh-ins to monitor trends.
          </p>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Logged Meals
              </h2>
              <p className="text-2xl font-bold">{foodLogs.length}</p>
            </div>
            <AppleIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm text-text-muted">
            Balanced nutrition fuels better recovery and progress.
          </p>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                Theme
              </h2>
              <p className="text-2xl font-bold capitalize">{theme.replace('-', ' ')}</p>
            </div>
            <BoltIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm text-text-muted">
            Personalize the interface to match your focus.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Weight Trend</h2>
            <span className="text-xs text-text-muted">Last {weightHistory.length} days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="day" stroke="var(--color-text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" width={48} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-base)',
                    borderRadius: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  fill="url(#weightGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Macro Snapshot</h2>
          <ul className="space-y-4">
            {macroProgress.map(macro => {
              const progress = macro.target ? Math.min(100, (macro.value / macro.target) * 100) : 0;
              return (
                <li key={macro.name}>
                  <div className="flex items-center justify-between mb-1 text-sm font-semibold">
                    <span>{macro.name}</span>
                    <span>
                      {Math.round(macro.value)}
                      <span className="text-text-muted text-xs ml-1">/ {macro.target}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Workouts</h2>
            <HistoryIcon className="w-6 h-6 text-primary" />
          </div>
          {recentWorkouts.length === 0 ? (
            <p className="text-sm text-text-muted">Finish a workout to see it here.</p>
          ) : (
            <ul className="space-y-4">
              {recentWorkouts.map(workout => (
                <li key={workout.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{workout.name}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(workout.date).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {Object.keys(workout.logs).length} exercises
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Training Volume</h2>
            <BoltIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="h-64">
            {volumeHistory.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-text-muted)" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-base)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="volume" fill="var(--color-primary)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-text-muted">Log workouts to unlock your volume chart.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
