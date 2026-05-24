export const cashbackEntity = {
  name: "cashback",
  description: "Beneficio gerado por compras em parceiros locais e aplicado na fatura.",
  fields: {
    id: {
      type: "uuid",
      required: true
    },
    courierId: {
      type: "uuid",
      required: true,
      relation: "courier.id"
    },
    transactionId: {
      type: "uuid",
      required: true,
      relation: "transaction.id"
    },
    amount: {
      type: "money",
      required: true
    },
    currency: {
      type: "string",
      required: true,
      default: "BRL"
    },
    status: {
      type: "enum",
      required: true,
      values: ["pending", "available", "applied_to_invoice", "cancelled"]
    },
    invoiceId: {
      type: "uuid",
      required: false,
      notes: "Fatura na qual o cashback foi aplicado como desconto."
    },
    createdAt: {
      type: "datetime",
      required: true
    },
    appliedAt: {
      type: "datetime",
      required: false
    }
  }
};
