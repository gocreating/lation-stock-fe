import Link from 'next/link'
import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'
import { API_HOST } from '../../utils/config'

const ProfilePage = ({ t }) => {
  return (
    <AppLayout title={t('me.profile.title')}>
      <Link href={`${API_HOST}/auth/line/aggressive-bot-prompt`}>加入 Line 官方帳號好友以接收通知</Link>
    </AppLayout>
  )
}

ProfilePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ProfilePage)
