import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { InventoryProvider } from './modules/inventory/context/InventoryContext';
import { ClientsProvider } from './modules/clients/context/ClientsContext';
import { SuppliersProvider } from './modules/suppliers/context/SuppliersContext';
import { BillingProvider } from './modules/billing/context/BillingContext';

// Lazy-loaded pages for better initial bundle size
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('./modules/iam/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const OrganizationsPage = lazy(() => import('./modules/organizations/pages/OrganizationsPage').then(m => ({ default: m.OrganizationsPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('./modules/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./modules/auth/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./modules/auth/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const TrashPage = lazy(() => import('./modules/trash/pages/TrashPage').then(m => ({ default: m.TrashPage })));
const ConstructionPage = lazy(() => import('./pages/ConstructionPage').then(m => ({ default: m.ConstructionPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BillingPage = lazy(() => import('./pages/BillingPage').then(m => ({ default: m.BillingPage })));
const PricingPage = lazy(() => import('./modules/subscriptions/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const OrganizationSettingsPage = lazy(() => import('./modules/organizations/pages/OrganizationSettingsPage').then(m => ({ default: m.OrganizationSettingsPage })));
const TransactionsPage = lazy(() => import('./modules/transactions/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const SalesPOSPage = lazy(() => import('./modules/sales/pages/SalesPOSPage').then(m => ({ default: m.SalesPOSPage })));
const ClientCreatePage = lazy(() => import('./modules/clients/pages/ClientCreatePage').then(m => ({ default: m.ClientCreatePage })));
const ProductsPage = lazy(() => import('./modules/inventory/pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ReportsPage = lazy(() => import('./modules/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const InventoryReportPage = lazy(() => import('./modules/reports/pages/InventoryReportPage').then(m => ({ default: m.InventoryReportPage })));
const FinanceReportPage = lazy(() => import('./modules/reports/pages/FinanceReportPage').then(m => ({ default: m.FinanceReportPage })));
const FrequentClientsReportPage = lazy(() => import('./modules/reports/pages/FrequentClientsReportPage').then(m => ({ default: m.FrequentClientsReportPage })));
const ClientsListPage = lazy(() => import('./modules/clients/pages/ClientsListPage').then(m => ({ default: m.ClientsListPage })));
const ClientHistoryPage = lazy(() => import('./modules/clients/pages/ClientHistoryPage').then(m => ({ default: m.ClientHistoryPage })));
const SalesHistoryPage = lazy(() => import('./modules/sales/pages/SalesHistoryPage').then(m => ({ default: m.SalesHistoryPage })));
const ReturnsPage = lazy(() => import('./modules/sales/pages/ReturnsPage').then(m => ({ default: m.ReturnsPage })));
const CategoriesPage = lazy(() => import('./modules/inventory/pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const StockAdjustmentsPage = lazy(() => import('./modules/inventory/pages/StockAdjustmentsPage').then(m => ({ default: m.StockAdjustmentsPage })));
const StockAlertsPage = lazy(() => import('./modules/inventory/pages/StockAlertsPage').then(m => ({ default: m.StockAlertsPage })));
const SuppliersListPage = lazy(() => import('./modules/suppliers/pages/SuppliersListPage').then(m => ({ default: m.SuppliersListPage })));
const SupplierCreatePage = lazy(() => import('./modules/suppliers/pages/SupplierCreatePage').then(m => ({ default: m.SupplierCreatePage })));
const InvoicesPage = lazy(() => import('./modules/billing/pages/InvoicesPage').then(m => ({ default: m.InvoicesPage })));
const SunatConfigPage = lazy(() => import('./modules/billing/pages/SunatConfigPage').then(m => ({ default: m.SunatConfigPage })));
const BillingHistoryPage = lazy(() => import('./modules/billing/pages/BillingHistoryPage').then(m => ({ default: m.BillingHistoryPage })));
const PaymentMethodsPage = lazy(() => import('./modules/billing/pages/PaymentMethodsPage').then(m => ({ default: m.PaymentMethodsPage })));
const AuditLogsPage = lazy(() => import('./modules/audit/pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));

// Loading spinner component
const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <InventoryProvider>
                    <ClientsProvider>
                        <SuppliersProvider>
                            <BillingProvider>
                                <BrowserRouter>
                                    <Suspense fallback={<PageLoader />}>
                                        <Routes>
                                            <Route path="/login" element={<LoginPage />} />
                                            <Route path="/register" element={<RegisterPage />} />
                                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                                            <Route path="/verify-email" element={<VerifyEmailPage />} />
                                            <Route
                                                path="/*"
                                                element={
                                                    <RequireAuth>
                                                        <SocketProvider>
                                                            <Layout>
                                                                <Suspense fallback={<PageLoader />}>
                                                                    <Routes>
                                                                        <Route path="/" element={<DashboardPage />} />
                                                                        {/* Sales Routes */}
                                                                        <Route path="/sales/pos" element={<SalesPOSPage />} />
                                                                        <Route path="/sales/history" element={<SalesHistoryPage />} />
                                                                        <Route path="/sales/returns" element={<ReturnsPage />} />
                                                                        <Route path="/sales/*" element={<ConstructionPage title="Ventas" />} />

                                                                        {/* Inventory Routes */}
                                                                        <Route path="/inventory/products" element={<ProductsPage />} />
                                                                        <Route path="/inventory/categories" element={<CategoriesPage />} />
                                                                        <Route path="/inventory/adjustments" element={<StockAdjustmentsPage />} />
                                                                        <Route path="/inventory/alerts" element={<StockAlertsPage />} />
                                                                        <Route path="/inventory/*" element={<ConstructionPage title="Gestión de Inventario" />} />

                                                                        {/* Clients Routes */}
                                                                        <Route path="/clients/new" element={<ClientCreatePage />} />
                                                                        <Route path="/clients/history" element={<ClientHistoryPage />} />
                                                                        <Route path="/clients" element={<ClientsListPage />} />

                                                                        {/* Suppliers Routes */}
                                                                        <Route path="/suppliers/new" element={<SupplierCreatePage />} />
                                                                        <Route path="/suppliers" element={<SuppliersListPage />} />
                                                                        <Route path="/suppliers/*" element={<ConstructionPage title="Proveedores" />} />

                                                                        {/* Reports Routes */}
                                                                        <Route path="/reports/sales" element={<ReportsPage />} />
                                                                        <Route path="/reports/inventory" element={<InventoryReportPage />} />
                                                                        <Route path="/reports/finance" element={<FinanceReportPage />} />
                                                                        <Route path="/reports/clients" element={<FrequentClientsReportPage />} />
                                                                        <Route path="/reports/*" element={<ConstructionPage title="Reportes y Analíticas" />} />

                                                                        {/* Billing Routes */}
                                                                        <Route path="/billing/invoices" element={<InvoicesPage />} />
                                                                        <Route path="/billing/config" element={<SunatConfigPage />} />
                                                                        <Route path="/billing/history" element={<BillingHistoryPage />} />
                                                                        <Route path="/billing/*" element={<BillingPage />} />

                                                                        {/* Settings Routes */}
                                                                        <Route path="/settings/general" element={<SettingsPage />} />
                                                                        <Route path="/settings/organization" element={<OrganizationSettingsPage />} />
                                                                        <Route path="/settings/billing" element={<BillingPage />} />
                                                                        <Route path="/settings/payments" element={<PaymentMethodsPage />} />
                                                                        <Route path="/settings/*" element={<ConstructionPage title="Configuración" />} />

                                                                        {/* Legacy/Existing Routes */}
                                                                        <Route path="/organizations" element={<OrganizationsPage />} />
                                                                        <Route path="/users" element={<UsersPage />} />
                                                                        <Route path="/profile" element={<ProfilePage />} />
                                                                        <Route path="/transactions" element={<TransactionsPage />} />
                                                                        <Route path="/pricing" element={<PricingPage />} />
                                                                        <Route path="/trash" element={<TrashPage />} />
                                                                        <Route path="/audit" element={<AuditLogsPage />} />
                                                                        <Route path="*" element={<Navigate to="/" replace />} />
                                                                    </Routes>
                                                                </Suspense>
                                                            </Layout>
                                                        </SocketProvider>
                                                    </RequireAuth>
                                                }
                                            />
                                        </Routes>
                                    </Suspense>
                                </BrowserRouter>
                            </BillingProvider>
                        </SuppliersProvider>
                    </ClientsProvider>
                </InventoryProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
