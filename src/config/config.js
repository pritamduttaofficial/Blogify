const config = {
  appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteUsersApiKey: String(import.meta.env.VITE_APPWRITE_USERS_API_KEY),
  appwritePostsCollectionId: String(
    import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID
  ),
  appwriteCommentsCollectionId: String(
    import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID
  ),
  appwriteLikesCollectionId: String(
    import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID
  ),
  appwriteUserProfileCollectionId: String(
    import.meta.env.VITE_APPWRITE_USER_PROFILE_COLLECTION_ID
  ),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default config;
