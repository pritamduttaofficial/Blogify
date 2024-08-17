import React, { useCallback, useEffect, useState } from "react";
import databaseService from "../../appwrite/configuration.js";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import RTE from "../RTE";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

// In two situations the user will actually use this form component:-
// 1. The update the existing post:- need to pass the default values from database
// 2. To create a new post:- no default value is required
function PostForm({ post }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // handling form submit
  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      // handle update post first
      if (post) {
        // upload the image if it is present in `data`
        const file = data.image[0]
          ? await databaseService.uploadFile(data.image[0])
          : null;

        // delete the previous image file if the new file is uploaded
        if (file) {
          await databaseService.deleteFile(post.featuredImage);
        }

        // update the post with the `data` and replace the featuredImage `id`
        const updatedPost = await databaseService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });

        // after post updation navigate the user to the updated post page
        if (updatedPost) {
          navigate(`/post/${updatedPost.$id}`);
          setLoading(false);
        }
      } else {
        // handle new post creation
        const file = await databaseService.uploadFile(data.image[0]);

        // after file upload, replace the featuredImage `id` with the new `id`
        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          // create a post with the `data` and also pass the `userId` from `userData`
          const newPost = await databaseService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (newPost) {
            navigate(`/post/${newPost.$id}`);
            setLoading(false);
          } else {
            await databaseService.deleteFile(file.$id);
          }
        }
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash
    } else {
      return "";
    }
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-wrap text-white"
    >
      <div className="w-2/3 px-2">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4 bg-zinc-800 border-zinc-500 text-white focus:text-black"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4 bg-zinc-800 border-zinc-500 text-white focus:text-black"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4 bg-zinc-800 text-white focus:text-black file:bg-zinc-600 file:text-white file:border-none border-zinc-500 file:rounded-sm"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={databaseService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4 bg-zinc-800 text-white focus:text-black border-zinc-500"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full rounded"
          buttonText={loading ? "Submitting..." : post ? "Update" : "Post"}
          disabled={loading}
        />
        {loading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color="#FF1493" loading={loading} size={100} />
          </div>
        )}
      </div>
    </form>
  );
}

export default PostForm;
