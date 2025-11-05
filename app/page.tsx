// app/page.tsx
// Complete flow with autoscrolling love letter and typewriter effect

"use client";

import { useEffect, useRef, useState } from "react";

interface Heart {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [showSurpriseTeaser, setShowSurpriseTeaser] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const heartIdCounter = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const letterContainerRef = useRef<HTMLDivElement>(null);

  const TARGET_SCORE = 15;
  const heartEmojis = ["💖", "💕", "💗", "💝", "💓"];

  const letterText = `My beautiful babyy,

I don't even know where to start because words never feel big enough for what I feel for you. You came into my life like a quiet kind of magic, the kind that changes everything without even trying. Before you, life was just a series of days. But after you, every day became something I look forward to. You brought color to the dull moments, calm to the chaos, and warmth to every corner of my heart.

You've become my peace, my comfort, and my reason. I love you more deeply than I ever thought I could love someone. It's in the small things, like the way your laugh fills my chest with light, or how your voice makes everything around me fade away. When I hear you talk, it feels like the world pauses for a second, just so I can memorize the sound. You have this gentle power over me, one that doesn't control but heals.

There are moments I catch myself thinking about you out of nowhere, and it hits me again how lucky I am. You are the calm after every storm, the warmth after every long day. You've shown me what real love feels like, not the kind that fades with time, but the one that grows stronger in every silence, every smile, every late-night call. Loving you feels like breathing, effortless and constant.

You make me want to be better, to dream bigger, to live softer. You've given me purpose in ways I didn't even realize I needed. You are the reason I wake up with hope and the reason I fall asleep with peace. You've turned ordinary moments into memories I never want to let go of. Every time I think I've reached the limit of how much I can love you, my heart proves me wrong again.

I want you to know that you are my forever. Not just for now, not just until things get hard, but for all the quiet mornings, the stormy nights, the laughter, the tears, and every heartbeat in between. You are my past rewritten, my present made beautiful, and my future worth everything.

I love you endlessly, in every way that love can exist. You are my home, my dream, my once in a lifetime. And for as long as I breathe, my heart will belong to you.

Forever yours,
With all my love 💖`;

  const isValidNickname = (input: string): boolean => {
    const normalized = input.toLowerCase().trim();
    const regex = /^dinu+$/;
    return regex.test(normalized);
  };

