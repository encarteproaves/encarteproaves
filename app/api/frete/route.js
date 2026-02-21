export async function POST(req) {

  try {

    const body = await req.json();

    const response = await fetch("https://melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDViZTI4OTU1YzlhYTk4YThiZmUwODIyMjc0ZjNkOTNkYmU4YjI2NjFlOTM1NDAxYjE1YzliNDlmMGUwODMzN2JhMmFhNzBlYmQ4YjQ2ZWQiLCJpYXQiOjE3NzE2OTcwNjYuMDIwNjM3LCJuYmYiOjE3NzE2OTcwNjYuMDIwNjM5LCJleHAiOjE4MDMyMzMwNjYuMDA5OTA0LCJzdWIiOiI2YjU1ZDBhNi0wNTg0LTQ5NWEtOWZkOS1lZWQ5ZTIwMmE4YzEiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.ysySgswJ0RRbnTkWVYb4ejxrmJ0PQn6Cd2-RR5-PMOylcsF105bfHAT01DC1IU3rhe40sFRJYswl7MSDb1XLh51IxxW_9GxJjYrOgtATnT0xxvpEL3XYY9D6G18U-0rMf9NPrhSnHAhSdn2MqUnop9_4kdziIqfli4zgfvaEtWkf6rZ5zRlIKB2E9WsUGNeVJRZPuQqiUKDH4Gu29VyBG80h0xGXsV1TLV1uqvTasFb8y4GhyezARN-HqXOifjNHQM9YjoKNSiBkebz37pow83NU5ZouFXLAWhbHNhylGVaGsgSchOWI0jBvkZpUIFP4AmD30hVipWylnALHOeTgB9INraxH7Hn5CsPskDBENTIRxrfy9SRyRh0mr5JQ4BNlVBKL6HUEkiUX_So1_lxec8YA9Gv95ZIni1i_ldWKcM7WNSjaRu2V3aYUausWuBGb4NkydE1v0JlfNJcihu6UWPAIxmyetarw0Vt6kem4-Pd5ACzBNESkHXzlSEqCcTHuIwDKnmKpX6p6iCGx6-S3cg55wM7lSbwhslD7cXQvPA3yhWmOH9Gq2r-mt7Ack7JtSBjdAt0g8b-ta5I-Nu6_zWxRjAAS1BjC_jIwu45tKg_sip_JabCldD8VmCs-PuH06wcFrJnnKLoe6qS4BbdSOIUycb93IQEKKcL6KcImmoA"
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
            width: body.width,
            height: body.height,
            length: body.length,
            weight: body.weight,
            insurance_value: body.price,
            quantity: 1
          }
        ]

      })
    });

    const data = await response.json();

    return Response.json(data);

  } catch (error) {

    console.log(error);

    return Response.json({
      error: "Erro no cálculo"
    });

  }

}
