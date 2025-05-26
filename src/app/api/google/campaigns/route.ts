import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const token = await getToken({ req }) as { accessToken?: string };

  if (!token?.accessToken) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;

  try {
    const response = await fetch(
      `https://googleads.googleapis.com/v13/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            SELECT
              campaign.id,
              campaign.name,
              campaign.status,
              campaign.start_date,
              campaign.end_date
            FROM campaign
            LIMIT 10
          `,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Error desde Google Ads', details: errorData }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({ campaigns: data.results || [] });
  } catch (err) {
    console.error('❌ Error al llamar a la API de Google Ads:', err);
    return NextResponse.json({ error: 'Error interno al obtener campañas' }, { status: 500 });
  }
}
