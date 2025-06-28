import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "./CommunityList";

// Upload & insert post into Supabase
const createPost = async (post, imageFile) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error("🛑 Upload Error:", uploadError); // log full object
    alert(`Upload failed: ${uploadError.message}`); // show error to user
    throw new Error(uploadError.message);
  }

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const payload = {
    ...post,
    image_url: publicURLData.publicUrl,
  };

  console.log("📦 Payload being inserted:", payload);

  const { data, error } = await supabase.from("posts").insert(payload);

  if (error) {
    console.error("❌ Supabase Insert Error:", error); // full error log
    throw new Error(error.message);
  }

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState(""); // keep as string
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useAuth();

  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ post, imageFile }) => createPost(post, imageFile),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    // 🛠️ Convert to number safely only if selected
    const parsedCommunityId = communityId ? Number(communityId) : null;

    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: parsedCommunityId, // ✅ safe insert
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e) => {
    setCommunityId(e.target.value); // still a string, parsed later
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>

      <div>
        <label>Select Community 👉</label>
        <select
          id="community"
          value={communityId}
          onChange={handleCommunityChange}
          className="bg-purple-500 rounded-2xl text-white"
        >
          <option value="" className="bg-amber-700">
            -- Choose a Community --
          </option>
          {communities?.map((community) => (
            <option
              key={community.id}
              value={community.id}
              className="bg-neutral-900"
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-500">
          ⚠️ Error creating post. Check console for details.
        </p>
      )}
    </form>
  );
};
