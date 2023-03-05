import React from "react"

import { fetchWithTimeout } from "../lib/fetch-with-timeout"
import { BackLink, PostComponent, PostLink } from "./ui"

import { QueryClientProvider, useQuery, QueryClient } from "@tanstack/react-query"
// import { useQuery, QueryClient, QueryClientProvider } from "../lib/stub"

const queryClient = new QueryClient()

export function App() {
  const [postId, setPostId] = React.useState()

  return (
    <QueryClientProvider client={queryClient}>
      {postId ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
    </QueryClientProvider>
  )
}

function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetchWithTimeout(
        "https://jsonplaceholder.typicode.com/posts"
      )
      return await response.json()
    },
    staleTime: 3000,
  })
}

function Posts({ setPostId }) {
  const { status, data } = usePosts()

  return (
    <main>
      <h1>Posts</h1>
      <div>
        {status === "loading" && <p>Loading...</p>}
        {status === "success" && (
          <>
            {data?.map((post) => (
              <PostLink key={post.id} onClick={setPostId} {...post} />
            ))}
          </>
        )}
      </div>
    </main>
  )
}

function usePost(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async ({ queryKey }) => {
      const [, postId] = queryKey
      const response = await fetchWithTimeout(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      )
      return await response.json()
    },
  })
}

function Post({ postId, setPostId }) {
  const { status, data } = usePost(postId)

  return (
    <main>
      <BackLink onClick={setPostId} />
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && <PostComponent {...data} />}
    </main>
  )
}
