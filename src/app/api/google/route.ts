import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const ads = google.ads('v13');

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;
    const result = await ads.customers.campaigns.list({
      auth,
      customerId,
    });

    const campaigns = result.data.campaigns?.map((camp) => ({
      id: camp.id,
      name: camp.name,
      status: camp.status,
    })) || [];

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error('Error al obtener campañas:', err);
    return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 });
  }
}
