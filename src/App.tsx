/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType, UserProgress } from './types';
import { loadUserProgress, saveUserProgress } from './lib/storage';
import { CosmicBackground } from './components/CosmicBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { GamesCatalogPage } from './pages/GamesCatalogPage';
import { CodeShooterPage } from './pages/CodeShooterPage';
import { TerminalGamePage } from './pages/TerminalGamePage';
import { LessonPage } from './pages/LessonPage';
import { ErrorDiagPage } from './pages/ErrorDiagPage';
import { VictoryPage } from './pages/VictoryPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { CompanionsPage } from './pages/CompanionsPage';
import { AiAgentPage } from './pages/AiAgentPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('future_lab_reduced_motion') === 'true' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
    return false;
  });

  // Sync state to local storage on changes
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem('future_lab_reduced_motion', String(next));
      return next;
    });
  };

  const handleUpdateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveUserProgress(next);
      return next;
    });
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic cosmic background intensity based on view
  const isArcade = currentPage === 'shooter';
  const isTerminal = currentPage === 'terminal';
  const cosmicIntensity = isArcade ? 'crimson' : isTerminal ? 'purple' : 'normal';

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* 3D Cosmic Starfield Background with mouse parallax */}
      <CosmicBackground
        intensity={cosmicIntensity}
        warpSpeed={isArcade}
        reducedMotion={reducedMotion}
      />

      {/* Top Header Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        progress={progress}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Cinematic Animated Page Transition Container */}
      <main className="flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            {currentPage === 'landing' && (
              <LandingPage onNavigate={handleNavigate} progress={progress} />
            )}
            {currentPage === 'catalog' && (
              <GamesCatalogPage
                onNavigate={handleNavigate}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
            {currentPage === 'shooter' && (
              <CodeShooterPage
                onNavigate={handleNavigate}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
            {currentPage === 'terminal' && (
              <TerminalGamePage
                onNavigate={handleNavigate}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
            {currentPage === 'lesson' && (
              <LessonPage onNavigate={handleNavigate} progress={progress} />
            )}
            {currentPage === 'error_diag' && (
              <ErrorDiagPage onNavigate={handleNavigate} progress={progress} />
            )}
            {currentPage === 'victory' && (
              <VictoryPage onNavigate={handleNavigate} progress={progress} />
            )}
            {currentPage === 'roadmap' && (
              <RoadmapPage onNavigate={handleNavigate} progress={progress} />
            )}
            {currentPage === 'companions' && (
              <CompanionsPage
                onNavigate={handleNavigate}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}
            {currentPage === 'ai_agent' && (
              <AiAgentPage onNavigate={handleNavigate} progress={progress} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
