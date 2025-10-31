import React, { useEffect, useMemo, useState } from 'react';
import type {
  Exercise,
  ExerciseLog,
  SetLog,
  WorkoutLog,
  WorkoutTemplate,
} from '../types';
import { DumbbellIcon, HistoryIcon, WandIcon } from './ui/icons';

interface WorkoutLoggerProps {
  workoutTemplates: WorkoutTemplate[];
  onAddTemplate: (template: WorkoutTemplate) => void;
  onFinishWorkout: (workoutName: string, logs: Record<string, ExerciseLog>) => void;
  onClearDirectStart: () => void;
  onClearHistory: () => void;
  workoutHistory: WorkoutLog[];
  directStartTemplateId: string | null;
}

interface EditableTemplate extends WorkoutTemplate {
  exercises: Exercise[];
}

interface SetDraft {
  weight: string;
  reps: string;
  rpe: string;
}

const createEmptySet = (): SetDraft => ({ weight: '', reps: '', rpe: '' });

const createExerciseLogs = (exercises: Exercise[]): Record<string, ExerciseLog> => {
  const initialLogs: Record<string, ExerciseLog> = {};
  exercises.forEach(exercise => {
    initialLogs[exercise.name] = {
      exerciseName: exercise.name,
      sets: [],
    };
  });
  return initialLogs;
};

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  workoutTemplates,
  onAddTemplate,
  onFinishWorkout,
  onClearDirectStart,
  onClearHistory,
  workoutHistory,
  directStartTemplateId,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [workoutName, setWorkoutName] = useState<string>('Custom Workout');
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLog>>({});
  const [setDrafts, setSetDrafts] = useState<Record<string, SetDraft[]>>({});
  const [showTemplateBuilder, setShowTemplateBuilder] = useState<boolean>(false);
  const [templateDraft, setTemplateDraft] = useState<EditableTemplate>({
    id: '',
    name: '',
    exercises: [],
  });

  const activeTemplate = useMemo(
    () => workoutTemplates.find(template => template.id === selectedTemplateId) ?? null,
    [selectedTemplateId, workoutTemplates]
  );

  useEffect(() => {
    if (directStartTemplateId) {
      setSelectedTemplateId(directStartTemplateId);
      const template = workoutTemplates.find(t => t.id === directStartTemplateId);
      if (template) {
        setWorkoutName(template.name);
        setExerciseLogs(createExerciseLogs(template.exercises));
        setSetDrafts(
          template.exercises.reduce((acc, exercise) => {
            acc[exercise.name] = [createEmptySet()];
            return acc;
          }, {} as Record<string, SetDraft[]>)
        );
      }
      onClearDirectStart();
    }
  }, [directStartTemplateId, workoutTemplates, onClearDirectStart]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = workoutTemplates.find(t => t.id === templateId);
    if (template) {
      setWorkoutName(template.name);
      setExerciseLogs(createExerciseLogs(template.exercises));
      setSetDrafts(
        template.exercises.reduce((acc, exercise) => {
          acc[exercise.name] = [createEmptySet()];
          return acc;
        }, {} as Record<string, SetDraft[]>)
      );
    }
  };

  const updateSetDraft = (exerciseName: string, index: number, key: keyof SetDraft, value: string) => {
    setSetDrafts(prev => {
      const next = { ...prev };
      const drafts = [...(next[exerciseName] ?? [emptySet])];
      drafts[index] = { ...drafts[index], [key]: value };
      next[exerciseName] = drafts;
      return next;
    });
  };

  const addSetDraft = (exerciseName: string) => {
    setSetDrafts(prev => {
      const nextDrafts = { ...prev };
      nextDrafts[exerciseName] = [...(nextDrafts[exerciseName] ?? []), createEmptySet()];
      return nextDrafts;
    });
  };

  const removeSetDraft = (exerciseName: string, index: number) => {
    setSetDrafts(prev => {
      const next = { ...prev };
      next[exerciseName] = (next[exerciseName] ?? []).filter((_, idx) => idx !== index);
      if (next[exerciseName].length === 0) {
        next[exerciseName] = [createEmptySet()];
      }
      return next;
    });
  };

  const handleLogSet = (exerciseName: string) => {
    const drafts = setDrafts[exerciseName] ?? [];
    if (drafts.length === 0) return;

    setExerciseLogs(prev => {
      const existing = prev[exerciseName] ?? { exerciseName, sets: [] };
      const nextSets: SetLog[] = drafts
        .filter(draft => draft.weight && draft.reps)
        .map(draft => ({
          id: Date.now() + Math.random(),
          weight: Number(draft.weight),
          reps: Number(draft.reps),
          rpe: draft.rpe ? Number(draft.rpe) : 0,
        }));

      return {
        ...prev,
        [exerciseName]: {
          ...existing,
          sets: [...existing.sets, ...nextSets],
        },
      };
    });

    setSetDrafts(prev => ({
      ...prev,
      [exerciseName]: [createEmptySet()],
    }));
  };

  const handleFinishWorkoutInternal = () => {
    const completedLogs = Object.fromEntries(
      Object.entries(exerciseLogs).filter(([, value]) => value.sets.length > 0)
    );

    if (!workoutName.trim()) {
      alert('Please enter a name for your workout.');
      return;
    }

    if (Object.keys(completedLogs).length === 0) {
      alert('Log at least one set before finishing the workout.');
      return;
    }

    onFinishWorkout(workoutName.trim(), completedLogs);
    setSelectedTemplateId('');
    setWorkoutName('Custom Workout');
    setExerciseLogs({});
    setSetDrafts({});
  };

  const handleAddExerciseToTemplate = () => {
    if (!templateDraft.name.trim()) {
      alert('Provide a template name first.');
      return;
    }

    setTemplateDraft(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: `Exercise ${prev.exercises.length + 1}`, sets: '3', reps: '8-12' },
      ],
    }));
  };

  const handleTemplateExerciseChange = (index: number, key: keyof Exercise, value: string) => {
    setTemplateDraft(prev => {
      const exercises = [...prev.exercises];
      exercises[index] = { ...exercises[index], [key]: value };
      return {
        ...prev,
        exercises,
      };
    });
  };

  const handleCreateTemplate = () => {
    if (!templateDraft.name.trim()) {
      alert('Template name is required.');
      return;
    }

    if (templateDraft.exercises.length === 0) {
      alert('Add at least one exercise to the template.');
      return;
    }

    const newTemplate: WorkoutTemplate = {
      id: templateDraft.name.toLowerCase().replace(/\s+/g, '-'),
      name: templateDraft.name.trim(),
      exercises: templateDraft.exercises.map(exercise => ({
        name: exercise.name.trim(),
        sets: exercise.sets,
        reps: exercise.reps,
      })),
    };

    onAddTemplate(newTemplate);
    setShowTemplateBuilder(false);
    setTemplateDraft({ id: '', name: '', exercises: [] });
    setSelectedTemplateId(newTemplate.id);
    setWorkoutName(newTemplate.name);
    setExerciseLogs(createExerciseLogs(newTemplate.exercises));
    setSetDrafts(
      newTemplate.exercises.reduce((acc, exercise) => {
        acc[exercise.name] = [createEmptySet()];
        return acc;
      }, {} as Record<string, SetDraft[]>)
    );
  };

  const totalSetsLogged = useMemo(
    () =>
      Object.values(exerciseLogs).reduce((total, log) => {
        return total + log.sets.length;
      }, 0),
    [exerciseLogs]
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface border border-border rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-2xl font-semibold">Workout Session</h1>
          <p className="text-sm text-text-muted">Select a template, log your sets, and finish when you are done crushing it.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowTemplateBuilder(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 text-sm font-semibold transition-colors"
          >
            <WandIcon className="w-4 h-4" />
            Build Template
          </button>
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-border/20 text-sm font-semibold transition-colors"
          >
            <HistoryIcon className="w-4 h-4" />
            Clear History
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-card">
            <h2 className="font-semibold text-sm text-text-muted uppercase tracking-wide mb-3">Templates</h2>
            <div className="space-y-2">
              {workoutTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${
                    selectedTemplateId === template.id
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{template.name}</span>
                    <span className="text-xs text-text-muted">{template.exercises.length} moves</span>
                  </div>
                </button>
              ))}
              {workoutTemplates.length === 0 && (
                <p className="text-xs text-text-muted">Create a template to get started.</p>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-2">
            <div className="flex items-center gap-3">
              <DumbbellIcon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Sets logged</p>
                <p className="text-xs text-text-muted">{totalSetsLogged} total</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HistoryIcon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Workouts saved</p>
                <p className="text-xs text-text-muted">{workoutHistory.length}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-sm font-semibold w-full sm:w-1/3">Workout Name</label>
              <input
                value={workoutName}
                onChange={event => setWorkoutName(event.target.value)}
                className="w-full sm:flex-1 px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Leg Day Destroyer"
              />
            </div>

            {activeTemplate ? (
              <p className="text-xs text-text-muted">Logging sets for {activeTemplate.name}</p>
            ) : (
              <p className="text-xs text-text-muted">No template selected. Choose one on the left or build your own.</p>
            )}
          </div>

          <div className="space-y-6">
            {(activeTemplate?.exercises ?? []).map(exercise => {
              const logs = exerciseLogs[exercise.name]?.sets ?? [];
              const drafts = setDrafts[exercise.name] ?? [createEmptySet()];

              return (
                <article key={exercise.name} className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{exercise.name}</h3>
                      <p className="text-xs text-text-muted">
                        Target: {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addSetDraft(exercise.name)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                    >
                      Add Set
                    </button>
                  </div>

                  <div className="space-y-3">
                    {drafts.map((draft, index) => (
                      <div key={index} className="grid grid-cols-3 gap-3">
                        <input
                          type="number"
                          className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Weight"
                          value={draft.weight}
                          onChange={event => updateSetDraft(exercise.name, index, 'weight', event.target.value)}
                        />
                        <input
                          type="number"
                          className="px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Reps"
                          value={draft.reps}
                          onChange={event => updateSetDraft(exercise.name, index, 'reps', event.target.value)}
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="flex-1 px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="RPE"
                            value={draft.rpe}
                            onChange={event => updateSetDraft(exercise.name, index, 'rpe', event.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSetDraft(exercise.name, index)}
                            className="px-3 py-2 rounded-xl border border-border text-xs hover:bg-border/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleLogSet(exercise.name)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 text-sm font-semibold transition-colors"
                    >
                      Log Sets ({drafts.length})
                    </button>
                  </div>

                  {logs.length > 0 && (
                    <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
                      <h4 className="text-sm font-semibold mb-2">Logged Sets</h4>
                      <ul className="space-y-2 text-sm">
                        {logs.map(set => (
                          <li key={set.id} className="flex items-center justify-between">
                            <span>
                              {set.weight} lb × {set.reps} reps
                            </span>
                            {set.rpe > 0 && <span className="text-xs text-text-muted">RPE {set.rpe}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}

            {(!activeTemplate || activeTemplate.exercises.length === 0) && (
              <div className="bg-surface border border-dashed border-border rounded-2xl p-10 text-center text-sm text-text-muted">
                Select or create a template to begin logging sets.
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFinishWorkoutInternal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
            >
              Finish Workout
            </button>
          </div>
        </div>
      </section>

      {showTemplateBuilder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Template</h2>
              <button
                type="button"
                onClick={() => setShowTemplateBuilder(false)}
                className="text-sm text-text-muted hover:text-text-base"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full px-4 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Push Day"
                value={templateDraft.name}
                onChange={event =>
                  setTemplateDraft(prev => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />

              {templateDraft.exercises.map((exercise, index) => (
                <div key={index} className="bg-background/40 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={event =>
                        handleTemplateExerciseChange(index, 'name', event.target.value)
                      }
                    />
                    <input
                      className="w-full sm:w-28 px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={event =>
                        handleTemplateExerciseChange(index, 'sets', event.target.value)
                      }
                    />
                    <input
                      className="w-full sm:w-28 px-3 py-2 rounded-xl border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={event =>
                        handleTemplateExerciseChange(index, 'reps', event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddExerciseToTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 text-sm font-semibold transition-colors"
              >
                Add Exercise
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTemplateBuilder(false)}
                className="px-4 py-2 rounded-full border border-border text-sm hover:bg-border/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTemplate}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;
