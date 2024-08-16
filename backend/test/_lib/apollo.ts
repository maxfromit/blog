require('dotenv-expand').expand(
  require('dotenv').config({ path: require('find-config')('.env') }),
)

import {
  gql,
  concat,
  HttpLink,
  ApolloLink,
  ApolloClient,
} from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import fetch from 'cross-fetch'

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT
if (!HASURA_GRAPHQL_ENDPOINT)
  throw new Error('HASURA_GRAPHQL_ADMIN_SECRET is requeried env!')

const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET
if (!HASURA_GRAPHQL_ADMIN_SECRET)
  throw new Error('HASURA_GRAPHQL_ADMIN_SECRET is requeried env!')

function makeClient({ uri, secret }: { uri: string; secret: string }) {
  const httpLink = new HttpLink({
    fetch,
    uri,
  })

  const headersMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'x-hasura-admin-secret': secret,
      },
    }))

    return forward(operation)
  })

  const link = concat(headersMiddleware, httpLink)
  const cache = new InMemoryCache()

  return new ApolloClient({ link, cache })
}

const apollo = makeClient({
  uri: `${HASURA_GRAPHQL_ENDPOINT}/v1/graphql`,
  secret: HASURA_GRAPHQL_ADMIN_SECRET,
})

export { gql, apollo }
