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
// import { BillingPage } from './pages/BillingPage';
// import { CreateInvoicePage } from './pages/CreateInvoicePage';
import { PricingPage } from './modules/subscriptions/pages/PricingPage';
import { RequireAuth } from './components/RequireAuth';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/*"
                            element={
                                <RequireAuth>
                                    <Layout>
                                        <Routes>
                                            <Route path="/" element={<DashboardPage />} />
                                            {/* <Route path="/roles" element={<RolesPage />} /> */}
                                            {/* New Sidebar Routes */}
                                            <Route path="/sales/*" element={<ConstructionPage title="Ventas & POS" />} />
                                            <Route path="/inventory/*" element={<ConstructionPage title="Gestión de Inventario" />} />
                                            <Route path="/clients/*" element={<ConstructionPage title="Gestión de Clientes" />} />
                                            <Route path="/suppliers/*" element={<ConstructionPage title="Proveedores" />} />
                                            <Route path="/reports/*" element={<ConstructionPage title="Reportes y Analíticas" />} />
                                            <Route path="/billing/*" element={<ConstructionPage title="Facturación Electrónica" />} />

                                            {/* Settings Routes */}
                                            <Route path="/settings/general" element={<SettingsPage />} />
                                            <Route path="/settings/*" element={<ConstructionPage title="Configuración" />} />

                                            {/* Legacy/Existing Routes */}
                                            <Route path="/organizations" element={<OrganizationsPage />} />
                                            <Route path="/users" element={<UsersPage />} />
                                            <Route path="/profile" element={<ProfilePage />} />
                                            <Route path="/pricing" element={<PricingPage />} />
                                            <Route path="/trash" element={<TrashPage />} />
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </Layout>
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
