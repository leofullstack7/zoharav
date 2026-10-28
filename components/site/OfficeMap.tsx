"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Office } from "@/content/offices";
import { isFilled, loc } from "@/lib/i18n/loc";

/**
 * Standard OpenStreetMap raster tiles: genuinely free, no API key/account of
 * any kind, no request signing. (CARTO's "Dark Matter" tiles — the previous
 * source here — started requiring a free API key on 2026-09-25; unauthenticated
 * requests now return an HTTP 200 but with a static "API KEY REQUIRED"
 * watermark image instead of real map data, which is why the map looked
 * completely broken in production.)
 *
 * Per OSM's tile usage policy (operations.osmfoundation.org/policies/tiles):
 * use the single canonical hostname (no `{s}` subdomain sharding — "other
 * subdomains may be slower or withdrawn without notice"), and a real browser
 * sends a compliant User-Agent + Referer automatically, so no extra headers
 * are needed here. The source basemap is daylight-toned; `.office-map__canvas
 * .leaflet-tile-pane` in office-map.css applies a CSS filter to invert it
 * into a dark theme that matches the site's black/silver palette, without
 * touching the (separately-paned) markers/pins or UI chrome.
 */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function pinIcon(active: boolean) {
  return L.divIcon({
    className: "zh-pin" + (active ? " is-active" : ""),
    html: '<span class="zh-pin__core"></span><span class="zh-pin__ring"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

/** Fits the map to show every marker once, on first mount only. */
function FitAllOnce({ positions }: { positions: Array<[number, number]> }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 10);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
    // Intentionally run once: this is the initial overview framing, not a
    // response to later selection changes (FlyToSelected owns that).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Flies/zooms the map to the selected office whenever selection changes. */
function FlyToSelected({
  target,
  reduceMotion,
}: {
  target: [number, number] | null;
  reduceMotion: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    if (reduceMotion) {
      map.setView(target, 11);
    } else {
      map.flyTo(target, 11, { duration: 1.3 });
    }
  }, [target, reduceMotion, map]);
  return null;
}

export default function OfficeMap({ offices, locale }: { offices: Office[]; locale: string }) {
  const [selectedId, setSelectedId] = useState<Office["id"] | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  const positions = useMemo<Array<[number, number]>>(
    () => offices.map((office) => [office.lat, office.lng]),
    [offices],
  );
  const selected = offices.find((office) => office.id === selectedId) ?? null;
  const target = selected ? ([selected.lat, selected.lng] as [number, number]) : null;
  const es = locale === "es";

  return (
    <div className="office-map">
      <div className="office-map__canvas" role="application" aria-label={es ? "Mapa de oficinas" : "Office map"}>
        <MapContainer
          center={[17, -73]}
          zoom={3}
          minZoom={2}
          maxZoom={16}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          attributionControl
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
          <FitAllOnce positions={positions} />
          <FlyToSelected target={target} reduceMotion={reduceMotion} />
          {offices.map((office) => (
            <Marker
              key={office.id}
              position={[office.lat, office.lng]}
              icon={pinIcon(office.id === selectedId)}
              keyboard={false}
              eventHandlers={{ click: () => setSelectedId(office.id) }}
            />
          ))}
        </MapContainer>
      </div>

      <aside className="office-map__panel">
        <ul className="office-map__list">
          {offices.map((office) => (
            <li key={office.id}>
              <button
                type="button"
                className={office.id === selectedId ? "office-map__item is-active" : "office-map__item"}
                aria-pressed={office.id === selectedId}
                onClick={() => setSelectedId(office.id)}
              >
                <span className="office-map__item-city">{loc(office.city, locale)}</span>
                <span className="office-map__item-role">{loc(office.role, locale)}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="office-map__info" aria-live="polite">
          {selected ? (
            <>
              <h3>{loc(selected.city, locale)}</h3>
              <p className="kicker">{loc(selected.role, locale)}</p>
              {isFilled(selected.address) ? <p>{selected.address}</p> : null}
              <p className="office-map__tz">{selected.timezoneLabel}</p>
              {isFilled(selected.hours.en) ? <p>{loc(selected.hours, locale)}</p> : null}
            </>
          ) : (
            <p className="office-map__hint">
              {es
                ? "Selecciona una oficina en la lista o en el mapa para ver su información."
                : "Select an office from the list or the map to see its details."}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
