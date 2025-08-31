import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';

interface SwipeableTaskProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export function SwipeableTask({ task, onComplete, onDelete, children }: SwipeableTaskProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 120;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setSwipeOffset(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    const diff = currentX.current - startX.current;
    const threshold = 60;
    
    if (diff > threshold) {
      // Swipe right - complete task
      onComplete(task.id);
      triggerHapticFeedback();
    } else if (diff < -threshold) {
      // Swipe left - delete task
      onDelete(task.id);
      triggerHapticFeedback();
    }
    
    // Reset
    setSwipeOffset(0);
    setIsSwipeActive(false);
    isDragging.current = false;
  };

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background Actions */}
      <div className="absolute inset-0 flex">
        {/* Complete Action (Right) */}
        <div className="flex-1 bg-green-500 flex items-center justify-start pl-4">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Complete</span>
          </div>
        </div>
        
        {/* Delete Action (Left) */}
        <div className="flex-1 bg-red-500 flex items-center justify-end pr-4">
          <div className="flex items-center gap-2 text-white">
            <span className="font-medium">Delete</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
      </div>

      {/* Task Content */}
      <div
        className={`relative bg-white/5 backdrop-blur-sm transition-transform duration-200 ${
          isSwipeActive ? 'transition-none' : ''
        }`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0) {
      e.preventDefault();
      const maxPull = 120;
      const resistance = 0.5;
      const limitedDiff = Math.min(diff * resistance, maxPull);
      setPullDistance(limitedDiff);
      setCanRefresh(limitedDiff > 60);
    }
  };

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setCanRefresh(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 overflow-hidden"
        style={{ 
          height: `${pullDistance}px`,
          transform: `translateY(-${Math.max(0, 60 - pullDistance)}px)`
        }}
      >
        <div className={`flex items-center gap-2 text-slate-400 ${canRefresh ? 'text-blue-400' : ''}`}>
          <div className={`transition-transform duration-200 ${canRefresh ? 'rotate-180' : ''}`}>
            {isRefreshing ? (
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : canRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// Bottom navigation for mobile
interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function BottomNavigation({ currentView, onViewChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'kanban', label: 'Kanban', icon: '📋' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'subscription', label: 'Premium', icon: '⭐' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 safe-area-pb z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'text-blue-400 bg-blue-400/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Floating Action Button
interface FABProps {
  onClick: () => void;
  icon?: string;
  label?: string;
}

export function FloatingActionButton({ onClick, icon = '➕', label = 'Add Task' }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-xl hover:scale-110 transition-all duration-200 z-40 md:hidden"
      title={label}
    >
      {icon}
    </button>
  );
}
