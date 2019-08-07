import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { todoExists } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(todoId, docClient, todosTable)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  // TODO: Remove a TODO item by id
  var params = {
    TableName: todosTable,
    Key: {
      id: todoId
    }
  }

  await docClient.delete(params, function (err, data) {
  if (err) {
    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Delete succeeded:", JSON.stringify(data, null, 2));
  }
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  }
}