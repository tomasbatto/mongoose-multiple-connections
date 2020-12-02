import {
  ConnectOptions,
  Connection as MongooseConnection,
  createConnection,
} from "mongoose";
import MongoDatabaseInstance, {
  ModelDeclaration,
} from "./MongoDatabaseInstance";

async function createMongooseConnection(
  connectionString: string,
  options?: ConnectOptions
): Promise<MongooseConnection> {
  const connection = await createConnection(connectionString, options);
  return connection;
}

type MongoDatabaseDeclaration = {
  name: string;
  uri: string;
  options: ConnectOptions;
  models: ModelDeclaration[];
};
export default class DatabaseManager {
  static instances: Record<string, MongoDatabaseInstance> = {};

  async start(
    declarations: MongoDatabaseDeclaration[]
  ): Promise<Record<string, MongoDatabaseInstance>> {
    for (const declaration of declarations) {
      const connection = await createMongooseConnection(
        declaration.uri,
        declaration.options
      );
      const databaseInstance = new MongoDatabaseInstance(connection);
      for (const model of declaration.models) {
        databaseInstance.addModel(model);
      }
      DatabaseManager.instances[declaration.name] = databaseInstance;
    }
    return DatabaseManager.instances;
  }

  static getDb(name: string): MongoDatabaseInstance {
    return this.instances[name];
  }
}
