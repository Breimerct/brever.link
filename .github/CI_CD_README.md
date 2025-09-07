# CI/CD Setup para bect.link

Este repositorio implementa un pipeline de CI/CD completo usando GitHub Actio### Si los tests fallan en CI pero pasan localmente:
1. Verificar que las dependencias están sincronizadas (`npm install`)
2. Verificar variables de entorno si las hay
3. Revisar diferencias entre entorno local y CI
4. Si usas pnpm localmente, asegúrate de que el package.json esté actualizadoara garantizar la calidad del código antes de hacer merge a la rama master.

## 🚀 Configuración Implementada

### 1. Workflows de GitHub Actions

#### CI Pipeline (`.github/workflows/ci.yml`)
- **Trigger**: Pull Requests y pushes a master
- **Jobs**:
  - **test**: Ejecuta ESLint, verifica formato, ejecuta tests y hace build
  - **type-check**: Verifica tipos con TypeScript/Astro

#### Code Quality Pipeline (`.github/workflows/code-quality.yml`)
- **Trigger**: Pull Requests y pushes a master
- **Jobs**:
  - **coverage**: Genera reporte de cobertura de tests
  - **dependency-audit**: Auditoría de seguridad de dependencias

### 2. Scripts de npm Actualizados

Se agregaron los siguientes scripts al `package.json`:

```json
{
  "lint:check": "prettier . --check",
  "lint:eslint": "eslint . --ext .ts,.tsx,.astro",
  "check": "astro check"
}
```

### 3. Branch Protection Rules

Ver archivo: `.github/BRANCH_PROTECTION_SETUP.md` para instrucciones detalladas.

### 4. Renovate Configuration

Configuración automática para mantener dependencias actualizadas (`renovate.json`).

## 📋 Requisitos para Pull Requests

Para que un Pull Request pueda ser mergeado a master, debe cumplir:

1. ✅ **Tests pasando**: Todos los tests unitarios deben pasar
2. ✅ **Linting**: Código debe cumplir estándares de ESLint
3. ✅ **Formatting**: Código debe estar formateado con Prettier
4. ✅ **Type Check**: No debe haber errores de TypeScript/Astro
5. ✅ **Build**: El proyecto debe compilar sin errores
6. ✅ **Review**: Al menos 1 aprobación de código requerida
7. ✅ **Branch actualizada**: Debe tener los últimos cambios de master

## 🛠️ Comandos Útiles para Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar todos los checks antes de hacer PR
npm run lint:eslint
npm run lint:check
npm run check
npm run test:run
npm run build

# Ver cobertura de tests
npm run test:coverage

# Formatear código
npm run lint
```

## 🔧 Configuración de Branch Protection

### Pasos manuales en GitHub:

1. **Ir a Settings > Branches**
2. **Crear regla para rama `master`**
3. **Habilitar estas opciones**:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging

4. **Agregar Status Checks requeridos**:
   - `test`
   - `type-check`

## 📊 Monitoreo y Reportes

### Coverage Reports
- Se genera automáticamente en cada PR
- Se puede subir a Codecov para tracking histórico

### Security Audits
- Auditoría automática de dependencias
- Alertas de vulnerabilidades
- Check de dependencias desactualizadas

### Dependency Management
- Renovate Bot actualiza dependencias automáticamente
- PRs separados para major/minor/patch updates
- Programado para ejecutarse los lunes por la mañana

## 🚨 Troubleshooting

### Si los tests fallan en CI pero pasan localmente:
1. Verificar que las dependencias están sincronizadas (`npm install`)
2. Verificar variables de entorno si las hay
3. Revisar diferencias entre entorno local y CI

### Si los status checks no aparecen:
1. Verificar que el workflow se ejecutó al menos una vez
2. Verificar nombres de jobs en branch protection rules
3. Asegurar que el workflow está en la rama master

### Si el build falla:
1. Verificar que `astro build --remote` funciona localmente
2. Verificar configuración de Astro DB
3. Revisar variables de entorno necesarias

## 📝 Flujo de Trabajo Recomendado

1. **Crear feature branch**: `git checkout -b feature/nueva-funcionalidad`
2. **Desarrollar**: Hacer cambios con tests incluidos
3. **Verificar localmente**: Ejecutar todos los checks
4. **Hacer commit**: Con mensajes descriptivos
5. **Push**: `git push origin feature/nueva-funcionalidad`
6. **Crear PR**: Hacia master con descripción clara
7. **Esperar CI**: Verificar que todos los checks pasen
8. **Code Review**: Obtener aprobación
9. **Merge**: Una vez todo esté verde

## 🎯 Próximos Pasos

- [ ] Configurar Codecov para tracking de cobertura
- [ ] Configurar notificaciones de Slack/Discord para CI
- [ ] Implementar deployment automático a staging/production
- [ ] Agregar tests de integración E2E
- [ ] Configurar performance budgets
