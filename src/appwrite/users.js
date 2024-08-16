import { Client, Users } from "node-appwrite";
import config from "../config/config.js";

class UserService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectId)
      .setKey(config.appwriteUsersApiKey);
    this.users = new Users(this.client);
  }

  async getUserById(userId) {
    try {
      const user = await this.users.get(userId);
      return user;
    } catch (error) {
      console.error("Failed to get user by ID:", error);
      throw error;
    }
  }

  async updateUserName(userId, name) {
    try {
      const user = await this.users.updateName(userId, name);
      return user;
    } catch (error) {
      console.error("Error updating user name:", error);
      throw error;
    }
  }

  async updateUserEmail(userId, email) {
    try {
      const user = await this.users.updateEmail(userId, email);
      return user;
    } catch (error) {
      console.error("Error updating user email:", error);
      throw error;
    }
  }

  async updateUserPassword(userId, password) {
    try {
      const user = await this.users.updatePassword(userId, password);
      return user;
    } catch (error) {
      console.error("Error updating user email:", error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
