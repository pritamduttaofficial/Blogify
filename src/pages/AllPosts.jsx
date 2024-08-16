import React, { useEffect, useState } from "react";
import databaseService from "../appwrite/configuration";
import Container from "../components/container/Container";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const userData = useSelector((state) => state.auth?.userData);
  const navigate = useNavigate();

  useEffect(() => {
    setloading(true);
    databaseService.getUserPosts(userData.$id).then((response) => {
      if (response) {
        console.log(response);
        setPosts(response.documents);
        setloading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 mt-20 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <div className="flex justify-center mt-4">
                <ClipLoader color="#FF1493" loading={loading} size={100} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-20 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold text-white hover:text-gray-600">
                Oops, you have not created any post.
              </h1>
              <button
                onClick={() => navigate("/add-post")}
                className="mt-4 px-4 py-2 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 duration-200"
              >
                Create New Post
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-col space-y-4">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-full">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
