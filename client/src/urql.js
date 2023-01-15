import { createClient, defaultExchanges } from "urql";
import { yogaExchange } from "@graphql-yoga/urql-exchange";

export const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    ...defaultExchanges,
    yogaExchange(),
  ],
  // requestPolicy: "network-only",
});
