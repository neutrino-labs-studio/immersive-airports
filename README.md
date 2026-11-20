<p align="center">
  <img src="https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-5.0.0-hero.JPEG" alt="Immersive Airports for GeoFS" width="100%">
</p>

<p align="center">
  <strong>Airport ground operations, made smart.</strong>
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-beta.user.js">
    <img src="https://img.shields.io/badge/INSTALL-v5.0.0%20BETA-FFD21A?style=for-the-badge&labelColor=17191B" alt="Install Immersive Airports v5.0.0 Beta">
  </a>
</p>

<p align="center">
  <sub>
    <a href="https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports.user.js">Prefer the stable version? Install v4.8.5</a>
    &nbsp;·&nbsp;
    <a href="#the-apron-alive-update">Explore what's new</a>
  </sub>
</p>




<a id="the-apron-alive-update"></a>
## **v5.0.0 BETA** · The Apron Alive Update Is Here!

We've been working on something pretty exciting lately!

One thing we've always wanted to do with Immersive Airports is make airports feel a little more alive. We've already got taxiways, parking stands and marshallers, but we felt there was still room for something new.

So we decided to take things a step further.
<br><br>

### Meet the New Follow Me Car!

Yep, you can now have your very own **Follow Me car** guiding you around the airport and all the way to your selected parking stand!

The beta also expands airport navigation and adds optional ground-handling tools.
<br><br>
### What's included?
- **3D Follow Me vehicle**: Route guidance to a selected stand, adjustable lead distance, smooth vehicle movement and a nighttime beacon.
- **Airport-wide moving map**: Wider ground-data coverage, with aircraft tracking, zooming and panning.
- **Stand List**: Browse and select stands, grouped by airport area when the available data supports it.
- **Destination preloading**: Prepare destination-airport data from a usable GeoFS flight plan before arrival.
- **Ground-handling extras**: Optional Ground Grip Physics, Turn Aid and a draggable throttle visualizer.
- **Several Bug Fixes**

