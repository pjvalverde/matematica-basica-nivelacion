import React, { useState, useEffect, FC } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ExerciseDisplay from './components/ExerciseDisplay';
import ExerciseGenerator from './utils/ExerciseGenerator';
import ExerciseCard from './components/ExerciseCard';
import Login from './components/Login';
import Register from './components/Register';
import { app, auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const App: FC = () => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [selectedSection, setSelectedSection] =
    useState<'login' | 'register' | 'exercises'>('login');

  const [exerciseType, setExerciseType] =
    useState<'notables' | 'operations'>('notables');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy'
  );
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [usePredefined, setUsePredefined] = useState<boolean>(false);
    const [predefinedExercises, setPredefinedExercises] = useState<{exercise: string, solution: string}[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

    useEffect(() => {
        // Cargar ejercicios predefinidos al cambiar el tipo
        if (usePredefined) {
            const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
            setPredefinedExercises(exercises);
            setCurrentExerciseIndex(0);

            if (exercises.length > 0) {
                setCurrentExercise(exercises[0].exercise);
                setSolution(exercises[0].solution);
            }
        }
    }, [exerciseType, usePredefined]);

    const generateNewExercise = () => {
        setShowSolution(false);
        setIsCorrect(null);

        if (usePredefined) {
            // Avanzar al siguiente ejercicio predefinido
            const nextIndex = (currentExerciseIndex + 1) % predefinedExercises.length;
            setCurrentExerciseIndex(nextIndex);
            setCurrentExercise(predefinedExercises[nextIndex].exercise);
            setSolution(predefinedExercises[nextIndex].solution);
        } else {
            // Generar ejercicio aleatorio
            const { exercise, solution } = ExerciseGenerator.generate(exerciseType, difficulty);
            setCurrentExercise(exercise);
            setSolution(solution);
        }
    };

    const checkAnswer = () => {
        const userAnswerClean = (document.getElementById("user-answer") as HTMLInputElement).value.replace(/\s+/g, '');
        const solutionClean = solution.toString().replace(/\s+/g, '');

        setIsCorrect(userAnswerClean === solutionClean);
    };

    const revealSolution = () => {
        setShowSolution(true);
    };

    const toggleExerciseMode = () => {
        setUsePredefined(!usePredefined);
        setShowSolution(false);
        setIsCorrect(null);

        if (!usePredefined) {
            // Cambiar a ejercicios predefinidos
            const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
            setPredefinedExercises(exercises);
            setCurrentExerciseIndex(0);

            if (exercises.length > 0) {
                setCurrentExercise(exercises[0].exercise);
                setSolution(exercises[0].solution);
            }
        } else {
            // Volver a ejercicios aleatorios
            setCurrentExercise('');
            setSolution('');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    const handleRegister = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            setSelectedSection('exercises');
        } catch (err) {
            console.error(err);
        }
    };
    const handleLogin = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            setSelectedSection('exercises');
        } catch (err) {
            console.error(err);
        }
    };
  return (
        <div className="app-container">
            <Header user={user} handleLogout={handleLogout} />
            <main>
                {user ? (
                    <ExerciseCard
                        userAnswer={userAnswer}
                        setUserAnswer={setUserAnswer}
                        exerciseType={exerciseType}
                        setExerciseType={setExerciseType}
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                        currentExercise={currentExercise}
                        setCurrentExercise={setCurrentExercise}
                        solution={solution}
                        setSolution={setSolution}
                        showSolution={showSolution}
                        setShowSolution={setShowSolution}
                        isCorrect={isCorrect}
                        setIsCorrect={setIsCorrect}
                        usePredefined={usePredefined}
                        setUsePredefined={setUsePredefined}
                        predefinedExercises={predefinedExercises}
                        setPredefinedExercises={setPredefinedExercises}
                        currentExerciseIndex={currentExerciseIndex}
                        setCurrentExerciseIndex={setCurrentExerciseIndex}
                        toggleExerciseMode={toggleExerciseMode}
                        generateNewExercise={generateNewExercise}
                        exercise={currentExercise}
                        onCheck={checkAnswer}
                        onReveal={revealSolution}
                    />
                ) : (
                    <>
                        {selectedSection === 'login' && (
                            <Login handleLogin={handleLogin} onRegisterClick={() => setSelectedSection('register')} />
                        )}
                        {selectedSection === 'register' && (
                            <Register
                                handleRegister={handleRegister}
                                onLoginClick={() => setSelectedSection('login')}
                            />
                        )}
                        {selectedSection === 'exercises' && <div></div>}
                    </>                    
                )}
            </main>
            <Footer />
        </div>
  );
};
export default App;
