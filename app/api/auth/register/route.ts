import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password, magicLink } = await req.json();

    console.log(name, email, password, magicLink);

    const createdUser = await db.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        magicLink: magicLink,
      },
    });

    return new Response(JSON.stringify(createdUser));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
