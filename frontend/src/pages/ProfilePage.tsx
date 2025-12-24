import { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Globe, Camera } from 'lucide-react';
import { DEPARTAMENTOS_PERU, getProvinciasByDepartamento, getDistritosByProvincia } from '../data/ubicacionesPeru';

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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text)]">Mi Perfil Profesional</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[var(--border)]"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-[var(--bg-primary)] rounded-full flex items-center justify-center border-4 border-[var(--border)]">
                                    <User size={64} className="text-[var(--muted)]" />
                                </div>
                            )}
                            <button
                                onClick={handleButtonClick}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
                                title="Cambiar foto"
                            >
                                <Camera size={18} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <h2 className="text-xl font-bold text-[var(--text)]">
                            {profile.nombre && profile.apellido
                                ? `${profile.nombre} ${profile.apellido}`
                                : 'Tu Nombre'}
                        </h2>
                        <p className="text-[var(--primary)] font-medium">
                            {profile.bio ? profile.bio.substring(0, 50) + (profile.bio.length > 50 ? '...' : '') : 'Tu cargo o profesión'}
                        </p>

                        <div className="mt-6 flex justify-center gap-2">
                            <button
                                onClick={handleButtonClick}
                                className="px-4 py-2 bg-[var(--primary)] text-[var(--bg-soft)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Cambiar Foto
                            </button>
                        </div>
                    </div>

                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-[var(--muted)]">
                            <MapPin size={18} />
                            <span className="text-sm">{getUbicacionTexto()}</span>
                        </div>
                        {profile.paginaWeb && (
                            <div className="flex items-center gap-3 text-[var(--muted)]">
                                <Globe size={18} />
                                <a href={profile.paginaWeb.startsWith('http') ? profile.paginaWeb : `https://${profile.paginaWeb}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:text-[var(--primary)] transition-colors">
                                    {profile.paginaWeb}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-[var(--muted)]">
                            <Phone size={18} />
                            <span className="text-sm">{profile.telefono || 'Sin configurar'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Details Form */}
                <div className="md:col-span-2">
                    <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
                        <h3 className="text-lg font-bold text-[var(--text)] mb-6 border-b border-[var(--border)] pb-2">Información Personal</h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={profile.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        placeholder="Tu nombre"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        value={profile.apellido}
                                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                                        placeholder="Tu apellido"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Teléfono Móvil</label>
                                    <input
                                        type="tel"
                                        value={profile.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        placeholder="+51 999 999 999"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Página Web (opcional)</label>
                                <input
                                    type="text"
                                    value={profile.paginaWeb}
                                    onChange={(e) => handleInputChange('paginaWeb', e.target.value)}
                                    placeholder="www.tupagina.com"
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>

                            {/* Ubicación */}
                            <div className="border-t border-[var(--border)] pt-6">
                                <h4 className="text-md font-bold text-[var(--text)] mb-4">Ubicación</h4>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Departamento</label>
                                        <select
                                            value={profile.departamento}
                                            onChange={(e) => handleDepartamentoChange(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {DEPARTAMENTOS_PERU.map(dep => (
                                                <option key={dep.nombre} value={dep.nombre}>{dep.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Provincia</label>
                                        <select
                                            value={profile.provincia}
                                            onChange={(e) => handleProvinciaChange(e.target.value)}
                                            disabled={!profile.departamento}
                                            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {provincias.map(prov => (
                                                <option key={prov} value={prov}>{prov}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Distrito</label>
                                        {distritos.length > 0 ? (
                                            <select
                                                value={profile.distrito}
                                                onChange={(e) => handleInputChange('distrito', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {distritos.map(dist => (
                                                    <option key={dist} value={dist}>{dist}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={profile.distrito}
                                                onChange={(e) => handleInputChange('distrito', e.target.value)}
                                                placeholder="Tu distrito"
                                                disabled={!profile.provincia}
                                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-50"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Dirección (Barrio, Manzana, Lote)</label>
                                    <input
                                        type="text"
                                        value={profile.direccion}
                                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                                        placeholder="Ej: Urb. Los Jardines, Mz. A, Lt. 15"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Bio Profesional</label>
                                <textarea
                                    rows={4}
                                    value={profile.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder="Cuéntanos sobre ti..."
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                                />
                            </div>

                            <div className="pt-4 flex justify-end items-center gap-4">
                                {saved && (
                                    <span className="text-green-500 text-sm font-medium">✓ Guardado correctamente</span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-[var(--primary)] text-[var(--bg-soft)] rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
