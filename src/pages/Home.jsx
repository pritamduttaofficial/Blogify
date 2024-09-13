import React, { useEffect, useState } from "react";
import databaseService from "../appwrite/configuration";
import Container from "../components/container/Container";
import PostCard from "../components/PostCard";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const isLoggedIn = useSelector((state) => state.auth?.userData);

  useEffect(() => {
    setloading(true);
    const offset = (currentPage - 1) * postsPerPage;

    // Fetch the posts with pagination
    databaseService
      .getPosts([], postsPerPage, offset)
      .then((response) => {
        if (response) {
          console.log(response);
          setPosts(response.documents);
          setTotalPosts(response.total);
          setloading(false);
        }
      })
      .catch((error) => {
        console.log("Error: ", error.message);
        setloading(false);
      });
  }, [currentPage]); // Fetch posts again when currentPage changes

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
              <h1 className="text-2xl font-bold text-white hover:text-opacity-70">
                {isLoggedIn
                  ? "No posts available at the moment."
                  : "You need to be logged in to view posts."}
              </h1>
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
          {posts.map(
            (post) =>
              post.status === "active" && (
                <div key={post.$id} className="p-2 w-full">
                  <PostCard {...post} />
                </div>
              )
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded bg-pink-700 text-white ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded bg-pink-700 text-white ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-pink-600"
            }`}
          >
            Next
          </button>
        </div>
      </Container>
    </div>
  );
}

export default Home;
