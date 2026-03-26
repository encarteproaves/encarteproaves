export async function GET() {
  return Response.json([
    {
      id: 1,
      nome: "Produto teste",
      preco: 100
    }
  ]);
}