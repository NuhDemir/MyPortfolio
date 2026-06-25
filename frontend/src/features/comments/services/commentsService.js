import { axiosClient } from "@core";
import commentsData from "../data/comments.json";

const mapComment = (c) => ({
  id: c._id || c.id,
  text: c.content || c.text,
  username: c.author?.name || c.username,
  jobTitle: c.author?.jobTitle || c.jobTitle,
});

export const fetchPublicComments = async (signal) => {
  try {
    const { data } = await axiosClient.get("/comments/public", { signal });
    if (data?.data?.length > 0) return data.data.map(mapComment);
    return commentsData;
  } catch {
    return commentsData;
  }
};
