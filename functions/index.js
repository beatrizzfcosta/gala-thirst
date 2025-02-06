const axios = require("axios");
const logger = require("firebase-functions/logger");
const {
  onDocumentCreated, onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

require("dotenv").config(); // Carregar variáveis de ambiente do arquivo .env


exports.moneyRequest = onDocumentCreated("ticketBuyer/{id}", async (event) => {
  const docId = event.params.id;
  const snapshot = event.data;
  if (!snapshot) {
    logger.info("No data associated with the event", { structuredData: true });
    return;
  }
  const data = snapshot.data();
  if (data.type === "mbway") {
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/api/v1.02/mbway/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": `ApiKey ${process.env.EUPAGO_KEY}`,
        
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
          description: "Compra de bilhetes Gala Thirst Project"
        },
        customer: {
          email: data.email,
        },
      },
    };

    logger.info("Chave sendo enviada:", process.env.EUPAGO_KEY);

    try {
      const response = await axios.request(options);
      if (response.data.sucesso === true) {
        await snapshot.ref.update({
          referenceCreated: true,
        });
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta,
        });
      }
    } catch (error) {
      snapshot.ref.update({
        error: error.response
          ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
          : error.message, // Mensagem detalhada ou genérica
      });
    }
  } else if (data.type === "multibanco") {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    const dataFimStr = tomorrow.toISOString().split("T")[0];
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/clientes/rest_api/multibanco/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        chave: process.env.EUPAGO_KEY,
        valor: data.total,
        email: data.email,
        failOver: "1",
        descricao: "Compra de bilhetes Gala Thirst Project",
        data_fim: dataFimStr,
        per_dup: 0,
        id: docId,
      },
    };
    try {
      const response = await axios.request(options);
      if (response.data.sucesso === true) {
        await snapshot.ref.update({
          referenceCreated: true,
          referencia: response.data.referencia,
          entidade: response.data.entidade,
        });
      } else {
        await snapshot.ref.update({
          error: response.data.resposta,
        });
      }
    } catch (error) {
      await snapshot.ref.update({
        error: error.response
          ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
          : error.message, // Mensagem detalhada ou genérica
      });
    }
  }
});

exports.moneyDonation = onDocumentUpdated("afterGala/{id}", async (event) => {
  const docId = event.params.id;
  const snapshot = event.data.after;

  logger.info(`Evento disparado para documento: ${docId}`);

  if (!snapshot) {
    logger.info("No data associated with the event", { structuredData: true });
    return;
  }

  const data = snapshot.data();
  logger.info("Dados do documento recebidos:", data);

    // 🚨 Evita múltiplas execuções desnecessárias
    if (data.referenceCreated) {
      logger.info(`Pagamento já processado para ${docId}, ignorando...`);
      return;
    }

    logger.info("Dados recebidos no backend:", JSON.stringify(data));

    if (data.type === "mbway") {
      const options = {
        method: "POST",
        url: "https://clientes.eupago.pt/api/v1.02/mbway/create",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": `ApiKey ${process.env.EUPAGO_KEY}`,
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
            description: "Doação Gala Thirst Project"
          },
          customer: {
            email: data.email,
          },
        },
      };

      logger.info("Headers sendo enviados:", JSON.stringify(options.headers));
      logger.info("Body sendo enviado:", JSON.stringify(options.data));

      try {
        const response = await axios.request(options);
        
        if (response.data.transactionStatus === "Success") {
          await snapshot.ref.update({
            referenceCreated: true,
            error: null, // 🔧 Evita "undefined"
          });

          logger.info(`Pagamento processado com sucesso: ${JSON.stringify(response.data)}`);
        } else {
          await snapshot.ref.update({
            referenceCreated: false,
            error: response.data.resposta || "Erro desconhecido",
          });

          logger.warn(`Erro na transação: ${response.data.resposta}`);
        }
      } catch (error) {
        let errorMessage = error.response
          ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
          : error.message;

        await snapshot.ref.update({
          referenceCreated: false,
          error: errorMessage || "Erro inesperado",
        });

        logger.error(`Erro ao processar pagamento: ${errorMessage}`);
      }
    } else if (data.type === "multibanco") {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
      const dataFimStr = tomorrow.toISOString().split("T")[0];
      const options = {
        method: "POST",
        url: "https://clientes.eupago.pt/clientes/rest_api/multibanco/create",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        data: {
          chave: process.env.EUPAGO_KEY,
          valor: data.total,
          email: data.email,
          failOver: "1",
          descricao: "Doação para Thirst Project",
          data_fim: dataFimStr,
          per_dup: 0,
          id: docId,
        },
      };
      try {
        const response = await axios.request(options);
        if (response.data.sucesso === true) {
          await snapshot.ref.update({
            referenceCreated: true,
            referencia: response.data.referencia,
            entidade: response.data.entidade,
            error: false,
          });
        } else {
          await snapshot.ref.update({
            error: response.data.resposta,
          });
        }
      } catch (error) {
        await snapshot.ref.update({
          error: error.response
            ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
            : error.message, // Mensagem detalhada ou genérica
        });
      }
    }
  });

/**exports.moneyDonation = onDocumentUpdated(
  "afterGala/{id}", async (event) => {
    const docId = event.params.id;
    const snapshot = event.data.after;
    if (!snapshot) {
      logger.info(
        "No data associated with the event", { structuredData: true },
      );
      return;
    }
    const data = snapshot.data();
   
    logger.info("Dados recebidos no backend:", JSON.stringify(data));
    if (data.type === "mbway") {
      const options = {
        method: "POST",
        url: "https://clientes.eupago.pt/api/v1.02/mbway/create",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": `ApiKey ${process.env.EUPAGO_KEY}`,
        },
        data: {
          payment: {
            amount: {
              currency: "EUR",
              value: data.total,
            },
            identifier: docId, // Identificador do pagamento
            customerPhone: data.phone,
            countryCode: "351", // Código do país para Portugal
          },
          customer: {
            email: data.email,
          },
        },
      };

      logger.info("Headers sendo enviados:", JSON.stringify(options.headers));
      logger.info("Body sendo enviado:", JSON.stringify(options.data));

      try {
        const response = await axios.request(options);
        if (response.data.sucesso === true) {
          await snapshot.ref.update({
            referenceCreated: true,
            error: false,
          });
        } else {
          await snapshot.ref.update({
            referenceCreated: false,
            error: response.data.resposta,
          });
        }
      } catch (error) {
        snapshot.ref.update({
          error: error.response
            ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
            : error.message, // Mensagem detalhada ou genérica
        });
      }
    } else if (data.type === "multibanco") {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
      const dataFimStr = tomorrow.toISOString().split("T")[0];
      const options = {
        method: "POST",
        url: "https://clientes.eupago.pt/clientes/rest_api/multibanco/create",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        data: {
          chave: process.env.EUPAGO_KEY,
          valor: data.total,
          email: data.email,
          failOver: "1",
          descricao: "Doação para Thirst Project",
          data_fim: dataFimStr,
          per_dup: 0,
          id: docId,
        },
      };
      try {
        const response = await axios.request(options);
        if (response.data.sucesso === true) {
          await snapshot.ref.update({
            referenceCreated: true,
            referencia: response.data.referencia,
            entidade: response.data.entidade,
            error: false,
          });
        } else {
          await snapshot.ref.update({
            error: response.data.resposta,
          });
        }
      } catch (error) {
        await snapshot.ref.update({
          error: error.response
            ? `Error: ${error.response.status} - ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
            : error.message, // Mensagem detalhada ou genérica
        });
      }
    }
  },
);
**/