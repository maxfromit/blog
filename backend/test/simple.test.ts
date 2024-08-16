import { beforeAll, describe, expect, test } from 'vitest'
import { apollo, gql } from './_lib/apollo'

describe('Flow', () => {
  let postIdWithHiddenAtNull: string
  let postIdWithHiddenAtNotNull: string
  const userId1 = 'f38cc2ce-d100-459c-8859-4df77551b723'
  const userId2 = '81f9ea29-c8c4-4e13-b034-c66d991ad79b'

  beforeAll(async () => {
    // Insert post with hidden_at null
    const result1 = await apollo.mutate({
      mutation: gql`
        mutation InsertPostWithHiddenAtNull(
          $userId: uuid!
          $title: String!
          $content: String!
        ) {
          insert_post_one(
            object: {
              user_id: $userId
              title: $title
              content: $content
              hidden_at: null
            }
          ) {
            id
          }
        }
      `,
      variables: {
        userId: userId1,
        title: 'Visible Post',
        content: 'This post is visible.',
      },
      context: {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      },
    })
    postIdWithHiddenAtNull = result1.data.insert_post_one.id

    // Insert post with hidden_at not null
    const result2 = await apollo.mutate({
      mutation: gql`
        mutation InsertPostWithHiddenAtNotNull(
          $userId: uuid!
          $title: String!
          $content: String!
        ) {
          insert_post_one(
            object: {
              user_id: $userId
              title: $title
              content: $content
              hidden_at: "2024-08-16T00:00:00Z"
            }
          ) {
            id
          }
        }
      `,
      variables: {
        userId: userId1,
        title: 'Hidden Post',
        content: 'This post is hidden.',
      },
      context: {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      },
    })
    postIdWithHiddenAtNotNull = result2.data.insert_post_one.id
  })

  describe('Main test', () => {
    test('user can get post with hidden_at null', async () => {
      const result = await apollo.query({
        query: gql`
          query GetPostById($id: uuid!) {
            post_by_pk(id: $id) {
              id
              title
              content
              hidden_at
            }
          }
        `,
        variables: {
          id: postIdWithHiddenAtNull,
        },
        context: {
          headers: {
            'x-hasura-user-id': 'f38cc2ce-d100-459c-8859-4df77551b723',
            'x-hasura-role': 'user',
          },
        },
      })
      expect(result.data.post_by_pk).toBeDefined()
      expect(result.data.post_by_pk.hidden_at).toBeNull()
    })

    test('user cannot get post with hidden_at not null', async () => {
      const result = await apollo.query({
        query: gql`
          query GetPostById($id: uuid!) {
            post_by_pk(id: $id) {
              id
              title
              content
              hidden_at
            }
          }
        `,
        variables: {
          id: postIdWithHiddenAtNotNull,
        },
        context: {
          headers: {
            'x-hasura-user-id': 'f38cc2ce-d100-459c-8859-4df77551b723',
            'x-hasura-role': 'user',
          },
        },
      })
      expect(result.data.post_by_pk).toBeNull()
    })

    test('adds a post with the same user_id as X-HASURA-USER-ID', async () => {
      const userId = userId1
      const result = await apollo.mutate({
        mutation: gql`
          mutation AddPost($userId: uuid!, $title: String!, $content: String!) {
            insert_post_one(
              object: { user_id: $userId, title: $title, content: $content }
            ) {
              id
              title
              content
              user_id
            }
          }
        `,
        variables: {
          userId,
          title: 'Test Post',
          content: 'This is a test post.',
        },
        context: {
          headers: {
            'x-hasura-user-id': userId,
            'x-hasura-role': 'user',
          },
        },
      })
      expect(result.data.insert_post_one).toBeDefined()
      expect(result.data.insert_post_one.user_id).toBe(userId)
    })

    test('fails to add a post with different user_id and X-HASURA-USER-ID', async () => {
      const postUserId = userId1
      const hasuraUserId = userId2
      try {
        await apollo.mutate({
          mutation: gql`
            mutation AddPost(
              $userId: uuid!
              $title: String!
              $content: String!
            ) {
              insert_post_one(
                object: { user_id: $userId, title: $title, content: $content }
              ) {
                id
                title
                content
                user_id
              }
            }
          `,
          variables: {
            userId: postUserId,
            title: 'Test Post with Different User ID',
            content: 'This is a test post with a different user ID.',
          },
          context: {
            headers: {
              'x-hasura-user-id': hasuraUserId,
              'x-hasura-role': 'user',
            },
          },
        })
        // If the mutation does not throw an error, fail the test
        throw new Error('Expected mutation to fail, but it succeeded')
      } catch (error) {
        // Check if the error message matches the expected permission error
        expect(error.message).toContain(
          'check constraint of an insert/update permission has failed',
        )
      }
    })
  })
})
