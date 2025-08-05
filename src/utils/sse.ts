import { Request, Response } from "express";
import USER_MODEL from "../API/Models/user.model";

type SSEClients = {
  [restaurantId: string]: Response[];
};

const clients: SSEClients = {};

type AdminSSEClients = {
  [restaurantId: string]: Response[];
};

const adminClients: AdminSSEClients = {};

export function sseHandler(req: Request, res: Response) {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    res.sendStatus(400);
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add client to restaurant's list
  if (!clients[restaurantId]) clients[restaurantId] = [];
  clients[restaurantId].push(res);

  //   console.log("New client connected to restaurant:", clients);

  // Send initial count
  sendViewerCount(restaurantId);

  req.on("close", () => {
    clients[restaurantId] = clients[restaurantId].filter((c) => c !== res);
    sendViewerCount(restaurantId);
  });
}

export function sendViewerCount(restaurantId: string) {
  const count = clients[restaurantId]?.length || 0;
  const data = `data: ${JSON.stringify({ count })}\n\n`;

  clients[restaurantId]?.forEach((res) => res.write(data));
  sendViewerCountToAdmin(restaurantId); // Notify the admin too
}

export const sseHandlerOwner = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  //   const userId = req.user?.userId;

  //   if (!restaurantId || !userId) {
  //     res.sendStatus(400);
  //     return;
  //   }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add to admin connections
  if (!adminClients[restaurantId]) adminClients[restaurantId] = [];
  adminClients[restaurantId].push(res);

  // Send initial count
  sendViewerCountToAdmin(restaurantId);

  req.on("close", () => {
    adminClients[restaurantId] = adminClients[restaurantId].filter(
      (c) => c !== res
    );
  });
};

export function sendViewerCountToAdmin(restaurantId: string) {
  const count = clients[restaurantId]?.length || 0;
  const data = `data: ${JSON.stringify({ count })}\n\n`;

  adminClients[restaurantId]?.forEach((res) => res.write(data));
}
