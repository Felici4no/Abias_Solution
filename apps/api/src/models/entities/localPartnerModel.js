export const localPartnerEntity = {
  name: "localPartner",
  description: "Comercio parceiro usado para fortalecer consumo local e cashback.",
  fields: {
    id: {
      type: "uuid",
      required: true
    },
    legalName: {
      type: "string",
      required: true
    },
    tradeName: {
      type: "string",
      required: true
    },
    document: {
      type: "string",
      required: true,
      notes: "CNPJ ou documento equivalente."
    },
    category: {
      type: "string",
      required: true
    },
    neighborhood: {
      type: "string",
      required: true
    },
    city: {
      type: "string",
      required: true
    },
    state: {
      type: "string",
      required: true
    },
    cashbackRate: {
      type: "number",
      required: true,
      min: 0,
      max: 1
    },
    status: {
      type: "enum",
      required: true,
      values: ["active", "paused", "inactive"]
    },
    createdAt: {
      type: "datetime",
      required: true
    },
    updatedAt: {
      type: "datetime",
      required: true
    }
  }
};
