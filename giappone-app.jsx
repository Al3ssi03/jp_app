import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { Calendar, Map, Receipt, Users, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, X, Trash2, Edit3, Share2, Check, MapPin, Navigation, ArrowRight, AlertCircle, ExternalLink, Wallet, TrendingUp, Clock, Utensils, Train, Home as HomeIcon, Star, Moon, Coffee, ShoppingBag, Landmark, Search, Settings, ChevronsUpDown } from "lucide-react";

/*
 * ══════════════════════════════════════════════════════════════
 *  DESIGN SYSTEM — shadcn/ui + Radix Colors (Dark, Red accent)
 *
 *  12-step Radix scale:
 *   1-2:  Backgrounds
 *   3-5:  Component backgrounds / hover / active
 *   6-8:  Borders
 *   9-10: Solid colors / buttons
 *   11:   Low-contrast text
 *   12:   High-contrast text
 * ══════════════════════════════════════════════════════════════
 */

// ─── CSS VARIABLES ──────────────────────────────────────────
const DESIGN_SYSTEM_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;500;600&display=swap');

  :root {
    /* Radix Mauve Dark (gray scale) */
    --mauve-1: #121113;
    --mauve-2: #1a191b;
    --mauve-3: #232225;
    --mauve-4: #2b292d;
    --mauve-5: #323035;
    --mauve-6: #3c393f;
    --mauve-7: #49474e;
    --mauve-8: #625f69;
    --mauve-9: #6f6d78;
    --mauve-10: #7c7a85;
    --mauve-11: #b5b2bc;
    --mauve-12: #eeeef0;

    /* Radix Red Dark (accent) */
    --red-1: #191111;
    --red-2: #201314;
    --red-3: #3b1219;
    --red-4: #500f1c;
    --red-5: #611623;
    --red-6: #72232d;
    --red-7: #8c333a;
    --red-8: #b54548;
    --red-9: #e5484d;
    --red-10: #ec5d5e;
    --red-11: #ff9592;
    --red-12: #ffd1d9;

    /* Radix Blue Dark */
    --blue-9: #3e63dd;
    --blue-11: #9db1ff;

    /* Radix Green Dark */
    --green-9: #30a46c;
    --green-11: #4cc38a;

    /* Radix Amber Dark */
    --amber-9: #ffb224;
    --amber-11: #f1a10d;

    /* shadcn semantic tokens */
    --background: var(--mauve-1);
    --foreground: var(--mauve-12);
    --card: var(--mauve-2);
    --card-foreground: var(--mauve-12);
    --popover: var(--mauve-2);
    --popover-foreground: var(--mauve-12);
    --primary: var(--red-9);
    --primary-foreground: #fff;
    --secondary: var(--mauve-3);
    --secondary-foreground: var(--mauve-11);
    --muted: var(--mauve-3);
    --muted-foreground: var(--mauve-11);
    --accent: var(--mauve-4);
    --accent-foreground: var(--mauve-12);
    --destructive: var(--red-9);
    --border: var(--mauve-6);
    --input: var(--mauve-6);
    --ring: var(--red-8);
    --radius: 0.625rem;

    /* City accent colors (using Radix-style step 9) */
    --city-osaka: #e5484d;
    --city-nara: #a18072;
    --city-kyoto: #e54666;
    --city-hiroshima: #30a46c;
    --city-kawaguchiko: #3e63dd;
    --city-tokyo: #8e4ec6;
    --city-kamakura: #12a594;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  ::-webkit-scrollbar { display: none; }
  body { overflow-x: hidden; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  input::placeholder {
    color: var(--mauve-8);
  }
  input:focus {
    outline: none;
    border-color: var(--red-8) !important;
    box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.1);
  }
`;

// ─── PRIMITIVES (shadcn-inspired) ───────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

function Card({ children, style, className, ...props }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

function Badge({ children, variant = "default", color, style }) {
  const variants = {
    default: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
      border: "1px solid var(--border)",
    },
    outline: {
      background: "transparent",
      color: color || "var(--foreground)",
      border: `1px solid ${color ? color + "44" : "var(--border)"}`,
    },
    ghost: {
      background: color ? color + "15" : "var(--muted)",
      color: color || "var(--muted-foreground)",
      border: "1px solid transparent",
    },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px",
      borderRadius: "calc(var(--radius) * 10)",
      fontSize: "0.7rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
      lineHeight: 1.6,
      whiteSpace: "nowrap",
      fontFamily: "'Geist', sans-serif",
      transition: "all 0.15s ease",
      ...variants[variant],
      ...style,
    }}>
      {children}
    </span>
  );
}

function Button({ children, variant = "default", size = "default", style, disabled, ...props }) {
  const variants = {
    default: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "1px solid var(--primary)",
    },
    secondary: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
      border: "1px solid var(--border)",
    },
    outline: {
      background: "transparent",
      color: "var(--foreground)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--muted-foreground)",
      border: "1px solid transparent",
    },
    destructive: {
      background: "var(--destructive)",
      color: "#fff",
      border: "1px solid var(--destructive)",
    },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "0.75rem" },
    default: { padding: "8px 16px", fontSize: "0.8125rem" },
    lg: { padding: "10px 20px", fontSize: "0.875rem" },
    icon: { padding: "8px", fontSize: "0.8125rem", width: 36, height: 36, justifyContent: "center" },
  };
  return (
    <button disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      borderRadius: "var(--radius)",
      fontFamily: "'Geist', sans-serif",
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      opacity: disabled ? 0.5 : 1,
      lineHeight: 1,
      ...variants[variant],
      ...sizes[size],
      ...style,
    }} {...props}>
      {children}
    </button>
  );
}

function Separator({ style }) {
  return <div style={{ height: 1, background: "var(--border)", width: "100%", ...style }} />;
}

function Progress({ value, max = 100, color, style }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{
      height: 4, borderRadius: 9999,
      background: "var(--mauve-4)",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        height: "100%", borderRadius: 9999,
        width: `${pct}%`,
        background: color || "var(--primary)",
        transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
    </div>
  );
}

function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      animation: "fadeIn 0.15s ease",
    }} onClick={onClose}>
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "var(--mauve-2)",
          borderTop: "1px solid var(--border)",
          borderRadius: "16px 16px 0 0",
          maxHeight: "88vh",
          overflowY: "auto",
          animation: "slideUp 0.2s ease",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{
          width: 36, height: 4, borderRadius: 9999,
          background: "var(--mauve-6)",
          margin: "10px auto 0",
        }} />
        {children}
      </div>
    </div>
  );
}

// ─── DATA ───────────────────────────────────────────────────
const CITY_VARS = {
  "Osaka": "var(--city-osaka)",
  "Nara": "var(--city-nara)",
  "Kyoto": "var(--city-kyoto)",
  "Hiroshima": "var(--city-hiroshima)",
  "Kawaguchiko": "var(--city-kawaguchiko)",
  "Tokyo": "var(--city-tokyo)",
  "Kamakura": "var(--city-kamakura)",
};

const ICON_MAP = {
  plane: "✈️", train: "🚄", home: "🏨", food: "🍜",
  shop: "🛍️", landmark: "⛩️", star: "✨", moon: "🌙", coffee: "☕",
};

const DAYS = [
  {
    date: "18 DIC", emoji: "🇯🇵", weekday: "VEN", title: "Arrivo a Osaka", subtitle: "Benvenuto in Giappone!", city: "Osaka",
    activities: [
      { time: "07:00–10:00", title: "Arrivo a Kansai Airport", icon: "plane", details: "Ritira bagagli · Attiva Suica/ICOCA · Nankai Rapi:t per Namba (~50 min) · Compra SIM dati", coords: { lat: 34.4320, lng: 135.2440 } },
      { time: "10:00–12:00", title: "Check-in & Orientamento", icon: "home", details: "Hotel zona Namba/Shinsaibashi · Primo konbini: onigiri + caffè", coords: { lat: 34.6685, lng: 135.5013 } },
      { time: "12:00–14:00", title: "Pranzo: Kuromon Market", icon: "food", details: "Sushi fresco, wagyu grigliato, frutta giapponese · Porta contanti!", coords: { lat: 34.6627, lng: 135.5070 } },
      { time: "14:00–17:00", title: "Shinsaibashi & Amerikamura", icon: "shop", details: "Shopping coperto più lungo di Osaka · Vintage · Street art · Sneakers", coords: { lat: 34.6724, lng: 135.5016 } },
      { time: "17:30–21:00", title: "Dotonbori by Night ✨", icon: "star", details: "Takoyaki da Wanaka · Okonomiyaki da Mizuno · Canale illuminato", coords: { lat: 34.6687, lng: 135.5027 } },
      { time: "21:00+", title: "Dopocena", icon: "moon", details: "Hozenji Yokocho: bar hopping tra le lanterne · Primo ramen", coords: { lat: 34.6691, lng: 135.5052 } },
    ]
  },
  {
    date: "19 DIC", emoji: "🏰", weekday: "SAB", title: "Osaka — Castello & Retrò", subtitle: "Shinsekai & Abeno Harukas", city: "Osaka",
    activities: [
      { time: "09:00–12:00", title: "Osaka Castle & Parco", icon: "landmark", details: "Biglietto 600¥ · Fossato e parco · Vista dalla terrazza", coords: { lat: 34.6873, lng: 135.5262 } },
      { time: "12:00–14:00", title: "Pranzo: Kushikatsu", icon: "food", details: "Shinsekai · Fritto su stecco — regola: NO DOUBLE DIP!", coords: { lat: 34.6523, lng: 135.5063 } },
      { time: "14:00–17:00", title: "Esplora Shinsekai", icon: "star", details: "Tsutenkaku Tower · Atmosfera retrò · Game center vintage", coords: { lat: 34.6517, lng: 135.5064 } },
      { time: "17:00–18:00", title: "Abeno Harukas", icon: "landmark", details: "Grattacielo 300m · Terrazza panoramica al 60° piano", coords: { lat: 34.6463, lng: 135.5134 } },
      { time: "18:30–21:00", title: "Cena a Namba", icon: "food", details: "Okonomiyaki stile Osaka · Passeggiata notturna", coords: { lat: 34.6685, lng: 135.5013 } },
    ]
  },
  {
    date: "20 DIC", emoji: "🦌", weekday: "DOM", title: "Gita a Nara", subtitle: "Cervi Sacri & Grande Buddha", city: "Nara",
    activities: [
      { time: "08:00–09:00", title: "Treno per Nara", icon: "train", details: "Kintetsu da Namba (35 min, ~680¥)", coords: { lat: 34.6687, lng: 135.5027 } },
      { time: "09:00–10:30", title: "Nara Park & Cervi", icon: "star", details: "1.200+ cervi sacri liberi · Shika senbei 200¥ · Momento magico", coords: { lat: 34.6851, lng: 135.8430 } },
      { time: "10:30–12:00", title: "Todai-ji: Grande Buddha", icon: "landmark", details: "Edificio in legno più grande del mondo · Buddha bronzo 15m", coords: { lat: 34.6890, lng: 135.8399 } },
      { time: "12:00–13:00", title: "Pranzo a Nara", icon: "food", details: "Kakinoha-zushi in foglie di cachi · Mochi artigianali", coords: { lat: 34.6840, lng: 135.8300 } },
      { time: "13:00–14:30", title: "Kasuga Taisha", icon: "landmark", details: "3.000 lanterne di pietra e bronzo nel bosco", coords: { lat: 34.6811, lng: 135.8497 } },
      { time: "16:00–17:00", title: "Ritorno a Osaka", icon: "train", details: "Ultima notte a Osaka", coords: { lat: 34.6687, lng: 135.5027 } },
    ]
  },
  {
    date: "21 DIC", emoji: "⛩️", weekday: "LUN", title: "Kyoto — Fushimi & Gion", subtitle: "10.000 Torii & Quartiere Geishe", city: "Kyoto",
    activities: [
      { time: "06:30–07:30", title: "Treno per Fushimi Inari", icon: "train", details: "JR da Osaka a Inari Station (45 min)", coords: { lat: 34.9671, lng: 135.7727 } },
      { time: "07:30–10:30", title: "Fushimi Inari Taisha ⛩️", icon: "landmark", details: "10.000+ torii rossi · Percorso ~2-3h · All'alba senza folla", coords: { lat: 34.9671, lng: 135.7727 } },
      { time: "12:00–15:00", title: "Nishiki Market", icon: "food", details: "400m bancarelle: pesce, tofu, dolci, coltelli giapponesi", coords: { lat: 35.0050, lng: 135.7647 } },
      { time: "15:30–17:00", title: "Kinkaku-ji — Padiglione d'Oro", icon: "landmark", details: "Bus 205 · Biglietto 500¥ · Riflesso dorato nel lago", coords: { lat: 35.0394, lng: 135.7292 } },
      { time: "17:30–21:00", title: "Gion by Night", icon: "moon", details: "Quartiere geishe · Lanterne · Case da tè · Hanami-koji", coords: { lat: 35.0037, lng: 135.7755 } },
    ]
  },
  {
    date: "22 DIC", emoji: "🌿", weekday: "MAR", title: "Kyoto — Arashiyama", subtitle: "Kimono & Cerimonia del Tè", city: "Kyoto",
    activities: [
      { time: "07:30–08:00", title: "Noleggio Kimono", icon: "star", details: "~3.000-5.000¥ per la giornata", coords: { lat: 35.0040, lng: 135.7680 } },
      { time: "08:30–12:00", title: "Arashiyama", icon: "landmark", details: "Foresta di bambù · Tenryu-ji · Ponte Togetsukyo · Monkey Park", coords: { lat: 35.0094, lng: 135.6731 } },
      { time: "14:00–16:00", title: "Higashiyama", icon: "landmark", details: "Kiyomizu-dera · Sannenzaka · Ninenzaka", coords: { lat: 34.9949, lng: 135.7850 } },
      { time: "16:00–17:30", title: "Cerimonia del Tè 🍵", icon: "coffee", details: "Chado in casa da tè tradizionale · Prenota in anticipo", coords: { lat: 35.0020, lng: 135.7750 } },
      { time: "18:30–21:00", title: "Ultima Sera a Kyoto", icon: "moon", details: "Pontocho con lanterne · Ristorante kaiseki tradizionale", coords: { lat: 35.0037, lng: 135.7705 } },
    ]
  },
  {
    date: "23 DIC", emoji: "☮️", weekday: "MER", title: "Hiroshima & Miyajima", subtitle: "Pace e Sacralità", city: "Hiroshima",
    activities: [
      { time: "07:00–09:00", title: "Shinkansen → Hiroshima", icon: "train", details: "Treno proiettile ~100 min · Bento in stazione", coords: { lat: 35.0116, lng: 135.7681 } },
      { time: "09:00–12:00", title: "Peace Memorial", icon: "landmark", details: "Museo + A-Bomb Dome + Parco della Pace", coords: { lat: 34.3955, lng: 132.4536 } },
      { time: "12:00–13:00", title: "Okonomiyaki Hiroshima", icon: "food", details: "A strati con noodles! Okonomimura o Nagataya", coords: { lat: 34.3924, lng: 132.4586 } },
      { time: "14:30–18:00", title: "Isola di Miyajima", icon: "star", details: "Torii galleggiante · Itsukushima · Momiji manju · Cervi", coords: { lat: 34.2960, lng: 132.3198 } },
      { time: "18:30–20:00", title: "Ritorno & Notte", icon: "moon", details: "Check-in hotel Hiroshima", coords: { lat: 34.3953, lng: 132.4553 } },
    ]
  },
  {
    date: "24 DIC", emoji: "🗻", weekday: "GIO", title: "Monte Fuji & Onsen", subtitle: "Vigilia di Natale 🎄", city: "Kawaguchiko",
    activities: [
      { time: "07:00", title: "Partenza da Hiroshima", icon: "train", details: "Shinkansen ~3.5-4h", coords: { lat: 34.3953, lng: 132.4553 } },
      { time: "12:00–13:00", title: "Hoto Noodles", icon: "food", details: "Larghi noodles in brodo miso — specialità della zona", coords: { lat: 35.5025, lng: 138.7658 } },
      { time: "14:00–15:00", title: "Check-in Ryokan", icon: "home", details: "Tatami, futon, matcha di benvenuto", coords: { lat: 35.5025, lng: 138.7658 } },
      { time: "15:00–17:00", title: "Onsen con Vista Fuji", icon: "star", details: "Bagno termale privato guardando il monte · Lavati PRIMA", coords: { lat: 35.5025, lng: 138.7658 } },
      { time: "18:00–20:00", title: "Cena Kaiseki 🎄", icon: "food", details: "10-15 piatti stagionali d'arte serviti in camera", coords: { lat: 35.5025, lng: 138.7658 } },
      { time: "20:00–22:00", title: "Sera della Vigilia", icon: "moon", details: "Onsen sotto le stelle · Fuji illuminato dalla luna", coords: { lat: 35.5025, lng: 138.7658 } },
    ]
  },
  {
    date: "25 DIC", emoji: "🌅", weekday: "VEN", title: "Natale — Arrivo a Tokyo", subtitle: "Alba sul Fuji & Golden Gai", city: "Tokyo",
    activities: [
      { time: "06:00–07:00", title: "Alba sul Monte Fuji 🌅", icon: "star", details: "Sveglia prima dell'alba — momento leggendario", coords: { lat: 35.5025, lng: 138.7658 } },
      { time: "12:00–14:00", title: "Trasferimento a Tokyo", icon: "train", details: "Romancecar per Shinjuku ~90 min", coords: { lat: 35.6762, lng: 139.6503 } },
      { time: "15:30–18:00", title: "Shinjuku", icon: "landmark", details: "Osservatorio gratuito Metropolitan Government Building", coords: { lat: 35.6896, lng: 139.6917 } },
      { time: "18:00–21:00", title: "Golden Gai & Omoide Yokocho", icon: "moon", details: "200 micro-bar in 6 vicoli · Yakitori sotto i binari", coords: { lat: 35.6938, lng: 139.7034 } },
    ]
  },
  {
    date: "26 DIC", emoji: "⛩️", weekday: "SAB", title: "Asakusa, Tsukiji & Akihabara", subtitle: "Templi, Sushi & Otaku", city: "Tokyo",
    activities: [
      { time: "08:00–10:30", title: "Senso-ji & Asakusa", icon: "landmark", details: "Kaminarimon · Nakamise: 90+ bancarelle dal 1700", coords: { lat: 35.7148, lng: 139.7967 } },
      { time: "11:00–13:00", title: "Tsukiji Market 🍣", icon: "food", details: "Street food: sushi, tamagoyaki, frutti di mare", coords: { lat: 35.6654, lng: 139.7707 } },
      { time: "14:30–17:30", title: "Akihabara — Electric Town", icon: "star", details: "Manga, anime, retrogaming, maid café", coords: { lat: 35.7023, lng: 139.7745 } },
      { time: "18:00–21:00", title: "Cena Ramen", icon: "food", details: "Fuunji (Shinjuku) o Ichiran", coords: { lat: 35.6896, lng: 139.7006 } },
    ]
  },
  {
    date: "27 DIC", emoji: "✨", weekday: "DOM", title: "Meiji, TeamLab & JDM", subtitle: "Harajuku, Shibuya & Daikoku", city: "Tokyo",
    activities: [
      { time: "08:30–10:30", title: "Meiji Jingu", icon: "landmark", details: "Foresta di 170.000 alberi nel cuore di Tokyo", coords: { lat: 35.6764, lng: 139.6993 } },
      { time: "10:30–13:00", title: "Harajuku & Takeshita", icon: "shop", details: "Moda kawaii · Crepe · Bubble tea · Cat Street", coords: { lat: 35.6702, lng: 139.7027 } },
      { time: "14:30–17:30", title: "TeamLab Borderless 🌌", icon: "star", details: "Arte digitale immersiva · Azabudai Hills · Prenota!", coords: { lat: 35.6601, lng: 139.7318 } },
      { time: "17:30–19:00", title: "Shibuya Crossing", icon: "landmark", details: "3.000 persone attraversano contemporaneamente", coords: { lat: 35.6595, lng: 139.7004 } },
      { time: "19:00–23:00", title: "🏎️ Daikoku JDM Car Meet", icon: "star", details: "Tour su GT-R, Supra, RX-7 · Pickup da Tokyo Station", coords: { lat: 35.4587, lng: 139.6675 } },
    ]
  },
  {
    date: "28 DIC", emoji: "🎉", weekday: "LUN", title: "Buon Compleanno! 🎂", subtitle: "Giornata Speciale a Tokyo", city: "Tokyo",
    activities: [
      { time: "08:00–10:00", title: "Colazione a Tsukiji", icon: "food", details: "Sushi freschissimo per il compleanno · Omakase breakfast", coords: { lat: 35.6654, lng: 139.7707 } },
      { time: "10:30–12:00", title: "Yanaka — Vecchia Tokyo", icon: "landmark", details: "Quartiere storico · Yanaka Ginza shopping street", coords: { lat: 35.7270, lng: 139.7690 } },
      { time: "12:30–14:00", title: "Pranzo Omakase 🍣", icon: "food", details: "Ginza · 12-15 pezzi dallo chef · L'esperienza definitiva", coords: { lat: 35.6717, lng: 139.7649 } },
      { time: "16:30–18:00", title: "Shibuya Sky al Tramonto", icon: "star", details: "Terrazza 230m con tramonto per il compleanno", coords: { lat: 35.6584, lng: 139.7022 } },
      { time: "19:00–21:30", title: "Cena di Compleanno 🍾", icon: "food", details: "Fish Bank Tokyo (41° piano) o STEREO Shibuya (38°)", coords: { lat: 35.6585, lng: 139.7580 } },
      { time: "21:30+", title: "Brindisi 🍻", icon: "moon", details: "Golden Gai · Sake & whisky giapponese", coords: { lat: 35.6938, lng: 139.7034 } },
    ]
  },
  {
    date: "29 DIC", emoji: "🧘", weekday: "MAR", title: "Gita a Kamakura", subtitle: "Grande Buddha & Mare d'Inverno", city: "Kamakura",
    activities: [
      { time: "08:00–09:00", title: "Treno per Kamakura", icon: "train", details: "JR Yokosuka Line (~60 min)", coords: { lat: 35.6762, lng: 139.6503 } },
      { time: "09:00–10:30", title: "Tsurugaoka Hachimangu", icon: "landmark", details: "Santuario principale · Komachi-dori shopping", coords: { lat: 35.3259, lng: 139.5563 } },
      { time: "10:30–12:00", title: "Grande Buddha (Daibutsu)", icon: "landmark", details: "Bronzo 13m all'aperto dal 1252 · Entra DENTRO", coords: { lat: 35.3167, lng: 139.5356 } },
      { time: "13:00–15:00", title: "Hokoku-ji — Tempio Bambù", icon: "landmark", details: "2.000 bambù · Più intimo di Arashiyama · Matcha", coords: { lat: 35.3232, lng: 139.5621 } },
      { time: "15:00–16:30", title: "Enoden & Mare", icon: "star", details: "Trenino retrò lungo la costa · Kamakura Kōkōmae", coords: { lat: 35.3061, lng: 139.4915 } },
    ]
  },
  {
    date: "30 DIC", emoji: "🛍️", weekday: "MER", title: "Shopping & Tokyo Tower", subtitle: "Roppongi, Ginza & Izakaya", city: "Tokyo",
    activities: [
      { time: "09:00–11:00", title: "Shinjuku Gyoen", icon: "landmark", details: "Giardino stile giapponese, francese e inglese", coords: { lat: 35.6852, lng: 139.7100 } },
      { time: "11:00–13:00", title: "Roppongi — Arte", icon: "landmark", details: "Mori Art Museum 53° piano + terrazza", coords: { lat: 35.6605, lng: 139.7292 } },
      { time: "14:00–17:00", title: "Shopping Finale", icon: "shop", details: "Uniqlo Ginza 12 piani · Nakano Broadway", coords: { lat: 35.6717, lng: 139.7649 } },
      { time: "17:00–18:30", title: "Tokyo Tower", icon: "landmark", details: "Illuminata d'arancione al tramonto", coords: { lat: 35.6586, lng: 139.7454 } },
      { time: "19:00–21:00", title: "Izakaya", icon: "food", details: "Yakitori, edamame, sake — ordina tutto!", coords: { lat: 35.6896, lng: 139.7006 } },
    ]
  },
  {
    date: "31 DIC", emoji: "🎆", weekday: "GIO", title: "Capodanno Giapponese", subtitle: "Joya no Kane 🔔", city: "Tokyo",
    activities: [
      { time: "12:00–13:30", title: "Toshikoshi Soba", icon: "food", details: "Tradizione: soba l'ultimo giorno — lunga vita!", coords: { lat: 35.6896, lng: 139.7006 } },
      { time: "14:00–17:00", title: "Ueno & Ameya-Yokocho", icon: "shop", details: "Parco, musei, mercato pre-capodanno", coords: { lat: 35.7141, lng: 139.7774 } },
      { time: "17:00–19:00", title: "Cena di San Silvestro", icon: "food", details: "Sukiyaki o shabu-shabu — piatto caldo per la notte", coords: { lat: 35.6896, lng: 139.7006 } },
      { time: "22:00–01:00", title: "Joya no Kane 🔔", icon: "star", details: "108 rintocchi a mezzanotte nei templi buddisti", coords: { lat: 35.6764, lng: 139.6993 } },
    ]
  },
  {
    date: "1 GEN", emoji: "🌅", weekday: "VEN", title: "Hatsumode", subtitle: "Primo Giorno dell'Anno 🎌", city: "Tokyo",
    activities: [
      { time: "Mattina", title: "Hatsumode al Meiji Jingu", icon: "landmark", details: "Prima visita al santuario · Amazake · Omamori · Omikuji", coords: { lat: 35.6764, lng: 139.6993 } },
      { time: "Pomeriggio", title: "Giornata Calma", icon: "coffee", details: "Molti negozi chiusi · Passeggiata · Konbini lunch", coords: { lat: 35.6896, lng: 139.7006 } },
      { time: "Sera", title: "Sera Tranquilla", icon: "moon", details: "Onsen/sento · Cena leggera in izakaya", coords: { lat: 35.6896, lng: 139.7006 } },
    ]
  },
  {
    date: "2 GEN", emoji: "🛍️", weekday: "SAB", title: "Saldi & Tattoo", subtitle: "Fukubukuro & Studio", city: "Tokyo",
    activities: [
      { time: "09:00–12:00", title: "Fukubukuro — Saldi!", icon: "shop", details: "Sacchetti misteriosi di Capodanno · Shibuya 109, Harajuku", coords: { lat: 35.6595, lng: 139.7004 } },
      { time: "13:30–17:30", title: "🎨 Sessione Tattoo", icon: "star", details: "Three Tides / KAGEROU / Studio Muscat · Porta contanti!", coords: { lat: 35.6702, lng: 139.7027 } },
      { time: "19:00–21:00", title: "Ultima Cena Memorabile", icon: "food", details: "Shabu-shabu con wagyu o ultimo yakiniku", coords: { lat: 35.6896, lng: 139.7006 } },
    ]
  },
  {
    date: "3 GEN", emoji: "💛", weekday: "DOM", title: "Ultimo Giorno", subtitle: "Saluti a Tokyo", city: "Tokyo",
    activities: [
      { time: "09:00–11:00", title: "Posti da Rivedere", icon: "star", details: "Torna dove ti è piaciuto di più", coords: { lat: 35.6762, lng: 139.6503 } },
      { time: "11:00–13:00", title: "Ultimo Ramen & Souvenir", icon: "food", details: "Tokyo Station Character Street · Kit Kat speciali", coords: { lat: 35.6812, lng: 139.7671 } },
      { time: "16:00–18:00", title: "Tramonto Finale", icon: "star", details: "Shibuya Sky, Tokyo Tower, o il tuo spot preferito", coords: { lat: 35.6584, lng: 139.7022 } },
      { time: "18:00–21:00", title: "Ultima Sera 💛", icon: "moon", details: "Cena d'addio · Ultimo sake · Arrivederci Tokyo", coords: { lat: 35.6896, lng: 139.7006 } },
    ]
  },
  {
    date: "4 GEN", emoji: "✈️", weekday: "LUN", title: "Partenza", subtitle: "Arrivederci Giappone", city: "Tokyo",
    activities: [
      { time: "Mattina", title: "Aeroporto", icon: "plane", details: "Narita Express ~80 min (¥3.250) o Haneda monorail ~30 min", coords: { lat: 35.7720, lng: 140.3929 } },
      { time: "In aeroporto", title: "Shopping Last Minute", icon: "shop", details: "Royce' Chocolate · Tokyo Banana · Kit Kat regionali · Sake", coords: { lat: 35.7720, lng: 140.3929 } },
    ]
  },
];

const BUDGET_CATS = [
  { id: "alloggi", name: "Alloggi", icon: "🏨", total: 3785, pp: 948, color: "var(--city-kyoto)" },
  { id: "trasporti", name: "Trasporti", icon: "🚄", total: 1152, pp: 288, color: "var(--city-kawaguchiko)" },
  { id: "cibo", name: "Cibo", icon: "🍜", total: 2376, pp: 594, color: "var(--city-osaka)" },
  { id: "attivita", name: "Attività", icon: "🎎", total: 1028, pp: 257, color: "var(--city-hiroshima)" },
  { id: "extra", name: "Extra", icon: "🛍️", total: 1100, pp: 275, color: "var(--city-tokyo)" },
  { id: "altro", name: "Altro", icon: "💴", total: 400, pp: 100, color: "var(--mauve-9)" },
];

const ROUTE = ["Osaka", "Kyoto", "Hiroshima", "Fuji", "Tokyo"];

const CHECKLIST = [
  { id: 1, text: "Ryokan Kawaguchiko (24 dic)", p: "🔴" },
  { id: 2, text: "Appartamento Tokyo MIMARU (25 dic–3 gen)", p: "🔴" },
  { id: 3, text: "Biglietti TeamLab Borderless (27 dic)", p: "🔴" },
  { id: 4, text: "Cena compleanno Fish Bank (28 dic)", p: "🟡" },
  { id: 5, text: "Daikoku JDM Tour (27 dic)", p: "🟡" },
  { id: 6, text: "Tattoo Studio email/IG (2 gen)", p: "🟡" },
  { id: 7, text: "Cerimonia tè + kimono (22 dic)", p: "🟡" },
  { id: 8, text: "Cena wagyu A5", p: "🟢" },
  { id: 9, text: "Attivare Suica/ICOCA all'arrivo", p: "🟢" },
  { id: 10, text: "eSIM / Pocket WiFi", p: "🟢" },
];

// ─── VIEWS ──────────────────────────────────────────────────

function ItineraryView() {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedAct, setExpandedAct] = useState(null);
  const scrollRef = useRef(null);
  const day = DAYS[activeDay];
  const cityColor = CITY_VARS[day.city] || "var(--mauve-9)";

  useEffect(() => {
    setExpandedAct(null);
    if (scrollRef.current?.children[activeDay]) {
      scrollRef.current.children[activeDay].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeDay]);

  return (
    <div style={{ paddingBottom: 72 }}>
      {/* Route bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "12px 16px 0",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {ROUTE.map((city, i) => (
          <div key={city} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <Badge
              variant={day.city === city || (city === "Fuji" && day.city === "Kawaguchiko") ? "ghost" : "outline"}
              color={day.city === city || (city === "Fuji" && day.city === "Kawaguchiko") ? cityColor : undefined}
              style={{ cursor: "default" }}
            >{city}</Badge>
            {i < ROUTE.length - 1 && <ArrowRight size={10} style={{ color: "var(--mauve-7)", flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {/* Day selector */}
      <div ref={scrollRef} style={{
        display: "flex", gap: 2,
        padding: "10px 16px 6px",
        overflowX: "auto", scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {DAYS.map((d, i) => {
          const isActive = i === activeDay;
          const c = CITY_VARS[d.city] || "var(--mauve-9)";
          return (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              flex: "0 0 auto",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, padding: "6px 8px", minWidth: isActive ? 62 : 50,
              background: isActive ? "var(--mauve-3)" : "transparent",
              border: isActive ? `1px solid var(--mauve-5)` : "1px solid transparent",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              <span style={{ fontSize: "1rem", lineHeight: 1 }}>{d.emoji}</span>
              <span style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: "0.625rem", fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--foreground)" : "var(--mauve-9)",
                whiteSpace: "nowrap",
              }}>{d.date}</span>
            </button>
          );
        })}
      </div>

      <Separator />

      {/* Day header */}
      <div style={{ padding: "16px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Badge variant="ghost" color={cityColor}>
            {day.city}
          </Badge>
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: "0.7rem", color: "var(--mauve-9)",
          }}>{day.date} · {day.weekday}</span>
        </div>
        <h2 style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: "1.375rem", fontWeight: 600,
          color: "var(--foreground)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: "0 0 3px",
        }}>{day.title}</h2>
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: "0.8125rem",
          color: "var(--muted-foreground)",
          margin: 0,
        }}>{day.subtitle}</p>
      </div>

      {/* Activities */}
      <div style={{ padding: "0 20px" }}>
        {day.activities.map((act, i) => {
          const isOpen = expandedAct === i;
          return (
            <div
              key={i}
              onClick={() => setExpandedAct(isOpen ? null : i)}
              style={{
                display: "flex", gap: 12, padding: "12px 0",
                borderBottom: "1px solid var(--mauve-3)",
                cursor: "pointer",
                animation: `slideUp 0.3s ease ${i * 0.04}s both`,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 4, minWidth: 32, paddingTop: 2,
              }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{ICON_MAP[act.icon] || "📍"}</span>
                {i < day.activities.length - 1 && (
                  <div style={{
                    flex: 1, width: 1, minHeight: 20,
                    background: "linear-gradient(180deg, var(--mauve-5), transparent)",
                  }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "0.65rem", fontWeight: 500,
                  color: cityColor,
                  letterSpacing: "0.03em",
                }}>{act.time}</span>

                <div style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "0.875rem", fontWeight: 500,
                  color: "var(--foreground)",
                  lineHeight: 1.35,
                  marginTop: 2,
                }}>{act.title}</div>

                {isOpen && (
                  <div style={{ animation: "fadeIn 0.15s ease" }}>
                    <p style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: "0.78rem",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.55,
                      margin: "6px 0 0",
                    }}>{act.details}</p>
                    {act.coords && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${act.coords.lat},${act.coords.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          marginTop: 8, padding: "4px 10px",
                          background: "var(--mauve-3)",
                          border: "1px solid var(--mauve-5)",
                          borderRadius: "var(--radius)",
                          fontSize: "0.68rem", fontWeight: 500,
                          color: "var(--foreground)",
                          textDecoration: "none",
                          fontFamily: "'Geist', sans-serif",
                        }}
                      >
                        <MapPin size={11} /> Apri in Maps
                        <ExternalLink size={9} style={{ opacity: 0.5 }} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div style={{ color: "var(--mauve-7)", paddingTop: 4, flexShrink: 0 }}>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px" }}>
        <Button variant="outline" size="sm" disabled={activeDay === 0}
          onClick={() => setActiveDay(a => a - 1)}
        ><ChevronLeft size={14} /> Precedente</Button>
        <Button variant="outline" size="sm" disabled={activeDay === DAYS.length - 1}
          onClick={() => setActiveDay(a => a + 1)}
        >Successivo <ChevronRight size={14} /></Button>
      </div>
    </div>
  );
}

function MapView() {
  const [selectedDay, setSelectedDay] = useState(null);

  const mapSrc = useMemo(() => {
    if (selectedDay !== null) {
      const d = DAYS[selectedDay];
      const first = d.activities.find(a => a.coords);
      if (first) return `https://maps.google.com/maps?q=${first.coords.lat},${first.coords.lng}&z=13&output=embed`;
    }
    return "https://maps.google.com/maps?q=Japan&z=6&output=embed";
  }, [selectedDay]);

  const mapsLink = useMemo(() => {
    if (selectedDay !== null) {
      const waypoints = DAYS[selectedDay].activities
        .filter(a => a.coords)
        .map(a => `${a.coords.lat},${a.coords.lng}`);
      return `https://www.google.com/maps/dir/${waypoints.join("/")}`;
    }
    return "https://www.google.com/maps/dir/34.6937,135.5023/35.0116,135.7681/34.3853,132.4553/35.5025,138.7658/35.6762,139.6503";
  }, [selectedDay]);

  return (
    <div style={{ paddingBottom: 72 }}>
      <div style={{ padding: "16px 20px 10px" }}>
        <h2 style={{
          fontFamily: "'Geist', sans-serif", fontSize: "1.375rem",
          fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em",
        }}>Mappa del Viaggio</h2>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
          color: "var(--muted-foreground)", marginTop: 2,
        }}>Osaka → Kyoto → Hiroshima → Fuji → Tokyo</p>
      </div>

      {/* Day chips */}
      <div style={{
        display: "flex", gap: 4, padding: "0 20px 10px",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        <Badge
          variant={selectedDay === null ? "default" : "secondary"}
          style={{ cursor: "pointer", padding: "4px 12px" }}
          onClick={() => setSelectedDay(null)}
        >Tutto</Badge>
        {DAYS.map((d, i) => (
          <Badge key={i}
            variant={selectedDay === i ? "ghost" : "secondary"}
            color={selectedDay === i ? CITY_VARS[d.city] : undefined}
            style={{ cursor: "pointer", padding: "4px 10px" }}
            onClick={() => setSelectedDay(i)}
          >{d.emoji} {d.date}</Badge>
        ))}
      </div>

      {/* Map embed */}
      <div style={{
        margin: "0 20px",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        border: "1px solid var(--border)",
        height: 280,
      }}>
        <iframe
          src={mapSrc}
          style={{ width: "100%", height: "100%", border: 0, filter: "saturate(0.85) brightness(0.85)" }}
          allowFullScreen loading="lazy"
        />
      </div>

      {/* Open in Maps */}
      <div style={{ padding: "10px 20px" }}>
        <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <Button variant="outline" style={{ width: "100%", justifyContent: "center" }}>
            <Navigation size={14} />
            {selectedDay !== null ? "Percorso del giorno in Google Maps" : "Itinerario completo in Google Maps"}
            <ExternalLink size={11} style={{ opacity: 0.5 }} />
          </Button>
        </a>
      </div>

      {/* Stops list */}
      <div style={{ padding: "4px 20px" }}>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.7rem",
          fontWeight: 500, color: "var(--muted-foreground)",
          letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 6,
        }}>{selectedDay !== null ? "Tappe del giorno" : "Percorso"}</p>

        <Card style={{ overflow: "hidden" }}>
          {selectedDay !== null ? (
            DAYS[selectedDay].activities.filter(a => a.coords).map((act, i, arr) => (
              <a key={i}
                href={`https://www.google.com/maps/search/?api=1&query=${act.coords.lat},${act.coords.lng}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--mauve-3)" : "none",
                  textDecoration: "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--mauve-3)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--mauve-4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Geist', sans-serif", fontSize: "0.65rem",
                  fontWeight: 600, color: "var(--foreground)", flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
                    fontWeight: 500, color: "var(--foreground)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{act.title}</div>
                  <div style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.68rem",
                    color: "var(--muted-foreground)",
                  }}>{act.time}</div>
                </div>
                <ExternalLink size={12} style={{ color: "var(--mauve-7)", flexShrink: 0 }} />
              </a>
            ))
          ) : (
            ROUTE.map((city, i) => (
              <div key={city} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px",
                borderBottom: i < ROUTE.length - 1 ? "1px solid var(--mauve-3)" : "none",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: CITY_VARS[city] || "var(--mauve-9)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
                  fontWeight: 500, color: "var(--foreground)", flex: 1,
                }}>{city}</span>
                {i < ROUTE.length - 1 && <ChevronRight size={12} style={{ color: "var(--mauve-7)" }} />}
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

function ExpensesView() {
  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ desc: "", amount: "", category: "cibo", paidBy: "" });
  const members = ["Io", "Persona 2", "Persona 3", "Persona 4"];

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = 10440;

  const catSpent = useMemo(() => {
    const m = {};
    expenses.forEach(e => { m[e.category] = (m[e.category] || 0) + e.amount; });
    return m;
  }, [expenses]);

  const addExpense = () => {
    if (!form.desc || !form.amount || !form.paidBy) return;
    setExpenses(p => [...p, { ...form, amount: parseFloat(form.amount), id: Date.now(), date: new Date().toLocaleDateString("it-IT") }]);
    setForm({ desc: "", amount: "", category: "cibo", paidBy: "" });
    setShowAdd(false);
  };

  return (
    <div style={{ paddingBottom: 72 }}>
      <div style={{ padding: "16px 20px 10px" }}>
        <h2 style={{
          fontFamily: "'Geist', sans-serif", fontSize: "1.375rem",
          fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em",
        }}>Gestione Spese</h2>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
          color: "var(--muted-foreground)", marginTop: 2,
        }}>4 persone · Budget €{totalBudget.toLocaleString()}</p>
      </div>

      {/* Overview card */}
      <div style={{ padding: "0 20px 12px" }}>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div>
              <div style={{
                fontFamily: "'Geist', sans-serif", fontSize: "1.75rem",
                fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em",
              }}>€{totalSpent.toFixed(0)}</div>
              <div style={{
                fontFamily: "'Geist', sans-serif", fontSize: "0.7rem",
                color: "var(--muted-foreground)",
              }}>di €{totalBudget.toLocaleString()} budget</div>
            </div>
            <Badge variant={totalSpent <= totalBudget ? "ghost" : "default"}
              color={totalSpent <= totalBudget ? "var(--green-9)" : undefined}
            >
              {Math.round((totalSpent / totalBudget) * 100)}%
            </Badge>
          </div>
          <Progress value={totalSpent} max={totalBudget}
            color={totalSpent <= totalBudget ? "var(--green-9)" : "var(--red-9)"}
          />
        </Card>
      </div>

      {/* Categories */}
      <div style={{ padding: "0 20px 12px" }}>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.7rem", fontWeight: 500,
          color: "var(--muted-foreground)", letterSpacing: "0.04em",
          textTransform: "uppercase", marginBottom: 8,
        }}>Per Categoria</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {BUDGET_CATS.map(cat => {
            const spent = catSpent[cat.id] || 0;
            return (
              <Card key={cat.id} style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: "0.9rem" }}>{cat.icon}</span>
                  <span style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.7rem",
                    color: "var(--muted-foreground)",
                  }}>{cat.name}</span>
                </div>
                <div style={{
                  fontFamily: "'Geist', sans-serif", fontSize: "0.9rem",
                  fontWeight: 600, color: "var(--foreground)",
                }}>
                  €{spent.toFixed(0)}
                  <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--mauve-8)" }}> / €{cat.total}</span>
                </div>
                <Progress value={spent} max={cat.total} color={cat.color} style={{ marginTop: 6 }} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add button */}
      <div style={{ padding: "0 20px 8px" }}>
        <Button onClick={() => setShowAdd(true)} style={{ width: "100%", justifyContent: "center" }}>
          <Plus size={15} /> Aggiungi Spesa
        </Button>
      </div>

      {/* Sheet for adding */}
      <Sheet open={showAdd} onClose={() => setShowAdd(false)}>
        <div style={{ padding: "16px 20px 28px" }}>
          <h3 style={{
            fontFamily: "'Geist', sans-serif", fontSize: "1.1rem",
            fontWeight: 600, color: "var(--foreground)", marginBottom: 16,
          }}>Nuova Spesa</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Descrizione" value={form.desc}
              onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              style={{
                padding: "10px 12px", background: "var(--mauve-3)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                color: "var(--foreground)", fontFamily: "'Geist', sans-serif", fontSize: "0.85rem",
              }} />
            <input placeholder="Importo €" type="number" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              style={{
                padding: "10px 12px", background: "var(--mauve-3)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                color: "var(--foreground)", fontFamily: "'Geist', sans-serif", fontSize: "0.85rem",
              }} />

            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: "0.7rem", color: "var(--muted-foreground)", margin: 0 }}>Categoria</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {BUDGET_CATS.map(c => (
                <Badge key={c.id}
                  variant={form.category === c.id ? "ghost" : "secondary"}
                  color={form.category === c.id ? c.color : undefined}
                  style={{ cursor: "pointer", padding: "4px 10px" }}
                  onClick={() => setForm(p => ({ ...p, category: c.id }))}
                >{c.icon} {c.name}</Badge>
              ))}
            </div>

            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: "0.7rem", color: "var(--muted-foreground)", margin: 0 }}>Chi ha pagato?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {members.map(m => (
                <Badge key={m}
                  variant={form.paidBy === m ? "default" : "secondary"}
                  style={{ cursor: "pointer", padding: "4px 12px" }}
                  onClick={() => setForm(p => ({ ...p, paidBy: m }))}
                >{m}</Badge>
              ))}
            </div>

            <Button onClick={addExpense} style={{ marginTop: 4, justifyContent: "center" }}>
              Aggiungi
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Expense list */}
      <div style={{ padding: "0 20px" }}>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.7rem", fontWeight: 500,
          color: "var(--muted-foreground)", letterSpacing: "0.04em",
          textTransform: "uppercase", marginBottom: 6,
        }}>Recenti ({expenses.length})</p>

        {expenses.length === 0 ? (
          <Card style={{
            padding: "28px 20px", textAlign: "center",
            fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
            color: "var(--mauve-8)",
          }}>
            Nessuna spesa ancora. Tocca "Aggiungi Spesa" per iniziare.
          </Card>
        ) : (
          <Card style={{ overflow: "hidden" }}>
            {expenses.slice().reverse().map((e, i, arr) => {
              const cat = BUDGET_CATS.find(c => c.id === e.category);
              return (
                <div key={e.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--mauve-3)" : "none",
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{cat?.icon || "💴"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
                      fontWeight: 500, color: "var(--foreground)",
                    }}>{e.desc}</div>
                    <div style={{
                      fontFamily: "'Geist', sans-serif", fontSize: "0.65rem",
                      color: "var(--muted-foreground)",
                    }}>{e.paidBy} · {e.date}</div>
                  </div>
                  <span style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.875rem",
                    fontWeight: 600, color: "var(--foreground)",
                  }}>€{e.amount.toFixed(0)}</span>
                  <button onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--mauve-7)", padding: 4,
                  }}><Trash2 size={13} /></button>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}

function GroupView() {
  const [members, setMembers] = useState([
    { id: 1, name: "Io", emoji: "👤", color: "var(--red-9)" },
    { id: 2, name: "Persona 2", emoji: "🧑", color: "var(--blue-9)" },
    { id: 3, name: "Persona 3", emoji: "👩", color: "var(--green-9)" },
    { id: 4, name: "Persona 4", emoji: "🌸", color: "var(--amber-9)" },
  ]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [checkOpen, setCheckOpen] = useState(false);
  const [checked, setChecked] = useState({});

  const emojis = ["👤", "🧑", "👩", "🧔", "👱", "🌸", "⭐", "🎌", "🦊", "🐱"];

  return (
    <div style={{ paddingBottom: 72 }}>
      <div style={{ padding: "16px 20px 10px" }}>
        <h2 style={{
          fontFamily: "'Geist', sans-serif", fontSize: "1.375rem",
          fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.02em",
        }}>Il Gruppo</h2>
        <p style={{
          fontFamily: "'Geist', sans-serif", fontSize: "0.8125rem",
          color: "var(--muted-foreground)", marginTop: 2,
        }}>4 viaggiatori · 18 giorni</p>
      </div>

      {/* Members */}
      <div style={{ padding: "0 20px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {members.map(m => (
          <Card key={m.id} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => {
                const idx = emojis.indexOf(m.emoji);
                setMembers(prev => prev.map(x => x.id === m.id ? { ...x, emoji: emojis[(idx + 1) % emojis.length] } : x));
              }}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--mauve-3)",
                border: "1px solid var(--mauve-5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", cursor: "pointer", flexShrink: 0,
              }}
            >{m.emoji}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {editId === m.id ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { setMembers(p => p.map(x => x.id === m.id ? { ...x, name: editName } : x)); setEditId(null); } }}
                    autoFocus
                    style={{
                      flex: 1, padding: "6px 10px",
                      background: "var(--mauve-3)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius)", color: "var(--foreground)",
                      fontFamily: "'Geist', sans-serif", fontSize: "0.85rem",
                      outline: "none",
                    }} />
                  <Button size="icon" onClick={() => {
                    setMembers(p => p.map(x => x.id === m.id ? { ...x, name: editName } : x));
                    setEditId(null);
                  }}><Check size={14} /></Button>
                </div>
              ) : (
                <>
                  <div style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.875rem",
                    fontWeight: 500, color: "var(--foreground)",
                  }}>{m.name}</div>
                  <div style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.68rem",
                    color: "var(--muted-foreground)",
                  }}>~€2.610 budget</div>
                </>
              )}
            </div>

            {editId !== m.id && (
              <button onClick={() => { setEditId(m.id); setEditName(m.name); }} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--mauve-8)", padding: 4,
              }}><Edit3 size={14} /></button>
            )}
          </Card>
        ))}
      </div>

      {/* Budget breakdown */}
      <div style={{ padding: "0 20px 12px" }}>
        <Card style={{ padding: "14px 16px" }}>
          <p style={{
            fontFamily: "'Geist', sans-serif", fontSize: "0.7rem", fontWeight: 500,
            color: "var(--red-11)", letterSpacing: "0.04em", textTransform: "uppercase",
            marginBottom: 10,
          }}>Budget / Persona</p>
          {[
            ["Alloggi", "€948"], ["Trasporti", "€288"], ["Cibo (18gg)", "€594"],
            ["Attività + Tour", "€257"], ["Wagyu + Bday", "€175"], ["Extra & Shopping", "€275"],
          ].map(([label, val], i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "'Geist', sans-serif", fontSize: "0.78rem",
              padding: "4px 0",
            }}>
              <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
              <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
          <Separator style={{ margin: "8px 0" }} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: "'Geist', sans-serif",
          }}>
            <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>Totale</span>
            <span style={{
              fontSize: "1rem", fontWeight: 700,
              color: "var(--primary)", letterSpacing: "-0.02em",
            }}>~€2.610</span>
          </div>
        </Card>
      </div>

      {/* Checklist */}
      <div style={{ padding: "0 20px 12px" }}>
        <Card style={{ overflow: "hidden" }}>
          <button onClick={() => setCheckOpen(!checkOpen)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--foreground)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={15} style={{ color: "var(--primary)" }} />
              <span style={{
                fontFamily: "'Geist', sans-serif", fontSize: "0.85rem", fontWeight: 500,
              }}>Prenotazioni Urgenti</span>
              <Badge variant="secondary" style={{ fontSize: "0.6rem" }}>
                {Object.values(checked).filter(Boolean).length}/{CHECKLIST.length}
              </Badge>
            </div>
            {checkOpen ? <ChevronUp size={14} style={{ color: "var(--mauve-8)" }} /> : <ChevronDown size={14} style={{ color: "var(--mauve-8)" }} />}
          </button>

          {checkOpen && (
            <div style={{ borderTop: "1px solid var(--mauve-3)" }}>
              {CHECKLIST.map(item => (
                <div key={item.id}
                  onClick={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--mauve-3)",
                    cursor: "pointer",
                    opacity: checked[item.id] ? 0.45 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `1.5px solid ${checked[item.id] ? "var(--green-9)" : "var(--mauve-6)"}`,
                    background: checked[item.id] ? "rgba(48,164,108,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s",
                  }}>
                    {checked[item.id] && <Check size={11} style={{ color: "var(--green-9)" }} />}
                  </div>
                  <span style={{ fontSize: "0.75rem", flexShrink: 0 }}>{item.p}</span>
                  <span style={{
                    fontFamily: "'Geist', sans-serif", fontSize: "0.78rem",
                    color: "var(--foreground)", flex: 1,
                    textDecoration: checked[item.id] ? "line-through" : "none",
                  }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Share */}
      <div style={{ padding: "0 20px" }}>
        <Button variant="outline" style={{ width: "100%", justifyContent: "center" }}>
          <Share2 size={14} /> Condividi con il Gruppo
        </Button>
      </div>
    </div>
  );
}

// ─── SPLASH ─────────────────────────────────────────────────
function Splash({ onEnter }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "var(--background)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: vis ? 1 : 0, transition: "opacity 0.5s ease",
    }}>
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 35%, rgba(229,72,77,0.06) 0%, transparent 65%)",
      }} />

      <div style={{
        fontSize: "clamp(3.5rem, 10vw, 6rem)", lineHeight: 1,
        animation: "float 3.5s ease-in-out infinite",
        marginBottom: 16,
        filter: "drop-shadow(0 0 20px rgba(229,72,77,0.2))",
      }}>⛩️</div>

      <span style={{
        fontFamily: "'Noto Serif JP', serif",
        fontSize: "0.75rem", letterSpacing: "0.35em",
        color: "var(--red-11)", opacity: 0.7,
        marginBottom: 6,
      }}>日本 2026</span>

      <h1 style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
        fontWeight: 700, color: "var(--foreground)",
        letterSpacing: "-0.03em", margin: 0, textAlign: "center",
      }}>Il Mio Primo Viaggio</h1>
      <h2 style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
        fontWeight: 400, color: "var(--primary)",
        letterSpacing: "-0.02em", margin: "2px 0 0",
      }}>in Giappone</h2>

      <p style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: "0.72rem", color: "var(--muted-foreground)",
        letterSpacing: "0.12em", marginTop: 12, marginBottom: 32,
      }}>18 DICEMBRE 2026 — 4 GENNAIO 2027</p>

      <Button onClick={onEnter} variant="outline" size="lg" style={{
        letterSpacing: "0.08em", fontSize: "0.78rem",
      }}>
        Inizia il viaggio <ArrowRight size={14} />
      </Button>
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────
function Nav({ active, onNav }) {
  const items = [
    { id: "itinerary", icon: Calendar, label: "Itinerario" },
    { id: "map", icon: Map, label: "Mappa" },
    { id: "expenses", icon: Wallet, label: "Spese" },
    { id: "group", icon: Users, label: "Gruppo" },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(18,17,19,0.92)",
      backdropFilter: "blur(16px) saturate(180%)",
      WebkitBackdropFilter: "blur(16px) saturate(180%)",
      borderTop: "1px solid var(--mauve-4)",
      display: "flex",
      padding: "4px 0 env(safe-area-inset-bottom, 6px)",
      maxWidth: 480, margin: "0 auto",
    }}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 1, padding: "7px 0",
            background: "none", border: "none", cursor: "pointer",
            color: isActive ? "var(--primary)" : "var(--mauve-8)",
            transition: "color 0.15s",
          }}>
            <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: "0.58rem", fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.02em",
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── APP ────────────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("itinerary");
  const [ready, setReady] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--background)",
      color: "var(--foreground)",
      fontFamily: "'Geist', sans-serif",
      maxWidth: 480, margin: "0 auto",
      position: "relative",
    }}>
      <style>{DESIGN_SYSTEM_CSS}</style>

      {splash && <Splash onEnter={() => { setSplash(false); setTimeout(() => setReady(true), 30); }} />}

      {!splash && (
        <div style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}>
          {tab === "itinerary" && <ItineraryView />}
          {tab === "map" && <MapView />}
          {tab === "expenses" && <ExpensesView />}
          {tab === "group" && <GroupView />}
          <Nav active={tab} onNav={setTab} />
        </div>
      )}
    </div>
  );
}
