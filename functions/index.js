const {defineSecret} = require("firebase-functions/params");
const axios = require("axios");
const {
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");

const EUPAGO_KEY = defineSecret("EUPAGO_KEY");


exports.moneyRequestFinal = onDocumentCreated({
  document: "ticketBuyer/{id}",
  secrets: [EUPAGO_KEY], // <====
}, async (event) => {
  const docId = event.params.id;
  console.log(`🔔 Evento recebido para documento: ${docId}`);

  const snapshot = event.data;
  if (!snapshot) {
    console.log("⚠️ Nenhum dado associado ao evento.");
    return;
  }

  const data = snapshot.data();
  console.log("📄 Dados recebidos:", JSON.stringify(data));

  if (data.referenceCreated) {
    console.log("✅ Pagamento já processado. Ignorando...");
    return;
  }

  if (data.type === "mbway") {
    const eupagoKeyValue = await EUPAGO_KEY.value(); // <====
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/api/v1.02/mbway/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `ApiKey ${eupagoKeyValue}`,
      },
      data: {
        payment: {
          amount: {
            currency: "EUR",
            value: data.total,
          },
          identifier: docId,
          customerPhone: data.phone,
          countryCode: "351",
          description: "Compra de bilhetes Gala Thirst Project",
        },
        customer: {
          email: data.email,
        },
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.transactionStatus === "Success") {
        await snapshot.ref.update({
          referenceCreated: true,
          error: null,
        });
        console.log(`✅ Pagamento processado com sucesso para ${docId}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });
        console.warn(`❌ Erro no pagamento para ${docId}: ${response.data.resposta}`);
      }
    } catch (error) {
      const errorMessage = error.response ?
        `Erro: ${error.response.status} - ${JSON.stringify(error.response.data)}` :
        error.message;

      await snapshot.ref.update({
        referenceCreated: false,
        error: errorMessage,
      });
      console.error(`❌ Erro ao processar pagamento para ${docId}:`, errorMessage);
    }
  } 
  else if (data.type === "multibanco") {
    const eupagoKeyValue = await EUPAGO_KEY.value(); // <====
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/clientes/rest_api/multibanco/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        chave: eupagoKeyValue,
        valor: data.total,
        id: docId,
        descricao: "Compra de bilhetes Gala Thirst Project",
        per_dup: 1, // Permitir duplicidade, ajuste conforme sua necessidade
        data_fim: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Validade de 24 horas
        email: data.email,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.sucesso === true) {
        await snapshot.ref.update({
          referenceCreated: true,
          referencia: response.data.referencia,
          entidade: response.data.entidade,
          valor: response.data.valor,
          error: null,
        });
        console.log(`✅ Pagamento Multibanco processado com sucesso para ${docId}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });
        console.warn(`❌ Erro no pagamento Multibanco para ${docId}: ${response.data.resposta}`);
      }
    } catch (error) {
      const errorMessage = error.response ?
        `Erro: ${error.response.status} - ${JSON.stringify(error.response.data)}` :
        error.message;

      await snapshot.ref.update({
        referenceCreated: false,
        error: errorMessage,
      });
      console.error(`❌ Erro ao processar pagamento Multibanco para ${docId}:`, errorMessage);
    }
  }
});


exports.moneyDonationFinal = onDocumentCreated( {
  document: "afterGala/{id}",
  secrets: [EUPAGO_KEY], // <====
}, async (event) => {
  const docId = event.params.id;
  console.log(`🔔 Evento recebido para documento: ${docId}`);

  const snapshot = event.data;
  if (!snapshot) {
    console.log("⚠️ Nenhum dado associado ao evento.");
    return;
  }

  const data = snapshot.data();
  console.log("📄 Dados recebidos:", JSON.stringify(data));

  if (data.referenceCreated) {
    console.log("✅ Pagamento já processado. Ignorando...");
    return;
  }

  if (data.type === "mbway") {
    const eupagoKeyValue = await EUPAGO_KEY.value(); // <====
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/api/v1.02/mbway/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `ApiKey ${eupagoKeyValue}`,
      },
      data: {
        payment: {
          amount: {
            currency: "EUR",
            value: data.total,
          },
          identifier: docId,
          customerPhone: data.phone,
          countryCode: "351",
          description: "Doação Gala Thirst Project",
        },
        customer: {
          email: data.email,
        },
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.transactionStatus === "Success") {
        await snapshot.ref.update({
          referenceCreated: true,
          error: null,
        });
        console.log(`✅ Pagamento processado
           com sucesso para ${docId}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });
        console.warn(`❌ Erro no pagamento para 
          ${docId}: ${response.data.resposta}`);
      }
    } catch (error) {
      const errorMessage = error.response ?
              `Erro: ${error.response.status} - 
              ${JSON.stringify(error.response.data)}` :
              error.message;

      await snapshot.ref.update({
        referenceCreated: false,
        error: errorMessage,
      });
      console.error(`❌ Erro ao processar pagamento para 
        ${docId}:`, errorMessage);
    }
  } else if (data.type === "multibanco") {
    const eupagoKeyValue = await EUPAGO_KEY.value(); // <====
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/clientes/rest_api/multibanco/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        chave: eupagoKeyValue,
        valor: data.total,
        id: docId,
        descricao: "Compra de bilhetes Gala Thirst Project",
        per_dup: 1, // Permitir duplicidade, ajuste conforme sua necessidade
        data_fim: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Validade de 24 horas
        email: data.email,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.sucesso === true) {
        await snapshot.ref.update({
          referenceCreated: true,
          referencia: response.data.referencia,
          entidade: response.data.entidade,
          valor: response.data.valor,
          error: null,
        });
        console.log(`✅ Pagamento Multibanco processado com sucesso para ${docId}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });
        console.warn(`❌ Erro no pagamento Multibanco para ${docId}: ${response.data.resposta}`);
      }
    } catch (error) {
      const errorMessage = error.response ?
        `Erro: ${error.response.status} - ${JSON.stringify(error.response.data)}` :
        error.message;

      await snapshot.ref.update({
        referenceCreated: false,
        error: errorMessage,
      });
      console.error(`❌ Erro ao processar pagamento Multibanco para ${docId}:`, errorMessage);
    }
  }
});
