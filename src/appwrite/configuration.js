import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class DatabaseService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        slug
      );
      return true;
    } catch (error) {
      throw error;
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        slug
      );
    } catch (error) {
      throw error;
      return false;
    }
  }

  async getUserPosts(userId) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        [Query.equal("userId", userId)]
      );
    } catch (error) {
      throw error;
    }
  }

  async getPosts(
    queries = [Query.equal("status", "active")],
    limit = 6,
    offset = 0
  ) {
    try {
      const finalQueries = [
        ...queries,
        Query.limit(limit),
        Query.offset(offset),
      ];

      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        finalQueries
      );
    } catch (error) {
      throw error;
    }
  }

  async searchPosts(query) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        [Query.search("title", query)]
      );
    } catch (error) {
      throw error;
    }
  }

  // file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      throw error;
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }

  // methods regarding comments
  async addComment({ postId, userId, content }) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        ID.unique(),
        {
          postId,
          userId,
          content,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getComments(postId) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        [Query.equal("postId", postId)]
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        commentId
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // methods regarding likes
  async likePost({ postId, userId }) {
    try {
      // Check if the user has already liked the post
      const existingLike = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );

      if (existingLike.documents.length === 0) {
        // User hasn't liked the post yet, so create a new like
        return await this.databases.createDocument(
          config.appwriteDatabaseId,
          config.appwriteLikesCollectionId,
          ID.unique(),
          { postId, userId }
        );
      } else {
        throw new Error("User has already liked this post.");
      }
    } catch (error) {
      throw error;
    }
  }

  async unlikePost({ postId, userId }) {
    try {
      // Find the like document to delete
      const likeDocument = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );

      if (likeDocument.documents.length > 0) {
        const likeId = likeDocument.documents[0].$id;
        await this.databases.deleteDocument(
          config.appwriteDatabaseId,
          config.appwriteLikesCollectionId,
          likeId
        );
        return true;
      } else {
        throw new Error("Like not found.");
      }
    } catch (error) {
      throw error;
    }
  }

  async getLikesCount(postId) {
    try {
      const likes = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId)]
      );
      return likes.total;
    } catch (error) {
      throw error;
    }
  }

  async userHasLiked({ postId, userId }) {
    try {
      const likes = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );
      return likes.documents.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // methods to add profilePicture and update user
  async uploadProfilePicture(file) {
    try {
      const response = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(), // Generates a unique ID for the file
        file
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfilePicture(userId, fileId) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProfileCollectionId,
        userId,
        {
          userId,
          profilePicture: fileId,
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
