"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import GradientButton from "../GradientButton";
import { ArrowRight, Flame, WandSparkles } from "lucide-react";

const confettiColors = ["#FF3CAC", "#F687B3", "#D8B4FE", "#C084FC", "#F472B6"];

export default function CakeScreen({ onNext, onDecorate }) {
  const [decorated, setDecorated] = useState(false);
  const [lit, setLit] = useState(false);

  const decorate = () => {
    if (decorated) return;
    setDecorated(true);
    setTimeout(() => {
      onDecorate();
    }, 500);
  };

  const lightCandle = () => {
    if (lit) return;
    setLit(true);
    setTimeout(() => burst(), 500);
    setTimeout(() => burst(), 1000);
  };

  const burst = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: confettiColors,
    });
  };

  return (
    <div className="px-4 md:px-6 py-10 text-center relative">
      {lit && (
        <motion.div
          className="fixed top-50 lg:top-60 left-0 w-full text-center text-[40px] md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 drop-shadow leading-tight px-4"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,105,180,0.4))" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        >
          Happy Birthday, Inaya!
        </motion.div>
      )}

      <div className="relative flex flex-col items-center gap-8 mt-52">
        <div className="relative mb-6">
          <Cake lit={lit} />
        </div>
        <AnimatePresence mode="wait">
          {!lit ? (
            <motion.div
              key="light"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, delay: 0.5 },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GradientButton onClick={lightCandle}>
                <Flame size={20} />
                Light the Candle
              </GradientButton>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, delay: 2 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GradientButton onClick={onNext}>
                Next
                <ArrowRight size={20} className="mt-0.5" />
              </GradientButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Cake({ lit }) {
  return (
    <div className="flex flex-col items-center">
      <div className="cake">
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          {lit && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.2, y: 10 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="flame"
            ></motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
