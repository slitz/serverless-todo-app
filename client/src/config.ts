// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'dev-0ulofz36'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-0ulofz36.auth0.com',            // Auth0 domain
  clientId: 'HamYBPjra83WG5s8697zCq46Abd0LIF3',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
