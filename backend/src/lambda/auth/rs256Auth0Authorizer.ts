import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJA3jF7MYqSy98MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1wMjkwaGtocS5hdXRoMC5jb20wHhcNMTkwNzI3MjEyODMzWhcNMzMw
NDA0MjEyODMzWjAhMR8wHQYDVQQDExZkZXYtcDI5MGhraHEuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3xZabTQXkQTOsRS/L0C52v/v
D87JgLAdzm/iUG7FySkPE7ACbS18nqNI8RfUq2Zx8ox6aKIb5PfQKleSpdiae4kS
73k+PnkUTtmdOVKusTGTMM8SXnPVNxljkL2i4AUbU/FnFuNJJm91m3EaTjKSB7CH
DbegQSYPEWYMRdTcIYl44JP+UDvPL6R+ejxIJRm0KgECdCZFX4eWJh8USOR6kitK
pCZbSSuHPteo7a8bD9r2cZGt0Gsa5v1y8TErUS1gyO8d457k8zpnvIhmMVqz9kYW
3EOVlcjk0ovggHw1egD9WPUw4QsJookMr3XxJqhwCamPKq1sQArL9HzRjxMmtwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRcMgHxbx/cu2AI3blB
6ae6/DEA6zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAMHbsHxA
zw919sTrZ8asjrUhSkKnz6IbRSJ5gJUnXXB/hHmAZeuetFKRmPwm+UWPabKBgPYU
2y33VRwKhwz3xKT/ZMiDEW9iqGIH4T7lz5Kv8mbJlhIovkFpjc//QEUmal4hjWGR
f09Twyvafm7y7DwC1mU55stvM8tYK3du+0fILrVTiEHHNnyBjvClLpWM4ChlobWb
CBMg8eqtMAF1WLhS63+SqnMzpHt92bleC4JdvcCAQLbj5yFxxi+wOjEJe2Z0cUlw
0qfnCdLhUa437fjllbsE1cGoe+/tF5CoEZAHBc5mLOCwe+4iPweMs9c7J1KV5f6X
o/MHp8U/5wbJoEs=
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