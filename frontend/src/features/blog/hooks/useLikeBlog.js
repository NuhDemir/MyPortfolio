import { useState, useCallback, useEffect } from "react";
import { likeBlog as apiLikeBlog } from "../services/blogService";

const LIKED_BLOGS_KEY = "myportfolio_liked_blogs";

export const useLikeBlog = (blogId, initialLikes = 0) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    if (!blogId) return;
    try {
      const likedBlogs = JSON.parse(localStorage.getItem(LIKED_BLOGS_KEY) || "[]");
      if (likedBlogs.includes(blogId)) {
        setIsLiked(true);
      }
    } catch (e) {
      console.error("Error reading liked blogs from local storage", e);
    }
  }, [blogId]);

  // Sync initialLikes if they change (e.g. data re-fetched)
  useEffect(() => {
    // Sadece eğer initialLikes şu anki likes'dan büyükse güncelle (optimistic update'i ezmemek için)
    if (initialLikes > likes) {
      setLikes(initialLikes);
    }
  }, [initialLikes]);

  const handleLike = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!blogId || isLiked || isLiking) return;

    // Optimistic UI Update
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    setIsLiking(true);

    try {
      // Save to local storage immediately
      const likedBlogs = JSON.parse(localStorage.getItem(LIKED_BLOGS_KEY) || "[]");
      if (!likedBlogs.includes(blogId)) {
        likedBlogs.push(blogId);
        localStorage.setItem(LIKED_BLOGS_KEY, JSON.stringify(likedBlogs));
      }

      // API Call
      const result = await apiLikeBlog(blogId);
      if (result && result.likes) {
        setLikes(result.likes); // Update with actual DB count
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(false);
      setLikes((prev) => prev - 1);
      
      const likedBlogs = JSON.parse(localStorage.getItem(LIKED_BLOGS_KEY) || "[]");
      const updatedBlogs = likedBlogs.filter((id) => id !== blogId);
      localStorage.setItem(LIKED_BLOGS_KEY, JSON.stringify(updatedBlogs));
      
      console.error("Failed to like blog:", error);
    } finally {
      setIsLiking(false);
    }
  }, [blogId, isLiked, isLiking]);

  return {
    likes,
    isLiked,
    isLiking,
    handleLike,
  };
};

export default useLikeBlog;
