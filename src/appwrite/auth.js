import { Client, Account, ID } from "appwrite";
import config from "../config/config.js";

class AuthService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailSession(email, password);
      return session;
    } catch (error) {
      console.log("Appwrite service :: createEmailSession :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: deleteSessions :: error", error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      return await this.account.createRecovery(
        email,
        "https://your-app.com/reset-password"
      );
    } catch (error) {
      throw error;
    }
  }

  async loginWithOAuth(provider) {
    try {
      return await this.account.createOAuth2Session(provider);
    } catch (error) {
      throw error;
    }
  }
}

// Create a singleton instance of AuthService
const authService = new AuthService();
export default authService;
