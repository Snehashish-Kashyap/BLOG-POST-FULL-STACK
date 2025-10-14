import React, { useEffect, useState } from "react";

export default function PCGrid() {
  const [pcs, setPcs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPCs = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/pcs");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load blogs");
        setPcs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("❌ Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchPCs();
  }, []);

  if (loading)
    return (
      <div className="text-center text-green-400 mt-10 text-lg">
        ⏳ Loading blogs...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 mt-10 text-lg">{error}</div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {pcs.map((pc) => (
        <div
          key={pc.id}
          className="p-5 rounded-xl bg-black/60 border border-green-700 
                     shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)] 
                     transition-transform hover:scale-[1.03] flex flex-col justify-between"
        >
          {/* ✅ Fixed image logic */}
          {pc.image_url && (
            <img
              src={
                pc.image_url.startsWith("http")
                  ? pc.image_url
                  : `http://localhost:5050${pc.image_url}`
              }
              alt={pc.name}
              className="w-full h-48 object-cover rounded-md mb-4 border border-green-800"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
          )}

          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-green-300 mb-2 truncate">
              {pc.name}
            </h2>
            <p
              className="text-green-200 mb-3 text-sm leading-relaxed overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {pc.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-green-800">
            <span className="text-sm text-green-400 truncate">
              👤 {pc.owner_name}
            </span>

            {/* 🟢 Open View Details in a new tab */}
            <a
              href={`http://localhost:5173/pc/${pc.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-black font-semibold rounded-md 
                        hover:bg-green-400 transition-all whitespace-nowrap"
            >
              🔍 View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
