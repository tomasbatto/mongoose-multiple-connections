import {
  Document,
  Model,
  Connection as MongooseConnection,
  Schema,
} from "mongoose";

export type ModelDeclaration = {
  name: string;
  schema: Schema;
  options?: ModelOptions;
};
type ModelOptions = {
  readPreference: string;
};

export default class MongoDatabaseInstance {
  models: Record<string, Model<Document>>;
  connection: MongooseConnection;
  constructor(connection: MongooseConnection) {
    this.connection = connection;
    this.models = {};
  }

  addModel(modelDeclaration: ModelDeclaration): Model<Document> {
    const { name, schema, options } = modelDeclaration;
    if (options && options.readPreference) {
      schema.set("read", options.readPreference);
    }
    this.models[name] = this.connection.model(name, schema);
    return this.models[name];
  }

  getModel(name: string): Model<Document> {
    return this.models[name];
  }
}
