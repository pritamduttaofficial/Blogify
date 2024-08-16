import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import databaseService from "../appwrite/configuration";
import Container from "../components/container/Container";
import Button from "../components/Button";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { AiFillDelete, AiFillDislike, AiFillLike } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

export default function Post() {
  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setloading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    setloading(true);
    if (slug) {
      databaseService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);

          // fetch comments
          fetchComments(post.$id);

          // fetch likes count
          databaseService.getLikesCount(post.$id).then((count) => {
            setLikesCount(count);
          });

          // Check if user has liked the post
          if (userData) {
            databaseService
              .userHasLiked({ postId: post.$id, userId: userData.$id })
              .then((hasLiked) => {
                setUserHasLiked(hasLiked);
              });
          }
          setloading(false);
        } else {
          navigate("/");
          setloading(false);
        }
      });
    } else {
      navigate("/");
      setloading(false);
    }
  }, [slug, navigate, userData]);

  const deletePost = () => {
    databaseService.deletePost(post.$id).then((status) => {
      if (status) {
        databaseService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const handleLike = async () => {
    if (userHasLiked) {
      // Unlike the post
      await databaseService.unlikePost({
        postId: post.$id,
        userId: userData.$id,
      });
      setUserHasLiked(false);
      setLikesCount((prevCount) => prevCount - 1);
    } else {
      // Like the post
      await databaseService.likePost({
        postId: post.$id,
        userId: userData.$id,
      });
      setUserHasLiked(true);
      setLikesCount((prevCount) => prevCount + 1);
    }
  };

  const fetchComments = (postId) => {
    databaseService.getComments(postId).then((response) => {
      if (response) {
        setComments(response.documents);
      }
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      databaseService
        .addComment({
          postId: post.$id,
          userId: userData.$id,
          content: newComment,
        })
        .then(() => {
          setNewComment("");
          fetchComments(post.$id); // Refresh comments
        });
    }
  };

  const handleDeleteComment = (commentId) => {
    databaseService.deleteComment(commentId).then(() => {
      fetchComments(post.$id); // Refresh comments after deletion
    });
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

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border border-zinc-600 rounded-xl p-2">
          <img
            src={databaseService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          />

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button
                  bgColor="bg-green-500"
                  className="mr-3 rounded hover:bg-green-600"
                  buttonText="Edit"
                />
              </Link>
              <Button
                bgColor="bg-red-500"
                onClick={deletePost}
                buttonText="Delete"
                className="rounded hover:bg-red-600"
              />
            </div>
          )}
        </div>
        <div className="w-full mb-6 flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">{post.title}</h1>
          <div
            onClick={handleLike}
            className="flex items-center text-white cursor-pointer bg-zinc-800 hover:bg-zinc-900 px-4 py-2 gap-2 rounded-full"
          >
            <button className="active:scale-150 duration-200">
              {userHasLiked ? (
                <AiFillLike className="text-2xl text-pink-600" />
              ) : (
                <AiFillLike className="text-2xl" />
              )}
            </button>
            <span className="font-semibold">
              {likesCount}
              {likesCount > 1 ? " likes" : " like"}
            </span>
          </div>
        </div>
        <div className="text-white">{parse(post.content)}</div>

        {/* comments form to add comment */}
        <div className="w-full mt-8">
          <textarea
            className="w-full p-2 rounded border border-zinc-600 bg-transparent text-white"
            rows="4"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 duration-200"
          >
            Comment
          </button>
        </div>

        {/* comments list */}
        <div className="w-full mt-8">
          {comments.map((comment) => (
            <div
              key={comment.$id}
              className="p-4 border border-zinc-600 rounded mb-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-white">{comment.content}</p>
                {userData && comment.userId === userData.$id && (
                  <button
                    onClick={() => handleDeleteComment(comment.$id)}
                    className="p-2 hover:bg-zinc-800 rounded-full duration-200"
                  >
                    <AiFillDelete className="text-red-600 text-xl" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  ) : null;
}
