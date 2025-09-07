# Configuración de Branch Protection Rules para GitHub

Este archivo contiene las instrucciones para configurar las reglas de protección de la rama master en GitHub.

## Pasos para configurar Branch Protection Rules:

### 1. Acceder a la configuración del repositorio
1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña "Settings"
3. En la barra lateral izquierda, haz clic en "Branches"

### 2. Configurar reglas para la rama master
1. Haz clic en "Add rule" o "Add branch protection rule"
2. En "Branch name pattern", escribe: `master`

### 3. Configurar las siguientes opciones:

#### Opciones Obligatorias:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals (mínimo 1 approval)
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (opcional)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - En "Status checks that are required", agregar:
    - `test` (nombre del job de tests en el workflow)
    - `type-check` (nombre del job de type checking en el workflow)

#### Opciones Recomendadas:
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (opcional, para mayor seguridad)
- ✅ **Require linear history** (opcional, mantiene un historial limpio)
- ✅ **Do not allow bypassing the above settings**
- ✅ **Restrict pushes that create files** (opcional)

#### Opciones de Administración:
- ❌ **Allow force pushes** (mantener deshabilitado)
- ❌ **Allow deletions** (mantener deshabilitado)

### 4. Guardar la configuración
1. Haz clic en "Create" para crear la regla

## Resultado Esperado:

Una vez configurado, cuando alguien intente hacer un Pull Request a master:

1. **Los tests deben pasar**: El workflow de CI/CD se ejecutará automáticamente
2. **Se requiere revisión**: Al menos 1 persona debe aprobar el PR
3. **La rama debe estar actualizada**: Debe tener los últimos cambios de master
4. **No se puede hacer merge directo**: Solo a través de Pull Requests

## Verificación:

Para verificar que todo funciona correctamente:

1. Crea una nueva rama desde master
2. Haz algunos cambios y crea un commit
3. Abre un Pull Request hacia master
4. Verifica que aparezcan los checks del CI/CD
5. Verifica que no se pueda hacer merge hasta que los tests pasen

## Troubleshooting:

Si los status checks no aparecen:
1. Verifica que el workflow se haya ejecutado al menos una vez
2. Los nombres de los jobs en el workflow deben coincidir con los configurados en branch protection
3. Asegúrate de que el workflow esté en la rama master
