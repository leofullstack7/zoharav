# Fotografías y video

Grading de toda la pieza: sombras negras con un dejo teal, luces ámbar y doradas, contraste alto, viñeta suave. Mientras no exista el archivo, la ruta indicada es el nombre definitivo. No usar fotos que muestren a Zoharav extrayendo, vendiendo o transportando recursos; el contexto es asesoría, inspección o capital.

| Archivo | Brief |
| --- | --- |
| `public/video/hero.mp4` + `.webm` | 10–15 s, cámara lenta. Plataforma offshore al atardecer, vista desde la cubierta de un yate. Ejecutivo de espaldas, en silueta. Un helicóptero cruza. Poster AVIF en `public/images/hero/poster.avif` |
| `public/images/hero/yacht-offshore.jpg` | Misma escena, fija, para móvil y fallback |
| `public/images/services/oil-and-energy.jpg` | Plataforma al ocaso, buque, tuberías con luz dorada, ingeniero con casco en contexto de inspección |
| `public/images/services/mining.jpg` | Macro de oro y esmeraldas sobre roca oscura; alternativa: tajo al atardecer |
| `public/images/services/sustainability.jpg` | Manos con una planta y tierra, o río en selva visto desde el aire |
| `public/images/services/energy-transition.jpg` | Solar o eólico al atardecer, sin look de “tech” |
| `public/images/services/investment.jpg` | Apretón de manos sobre documentos, mapa |
| `public/images/services/strategic-operational.jpg` | Ejecutivos hacia un jet al atardecer, o sala de juntas con skyline |
| `public/images/offices/medellin.jpg` | Skyline de Medellín |
| `public/images/offices/miami.jpg` | Brickell |
| `public/images/offices/san-juan.jpg` | Capitolio o palmeras de San Juan |
| `public/images/offices/dubai.jpg` | Solo si la oficina se activa |
| `public/images/firm/marble-monogram.jpg` | Oficina con ventanal al anochecer y monograma en mármol |
| `public/images/contact/tower-palms.jpg` | Torre con palmeras al atardecer |
| `public/images/pillars/*.jpg` | Recortes de las escenas anteriores |
| `public/images/team/*.jpg` | Retratos. El tratamiento a color/blanco y negro se hace en CSS |
| `public/textures/black-marble.jpg` | Mármol negro con vetas doradas, para hero, brochure y footer |

## Marca

- `public/brand/monogram.svg` — se dibuja en la fase de sistema visual.
- `public/brand/alt/` — reservado para las exploraciones caligráficas árabe y hebrea (zahav, זהב). No se usan por defecto.

## Textura y video

`preload="metadata"`, autoplay muted loop playsinline. Si el visitante pide menos movimiento o trae Save-Data, se queda el poster y no el video.
