import Head from 'next/head'
import Container from 'react-bootstrap/Container'
import { Trans } from 'react-i18next'
import { FacebookMessengerHeader, FacebookMessengerChatPlugin } from './FacebookMessenger'
import { GoogleAnalyticsHeader } from './GoogleAnalytics'
import { GoogleAdSenseAdUnit } from '../components/GoogleAdSense'
import Navigation from './Navigation'
import { withTranslation } from '../i18n'
import { adUnitIdMap } from '../utils/config'
import 'bootstrap/dist/css/bootstrap.min.css'

const AppLayout = ({ t, title, titleSuffix, children }) => {
  titleSuffix = titleSuffix === false ? '' : t('site.titleSuffix')
  return (
    <>
      <Head>
        <title>{`${title}${titleSuffix}`}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <GoogleAnalyticsHeader />
      <FacebookMessengerHeader />
      <Navigation />
      <Container>
        {children}
      </Container>
      <Container style={{ marginTop: '2rem', overflow: 'auto' }}>
        <GoogleAdSenseAdUnit adUnitId={adUnitIdMap.adunit_stock_banner} />
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        <hr />
        <p className="text-center text-secondary text-nowrap">
          <Trans
            t={t}
            i18nKey="footer.poweredBy"
            components={{
              brand: (
                <a
                  className="text-secondary"
                  href="https://lation.app/"
                  target="_blank"
                />
              ),
            }}
          />
        </p>
      </Container>
      <FacebookMessengerChatPlugin />
    </>
  )
}

AppLayout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(AppLayout)