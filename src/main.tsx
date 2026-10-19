import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './ErrorBoundary.tsx'
import CustomerApp from './customer/App.tsx'
import StoreDashboardPage from './store/dashboard/page.tsx'
import ProductsPage from './store/products/page.tsx'
import AddProductPage from './store/products/add/page.tsx'
import EditProductPage from './store/products/edit/page.tsx'
import StoreRegisterPage from './store/onboarding/register/page.tsx'
import StoreFabricsSetupPage from './store/onboarding/fabrics/page.tsx'

function AppRouter() {
  const path = window.location.pathname.replace(/\/+$/, '')
  const storePath = '/multife-local/store'

  if (path === `${storePath}/register` || path.endsWith('/store/register')) {
    return <StoreRegisterPage />
  }

  if (path === `${storePath}/fabrics/setup` || path.endsWith('/store/fabrics/setup')) {
    return <StoreFabricsSetupPage />
  }

  if (path === `${storePath}/products/add` || path.endsWith('/store/products/add')) {
    return <AddProductPage />
  }

  if (path === `${storePath}/products/edit` || path.endsWith('/store/products/edit')) {
    return <EditProductPage />
  }

  if (path === `${storePath}/products` || path.endsWith('/store/products')) {
    return <ProductsPage />
  }

  if (path === storePath || path.endsWith('/store')) {
    return <StoreDashboardPage />
  }

  return <CustomerApp />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </StrictMode>,
)
