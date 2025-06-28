import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

// Fetch posts for a specific community
const fetchCommunityPost = async (communityId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Component to display posts of a community
export const CommunityDisplay = ({ communityId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;

  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-5xl font-extrabold mb-10 text-purple-400 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
        {data && data[0]?.communities?.name} Community Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
