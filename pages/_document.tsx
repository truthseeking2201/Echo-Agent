import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Echo-Agent: AI-native, Web3-forward trading experience" />
        <meta name="theme-color" content="#050507" />
        {/* We're not importing fonts here anymore as we're using next/font in _app.tsx */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-bg-900 text-white">
        {/* Base layer with cyber-themed grid background */}
        <div className="base-layer"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}