  const handleNameSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName.toLowerCase() === "carolina") {
      setNameError(false);
      setHasEnteredName(true);
    } else {
      setNameError(true);
    }
  };

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      if (isValidNickname(nickname)) {
        setNicknameStatus("correct");
        setTimeout(() => {
          setShowSurpriseTeaser(true);
        }, 1500);
      } else {
        setNicknameStatus("incorrect");
      }
    }
  };

  const startGame = () => {
    setShowGame(true);
    setGameStarted(true);
    setScore(0);
    setHearts([]);
    setGameWon(false);
  };

  const createHeart = () => {
    if (!gameAreaRef.current) return;

    const width = gameAreaRef.current.clientWidth;
    const newHeart: Heart = {
      id: heartIdCounter.current++,
      x: Math.random() * (width - 40),
      y: -40,
      speed: 1.5 + Math.random() * 1.5,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
    };

    setHearts((prev) => [...prev, newHeart]);
  };

  const catchHeart = (heartId: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== heartId));
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore >= TARGET_SCORE) {
        setGameWon(true);
        setGameStarted(false);
      }
      return newScore;
    });
  };

  const startLetter = () => {
    setShowLetter(true);
    setDisplayedText("");
    setIsTypingComplete(false);

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.log("Audio playback failed:", err);
        });
    }
  };

  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const heartInterval = setInterval(() => {
      createHeart();
    }, 800);

    const updateHearts = () => {
      if (!gameAreaRef.current) return;

      const height = gameAreaRef.current.clientHeight;

      setHearts((prev) =>
        prev
          .map((heart) => ({ ...heart, y: heart.y + heart.speed }))
          .filter((heart) => heart.y < height)
      );

      if (gameStarted && !gameWon) {
        animationFrameRef.current = requestAnimationFrame(updateHearts);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateHearts);

    return () => {
      clearInterval(heartInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (!showLetter || isTypingComplete) return;

    let currentIndex = 0;
    const typingSpeed = 50;

    const typeNextCharacter = () => {
      if (currentIndex < letterText.length) {
        setDisplayedText(letterText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsTypingComplete(true);
      }
    };

    typeNextCharacter();
  }, [showLetter]);

  useEffect(() => {
    if (!showLetter || !letterContainerRef.current) return;

    letterContainerRef.current.scrollTop =
      letterContainerRef.current.scrollHeight;
  }, [displayedText, showLetter]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 p-4 relative overflow-hidden">
      <audio ref={audioRef} loop>
        <source src="/romantic-song.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float">
          💕
        </div>
        <div
          className="absolute top-32 right-20 text-3xl opacity-15 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          💖
        </div>
        <div
          className="absolute bottom-20 left-32 text-3xl opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-40 right-10 text-4xl opacity-15 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          💗
        </div>
        <div
          className="absolute top-1/2 left-1/4 text-2xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        >
          💝
        </div>
        <div
          className="absolute top-1/3 right-1/3 text-2xl opacity-10 animate-float"
          style={{ animationDelay: "2.5s" }}
        >
          🌸
        </div>
      </div>

      <div
        className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 w-full border-4 border-rose-200/50 relative overflow-hidden animate-slideInUp ${showLetter ? "max-w-2xl" : "max-w-md"} transition-all duration-500`}
      >
        <div className="absolute top-0 right-0 text-6xl opacity-10 -mr-4 -mt-4 animate-heartbeat">
          💕
        </div>
        <div
          className="absolute bottom-0 left-0 text-6xl opacity-10 -ml-4 -mb-4 animate-heartbeat"
          style={{ animationDelay: "0.5s" }}
        >
          💕
        </div>

        {!showGame && !showLetter && (
          <>
            <div className="text-center mb-8 relative z-10">
              <div className="text-7xl mb-4 animate-heartbeat inline-block">
                💖
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-3 font-dancing leading-tight">
                A Little Surprise
              </h1>
              <p className="text-rose-400 text-base font-dancing text-xl">
                Just for you, my love 💕
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              {!hasEnteredName ? (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xl font-dancing font-semibold text-rose-500 mb-3 text-center"
                    >
                      What&apos;s your name, princess? 👑
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError(false);
                      }}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleNameSubmit()
                      }
                      placeholder="Type your beautiful name..."
                      className="w-full px-4 py-3 text-center text-lg text-rose-700 placeholder:text-rose-300 bg-rose-50/50 border-2 border-rose-300 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 transition-all duration-300 font-quicksand hover:border-rose-400"
                    />
                  </div>

                  {nameError && (
                    <div className="text-center p-4 bg-rose-100 border-2 border-rose-300 rounded-2xl animate-fadeIn">
                      <p className="text-rose-700 font-dancing text-xl font-semibold">
                        Hmm, this surprise isn&apos;t for you... Try again! 💕
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleNameSubmit}
                    disabled={!name.trim()}
                    className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl font-quicksand text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="relative z-10">Continue with Love →</span>
                    <span className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover:opacity-100"></span>
                  </button>
                </div>
              ) : !showSurpriseTeaser ? (
                <div className="space-y-6">
                  <div className="text-center mb-4 animate-fadeIn">
                    <p className="text-rose-600 font-dancing text-2xl mb-2">
                      Hello, {name}! 💕
                    </p>
                  </div>

                  <div className="animate-slideInUp">
                    <label
                      htmlFor="nickname"
                      className="block text-xl font-dancing font-semibold text-rose-500 mb-3 text-center"
                    >
                      What&apos;s Pikachu&apos;s nickname? ⚡
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        setNicknameStatus("idle");
                      }}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleNicknameSubmit()
                      }
                      placeholder="Type the nickname..."
                      className="w-full px-4 py-3 text-center text-lg text-rose-700 placeholder:text-rose-300 bg-rose-50/50 border-2 border-rose-300 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-200/50 transition-all duration-300 font-quicksand hover:border-rose-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNicknameSubmit}
                    disabled={!nickname.trim()}
                    className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-rose-500 hover:via-pink-500 hover:to-rose-600 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl font-quicksand text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group animate-slideInUp"
                  >
                    <span className="relative z-10">Check Answer 💛</span>
                    <span className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover:opacity-100"></span>
                  </button>

                  {nicknameStatus === "correct" && (
                    <div className="text-center p-4 bg-green-100 border-2 border-green-300 rounded-2xl animate-fadeIn shadow-lg">
                      <p className="text-green-700 font-dancing text-2xl font-semibold mb-2">
                        Correct! 💛
                      </p>
                      <p className="text-green-600 font-quicksand">
                        Pikachu is so happy! Preparing something special...
                      </p>
                    </div>
                  )}

                  {nicknameStatus === "incorrect" && (
                    <div className="text-center p-4 bg-rose-100 border-2 border-rose-300 rounded-2xl animate-fadeIn shadow-lg">
                      <p className="text-rose-700 font-dancing text-xl font-semibold">
                        Hmm, that doesn&apos;t sound like Pikachu&apos;s
                        nickname. Try again! 😼
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  <div className="text-center space-y-4">
                    <div className="text-6xl animate-heartbeat inline-block">
                      💌
                    </div>
                    <h2 className="text-3xl font-bold text-rose-600 font-dancing">
                      You&apos;re Doing Great!
                    </h2>
                    <p className="text-rose-500 font-quicksand text-lg leading-relaxed">
                      There&apos;s a special surprise letter waiting for you,{" "}
                      {name}...
                    </p>
                    <p className="text-rose-600 font-dancing text-xl">
                      But first, let&apos;s play a little game! 🎮
                    </p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-3">
                    <p className="text-purple-700 font-quicksand text-center font-semibold">
                      Catch {TARGET_SCORE} falling hearts to unlock your letter!
                      💖
                    </p>
                    <p className="text-purple-600 font-quicksand text-sm text-center">
                      Tap the hearts as they fall!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white font-semibold py-4 px-6 rounded-2xl hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl font-quicksand text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      I&apos;m Ready! Let&apos;s Play 🎯
                    </span>
                    <span className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover:opacity-100"></span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {showGame && !showLetter && (
          <div className="relative z-10">
            {!gameWon ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-rose-600 font-dancing mb-2">
                    Catch the Hearts! 💕
                  </h2>
                  <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-3 inline-block">
                    <p className="text-2xl font-bold text-purple-700 font-quicksand">
                      {score} / {TARGET_SCORE}
                    </p>
                  </div>
                </div>

                <div
                  ref={gameAreaRef}
                  className="relative bg-gradient-to-b from-pink-50 to-rose-50 rounded-2xl border-4 border-rose-300 overflow-hidden"
                  style={{ height: "400px", touchAction: "none" }}
                >
                  {hearts.map((heart) => (
                    <button
                      key={heart.id}
                      onClick={() => catchHeart(heart.id)}
                      className="absolute text-4xl cursor-pointer hover:scale-125 transition-transform active:scale-110"
                      style={{
                        left: `${heart.x}px`,
                        top: `${heart.y}px`,
                        userSelect: "none",
                      }}
                    >
                      {heart.emoji}
                    </button>
                  ))}

                  {hearts.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-rose-400 font-dancing text-xl">
                        Hearts are coming...
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-center text-rose-500 font-quicksand text-sm mt-4">
                  Tap the hearts quickly before they disappear! 🎯
                </p>
              </>
            ) : (
              <div className="text-center space-y-6 animate-fadeIn">
                <div className="text-7xl animate-heartbeat inline-block">
                  🎉
                </div>
                <h2 className="text-4xl font-bold text-rose-600 font-dancing">
                  You Did It!
                </h2>
                <p className="text-rose-500 font-quicksand text-lg">
                  You caught all the hearts, {name}! 💖
                </p>
                <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-6">
                  <p className="text-green-700 font-dancing text-2xl font-semibold">
                    Your surprise letter is ready! 💌
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startLetter}
                  className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl hover:from-rose-500 hover:via-pink-500 hover:to-purple-600 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl font-quicksand text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Read My Letter 💕</span>
                  <span className="absolute inset-0 bg-white/20 animate-shimmer opacity-0 group-hover:opacity-100"></span>
                </button>
              </div>
            )}
          </div>
        )}

        {showLetter && (
          <div className="relative z-10 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-rose-600 font-dancing">
                For You, {name} 💌
              </h2>
              <button
                onClick={toggleMusic}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl transition-colors font-quicksand text-sm font-semibold"
              >
                {isMusicPlaying ? "🎵 Pause" : "🎵 Play"}
              </button>
            </div>

            <div
              ref={letterContainerRef}
              className="bg-gradient-to-b from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200 p-6 md:p-8 space-y-4 max-h-96 overflow-y-auto scroll-smooth"
            >
              <p className="text-rose-800 font-quicksand text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {!isTypingComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {isTypingComplete && (
              <div className="mt-6 text-center animate-fadeIn">
                <p className="text-rose-500 font-dancing text-xl">
                  I love you, {name} 💖
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
