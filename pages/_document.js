import Document, { Html, Head, Main, NextScript } from 'next/document'
import { FacebookRoot } from '../components/FacebookMessenger'
import { GoogleAdSenseHeader } from '../components/GoogleAdSense'

class LationDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <GoogleAdSenseHeader />
        <body>
          <FacebookRoot />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LationDocument
