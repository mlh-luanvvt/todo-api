import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { Todo } from './types';

const docClient = new DynamoDB.DocumentClient();
const table = (process.env.todosTable as string);

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const params = {
    TableName: table,
  }
  const res = await docClient.scan(params).promise();

  const todos: Todo[] = [];
  if (Array.isArray(res.Items)) {
    for (const item of res.Items) {
      todos.push((item as Todo))
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: true,
      data: todos
    }),
  };
};
