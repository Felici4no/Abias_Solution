export const connectedAccountEntity = {
  name: "connectedAccount",
  description: "Conta conectada de plataforma de entrega, como iFood ou 99.",
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
    provider: {
      type: "enum",
      required: true,
      values: ["ifood", "99", "other"]
    },
    providerAccountId: {
      type: "string",
      required: true
    },
    connectionStatus: {
      type: "enum",
      required: true,
      values: ["pending", "connected", "expired", "revoked", "failed"]
    },
    lastSyncedAt: {
      type: "datetime",
      required: false
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
