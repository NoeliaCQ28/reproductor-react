# Reproductor de Video Avanzado

## Descripción

Reproductor de video avanzado tipo YouTube con las siguientes características:

### ✨ Características Principales

- **🎬 Interfaz tipo YouTube**: Layout profesional con panel de secciones lateral
- **📑 Panel de Secciones Interactivo**: Navegación rápida a través de capítulos/secciones del video
- **🎯 Barra de Progreso Inteligente**: Marcadores visuales que muestran las secciones sin superponerse
- **✂️ Sistema de Cortes**: Salta automáticamente las secciones no deseadas (cuts)
- **🏷️ Etiquetas/Tags**: Visualiza y navega por diferentes secciones temáticas
- **⌨️ Atajos de Teclado**: Control completo mediante teclado
  - `Espacio`: Reproducir/Pausar
  - `Flecha Derecha`: Siguiente punto de interés
  - `Flecha Izquierda`: Punto de interés anterior
- **⏱️ Tiempo Virtual**: Sistema de tiempo que excluye los cortes para una experiencia fluida

### 🏗️ Arquitectura

El proyecto sigue una arquitectura limpia con separación de responsabilidades:

- **Domain Layer** (`src/domain/`): Lógica de negocio pura para cálculos de tiempo
- **Context** (`src/context/`): Gestión de estado global con React Context + Reducer
- **Components** (`src/components/`): Componentes UI reutilizables

### 📦 Componentes

- `VideoPlayer`: Reproductor de video principal
- `CustomProgressBar`: Barra de progreso con marcadores de secciones
- `Controls`: Controles de reproducción
- `ChapterPanel`: Panel lateral con lista de secciones
- `VideoContext`: Proveedor de contexto global

### 🎨 Diseño

El diseño sigue los principios de YouTube:
- Tema oscuro (#0f0f0f, #181818)
- Layout responsivo con columnas flexibles
- Feedback visual en interacciones
- Marcadores de color en secciones activas

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Tecnologías

- React + Vite
- JavaScript ES6+
- React Context + Reducer
- CSS-in-JS (inline styles)
