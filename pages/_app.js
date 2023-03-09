import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/franfran20/flexxxxx",
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </MoralisProvider>
  );
}
