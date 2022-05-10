import '../styles/globals.css'
import '../styles/styles.css'
import type { AppProps } from 'next/app'

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
