import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import uniqid from 'uniqid';
import { Todo } from './types';

const docClient = new DynamoDB.DocumentClient();
const table = (process.env.todosTable as string);

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const input: Todo = JSON.parse(event.body || '{}')

  const todo = {
    todoId: uniqid(),
    content: input.content,
    done: false
  };

  const params = {
      TableName: table,
      Item: todo
  };

  await docClient.put(params).promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: true,
      data: todo
    }),
  };
};
