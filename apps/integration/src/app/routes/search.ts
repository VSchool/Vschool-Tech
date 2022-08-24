import { fetchNotionSearch } from "../api/notion";
import { parsePageId } from "../api/utils";

export async function searchRoute(req, res) {
  const ancestorId = parsePageId(req.searchParams.get("ancestorId") || "");
  const query = req.searchParams.get("query") || "";
  const limit = Number(req.searchParams.get("limit") || 20);

  if (!ancestorId) {
    return res.send(
      { error: 'missing required "ancestorId"' },
      { "Content-Type": "application/json" },
      400
    );
  }

  const results = await fetchNotionSearch(
    {
      ancestorId,
      query,
      limit,
    },
    req.notionToken
  );

  return res.send(results);
}
