// Datos oficiales de departamentos y provincias del Perú
// Fuente: INEI - Instituto Nacional de Estadística e Informática

export interface Provincia {
    nombre: string;
    distritos?: string[];
}

export interface Departamento {
    nombre: string;
    provincias: Provincia[];
}

export const DEPARTAMENTOS_PERU: Departamento[] = [
    {
        nombre: "Amazonas",
        provincias: [
            { nombre: "Chachapoyas" },
            { nombre: "Bagua" },
            { nombre: "Bongará" },
            { nombre: "Condorcanqui" },
            { nombre: "Luya" },
            { nombre: "Rodríguez de Mendoza" },
            { nombre: "Utcubamba" }
        ]
    },
    {
        nombre: "Áncash",
        provincias: [
            { nombre: "Huaraz" },
            { nombre: "Aija" },
            { nombre: "Antonio Raymondi" },
            { nombre: "Asunción" },
            { nombre: "Bolognesi" },
            { nombre: "Carhuaz" },
            { nombre: "Carlos Fermín Fitzcarrald" },
            { nombre: "Casma", distritos: ["Casma", "Buena Vista Alta", "Comandante Noel", "Yaután"] },
            { nombre: "Corongo" },
            { nombre: "Huari" },
            { nombre: "Huarmey" },
            { nombre: "Huaylas" },
            { nombre: "Mariscal Luzuriaga" },
            { nombre: "Ocros" },
            { nombre: "Pallasca" },
            { nombre: "Pomabamba" },
            { nombre: "Recuay" },
            { nombre: "Santa", distritos: ["Chimbote", "Coishco", "Macate", "Moro", "Nepeña", "Samanco", "Santa", "Nuevo Chimbote", "Cáceres del Perú"] },
            { nombre: "Sihuas" },
            { nombre: "Yungay" }
        ]
    },
    {
        nombre: "Apurímac",
        provincias: [
            { nombre: "Abancay" },
            { nombre: "Andahuaylas" },
            { nombre: "Antabamba" },
            { nombre: "Aymaraes" },
            { nombre: "Cotabambas" },
            { nombre: "Chincheros" },
            { nombre: "Grau" }
        ]
    },
    {
        nombre: "Arequipa",
        provincias: [
            { nombre: "Arequipa" },
            { nombre: "Camaná" },
            { nombre: "Caravelí" },
            { nombre: "Castilla" },
            { nombre: "Caylloma" },
            { nombre: "Condesuyos" },
            { nombre: "Islay" },
            { nombre: "La Unión" }
        ]
    },
    {
        nombre: "Ayacucho",
        provincias: [
            { nombre: "Huamanga" },
            { nombre: "Cangallo" },
            { nombre: "Huanca Sancos" },
            { nombre: "Huanta" },
            { nombre: "La Mar" },
            { nombre: "Lucanas" },
            { nombre: "Parinacochas" },
            { nombre: "Páucar del Sara Sara" },
            { nombre: "Sucre" },
            { nombre: "Víctor Fajardo" },
            { nombre: "Vilcas Huamán" }
        ]
    },
    {
        nombre: "Cajamarca",
        provincias: [
            { nombre: "Cajamarca" },
            { nombre: "Cajabamba" },
            { nombre: "Celendín" },
            { nombre: "Chota" },
            { nombre: "Contumazá" },
            { nombre: "Cutervo" },
            { nombre: "Hualgayoc" },
            { nombre: "Jaén" },
            { nombre: "San Ignacio" },
            { nombre: "San Marcos" },
            { nombre: "San Miguel" },
            { nombre: "San Pablo" },
            { nombre: "Santa Cruz" }
        ]
    },
    {
        nombre: "Callao",
        provincias: [
            { nombre: "Callao", distritos: ["Callao", "Bellavista", "Carmen de la Legua Reynoso", "La Perla", "La Punta", "Ventanilla", "Mi Perú"] }
        ]
    },
    {
        nombre: "Cusco",
        provincias: [
            { nombre: "Cusco" },
            { nombre: "Acomayo" },
            { nombre: "Anta" },
            { nombre: "Calca" },
            { nombre: "Canas" },
            { nombre: "Canchis" },
            { nombre: "Chumbivilcas" },
            { nombre: "Espinar" },
            { nombre: "La Convención" },
            { nombre: "Paruro" },
            { nombre: "Paucartambo" },
            { nombre: "Quispicanchi" },
            { nombre: "Urubamba" }
        ]
    },
    {
        nombre: "Huancavelica",
        provincias: [
            { nombre: "Huancavelica" },
            { nombre: "Acobamba" },
            { nombre: "Angaraes" },
            { nombre: "Castrovirreyna" },
            { nombre: "Churcampa" },
            { nombre: "Huaytará" },
            { nombre: "Tayacaja" }
        ]
    },
    {
        nombre: "Huánuco",
        provincias: [
            { nombre: "Huánuco" },
            { nombre: "Ambo" },
            { nombre: "Dos de Mayo" },
            { nombre: "Huacaybamba" },
            { nombre: "Huamalíes" },
            { nombre: "Leoncio Prado" },
            { nombre: "Marañón" },
            { nombre: "Pachitea" },
            { nombre: "Puerto Inca" },
            { nombre: "Lauricocha" },
            { nombre: "Yarowilca" }
        ]
    },
    {
        nombre: "Ica",
        provincias: [
            { nombre: "Ica" },
            { nombre: "Chincha" },
            { nombre: "Nazca" },
            { nombre: "Palpa" },
            { nombre: "Pisco" }
        ]
    },
    {
        nombre: "Junín",
        provincias: [
            { nombre: "Huancayo" },
            { nombre: "Concepción" },
            { nombre: "Chanchamayo" },
            { nombre: "Jauja" },
            { nombre: "Junín" },
            { nombre: "Satipo" },
            { nombre: "Tarma" },
            { nombre: "Yauli" },
            { nombre: "Chupaca" }
        ]
    },
    {
        nombre: "La Libertad",
        provincias: [
            { nombre: "Trujillo" },
            { nombre: "Ascope" },
            { nombre: "Bolívar" },
            { nombre: "Chepén" },
            { nombre: "Julcán" },
            { nombre: "Otuzco" },
            { nombre: "Pacasmayo" },
            { nombre: "Pataz" },
            { nombre: "Sánchez Carrión" },
            { nombre: "Santiago de Chuco" },
            { nombre: "Gran Chimú" },
            { nombre: "Virú" }
        ]
    },
    {
        nombre: "Lambayeque",
        provincias: [
            { nombre: "Chiclayo" },
            { nombre: "Ferreñafe" },
            { nombre: "Lambayeque" }
        ]
    },
    {
        nombre: "Lima",
        provincias: [
            { nombre: "Lima", distritos: ["Lima", "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"] },
            { nombre: "Barranca" },
            { nombre: "Cajatambo" },
            { nombre: "Canta" },
            { nombre: "Cañete" },
            { nombre: "Huaral" },
            { nombre: "Huarochirí" },
            { nombre: "Huaura" },
            { nombre: "Oyón" },
            { nombre: "Yauyos" }
        ]
    },
    {
        nombre: "Loreto",
        provincias: [
            { nombre: "Maynas" },
            { nombre: "Alto Amazonas" },
            { nombre: "Loreto" },
            { nombre: "Mariscal Ramón Castilla" },
            { nombre: "Requena" },
            { nombre: "Ucayali" },
            { nombre: "Datem del Marañón" },
            { nombre: "Putumayo" }
        ]
    },
    {
        nombre: "Madre de Dios",
        provincias: [
            { nombre: "Tambopata" },
            { nombre: "Manu" },
            { nombre: "Tahuamanu" }
        ]
    },
    {
        nombre: "Moquegua",
        provincias: [
            { nombre: "Mariscal Nieto" },
            { nombre: "General Sánchez Cerro" },
            { nombre: "Ilo" }
        ]
    },
    {
        nombre: "Pasco",
        provincias: [
            { nombre: "Pasco" },
            { nombre: "Daniel Alcides Carrión" },
            { nombre: "Oxapampa" }
        ]
    },
    {
        nombre: "Piura",
        provincias: [
            { nombre: "Piura" },
            { nombre: "Ayabaca" },
            { nombre: "Huancabamba" },
            { nombre: "Morropón" },
            { nombre: "Paita" },
            { nombre: "Sullana" },
            { nombre: "Talara" },
            { nombre: "Sechura" }
        ]
    },
    {
        nombre: "Puno",
        provincias: [
            { nombre: "Puno" },
            { nombre: "Azángaro" },
            { nombre: "Carabaya" },
            { nombre: "Chucuito" },
            { nombre: "El Collao" },
            { nombre: "Huancané" },
            { nombre: "Lampa" },
            { nombre: "Melgar" },
            { nombre: "Moho" },
            { nombre: "San Antonio de Putina" },
            { nombre: "San Román" },
            { nombre: "Sandia" },
            { nombre: "Yunguyo" }
        ]
    },
    {
        nombre: "San Martín",
        provincias: [
            { nombre: "Moyobamba" },
            { nombre: "Bellavista" },
            { nombre: "El Dorado" },
            { nombre: "Huallaga" },
            { nombre: "Lamas" },
            { nombre: "Mariscal Cáceres" },
            { nombre: "Picota" },
            { nombre: "Rioja" },
            { nombre: "San Martín" },
            { nombre: "Tocache" }
        ]
    },
    {
        nombre: "Tacna",
        provincias: [
            { nombre: "Tacna" },
            { nombre: "Candarave" },
            { nombre: "Jorge Basadre" },
            { nombre: "Tarata" }
        ]
    },
    {
        nombre: "Tumbes",
        provincias: [
            { nombre: "Tumbes" },
            { nombre: "Contralmirante Villar" },
            { nombre: "Zarumilla" }
        ]
    },
    {
        nombre: "Ucayali",
        provincias: [
            { nombre: "Coronel Portillo" },
            { nombre: "Atalaya" },
            { nombre: "Padre Abad" },
            { nombre: "Purús" }
        ]
    }
];

// Función helper para obtener provincias de un departamento
export function getProvinciasByDepartamento(departamento: string): Provincia[] {
    const dep = DEPARTAMENTOS_PERU.find(d => d.nombre === departamento);
    return dep ? dep.provincias : [];
}

// Función helper para obtener distritos de una provincia en un departamento
export function getDistritosByProvincia(departamento: string, provincia: string): string[] {
    const dep = DEPARTAMENTOS_PERU.find(d => d.nombre === departamento);
    if (!dep) return [];

    const prov = dep.provincias.find(p => p.nombre === provincia);
    return prov?.distritos || [];
}
