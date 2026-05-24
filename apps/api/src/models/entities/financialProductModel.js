export const financialProductEntity = {
  name: "financialProduct",
  description: "Produto financeiro liberado conforme score e politica de risco.",
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
    type: {
      type: "enum",
      required: true,
      values: ["credit_card", "personal_loan"]
    },
    status: {
      type: "enum",
      required: true,
      values: ["pre_approved", "active", "paused", "closed", "rejected"]
    },
    approvedAmount: {
      type: "money",
      required: true
    },
    currency: {
      type: "string",
      required: true,
      default: "BRL"
    },
    pricing: {
      type: "object",
      required: false,
      fields: {
        monthlyInterestRate: "number",
        interchangeShareRate: "number"
      }
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
