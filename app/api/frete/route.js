export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWUyZWVlNzBiMDQ2YzA2YjRkZDc4ODg1YjM1NmNiMDQ3YjcxNWE5OWJkMjhmMjExZThlMjZlOTJjYmNhNmFhZDQ5NzIxNTdiNzcwODE4MjciLCJpYXQiOjE3NzE1NTc4NDMuOTQ3MjA0LCJuYmYiOjE3NzE1NTc4NDMuOTQ3MjA1LCJleHAiOjE4MDMwOTM4NDMuOTM1NDksInN1YiI6IjZiNTVkMGE2LTA1ODQtNDk1YS05ZmQ5LWVlZDllMjAyYThjMSIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIiwid2ViaG9va3MtZGVsZXRlIiwidGRlYWxlci13ZWJob29rIl19.FJYyJaq6xm3kCubvIgMEZN4MjIUBocC6tOkE4_7e3jt-4MwlKU3FmYj9i9gs_UmRYFdd06xtWUNzsL1On3tyZbnwxmAg4BAXe-QxiJrbrEQPDJCLzv1TurRlJYQqgRTWje_PVngJcmIr19F2wf3WxPHPfaZKHWEWoRMlL09Lauv0bZGvMeNsU7ZCvYQZW73JBZGjtyKXjUffbFe__MomXC2ez6639h_8-vaZINEFoT-1xG5wHtUaWsF7jY_CHEbZVvDvHM7IXZLKjNlTTxH02D_S4Jyfb-52x2ZKY9B2R4i6ScqooL8_g0phQsqjrl7sLcPhu3PWfCX4IQMnBm7xcAWge-pA18fCCDOv2UgcDyQ10ddhQnVbA0XTwlB8upzHfZXHJ2LJ_25PwhxWWKMzZcurYDhPMdGdTd0BSw07_KVYiLieYnislJdMre19gWenzpbvsxZ4bZaYhk9aH0SQyJBCV3mRcV3wdbuKYsVb5331rrW7tBHsRPBOUcHGRqioILJFPYebj8TNmZdlW_4axl_dGqbzLsNwrYzCT6H6E4tU24apFR2r8jIqw1Arv9fGrhtk9VKQ-BUA27yyNCloGDVz7zlnO4iHYYXqEmBTihuX8C1yxTE7W1rG7DBIj5zG19X4kvGAdiiPMJSw7LX0wdG4yYhs66ZuFFdyIk-i968"
      },
      body: JSON.stringify({
        from: {
          postal_code: "08062-670"
        },
        to: {
          postal_code: body.cep
        },
        products: [
          {
            id: "1",
            width: 20,
            height: 20,
            length: 20,
            weight: 1
          }
        ]
      })
    });

    const data = await response.json();

    return Response.json(data);

  } catch (error) {
    return Response.json({ error: "Erro no cálculo" });
  }
}
