import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
// import { RolesPage } from './pages/RolesPage'; // Deprecated
import { UsersPage } from './modules/iam/pages/UsersPage'; // Modular Version
import { OrganizationsPage } from './modules/organizations/pages/OrganizationsPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
<<<<<<< HEAD
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BillingPage } from './pages/BillingPage';
import { CreateInvoicePage } from './pages/CreateInvoicePage';

import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/*"
                        element={
=======
import { TrashPage } from './modules/trash/pages/TrashPage';

import { RequireAuth } from './components/RequireAuth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/*"
                    element={
                        <RequireAuth>
>>>>>>> origin/master
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<DashboardPage />} />
                                    {/* <Route path="/roles" element={<RolesPage />} /> */}
                                    <Route path="/users" element={<UsersPage />} />
                                    <Route path="/organizations" element={<OrganizationsPage />} />
<<<<<<< HEAD

                                    {/* New Functional Routes */}
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/settings/general" element={<SettingsPage />} />
                                    <Route path="/settings/billing" element={<BillingPage />} />
                                    <Route path="/settings/orgs" element={<OrganizationsPage />} />
                                    <Route path="/invoices/new" element={<CreateInvoicePage />} />
                                </Routes>
                            </Layout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
=======
                                    <Route path="/trash" element={<TrashPage />} />
                                </Routes>
                            </Layout>
                        </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
>>>>>>> origin/master
    );
}

export default App;
