# Testing Documentation - brever.link

Este proyecto utiliza **Vitest** como framework de testing principal, siguiendo las mejores prácticas para testing en aplicaciones Astro con React.

## 📊 Estado General

**Estado actual:** ✅ 213 tests pasando en 14 archivos de test

El proyecto mantiene una cobertura completa de testing que incluye componentes React, servicios de negocio, validación de esquemas, middleware y funciones utilitarias.

## 🚀 Configuración del Entorno de Testing

### Framework Principal

- **[Vitest](https://vitest.dev/)** - Framework de testing moderno y rápido
- **[Testing Library](https://testing-library.com/)** - Utilities para testing de componentes React
- **[jsdom](https://github.com/jsdom/jsdom)** - Entorno DOM simulado para testing

### Herramientas Adicionales

- **[@vitest/ui](https://vitest.dev/guide/ui.html)** - Interfaz web interactiva para ejecutar tests
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Generación de reportes de cobertura
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - Simulación avanzada de interacciones de usuario

### Configuración de Mocks

El proyecto incluye mocks automatizados para las dependencias principales de Astro:

- **astro:db** - Mock completo de operaciones de base de datos
- **astro:actions** - Mock de ActionError y contexto de acciones
- **astro:transitions/client** - Mock de navegación del lado cliente
- **Librerías externas** - QR Code generation, Sonner toasts, etc.

## 📁 Estructura de Testing

### Organización de Archivos

El proyecto utiliza una estructura plana en el directorio `/test` para facilitar la navegación:

```
test/
├── components/          # Tests de componentes React
├── services/           # Tests de lógica de negocio
├── schemas/            # Tests de validación Zod
├── helpers/            # Tests de funciones utilitarias
├── middleware.test.ts  # Tests de middleware de rutas
├── setup.ts           # Configuración global
├── utils.tsx          # Utilidades de testing
└── __mocks__/         # Mocks de dependencias Astro
```

### Categorías de Testing

#### 🧩 [Componentes React](./test/components/)

Cobertura completa de la interfaz de usuario incluyendo:

- Renderizado y props
- Interacciones de usuario
- Validación de formularios
- Accesibilidad (ARIA, keyboard navigation)
- Casos edge y manejo de errores

#### 🔧 [Servicios de Negocio](./test/services/)

Testing de la lógica principal de la aplicación:

- CRUD operations para enlaces
- Lógica de acortamiento de URLs
- Paginación y filtrado
- Manejo de errores y casos edge

#### 📊 [Validación de Esquemas](./test/schemas/)

Testing completo de validación Zod:

- Validación de formularios
- Validación de acciones del servidor
- Esquemas de filtrado
- Casos válidos e inválidos

#### ⚙️ [Funciones Utilitarias](./test/helpers/)

Testing de helpers y funciones de soporte:

- Manipulación de clases CSS
- Extracción de dominios
- Formateo de fechas
- Funciones auxiliares

#### 🔗 [Middleware](./test/middleware.test.ts)

Testing del middleware de routing:

- Extracción de slugs de URL
- Redirección de enlaces
- Incremento de contadores de clicks
- Manejo de URLs malformadas

## 📝 Comandos Disponibles

### Ejecución de Tests

```bash
# Ejecutar tests en modo watch (desarrollo)
pnpm test

# Ejecutar todos los tests una vez
pnpm test:run

# Ejecutar tests con reporte de cobertura
pnpm test:coverage

# Abrir interfaz web de Vitest
pnpm test:ui

# Ejecutar tests en modo watch explícito
pnpm test:watch
```

### Comandos Útiles para Desarrollo

```bash
# Ejecutar test específico
pnpm test nombre-del-archivo

# Ejecutar con más información de debug
pnpm test --reporter=verbose

# Ejecutar sin cobertura (más rápido en desarrollo)
pnpm test --no-coverage
```

## 🎯 Configuración de Cobertura

### Umbrales Establecidos

El proyecto mantiene umbrales de cobertura del **80%** en:

- Líneas de código (lines)
- Funciones (functions)
- Branches (branches)
- Statements (statements)

### Archivos Excluidos

La configuración excluye automáticamente:

- Archivos de configuración y build
- Archivos de test (`.test.ts`, `.test.tsx`)
- Definiciones de tipos (`.d.ts`)
- Archivos de seed de base de datos
- Directorio `coverage/`

### Reportes Generados

Los reportes de cobertura se generan en:

- **Terminal:** Resumen visual inmediato
- **HTML:** Reporte detallado en `./coverage/index.html`
- **LCOV:** Para integración con herramientas CI/CD

## 🛠 Configuración Técnica

### Archivo de Configuración Principal

- **[vitest.config.ts](./vitest.config.ts)** - Configuración principal usando `getViteConfig()` de Astro

### Configuración de Testing

- **[test/setup.ts](./test/setup.ts)** - Setup global de Jest-DOM y mocks
- **[test/utils.tsx](./test/utils.tsx)** - Utilidades personalizadas para testing
- **[test/vitest-setup.d.ts](./test/vitest-setup.d.ts)** - Definiciones de tipos

### Mocks de Astro

- **[test/**mocks**/astro-db.mock.ts](./test/**mocks**/astro-db.mock.ts)** - Mock de operaciones de base de datos
- **[test/**mocks**/astro-actions.mock.ts](./test/**mocks**/astro-actions.mock.ts)** - Mock de acciones del servidor

## 📋 Patrones y Buenas Prácticas

### Estructura de Tests Recomendada

Cada archivo de test sigue una estructura consistente:

1. **Rendering** - Tests básicos de renderizado
2. **User Interactions** - Tests de interacciones del usuario
3. **Business Logic** - Tests de lógica específica
4. **Accessibility** - Tests de accesibilidad
5. **Edge Cases** - Tests de casos límite
6. **Error Handling** - Tests de manejo de errores

### Nomenclatura

- Archivos de test: `ComponentName.test.tsx` o `serviceName.test.ts`
- Describe blocks: Nombres descriptivos del componente o funcionalidad
- Test cases: Descripciones claras de lo que se está testando

### Limpieza y Setup

- Uso consistente de `beforeEach()` para limpiar mocks
- Setup de user events con `userEvent.setup()`
- Manejo adecuado de operaciones asíncronas con `waitFor()`

## 🔧 Integración con Desarrollo

### Extensiones VS Code Recomendadas

- **[Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)** - Ejecutar tests desde el editor
- **[Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)** - Mostrar errores inline
- **[Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)** - Syntax highlighting para tests

### Workflow de Desarrollo

1. **Watch Mode:** Ejecutar `pnpm test` durante desarrollo para feedback inmediato
2. **UI Mode:** Usar `pnpm test:ui` para debugging visual de tests
3. **Coverage:** Ejecutar `pnpm test:coverage` antes de commits importantes
4. **CI/CD:** Tests automáticos en pipeline con `pnpm test:run`

## 🔍 Debugging y Resolución de Problemas

### Problemas Comunes

#### Tests Lentos

- Usar `--no-coverage` durante desarrollo activo
- Ejecutar tests específicos en lugar de toda la suite
- Verificar que no hay tests con timeouts excesivos

#### Errores de Import

- Los mocks de Astro (`astro:db`, `astro:actions`) están configurados automáticamente
- Verificar que los mocks se declaren antes de las importaciones
- Revisar alias de paths en configuración de Vitest

#### Mocks No Funcionan

- Asegurar que `vi.clearAllMocks()` se llame en `beforeEach()`
- Verificar que los mocks se definan antes de importar los módulos
- Usar `vi.mocked()` para tipado correcto de mocks

### Comandos de Debug

```bash
# Ver información detallada de un test específico
pnpm test --reporter=verbose nombre-del-test

# Ejecutar en modo debug
pnpm test --inspect-brk

# Ver solo tests que fallan
pnpm test --reporter=verbose --run
```

## 📚 Recursos y Referencias

### Documentación Principal

- **[Vitest Documentation](https://vitest.dev/)** - Framework de testing
- **[Testing Library](https://testing-library.com/)** - Filosofía y APIs de testing
- **[Astro Testing Guide](https://docs.astro.build/en/guides/testing/)** - Testing específico para Astro

### Recursos Adicionales

- **[Jest DOM Matchers](https://github.com/testing-library/jest-dom)** - Matchers adicionales para DOM
- **[User Event API](https://testing-library.com/docs/user-event/intro/)** - Simulación de eventos de usuario
- **[MSW (Mock Service Worker)](https://mswjs.io/)** - Para mocking de APIs (futuro)

## 📈 Métricas y Estadísticas

### Distribución Actual de Tests

- **Componentes React:** 48% (102 tests)
- **Middleware:** 11% (24 tests)
- **Schemas:** 13% (27 tests)
- **Servicios:** 11% (24 tests)
- **Utilidades:** 8% (18 tests)
- **Infraestructura:** 9% (18 tests)

### Objetivos de Calidad

- ✅ **Cobertura:** Mantener >80% en todas las métricas
- ✅ **Performance:** Tests ejecutándose en <20 segundos
- ✅ **Estabilidad:** 100% de tests pasando en main branch
- ✅ **Mantenibilidad:** Estructura clara y documentada

---

**Última actualización:** Septiembre 2025  
**Mantenido por:** BRé [breimerct@gmail.com](mailto:breimerct@gmail.com)
