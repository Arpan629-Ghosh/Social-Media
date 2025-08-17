/*useQuery – From React Query, it’s used to fetch data and manage loading/error states.

supabase – Your backend service to connect with database or stored functions.

PostItem – A component that renders a single post (card-like UI). */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

/*supabase.rpc() is calling a Stored Procedure (or function) named get_posts_with_counts from your Supabase database.

This stored function probably:

Fetches all posts

Includes extra info like comment counts, likes, or community name

If something goes wrong, it throws an error.

If successful, returns the post data. */
const fetchPosts = async () => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data;
};

export const PostList = () => {
  /*queryKey: ["posts"] – React Query uses this as a unique identifier (like a cache key).

queryFn: fetchPosts – React Query will call your fetchPosts() function.

isLoading, error, and data are automatically managed:

isLoading: true while data is being fetched

error: holds error info if fetch fails

data: contains posts once loaded */
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading posts...</div>; //While waiting for data, show this loading message.

  if (error) {
    return <div>Error: {error.message}</div>; //If something goes wrong, show the error message to the user.
  }

  console.log(data);

  return (
    /*Loops through the array of posts (using map)

For each post:

Creates a PostItem component

Passes the post as a prop

key={key} helps React track each post element*/
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};
