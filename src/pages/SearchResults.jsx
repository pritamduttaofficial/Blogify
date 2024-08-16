import React from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../components/PostCard";
import Container from "../components/container/Container";

function SearchResults() {
  const location = useLocation();
  const { results } = location.state || {};

  if (!results || results?.documents?.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold text-white">No results found</h1>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-col space-y-4">
          {results &&
            results.documents?.map((post) => (
              <div key={post.$id} className="p-2 w-full">
                <PostCard {...post} />
              </div>
            ))}
        </div>
      </Container>
    </div>
  );
}

export default SearchResults;
