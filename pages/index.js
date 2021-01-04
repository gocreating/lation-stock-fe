import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const HomePage = ({ t }) => {
  const [pushContents, setPushContents] = useState([])
  useEffect(async () => {
    const res = await fetch('https://stock-api.lation.app:5555/ptt/latest-push-contents')
    const _pushContents = await res.json()
    setPushContents(_pushContents)
  }, [])
  return (
    <AppLayout title={t('home.title')} titleSuffix={false} noContainer>
      <Jumbotron>
        <Container>
          <p>{t('home.description')}</p>
        </Container>
      </Jumbotron>
      <Container>
        <h1>今日關鍵字</h1>
        <p>
          {pushContents.map((pushContent, i) => (
            <Badge pill variant="light" key={`${i}-${pushContent}`}>
              {pushContent}
            </Badge>
          ))}
        </p>
      </Container>
    </AppLayout>
  )
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(HomePage)
