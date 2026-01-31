# 🎌 Anime Discovery App

Una aplicación web moderna para descubrir y explorar anime usando la API de AniList, con un hermoso diseño glassmorphism y temática japonesa.

![Anime Discovery App](https://via.placeholder.com/1200x600/1a1a2e/FFB7C5?text=Anime+Discovery+App)

## ✨ Features

- 🔥 **Trending Anime** - Los anime más populares del momento
- 🔍 **Búsqueda en Tiempo Real** - Encuentra anime con búsqueda instantánea
- ∞ **Infinite Scroll** - Carga automática de más contenido
- 💖 **Sistema de Favoritos** - Guarda tus anime favoritos (localStorage)
- 🎭 **Modales Detallados** - Información completa, trailers y personajes
- 🌸 **Efectos Sakura** - Pétalos flotantes con animación CSS/JS
- 📱 **Responsive** - Optimizado para mobile, tablet y desktop
- 🎨 **Glassmorphism Premium** - Diseño moderno con efectos de vidrio

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript ES6+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom CSS
- **API:** AniList GraphQL API
- **Storage:** localStorage para favoritos
- **Deploy:** Vercel

## 🚀 Demo Live

[Ver Demo](https://anime-app-tu-usuario.vercel.app)

## 📦 Instalación Local
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/anime-app-final.git
cd anime-app-final

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📸 Screenshots

### Home - Trending Anime
![Trending](https://via.placeholder.com/800x600/1a1a2e/FFB7C5?text=Trending+View)

### Modal de Detalles
![Modal](https://via.placeholder.com/800x600/1a1a2e/FFB7C5?text=Anime+Details+Modal)

### Favoritos
![Favorites](https://via.placeholder.com/800x600/1a1a2e/FFB7C5?text=Favorites+Tab)

## 🎨 Paleta de Colores

- **Sakura Pink:** `#FFB7C5`
- **Hanami:** `#FF69B4`
- **Yukata Purple:** `#9370DB`
- **Mizuiro Cyan:** `#00CED1`
- **Dark Background:** `#0f172a`

## 🏗️ Arquitectura
```
src/
├── js/
│   ├── api/
│   │   └── anilist.js           # GraphQL queries
│   ├── components/
│   │   ├── AnimeCard.js         # Componente de tarjeta
│   │   ├── AnimeModal.js        # Modal de detalles
│   │   ├── SearchBar.js         # Barra de búsqueda
│   │   ├── TabNavigation.js     # Sistema de tabs
│   │   ├── SkeletonLoader.js    # Loading states
│   │   ├── ScrollToTop.js       # Botón scroll
│   │   └── SakuraEffect.js      # Pétalos flotantes
│   ├── utils/
│   │   ├── helpers.js           # Funciones auxiliares
│   │   ├── localStorage.js      # Abstracción storage
│   │   └── favoritesManager.js  # Lógica de favoritos
│   └── main.js                  # Entry point
├── styles/
│   └── style.css                # Estilos globales
└── index.html                   # HTML principal
```

## 🔑 Features Técnicas

- **Event Delegation** - Un solo listener global para modals
- **Infinite Scroll** - IntersectionObserver API
- **Debouncing** - Búsqueda optimizada (500ms)
- **localStorage** - Persistencia de favoritos
- **Custom Events** - Sincronización de estado
- **Lazy Loading** - Imágenes con loading="lazy"
- **GPU Acceleration** - Animaciones optimizadas
- **Mobile-First** - Diseño responsive desde mobile

## 📝 To-Do (Future Features)

- [ ] Modo oscuro/claro
- [ ] Filtros por género
- [ ] Ordenar por rating/popularidad
- [ ] Compartir en redes sociales
- [ ] Autenticación con AniList
- [ ] Listas personalizadas

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) - Por la increíble API GraphQL
- [Tailwind CSS](https://tailwindcss.com/) - Por el sistema de utilidades
- [Vite](https://vitejs.dev/) - Por el build tool ultra-rápido

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

---

⭐ Si te gustó este proyecto, dale una estrella en GitHub!