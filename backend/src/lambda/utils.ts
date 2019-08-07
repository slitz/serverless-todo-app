import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

/**
 * Check if a todoId is exists in the database
 * @param todoId an id of a todo item
 * @param docClient an instance of the AWS DynamoDB DocumentClient
 * @param todosTable the name of the todos table
 *
 * @returns boolean
 */
export async function todoExists(todoId: string, docClient: AWS.DynamoDB.DocumentClient, todosTable: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        id: todoId
      }
    })
    .promise()

  return !!result.Item
}