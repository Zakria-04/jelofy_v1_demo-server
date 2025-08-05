import { Response } from "express";

const serverError = (err: unknown, res: Response) => {
  const errorMessage =
    err instanceof Error ? err.message : "Something went wrong";

    res.status(500).json({ message: errorMessage });
};

export default serverError;