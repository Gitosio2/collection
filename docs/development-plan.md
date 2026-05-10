# Plan de desarrollo: colección de miniaturas

## 1. Objetivo

Crear una aplicación web responsive para gestionar una colección personal de miniaturas. La aplicación será inicialmente de uso individual con login desde la primera versión, pero su diseño de datos debe permitir una evolución futura hacia multiusuario y multicolección.

## 2. Decisiones principales

- La aplicación tendrá login desde la primera versión.
- El uso inicial será personal, pero se crearán entidades `User` y `Collection` para facilitar una futura ampliación a multiusuario y multicolección.
- El almacenamiento de imágenes se realizará en Cloudflare R2.
- Para cada imagen se generarán versiones optimizadas para mejorar el rendimiento de carga.
- La interfaz tendrá dos vistas principales: galería de tarjetas y tabla de gestión.
- El diseño debe ser responsive desde la primera versión.
- La conversión a PWA queda indicada como mejora futura.
- La mayoría de miniaturas serán escala 1:50, por lo que la escala no se mostrará inicialmente en las tarjetas, aunque sí estará disponible en detalle, edición y tabla.

## 3. Datos principales de un elemento

Los campos obligatorios al crear un elemento serán:

- marca del modelo real;
- modelo real;
- fabricante de la miniatura;
- fecha de compra.

El país se autorrellenará según estas reglas:

1. si existe empresa de decoración, se usará el país de la empresa de decoración;
2. si no existe empresa de decoración, se usará el país de la marca del modelo real;
3. el usuario podrá revisar o ajustar el país calculado si fuera necesario.

El valor de compra será un dato relevante de visualización, especialmente en las tarjetas. El valor estimado actual existirá, pero se gestionará de forma manual con ayuda de referencias de mercado.

## 4. Vista de galería

La galería mostrará tarjetas visuales para navegar la colección. Cada tarjeta debe mostrar inicialmente:

- imagen principal o carrusel de imágenes;
- marca;
- modelo;
- fabricante de la miniatura;
- bandera del país calculado;
- valor de compra.

La escala no se mostrará inicialmente en la tarjeta porque la colección será mayoritariamente 1:50, aunque sí estará disponible en la vista de detalle.

Las tarjetas podrán ser deslizables para permitir consultar varias imágenes del mismo modelo sin entrar en el detalle. En escritorio se podrán usar controles de carrusel, y en móvil se priorizará el gesto de swipe.

## 5. Vista de tabla

La vista de tabla estará orientada a consulta y gestión sin imágenes grandes. Columnas propuestas:

- marca;
- modelo;
- fabricante;
- país calculado;
- empresa de decoración;
- país de la empresa de decoración;
- escala;
- fecha de compra;
- valor de compra;
- valor estimado actual;
- estado;
- referencia;
- ubicación;
- acciones.

La tabla deberá permitir ordenación, filtros y búsqueda. La exportación CSV queda como mejora posterior.

## 6. Imágenes y Cloudflare R2

Cloudflare R2 será el almacenamiento principal para las imágenes. La base de datos no almacenará los binarios de las imágenes, sino metadatos y claves de objeto.

Para mejorar el rendimiento se generarán variantes por imagen:

- `original`: imagen original subida o versión de máxima calidad conservada;
- `large`: versión para detalle;
- `medium`: versión para tarjetas;
- `thumbnail`: versión pequeña para listados, previsualizaciones o carga rápida.

Cada elemento podrá tener varias imágenes. Una imagen podrá marcarse como portada.

## 7. Valor estimado actual

El valor estimado actual se gestionará mediante una opción manual con ayuda. La aplicación permitirá introducir un valor estimado y asociar referencias externas que justifiquen o ayuden a calcular ese valor.

Las referencias de mercado podrán incluir:

- fuente;
- URL;
- título del anuncio o referencia;
- precio observado;
- moneda;
- fecha de observación;
- notas.

No se implementará scraping automático en la primera versión. Cualquier automatización futura deberá evaluarse según disponibilidad de APIs públicas, condiciones de uso de los sitios y calidad real de los datos.

## 8. Catálogos y alta rápida

La aplicación usará catálogos normalizados, pero con alta rápida desde los formularios. Si el usuario introduce una marca, fabricante, empresa de decoración, escala, estado o ubicación que no existe, la interfaz deberá permitir crearla sin abandonar el formulario del elemento.

Catálogos principales:

- marcas;
- fabricantes;
- empresas de decoración;
- países;
- escalas;
- estados;
- monedas;
- ubicaciones.

Las tablas `Brand`, `Manufacturer` y `Company` tendrán `countryId` para poder calcular automáticamente el país del elemento.

## 9. Uso de `sortOrder`

