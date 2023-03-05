import { useEffect, useState, useRef, useReducer, createContext, useContext } from "react"

const context = createContext(null)

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
  constructor() {}
}

export const useQuery = ({ queryKey, queryFn, staleTime }) => {
  return {
    status: "loading",
    data: null,
  }
}
