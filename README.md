# Reproductor de Video Avanzado

## Descripción

Reproductor de video avanzado tipo YouTube con las siguientes características:

### ✨ Características Principales

- **🎬 Interfaz tipo YouTube**: Layout profesional con panel de secciones lateral
- **📑 Panel de Secciones Interactivo**: Navegación rápida a través de capítulos/secciones del video
- **🎯 Barra de Progreso Inteligente**: Marcadores visuales que muestran las secciones **sin superponerse** (estilo YouTube)
- **🔄 Secciones Secuenciales**: Cada sección ocupa su propio espacio en la línea de tiempo, sin overlaps
- **✂️ Sistema de Cortes**: Salta automáticamente las secciones no deseadas (cuts)
- **🏷️ Etiquetas/Tags**: Visualiza y navega por diferentes secciones temáticas que cubren todo el video
- **🎮 Controles Completos**: Botones visuales + atajos de teclado para todas las operaciones
- **⏱️ Tiempo Virtual**: Sistema de tiempo que excluye los cortes para una experiencia fluida
- **✅ Validación de Secciones**: Sistema automático que detecta superposiciones en los tags

### ⌨️ Atajos de Teclado

#### Controles Básicos
- **Espacio**: Reproducir/Pausar

#### Navegación por Tiempo
- **Flecha Derecha (→)**: Adelantar 15 segundos
- **Flecha Izquierda (←)**: Retroceder 15 segundos
- **L**: Adelantar 10 segundos
- **J**: Retroceder 10 segundos

#### Navegación por Secciones
- **Shift + Flecha Derecha**: Siguiente sección
- **Shift + Flecha Izquierda**: Sección anterior
- **M** o **.**: Siguiente sección
- **N** o **,**: Sección anterior

### 🎮 Controles Visuales

El reproductor incluye botones para:
- ⏮ Ir a sección anterior
- -15s / +15s para adelantar/retroceder
- ⏭ Ir a siguiente sección
- ▶/⏸ Reproducir/Pausar

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
