import { Request, Response, Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Comment, Post } from "../models/post";
import { authenticate } from "../middlewares/authenticate";

// const getComments = async (req: Request, res: Response, postId: string) => {
//   try {
//     const { id } = req.params;

//     if (!isValidObjectId(id)) {
//       res.status(400).json({ message: "invalid post id" });
//       return;
//     }

//     const comments = await
//   } catch (error) {
//     console.log(error);
//     res.status(500).send()
//   }
// }

const createComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "invalid post id" });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(400).json({ message: "no post found" });
      return;
    }

    const { content } = req.body;

    if (content !== undefined && typeof content !== "string") {
      res.status(400).json({ message: "malformed content" });
      return;
    }

    post.comments.push({
      content,
      author: req.userId,
    });

    // const comment = await Post.create({
    //   content,
    //   author: req.userId,
    // })
    await post.save();
    res.status(201).json({ message: "comment created" });

    // const comments = await
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const commentsRouter = Router();

commentsRouter.post("/posts/:id/comment", authenticate, createComment);
