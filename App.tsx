import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import NutritionHub from './components/NutritionHub';
import ProgressTracker from './components/ProgressTracker';
import Catalog from './components/Catalog';
import { DumbbellIcon, FlameIcon, ChartLineUpIcon, BookOpenIcon, LayoutDashboardIcon } from './components/ui/icons';
import type { FoodLog, WorkoutLog, ExerciseLog, WorkoutTemplate } from './types';
import { WORKOUT_TEMPLATES, NUTRITION_PLAN } from './constants';
import ThemeSwitcher from './components/ui/ThemeSwitcher';

type View = 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'catalog';

const generateWeightTrend = (days: number, startWeight: number) => {
  const trend = [];
  let currentWeight = startWeight;
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    
    // Add some random fluctuation
    if (i > 0) {
      currentWeight += (Math.random() - 0.5) * 0.4;
      currentWeight = Math.round(currentWeight * 10) / 10;
    }
    
    const label = i === days - 1 ? 'Today' : `${days - 1 - i}d ago`;
    trend.push({ day: label, weight: currentWeight });
  }
  return trend;
};

const mockWeightTrend = generateWeightTrend(30, 205.0);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<string>('vibrant-dark');
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(WORKOUT_TEMPLATES);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([]);
  const [weightHistory, setWeightHistory] = useState(mockWeightTrend);
  const [directStartTemplateId, setDirectStartTemplateId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddFoodLog = (newLog: Omit<FoodLog, 'id'>) => {
    setFoodLogs(prev => [...prev, { ...newLog, id: Date.now() }]);
  };
  
  const handleAddTemplate = (newTemplate: WorkoutTemplate) => {
    setWorkoutTemplates(prev => [...prev, newTemplate]);
  };

  const handleFinishWorkout = (workoutName: string, logs: Record<string, ExerciseLog>) => {
    const newWorkoutLog: WorkoutLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      name: workoutName,
      logs: logs,
    };
    setWorkoutHistory(prev => [...prev, newWorkoutLog]);
    alert("Workout Finished and Saved!");
    setCurrentView('dashboard');
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all workout history? This action cannot be undone.")) {
        setWorkoutHistory([]);
    }
  };

  const handleStartWorkout = (templateId: string) => {
    setDirectStartTemplateId(templateId);
    setCurrentView('workout');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard foodLogs={foodLogs} weightHistory={weightHistory} nutritionPlan={NUTRITION_PLAN} theme={theme} onStartWorkout={handleStartWorkout} workoutHistory={workoutHistory} />;
      case 'workout':
        return <WorkoutLogger 
            workoutHistory={workoutHistory} 
            onFinishWorkout={handleFinishWorkout} 
            workoutTemplates={workoutTemplates} 
            onAddTemplate={handleAddTemplate}
            directStartTemplateId={directStartTemplateId}
            onClearDirectStart={() => setDirectStartTemplateId(null)}
            onClearHistory={handleClearHistory}
        />;
      case 'nutrition':
        return <NutritionHub foodLogs={foodLogs} onAddFoodLog={handleAddFoodLog} nutritionPlan={NUTRITION_PLAN} />;
      case 'progress':
        return <ProgressTracker theme={theme} workoutHistory={workoutHistory} />;
      case 'catalog':
        return <Catalog />;
      default:
        return <Dashboard foodLogs={foodLogs} weightHistory={weightHistory} nutritionPlan={NUTRITION_PLAN} theme={theme} onStartWorkout={handleStartWorkout} workoutHistory={workoutHistory}/>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon /> },
    { id: 'workout', label: 'Workout', icon: <DumbbellIcon /> },
    { id: 'nutrition', label: 'Nutrition', icon: <FlameIcon /> },
    { id: 'progress', label: 'Progress', icon: <ChartLineUpIcon /> },
    { id: 'catalog', label: 'Catalog', icon: <BookOpenIcon /> },
  ];

  return (
    <div className="min-h-screen bg-background text-text-base flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-border">
          <h1 className="text-xl font-bold text-text-base">Trainer</h1>
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 pb-28">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <div className="flex justify-around max-w-2xl mx-auto p-1 sm:p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-200 rounded-lg group active:scale-95 ${currentView === item.id ? 'text-primary' : 'text-text-muted hover:text-text-base'}`}
            >
              <div className={`p-2 rounded-full transition-colors ${currentView === item.id ? 'bg-primary/10' : 'group-hover:bg-surface'}`}>
                <div className="w-6 h-6">{item.icon}</div>
              </div>
              <span className="text-xs font-semibold mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;