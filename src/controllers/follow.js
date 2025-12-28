import { followUser, unfollowUser, getFollowersCount, getFollowingCount } 
  from "../models/follow.js";

export const follow = async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.userId);

  if (followerId === followedId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const result = await followUser(followerId, followedId);
  return res.json({ 
    message: result ? "Followed successfully" : "Already following" 
  });
};

export const unfollow = async (req, res) => {
  const followerId = req.user.id;
  const followedId = parseInt(req.params.userId);

  const result = await unfollowUser(followerId, followedId);
  return res.json({ 
    message: result ? "Unfollowed successfully" : "You weren't following" 
  });
};

export const getFollowStats = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const followers = await getFollowersCount(userId);
  const following = await getFollowingCount(userId);

  return res.json({ userId, followers, following });
};
