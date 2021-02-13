import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { selectors as authSelectors } from '../ducks/auth'
import { listProducts, selectors as productSelectors } from '../ducks/product'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const ProductPage = ({ t }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [userPlanIds, setUserPlanIds] = useState([])
  const isAuth = useSelector(authSelectors.getIsAuth)
  const products = useSelector(productSelectors.getProducts)

  useEffect(() => dispatch(listProducts()), [])

  useEffect(async () => {
    if (isAuth) {
      const res = await fetch(`${API_HOST}/orders`, { credentials: 'include' })
      const { data } = await res.json()
      let planIds = []
      data.forEach(order => {
        order.order_plans.forEach(orderPlan => {
          planIds.push(orderPlan.plan_id)
        })
      })
      setUserPlanIds(planIds)
    } else {
      setUserPlanIds([])
    }
  }, [isAuth])

  const handleCreateOrder = async (planId) => {
    const res = await fetch(`${API_HOST}/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId })
    })
    if (res.status === 200) {
      router.push('/me/subscription')
    } else {
      const { detail } = await res.json()
      alert(detail)
    }
  }

  return (
    <AppLayout title={t('product.title')}>
      <h2 className="text-center">{t('product.title')}</h2>
      <Container style={{ marginTop: 20 }}>
        {products.map(product => (
          <React.Fragment key={product.id}>
            <h3>{t(`productMap.${product.code}.title`)}</h3>
            <Row>
              {product.plans.map(plan => {
                const isOrderExist = userPlanIds.includes(plan.id)
                return (
                  <Col
                    key={plan.id}
                    style={{ border: '1px solid #ddd', borderRadius: 5, padding: 15 }}
                  >
                    <h4>{t(`productMap.${product.code}.plan.${plan.code}.title`)}</h4>
                    <p>{t(`productMap.${product.code}.plan.${plan.code}.description`)}</p>
                    <p>
                      <strong>
                        {t(`productMap.${product.code}.plan.${plan.code}.pricing`)}
                      </strong>
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={!isAuth || isOrderExist}
                      onClick={() => handleCreateOrder(plan.id)}
                    >
                      {isAuth && !isOrderExist && t('product.cta.default')}
                      {!isAuth && t('product.cta.loginRequired')}
                      {isOrderExist && t('product.cta.purchased')}
                    </Button>
                  </Col>
                )
              })}
            </Row>
          </React.Fragment>
        ))}
      </Container>
    </AppLayout>
  )
}

ProductPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ProductPage)
