import { fetchNotionUsers } from "../api/notion";

export async function userRoute(req, res) {
  const users = await fetchNotionUsers([req.params.userId], req.notionToken);

  return res.send(users[0]);
}
