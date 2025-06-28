import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

const fetchPostById = async (postId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const PostDetail = ({ postId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div>Loading post...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!data) return <div>No post found</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-5xl font-extrabold text-purple-400 text-center drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
        {data.title}
      </h2>
      {data.image_url && (
        <img
          src={data.image_url}
          alt={data.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data.created_at).toLocaleDateString()}
      </p>

      {<LikeButton postId={postId} />}
      {<CommentSection postId={postId} />}
    </div>
  );
};
