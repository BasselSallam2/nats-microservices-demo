import type { Model } from "mongoose";
import { apiFeature } from "../../../utils/apiFeature";
import { getDynamicActivityLogModel } from "./dynamicModel"; // تأكد من المسار الصحيح

type getOneOptions = {
  fields?: string;
  populate?: string;
};

class ActivityService {
  private date:string;
  constructor(date?:string) {
    this.date = date;
  }

  private getQueryModel(): Model<any> {
    return getDynamicActivityLogModel(this.date);
  }

  createOne(data: any) {
    const DynamicModel = this.getQueryModel();
    const doc = new DynamicModel(data);
    return doc.save();
  }

  async deleteOne(id: string) {
    const QueryModel = this.getQueryModel();
    const document = (await QueryModel.findById(id)) as any;
    if (!document) throw new Error("Document not found");

    if (document.deleted)
      return QueryModel.findByIdAndUpdate(id, { $set: { deleted: true } });
    return QueryModel.findByIdAndDelete(id);
  }

  async updateOne(id: string, data: any) {
    const QueryModel = this.getQueryModel();
    const document = await QueryModel.findById(id).exec();
    if (!document) throw new Error("Document not found");
    return await QueryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getOne(id: string, getOneOptions?: getOneOptions) {
    const QueryModel = this.getQueryModel();
    let query = QueryModel.findById(id);
    if (getOneOptions?.fields) {
      query = query.select(getOneOptions.fields);
    }

    if (getOneOptions?.populate) {
      query = query.populate(getOneOptions.populate);
    }

    const document = await query.exec();
    if (!document) throw new Error("Document not found");

    return document.lean();
  }

  async getAll(querystring?: Record<string, any>) {
    const QueryModel = this.getQueryModel();
    const schema = QueryModel.schema;
    const filter: Record<string, any> = {};
    if (schema.paths.deleted) filter["deleted"] = false;
    const mongoQuery = QueryModel.find(filter);
    const { paginationResult, MongooseQuery } = await new apiFeature(
      mongoQuery,
      querystring
    )
      .sort()
      .filter()
      .select()
      .paginate();

    const data = await MongooseQuery.exec();
    return { paginationResult, data };
  }
}

export { ActivityService };
