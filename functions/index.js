/* eslint-disable max-len */
const {defineSecret} = require("firebase-functions/params");
const axios = require("axios");

const EUPAGO_KEY = defineSecret("EUPAGOKEY");

const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
// Credenciais do email de onde serão enviados os emails de compra de bilhetes
const EMAIL_USER = defineSecret("EMAIL_USER");
const EMAIL_PASS = defineSecret("EMAIL_PASS");


exports.enviarBilhete = onDocumentWritten({
  document: "ticketBuyer/{ticketId}",
  secrets: [EMAIL_USER, EMAIL_PASS],
}, async (event) => {
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();

  if (!before || !after) {
    console.error("❌ Erro: Dados do documento ausentes.");
    return;
  }

  // Só envia e-mail se "paid" mudou de false para true
  if (before.paid === false && after.paid === true) {
    const email = after.email;
    const name = after.names && after.names.length > 0 ? after.names[0] : "Cliente";
    const phone = after.phone || "Não fornecido";
    const tickets = after.tickets || 1;
    const total = after.total || 0;
    const paymentType = after.type || "Desconhecido";

    if (!email) {
      console.error("❌ Erro: O campo 'email' não está definido no documento.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: await EMAIL_USER.value(),
        pass: await EMAIL_PASS.value(),
      },
    });

    const mailOptions = {
      from: await EMAIL_USER.value(),
      to: email,
      subject: "Confirmação da sua compra de bilhetes",
      html: `
      <p>Olá <strong>${name}</strong>,</p>
      <p>O seu pagamento foi confirmado com sucesso!</p>
      <p><strong>Detalhes da Compra:</strong></p>
      <ul>
        <li><strong>Nome:</strong> ${name}</li>
        <li><strong>E-mail:</strong> ${email}</li>
        <li><strong>Telefone:</strong> ${phone}</li>
        <li><strong>Quantidade de bilhetes:</strong> ${tickets}</li>
        <li><strong>Total pago:</strong> €${total.toFixed(2)}</li>
        <li><strong>Método de pagamento:</strong> ${paymentType.toUpperCase()}</li>
      </ul>
      <p>Apresente este e-mail no evento como prova de compra.</p>
      <p>Obrigado pela sua compra!</p>
    `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ E-mail enviado para ${email}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar e-mail: ${error}`);
    }
  }
});


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
        // eslint-disable-next-line max-len
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
  } else if (data.type === "creditcard") {
    const eupagoKeyValue = await EUPAGO_KEY.value();
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/api/v1.02/creditcard/create",
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
          lang: "PT",
          identifier: docId,
          description: "Doação com Cartão de Crédito",
          successUrl: "https://gala.thirstproject.pt?status=success",
          failUrl: "https://gala.thirstproject.pt?status=fail",
          backUrl: "https://gala.thirstproject.pt",
        },
        customer: {
          notify: true,
          email: data.email,
        },
      },
    };

    try {
      console.log(`📡 Enviando requisição para EuPago...`);
      console.log("🔍 Dados enviados:", JSON.stringify(options.data));

      const response = await axios.request(options);

      console.log("🔍 Resposta da EuPago:", JSON.stringify(response.data));

      if (response.data.sucesso === true && response.data.redirectUrl) {
        await snapshot.ref.update({
          referenceCreated: true,
          paymentUrl: response.data.redirectUrl, // ✅ Usando 'redirectUrl' corretamente
          error: null,
        });

        console.log(`✅ Link de pagamento gerado com sucesso: ${response.data.redirectUrl}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });

        console.warn(`❌ Erro ao gerar link de pagamento: ${response.data.resposta}`);
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
});


exports.moneyDonationFinal = onDocumentCreated({
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
        descricao: "Doação Gala Thirst Project",
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
  } else if (data.type === "creditcard") {
    const eupagoKeyValue = await EUPAGO_KEY.value();
    const options = {
      method: "POST",
      url: "https://clientes.eupago.pt/api/v1.02/creditcard/create",
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
          lang: "PT",
          identifier: docId,
          description: "Doação com Cartão de Crédito",
          successUrl: "https://gala.thirstproject.pt?status=success",
          failUrl: "https://gala.thirstproject.pt?status=fail",
          backUrl: "https://gala.thirstproject.pt",
        },
        customer: {
          notify: true,
          email: data.email,
        },
      },
    };

    try {
      console.log(`📡 Enviando requisição para EuPago...`);
      console.log("🔍 Dados enviados:", JSON.stringify(options.data));

      const response = await axios.request(options);

      console.log("🔍 Resposta da EuPago:", JSON.stringify(response.data));

      if (response.data.transactionStatus === "Success" && response.data.redirectUrl) {
        await snapshot.ref.update({
          referenceCreated: true,
          paymentUrl: response.data.redirectUrl, // ✅ Usando 'redirectUrl' corretamente
          error: null,
        });

        console.log(`✅ Link de pagamento gerado com sucesso: ${response.data.redirectUrl}`);
      } else {
        await snapshot.ref.update({
          referenceCreated: false,
          error: response.data.resposta || "Erro desconhecido",
        });

        console.warn(`❌ Erro ao gerar link de pagamento: ${response.data.resposta}`);
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
});
