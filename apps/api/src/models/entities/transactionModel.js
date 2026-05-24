export const transactionEntity = {
  name: "transaction",
  description: "Movimentacao feita com produto financeiro da plataforma.",
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
    financialProductId: {
      type: "uuid",
      required: true,
      relation: "financialProduct.id"
    },
    localPartnerId: {
      type: "uuid",
      required: false,
      relation: "localPartner.id"
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
    category: {
      type: "string",
      required: false
    },
    status: {
      type: "enum",
      required: true,
      values: ["authorized", "settled", "declined", "refunded", "cancelled"]
    },
    occurredAt: {
      type: "datetime",
      required: true
    }
  }
};
