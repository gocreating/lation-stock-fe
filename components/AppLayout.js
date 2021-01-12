import { NextSeo, RecipeJsonLd } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import { Trans } from 'react-i18next'
import { FacebookMessengerHeader, FacebookMessengerChatPlugin } from './FacebookMessenger'
import { GoogleAnalyticsHeader } from './GoogleAnalytics'
import { GoogleAdSenseAdUnit } from '../components/GoogleAdSense'
import Navigation from './Navigation'
import { withTranslation } from '../i18n'
import { adUnitIdMap } from '../utils/config'
import 'bootstrap/dist/css/bootstrap.min.css'

export const config = { amp: true }

const AppLayout = ({ t, title, titleSuffix, noContainer, children }) => {
  const router = useRouter()
  titleSuffix = titleSuffix === false ? '' : t('site.titleSuffix')
  return (
    <>
      <Head>
        <title>{`${title}${titleSuffix}`}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <NextSeo
        title={t('site.title')}
        description={t('site.description')}
        languageAlternates={[{
          hrefLang: 'en',
          href: `https://stock.lation.app/en${router.pathname}`,
        }, {
          hrefLang: 'zh-TW',
          href: `https://stock.lation.app/zh-TW${router.pathname}`,
        }]}
      />
      <RecipeJsonLd
        name={t('site.title')}
        description={t('site.description')}
        authorName="Lation"
        ingredients={[]}
        instructions={[]}
        keywords={t('site.keywords')}
      />
      <GoogleAnalyticsHeader />
      <FacebookMessengerHeader />
      <Navigation />
      {noContainer ? children : (
        <Container>
          {children}
        </Container>
      )}
      <Container style={{ marginTop: '2rem', overflow: 'auto' }}>
        <GoogleAdSenseAdUnit adUnitId={adUnitIdMap.adunit_stock_banner} />
      </Container>
      <footer style={{ marginTop: '2rem' }}>
        <Container>
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
      </footer>
      <FacebookMessengerChatPlugin />
    </>
  )
}

AppLayout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(AppLayout)