El campo `sortOrder` sirve para controlar el orden manual o semántico de registros cuando el orden alfabético no es suficiente.

Ejemplos de uso:

- en `Scale`, permite mostrar escalas en un orden lógico como 1:18, 1:24, 1:43, 1:50 y 1:64, en vez de depender solo del texto;
- en `Condition`, permite mostrar estados en un orden definido como nuevo, muy bueno, bueno, usado o restaurado;
- en `ItemImage`, permite ordenar las imágenes de un elemento para decidir qué imagen aparece primero, después de la portada;
- en futuras listas configurables, permite que el usuario ajuste el orden de visualización.

No es un campo obligatorio para todas las tablas. Solo debe añadirse cuando exista una necesidad real de ordenación manual o predecible.

## 10. Modelo de base de datos propuesto

### Entidades principales

```text
User
- id
- name
- email
- passwordHash
- createdAt
- updatedAt

Collection
- id
- userId
- name
- description
- createdAt
- updatedAt

Item
- id
- collectionId
- brandId
- model
- manufacturerId
- scaleId
- countryId
- companyId
- purchaseDate
- purchaseValue
- purchaseCurrencyId
- estimatedValue
- estimatedValueCurrencyId
- estimatedValueDate
- conditionId
- referenceNumber
- locationId
- notes
- createdAt
- updatedAt
```

### Catálogos

```text
Brand
- id
- name
- countryId
- createdAt
- updatedAt

Manufacturer
- id
- name
- countryId
- createdAt
- updatedAt

Company
- id
- name
- countryId
- createdAt
- updatedAt

Country
- id
- name
- isoCode
- flagEmoji
- createdAt
- updatedAt

Scale
- id
- name
- sortOrder
- createdAt
- updatedAt

Condition
- id
- name
- sortOrder
- createdAt
- updatedAt

Currency
- id
- code
- symbol
- name
- createdAt
- updatedAt

Location
- id
- name
- description
- createdAt
- updatedAt
```

### Imágenes

```text
ItemImage
- id
- itemId
- storageProvider
- bucket
- objectKey
- publicUrl
- originalFileName
- mimeType
- sizeBytes
- width
- height
- sortOrder
- isCover
- createdAt
- updatedAt

ItemImageVariant
- id
- imageId
- variant
- objectKey
- publicUrl
- width
- height
- sizeBytes
- createdAt
- updatedAt
```

### Referencias de mercado

```text
MarketReference
- id
- itemId
- source
- url
- title
- observedPrice
- currencyId
- observedAt
- notes
- createdAt
- updatedAt
```

## 11. Stack técnico recomendado

Stack propuesto:

- Next.js;
- TypeScript;
- PostgreSQL;
- Prisma;
- Tailwind CSS;
- shadcn/ui;
- Cloudflare R2 para imágenes;
- autenticación desde la primera versión.

## 12. Fases de desarrollo

### Fase 1: base del proyecto

- Crear proyecto Next.js con TypeScript.
- Configurar Tailwind CSS y shadcn/ui.
- Configurar Prisma y PostgreSQL.
- Configurar autenticación inicial.
- Crear modelos iniciales y migración base.
- Crear seed inicial de países, monedas, escalas y estados.

### Fase 2: catálogos

- CRUD de marcas.
- CRUD de fabricantes.
- CRUD de empresas de decoración.
- CRUD de países.
- CRUD de escalas, estados, monedas y ubicaciones.
- Alta rápida desde el formulario de elemento.

### Fase 3: elementos de colección

- Alta de elemento.
- Edición de elemento.
- Detalle de elemento.
- Eliminación con confirmación.
- Autorrelleno de país según empresa de decoración o marca.
- Validaciones de campos obligatorios.

### Fase 4: imágenes

- Configurar Cloudflare R2.
- Subir múltiples imágenes por elemento.
- Generar variantes optimizadas.
- Seleccionar imagen de portada.
- Ordenar imágenes con `sortOrder`.
- Eliminar imágenes y variantes asociadas.

### Fase 5: vistas principales

- Galería de tarjetas responsive.
- Carrusel o swipe de imágenes en tarjetas.
- Vista de detalle con galería completa.
- Tabla de gestión sin imágenes grandes.
- Búsqueda, filtros y ordenación.

### Fase 6: valor estimado y referencias

- Guardar valor estimado manual.
- Guardar fecha de estimación.
- Registrar referencias de mercado.
- Mostrar referencias en el detalle del elemento.

### Fase 7: mejoras futuras

- PWA.
- Multiusuario completo.
- Multicolección completa.
- Importación y exportación CSV.
- Estadísticas avanzadas.
- Integraciones con APIs públicas de compraventa si son viables.
