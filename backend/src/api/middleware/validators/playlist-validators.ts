import { validator } from "hono/validator";
import { z } from "zod";

const newPlaylistSchema = z.object({
  userId: z.string().cuid2(),
  name: z.string().min(2).max(20),
});

const playlistUpdateSchema = z.object({
  name: z.string().min(2).max(20).optional(),
  add: z.string().cuid2().optional(),
  remove: z.string().cuid2().optional(),
});

export const newPlaylistValidator = () =>
  validator("json", (value, c) => {
    const result = newPlaylistSchema.safeParse(value);
    if (!result.success) return c.json("Invalid body", 400);

    return result.data;
  });

export const playlistUpdateValidator = () =>
  validator("json", (value, c) => {
    const result = playlistUpdateSchema.safeParse(value);
    if (!result.success) return c.json("Invalid body", 400);

    return result.data;
  });
