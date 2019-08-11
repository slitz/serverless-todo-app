import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJPs7NaDshUlTCMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0wdWxvZnozNi5hdXRoMC5jb20wHhcNMTkwODExMTkzOTUzWhcNMzMw
NDE5MTkzOTUzWjAhMR8wHQYDVQQDExZkZXYtMHVsb2Z6MzYuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyIuYFBMHh1x8ZAMQcHolH6mh
91kFZtOolItZk09keFi2VwV63QTqhWAteHo/GOLz5VJ2vGjc3FMqE0Mekf1pDA1U
gjdfYcx3C6u1vi4FH5aYGfCLkEsFWCO7sd3zSEoIglPGhYY0E3Plg3v4ORxPvBl2
OwSwnQTHTLEeaDZaQJmvb4GY7CpUvtvIymv5HAQUCPuDBDrmh6rpZsKzCcpJlD/X
1TSzyWSD0V9loxDTfAQSIGg5UEGPT/8yQTQC41h3yXdhKR2VZgecnUoQ+uhTsKD8
apegEmwkxFlMYN8cn1bTFMUpwm4beelsCEoDVqyYoXSrEr95ucH5FqHrdWPZWQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRLjVaThW2/jVDRrWZ9
++FE+14XSjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJ+bsYxB
8xcy4SwUYZ9VMBiT4OvMJPSeV/gmtw7T5eqQpkeBWRCd3UPDblyQCiXTOByi6aXU
AzMI0bjHOyH/ekKxx36Vr19m4VXDpY1X3sYqv7wBpbvsJb/eUNops5mzlyb5UdI0
A2EPCSBsZWAIAkqN+jYcHrZNbb4y1VhIcjtuNQJrDWxXbQYVPEcHQcTOTACZvSZn
GeVes3mC/k11iO6+qqRxLg1QoStTfH+AnqVVUlZw4Ma4CzMWr3ECPS4T24daMvxo
o1abORW+5pqSdDGkTB0qHdcooGqwU1zLi2QqPHxxkwcdUgnZ1aXpLyGtwL8rm7nj
kiDD0SJ4CzF4P1Y=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}