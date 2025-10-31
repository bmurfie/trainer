import React, { useMemo, useState } from 'react';
import type { FoodLog, NutritionPlan } from '../types';
import { AppleIcon, FlameIcon } from './ui/icons';

interface NutritionHubProps {
  foodLogs: FoodLog[];
  onAddFoodLog: (log: Omit<FoodLog, 'id'>) => void;
  nutritionPlan: NutritionPlan;
}

interface FoodDraft {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const defaultDraft: FoodDraft = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

const NutritionHub: React.FC<NutritionHubProps> = ({ foodLogs, onAddFoodLog, nutritionPlan }) => {
  const [draft, setDraft] = useState<FoodDraft>(defaultDraft);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      alert('Please provide a meal or food name.');
      return;
    }

    const payload: Omit<FoodLog, 'id'> = {
      name: draft.name.trim(),
      calories: Number(draft.calories || 0),
      protein: Number(draft.protein || 0),
      carbs: Number(draft.carbs || 0),
      fat: Number(draft.fat || 0),
    };

    onAddFoodLog(payload);
    setDraft(defaultDraft);
  };

  const plan = nutritionPlan.trainingDay;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="bg-surface border border-border rounded-2xl p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Nutrition HQ</h1>
            <p className="text-sm text-text-muted">
              Track meals, compare against your plan, and keep fuel aligned with training days.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-background/60 border border-border rounded-2xl px-4 py-3">
            <FlameIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">Training Day Targets</p>
              <p className="text-xs text-text-muted">
                {plan.calories} kcal • {plan.protein} g protein • {plan.carbs} g carbs • {plan.fat} g fat
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4"
        >
          <div className="flex items-center gap-3">
            <AppleIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Log a Meal</h2>
              <p className="text-xs text-text-muted">Quickly capture nutrition with macro breakdowns.</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              className="w-full px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Meal name"
              value={draft.name}
              onChange={event => setDraft(prev => ({ ...prev, name: event.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Calories"
                value={draft.calories}
                onChange={event => setDraft(prev => ({ ...prev, calories: event.target.value }))}
              />
              <input
                type="number"
                className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Protein (g)"
                value={draft.protein}
                onChange={event => setDraft(prev => ({ ...prev, protein: event.target.value }))}
              />
              <input
                type="number"
                className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Carbs (g)"
                value={draft.carbs}
                onChange={event => setDraft(prev => ({ ...prev, carbs: event.target.value }))}
              />
              <input
                type="number"
                className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Fat (g)"
                value={draft.fat}
                onChange={event => setDraft(prev => ({ ...prev, fat: event.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
          >
            Save Meal
          </button>
        </form>

        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold">Daily Summary</h2>
            <div className="text-xs text-text-muted space-y-1 sm:space-y-0 sm:flex sm:gap-3">
              <span>
                Calories: {totals.calories} / {plan.calories}
              </span>
              <span>
                Protein: {totals.protein}g / {plan.protein}g
              </span>
              <span>
                Carbs: {totals.carbs}g / {plan.carbs}g
              </span>
              <span>
                Fat: {totals.fat}g / {plan.fat}g
              </span>
            </div>
          </div>

          {foodLogs.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-10 text-center text-sm text-text-muted">
              No meals logged yet. Start by adding breakfast, lunch, or your pre-workout snack.
            </div>
          ) : (
            <div className="space-y-4">
              {foodLogs.map(log => (
                <article key={log.id} className="bg-background/60 border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold">{log.name}</h3>
                      <p className="text-xs text-text-muted">{log.calories} kcal</p>
                    </div>
                    <div className="text-right text-xs text-text-muted">
                      <p>Protein {log.protein}g</p>
                      <p>Carbs {log.carbs}g</p>
                      <p>Fat {log.fat}g</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NutritionHub;
