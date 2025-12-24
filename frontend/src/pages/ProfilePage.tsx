import { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Globe, Camera } from 'lucide-react';
import { DEPARTAMENTOS_PERU, getProvinciasByDepartamento, getDistritosByProvincia } from '../data/ubicacionesPeru';
import { getProfile, updateProfile, UserProfile as ApiUserProfile } from '../modules/auth/api';
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
    socialLinks?: Record<string, string>;
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
    paginaWeb: ''
};

export function ProfilePage() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [provincias, setProvincias] = useState<string[]>([]);
    const [distritos, setDistritos] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                alert('Por favor selecciona un archivo de imagen válido');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe superar los 5MB');
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
        setTimeout(() => setSaved(false), 3000);
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

            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6 pb-2 items-start">
                {/* Left Column: Avatar & Quick Info (Compact) - Span 3 */}
                <div className="md:col-span-3 flex flex-col gap-4 h-full md:h-auto">
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

                    {/* New: Social Networks Card (Visual Only for now) */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <h3 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                            <span>🌐</span> Redes Sociales
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer group">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text)]">LinkedIn</p>
                                    <p className="text-xs text-[var(--muted)] truncate">Conectar perfil</p>
                                </div>
                                <span className="text-[var(--primary)] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Conectar</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer group">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text)]">GitHub</p>
                                    <p className="text-xs text-[var(--muted)] truncate">@usuario</p>
                                </div>
                                <span className="text-[var(--primary)] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
                            </div>
                        </div>
                    </div>

                    {/* New: Security Card */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-3">
                        <h3 className="font-bold text-[var(--text)] text-sm flex items-center gap-2">
                            <span>🔒</span> Seguridad
                        </h3>
                        <button className="w-full py-2 px-3 bg-[var(--bg-primary)] hover:bg-[var(--border)] text-[var(--text)] rounded-lg text-sm font-medium transition-colors text-left flex justify-between items-center group">
                            <span>Cambiar Contraseña</span>
                            <span className="text-[var(--muted)] group-hover:text-[var(--text)]">→</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Edit Details Form (Span 9) */}
                <div className="md:col-span-9 bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm flex flex-col overflow-hidden h-full">
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Datos Personales</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Nombre</label>
                                        <input
                                            type="text"
                                            value={profile.nombre}
                                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Apellido</label>
                                        <input
                                            type="text"
                                            value={profile.apellido}
                                            onChange={(e) => handleInputChange('apellido', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Teléfono</label>
                                        <input
                                            type="tel"
                                            value={profile.telefono}
                                            onChange={(e) => handleInputChange('telefono', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Sitio Web</label>
                                        <input
                                            type="text"
                                            placeholder="ej. misitio.com"
                                            value={profile.paginaWeb}
                                            onChange={(e) => handleInputChange('paginaWeb', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                                        />
                                    </div>
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
            </div>
        </div>
    );
}
