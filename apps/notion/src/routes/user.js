import { fetchNotionUsers } from "../api/notion";
import { createResponse } from "../response";

export async function userRoute(req) {
  const users = await fetchNotionUsers([req.params.userId], req.notionToken);

  return createResponse(users[0]);
}
