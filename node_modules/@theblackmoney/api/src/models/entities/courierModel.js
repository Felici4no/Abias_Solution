export const courierEntity = {
  name: "courier",
  description: "Entregador cadastrado na plataforma financeira.",
  fields: {
    id: {
      type: "uuid",
      required: true
    },
    fullName: {
      type: "string",
      required: true
    },
    document: {
      type: "string",
      required: true,
      notes: "CPF ou outro documento usado na etapa de cadastro."
    },
    phone: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      required: false
    },
    city: {
      type: "string",
      required: true
    },
    state: {
      type: "string",
      required: true
    },
    status: {
      type: "enum",
      required: true,
      values: ["pending_onboarding", "active", "blocked", "inactive"]
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
