import fetch from 'node-fetch'

const NOTION_API = "https://www.notion.so/api/v3";

const loadPageChunkBody = {
  limit: 100,
  cursor: { stack: [] },
  chunkNumber: 0,
  verticalColumns: false,
};

const fetchNotionData = async ({
  resource,
  body,
  notionToken,
}) => {
    notionToken = typeof NOTION_TOKEN !== "undefined" ? NOTION_TOKEN : undefined;
    const res = await fetch(`${NOTION_API}/${resource}`, {
        method: "POST",
        headers: {
        "content-type": "application/json",
        ...(notionToken && { cookie: `token_v2=${notionToken}` }),
        },
        body: JSON.stringify(body),
    });

    return res.json();
};

export const fetchPageById = async (pageId, notionToken) => {
  const res = await fetchNotionData({
    resource: "loadPageChunk",
    body: {
      pageId,
      ...loadPageChunkBody,
    },
    notionToken,
  });

  return res;
};

const queryCollectionBody = {
  loader: {
    type: "reducer",
    reducers: {
      collection_group_results: {
        type: "results",
        limit: 999,
        loadContentCover: true,
      },
      "table:uncategorized:title:count": {
        type: "aggregation",
        aggregation: {
          property: "title",
          aggregator: "count",
        },
      },
    },
    searchQuery: "",
    userTimeZone: "Europe/Vienna",
  },
};

export const fetchTableData = async (
  collectionId,
  collectionViewId,
  notionToken
) => {
  const table = await fetchNotionData({
    resource: "queryCollection",
    body: {
      collection: {
        id: collectionId,
      },
      collectionView: {
        id: collectionViewId,
      },
      ...queryCollectionBody,
    },
    notionToken,
  });

  return table;
};

export const fetchNotionUsers = async (
  userIds,
  notionToken
) => {
  const users = await fetchNotionData({
    resource: "getRecordValues",
    body: {
      requests: userIds.map((id) => ({ id, table: "notion_user" })),
    },
    notionToken,
  });
  if (users && users.results) {
    return users.results.map((u) => {
      const user = {
        id: u.value.id,
        firstName: u.value.given_name,
        lastLame: u.value.family_name,
        fullName: u.value.given_name + " " + u.value.family_name,
        profilePhoto: u.value.profile_photo,
      };
      return user;
    });
  }
  return [];
};

export const fetchBlocks = async (
  blockList,
  notionToken
) => {
  return await fetchNotionData({
    resource: "syncRecordValues",
    body: {
      requests: blockList.map((id) => ({
        id,
        table: "block",
        version: -1,
      })),
    },
    notionToken,
  });
};

export const fetchNotionSearch = async (
  params,
  notionToken
) => {
  // TODO: support other types of searches
  return fetchNotionData({
    resource: "search",
    body: {
      type: "BlocksInAncestor",
      source: "quick_find_public",
      ancestorId: params.ancestorId,
      filters: {
        isDeletedOnly: false,
        excludeTemplates: true,
        isNavigableOnly: true,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {},
        ...params.filters,
      },
      sort: "Relevance",
      limit: params.limit || 20,
      query: params.query,
    },
    notionToken,
  });
};
