import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import databaseService from "../appwrite/configuration";
import getTimeAgo from "../utils/getTimeAgo";
import parse from "html-react-parser";
import userService from "../appwrite/users";

function PostCard({ $id, title, featuredImage, $createdAt, content, userId }) {
  const [blogAuthor, setBlogAuthor] = useState();
  console.log(blogAuthor);

  useEffect(() => {
    userService.getUserById(userId).then((user) => {
      setBlogAuthor(user);
    });
  }, [userId]);
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full flex border border-zinc-600 bg-zinc-900 bg-opacity-60 shadow-lg rounded-lg p-4 hover:bg-opacity-80 transition duration-300 ease-in-out">
        <div className="w-1/3">
          <img
            src={databaseService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-lg w-full h-40 object-cover"
          />
        </div>
        <div className="w-2/3 pl-4 flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400 text-sm">{parse(content)}</p>
            </div>
            <p className="text-gray-400 text-xs hover:text-white">
              read more...
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-white">{blogAuthor?.name}</p>
            <p className="text-gray-400 text-xs self-end">
              {getTimeAgo($createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
