import { db } from "@/db/db";
import { ships } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await db.query.ships.findMany({
            where: (ships, { eq }) => eq(ships.manufacturer_id, 1),
        })

        return NextResponse.json(res, {status: 200});
        
    } catch (error) {
      return new NextResponse("innternal Error", {status: 500});
    }
}