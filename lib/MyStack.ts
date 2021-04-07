import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // DynanoDB TODO table
    const todosTable = new sst.Table(this, "Todos", {
      fields: {
        todoId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "todoId" },
    });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          todosTable: todosTable.dynamodbTable.tableName,
        }
      },
      routes: {
        "GET    /todos": "src/list.handler",
        "POST   /todos": "src/create.handler",
        "GET    /todos/{id}": "src/get.handler",
        "PUT    /todos/{id}": "src/update.handler",
        "DELETE /todos/{id}": "src/delete.handler",
      },
    });

    api.attachPermissions([todosTable]);

    // Show API endpoint in output
    this.addOutputs({
      "ApiEndpoint": api.httpApi.apiEndpoint,
    });
  }
}
