import{db}from"@/lib/db";export async function GET(){return Response.json(await db.product.findMany({where:{active:true},orderBy:{createdAt:"desc"}}))}
