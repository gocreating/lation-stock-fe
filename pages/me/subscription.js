import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import { selectors as authSelectors } from '../../ducks/auth'
import { listProducts, selectors as productSelectors } from '../../ducks/product'
import { getLineFriendship, selectors as socialSelectors } from '../../ducks/social'
import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'
import { API_HOST } from '../../utils/config'

const SubscriptionPage = ({ t }) => {
  const dispatch = useDispatch()
  const [orderPlans, setOrderPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [subscribedPlanIds, setSubscribedPlanIds] = useState([])
  const isAuth = useSelector(authSelectors.getIsAuth)
  const isLineFriend = useSelector(socialSelectors.getLineIsFriend)
  const products = useSelector(productSelectors.getProducts)

  useEffect(() => {
    dispatch(listProducts())
    dispatch(getLineFriendship())
  }, [])

  useEffect(async () => {
    if (!isAuth) {
      return
    }
    const res = await fetch(`${API_HOST}/orders`, { credentials: 'include' })
    const { data } = await res.json()
    let orderPlans = []
    data.forEach(order => {
      orderPlans = [...orderPlans, ...order.order_plans]
    })
    setOrderPlans(orderPlans)
  }, [isAuth])

  useEffect(async () => {
    if (!isAuth) {
      return
    }
    const res = await fetch(`${API_HOST}/subscriptions?is_active=true`, { credentials: 'include' })
    const { data } = await res.json()
    let subscribedPlanIds = []
    data.forEach(subscription => {
      subscribedPlanIds = [...subscribedPlanIds, subscription.order_plan.plan_id]
    })
    setSubscriptions(data)
    setSubscribedPlanIds(subscribedPlanIds)
  }, [isAuth])

  const handleSubscriptionChange = async (orderPlan, isChecked) => {
    if (isChecked) {
      const res = await fetch(`${API_HOST}/subscriptions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_plan_id: orderPlan.id })
      })
      if (res.status !== 200) {
        const { detail } = await res.json()
        alert(detail)
      }
      const { data } = await res.json()
      setSubscriptions([...subscriptions, data])
      setSubscribedPlanIds([...subscribedPlanIds, orderPlan.plan_id])
    } else {
      const subscription = subscriptions.find(subscription => subscription.order_plan.id === orderPlan.id)
      const res = await fetch(`${API_HOST}/subscriptions/${subscription.id}/unsubscribe`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.status !== 200) {
        const { detail } = await res.json()
        alert(detail)
      }
      setSubscriptions(subscriptions.filter(s => s.id !== subscription.id))
      setSubscribedPlanIds(subscribedPlanIds.filter(planId => planId !== orderPlan.plan_id))
    }
  }

  return (
    <AppLayout title={t('me.subscription.title')}>
      <h2>{t('me.subscription.title')}</h2>
      {orderPlans.length === 0 ? (
        <p>
          {t('me.subscription.noSubscription')}
        </p>
      ) : (
          <Table responsive disabled>
            <thead>
              <tr>
                <th>{t('me.subscription.table.head.product')}</th>
                <th>{t('me.subscription.table.head.plan')}</th>
                <th>{t('me.subscription.table.head.subscriptionStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {orderPlans.map(orderPlan => {
                const isChecked = subscribedPlanIds.includes(orderPlan.plan_id)
                const planId = orderPlan.plan_id
                let product = {}
                let plan = {}
                products.forEach(iterProduct => {
                  iterProduct.plans.forEach(iterPlan => {
                    if (iterPlan.id === planId) {
                      plan = iterPlan
                      product = iterProduct
                    }
                  })
                })
                return (
                  <tr key={orderPlan.id}>
                    <td>{t(`productMap.${product.code}.title`)}</td>
                    <td>{t(`productMap.${product.code}.plan.${plan.code}.title`)}</td>
                    <td>
                      {isLineFriend ? (
                        <Form.Check
                          type="checkbox"
                          label={isChecked ? t('me.subscription.table.checkbox.label.checked') : t('me.subscription.table.checkbox.label.unchecked')}
                          checked={isChecked}
                          onChange={(e) => handleSubscriptionChange(orderPlan, e.target.checked)}
                        />
                      ) : (
                          <Alert variant="warning">
                            <p>
                              {t('me.subscription.table.alert.description')}
                            </p>
                            <Link as={Button} variant="success" href={`${API_HOST}/auth/line/aggressive-bot-prompt`}>
                              <Button variant="success">
                                <i className="fab fa-line"></i> {t('me.subscription.table.alert.cta')}
                              </Button>
                            </Link>
                          </Alert>
                        )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
    </AppLayout>
  )
}

SubscriptionPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(SubscriptionPage)
