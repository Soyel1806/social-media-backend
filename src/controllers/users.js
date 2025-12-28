import { findUsersByName, getUserById, getUserProfile, updateUserProfile } from "../models/user.js";
import { followUser, unfollowUser, getFollowersCount, getFollowingCount } from "../models/follow.js";


export const searchUsers = async (req, res) => {
  try {
    const { name = "", limit = 10, offset = 0 } = req.query;

    if (!name.trim()) {
      return res.status(400).json({ message: "name query is required" });
    }

    const users = await findUsersByName(name, limit, offset);

    return res.json({ users });

  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const follow = async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.userId);

  if (followerId === followedId)
    return res.status(400).json({ message: "You cannot follow yourself" });

  const result = await followUser(followerId, followedId);
  return res.json({ message: result ? "Followed successfully" : "Already following" });
};

export const unfollow = async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.userId);

  const result = await unfollowUser(followerId, followedId);
  return res.json({ message: result ? "Unfollowed successfully" : "You weren't following" });
};

export const profile = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = await getUserProfile(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  const followers = await getFollowersCount(userId);
  const following = await getFollowingCount(userId);

  return res.json({ ...user, followers, following });
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const updated = await updateUserProfile(userId, req.body);
  return res.json({ message: "Profile updated", user: updated });
};
