export const operationalScoreEntity = {
  name: "operationalScore",
  description: "Score dinamico baseado no comportamento operacional do entregador.",
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
    score: {
      type: "number",
      required: true,
      min: 0,
      max: 1000
    },
    version: {
      type: "string",
      required: true,
      notes: "Versao do modelo ou regra usada para calcular o score."
    },
    inputs: {
      type: "object",
      required: true,
      fields: {
        deliveryCount30d: "number",
        activeDays30d: "number",
        averageWeeklyEarnings: "number",
        averageRating: "number",
        platformTenureDays: "number",
        cancellationRate: "number"
      }
    },
    riskBand: {
      type: "enum",
      required: true,
      values: ["low", "medium", "high", "insufficient_data"]
    },
    calculatedAt: {
      type: "datetime",
      required: true
    }
  }
};
