import mongoose from "mongoose";
import { ActivityLogSchema } from "./activity.schema";
import { getCollectionName } from "./collectionMaker";

export function getDynamicActivityLogModel(date: string) {
  const dynamicCollectionName = getCollectionName(date);
  const uniqueModelName = `ActivityLog_${dynamicCollectionName}`;

  if (mongoose.connection.models[uniqueModelName]) {
    return mongoose.connection.models[uniqueModelName];
  }

  const DynamicModel = mongoose.model(
    uniqueModelName,
    ActivityLogSchema,
    dynamicCollectionName
  );

  return DynamicModel;
}
