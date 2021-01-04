import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { i18n, withTranslation, Link } from '../i18n'

const Navigation = ({ t }) => {
  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link href="/" passHref>
              <Navbar.Brand>
                <Image
                  src="/logo.png"
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 16,
                  }}
                />
                {t('navbar.title')}
              </Navbar.Brand>
            </Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => i18n.changeLanguage('en')}>English</Nav.Link>
            <Nav.Link onClick={() => i18n.changeLanguage('zh-TW')}>中文</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

Navigation.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Navigation)