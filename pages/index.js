import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Spinner from 'react-bootstrap/Spinner'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const HomePage = ({ t }) => {
  const [words, setWords] = useState([])
  const [showWordCloud, setShowWordCloud] = useState(false)
  useEffect(async () => {
    const res = await fetch(`${API_HOST}/ptt/latest-push-content-cut-words?board=Stock&search=盤中閒聊`)
    const rawWords = await res.json()
    const wordCount = {}
    rawWords.forEach(rawWord => {
      if (wordCount[rawWord] === undefined) {
        wordCount[rawWord] = 0
      }
      wordCount[rawWord] += 1
    })
    let wordPairs = []
    for (let word in wordCount) {
      wordPairs.push([word, wordCount[word]])
    }
    wordPairs.sort((a, b) => b[1] - a[1])
    setWords(wordPairs.filter(([_, frequency]) => frequency > 2))
    setShowWordCloud(true)
  }, [])
  return (
    <AppLayout title={t('home.title')} titleSuffix={false} noContainer>
      <Jumbotron>
        <Container>
          <p>{t('home.description')}</p>
        </Container>
      </Jumbotron>
      <Container>
        {showWordCloud ? (
          <Image src={`${API_HOST}/static/latest-push-content-cut-words.png`} rounded fluid />
        ) : (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        <p style={{ marginTop: '2rem' }}>
          {words.map((word, i) => (
            <Badge pill variant="light" key={`${i}-${word[0]}`}>
              {`${word[0]} (${word[1]})`}
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
