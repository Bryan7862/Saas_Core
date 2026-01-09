import { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Globe, Camera, X, Eye, EyeOff } from 'lucide-react';
import { DEPARTAMENTOS_PERU, getProvinciasByDepartamento, getDistritosByProvincia } from '../data/ubicacionesPeru';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// Re-declare local interface to match component state, or adapt.
interface UserProfile {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    bio: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    paginaWeb: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNum?: string;
}


const defaultProfile: UserProfile = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    bio: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    paginaWeb: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappNum: '',
};

export function ProfilePage() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [provincias, setProvincias] = useState<string[]>([]);
    const [distritos, setDistritos] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal de cambiar contraseña
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [changingPassword, setChangingPassword] = useState(false);

    // Cargar datos guardados al iniciar
    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }

        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);

            // Cargar provincias si hay departamento guardado
            if (parsed.departamento) {
                const provs = getProvinciasByDepartamento(parsed.departamento);
                setProvincias(provs.map(p => p.nombre));

                // Cargar distritos si hay provincia guardada
                if (parsed.provincia) {
                    const dists = getDistritosByProvincia(parsed.departamento, parsed.provincia);
                    setDistritos(dists);
                }
            }
        }
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor selecciona un archivo de imagen válido');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen no debe superar los 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                localStorage.setItem('profileImage', base64String);
                // Disparar evento para actualizar el sidebar
                window.dispatchEvent(new Event('profileUpdated'));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleDepartamentoChange = (departamento: string) => {
        setProfile(prev => ({ ...prev, departamento, provincia: '', distrito: '' }));
        const provs = getProvinciasByDepartamento(departamento);
        setProvincias(provs.map(p => p.nombre));
        setDistritos([]);
        setSaved(false);
    };

    const handleProvinciaChange = (provincia: string) => {
        setProfile(prev => ({ ...prev, provincia, distrito: '' }));
        const dists = getDistritosByProvincia(profile.departamento, provincia);
        setDistritos(dists);
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        // Disparar evento para actualizar el sidebar
        window.dispatchEvent(new Event('profileUpdated'));
        setSaved(true);
        toast.success('Perfil guardado correctamente');
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChangePassword = async () => {
        if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
            toast.error('Por favor completa todos los campos');
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            toast.error('Las contraseñas nuevas no coinciden');
            return;
        }
        if (passwordData.new.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setChangingPassword(true);
        try {
            await api.patch('/admin/auth/profile', {
                currentPassword: passwordData.current,
                newPassword: passwordData.new,
            });
            toast.success('Contraseña actualizada correctamente');
            setShowPasswordModal(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al cambiar contraseña';
            toast.error(msg);
        } finally {
            setChangingPassword(false);
        }
    };

    // Construir ubicación para mostrar
    const getUbicacionTexto = () => {
        const parts = [];
        if (profile.distrito) parts.push(profile.distrito);
        if (profile.provincia) parts.push(profile.provincia);
        if (profile.departamento) parts.push(profile.departamento);
        return parts.length > 0 ? parts.join(', ') : 'Sin configurar';
    };

    return (
        <div className="h-full flex flex-col gap-4 pr-2 overflow-hidden">
            <div className="flex justify-between items-center mb-2 flex-none">
                <h1 className="text-2xl font-bold text-[var(--text)]">Mi Perfil Profesional</h1>
                {saved && (
                    <span className="text-green-500 text-sm font-medium animate-pulse">✓ Cambios guardados</span>
                )}
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
                {/* Left Column: Avatar & Quick Info - Span 4 */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center relative overflow-hidden group">
                        {/* Decorative Background for Avatar */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[var(--primary)]/10 to-transparent"></div>

                        <div className="relative w-28 h-28 mx-auto mb-3 mt-4">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-[var(--card-bg)] shadow-md"
                                />
                            ) : (
                                <div className="w-28 h-28 bg-[var(--bg-primary)] rounded-full flex items-center justify-center border-4 border-[var(--card-bg)] shadow-md text-[var(--muted)]">
                                    <User size={56} />
                                </div>
                            )}
                            <button
                                onClick={handleButtonClick}
                                className="absolute bottom-1 right-1 w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110"
                                title="Cambiar foto"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <h2 className="text-xl font-bold text-[var(--text)] truncate px-2">
                            {profile.nombre && profile.apellido ? `${profile.nombre} ${profile.apellido}` : 'Tu Nombre'}
                        </h2>
                        <p className="text-[var(--primary)] text-sm font-medium mb-6 truncate px-2">
                            {profile.bio ? profile.bio.substring(0, 30) + (profile.bio.length > 30 ? '...' : '') : 'Profesión / Cargo'}
                        </p>

                        <div className="space-y-3 text-left bg-[var(--bg-primary)]/50 p-4 rounded-xl text-sm border border-[var(--border)]">
                            <div className="flex items-center gap-3 text-[var(--muted)]">
                                <MapPin size={16} className="text-[var(--primary)]" />
                                <span className="truncate flex-1" title={getUbicacionTexto()}>{getUbicacionTexto()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[var(--muted)]">
                                <Phone size={16} className="text-[var(--primary)]" />
                                <span className="truncate flex-1">{profile.telefono || 'Sin teléfono'}</span>
                            </div>
                            {profile.paginaWeb && (
                                <div className="flex items-center gap-3 text-[var(--muted)]">
                                    <Globe size={16} className="text-[var(--primary)]" />
                                    <a
                                        href={profile.paginaWeb.startsWith('http') ? profile.paginaWeb : `https://${profile.paginaWeb}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate flex-1 hover:text-[var(--primary)] hover:underline transition-colors"
                                    >
                                        {profile.paginaWeb}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Networks Card */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <h3 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                            <span>📱</span> Redes del Negocio
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="facebook.com/tunegocio"
                                    value={profile.facebookUrl || ''}
                                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-pink-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="@tunegocio"
                                    value={profile.instagramUrl || ''}
                                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="+51 999 999 999"
                                    value={profile.whatsappNum || ''}
                                    onChange={(e) => handleInputChange('whatsappNum', e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-3">
                        <h3 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                            <span>🔒</span> Seguridad
                        </h3>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full py-2 px-3 bg-[var(--bg-primary)] hover:bg-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium transition-colors text-left flex justify-between items-center group"
                        >
                            <span>Cambiar Contraseña</span>
                            <span className="text-[var(--muted)] group-hover:text-[var(--text)]">→</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Edit Details Form (Span 8) */}
                <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]/30">
                        <h3 className="font-bold text-[var(--text)] flex items-center gap-2">
                            <span>✏️</span> Editar Información
                        </h3>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 shadow-sm transition-all active:scale-95"
                        >
                            Guardar Cambios
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        {/* Personal Data Section */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Datos Personales</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Nombre</label>
                                    <input
                                        type="text"
                                        value={profile.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Apellido</label>
                                    <input
                                        type="text"
                                        value={profile.apellido}
                                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={profile.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Sitio Web</label>
                                    <input
                                        type="text"
                                        placeholder="misitio.com"
                                        value={profile.paginaWeb}
                                        onChange={(e) => handleInputChange('paginaWeb', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Dirección & Bio</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Dpto.</label>
                                    <select
                                        value={profile.departamento}
                                        onChange={(e) => handleDepartamentoChange(e.target.value)}
                                        className="w-full px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    >
                                        <option value="">...</option>
                                        {DEPARTAMENTOS_PERU.map(dep => (
                                            <option key={dep.nombre} value={dep.nombre}>{dep.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Prov.</label>
                                    <select
                                        value={profile.provincia}
                                        onChange={(e) => handleProvinciaChange(e.target.value)}
                                        disabled={!profile.departamento}
                                        className="w-full px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                                    >
                                        <option value="">...</option>
                                        {provincias.map(prov => (
                                            <option key={prov} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Dist.</label>
                                    {distritos.length > 0 ? (
                                        <select
                                            value={profile.distrito}
                                            onChange={(e) => handleInputChange('distrito', e.target.value)}
                                            className="w-full px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                        >
                                            <option value="">...</option>
                                            {distritos.map(dist => (
                                                <option key={dist} value={dist}>{dist}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={profile.distrito}
                                            onChange={(e) => handleInputChange('distrito', e.target.value)}
                                            disabled={!profile.provincia}
                                            className="w-full px-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Dirección / Calle</label>
                                <input
                                    type="text"
                                    value={profile.direccion}
                                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 hover:border-[var(--primary)]/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Bio Profesional</label>
                                <textarea
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-xl w-full max-w-md mx-4">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[var(--text)]">Cambiar Contraseña</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="p-1 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Contraseña Actual</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                                    >
                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Nueva Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                                    >
                                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Confirmar Nueva Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                                    >
                                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-primary)] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={changingPassword}
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {changingPassword ? 'Guardando...' : 'Cambiar Contraseña'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
