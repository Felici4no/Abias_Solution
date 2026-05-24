import { cashbackEntity } from "./cashbackModel.js";
import { connectedAccountEntity } from "./connectedAccountModel.js";
import { courierEntity } from "./courierModel.js";
import { financialProductEntity } from "./financialProductModel.js";
import { localPartnerEntity } from "./localPartnerModel.js";
import { operationalScoreEntity } from "./operationalScoreModel.js";
import { transactionEntity } from "./transactionModel.js";

export const domainEntities = [
  courierEntity,
  connectedAccountEntity,
  operationalScoreEntity,
  financialProductEntity,
  transactionEntity,
  localPartnerEntity,
  cashbackEntity
];
