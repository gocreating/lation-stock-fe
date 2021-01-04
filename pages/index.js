import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const HomePage = ({ t }) => {
  return (
    <AppLayout title={t('home.title')} titleSuffix={false}>
      <p>{t('home.description')}</p>
    </AppLayout>
  )
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(HomePage)
