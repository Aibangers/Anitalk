import { NextRequest, NextResponse } from 'next/server';

const ANILIST_API = 'https://graphql.anilist.co';

const SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH, isAdult: false) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      episodes
      status
      format
      averageScore
    }
  }
}
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { search: query, page: 1, perPage: 8 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const json = await res.json();
    const results = json.data?.Page?.media || [];

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
