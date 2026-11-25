# Pulso Abierto — Versión final

Pulso Abierto es una aplicación con React, TypeScript y Vite que consulta los precios de Bitcoin, Ethereum y Solana en dólares desde CoinGecko, permite buscar y ordenar los resultados, abrir páginas de detalle y marcar favoritos que se guardan en el navegador con Zustand

## Tecnologías

React, TypeScript, Vite, React Router, Zustand, Zod, Vitest y Testing Library

## Instalar el proyecto

Es necesario tener Node.js y npm instalados, desde la carpeta del proyecto ejecutar

```cmd
npm.cmd install
```

## Ejecutar en desarrollo

```cmd
npm.cmd run dev
```

Abrir la dirección que muestra Vite en la terminal, normalmente `http://localhost:5173/`

## Pruebas, compilación y vista productiva

```cmd
npm.cmd run test
npm.cmd run build
npm.cmd run preview
```

La dirección de preview suele ser `http://localhost:4173/`, usar la que muestre la terminal

El proyecto no incluye script de lint, las pruebas utilizan respuestas simuladas y no hacen consultas reales a CoinGecko

## API utilizada

`GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd`

El acceso a CoinGecko está en `src/services/coingecko.ts`, la API se consulta en el navegador y no requiere claves para la consulta definida en esta actividad

## Favoritos

El archivo `src/store/favorites.ts` mantiene los favoritos entre la lista y la página de detalle y los guarda en `localStorage`, la cantidad de favoritos se calcula a partir de los identificadores guardados

## Cambio pequeño de mantenimiento realizado

En `src/pages/HomePage.tsx` había dos expresiones repetidas para filtrar las criptomonedas, una para mostrar las tarjetas y otra para contar las coincidencias, las reuní en la función `coinMatchesSearch` para usar el mismo criterio en ambos lugares y evitar duplicar lógica

Para comprobar que el cambio no alteró el resultado se deben ejecutar `npm.cmd run test`, `npm.cmd run build` y una consulta real en el navegador

## Publicación

GitHub:
https://github.com/Frandev-coder/API-practica-pulso-abierto

Vercel:
https://api-practica-pulso-abierto.vercel.app


## Verificación final

Las 8 pruebas automatizadas se ejecutaron correctamente

El build se generó sin errores

La aplicación fue publicada en Vercel

Comprobé que funcionan los precios, las páginas de detalle,
el formulario y los favoritos después de actualizar

Preview local: comprobado correctamente

Fecha de verificación: 24/11/2026
