import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
// import { RolesPage } from './pages/RolesPage'; // Deprecated
import { UsersPage } from './modules/iam/pages/UsersPage'; // Modular Version
import { OrganizationsPage } from './modules/organizations/pages/OrganizationsPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { TrashPage } from './modules/trash/pages/TrashPage';
import { ConstructionPage } from './pages/ConstructionPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BillingPage } from './pages/BillingPage';
// import { CreateInvoicePage } from './pages/CreateInvoicePage';
import { PricingPage } from './modules/subscriptions/pages/PricingPage';
import { RequireAuth } from './components/RequireAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { OrganizationSettingsPage } from './modules/organizations/pages/OrganizationSettingsPage';
import { TransactionsPage } from './modules/transactions/pages/TransactionsPage';
import { SocketProvider } from './context/SocketContext';
import { SalesPOSPage } from './modules/sales/pages/SalesPOSPage';
import { ClientCreatePage } from './modules/clients/pages/ClientCreatePage';
import { ProductsPage } from './modules/inventory/pages/ProductsPage';
import { ReportsPage } from './modules/reports/pages/ReportsPage';
import { InventoryReportPage } from './modules/reports/pages/InventoryReportPage';
import { FinanceReportPage } from './modules/reports/pages/FinanceReportPage';
import { FrequentClientsReportPage } from './modules/reports/pages/FrequentClientsReportPage';
import { ClientsListPage } from './modules/clients/pages/ClientsListPage';
import { ClientHistoryPage } from './modules/clients/pages/ClientHistoryPage';
import { SalesHistoryPage } from './modules/sales/pages/SalesHistoryPage';
import { ReturnsPage } from './modules/sales/pages/ReturnsPage';
import { InventoryProvider } from './modules/inventory/context/InventoryContext';
import { ClientsProvider } from './modules/clients/context/ClientsContext';
import { CategoriesPage } from './modules/inventory/pages/CategoriesPage';
import { StockAdjustmentsPage } from './modules/inventory/pages/StockAdjustmentsPage';
import { StockAlertsPage } from './modules/inventory/pages/StockAlertsPage';
import { SuppliersProvider } from './modules/suppliers/context/SuppliersContext';
import { SuppliersListPage } from './modules/suppliers/pages/SuppliersListPage';
import { SupplierCreatePage } from './modules/suppliers/pages/SupplierCreatePage';
import { BillingProvider } from './modules/billing/context/BillingContext';
import { InvoicesPage } from './modules/billing/pages/InvoicesPage';
import { SunatConfigPage } from './modules/billing/pages/SunatConfigPage';
import { BillingHistoryPage } from './modules/billing/pages/BillingHistoryPage';
import { PaymentMethodsPage } from './modules/billing/pages/PaymentMethodsPage';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <InventoryProvider>
                    <ClientsProvider>
                        <SuppliersProvider>
                            <BillingProvider>
                                <BrowserRouter>
                                    <Routes>
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/register" element={<RegisterPage />} />
                                        <Route
                                            path="/*"
                                            element={
                                                <RequireAuth>
                                                    <SocketProvider>
                                                        <Layout>
                                                            <Routes>
                                                                <Route path="/" element={<DashboardPage />} />
                                                                {/* <Route path="/roles" element={<RolesPage />} /> */}
                                                                {/* New Sidebar Routes */}
                                                                <Route path="/sales/pos" element={<SalesPOSPage />} />
                                                                <Route path="/sales/history" element={<SalesHistoryPage />} />
                                                                <Route path="/sales/returns" element={<ReturnsPage />} />
                                                                <Route path="/sales/*" element={<ConstructionPage title="Ventas" />} />

                                                                <Route path="/inventory/products" element={<ProductsPage />} />
                                                                <Route path="/inventory/categories" element={<CategoriesPage />} />
                                                                <Route path="/inventory/adjustments" element={<StockAdjustmentsPage />} />
                                                                <Route path="/inventory/alerts" element={<StockAlertsPage />} />
                                                                <Route path="/inventory/*" element={<ConstructionPage title="Gestión de Inventario" />} />

                                                                <Route path="/clients/new" element={<ClientCreatePage />} />
                                                                <Route path="/clients/history" element={<ClientHistoryPage />} />
                                                                <Route path="/clients" element={<ClientsListPage />} />

                                                                <Route path="/suppliers/new" element={<SupplierCreatePage />} />
                                                                <Route path="/suppliers" element={<SuppliersListPage />} />
                                                                <Route path="/suppliers/*" element={<ConstructionPage title="Proveedores" />} />

                                                                <Route path="/reports/sales" element={<ReportsPage />} />
                                                                <Route path="/reports/inventory" element={<InventoryReportPage />} />
                                                                <Route path="/reports/finance" element={<FinanceReportPage />} />
                                                                <Route path="/reports/clients" element={<FrequentClientsReportPage />} />
                                                                <Route path="/reports/*" element={<ConstructionPage title="Reportes y Analíticas" />} />
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
                                                                <Route path="*" element={<Navigate to="/" replace />} />
                                                            </Routes>
                                                        </Layout>
                                                    </SocketProvider>
                                                </RequireAuth>
                                            }
                                        />
                                    </Routes>
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
