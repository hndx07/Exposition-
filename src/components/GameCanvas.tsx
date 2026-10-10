import React, { useState, useEffect, useRef } from 'react';
import { MajorType, NPCId } from '../types/game';
import { MAJORS } from '../constants/storyData';
import { playTapSound, playFlickSound, playDoorLocked, triggerHaptic } from '../utils/audio';

interface GameCanvasProps {
  currentChapter: number;
  playerMajor: MajorType | null;
  onInteractNPC: (npcId: NPCId) => void;
  onSelectWing: (wing: MajorType) => void;
  onEnterChapterScene?: (sceneId: string) => void;
  onMovingChange: (moving: boolean) => void;
  lockedWingNotice?: string | null;
}

interface Position {
  x: number;
  y: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentChapter,
  playerMajor,
  onInteractNPC,
  onSelectWing,
  onEnterChapterScene,
  onMovingChange,
}) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 190, y: 360 });
  const [targetPos, setTargetPos] = useState<Position>({ x: 190, y: 360 });
  const [isMoving, setIsMoving] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [dashTrail, setDashTrail] = useState<Position | null>(null);
  const [lockedDoorShake, setLockedDoorShake] = useState<MajorType | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Smooth walking animation towards targetPos
  useEffect(() => {
    let animFrame: number;

    const animateMovement = () => {
      setPlayerPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 3) {
          const speed = 4.5;
          const nx = prev.x + (dx / distance) * speed;
          const ny = prev.y + (dy / distance) * speed;
          setFacingLeft(dx < 0);
          return { x: nx, y: ny };
        } else {
          setIsMoving(false);
          onMovingChange(false);
          return targetPos;
        }
      });

      if (isMoving) {
        animFrame = requestAnimationFrame(animateMovement);
      }
    };

    if (isMoving) {
      onMovingChange(true);
      animFrame = requestAnimationFrame(animateMovement);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isMoving, targetPos, onMovingChange]);

  // Handle pointer down (tracking for tap vs flick)
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
  };

  // Handle pointer up (detect flick/swipe vs tap to move)
  const handlePointerUp = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !touchStartRef.current) return;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    const dt = Date.now() - touchStartRef.current.time;

    // FLICK / SWIPE DETECTION (fast drag > 35px in < 280ms)
    if (dist > 35 && dt < 280) {
      playFlickSound();
      triggerHaptic(25);
      setDashTrail({ ...playerPos });
      setTimeout(() => setDashTrail(null), 300);

      // Dash in swipe direction
      const dashDist = 85;
      const angle = Math.atan2(dy, dx);
      const dashX = Math.max(30, Math.min(350, playerPos.x + Math.cos(angle) * dashDist));
      const dashY = Math.max(80, Math.min(500, playerPos.y + Math.sin(angle) * dashDist));

      setTargetPos({ x: dashX, y: dashY });
      setIsMoving(true);
      touchStartRef.current = null;
      return;
    }

    // NORMAL TAP TO WALK
    // Constrain inside walkable area
    const clampedX = Math.max(30, Math.min(350, clientX));
    const clampedY = Math.max(80, Math.min(520, clientY));

    playTapSound();
    setTargetPos({ x: clampedX, y: clampedY });
    setIsMoving(true);
    touchStartRef.current = null;
  };

  // Handle wing door tap with locked check
  const handleWingDoorTap = (wing: MajorType) => {
    if (wing !== playerMajor) {
      playDoorLocked();
      setLockedDoorShake(wing);
      setTimeout(() => setLockedDoorShake(null), 400);
      onSelectWing(wing); // triggers Pak Satpam warning
    } else {
      playTapSound();
      onSelectWing(wing);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[580px] bg-[#CDEFD9] rounded-3xl overflow-hidden border-4 border-[#3B3355] shadow-2xl select-none touch-none"
      style={{
        backgroundImage: `radial-gradient(#3B3355 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        backgroundColor: '#D7F3E2',
      }}
    >
      {/* Parallax Clouds floating at top */}
      <div className="absolute top-2 left-6 w-24 h-8 bg-white/70 rounded-full blur-[1px] pointer-events-none anim-cloud-slow" />
      <div className="absolute top-6 right-8 w-32 h-9 bg-white/80 rounded-full blur-[1px] pointer-events-none anim-cloud-fast" />

      {/* TOP SCHOOL BUILDING / COURTYARD HEADER BANNER */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-[#CFE6FF] border-b-4 border-[#3B3355] p-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-full border border-[#3B3355]/30">
            <span className="text-xs">🏫</span>
            <span className="text-[10px] font-heading font-extrabold text-[#3B3355]">
              SMK Muhammadiyah Bawang
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#3B3355]/70 bg-[#FFF1B8] px-2 py-0.5 rounded-full border border-[#3B3355]/20">
            Courtyard & Wings
          </span>
        </div>

        {/* School Archway / Roof decor */}
        <div className="flex items-end justify-around pb-1">
          <div className="w-16 h-8 bg-[#FFD6C9] rounded-t-2xl border-2 border-[#3B3355] flex items-center justify-center text-[10px] font-extrabold text-[#3B3355]">
            Class XI
          </div>
          <div className="w-20 h-10 bg-[#FFF1B8] rounded-t-2xl border-2 border-[#3B3355] flex flex-col items-center justify-center shadow-inner">
            <span className="text-xs">☀️</span>
            <span className="text-[9px] font-extrabold text-[#3B3355]">MUHIBA</span>
          </div>
          <div className="w-16 h-8 bg-[#E3D4FF] rounded-t-2xl border-2 border-[#3B3355] flex items-center justify-center text-[10px] font-extrabold text-[#3B3355]">
            Library
          </div>
        </div>
      </div>

      {/* WALKING PATHWAY (Vector Cobblestone Grid) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-44 h-full bg-[#FFF1B8]/60 border-x-4 border-dashed border-[#3B3355]/20 pointer-events-none" />
      <div className="absolute top-48 left-0 right-0 h-28 bg-[#FFF1B8]/50 border-y-4 border-dashed border-[#3B3355]/20 pointer-events-none" />

      {/* THREE DEPARTMENT WING DOORS (Cross-Wing Locking) */}
      <div className="absolute top-28 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
        {/* AKL Wing Door */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleWingDoorTap('AKL');
          }}
          className={`flex flex-col items-center cursor-pointer transition-all ${
            lockedDoorShake === 'AKL' ? 'anim-shake' : ''
          }`}
        >
          <div
            className={`w-24 p-2 rounded-2xl border-3 border-[#3B3355] text-center shadow-md ${
              playerMajor === 'AKL'
                ? 'bg-[#CFE6FF] ring-2 ring-[#3B3355] hover:scale-105'
                : 'bg-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-sm">📊</span>
              <span className="font-heading font-extrabold text-[11px] text-[#3B3355]">AKL WING</span>
            </div>
            <div className="text-[9px] font-bold text-[#3B3355]/80">Canteen & Bank</div>
            {playerMajor !== 'AKL' && (
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
                🔒 Locked
              </span>
            )}
          </div>
        </div>

        {/* TO Wing Door */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleWingDoorTap('TO');
          }}
          className={`flex flex-col items-center cursor-pointer transition-all ${
            lockedDoorShake === 'TO' ? 'anim-shake' : ''
          }`}
        >
          <div
            className={`w-24 p-2 rounded-2xl border-3 border-[#3B3355] text-center shadow-md ${
              playerMajor === 'TO'
                ? 'bg-[#FFD6C9] ring-2 ring-[#3B3355] hover:scale-105'
                : 'bg-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-sm">🔧</span>
              <span className="font-heading font-extrabold text-[11px] text-[#3B3355]">TO WING</span>
            </div>
            <div className="text-[9px] font-bold text-[#3B3355]/80">EV Workshop</div>
            {playerMajor !== 'TO' && (
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
                🔒 Locked
              </span>
            )}
          </div>
        </div>

        {/* TJKT Wing Door */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleWingDoorTap('TJKT');
          }}
          className={`flex flex-col items-center cursor-pointer transition-all ${
            lockedDoorShake === 'TJKT' ? 'anim-shake' : ''
          }`}
        >
          <div
            className={`w-24 p-2 rounded-2xl border-3 border-[#3B3355] text-center shadow-md ${
              playerMajor === 'TJKT'
                ? 'bg-[#CDEFD9] ring-2 ring-[#3B3355] hover:scale-105'
                : 'bg-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-sm">🌐</span>
              <span className="font-heading font-extrabold text-[11px] text-[#3B3355]">TJKT WING</span>
            </div>
            <div className="text-[9px] font-bold text-[#3B3355]/80">Cyber Net Lab</div>
            {playerMajor !== 'TJKT' && (
              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
                🔒 Locked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PAK SATPAM (Guarding the Wing Corridors) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onInteractNPC('pak_satpam');
        }}
        className="absolute top-44 left-1/2 -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center anim-bob"
      >
        <div className="bg-white/95 px-2 py-0.5 rounded-full border-2 border-[#3B3355] text-[9px] font-bold text-[#3B3355] shadow-sm mb-1 whitespace-nowrap">
          💬 Pak Satpam
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#FFF1B8] border-3 border-[#3B3355] flex items-center justify-center text-xl shadow-md">
          👮
        </div>
      </div>

      {/* MR. HENDRA (Mentor / English Teacher in Courtyard) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onInteractNPC('mr_hendra');
        }}
        className="absolute top-64 left-10 z-20 cursor-pointer flex flex-col items-center anim-breathe"
      >
        <div className="bg-white/95 px-2 py-0.5 rounded-full border-2 border-[#3B3355] text-[9px] font-bold text-[#3B3355] shadow-sm mb-1 whitespace-nowrap">
          💬 Mr. Hendra
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#CFE6FF] border-3 border-[#3B3355] flex items-center justify-center text-xl shadow-md">
          🧑‍🏫
        </div>
      </div>

      {/* RAFA (Debate Rival) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onInteractNPC('rafa');
        }}
        className="absolute top-64 right-10 z-20 cursor-pointer flex flex-col items-center anim-bob"
      >
        <div className="bg-white/95 px-2 py-0.5 rounded-full border-2 border-[#3B3355] text-[9px] font-bold text-[#3B3355] shadow-sm mb-1 whitespace-nowrap">
          💬 Rafa
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#FFD6C9] border-3 border-[#3B3355] flex items-center justify-center text-xl shadow-md">
          😏
        </div>
      </div>

      {/* MIA (Librarian near library wing) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onInteractNPC('mia');
        }}
        className="absolute bottom-28 left-8 z-20 cursor-pointer flex flex-col items-center anim-breathe"
      >
        <div className="bg-white/95 px-2 py-0.5 rounded-full border-2 border-[#3B3355] text-[9px] font-bold text-[#3B3355] shadow-sm mb-1 whitespace-nowrap">
          💬 Mia (Library)
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#E3D4FF] border-3 border-[#3B3355] flex items-center justify-center text-xl shadow-md">
          📚
        </div>
      </div>

      {/* AUDITORIUM ENTRANCE ARCHWAY (Bottom Right) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onEnterChapterScene) onEnterChapterScene('auditorium');
        }}
        className="absolute bottom-24 right-8 z-20 cursor-pointer flex flex-col items-center hover:scale-105 transition-all"
      >
        <div className="bg-[#FFF1B8] px-2 py-0.5 rounded-full border-2 border-[#3B3355] text-[9px] font-extrabold text-[#3B3355] shadow-sm mb-1 whitespace-nowrap">
          🏛️ Auditorium Stage
        </div>
        <div className="w-14 h-12 rounded-2xl bg-[#3B3355] border-3 border-white text-white flex flex-col items-center justify-center text-xs font-bold shadow-lg">
          <span>🎤</span>
          <span className="text-[8px] uppercase tracking-wider text-[#FFF1B8]">Debate</span>
        </div>
      </div>

      {/* FLICK / DASH TRAIL EFFECT */}
      {dashTrail && (
        <div
          className="absolute w-10 h-10 rounded-2xl bg-[#FFF1B8]/60 border-2 border-white pointer-events-none transition-all duration-300"
          style={{
            left: `${dashTrail.x - 20}px`,
            top: `${dashTrail.y - 20}px`,
            transform: 'scale(1.4)',
            opacity: 0.3,
          }}
        />
      )}

      {/* PLAYER CHARACTER AVATAR */}
      <div
        className={`absolute z-30 transition-transform duration-75 pointer-events-none flex flex-col items-center ${
          isMoving ? 'anim-bob' : 'anim-breathe'
        }`}
        style={{
          left: `${playerPos.x - 20}px`,
          top: `${playerPos.y - 30}px`,
          transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {/* Name tag */}
        <div className="bg-[#3B3355] text-[#FFF1B8] px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/50 shadow whitespace-nowrap mb-0.5">
          You
        </div>
        {/* Body */}
        <div className="w-10 h-11 rounded-2xl bg-white border-3 border-[#3B3355] flex items-center justify-center shadow-lg relative">
          <span className="text-xl">🎒</span>
          {/* Vocational badge on collar */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFF1B8] border border-[#3B3355] flex items-center justify-center text-[7px] font-bold">
            ★
          </span>
        </div>
      </div>

      {/* TARGET CLICK MARKER */}
      {isMoving && (
        <div
          className="absolute w-6 h-6 rounded-full border-2 border-[#3B3355] border-dashed animate-ping pointer-events-none opacity-60"
          style={{
            left: `${targetPos.x - 12}px`,
            top: `${targetPos.y - 12}px`,
          }}
        />
      )}

      {/* BOTTOM CONTROLS HINT (Discreet) */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="bg-[#3B3355]/70 backdrop-blur-sm text-white/90 text-[10px] font-medium px-3 py-1 rounded-full">
          👉 Tap ground to walk • Quick flick to dash • Tap characters to talk
        </span>
      </div>
    </div>
  );
};
