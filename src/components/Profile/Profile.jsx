import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Input from "../Input";
import Button from "../Button";
import Container from "../container/Container";
import { updateUserData } from "../../features/authSlice";
import userService from "../../appwrite/users";

function Profile() {
  const userData = useSelector((state) => state.auth?.userData);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: userData.name || "",
      email: userData.email || "",
    },
  });

  const dispatch = useDispatch();

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const { name, email, password } = data;

      // Update name
      if (name && name !== userData.name) {
        const updatedUser = await userService.updateUserName(
          userData.$id,
          name
        );
        dispatch(updateUserData(updatedUser));
      }

      // Update email
      if (email && email !== userData.email) {
        const updatedUser = await userService.updateUserEmail(
          userData.$id,
          email
        );
        dispatch(updateUserData(updatedUser));
      }

      // Update password
      if (password) {
        const updatedUser = await userService.updateUserPassword(
          userData.$id,
          password
        );
        dispatch(updateUserData(updatedUser));
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="text-white py-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Profile</h2>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-l from-transparent to-gray-800 bg-opacity-50 py-2 px-4">
              <strong>Name:</strong> {userData.name}
            </div>
            <div className="bg-gradient-to-l from-transparent to-gray-800 bg-opacity-50 py-2 px-4">
              <strong>Email:</strong> {userData.email}
            </div>
            <Button
              className="rounded font-medium bg-pink-600 hover:bg-pink-700"
              buttonText="Edit Profile"
              onClick={() => setIsEditing(true)}
            />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleProfileUpdate)}
            className="w-full max-w-lg"
          >
            <Input
              label="Name:"
              placeholder="Enter your name"
              className="mb-4 bg-zinc-800 border-zinc-500 text-white focus:text-black"
              {...register("name")}
            />
            <Input
              label="Email:"
              placeholder="Enter your email"
              className="mb-4 bg-zinc-800 border-zinc-500 text-white focus:text-black"
              {...register("email")}
            />
            <Input
              label="Password:"
              type="password"
              placeholder="Enter your new password"
              className="mb-4 bg-zinc-800 border-zinc-500 text-white focus:text-black"
              {...register("password")}
            />
            <Button
              type="submit"
              className="w-full rounded bg-pink-700 hover:bg-pink-800"
              buttonText={loading ? "Updating..." : "Update Profile"}
              disabled={loading}
            />
            <Button
              className="w-full rounded bg-gray-800 bg-opacity-50 hover:bg-gray-900 mt-4"
              buttonText="Cancel"
              onClick={() => setIsEditing(false)}
            />
          </form>
        )}
      </div>
    </Container>
  );
}

export default Profile;
