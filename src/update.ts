import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { Todo } from './types';

const docClient = new DynamoDB.DocumentClient();
const table = (process.env.todosTable as string);

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const todoId = event.pathParameters?.id;
  const input: Todo = JSON.parse(event.body || '{}')

  const params = {
    TableName: table,
    Key: {
      todoId
    },
    UpdateExpression: "set content = :content, done = :done",
    ExpressionAttributeValues:{
      ":content": input.content,
      ":done": input.done
    },
    ReturnValues:"UPDATED_NEW"
  };

  const res = await docClient.update(params).promise();

  console.log(res)

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: true,
    }),
  };
};
