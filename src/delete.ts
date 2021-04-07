import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";

const docClient = new DynamoDB.DocumentClient();
const table = (process.env.todosTable as string);

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  const todoId = event.pathParameters?.id

  const params = {
      TableName: table,
      Key: {
        todoId,
      }
  };

  await docClient.delete(params).promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: true,
    }),
  };
};
