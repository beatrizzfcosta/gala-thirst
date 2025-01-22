const axios = require("axios");
const logger = require("firebase-functions/logger");
const {
  onDocumentCreated, onDocumentUpdated,
} = require("firebase-functions/v2/firestore");

exports.moneyRequest = onDocumentCreated("ticketBuyer/{id}", async (event) => {
  const docId = event.params.id;
  const snapshot = event.data;
  if (!snapshot) {
    logger.info("No data associated with the event", {structuredData: true});
    return;
  }
  const data = snapshot.data();
  if (data.type === "mbway") {
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/clientes/rest_api/mbway/create",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        chave: process.env.EU_PAGO,
        valor: data.total,
        alias: data.phone,
        email: data.email,
        descricao: "Compra de bilhetes Gala Thirst Project",
        contacto: data.phone,
        id: docId,
      },
    };
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
        error: error,
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
        chave: process.env.EU_PAGO,
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
        error: error,
      });
    }
  }
});

exports.moneyDonation = onDocumentUpdated(
    "afterGala/{id}", async (event) => {
      const docId = event.params.id;
      const snapshot = event.data.after;
      if (!snapshot) {
        logger.info(
            "No data associated with the event", {structuredData: true},
        );
        return;
      }
      const data = snapshot.data();
      if (data.referenceCreated || data.error !== false) {
        return;
      }
      if (data.type === "mbway") {
        const options = {
          method: "POST",
          url: "https://clientes.eupago.pt/clientes/rest_api/mbway/create",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
          },
          data: {
            chave: process.env.EU_PAGO,
            valor: data.total,
            alias: data.phone,
            email: data.email,
            descricao: "Doação para Thirst Project",
            contacto: data.phone,
            id: docId,
          },
        };
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
            error: error,
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
            chave: process.env.EU_PAGO,
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
            error: error,
          });
        }
      }
    },
);
