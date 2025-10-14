import React, { useEffect } from "react";

/**
 * Simple book-open animation component.
 * - Plays a short fullscreen animation (3s) then disappears.
 * - Keep it visually simple so it won't conflict with route loads.
 */
export default function BookOpenAnimation() {
  useEffect(() => {
    // Prevent scrolling while animation is playing
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
    }, 3000);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ pointerEvents: "none" }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Centered book graphic — CSS animated */}
        <div
          style={{ width: 600, maxWidth: "90%", height: 360 }}
          className="relative"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#001a00] to-[#000] rounded-xl shadow-[0_0_80px_rgba(0,255,0,0.2)]"
            style={{ transformOrigin: "left center", animation: "bookOpen 1.2s ease-out forwards" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-l from-[#001a00]/60 to-[#000]/60 rounded-xl"
            style={{ transformOrigin: "right center", animation: "bookOpenRight 1.2s 0.2s ease-out forwards" }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              color: "#bfffcf",
              fontWeight: 800,
              fontSize: 28,
              opacity: 0,
              animation: "titleFade 1s 1.3s forwards",
              textShadow: "0 0 18px rgba(0,255,0,0.2)",
            }}
          >
            ⚡ PCVerse
          </div>
        </div>
      </div>

      {/* Inline keyframes so component is self-contained */}
      <style>{`
        @keyframes bookOpen {
          0% { transform: perspective(800px) rotateY(-90deg) translateZ(0); opacity: 0; }
          60% { transform: perspective(800px) rotateY(-15deg) translateZ(0); opacity: 1; }
          100% { transform: perspective(800px) rotateY(0deg) translateZ(0); opacity: 1; }
        }
        @keyframes bookOpenRight {
          0% { transform: perspective(800px) rotateY(90deg) translateZ(0); opacity: 0; }
          60% { transform: perspective(800px) rotateY(15deg) translateZ(0); opacity: 1; }
          100% { transform: perspective(800px) rotateY(0deg) translateZ(0); opacity: 0.65; }
        }
        @keyframes titleFade {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
