import { useEffect, useState, useRef, useReducer, createContext, useContext } from "react"

const context = createContext()

export function useQueryClient() {
  const queryClient = useContext(context)

  if (!queryClient) {
    throw new Error("No QueryClient")
  }

  return queryClient
}

export function QueryClientProvider({ client, children }) {
  return <context.Provider value={client}>{children}</context.Provider>
}

export class QueryClient {
  constructor() {
    this.queries = []
  }

  getQuery = ({ queryKey, queryFn, staleTime }) => {
    const queryHash = JSON.stringify(queryKey)
    let query = this.queries.find((query) => query.queryHash === queryHash)

    if (!query) {
      query = createQuery({ queryKey, queryFn, staleTime })
      this.queries.push(query)
    }

    return query
  }
}

export function useQuery({ queryKey, queryFn, staleTime }) {
  const client = useQueryClient()
  const [, rerender] = useReducer((v) => v + 1, 0)

  const observerRef = useRef()

  if (!observerRef.current) {
    observerRef.current = createQueryObserver(client, {
      queryKey,
      queryFn,
      staleTime,
    })
  }

  useEffect(() => {
    return observerRef.current.subscribe(rerender)
  }, [])

  return observerRef.current.getResult()
}

function createQuery({ queryKey, queryFn }) {
  const query = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
    promise: null,
    subscribers: [],
    gcTimeout: null,
    state: {
      lastUpdated: null,
      status: "loading",
      data: undefined,
      error: undefined,
    },
    setState: (updaterFn) => {
      query.state = updaterFn(query.state)
      query.subscribers.forEach((subscriber) => subscriber.notify())
    },
    subscribe: (subscriber) => {
      query.subscribers.push(subscriber)

      return () => {
        query.subscribers = query.subscribers.filter((v) => v !== subscriber)
      }
    },
    fetch: () => {
      if (!query.promise) {
        query.promise = (async () => {
          query.setState((oldState) => ({
            ...oldState,
            error: undefined,
          }))

          try {
            const data = await queryFn({ queryKey })

            query.setState((oldState) => ({
              ...oldState,
              status: "success",
              lastUpdated: Date.now(),
              data,
            }))
          } catch (error) {
            query.setState((oldState) => ({
              ...oldState,
              status: "error",
              error,
            }))
          } finally {
            query.promise = null
          }
        })()
      }

      return query.promise
    },
  }

  return query
}

function createQueryObserver(client, { queryKey, queryFn, staleTime = 0 }) {
  const query = client.getQuery({ queryKey, queryFn, staleTime })

  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (callback) => {
      observer.notify = callback
      const unsubscribe = query.subscribe(observer)

      observer.fetch()

      return unsubscribe
    },
    fetch: () => {
      if (!query.state.lastUpdated || Date.now() - query.state.lastUpdated > staleTime) {
        query.fetch()
      }
    },
  }

  return observer
}
