import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export default function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-1234');
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}
