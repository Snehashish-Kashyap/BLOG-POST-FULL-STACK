import React, { useEffect, useState, useRef } from "react";

export default function ManagePCs() {
  const [pcs, setPcs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    full_description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  // ✅ Fetch user's own blogs
  useEffect(() => {
    const fetchMyPCs = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/pcs/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setMessage("⚠️ Please log in again. Token expired or invalid.");
          setPcs([]);
          return;
        }

        const data = await res.json();
        setPcs(data);
      } catch (error) {
        console.error("Error fetching user PCs:", error);
        setMessage("❌ Failed to load your blogs.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyPCs();
  }, [token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle drag/drop file
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  // ✅ Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // ✅ Preview selected image
  const handleFile = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ✅ Create or Update Blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5050/api/pcs/${editingId}`
        : "http://localhost:5050/api/pcs";

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("full_description", form.full_description);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage(data.message);
      setForm({ name: "", description: "", full_description: "" });
      setImageFile(null);
      setImagePreview("");
      setEditingId(null);

      // Refresh list
      const refresh = await fetch("http://localhost:5050/api/pcs/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await refresh.json();
      setPcs(updated);
    } catch (error) {
      console.error("Error saving blog:", error);
      setMessage("❌ Failed to save your blog.");
    }
  };

  // ✅ Edit Blog
  const handleEdit = (pc) => {
    setForm({
      name: pc.name,
      description: pc.description,
      full_description: pc.full_description,
    });
    setImagePreview(pc.image_url ? `http://localhost:5050${pc.image_url}` : "");
    setEditingId(pc.id);
    setMessage("✏️ Editing your blog...");
  };

  // ✅ Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`http://localhost:5050/api/pcs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message);
      setPcs(pcs.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      setMessage("❌ Failed to delete blog.");
    }
  };

  // ✅ UI Rendering
  if (!token)
    return (
      <div className="text-center text-red-400 mt-10 text-xl font-semibold">
        ⚠️ You must be logged in to manage your blogs.
      </div>
    );

  if (loading)
    return (
      <div className="text-center text-green-400 mt-10 text-lg">
        ⏳ Loading your blogs...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-[#001a00]/60 p-8 rounded-2xl border border-green-800 shadow-[0_0_30px_rgba(0,255,0,0.2)]">
      <h1 className="text-3xl font-extrabold text-green-300 mb-6 drop-shadow-[0_0_15px_rgba(0,255,0,0.8)] text-center">
        ⚙️ Manage Your Blogs
      </h1>

      {message && (
        <div className="mb-6 text-center text-yellow-300 bg-[#002200]/60 rounded-lg py-2 border border-green-600">
          {message}
        </div>
      )}

      {/* ✅ Blog Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Blog Title"
          value={form.name}
          onChange={handleChange}
          className="p-3 rounded-md bg-black/60 text-green-300 border border-green-700 focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Short Description"
          value={form.description}
          onChange={handleChange}
          className="p-3 rounded-md bg-black/60 text-green-300 border border-green-700 focus:ring-2 focus:ring-green-500"
          required
        />

        {/* ✅ Drag & Drop Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current.click()}
          className={`col-span-1 sm:col-span-2 h-40 flex flex-col items-center justify-center rounded-md border-2 border-dashed cursor-pointer transition-all
          ${dragOver ? "border-green-400 bg-green-900/20" : "border-green-700 bg-black/40"} 
          text-green-300`}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto rounded-md border border-green-700 shadow-[0_0_10px_rgba(0,255,0,0.3)]"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <>
              <p className="text-center mb-2">🖼️ Drag & Drop or Click to Upload Image</p>
              <p className="text-sm text-green-400">Supports JPG, PNG</p>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <textarea
          name="full_description"
          placeholder="Full Description"
          value={form.full_description}
          onChange={handleChange}
          className="p-3 col-span-1 sm:col-span-2 rounded-md bg-black/60 text-green-300 border border-green-700 focus:ring-2 focus:ring-green-500"
          rows="3"
        ></textarea>

        <button
          type="submit"
          className="col-span-1 sm:col-span-2 py-3 mt-3 text-lg font-bold text-black bg-gradient-to-br from-green-600 to-green-400 rounded-lg hover:scale-105 transition-transform"
        >
          {editingId ? "💾 Update Blog" : "➕ Create Blog"}
        </button>
      </form>

      {/* ✅ User’s Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pcs.length === 0 ? (
          <p className="text-center col-span-full text-green-400 text-lg">
            You haven’t created any blogs yet. Start by adding one!
          </p>
        ) : (
          pcs.map((pc) => (
            <div
              key={pc.id}
              className="p-4 rounded-lg border border-green-700 bg-black/60 shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_35px_rgba(0,255,0,0.6)] transition-all"
            >
              {pc.image_url && (
                <img
                  src={`http://localhost:5050${pc.image_url}`}
                  alt={pc.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-xl font-bold text-green-300 mb-1">{pc.name}</h3>
              <p className="text-sm text-green-200 mb-2">{pc.description}</p>

              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(pc)}
                  className="px-3 py-1 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(pc.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 font-semibold"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
