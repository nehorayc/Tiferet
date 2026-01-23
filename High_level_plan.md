Here is the complete, technical architectural blueprint designed specifically for a **Coding Agent** (like Cursor, GitHub Copilot, or ChatGPT).

You can copy-paste this entire block directly to the agent.

---

# Project Brief: Synagogue Digital Signage System (Hebrew)

**Role:** Senior Frontend Architect
**Objective:** Build a maintenance-free, serverless digital signage web app for a Synagogue.
**Language:** Hebrew (UI and Content). `dir="rtl"` is mandatory.
**Stack:** React (Vite), Tailwind CSS, GitHub Pages (Hosting), Google Sheets (Database).

## 1. System Architecture

*   **Database:** Google Sheets (Publicly published as CSV). No backend server.
*   **Data Fetching:** Client-side polling (every 5 minutes) using `PapaParse` for CSV.
*   **External Data:** `Hebcal` API for Jewish times/dates.
*   **Routing:** None (Single Page Application).
*   **State Management:** React `useState` / `useEffect` context.

## 2. Google Sheets Schema (The "Database")

The agent should assume the Google Sheet has two tabs.

### Tab 1: `Settings` (Config)
| Key | Value | Description |
| :--- | :--- | :--- |
| `ShulName` | בית כנסת הגדול | Displayed in header |
| `City` | Jerusalem | For Hebcal Zmanim |
| `SlideDuration` | 15 | Seconds per slide |
| `ThemeColor` | blue | blue/gold/dark |

### Tab 2: `Messages` (Content)
*Columns must match these exact headers for parsing:*

1.  `id` (Unique ID)
2.  `title` (String - Header text)
3.  `body` (String - Main content)
4.  `type` (Enum: `info`, `alert`, `mazaltov`, `memorial`, `times`, `image`)
5.  `startDate` (DD/MM/YYYY - Show from this date)
6.  `endDate` (DD/MM/YYYY - Stop showing after this date)
7.  `imageUrl` (Optional - for `image` type)

## 3. Implementation Specifications

### A. Tech Stack & Libraries
*   **Framework:** React + Vite
*   **Styling:** Tailwind CSS (ensure `tailwindcss-rtl` plugin or manual `dir="rtl"` logic).
*   **Icons:** `lucide-react` or `react-icons/fa`.
*   **CSV Parsing:** `papaparse`.
*   **Date Handling:** `date-fns` (or native JS) + `hebcal` API.

### B. Component Structure

#### 1. `App.jsx` (Main Controller)
*   **Layout:** Grid layout.
    *   **Right Sidebar (25% width):** Static Information (Clock, Zmanim).
    *   **Main Content (75% width):** The Carousel.
*   **Logic:**
    *   `useEffect`: Fetch Google Sheet CSV every 5 minutes.
    *   `useEffect`: Fetch Hebcal API once per day (or every 4 hours).
    *   `Filter`: Remove rows where `today < startDate` or `today > endDate`.

#### 2. `Sidebar.jsx` (Static Info)
*   **Clock:** Large digital clock (HH:MM:SS).
*   **Date:** Hebrew Date (fetched from Hebcal) & Gregorian Date (Hebrew locale).
*   **Zmanim List:**
    *   Fetch from: `https://www.hebcal.com/zmanim?cfg=json&geonameid=[CITY_ID]`
    *   Display: Alot HaShachar, Netz, Shkiah, Tzet HaKochavim.
    *   **Highlight:** Logic to highlight the *next* upcoming Zman.

#### 3. `Carousel.jsx` (The Rotator)
*   Uses `setInterval` based on `Settings.SlideDuration`.
*   Iterates through the `messages` array.
*   Renders the specific "Slide Component" based on `message.type`.

#### 4. `SlideCard.jsx` (The UI Factory)
*   Accepts `data` prop.
*   **Visual Logic based on `type`:**

| Type | Hebrew Label | Icon (Lucide/FA) | Color Theme | Layout |
| :--- | :--- | :--- | :--- | :--- |
| `info` | הודעה | `Info` | White/Blue | Title + Text |
| `alert` | שים לב | `TriangleAlert` | Red/White | Large Text, BOLD |
| `mazaltov` | מזל טוב | `Wine` (or Party) | Gold/White | Fancy Font, Centered |
| `memorial` | לעילוי נשמת | `Flame` (Candle) | Black/Grey | Subdued, Text |
| `times` | זמני תפילה | `Scroll` | Blue/White | List view (Schedule) |
| `image` | פלייר | None | Full Screen | `object-fit: contain` |

### C. Styling Rules (Tailwind)
*   **Fonts:** Use a clean Hebrew font like `Heebo` or `Assistant` (Google Fonts).
*   **Accessibility:** High contrast (it is a TV screen viewed from 3 meters away).
*   **Animation:** specific CSS fade-in/slide-in for slide transitions.

## 4. Specific Code Prompts (Copy these for the Agent)

**Prompt for Data Fetching:**
> "Create a hook `useGoogleSheets` that uses `papaparse` to fetch a CSV from a public Google Sheets URL. It should convert the CSV rows into a JSON array. It needs to handle Hebrew characters correctly (UTF-8). Filter out any rows where the current date is outside the `startDate` and `endDate` range."

**Prompt for Hebcal Integration:**
> "Create a function to fetch Zmanim from Hebcal for Jerusalem (Geoname ID: 281184). The output should display the Hebrew Date (e.g., 'ג׳ בְּאִיָּיר תשפ״ד') and a list of upcoming prayer times. Translate the keys (e.g., 'sunset') into Hebrew (e.g., 'שקיעה')."

**Prompt for Slide Component:**
> "Create a React component called `SlideCard`. It takes a prop `message`. Use a `switch` statement on `message.type`.
>
> 1. If `mazaltov`: Use a festive gold border, a wine glass icon, and a centered layout.
> 2. If `alert`: Use a red background with white text and a warning icon.
> 3. If `image`: Display the `imageUrl` taking up 100% height and width.
>
> Ensure all text is aligned Right (RTL)."

## 5. Deployment Strategy
1.  **Build:** `npm run build`
2.  **Repo:** Push to GitHub.
3.  **Host:** Enable GitHub Pages on the `/dist` folder.
4.  **Setup:** Connect the synagogue TV to the GitHub Pages URL in "Kiosk Mode" (F11).