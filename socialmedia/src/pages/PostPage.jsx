import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white px-4 sm:px-8 lg:px-20 py-10">
      <div className="max-w-5xl mx-auto">
        <PostDetail postId={Number(id)} />
      </div>
    </div>
  );
};