> **Beta release:** Features may behave differently across airports and aircraft. Routing and stand coverage depend on available OpenStreetMap data. Please [report reproducible issues](https://github.com/neutrino-labs-studio/immersive-airports/issues).

**Stable and Beta are separate installations.** To try the beta, disable the Stable userscript in Tampermonkey first. You can switch back by disabling Beta and re-enabling Stable.



## About

Immersive Airports is the addon designed to completely revamp ground operations in GeoFS with dynamic airport overlays, automatic airport awareness, moving maps, stand guidance and animated marshalling.

<details>
<summary><strong>💬 Message from the team</strong></summary>

<br>

Playing GeoFS for several years, we always felt like airports were one of the hardest parts of the experience to properly use.

Like many other players trying to simulate real flights, we often ended up parking somewhere that simply felt right, taxiing along routes we could barely make out, and never really knowing whether the airport we were flying to would actually be easy to navigate once we got there.

That never sat quite right with us, because it felt like the missing piece of a puzzle GeoFS had already solved almost everywhere else.

Throughout the development of Immersive Airports, we spent a lot of time flying with different beta versions, testing features, changing things, breaking things, and figuring out what actually made ground operations feel better.

And at this point, the truth is that GeoFS feels incomplete to us without it installed.

Most of the time, Immersive Airports simply sits in the background and takes care of things by itself. It knows where you are, remembers your preferences from one session to another, and gives you a much more enjoyable ground experience without constantly asking for your attention.

There is something genuinely satisfying about approaching a selected stand and suddenly seeing the marshaller come to life and guide you into position without you having to press a single button.

Coming from people who actually play GeoFS, this is the add-on we always wanted to have ourselves.

**Have fun with it, and enjoy Immersive Airports as much as we do! ˙ᵕ˙**

</details>

<p align="center">
  <img src="https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-hero.jpeg" alt="Immersive Airports for GeoFS" width="90%">
</p>

## Features

- Dynamic taxiway and airport ground overlays
- Live moving map with aircraft tracking
- Automatic airport detection and loading
- Taxiway and runway awareness notifications
- Stand selection and visual guidance
- Automatic animated marshaller display with directional instructions
- Automatic departure cleanup and arrival preparation

For new beta-only features, see [The Apron Alive Update](#the-apron-alive-update).

## Installation

### 1. Install Tampermonkey

Install the Tampermonkey browser extension if you do not already have it.

### 2. Choose your version

Use the **Beta** installation button or the **Stable** download link at the top of this page. Tampermonkey will open an installation screen; confirm to install.

**Only enable one version at a time.** If you already use Stable, disable it in Tampermonkey before enabling Beta. The two versions have separate update channels.

### 3. Launch GeoFS

Open GeoFS normally. Immersive Airports will start once the simulator is ready.

## Short Manual

### Main controls

| Button | Function |
|---|---|
| **TWY** | Opens the airport controls and loading status. When airborne, this becomes **ARR** for selecting your arrival airport. |
| **NOTIF** | Turns taxiway, runway and speed notifications on or off. |
| **STD** | Opens the stand locator, marshaller and stopping-position calibration controls. |
| **MAP** | Opens or closes the live airport moving map. |
| **EXTRAS** *(Beta)* | Opens optional ground-handling tools. |

### Airport controls

| Control | Function |
|---|---|
| **Taxiway labels** | Shows or hides taxiway names. |
| **Stand lead-in lines** | Shows or hides parking guidance lines. |
| **Stand numbers** | Shows or hides stand labels. |
| **Auto-load airports** | Automatically loads the airport around your aircraft. |
| **Load airport** | Manually loads or refreshes airport data. |
| **Reset** | Clears the currently loaded airport. |
| **Modify ARR** | Releases the selected arrival so you can choose another one. Press twice to confirm. |

### Stand controls

| Control | Function |
|---|---|
| **FIND** | Selects the stand entered in the search box. |
| **STAND LIST** *(Beta)* | Opens the browsable stand list. |
| **Follow-me vehicle** *(Beta)* | Turns the 3D escort vehicle on or off. Select a stand to request guidance. |
| **Follow-me distance − / +** *(Beta)* | Adjusts how far ahead the escort vehicle travels. |
| **Marshaller guidance** | Enables or disables the animated marshaller. |
| **STOP OFFSET − / +** | Adjusts where the aircraft should stop relative to the stand point. |
| **CLEAR LOCATOR** | Removes the selected stand and its guidance. |

### Moving map controls

| Control | Function |
|---|---|
| **FOLLOW / LOCK** | Switches between following the aircraft and keeping the map at a selected position. |
| **− / +** | Zooms the moving map out or in. |
| **×** | Closes the moving map. |

### Extras (Beta)

| Control | Function |
|---|---|
| **Ground Grip Physics** | Adjusts ground grip and steering response. |
| **Throttle visualizer** | Displays throttle input in a draggable overlay. |
| **TURN AID** | Optional tighter turning response; intended for taxiing only. |

## How it works

Immersive Airports continuously responds to the aircraft, flight phase and surrounding airport environment. It's made to combine intelligent airport detection, chunked geographic-data loading, local caching and live ground guidance into one integrated system.

<details>
<summary><strong>The fancy tech behind Immersive Airports</strong></summary>

### It knows its airports

The addon monitors the aircraft’s position and automatically identifies the active airport. It manages departure cleanup, arrival preparation and destination selection as the flight progresses. 

### Smart data loading

Airport geometry is retrieved from OpenStreetMap through multiple public Overpass API services. Large airports are divided into manageable geographic chunks and loaded progressively.

Our system includes:

- Multiple-server failover
- Controlled concurrent requests
- Request spacing and timeout handling
- Automatic retries
- Duplicate-request prevention
- Coalesced rendering updates

### It also remembers airports (local airport cache)

Downloaded airport data is stored locally in the browser. Returning to a previously visited airport can therefore take only seconds while reducing unnecessary requests to public data services.

### Dynamic ground environment

Airport data is converted into an interactive environment containing taxiway overlays, labels, stand positions, lead-in guidance, awareness zones and moving-map geometry.

### Live flight integration

The system continuously synchronizes with the aircraft to provide moving-map tracking, taxiway and runway notifications, departure cleanup, arrival preparation and stand-distance calculations.

### Stand guidance and marshalling

After selecting a stand, Immersive Airports calculates the aircraft’s position relative to the parking point and lead-in direction. Guidance transitions into dynamic marshalling instructions as the aircraft approaches.

### Beta: Follow Me and arrival preparation

Follow Me uses available taxiway and parking geometry to plan a route to the selected stand. The vehicle moves independently of the aircraft with speed smoothing and an adjustable lead distance; a complete route is not guaranteed at every airport.

When a usable destination is available in the GeoFS flight plan, the beta can preload airport data before arrival.

</details>

<p align="center">
  <img src="https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-before-after.jpeg"
       alt="GeoFS before and after using Immersive Airports"
       width="100%">
</p>

## Compatibility

### Recommended

- The latest version of Google Chrome or Microsoft Edge
- A computer capable of running GeoFS smoothly with hardware acceleration
- A stable internet connection for downloading airport geographic data
- Close unnecessary browser tabs when loading particularly large airports

Performance and loading time depend on the size of the airport, the amount of available geographic data and the response time of the public data servers.

Airport detail and feature availability depend on the geographic data available for each location.

### Recommended companion addon

For an even more immersive airport experience, pair Immersive Airports with the [Taxiway Lights addon](https://github.com/tylerbmusic/GeoFS-Taxiway-Lights/blob/main/userscript.js).

## Updates

Stable and Beta use different userscripts and update URLs:

- **Stable:** `immersive-airports.user.js` — stable releases.
- **Beta:** `immersive-airports-beta.user.js` — experimental releases, starting with `5.0.0-beta.1`.

Tampermonkey can check for updates to the version you installed. Existing Stable installations do **not** automatically switch to Beta.

## Support

For product information and guidance, visit the [Immersive Airports website](https://sites.google.com/view/immersive-airports/takeoff).

Problems and bug reports can be submitted through the repository’s [Issues](https://github.com/neutrino-labs-studio/immersive-airports/issues) page. For beta reports, please include the version, airport ICAO, aircraft type and steps to reproduce the issue.

### Data accuracy

Immersive Airports generates airport overlays using OpenStreetMap (OSM) data. If taxiways, stands or markings do not align perfectly with the airport shown in GeoFS, this is usually caused by differences between the OSM data and GeoFS scenery, not by the addon itself.

Overlay accuracy therefore depends on the quality and currency of the available OSM data for each airport.

## Attribution

Airport geographic data is provided by [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) through public Overpass API services.

Immersive Airports is an independent project and is not affiliated with or endorsed by GeoFS.

---

<p align="center">
  <strong>Immersive Airports</strong><br>
  A Neutrino Labs project
</p>

<p align="center">
  © 2026 Neutrino Labs. All rights reserved.
</p>
