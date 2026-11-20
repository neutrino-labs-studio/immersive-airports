// ==UserScript==
// @name         Immersive Airports BETA
// @namespace    neutrino.labs
// @version      5.0.0-beta.4
// @description  Airport ground operations for GeoFS. Taxiway overlays, moving maps, stand guidance, marshalling and optional ground-grip physics.
// @author       Neutrino Labs
// @homepageURL  https://github.com/neutrino-labs-studio/immersive-airports
// @supportURL   https://github.com/neutrino-labs-studio/immersive-airports/issues
// @updateURL    https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-beta.user.js
// @downloadURL  https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-beta.user.js
// @icon         https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-icon.png
// @icon64       https://raw.githubusercontent.com/neutrino-labs-studio/immersive-airports/main/immersive-airports-icon.png
// @match        https://geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function() {
    "use strict";
    const OVERPASS_SERVERS = [ "https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter" ];
    const BRAND_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAkCAYAAACaJFpUAAAFMUlEQVR42q1WXWwUVRT+zt3Zn+62bMvSsvy0BgRKICISIpCKbYnRBxIJQklAkAcRMCE2wQfEAMPGBGKMT8QEEjWEF7ArkhhiNQV3t/+lW0BBNFWg0GLNsuzCLt2f2Z05PsxCTYH9izeZTGbm3vnu991zvnMAAMzQBzNCvY1b4l3V3el2B/Olycy9k1npdF6Pdr3kutbW5gAAbkHxg1kGANxoba5NdNe08zUbKx3lD2O+aa0R3+yvYh01LUmf4yZfsbHSUzV817d2FQC0tDQVB0gAhns+mJvonRLgSzYOtS860Nf3nQOQMl8NADOCXavWK732UKq/XA11bHxFZ1oEqIcZce/0Pu2yjYfa3lytg+iysSdzz8z9y7tvbupC2b1kR9WQ389g+T/Hke+I9tRv5mtWDpxbcgAA+OrTfzL4wxwAQOj8q5v4DyuHfC/vAgD21BcGGPNM8ysdFZHOTgYzIMvyM85av475GUp7+WjCUznSclVfUxDJVHuFNvaz8zwg5ZRHj06BZGf1af7dzOGuVesLZSkkK5Oq4S4jlXt2JkZSqjEBTrFR+XM3mAGvL39ACIIQRARD7tnuTGQTJMQ0slrCK8J9axrJBTA35QnIDEDkt73MPwUpIp2uUlU2pc1jA3sACXC78wRMq4Agymu2+9EisqRj2uiYOuukpSLyxl3/zvnYMG4i2QF1XQuKbI0EGwyKMWTb9DkJwPrwxw8JBMCVB2Ce5CbkiMYQk2YvOfhL/P6kcyZrcMvgxW8qQQDLcg5ATQO0wvAEgYkEgCTGpIWHJLtqdkY+2U4A0ODKJSmhMEUpk+msejiJyrqfPIlR66DZcKe5u5uBhux2V4SkDJAAiGAe1nMkQc8fNk1VKuen6zYTAfDWZ8vDIkqMAJgZpmr98Za963gqYLlXol7fm8sIBLgIQE0DgRDNeOzixYSY5jxiccYWBHrW1iOLEQgUhahLOwOA290EloER885jalRSbPH+vZTNCPjCJI55a1oem05e5l1zJumriADmx0WcmRH1zDnOl8t55EJzLePpRiAKr6AAIFgY2BDs2bQs2Pv2gn6/H0QSguWrD4JU2B+26kbgdj3daQo+QjIqkjVqdZSc7nWYz/62KPZ6LNlX7TbFTZNj4aqz5pLA1sGLX1Ziw5P1tShAwSljOlmaDD6ofT8anblPhdVjQnj9dMvRATKgxmhVTM7YF+8RgIMTjEACEQrNRRIQWlIolQ1XjgIJABJGrsjV9sgJudQ28i5icRiVOztu3+ZDqCYwj0OIx71DIfGpASRANzmuN1qeNGa+sH+4rO7GtsDY8q0ptTRlsYdrbEMNGycagYAQBTIkkNAAIgwBoEbodibLYL+KqSs9J6K04h0YDShRBpsnGkGRUfqkKORygZbqqeOoO38qFpxxvGRqdFmw863lcI33sKKYhGdN4JmaNMlgWUPIsW2/mjCo1tTAHr19cRcLSMhWz4hcwEKg+sWPRxKRijOmsvtrQgMfPUeZjiDLVvPAzdL8MDRESld+aigBWaLfNgMEeF26eVOh5SkHIm1wAzIwfdkpfyJg6zWaAtuv+/uBRugM+f+jNj4a6gGkEC9ZeFiaotqq4jt20aOKXxzDHNtq9IEZcBvbvk/+bR42863dx/wMAQaDDFx4qIrca7z12LGUkBA1nxkdiVnrEq+tE5CYAE3K/yQJ0DSJOC3lllVnGXCePJIOS+Gy9K+HRFKpeKCSdQTQ4PXm03lrSFPZPwrsow0ZA3iWUT16P29eLZKq82uYrTP+BVb1a/Nny90DAAAAAElFTkSuQmCC";
    const CFG = {
        chunkSize: .04,
        gridRadius: 1,
        maxConcurrentRequests: 2,
        requestSpacingMs: 500,
        requestTimeoutMs: 2e4,
        retryDelaysMs: [ 1200, 2500 ],
        cooldown429Ms: 45e3,
        cooldownTimeoutMs: 9e4,
        cooldownServerErrorMs: 6e4,
        cooldownOtherMs: 3e4,
        cacheEnabled: true,
        cacheLifetimeMs: 12 * 60 * 60 * 1e3,
        cachePrefix: "geofsGroundChunk_v465_",
        yellow: "#FFD21A",
        taxiwayWidthM: 1,
        taxilaneWidthM: .72,
        taxilaneOpacity: .88,
        parkingLineWidthM: .32,
        parkingStopBarM: 4.5,
        parkingNodeRadiusM: .65,
        holdDefaultTaxiwayWidthM: 24,
        holdMinLengthM: 12,
        holdMaxLengthM: 48,
        holdLineWidthM: .45,
        holdPairSpacingM: .9,
        holdGroupSpacingM: 1.8,
        holdDashM: 2.2,
        holdGapM: 2,
        previewCanvasMax: 4096,
        finalCanvasBase: 4096,
        finalCanvasMax: 8192,
        targetStrokePixels: 1.6,
        imageryPaddingM: 120,
        previewDelayMs: 160,
        taxiLabelRepeatM: 520,
        taxiLabelSameRefMinM: 360,
        taxiLabelOffsetM: 8,
        taxiLabelFontM: 8.5,
        taxiLabelMinPx: 11,
        taxiLabelMaxPx: 26,
        taxiLabelPaddingM: 2.6,
        standFontM: 5.5,
        standMinPx: 9,
        standMaxPx: 18,
        detectorIntervalMs: 400,
        detectorSearchRadiusM: 180,
        flightSuppressSpeedKt: 65,
        flightResumeSpeedKt: 45,
        taxiSpeedWarningKt: 30,
        taxiSpeedResetKt: 24,
        taxiwayAcquireDistanceM: 22,
        taxiwayStableMs: 900,
        runwayExtraMarginM: 8,
        runwayMinCorridorHalfWidthM: 20,
        runwayMaxCorridorHalfWidthM: 44,
        runwayStableMs: 700,
        holdAheadDistanceM: 105,
        holdResetDistanceM: 150,
        holdMinSpeedKt: 1.5,
        standParkDistanceM: 13,
        standReleaseDistanceM: 24,
        standParkMaxSpeedKt: 3,
        standReleaseSpeedKt: 6,
        standStableMs: 3500,
        notificationCooldownMs: 7e3,
        autoLoadCheckMs: 1e3,
        autoLoadInitialDelayMs: 3e3,
        autoLoadStableMs: 2500,
        autoLoadMaxSpeedKt: 45,
        autoLoadCooldownMs: 12e3,
        autoLoadResetReleaseDistanceM: 2e3,
        groundHandlingMainGrip: .18,
        groundHandlingNoseGrip: .08,
        groundHandlingLowSpeedEndKts: 15,
        groundHandlingHighSpeedStartKts: 18,
        groundHandlingSteeringFullReductionKts: 65,
        groundHandlingLowSpeedSteeringMinimum: .72,
        groundHandlingLowSpeedYawMinimum: .78,
        groundHandlingHighSpeedSteeringMinimum: .22,
        groundHandlingHighSpeedYawMinimum: .25,
        throttleVisualizerUpdateMs: 50,
        turnAidLowSpeedSteeringMinimum: .92,
        turnAidLowSpeedYawMinimum: .96,
        standLocatorUpdateMs: 500,
        standLocatorMaxDisplayDistanceM: 8e3,
        standLocatorLineWidthPx: 4,
        standMetadataCacheLifetimeMs: 7 * 24 * 60 * 60 * 1e3,
        standMetadataCachePrefix: "geofsGroundStandMeta_v1_",
        standListApronMaxDistanceM: 35,
        standListTerminalMaxDistanceM: 140,
        standListTerminalNodeMaxDistanceM: 85,
        standListGateMatchMaxDistanceM: 60,
        standListTerminalAmbiguityM: 35,
        standListRemoteMinTerminalDistanceM: 300,
        marshallerUpdateMs: 180,
        marshallerDisplayDistanceM: 350,
        marshallerActiveRangeM: 120,
        marshallerWorldLateralOffsetM: 0,
        marshallerSidePanelOffsetXPx: 86,
        marshallerSidePanelOffsetYPx: -42,
        marshallerStopWindowM: 7,
        marshallerDefaultStopOffsetM: 12,
        marshallerMinStopOffsetM: -20,
        marshallerMaxStopOffsetM: 30,
        marshallerStopOffsetStepM: 1,
        marshallerSlowDistanceM: 18,
        marshallerWorldAheadM: 18,
        marshallerWorldHeightM: 4.5,
        marshallerMinAircraftClearanceM: 75,
        marshallerFaceMeHeadingThresholdDeg: 25,
        marshallerFaceMeMinRemainingM: 25,
        marshallerLateralThresholdM: 1.8,
        marshallerLateralMaxDistanceM: 85,
        marshallerTooFastKt: 7,
        minimapUpdateMs: 100,
        minimapCanvasSize: 220,
        minimapRangesM: [ 300, 500, 800, 1300, 2e3, 3200 ],
        minimapDefaultRangeIndex: 3,
        minimapTaxiLabelMaxRangeM: 1300,
        minimapTaxiLabelMinSeparationPx: 34,
        minimapPanRecenterMs: 5 * 60 * 1e3,
        minimapPanMaxRangeFactor: 2.4,
        minimapAirportInitialRadiusM: 8e3,
        minimapAirportMaxRadiusM: 16e3,
        minimapAirportEdgeMarginM: 650,
        minimapAirportCacheLifetimeMs: 12 * 60 * 60 * 1e3,
        minimapAirportCachePrefix: "geofsGroundAirportMap_v1_",
        followMeUpdateMs: 120,
        followMeLeadDistanceDefaultM: 28,
        followMeLeadDistanceMinM: 10,
        followMeLeadDistanceMaxM: 80,
        followMeLeadDistanceStepM: 5,
        followMeTaxiwayEntryDistanceM: 42,
        followMeOffRouteDistanceM: 55,
        // A brief projection miss can happen while the aircraft crosses a
        // taxiway vertex. Hold the existing route briefly before rebuilding.
        followMeRouteGraceMs: 2200,
        followMeArrivalDistanceM: 22,
        followMeExitEndpointBufferM: 2,
        followMeExitForwardM: 4,
        followMeExitTurnM: 5,
        followMeExitClearDistanceM: 38,
        followMeExitSpeedMps: 7,
        followMeParkingConnectDistanceM: 80,
        followMeGraphSearchRadiusM: 320,
        followMeForwardRouteMaxAngleDeg: 115,
        followMeBehindCorrectionSpeedKt: 2,
        followMeBehindThresholdM: 5,
        followMeBehindCorrectionWindowMs: 2200,
        followMeBehindCorrectionMaxProgressM: 8,
        // The vehicle is now advanced independently of the aircraft cursor.
        // These limits keep it smooth without letting it run away.
        followMeVehicleMaxSpeedMps: 16,
        followMeVehicleAccelerationMps2: 5,
        followMeVehicleBrakingMps2: 8,
        followMeVehicleMinimumRollSpeedMps: 1.6,
        followMeVehicleSpeedMemoryMs: 650,
        followMeVehicleSoftStopTimeS: .75,
        followMeVehicleSmoothingMs: 180,
        followMeVehicleLeadSlackM: 12,
        followMeVehicleDisplayDistanceM: 2e4,
        // Public Nissan 350Z follow-me vehicle model.
        // The model is loaded as a Cesium entity; the follow-me motion
        // controller supplies its route pose and speed.
        followMeVehicleModelUrl: "https://raw.githubusercontent.com/RazvanJuncu/neutrino-geofs/main/Nissan_350Z_NEW_NEW_FINAL_geofs.glb?v=7",
        followMeVehicleModelScale: 1,
        followMeVehicleModelHeadingOffsetDeg: -90,
        followMeVehicleModelHeightOffsetM: .03,
        // Native GeoFS billboard lights for the follow-me vehicle beacon.
        // They remain separate from the GLB, so the vehicle model does not
        // need to be re-exported when the beacon timing or height changes.
        followMeBeaconEnabled: true,
        followMeBeaconNightOnly: true,
        followMeBeaconLightType: "orange",
        followMeBeaconHeightM: 1.55,
        followMeBeaconForwardM: -.35,
        followMeBeaconLateralM: .22,
        followMeBeaconPulseMs: 130,
        followMeBeaconScaleNear: .28,
        followMeBeaconScaleFar: .05,
        followMeBeaconScaleFarDistanceM: 4e3,
        departureUnloadMinSpeedKt: 65,
        departureUnloadStableMs: 8e3,
        arrivalSearchRadiusM: 4e4,
        flightPlanArrivalCheckMs: 3e3,
        flightPlanArrivalRetryMs: 6e4,
        flightPlanArrivalMaxPasses: 3,
        flightPlanArrivalPaintRadiusM: 2e4,
        flightPlanArrivalPaintMaxHeightM: 1500,
        arrivalSearchTimeoutMs: 18e3,
        arrivalMaxChoices: 6,
        arrivalProtectionMs: 20 * 60 * 1e3,
        arrivalWrongAirportDistanceIncreaseM: 6e3,
        arrivalWrongAirportStableMs: 12e3,
        arrivalWrongAirportMinSpeedKt: 65,
        modifyArrivalConfirmMs: 3e3,
        modifyArrivalMinSpeedKt: 65,
        arrivalGroundConfirmMs: 2e3,
        arrivalGroundMovementDistanceM: 28,
        arrivalGroundFallbackRadiusM: 12e3,
        arrivalGroundFallbackStableMs: 3e3,
        arrivalGroundFallbackCooldownMs: 12e3,
        arrivalGroundFallbackMaxAttempts: 2,
        autoChunkRetryPasses: 2,
        autoChunkRetryDelaysMs: [ 2500, 6e3 ],
        autoChunkRetryConcurrency: 1
    };
    const savedGroundPhysics = localStorage.getItem("geofsGroundV491GroundPhysics");
    const savedLegacyGroundHandling = localStorage.getItem("geofsGroundV490GroundHandling");
    const state = {
        taxiwayLabelsEnabled: localStorage.getItem("geofsGroundV4TaxiLabels") === "true",
        standNumbersEnabled: localStorage.getItem("geofsGroundV4StandNumbers") === "true",
        standLeadInsEnabled: localStorage.getItem("geofsGroundV4StandLeadIns") === "true",
        notificationsEnabled: localStorage.getItem("geofsGroundV42Notifications") !== "false",
        autoLoadEnabled: localStorage.getItem("geofsGroundV424AutoLoad") !== "false",
        groundHandlingEnabled: (savedGroundPhysics ?? savedLegacyGroundHandling) !== "false",
        throttleVisualizerEnabled: localStorage.getItem("geofsGroundV492ThrottleVisualizer") === "true",
        turnAidEnabled: localStorage.getItem("geofsGroundV493TurnAid") === "true",
        throttleVisualizerPosition: (() => {
            try {
                const saved = JSON.parse(localStorage.getItem("geofsGroundV492ThrottleVisualizerPosition") || "null");
                return saved && Number.isFinite(saved.left) && Number.isFinite(saved.top) ? {
                    left: saved.left,
                    top: saved.top
                } : null;
            } catch (_) {
                return null;
            }
        })(),
        marshallerEnabled: localStorage.getItem("geofsGroundV470Marshaller") === "true",
        marshallerStopOffsetM: (() => {
            const saved = Number(localStorage.getItem("geofsGroundV471MarshallerStopOffsetM"));
            return Number.isFinite(saved) ? saved : CFG.marshallerDefaultStopOffsetM;
        })(),
        running: false,
        loadGeneration: 0,
        chunks: [],
        queryBounds: null,
        gridSignature: null,
        taxiways: new Map,
        taxilanes: new Map,
        holdings: new Map,
        parking: new Map,
        runways: new Map,
        aprons: new Map,
        chunkData: new Map,
        activeRequests: 0,
        controllers: new Set,
        requestGate: Promise.resolve(),
        lastRequestStart: 0,
        preferredServerIndex: 0,
        serverHealth: OVERPASS_SERVERS.map(() => ({
            cooldownUntil: 0,
            failures: 0,
            successes: 0
        })),
        totalChunks: 0,
        completedChunks: 0,
        successfulChunks: 0,
        failedChunks: 0,
        cachedChunks: 0,
        failedChunkKeys: new Set,
        earlyPreviewRequested: false,
        midPreviewRequested: false,
        layer: null,
        blobUrl: null,
        renderTimer: null,
        renderBusy: false,
        pendingRenderQuality: 0,
        renderSerial: 0,
        root: null,
        panel: null,
        extrasButton: null,
        extrasPanel: null,
        groundHandlingToggle: null,
        throttleVisualizerToggle: null,
        turnAidToggle: null,
        throttleVisualizerHud: null,
        throttleVisualizerMode: null,
        throttleVisualizerValue: null,
        throttleVisualizerFill: null,
        throttleVisualizerDragging: false,
        throttleVisualizerPointerId: null,
        throttleVisualizerDragOffsetX: 0,
        throttleVisualizerDragOffsetY: 0,
        followMeDistanceMinus: null,
        followMeDistanceValue: null,
        followMeDistancePlus: null,
        menuButton: null,
        statusEl: null,
        statusDot: null,
        detailsEl: null,
        progressFill: null,
        loadButton: null,
        resetButton: null,
        taxiLabelToggle: null,
        standNumberToggle: null,
        standLeadInToggle: null,
        autoLoadToggle: null,
        standButton: null,
        standPanel: null,
        standInput: null,
        standFindButton: null,
        standClearButton: null,
        standLocatorStatus: null,
        standListButton: null,
        standListWindow: null,
        standListSummary: null,
        standListSearchInput: null,
        standListBody: null,
        standMetadata: null,
        standMetadataSource: null,
        standMetadataLoading: false,
        standMetadataReady: false,
        standMetadataStatus: "idle",
        standMetadataGeneration: 0,
        standMetadataController: null,
        marshallerToggle: null,
        marshallerOffsetValue: null,
        marshallerOffsetMinus: null,
        marshallerOffsetPlus: null,
        followMeToggle: null,
        followMeStatus: null,
        minimapButton: null,
        minimapWindow: null,
        minimapCanvas: null,
        minimapStatusEl: null,
        minimapTimer: null,
        minimapOpen: localStorage.getItem("geofsGroundMinimapOpen") === "true",
        minimapAirportData: null,
        minimapAirportSource: null,
        minimapAirportLoading: false,
        minimapAirportReady: false,
        minimapAirportStatus: "idle",
        minimapAirportRadiusM: 0,
        minimapAirportCapped: false,
        minimapAirportGeneration: 0,
        minimapAirportController: null,
        minimapDragging: false,
        minimapDragOffsetX: 0,
        minimapDragOffsetY: 0,
        minimapRangeIndex: (() => {
            const saved = Number(localStorage.getItem("geofsGroundMinimapRangeIndex"));
            return Number.isInteger(saved) ? saved : CFG.minimapDefaultRangeIndex;
        })(),
        minimapPanX: 0,
        minimapPanY: 0,
        minimapCanvasDragging: false,
        minimapCanvasLastX: 0,
        minimapCanvasLastY: 0,
        minimapPanLastInteraction: 0,
        minimapPanLocked: false,
        notificationButton: null,
        notificationHost: null,
        arrivalModeLabel: null,
        arrivalModeCueTimer: null,
        notificationQueue: [],
        notificationShowing: false,
        notificationHideTimer: null,
        groundHandlingCallbackId: null,
        groundHandlingAircraft: null,
        groundHandlingLastSpeed: 0,
        groundHandlingLastSteeringScale: 1,
        groundHandlingLastYawScale: 1,
        groundHandlingPatchedProperties: new Set,
        groundHandlingStatus: null,
        groundHandlingStatusLastUpdate: 0,
        throttleVisualizerLastUpdate: 0,
        detectorTimer: null,
        autoLoadTimer: null,
        arrivalMode: false,
        arrivalChooserHost: null,
        arrivalChooserDragging: false,
        arrivalChooserDragOffsetX: 0,
        arrivalChooserDragOffsetY: 0,
        arrivalDiscoveryController: null,
        arrivalDiscoveryBusy: false,
        arrivalCandidates: [],
        modifyArrivalButton: null,
        modifyArrivalWrap: null,
        modifyArrivalArmed: false,
        modifyArrivalTimer: null,
        arrival: {
            flightPlanJob: null,
            flightPlanNextCheckAt: 0,
            flightPlanManualOverride: false,
            departureOutsideSince: 0,
            protectionUntil: 0,
            selectedAirport: null,
            manualModifyAvailable: false,
            groundConfirmSince: 0,
            preloadReady: false,
            groundFallbackSince: 0,
            groundFallbackLastAttempt: 0,
            groundFallbackAttempts: 0,
            selectedBestDistanceM: null,
            movingAwaySince: 0
        },
        standLocatorTimer: null,
        marshallerTimer: null,
        followMeTimer: null,
        marshaller: {
            entity: null,
            badgeEntity: null,
            badgeText: null,
            worldPoint: null,
            placementMode: null,
            active: false,
            scene: null,
            unsubscribeRender: null,
            signal: null,
            phase: -1,
            imageCache: new Map,
        },
        followMe: {
            enabled: localStorage.getItem("geofsGroundV411FollowMe") === "true",
            leadDistanceM: (() => {
                const saved = Number(localStorage.getItem("geofsGroundV411FollowMeDistanceM"));
                return Number.isFinite(saved) ? Math.max(CFG.followMeLeadDistanceMinM, Math.min(CFG.followMeLeadDistanceMaxM, saved)) : CFG.followMeLeadDistanceDefaultM;
            })(),
            graph: null,
            graphSource: null,
            graphFailedSource: null,
            loadedDataset: null,
            loadedDatasetSource: null,
            route: null,
            routeProgressM: 0,
            vehicleProgressM: 0,
            vehicleSpeedMps: 0,
            vehicleLastAt: 0,
            lastAircraftProgressM: 0,
            lastAircraftProgressAt: 0,
            lastValidAircraftSpeedMps: 0,
            routeOffRouteSince: 0,
            routeStatus: "idle",
            statusMessage: "",
            vehicleEntities: [],
            vehiclePose: null,
            vehicleTargetPose: null,
            vehicleAnimationFrame: null,
            vehicleAnimationLastMs: 0,
            beaconLights: [],
            beaconTimer: null,
            beaconPatternIndex: 0,
            routeDirectionCorrectionUsed: false,
            routeStartedAt: 0,
            exit: null,
            completedTargetRef: null,
            lastAttemptAt: 0
        },
        standLocator: {
            selectedRef: null,
            selectedFeature: null,
            selectedTarget: null,
            markerEntity: null,
            labelEntity: null,
            labelText: null,
            labelImageCache: new Map,
            leadInEntity: null,
            markerImage: null,
            lastDistanceM: null
        },
        autoLoad: {
            startedAt: Date.now(),
            lastPosition: null,
            lastSampleTime: 0,
            speedKt: 0,
            bearingDeg: null,
            candidateSince: 0,
            lastTriggerTime: 0,
            resetBlockPosition: null
        },
        detector: {
            initialized: false,
            lastPosition: null,
            lastSampleTime: 0,
            speedKt: 0,
            bearingDeg: null,
            highSpeedSuppressed: false,
            taxiSpeedWarningActive: false,
            taxiSpeedFlightLatch: false,
            currentTaxiRef: null,
            taxiCandidateRef: null,
            taxiCandidateSince: 0,
            currentRunwayKey: null,
            currentRunwayFeature: null,
            currentRunwayLabel: null,
            runwayCandidateKey: null,
            runwayCandidateFeature: null,
            runwayCandidateSince: 0,
            lastHoldAlertKey: null,
            parkedStandRef: null,
            standCandidateRef: null,
            standCandidateSince: 0,
            suppressTaxiUntil: 0,
            cooldowns: new Map
        }
    };
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    function geofsReady() {
        return !!(window.geofs && window.geofs.aircraft && window.geofs.aircraft.instance && Array.isArray(window.geofs.aircraft.instance.llaLocation) && window.geofs.api && window.geofs.api.viewer && window.Cesium);
    }
    async function waitForGeoFS() {
        while (!geofsReady()) {
            await sleep(400);
        }
    }
    function aircraftLL() {
        const lla = window.geofs.aircraft.instance.llaLocation;
        return {
            lat: Number(lla[0]),
            lon: Number(lla[1])
        };
    }
    function getImageryLayers() {
        const viewer = window.geofs.api.viewer;
        return viewer.imageryLayers || viewer.scene?.imageryLayers || null;
    }
    function setStatus(text, mode = "idle") {
        if (state.statusEl) state.statusEl.textContent = text;
        if (!state.statusDot) return;
        state.statusDot.className = `twy-dot ${mode}`;
    }
    function updateSwitch(button, enabled) {
        if (!button) return;
        button.classList.toggle("on", enabled);
        const knob = button.querySelector(".twy-knob");
        if (knob) knob.style.transform = enabled ? "translateX(18px)" : "translateX(0px)";
    }
    const GROUND_HANDLING_ORIGINAL_GRIP_KEY = "__iaOriginalGroundDynamicFriction";
    function groundHandlingAircraft() {
        return window.geofs && window.geofs.aircraft && window.geofs.aircraft.instance;
    }
    function groundHandlingControls() {
        return window.controls || window.geofs?.controls || null;
    }
    function groundSpeedKts(aircraft) {
        const animationValues = window.geofs && window.geofs.animation && window.geofs.animation.values;
        const animatedSpeed = animationValues && Number(animationValues.groundSpeedKnt);
        if (Number.isFinite(animatedSpeed)) return Math.max(0, animatedSpeed);
        const velocity = aircraft?.rigidBody?.v_linearVelocity;
        if (velocity) {
            const vx = Number(velocity[0] ?? velocity.x ?? 0);
            const vy = Number(velocity[1] ?? velocity.y ?? 0);
            const vz = Number(velocity[2] ?? velocity.z ?? 0);
            const speedMs = Math.sqrt(
                (Number.isFinite(vx) ? vx : 0) ** 2 +
                (Number.isFinite(vy) ? vy : 0) ** 2 +
                (Number.isFinite(vz) ? vz : 0) ** 2
            );
            if (Number.isFinite(speedMs)) return speedMs * 1.943844492;
        }
        return Number.isFinite(state.autoLoad?.speedKt) ? Math.max(0, state.autoLoad.speedKt) : 0;
    }
    function groundWheelIsNoseOrTail(part) {
        const name = String(part?.name || "").toLowerCase();
        const contactType = String(part?.contactType || "").toLowerCase();
        return /front|nose|tailwheel|tail-wheel|steer/.test(name) || contactType === "lightwheel";
    }
    function eachGroundWheel(aircraft, callback) {
        if (!aircraft || !aircraft.parts) return;
        Object.keys(aircraft.parts).forEach(key => {
            const part = aircraft.parts[key];
            if (!part || part.type !== "wheel" || !part.contactProperties) return;
            callback(part);
        });
    }
    function rememberGroundWheelGrip(properties) {
        if (!Object.prototype.hasOwnProperty.call(properties, GROUND_HANDLING_ORIGINAL_GRIP_KEY)) {
            try {
                Object.defineProperty(properties, GROUND_HANDLING_ORIGINAL_GRIP_KEY, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: Number.isFinite(Number(properties.dynamicFriction)) ? Number(properties.dynamicFriction) : .01
                });
            } catch (_) {
                return false;
            }
        }
        state.groundHandlingPatchedProperties.add(properties);
        return true;
    }
    function restoreGroundHandlingGrip() {
        state.groundHandlingPatchedProperties.forEach(properties => {
            if (!Object.prototype.hasOwnProperty.call(properties, GROUND_HANDLING_ORIGINAL_GRIP_KEY)) return;
            properties.dynamicFriction = properties[GROUND_HANDLING_ORIGINAL_GRIP_KEY];
            try {
                delete properties[GROUND_HANDLING_ORIGINAL_GRIP_KEY];
            } catch (_) {}
        });
        state.groundHandlingPatchedProperties.clear();
    }
    function patchGroundHandlingGrip(aircraft) {
        const desiredGrip = new Map;
        eachGroundWheel(aircraft, part => {
            const properties = part.contactProperties;
            if (!rememberGroundWheelGrip(properties)) return;
            const target = groundWheelIsNoseOrTail(part) ? CFG.groundHandlingNoseGrip : CFG.groundHandlingMainGrip;
            desiredGrip.set(properties, Math.max(desiredGrip.get(properties) || 0, target));
        });
        desiredGrip.forEach((target, properties) => {
            properties.dynamicFriction = target;
        });
    }
    function smoothStep(value) {
        const t = clamp(value, 0, 1);
        return t * t * (3 - 2 * t);
    }
    function groundResponse(speedKts, lowSpeedMinimum, highSpeedMinimum) {
        const lowSpeedEnd = clamp(CFG.groundHandlingLowSpeedEndKts, 1, 100);
        const highSpeedStart = Math.max(
            lowSpeedEnd,
            clamp(CFG.groundHandlingHighSpeedStartKts, 1, 200)
        );
        const highSpeedEnd = Math.max(
            highSpeedStart + 1,
            clamp(CFG.groundHandlingSteeringFullReductionKts, 1, 250)
        );
        const lowMinimum = clamp(lowSpeedMinimum, .01, 1);
        const highMinimum = clamp(highSpeedMinimum, .01, 1);
        if (speedKts <= lowSpeedEnd) {
            return lowMinimum + (1 - lowMinimum) * smoothStep(speedKts / lowSpeedEnd);
        }
        if (speedKts <= highSpeedStart) return 1;
        const progress = clamp((speedKts - highSpeedStart) / (highSpeedEnd - highSpeedStart), 0, 1);
        return highMinimum + (1 - highMinimum) * Math.pow(1 - progress, 1.15);
    }
    function groundSteeringScale(speedKts) {
        return groundResponse(
            speedKts,
            CFG.groundHandlingLowSpeedSteeringMinimum,
            CFG.groundHandlingHighSpeedSteeringMinimum
        );
    }
    function groundYawScale(speedKts) {
        return groundResponse(
            speedKts,
            CFG.groundHandlingLowSpeedYawMinimum,
            CFG.groundHandlingHighSpeedYawMinimum
        );
    }
    function turnAidSteeringScale(speedKts) {
        return groundResponse(
            speedKts,
            CFG.turnAidLowSpeedSteeringMinimum,
            CFG.groundHandlingHighSpeedSteeringMinimum
        );
    }
    function turnAidYawScale(speedKts) {
        return groundResponse(
            speedKts,
            CFG.turnAidLowSpeedYawMinimum,
            CFG.groundHandlingHighSpeedYawMinimum
        );
    }
    function normalizedSignedThrottleSample(value) {
        const numeric = readThrottleControlValue(value);
        if (!Number.isFinite(numeric)) return null;
        const scale = Math.abs(numeric) > 1.001 ? 100 : 1;
        return clamp(numeric / scale, -1, 1);
    }
    function updateGroundHandlingStatus() {
        if (!state.groundHandlingStatus) return;
        const turnAidText = state.turnAidEnabled ? " · TURN AID" : "";
        state.groundHandlingStatus.textContent = `Speed ${Math.round(state.groundHandlingLastSpeed)} kt · Turn response ${Math.round(state.groundHandlingLastSteeringScale * 100)}%${turnAidText}`;
    }
    function readThrottleControlValue(value) {
        if (value === null || value === undefined || value === "") return null;
        if (typeof value === "boolean") return value ? 1 : 0;
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    }
    function readThrottleVisualizerState() {
        const controls = groundHandlingControls();
        const animationValues = window.geofs?.animation?.values || null;
        const directThrottle = readThrottleControlValue(controls?.throttle);
        const animatedThrottle = readThrottleControlValue(animationValues?.throttle);
        const directReverse = readThrottleControlValue(controls?.reverse);
        const animatedReverse = readThrottleControlValue(animationValues?.reverseThrust);
        const directSigned = normalizedSignedThrottleSample(directThrottle);
        const animatedSigned = normalizedSignedThrottleSample(animatedThrottle);
        const directReverseSigned = normalizedSignedThrottleSample(directReverse);
        const animatedReverseSigned = normalizedSignedThrottleSample(animatedReverse);
        let signedAmount = animatedSigned ?? directSigned;
        const reverseSignal =
            (signedAmount !== null && signedAmount < -.02) ||
            (directReverseSigned !== null && Math.abs(directReverseSigned) > .05) ||
            (animatedReverseSigned !== null && Math.abs(animatedReverseSigned) > .05);
        if (reverseSignal) {
            signedAmount = -Math.max(Math.abs(signedAmount || 0), .05);
        }
        return {
            signedAmount: signedAmount === null ? null : clamp(signedAmount, -1, 1),
            amount: signedAmount === null ? null : clamp(Math.abs(signedAmount), 0, 1),
            reverseAvailable: directReverse !== null || animatedReverse !== null || reverseSignal,
            reverseActive: reverseSignal
        };
    }
    function updateThrottleVisualizerUI(force = false) {
        const hud = state.throttleVisualizerHud;
        if (!hud) return;
        const enabled = !!state.throttleVisualizerEnabled;
        hud.classList.toggle("open", enabled);
        hud.setAttribute("aria-hidden", String(!enabled));
        if (!enabled) return;
        const now = performance.now();
        if (!force && now - state.throttleVisualizerLastUpdate < CFG.throttleVisualizerUpdateMs) return;
        state.throttleVisualizerLastUpdate = now;
        const sample = readThrottleVisualizerState();
        const percent = sample.signedAmount === null ? null : Math.round(sample.signedAmount * 100);
        const fillPercent = sample.amount === null ? 0 : Math.round(sample.amount * 100);
        const mode = sample.reverseActive ? "REV" : sample.reverseAvailable ? "FWD" : "—";
        state.throttleVisualizerMode.textContent = mode;
        state.throttleVisualizerMode.classList.toggle("reverse", sample.reverseActive);
        state.throttleVisualizerMode.classList.toggle("unavailable", !sample.reverseAvailable);
        state.throttleVisualizerValue.textContent = percent === null ? "—" : `${percent}%`;
        state.throttleVisualizerFill.style.width = `${fillPercent}%`;
        state.throttleVisualizerFill.classList.toggle("reverse", sample.reverseActive);
    }
    function saveThrottleVisualizerPosition() {
        if (!state.throttleVisualizerHud) return;
        const rect = state.throttleVisualizerHud.getBoundingClientRect();
        state.throttleVisualizerPosition = {
            left: Math.round(rect.left),
            top: Math.round(rect.top)
        };
        localStorage.setItem("geofsGroundV492ThrottleVisualizerPosition", JSON.stringify(state.throttleVisualizerPosition));
    }
    function restoreThrottleVisualizerPosition() {
        const hud = state.throttleVisualizerHud;
        const saved = state.throttleVisualizerPosition;
        if (!hud || !saved) return;
        const width = hud.offsetWidth || 138;
        const height = hud.offsetHeight || 30;
        const maxLeft = Math.max(6, window.innerWidth - width - 6);
        const maxTop = Math.max(6, window.innerHeight - height - 6);
        hud.style.left = `${clamp(saved.left, 6, maxLeft)}px`;
        hud.style.top = `${clamp(saved.top, 6, maxTop)}px`;
        hud.style.transform = "translate(0, 0)";
    }
    function throttleVisualizerHitTest(event) {
        const hud = state.throttleVisualizerHud;
        if (!hud) return false;
        if (hud.contains(event.target)) return true;
        if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return false;
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        return hit === hud || hud.contains(hit);
    }
    function startThrottleVisualizerDrag(event) {
        const hud = state.throttleVisualizerHud;
        if (!hud || !state.throttleVisualizerEnabled || state.throttleVisualizerDragging) return;
        if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
        if (!throttleVisualizerHitTest(event)) return;
        const rect = hud.getBoundingClientRect();
        state.throttleVisualizerDragging = true;
        state.throttleVisualizerPointerId = Number.isFinite(event.pointerId) ? event.pointerId : null;
        state.throttleVisualizerDragOffsetX = event.clientX - rect.left;
        state.throttleVisualizerDragOffsetY = event.clientY - rect.top;
        hud.style.left = `${rect.left}px`;
        hud.style.top = `${rect.top}px`;
        hud.style.transform = "translate(0, 0)";
        hud.classList.add("dragging");
        event.preventDefault();
        event.stopPropagation();
    }
    function moveThrottleVisualizerDrag(event) {
        const hud = state.throttleVisualizerHud;
        if (!state.throttleVisualizerDragging || !hud) return;
        if (state.throttleVisualizerPointerId !== null && event.pointerId !== undefined && event.pointerId !== state.throttleVisualizerPointerId) return;
        if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return;
        const width = hud.offsetWidth || 138;
        const height = hud.offsetHeight || 30;
        const left = clamp(event.clientX - state.throttleVisualizerDragOffsetX, 6, Math.max(6, window.innerWidth - width - 6));
        const top = clamp(event.clientY - state.throttleVisualizerDragOffsetY, 6, Math.max(6, window.innerHeight - height - 6));
        hud.style.left = `${left}px`;
        hud.style.top = `${top}px`;
        hud.style.transform = "translate(0, 0)";
        event.preventDefault();
        event.stopPropagation();
    }
    function endThrottleVisualizerDrag(event) {
        if (!state.throttleVisualizerDragging) return;
        if (state.throttleVisualizerPointerId !== null && event?.pointerId !== undefined && event.pointerId !== state.throttleVisualizerPointerId) return;
        const hud = state.throttleVisualizerHud;
        state.throttleVisualizerDragging = false;
        state.throttleVisualizerPointerId = null;
        hud?.classList.remove("dragging");
        event?.preventDefault();
        event?.stopPropagation();
        saveThrottleVisualizerPosition();
    }
    function applyGroundHandling() {
        const aircraft = groundHandlingAircraft();
        const controls = groundHandlingControls();
        if (state.groundHandlingAircraft !== aircraft) {
            restoreGroundHandlingGrip();
            state.groundHandlingAircraft = aircraft;
        }
        if (!aircraft || !controls) {
            restoreGroundHandlingGrip();
            state.groundHandlingLastSpeed = 0;
            state.groundHandlingLastSteeringScale = 1;
            state.groundHandlingLastYawScale = 1;
            return;
        }
        const onGround = !!aircraft.groundContact;
        const turnAidActive = state.turnAidEnabled && onGround;
        if (!onGround || (!state.groundHandlingEnabled && !turnAidActive)) {
            restoreGroundHandlingGrip();
            state.groundHandlingLastSpeed = 0;
            state.groundHandlingLastSteeringScale = 1;
            state.groundHandlingLastYawScale = 1;
            return;
        }
        if (state.groundHandlingEnabled) {
            patchGroundHandlingGrip(aircraft);
        } else {
            restoreGroundHandlingGrip();
        }
        const speedKts = groundSpeedKts(aircraft);
        const steeringScale = turnAidActive ? turnAidSteeringScale(speedKts) : groundSteeringScale(speedKts);
        const yawScale = turnAidActive ? turnAidYawScale(speedKts) : groundYawScale(speedKts);
        state.groundHandlingLastSpeed = speedKts;
        state.groundHandlingLastSteeringScale = steeringScale;
        state.groundHandlingLastYawScale = yawScale;
        // Shape the existing ground inputs; do not force the aircraft's heading
        // or modify rudder authority once airborne.
        if ((state.groundHandlingEnabled || turnAidActive) && Number.isFinite(controls.steering)) {
            controls.steering = clamp(controls.steering * steeringScale, -1, 1);
        }
        if ((state.groundHandlingEnabled || turnAidActive) && Number.isFinite(controls.yaw)) {
            controls.yaw = clamp(controls.yaw * yawScale, -1, 1);
        }
    }
    function toggleGroundHandling() {
        state.groundHandlingEnabled = !state.groundHandlingEnabled;
        localStorage.setItem("geofsGroundV491GroundPhysics", String(state.groundHandlingEnabled));
        if (!state.groundHandlingEnabled) restoreGroundHandlingGrip();
        setStatus(state.groundHandlingEnabled ? "Ground grip physics on" : "Ground grip physics off", state.taxiways.size ? "ready" : "idle");
        updateUI();
    }
    function toggleThrottleVisualizer() {
        state.throttleVisualizerEnabled = !state.throttleVisualizerEnabled;
        localStorage.setItem("geofsGroundV492ThrottleVisualizer", String(state.throttleVisualizerEnabled));
        updateThrottleVisualizerUI(true);
        updateUI();
    }
    function updateTurnAidUI() {
        const button = state.turnAidToggle;
        if (!button) return;
        button.classList.toggle("on", state.turnAidEnabled);
        button.setAttribute("aria-pressed", String(!!state.turnAidEnabled));
        button.title = state.turnAidEnabled ? "Turn Aid ON · recommended only when taxiing" : "Enable Turn Aid for taxiing";
    }
    function toggleTurnAid() {
        state.turnAidEnabled = !state.turnAidEnabled;
        localStorage.setItem("geofsGroundV493TurnAid", String(state.turnAidEnabled));
        updateTurnAidUI();
        updateGroundHandlingStatus();
        if (state.turnAidEnabled) {
            setStatus("Turn Aid on · taxiing only", state.taxiways.size ? "ready" : "idle");
            queueNotification("warning", "TURN AID", "RECOMMENDED ONLY WHEN TAXIING", "Tighter ground turning response is active", "turn-aid-enabled", 3600);
        } else {
            setStatus("Turn Aid off", state.taxiways.size ? "ready" : "idle");
        }
        updateUI();
    }
    function startGroundHandlingMonitor() {
        if (state.groundHandlingCallbackId !== null) return;
        const callback = () => {
            applyGroundHandling();
            updateThrottleVisualizerUI();
            const now = Date.now();
            if (now - state.groundHandlingStatusLastUpdate > 150) {
                state.groundHandlingStatusLastUpdate = now;
                updateGroundHandlingStatus();
            }
        };
        if (window.geofs?.api && typeof window.geofs.api.addFrameCallback === "function") {
            try {
                state.groundHandlingCallbackId = window.geofs.api.addFrameCallback(callback, "immersiveAirportsGroundHandling");
            } catch (_) {
                state.groundHandlingCallbackId = window.setInterval(callback, 50);
            }
        } else {
            state.groundHandlingCallbackId = window.setInterval(callback, 50);
        }
    }
    function hasUsefulAirportData() {
        return !!(state.taxiways.size || state.taxilanes.size || state.runways.size || state.holdings.size || state.parking.size || state.aprons.size);
    }
    function resetArrivalLockState() {
        state.arrival.preloadReady = false;
        state.arrival.groundFallbackSince = 0;
        state.arrival.groundFallbackLastAttempt = 0;
        state.arrival.groundFallbackAttempts = 0;
    }
    function canModifyArrival() {
        return !!(!state.arrivalMode && state.arrival.manualModifyAvailable && state.arrival.selectedAirport && state.queryBounds);
    }
    function renderModifyArrivalButton() {
        const button = state.modifyArrivalButton;
        const wrap = state.modifyArrivalWrap;
        if (!button || !wrap) return;
        const visible = canModifyArrival();
        wrap.classList.toggle("visible", visible);
        if (!visible) {
            disarmModifyArrival();
            return;
        }
        button.classList.toggle("armed", state.modifyArrivalArmed);
        if (state.modifyArrivalArmed) {
            button.innerHTML = `\n                <span class="twy-modify-arr-title">⚠ MODIFY ARR</span>\n                <span class="twy-modify-arr-confirm">PRESS TO CONFIRM</span>\n            `;
            button.title = "Press again to release the selected arrival";
        } else {
            button.innerHTML = `\n                <span class="twy-modify-arr-title">MODIFY ARR</span>\n                <span class="twy-modify-arr-safe">GUARDED · PRESS ONCE</span>\n            `;
            button.title = "Guarded control · press once to arm";
        }
    }
    function disarmModifyArrival() {
        state.modifyArrivalArmed = false;
        if (state.modifyArrivalTimer) {
            clearTimeout(state.modifyArrivalTimer);
            state.modifyArrivalTimer = null;
        }
        const button = state.modifyArrivalButton;
        if (button) {
            button.classList.remove("armed");
            button.innerHTML = `\n                <span class="twy-modify-arr-title">MODIFY ARR</span>\n                <span class="twy-modify-arr-safe">GUARDED · PRESS ONCE</span>\n            `;
        }
    }
    function armModifyArrival() {
        if (!canModifyArrival()) return;
        disarmModifyArrival();
        state.modifyArrivalArmed = true;
        renderModifyArrivalButton();
        state.modifyArrivalTimer = setTimeout(() => {
            disarmModifyArrival();
        }, CFG.modifyArrivalConfirmMs);
    }
    function releaseArrivalForModification() {
        if (!canModifyArrival()) {
            disarmModifyArrival();
            return;
        }
        const oldAirport = state.arrival.selectedAirport;
        const oldCode = airportReleaseLabel(oldAirport);
        disarmModifyArrival();
        clearAirportRuntimeKeepCache();
        state.arrival.flightPlanManualOverride = true;
        state.arrivalMode = true;
        state.arrival.departureOutsideSince = 0;
        state.arrival.protectionUntil = 0;
        state.arrival.selectedAirport = null;
        state.arrival.manualModifyAvailable = false;
        state.arrival.groundConfirmSince = 0;
        resetArrivalLockState();
        state.arrival.selectedBestDistanceM = null;
        state.arrival.movingAwaySince = 0;
        closeArrivalChooser();
        if (state.panel) {
            state.panel.classList.remove("open");
        }
        if (state.menuButton) {
            state.menuButton.classList.remove("active");
        }
        setStatus("Arrival released · choose another", "idle");
        updateStandLocatorStatus();
        updateUI();
        showArrivalModeCue();
        queueNotification("warning", "ARRIVAL RELEASED", oldCode, "Choose another arrival airport", `arrival-released:${oldCode}`, 2200);
        setTimeout(() => {
            if (state.arrivalMode) {
                openArrivalChooser();
            }
        }, 80);
    }
    function handleModifyArrivalPress() {
        if (!canModifyArrival()) return;
        if (!state.modifyArrivalArmed) {
            armModifyArrival();
            return;
        }
        releaseArrivalForModification();
    }
    function updateUI() {
        if (!state.root) return;
        if (state.menuButton) {
            state.menuButton.textContent = state.arrivalMode ? "ARR" : "TWY";
            state.menuButton.classList.toggle("arrival-mode", state.arrivalMode);
            state.menuButton.title = state.arrivalMode ? "Choose arrival airport" : "Airport ground overlay";
        }
        const ratio = state.totalChunks > 0 ? state.completedChunks / state.totalChunks : 0;
        if (state.progressFill) {
            state.progressFill.style.width = `${Math.round(ratio * 100)}%`;
        }
        if (state.detailsEl) {
            if (state.totalChunks === 0 && state.taxiways.size === 0) {
                state.detailsEl.textContent = "Nothing loaded yet";
            } else {
                const parts = [];
                if (state.running) {
                    parts.push(`${state.successfulChunks} of ${state.totalChunks} areas`);
                }
                if (state.taxiways.size) parts.push(`${state.taxiways.size} taxiways`);
                if (state.taxilanes.size) parts.push(`${state.taxilanes.size} taxilanes`);
                if (state.holdings.size) parts.push(`${state.holdings.size} holds`);
                if (state.parking.size) parts.push(`${state.parking.size} stands`);
                if (state.cachedChunks) parts.push(`${state.cachedChunks} cached`);
                state.detailsEl.textContent = parts.join("  •  ");
            }
        }
        updateSwitch(state.taxiLabelToggle, state.taxiwayLabelsEnabled);
        updateSwitch(state.standNumberToggle, state.standNumbersEnabled);
        updateSwitch(state.standLeadInToggle, state.standLeadInsEnabled);
        updateSwitch(state.autoLoadToggle, state.autoLoadEnabled);
        updateSwitch(state.marshallerToggle, state.marshallerEnabled);
        updateSwitch(state.groundHandlingToggle, state.groundHandlingEnabled);
        updateGroundHandlingStatus();
        updateSwitch(state.throttleVisualizerToggle, state.throttleVisualizerEnabled);
        updateTurnAidUI();
        updateThrottleVisualizerUI(true);
        updateSwitch(state.followMeToggle, state.followMe.enabled);
        updateFollowMeDistanceUI();
        if (state.followMe.enabled || state.followMeStatus?.textContent !== "Off") updateFollowMeStatus();
        if (state.notificationButton) {
            state.notificationButton.classList.toggle("notif-on", state.notificationsEnabled);
            state.notificationButton.classList.toggle("notif-off", !state.notificationsEnabled);
            state.notificationButton.title = state.notificationsEnabled ? "Airport awareness notifications: ON" : "Airport awareness notifications: OFF";
        }
        if (state.loadButton) {
            state.loadButton.disabled = state.running;
            state.loadButton.innerHTML = state.running ? '<span class="twy-spinner"></span>Loading…' : state.taxiways.size > 0 ? "Refresh airport" : "Load airport";
        }
        if (state.standButton) {
            const selected = state.standLocator.selectedRef;
            state.standButton.textContent = selected || "STD";
            state.standButton.classList.toggle("selected", !!selected);
            state.standButton.title = selected ? `Stand locator · selected ${selected}` : "Find a stand / gate";
        }
        renderModifyArrivalButton();
        updateMinimapAvailability();
    }
    function toggleTaxiwayLabels() {
        state.taxiwayLabelsEnabled = !state.taxiwayLabelsEnabled;
        localStorage.setItem("geofsGroundV4TaxiLabels", String(state.taxiwayLabelsEnabled));
        if (state.taxiways.size) requestRender(2, 0);
        setStatus(state.taxiwayLabelsEnabled ? "Taxiway labels on" : "Taxiway labels off", state.taxiways.size ? "ready" : "idle");
        updateUI();
    }
    function toggleStandNumbers() {
        state.standNumbersEnabled = !state.standNumbersEnabled;
        localStorage.setItem("geofsGroundV4StandNumbers", String(state.standNumbersEnabled));
        if (state.taxiways.size || state.parking.size) requestRender(2, 0);
        setStatus(state.standNumbersEnabled ? "Stand numbers on" : "Stand numbers off", state.taxiways.size ? "ready" : "idle");
        updateUI();
    }
    function toggleStandLeadIns() {
        state.standLeadInsEnabled = !state.standLeadInsEnabled;
        localStorage.setItem("geofsGroundV4StandLeadIns", String(state.standLeadInsEnabled));
        if (state.taxiways.size || state.parking.size) requestRender(2, 0);
        setStatus(state.standLeadInsEnabled ? "Stand lead-ins on" : "Stand lead-ins off", state.taxiways.size ? "ready" : "idle");
        updateUI();
    }
    function toggleAutoLoad() {
        state.autoLoadEnabled = !state.autoLoadEnabled;
        localStorage.setItem("geofsGroundV424AutoLoad", String(state.autoLoadEnabled));
        state.autoLoad.candidateSince = 0;
        if (state.autoLoadEnabled) {
            state.autoLoad.startedAt = Date.now();
            state.autoLoad.lastPosition = null;
            state.autoLoad.lastSampleTime = 0;
            state.autoLoad.speedKt = 0;
            state.autoLoad.resetBlockPosition = null;
            setStatus("Auto-load airports on", state.taxiways.size ? "ready" : "idle");
        } else {
            setStatus("Auto-load airports off", state.taxiways.size ? "ready" : "idle");
        }
        updateUI();
    }
    function clearNotificationQueue() {
        state.notificationQueue = [];
        state.notificationShowing = false;
        if (state.notificationHideTimer) {
            clearTimeout(state.notificationHideTimer);
            state.notificationHideTimer = null;
        }
        if (state.notificationHost) {
            state.notificationHost.innerHTML = "";
        }
    }
    function resetDetectorState() {
        const oldCooldowns = state.detector?.cooldowns instanceof Map ? state.detector.cooldowns : new Map;
        state.detector = {
            initialized: false,
            lastPosition: null,
            lastSampleTime: 0,
            speedKt: 0,
            bearingDeg: null,
            highSpeedSuppressed: false,
            taxiSpeedWarningActive: false,
            taxiSpeedFlightLatch: false,
            currentTaxiRef: null,
            taxiCandidateRef: null,
            taxiCandidateSince: 0,
            currentRunwayKey: null,
            currentRunwayFeature: null,
            currentRunwayLabel: null,
            runwayCandidateKey: null,
            runwayCandidateFeature: null,
            runwayCandidateSince: 0,
            lastHoldAlertKey: null,
            parkedStandRef: null,
            standCandidateRef: null,
            standCandidateSince: 0,
            suppressTaxiUntil: 0,
            cooldowns: oldCooldowns
        };
    }
    function toggleNotifications() {
        state.notificationsEnabled = !state.notificationsEnabled;
        localStorage.setItem("geofsGroundV42Notifications", String(state.notificationsEnabled));
        resetDetectorState();
        clearNotificationQueue();
        setStatus(state.notificationsEnabled ? "Airport notifications on" : "Airport notifications off", state.taxiways.size ? "ready" : "idle");
        updateUI();
        if (state.notificationsEnabled) {
            queueNotification("success", "NOTIFICATIONS", "ON", "Airport awareness active", "notif-enabled-test", 1900);
        }
    }
    function showNextNotification() {
        if (!state.notificationsEnabled || state.notificationShowing || !state.notificationHost || state.notificationQueue.length === 0) {
            return;
        }
        const item = state.notificationQueue.shift();
        state.notificationShowing = true;
        const card = document.createElement("div");
        card.className = `twy-notification-card ${item.type || "info"}`;
        const title = document.createElement("div");
        title.className = "twy-notification-title";
        title.textContent = item.title;
        const value = document.createElement("div");
        value.className = "twy-notification-value";
        value.textContent = item.value || "";
        card.append(title, value);
        if (item.meta) {
            const meta = document.createElement("div");
            meta.className = "twy-notification-meta";
            meta.textContent = item.meta;
            card.appendChild(meta);
        }
        state.notificationHost.innerHTML = "";
        state.notificationHost.appendChild(card);
        requestAnimationFrame(() => {
            card.classList.add("show");
        });
        state.notificationHideTimer = setTimeout(() => {
            card.classList.remove("show");
            setTimeout(() => {
                if (state.notificationHost && card.parentNode === state.notificationHost) {
                    state.notificationHost.removeChild(card);
                }
                state.notificationShowing = false;
                state.notificationHideTimer = null;
                showNextNotification();
            }, 220);
        }, item.durationMs || 2600);
    }
    function queueNotification(type, title, value, meta, eventKey, durationMs = 2600) {
        if (!state.notificationsEnabled) return;
        const now = Date.now();
        const key = eventKey || `${type}:${title}:${value}`;
        const last = state.detector.cooldowns.get(key) || 0;
        if (now - last < CFG.notificationCooldownMs) return;
        state.detector.cooldowns.set(key, now);
        if (state.notificationQueue.length >= 3) {
            state.notificationQueue.shift();
        }
        state.notificationQueue.push({
            type: type,
            title: title,
            value: value,
            meta: meta,
            durationMs: durationMs
        });
        showNextNotification();
    }
    function removeMarshallerEntity() {
        const entities = getCesiumEntityCollection();
        if (entities) {
            for (const entity of [ state.marshaller.entity, state.marshaller.badgeEntity ]) {
                if (!entity) continue;
                try {
                    entities.remove(entity);
                } catch (_) {}
            }
        }
        state.marshaller.entity = null;
        state.marshaller.badgeEntity = null;
        state.marshaller.badgeText = null;
        state.marshaller.worldPoint = null;
        state.marshaller.placementMode = null;
        state.marshaller.active = false;
        state.marshaller.signal = null;
        state.marshaller.phase = -1;
    }
    function stopMarshallerMonitor() {
        if (state.marshallerTimer) {
            clearInterval(state.marshallerTimer);
            state.marshallerTimer = null;
        }
        if (state.marshaller.unsubscribeRender) {
            try { state.marshaller.unsubscribeRender(); } catch (_) {}
            state.marshaller.unsubscribeRender = null;
        }
        state.marshaller.scene = null;
    }
    function marshallerStandAxisBearing(feature) {
        const points = feature?.points || [];
        if (points.length < 2) {
            return null;
        }
        const target = parkingTargetPoint(feature);
        const targetAtStart = target === points[0];
        const a = targetAtStart ? points[1] : points[points.length - 2];
        const b = targetAtStart ? points[0] : points[points.length - 1];
        if (!a || !b) return null;
        return bearingDegrees(a, b);
    }
    function showArrivalModeCue() {
        if (!state.root || !state.arrivalModeLabel) return;
        if (state.arrivalModeCueTimer) {
            clearTimeout(state.arrivalModeCueTimer);
            state.arrivalModeCueTimer = null;
        }
        state.root.classList.add("dock-open", "arrival-cue");
        state.arrivalModeLabel.classList.add("show");
        state.arrivalModeCueTimer = setTimeout(() => {
            state.arrivalModeLabel?.classList.remove("show");
            state.root?.classList.remove("dock-open", "arrival-cue");
            state.panel?.classList.remove("open");
            state.menuButton?.classList.remove("active");
            state.standPanel?.classList.remove("open");
            state.standButton?.classList.remove("active");
            state.extrasPanel?.classList.remove("open");
            state.extrasButton?.classList.remove("active");
            state.arrivalModeCueTimer = null;
        }, 2400);
    }
    function marshallerOrientedAxisBearing(feature, aircraft, target) {
        let axis = marshallerStandAxisBearing(feature);
        if (!Number.isFinite(axis) || !aircraft || !target) {
            return axis;
        }
        const inbound = bearingDegrees(aircraft, target);
        if (Number.isFinite(inbound) && angleDifferenceDegrees(axis, inbound) > 90) {
            axis = (axis + 180) % 360;
        }
        return axis;
    }
    function clampMarshallerStopOffset() {
        state.marshallerStopOffsetM = clamp(Number(state.marshallerStopOffsetM) || 0, CFG.marshallerMinStopOffsetM, CFG.marshallerMaxStopOffsetM);
    }
    function updateMarshallerOffsetUI() {
        clampMarshallerStopOffset();
        if (state.marshallerOffsetValue) {
            state.marshallerOffsetValue.textContent = `${Math.round(state.marshallerStopOffsetM)} m`;
        }
        if (state.marshallerOffsetMinus) {
            state.marshallerOffsetMinus.disabled = state.marshallerStopOffsetM <= CFG.marshallerMinStopOffsetM;
        }
        if (state.marshallerOffsetPlus) {
            state.marshallerOffsetPlus.disabled = state.marshallerStopOffsetM >= CFG.marshallerMaxStopOffsetM;
        }
    }
    function adjustMarshallerStopOffset(delta) {
        state.marshallerStopOffsetM += delta;
        clampMarshallerStopOffset();
        localStorage.setItem("geofsGroundV471MarshallerStopOffsetM", String(state.marshallerStopOffsetM));
        updateMarshallerOffsetUI();
        if (state.marshallerEnabled) {
            updateMarshaller();
        }
    }
    function followMeLeadDistanceM() {
        return clamp(
            state.followMe.leadDistanceM,
            CFG.followMeLeadDistanceMinM,
            CFG.followMeLeadDistanceMaxM
        );
    }
    function updateFollowMeDistanceUI() {
        const distance = followMeLeadDistanceM();
        if (state.followMeDistanceValue) state.followMeDistanceValue.textContent = `${Math.round(distance)} m`;
        if (state.followMeDistanceMinus) state.followMeDistanceMinus.disabled = distance <= CFG.followMeLeadDistanceMinM;
        if (state.followMeDistancePlus) state.followMeDistancePlus.disabled = distance >= CFG.followMeLeadDistanceMaxM;
    }
    function adjustFollowMeDistance(delta) {
        state.followMe.leadDistanceM = clamp(
            followMeLeadDistanceM() + delta,
            CFG.followMeLeadDistanceMinM,
            CFG.followMeLeadDistanceMaxM
        );
        localStorage.setItem("geofsGroundV411FollowMeDistanceM", String(state.followMe.leadDistanceM));
        updateFollowMeDistanceUI();
    }
    function marshallerDisplayPoint(target, feature) {
        const aircraft = aircraftLL();
        const axis = marshallerOrientedAxisBearing(feature, aircraft, target);
        if (!Number.isFinite(axis)) {
            return target;
        }
        const radians = axis * Math.PI / 180;
        const forwardNorthM = Math.cos(radians) * CFG.marshallerWorldAheadM;
        const forwardEastM = Math.sin(radians) * CFG.marshallerWorldAheadM;
        const lateralNorthM = -Math.sin(radians) * CFG.marshallerWorldLateralOffsetM;
        const lateralEastM = Math.cos(radians) * CFG.marshallerWorldLateralOffsetM;
        const northM = forwardNorthM + lateralNorthM;
        const eastM = forwardEastM + lateralEastM;
        const lat = target.lat + northM / 111320;
        const lonScale = 111320 * Math.max(.2, Math.cos(target.lat * Math.PI / 180));
        const lon = target.lon + eastM / lonScale;
        return {
            lat: lat,
            lon: lon
        };
    }
    function marshallerGuidanceState() {
        const target = state.standLocator.selectedTarget;
        const feature = state.standLocator.selectedFeature;
        if (!target) return null;
        const aircraft = aircraftLL();
        if (!Number.isFinite(aircraft.lat) || !Number.isFinite(aircraft.lon)) {
            return null;
        }
        const distanceM = geoDistanceMeters(aircraft, target);
        const speedKt = Number.isFinite(state.detector.speedKt) ? state.detector.speedKt : Number.isFinite(state.autoLoad.speedKt) ? state.autoLoad.speedKt : 0;
        const axisBearing = marshallerOrientedAxisBearing(feature, aircraft, target);
        let lateralM = 0;
        let alongRemainingM = null;
        let hasAxis = false;
        let headingErrorDeg = 0;
        let hasHeading = false;
        if (Number.isFinite(axisBearing)) {
            const local = localMeters(target, aircraft);
            const radians = axisBearing * Math.PI / 180;
            lateralM = local.x * Math.cos(radians) - local.y * Math.sin(radians);
            alongRemainingM = -(local.x * Math.sin(radians) + local.y * Math.cos(radians));
            hasAxis = true;
            const aircraftHeading = Number.isFinite(state.detector.bearingDeg) ? state.detector.bearingDeg : Number.isFinite(state.autoLoad.bearingDeg) ? state.autoLoad.bearingDeg : null;
            if (Number.isFinite(aircraftHeading)) {
                headingErrorDeg = angleDifferenceDegrees(aircraftHeading, axisBearing);
                hasHeading = true;
            }
        }
        clampMarshallerStopOffset();
        const remainingM = hasAxis && Number.isFinite(alongRemainingM) ? alongRemainingM - state.marshallerStopOffsetM : distanceM - Math.max(0, state.marshallerStopOffsetM);
        let signal = "FORWARD";
        if (remainingM <= CFG.marshallerStopWindowM) {
            signal = "STOP";
        } else if (hasAxis && hasHeading && remainingM > CFG.marshallerFaceMeMinRemainingM && headingErrorDeg > CFG.marshallerFaceMeHeadingThresholdDeg) {
            signal = "FACE ME";
        } else if (hasAxis && distanceM <= CFG.marshallerLateralMaxDistanceM && Math.abs(lateralM) >= CFG.marshallerLateralThresholdM) {
            signal = lateralM > 0 ? "LEFT" : "RIGHT";
        } else if (remainingM <= CFG.marshallerSlowDistanceM || remainingM <= 35 && speedKt >= CFG.marshallerTooFastKt) {
            signal = "SLOW";
        } else {
            signal = "FORWARD";
        }
        return {
            signal: signal,
            distanceM: distanceM,
            remainingM: remainingM,
            speedKt: speedKt,
            lateralM: lateralM,
            alongRemainingM: alongRemainingM,
            hasAxis: hasAxis,
            headingErrorDeg: headingErrorDeg,
            hasHeading: hasHeading
        };
    }
    function createMarshallerImage(signal, phase) {
        const cacheKey = `${signal}:${phase}`;
        if (state.marshaller.imageCache.has(cacheKey)) {
            return state.marshaller.imageCache.get(cacheKey);
        }
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 120;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 160, 120);
        ctx.save();
        ctx.save();
        const panelX = 16;
        const panelY = 10;
        const panelW = 128;
        const panelH = 100;
        const radius = 14;
        ctx.beginPath();
        ctx.moveTo(panelX + radius, panelY);
        ctx.lineTo(panelX + panelW - radius, panelY);
        ctx.quadraticCurveTo(panelX + panelW, panelY, panelX + panelW, panelY + radius);
        ctx.lineTo(panelX + panelW, panelY + panelH - radius);
        ctx.quadraticCurveTo(panelX + panelW, panelY + panelH, panelX + panelW - radius, panelY + panelH);
        ctx.lineTo(panelX + radius, panelY + panelH);
        ctx.quadraticCurveTo(panelX, panelY + panelH, panelX, panelY + panelH - radius);
        ctx.lineTo(panelX, panelY + radius);
        ctx.quadraticCurveTo(panelX, panelY, panelX + radius, panelY);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#4A4A4A";
        ctx.stroke();
        ctx.restore();
        const cx = 80;
        const cy = 56;
        const wand = 32;
        function stick(x1, y1, x2, y2) {
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 9;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.shadowColor = "rgba(255,35,35,.32)";
            ctx.shadowBlur = 3;
            ctx.strokeStyle = "#FF4444";
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }
        if (signal === "STOP") {
            stick(cx - 22, cy + 20, cx + 18, cy - 25);
            stick(cx + 22, cy + 20, cx - 18, cy - 25);
        } else if (signal === "FACE ME") {
            stick(cx - 22, cy + 20, cx - 22, cy - 30);
            stick(cx + 22, cy + 20, cx + 22, cy - 30);
        } else if (signal === "LEFT") {
            stick(cx - 14, cy + 18, cx - 48, cy - 3);
            stick(cx + 14, cy + 18, cx + 14, cy - wand);
        } else if (signal === "RIGHT") {
            stick(cx + 14, cy + 18, cx + 48, cy - 3);
            stick(cx - 14, cy + 18, cx - 14, cy - wand);
        } else if (signal === "SLOW") {
            const delta = phase ? 7 : 0;
            stick(cx - 15, cy + 18, cx - 36 + delta, cy - 18 + delta);
            stick(cx + 15, cy + 18, cx + 36 - delta, cy - 18 + delta);
        } else {
            const delta = phase ? 12 : -4;
            stick(cx - 15, cy + 18, cx - 42 + delta, cy - 28 + delta);
            stick(cx + 15, cy + 18, cx + 42 - delta, cy - 28 + delta);
        }
        ctx.restore();
        ctx.save();
        ctx.font = signal === "FACE ME" ? "700 13px Arial" : "700 15px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeText(signal, 80, 96);
        ctx.fillStyle = "#FF6060";
        ctx.shadowColor = "rgba(255,30,30,.42)";
        ctx.shadowBlur = 4;
        ctx.fillText(signal, 80, 96);
        ctx.restore();
        const image = canvas.toDataURL("image/png");
        state.marshaller.imageCache.set(cacheKey, image);
        return image;
    }
    // Keep one real-world marshaller near the stand when it fits on screen.
    // Otherwise, move that same sign onto a camera ray inside the upper safe
    // region, away from the aircraft and with room for its distance badge.
    // Recalculate each frame so changing cameras or resuming a tab cannot
    // leave a stale billboard in the middle of the aircraft.
    function positionMarshallerForView(scene = window.geofs?.api?.viewer?.scene) {
        const Cesium = window.Cesium;
        const marshaller = state.marshaller;
        const camera = scene?.camera;
        const canvas = scene?.canvas;
        if (!marshaller.entity || !marshaller.worldPoint || !Cesium || !camera || !canvas) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!(width > 0 && height > 0)) return;

        const minX = Math.min(85, width * .25);
        const maxX = Math.max(minX, width - 245);
        const minY = Math.min(116, height * .28);
        const maxY = Math.max(minY, height * .44);
        const middleX = clamp(width * .52, minX, maxX);
        const middleY = clamp(height * .32, minY, maxY);
        const point = marshaller.worldPoint;
        let groundHeight = null;
        try {
            if (Cesium.Cartographic?.fromDegrees && scene.globe?.getHeight) {
                groundHeight = scene.globe.getHeight(Cesium.Cartographic.fromDegrees(point.lon, point.lat));
            }
        } catch (_) {}
        const physicalPosition = Cesium.Cartesian3.fromDegrees(
            point.lon, point.lat,
            Number.isFinite(groundHeight) ? groundHeight + CFG.marshallerWorldHeightM : CFG.marshallerWorldHeightM
        );

        let projected = null;
        try {
            const transforms = Cesium.SceneTransforms;
            const projection = transforms?.worldToWindowCoordinates || transforms?.wgs84ToWindowCoordinates;
            const cameraPosition = camera.positionWC || camera.position;
            const cameraDirection = camera.directionWC || camera.direction;
            const relative = Cesium.Cartesian3.subtract(physicalPosition, cameraPosition, new Cesium.Cartesian3());
            if (Cesium.Cartesian3.dot(relative, cameraDirection) > 0 && projection) {
                projected = projection.call(transforms, scene, physicalPosition);
            }
        } catch (_) {}

        const hasScreenPoint = Number.isFinite(projected?.x) && Number.isFinite(projected?.y);
        const x = hasScreenPoint ? clamp(projected.x, minX, maxX) : middleX;
        const y = hasScreenPoint ? clamp(projected.y, minY, maxY) : middleY;
        const aircraft = aircraftLL();
        const clearOfAircraft = Number.isFinite(aircraft.lat) && Number.isFinite(aircraft.lon)
            && geoDistanceMeters(aircraft, point) >= CFG.marshallerMinAircraftClearanceM;
        const onSafeScreen = clearOfAircraft && hasScreenPoint && projected.x === x && projected.y === y;
        let placement = physicalPosition;
        let mode = "world";
        if (!onSafeScreen) {
            const ray = camera.getPickRay?.(new Cesium.Cartesian2(x, y));
            if (!ray?.origin || !ray?.direction) return;
            placement = Cesium.Cartesian3.add(
                ray.origin,
                Cesium.Cartesian3.multiplyByScalar(ray.direction, 160, new Cesium.Cartesian3()),
                new Cesium.Cartesian3()
            );
            mode = "screen-safe";
        }

        if (marshaller.placementMode !== mode || mode === "screen-safe") {
            const heightReference = mode === "world"
                ? Cesium.HeightReference?.RELATIVE_TO_GROUND
                : Cesium.HeightReference?.NONE;
            for (const entity of [ marshaller.entity, marshaller.badgeEntity ]) {
                if (!entity) continue;
                entity.position = placement;
                if (entity.billboard) entity.billboard.heightReference = heightReference;
            }
            marshaller.placementMode = mode;
        }
    }
    function connectMarshallerCameraUpdates() {
        const scene = window.geofs?.api?.viewer?.scene;
        if (state.marshaller.scene === scene) return;
        if (state.marshaller.unsubscribeRender) {
            try { state.marshaller.unsubscribeRender(); } catch (_) {}
        }
        state.marshaller.scene = scene || null;
        state.marshaller.unsubscribeRender = null;
        if (scene?.preRender?.addEventListener) {
            state.marshaller.unsubscribeRender = scene.preRender.addEventListener(() => {
                if (state.marshaller.active) positionMarshallerForView(scene);
            });
        }
    }
    function refreshMarshallerAfterFocus() {
        if (document.hidden || !state.marshallerEnabled || !state.standLocator.selectedTarget) return;
        const refresh = () => {
            if (document.hidden) return;
            connectMarshallerCameraUpdates();
            updateMarshaller();
            window.geofs?.api?.viewer?.scene?.requestRender?.();
        };
        requestAnimationFrame(refresh);
        setTimeout(refresh, 120);
    }
    function ensureMarshallerEntity() {
        if (!state.marshallerEnabled || !state.standLocator.selectedTarget) {
            removeMarshallerEntity();
            return false;
        }
        const Cesium = window.Cesium;
        const entities = getCesiumEntityCollection();
        if (!Cesium || !entities) return false;
        if (state.marshaller.entity && typeof entities.contains === "function" && !entities.contains(state.marshaller.entity)) {
            removeMarshallerEntity();
        }
        const target = state.standLocator.selectedTarget;
        const displayPoint = marshallerDisplayPoint(target, state.standLocator.selectedFeature);
        if (!state.marshaller.entity) {
            const position = Cesium.Cartesian3.fromDegrees(displayPoint.lon, displayPoint.lat, CFG.marshallerWorldHeightM);
            const displayCondition = Cesium.DistanceDisplayCondition ? new Cesium.DistanceDisplayCondition(0, CFG.marshallerDisplayDistanceM) : undefined;
            try {
                state.marshaller.entity = entities.add({
                    position: position,
                    billboard: {
                        image: createMarshallerImage("FORWARD", 0),
                        width: 112,
                        height: 84,
                        verticalOrigin: Cesium.VerticalOrigin?.BOTTOM,
                        horizontalOrigin: Cesium.HorizontalOrigin?.CENTER,
                        heightReference: Cesium.HeightReference?.RELATIVE_TO_GROUND,
                        pixelOffset: new Cesium.Cartesian2(0, -14),
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        distanceDisplayCondition: displayCondition,
                        show: false
                    }
                });
                const badge = createStandLocatorSign(state.standLocator.selectedRef || "", "");
                state.marshaller.badgeEntity = entities.add({
                    position: position,
                    billboard: {
                        image: badge?.image,
                        width: badge?.width,
                        height: badge?.height,
                        pixelOffset: new Cesium.Cartesian2(CFG.marshallerSidePanelOffsetXPx, CFG.marshallerSidePanelOffsetYPx),
                        horizontalOrigin: Cesium.HorizontalOrigin?.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin?.CENTER,
                        heightReference: Cesium.HeightReference?.RELATIVE_TO_GROUND,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        distanceDisplayCondition: displayCondition,
                        show: false
                    }
                });
                state.marshaller.worldPoint = displayPoint;
                state.marshaller.placementMode = "world";
            } catch (error) {
                console.error("[Immersive Airports] Marshaller entity creation failed", error);
                removeMarshallerEntity();
                syncStandMarkerVisibility();
                return false;
            }
        }
        return !!state.marshaller.entity;
    }
    function updateMarshaller() {
        if (!state.marshallerEnabled || !state.standLocator.selectedTarget) {
            removeMarshallerEntity();
            return;
        }
        if (!ensureMarshallerEntity()) return;
        connectMarshallerCameraUpdates();
        const guidance = marshallerGuidanceState();
        if (!guidance) return;
        const active = marshallerIsActivelyGuiding();
        state.marshaller.active = active;
        if (state.marshaller.entity?.billboard) {
            state.marshaller.entity.billboard.show = active;
        }
        if (state.marshaller.badgeEntity?.billboard) {
            state.marshaller.badgeEntity.billboard.show = active;
            if (active) {
                const ref = state.standLocator.selectedRef || "";
                const distanceText = standDistanceText(guidance.distanceM);
                const badgeText = `STAND ${ref}\n${distanceText}`;
                if (badgeText !== state.marshaller.badgeText) {
                    const graphic = createStandLocatorSign(ref, distanceText);
                    if (graphic) {
                        state.marshaller.badgeEntity.billboard.image = graphic.image;
                        state.marshaller.badgeEntity.billboard.width = graphic.width;
                        state.marshaller.badgeEntity.billboard.height = graphic.height;
                        state.marshaller.badgeText = badgeText;
                    }
                }
            }
        }
        if (active) positionMarshallerForView();
        syncStandMarkerVisibility();
        const now = Date.now();
        let phase = 0;
        if (guidance.signal === "FORWARD") {
            phase = Math.floor(now / 230) % 2;
        } else if (guidance.signal === "SLOW") {
            phase = Math.floor(now / 650) % 2;
        }
        if (guidance.signal !== state.marshaller.signal || phase !== state.marshaller.phase) {
            state.marshaller.signal = guidance.signal;
            state.marshaller.phase = phase;
            if (state.marshaller.entity?.billboard) {
                state.marshaller.entity.billboard.image = createMarshallerImage(guidance.signal, phase);
            }
        }
    }
    function startMarshallerMonitor() {
        if (!state.marshallerEnabled || !state.standLocator.selectedTarget || state.marshallerTimer) {
            return;
        }
        updateMarshaller();
        state.marshallerTimer = setInterval(updateMarshaller, CFG.marshallerUpdateMs);
    }
    function marshallerIsActivelyGuiding() {
        if (!state.marshallerEnabled || !state.standLocator.selectedTarget) {
            return false;
        }
        const aircraft = aircraftLL();
        if (!Number.isFinite(aircraft.lat) || !Number.isFinite(aircraft.lon)) {
            return false;
        }
        const distanceM = geoDistanceMeters(aircraft, state.standLocator.selectedTarget);
        return distanceM <= CFG.marshallerActiveRangeM;
    }
    function syncStandMarkerVisibility() {
        const marker = state.standLocator.markerEntity;
        const sign = state.standLocator.labelEntity;
        if (!marker && !sign) return;
        const active = marshallerIsActivelyGuiding() && !!state.marshaller.entity;
        try {
            if (marker?.billboard) marker.billboard.show = !active;
            if (sign?.billboard) sign.billboard.show = !active;
        } catch (_) {}
    }
    function syncMarshaller() {
        if (state.marshallerEnabled && state.standLocator.selectedTarget) {
            startMarshallerMonitor();
            updateMarshaller();
        } else {
            stopMarshallerMonitor();
            removeMarshallerEntity();
            syncStandMarkerVisibility();
        }
    }
    function toggleMarshaller() {
        state.marshallerEnabled = !state.marshallerEnabled;
        localStorage.setItem("geofsGroundV470Marshaller", String(state.marshallerEnabled));
        syncMarshaller();
        updateUI();
        if (state.marshallerEnabled) {
            setStatus(state.standLocator.selectedTarget ? "Marshaller guidance on" : "Marshaller on · select a stand", state.standLocator.selectedTarget ? "ready" : "idle");
        } else {
            setStatus("Marshaller guidance off", state.taxiways.size ? "ready" : "idle");
        }
    }
    function getCesiumEntityCollection() {
        const viewer = window.geofs?.api?.viewer;
        return viewer?.entities || null;
    }
    function normalizeStandQuery(raw) {
        let value = String(raw ?? "").trim().toUpperCase();
        value = value.replace(/^(STAND|GATE)\s*/i, "");
        value = value.replace(/\s+/g, "");
        return value;
    }
    function followMeMovementFeatures(dataset = state.minimapAirportData) {
        if (!dataset) return [];
        return [ ...(dataset.taxiways || []), ...(dataset.taxilanes || []) ];
    }
    function followMeRoutingDataset() {
        if (state.minimapAirportReady && minimapAirportDatasetUseful(state.minimapAirportData)) {
            return {
                dataset: state.minimapAirportData,
                source: `complete:${state.minimapAirportSource || state.gridSignature || "airport"}`,
                complete: true
            };
        }
        if (!state.chunkData.size) return null;
        const source = `loaded:${state.loadGeneration}:${state.chunkData.size}:${state.taxiways.size}:${state.taxilanes.size}:${state.parking.size}`;
        const followMe = state.followMe;
        if (followMe.loadedDatasetSource !== source || !followMe.loadedDataset) {
            followMe.loadedDataset = {
                taxiways: [ ...state.taxiways.values() ],
                taxilanes: [ ...state.taxilanes.values() ],
                holdings: [ ...state.holdings.values() ],
                parking: [ ...state.parking.values() ],
                runways: [ ...state.runways.values() ],
                aprons: [ ...state.aprons.values() ]
            };
            followMe.loadedDatasetSource = source;
        }
        return {
            dataset: followMe.loadedDataset,
            source: source,
            complete: false
        };
    }
    function followMeFeatureDistanceToMovement(point, movementFeatures) {
        if (!point || !movementFeatures?.length) return Infinity;
        let best = Infinity;
        for (const feature of movementFeatures) {
            const distance = featureDistanceMeters(point, feature);
            if (distance < best) best = distance;
        }
        return best;
    }
    function followMeParkingTargetPoint(feature, movementFeatures = null, movementIndex = null) {
        if (!feature) return null;
        if (feature.point) return feature.point;
        const points = feature.points || [];
        if (!points.length) return null;
        if (points.length === 1) return points[0];
        if (feature.followMeTargetPoint) return feature.followMeTargetPoint;
        const allMovementFeatures = movementFeatures || followMeMovementFeatures();
        const distanceToMovement = point => {
            if (movementIndex) {
                const match = followMeNearestIndexedSegment(point, movementIndex, CFG.followMeGraphSearchRadiusM);
                if (match) return match.distance;
            }
            return followMeFeatureDistanceToMovement(point, allMovementFeatures);
        };
        if (!allMovementFeatures.length && !movementIndex) return parkingTargetPoint(feature);
        const first = points[0];
        const last = points[points.length - 1];
        const firstDistance = distanceToMovement(first);
        const lastDistance = distanceToMovement(last);
        let target = last;
        if (Number.isFinite(firstDistance) && Number.isFinite(lastDistance) && Math.abs(firstDistance - lastDistance) > 1.5) {
            target = firstDistance > lastDistance ? first : last;
        } else if (Number.isFinite(firstDistance) !== Number.isFinite(lastDistance)) {
            target = Number.isFinite(firstDistance) ? last : first;
        }
        feature.followMeTargetPoint = target;
        return target;
    }
    function standTargetPoint(feature) {
        if (!feature) return null;
        return feature.chunkKey?.startsWith("minimap_") ? followMeParkingTargetPoint(feature, null, state.followMe.graph?.movementIndex) : parkingTargetPoint(feature);
    }
    function standLocatorFeatures() {
        const unique = new Map;
        for (const feature of state.parking.values()) {
            unique.set(featureKey(feature), feature);
        }
        for (const feature of state.minimapAirportData?.parking || []) {
            unique.set(featureKey(feature), feature);
        }
        return [ ...unique.values() ];
    }
    function standListTagText(tags, keys = []) {
        return keys.map(key => tags?.[key]).filter(value => value !== undefined && value !== null && String(value).trim()).map(value => String(value).trim()).join(" ");
    }
    function standListIsCargoTags(tags = {}) {
        const text = standListTagText(tags, [ "cargo", "usage", "function", "type", "service", "name", "official_name", "description" ]).toLowerCase();
        return tags.cargo === "yes" || /cargo|freight|logistics/.test(text);
    }
    function standListMeaningfulTag(value) {
        const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
        if (!normalized || /^(yes|no|true|false|unknown|undefined|none|n\/a|0|area|apron|stand|gate|parking)$/i.test(normalized)) return null;
        return normalized.slice(0, 48);
    }
    function standListIsRemoteTags(tags = {}) {
        const text = standListTagText(tags, [
            "parking_position:category", "parking_position:type", "parking:category",
            "stand:type", "usage", "function", "name", "official_name", "description"
        ]);
        return /\bremote\b|\bhard[\s-]?stand\b|\bbus[\s-]?stand\b/i.test(text);
    }
    function standListTerminalLabel(value, tags = {}) {
        const raw = String(value || "").trim().replace(/\s+/g, " ");
        const text = `${raw} ${standListTagText(tags, [ "name", "official_name", "ref" ])}`.trim();
        if (!text) return "Terminal";
        if (/cargo|freight|logistics/i.test(text)) return "Cargo";
        let match = text.match(/\bterminal\s*[-#: ]?\s*([0-9]+|[A-Z])\b/i);
        if (!match) match = text.match(/\bT\s*([0-9]+)\b/i);
        if (match) return `Terminal ${match[1].toUpperCase()}`;
        if (/^terminal\b/i.test(raw)) return raw.slice(0, 42);
        return raw ? `Terminal ${raw.slice(0, 34)}` : "Terminal";
    }
    function standListGroupFromTags(tags = {}) {
        if (standListIsCargoTags(tags)) return "Cargo";
        if (standListIsRemoteTags(tags)) return "Remote";
        const terminal = [
            tags.terminal, tags["terminal:ref"], tags["ref:terminal"],
            tags["building:terminal"], tags["airport:terminal"]
        ].map(standListMeaningfulTag).find(Boolean);
        const namedTerminal = [ tags.name, tags.official_name, tags.description ]
            .map(standListMeaningfulTag).find(value => /\bterminal\b/i.test(value || ""));
        if (terminal || namedTerminal) return standListTerminalLabel(terminal || namedTerminal, tags);
        // 'area=yes' describes OSM polygon geometry, never an airport area name.
        for (const [key, prefix] of [
            [ "parking:area", "Area" ], [ "aerodrome:area", "Area" ], [ "zone", "Zone" ]
        ]) {
            const area = standListMeaningfulTag(tags[key]);
            if (!area) continue;
            if (/^(terminal|apron|pier|area|zone)\b/i.test(area)) return area;
            return prefix + " " + area;
        }
        return null;
    }
    function standListPoint(feature) {
        if (feature?.point) return feature.point;
        if (feature?.parkingTargetPoint) return feature.parkingTargetPoint;
        const points = feature?.points || [];
        return points.length ? points[points.length - 1] : null;
    }
    function standListPointInPolygon(point, polygon) {
        if (!point || !Array.isArray(polygon) || polygon.length < 3) return false;
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[i];
            const b = polygon[j];
            const crosses = (a.lon > point.lon) !== (b.lon > point.lon);
            if (crosses) {
                const latAtPointLon = (b.lat - a.lat) * (point.lon - a.lon) / (b.lon - a.lon || 1e-12) + a.lat;
                if (point.lat < latAtPointLon) inside = !inside;
            }
        }
        return inside;
    }
    function standListDistanceToFeatureM(point, feature) {
        if (!point || !feature) return Infinity;
        if (feature.points?.length >= 3 && standListPointInPolygon(point, feature.points)) return 0;
        return featureDistanceMeters(point, feature);
    }
    function standListApronFeatures() {
        const unique = new Map;
        const add = feature => {
            if (!feature) return;
            unique.set(featureKey(feature), feature);
        };
        for (const feature of state.aprons.values()) add(feature);
        for (const feature of state.minimapAirportData?.aprons || []) add(feature);
        for (const feature of state.standMetadata?.aprons || []) add(feature);
        return [ ...unique.values() ];
    }
    function standListApronGroup(feature) {
        const tags = feature?.tags || {};
        const taggedGroup = standListGroupFromTags(tags);
        if (taggedGroup) return taggedGroup;
        const label = standListMeaningfulTag(tags.name || tags.ref || tags["aeroway:ref"]);
        if (!label || /^apron$/i.test(label)) return null;
        return /^apron\b/i.test(label) ? label.slice(0, 36) : "Apron " + label.slice(0, 36);
    }
    function standListContextGroup(feature) {
        const point = standListPoint(feature);
        if (!point) return null;
        const ref = normalizeStandQuery(feature.ref);
        for (const gate of state.standMetadata?.gates || []) {
            if (!ref || normalizeStandQuery(gate.ref) !== ref) continue;
            // A passenger gate is not necessarily the stand with the same ref.
            if (standListDistanceToFeatureM(point, gate) > CFG.standListGateMatchMaxDistanceM) continue;
            const group = standListGroupFromTags(gate.tags || {});
            if (group) return group;
        }
        const apronCandidates = [];
        for (const apron of standListApronFeatures()) {
            const group = standListApronGroup(apron);
            if (!group) continue;
            const distance = standListDistanceToFeatureM(point, apron);
            if (distance > CFG.standListApronMaxDistanceM) continue;
            apronCandidates.push({ group: group, distance: distance });
        }
        apronCandidates.sort((a, b) => a.distance - b.distance);
        const bestApron = apronCandidates[0] || null;
        const ambiguousApron = bestApron && apronCandidates.some(candidate =>
            candidate.group !== bestApron.group && candidate.distance - bestApron.distance < CFG.standListTerminalAmbiguityM
        );
        const nearestApron = ambiguousApron ? null : bestApron;
        if (nearestApron && /^(Cargo|Remote|Terminal\b)/i.test(nearestApron.group)) return nearestApron.group;
        const terminalCandidates = [];
        for (const terminal of state.standMetadata?.terminals || []) {
            const distance = standListDistanceToFeatureM(point, terminal);
            const limit = terminal.point ? CFG.standListTerminalNodeMaxDistanceM : CFG.standListTerminalMaxDistanceM;
            if (distance > limit) continue;
            terminalCandidates.push({ group: terminal.label || "Terminal", distance: distance });
        }
        terminalCandidates.sort((a, b) => a.distance - b.distance);
        if (terminalCandidates.length) {
            const best = terminalCandidates[0];
            const ambiguous = terminalCandidates.some(candidate =>
                candidate.group !== best.group &&
                candidate.distance - best.distance < CFG.standListTerminalAmbiguityM
            );
            if (!ambiguous) return best.group;
        }
        // A distant stand on a mapped apron is probably remote, but distance
        // alone does not prove it: keep that estimate distinct from OSM tags.
        const terminalFootprints = (state.standMetadata?.terminals || []).filter(terminal => terminal.points?.length >= 3);
        const onApron = standListApronFeatures().some(apron =>
            standListDistanceToFeatureM(point, apron) <= CFG.standListApronMaxDistanceM
        );
        if (state.standMetadataReady && terminalFootprints.length && onApron) {
            const nearestTerminalM = Math.min(...terminalFootprints.map(terminal => standListDistanceToFeatureM(point, terminal)));
            if (nearestTerminalM >= CFG.standListRemoteMinTerminalDistanceM) return "Likely remote";
        }
        return nearestApron?.group || null;
    }
    function standListGroup(feature) {
        return standListGroupFromTags(feature?.tags || {}) || standListContextGroup(feature) || "Unclassified";
    }
    function standListNeedsMetadata() {
        return standLocatorFeatures().some(feature => !standListGroupFromTags(feature?.tags || {}));
    }
    function standListMetadataSummarySuffix() {
        if (state.standMetadataLoading) return " · grouping areas…";
        if (state.standMetadataStatus === "waiting") return " · waiting for airport";
        if (state.standMetadataStatus === "error") return " · limited grouping";
        return "";
    }
    function standListCapability(feature) {
        const tags = feature?.tags || {};
        const value = tags.aircraft || tags["aircraft:type"] || tags["aircraft:code"] || tags["max_aircraft"];
        return value ? String(value).trim() : "";
    }
    function standListEntries() {
        const entries = new Map;
        for (const feature of standLocatorFeatures()) {
            const ref = normalizeRef(feature.ref);
            if (!ref) continue;
            const key = normalizeStandQuery(ref);
            if (!key || entries.has(key)) continue;
            entries.set(key, {
                ref: ref.toUpperCase(),
                feature: feature,
                group: standListGroup(feature),
                capability: standListCapability(feature)
            });
        }
        return [ ...entries.values() ].sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true, sensitivity: "base" }));
    }
    function standListDisplayGroup(entry) {
        if (entry.group !== "Unclassified") return entry.group;
        const numeric = entry.ref.match(/^\d{2,4}$/);
        if (numeric) {
            const start = Math.floor(Number(entry.ref) / 100) * 100;
            return "Unclassified · " + String(start).padStart(2, "0") + "–" + (start + 99);
        }
        const prefix = entry.ref.match(/^([A-Z]{1,3})\d/);
        if (prefix) return "Unclassified · " + prefix[1] + " series";
        return "Unclassified";
    }
    function renderStandList() {
        if (!state.standListBody || !state.standListSummary) return;
        const entries = standListEntries();
        const query = normalizeStandQuery(state.standListSearchInput?.value);
        const visibleEntries = query
            ? entries.filter(entry => normalizeStandQuery(entry.ref).includes(query) || normalizeStandQuery(entry.group).includes(query))
            : entries;
        state.standListSummary.textContent = entries.length
            ? String(entries.length) + " stands" + (query ? " · " + visibleEntries.length + " matching" : "") + standListMetadataSummarySuffix()
            : "No stand data loaded yet";
        const previousScrollTop = state.standListBody.scrollTop;
        state.standListBody.replaceChildren();
        if (!entries.length) {
            const empty = document.createElement("div");
            empty.className = "twy-stand-list-empty";
            empty.textContent = "Load an airport first";
            state.standListBody.appendChild(empty);
            return;
        }
        if (!visibleEntries.length) {
            const empty = document.createElement("div");
            empty.className = "twy-stand-list-empty";
            empty.textContent = "No matching stands";
            state.standListBody.appendChild(empty);
            return;
        }
        const groups = new Map;
        for (const entry of visibleEntries) {
            const group = standListDisplayGroup(entry);
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group).push(entry);
        }
        const groupOrder = group => {
            if (/^terminal\b/i.test(group)) return 0;
            if (/^(Pier|Apron|Area|Zone)\b/i.test(group)) return 1;
            if (group === "Cargo") return 2;
            if (group === "Remote") return 3;
            if (group === "Likely remote") return 4;
            if (group.startsWith("Unclassified")) return 5;
            return 6;
        };
        [ ...groups.entries() ].sort((a, b) => groupOrder(a[0]) - groupOrder(b[0]) || a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: "base" })).forEach(([group, groupEntries]) => {
            const section = document.createElement("section");
            section.className = "twy-stand-list-section";
            const heading = document.createElement("div");
            heading.className = "twy-stand-list-group";
            const title = document.createElement("span");
            title.textContent = group;
            const count = document.createElement("span");
            count.className = "twy-stand-list-count";
            count.textContent = String(groupEntries.length);
            heading.append(title, count);
            if (group === "Likely remote") {
                heading.title = "Estimated from apron and terminal distances. Not explicitly tagged as remote.";
            } else if (group.startsWith("Unclassified · ")) {
                heading.title = "Stand numbers grouped for navigation only. No terminal assignment is implied.";
            }
            section.appendChild(heading);
            const grid = document.createElement("div");
            grid.className = "twy-stand-list-grid";
            groupEntries.forEach(entry => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "twy-stand-list-entry";
                button.dataset.ref = entry.ref;
                const main = document.createElement("span");
                main.className = "twy-stand-list-ref";
                main.textContent = entry.ref;
                button.appendChild(main);
                if (entry.capability) {
                    const meta = document.createElement("span");
                    meta.className = "twy-stand-list-meta";
                    meta.textContent = entry.capability;
                    button.appendChild(meta);
                }
                button.classList.toggle("selected", normalizeStandQuery(entry.ref) === normalizeStandQuery(state.standLocator.selectedRef || ""));
                button.addEventListener("click", event => {
                    event.stopPropagation();
                    selectStand(entry.ref);
                });
                grid.appendChild(button);
            });
            section.appendChild(grid);
            state.standListBody.appendChild(section);
        });
        state.standListBody.scrollTop = previousScrollTop;
    }
    function setStandListOpen(open) {
        const next = !!open;
        state.standListWindow?.classList.toggle("open", next);
        state.standListButton?.classList.toggle("active", next);
        if (next) {
            renderStandList();
            ensureStandListMetadata();
        }
    }
    function standMetadataBounds() {
        const bounds = state.queryBounds;
        if (bounds && [ bounds.south, bounds.west, bounds.north, bounds.east ].every(Number.isFinite)) {
            return bounds;
        }
        const center = minimapAirportCenter();
        const radiusM = Math.max(1e3, Number(state.minimapAirportRadiusM) || CFG.minimapAirportInitialRadiusM);
        if (!Number.isFinite(center.lat) || !Number.isFinite(center.lon)) return null;
        const latPad = radiusM / 111320;
        const lonPad = radiusM / (111320 * Math.max(.15, Math.cos(center.lat * Math.PI / 180)));
        return {
            south: center.lat - latPad,
            west: center.lon - lonPad,
            north: center.lat + latPad,
            east: center.lon + lonPad
        };
    }
    function buildStandMetadataQuery(bounds) {
        const bbox = `${fpe(bounds.south)},${fpe(bounds.west)},${fpe(bounds.north)},${fpe(bounds.east)}`;
        return `\n[out:json][timeout:20];\n(\n    way["aeroway"="terminal"](${bbox});\n    node["aeroway"="terminal"](${bbox});\n    way["building"="terminal"](${bbox});\n    way["building"="transportation"](${bbox});\n\n    way["aeroway"="gate"](${bbox});\n    node["aeroway"="gate"](${bbox});\n    way["aeroway"="apron"](${bbox});\n);\nout body;\n>;\nout skel qt;\n`;
    }
    function standMetadataCacheKey(source) {
        return `${CFG.standMetadataCachePrefix}${encodeURIComponent(source)}`;
    }
    function standMetadataValid(metadata) {
        return !!metadata && [ "terminals", "gates", "aprons" ].every(field => Array.isArray(metadata[field]));
    }
    function loadStandMetadataCache(source) {
        if (!CFG.cacheEnabled || !source) return null;
        try {
            const raw = localStorage.getItem(standMetadataCacheKey(source));
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (!cached || Date.now() - Number(cached.time) > CFG.standMetadataCacheLifetimeMs || !standMetadataValid(cached.metadata)) {
                localStorage.removeItem(standMetadataCacheKey(source));
                return null;
            }
            return cached.metadata;
        } catch (_) {
            return null;
        }
    }
    function saveStandMetadataCache(source, metadata) {
        if (!CFG.cacheEnabled || !source || !standMetadataValid(metadata)) return;
        try {
            localStorage.setItem(standMetadataCacheKey(source), JSON.stringify({
                time: Date.now(),
                metadata: metadata
            }));
        } catch (_) {}
    }
    function standMetadataCenter(points) {
        if (!Array.isArray(points) || !points.length) return null;
        let lat = 0;
        let lon = 0;
        for (const point of points) {
            lat += point.lat;
            lon += point.lon;
        }
        return {
            lat: lat / points.length,
            lon: lon / points.length
        };
    }
    function standMetadataIsTerminal(tags = {}) {
        const aeroway = String(tags.aeroway || "").toLowerCase();
        const building = String(tags.building || "").toLowerCase();
        if (aeroway === "terminal" || building === "terminal") return true;
        if (building !== "transportation") return false;
        const text = standListTagText(tags, [ "name", "official_name", "ref", "description", "terminal", "function", "type" ]).toLowerCase();
        return /terminal|airport|passenger|cargo|freight/.test(text);
    }
    function standMetadataLabel(tags = {}) {
        if (standListIsCargoTags(tags)) return "Cargo";
        const raw = [
            tags.terminal, tags["terminal:ref"], tags["ref:terminal"],
            tags.ref, tags.name, tags.official_name
        ].map(standListMeaningfulTag).find(Boolean);
        return standListTerminalLabel(raw || "Terminal", tags);
    }
    function parseStandMetadata(data) {
        const nodes = new Map;
        for (const element of data.elements || []) {
            if (element.type === "node" && Number.isFinite(Number(element.lat)) && Number.isFinite(Number(element.lon))) {
                nodes.set(element.id, element);
            }
        }
        const metadata = {
            terminals: [],
            gates: [],
            aprons: []
        };
        const addNode = element => {
            if (element.type !== "node" || !element.tags) return;
            const point = {
                lat: Number(element.lat),
                lon: Number(element.lon)
            };
            if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return;
            if (standMetadataIsTerminal(element.tags)) {
                metadata.terminals.push({
                    id: element.id,
                    osmType: "node",
                    point: point,
                    center: point,
                    tags: element.tags,
                    label: standMetadataLabel(element.tags)
                });
            }
            if (String(element.tags.aeroway || "").toLowerCase() === "gate") {
                metadata.gates.push({
                    id: element.id,
                    osmType: "node",
                    point: point,
                    ref: cleanRef(element.tags.ref),
                    tags: element.tags
                });
            }
        };
        for (const element of data.elements || []) addNode(element);
        for (const element of data.elements || []) {
            if (element.type !== "way" || !Array.isArray(element.nodes) || !element.tags) continue;
            const points = element.nodes.map(nodeId => nodes.get(nodeId)).filter(Boolean).map(node => ({
                lat: Number(node.lat),
                lon: Number(node.lon)
            })).filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lon));
            if (points.length < 2) continue;
            const feature = {
                id: element.id,
                osmType: "way",
                points: points,
                center: standMetadataCenter(points),
                tags: element.tags,
                ref: cleanRef(element.tags.ref)
            };
            if (standMetadataIsTerminal(element.tags)) {
                metadata.terminals.push({
                    ...feature,
                    label: standMetadataLabel(element.tags)
                });
            }
            if (String(element.tags.aeroway || "").toLowerCase() === "gate") {
                metadata.gates.push(feature);
            }
            if (String(element.tags.aeroway || "").toLowerCase() === "apron") {
                metadata.aprons.push(feature);
            }
        }
        return metadata;
    }
    async function requestStandMetadata(bounds, generation) {
        const query = buildStandMetadataQuery(bounds);
        let lastError = null;
        for (const serverIndex of serverOrder()) {
            if (generation !== state.standMetadataGeneration) throw new Error("Cancelled");
            const controller = new AbortController;
            state.standMetadataController = controller;
            const timeout = setTimeout(() => controller.abort(), CFG.requestTimeoutMs);
            try {
                const serverUrl = OVERPASS_SERVERS[serverIndex];
                console.log("[TWY STANDS] Metadata request", {
                    server: serverIndex + 1,
                    source: state.standMetadataSource
                });
                const response = await fetch(serverUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: "data=" + encodeURIComponent(query),
                    signal: controller.signal
                });
                if (!response.ok) throw new HttpError(response.status);
                const data = await response.json();
                if (generation !== state.standMetadataGeneration) throw new Error("Cancelled");
                return parseStandMetadata(data);
            } catch (error) {
                lastError = error;
                if (generation !== state.standMetadataGeneration) throw new Error("Cancelled");
                console.warn("[TWY STANDS] Metadata request failed", {
                    server: serverIndex + 1,
                    error: error
                });
            } finally {
                clearTimeout(timeout);
                if (state.standMetadataController === controller) state.standMetadataController = null;
            }
        }
        throw lastError || new Error("Stand metadata request failed");
    }
    function ensureStandListMetadata() {
        if (!state.standListWindow?.classList.contains("open") || !standListNeedsMetadata()) return;
        const source = state.gridSignature;
        if (!source) return;
        if (state.standMetadataSource === source && (state.standMetadataLoading || state.standMetadataReady || state.standMetadataStatus === "error")) return;
        if (state.running) {
            state.standMetadataSource = source;
            state.standMetadataStatus = "waiting";
            state.standMetadataReady = false;
            renderStandList();
            return;
        }
        const bounds = standMetadataBounds();
        if (!bounds) return;
        state.standMetadataSource = source;
        state.standMetadataLoading = true;
        state.standMetadataReady = false;
        state.standMetadataStatus = "loading";
        const generation = ++state.standMetadataGeneration;
        renderStandList();
        (async () => {
            try {
                const cached = loadStandMetadataCache(source);
                const metadata = cached || await requestStandMetadata(bounds, generation);
                if (generation !== state.standMetadataGeneration) return;
                state.standMetadata = metadata;
                state.standMetadataLoading = false;
                state.standMetadataReady = true;
                state.standMetadataStatus = "ready";
                if (!cached) saveStandMetadataCache(source, metadata);
                if (state.standListWindow?.classList.contains("open")) renderStandList();
            } catch (error) {
                if (generation !== state.standMetadataGeneration) return;
                state.standMetadata = null;
                state.standMetadataLoading = false;
                state.standMetadataReady = false;
                state.standMetadataStatus = "error";
                console.warn("[TWY STANDS] Terminal classification unavailable", error);
                if (state.standListWindow?.classList.contains("open")) renderStandList();
            }
        })();
    }
    function resetStandListMetadata() {
        state.standMetadataGeneration++;
        if (state.standMetadataController) {
            try {
                state.standMetadataController.abort();
            } catch (_) {}
        }
        state.standMetadataController = null;
        state.standMetadata = null;
        state.standMetadataSource = null;
        state.standMetadataLoading = false;
        state.standMetadataReady = false;
        state.standMetadataStatus = "idle";
    }
    function findLoadedStand(rawQuery) {
        const query = normalizeStandQuery(rawQuery);
        if (!query) return null;
        const aircraft = aircraftLL();
        const completeMovementFeatures = followMeMovementFeatures();
        const matches = [];
        for (const feature of standLocatorFeatures()) {
            const ref = normalizeRef(feature.ref);
            if (!ref) continue;
            if (normalizeStandQuery(ref) !== query) continue;
            const target = standTargetPoint(feature);
            if (!target) continue;
            const distance = Number.isFinite(aircraft.lat) && Number.isFinite(aircraft.lon) ? geoDistanceMeters(aircraft, target) : Infinity;
            const taxiwayDistance = feature.chunkKey?.startsWith("minimap_") ? followMeFeatureDistanceToMovement(target, completeMovementFeatures) : distanceToMovementNetwork(target, [ state.taxiways ]);
            matches.push({
                feature: feature,
                ref: ref.toUpperCase(),
                target: target,
                distance: distance,
                taxiwayClearance: Number.isFinite(taxiwayDistance) ? taxiwayDistance : 1e6
            });
        }
        if (!matches.length) return null;
        matches.sort((a, b) => {
            const clearanceDifference = b.taxiwayClearance - a.taxiwayClearance;
            if (Math.abs(clearanceDifference) > 2) return clearanceDifference;
            return a.distance - b.distance;
        });
        return matches[0];
    }
    function createStandPinImage() {
        if (state.standLocator.markerImage) {
            return state.standLocator.markerImage;
        }
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 84;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = "rgba(0,0,0,.42)";
        ctx.beginPath();
        ctx.moveTo(32, 80);
        ctx.bezierCurveTo(29, 68, 11, 53, 11, 31);
        ctx.arc(32, 31, 21, Math.PI, 0);
        ctx.bezierCurveTo(53, 53, 35, 68, 32, 80);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "#FFD21A";
        ctx.strokeStyle = "#151719";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(32, 78);
        ctx.bezierCurveTo(29, 67, 11, 52, 11, 30);
        ctx.arc(32, 30, 21, Math.PI, 0);
        ctx.bezierCurveTo(53, 52, 35, 67, 32, 78);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#1B1D1F";
        ctx.beginPath();
        ctx.arc(32, 30, 7, 0, Math.PI * 2);
        ctx.fill();
        state.standLocator.markerImage = canvas.toDataURL("image/png");
        return state.standLocator.markerImage;
    }
    // Render the entire two-line sign into one texture. Cesium's label background
    // can keep its original single-line bounds when the text later gains a line.
    function createStandLocatorSign(ref, distanceText) {
        const title = `STAND ${ref}`;
        const subtitle = distanceText || "";
        const cacheKey = `${title}\n${subtitle}`;
        const cache = state.standLocator.labelImageCache;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        const paddingX = 10;
        const paddingY = 7;
        const lineHeight = 19;
        const lineGap = 2;
        ctx.font = "700 14px Arial";
        const titleWidth = ctx.measureText(title).width;
        ctx.font = "700 13px Arial";
        const subtitleWidth = ctx.measureText(subtitle).width;
        const width = Math.ceil(Math.max(titleWidth, subtitleWidth) + paddingX * 2);
        const height = paddingY * 2 + lineHeight * 2 + lineGap;
        const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
        canvas.width = Math.ceil(width * scale);
        canvas.height = Math.ceil(height * scale);
        ctx.scale(scale, scale);
        ctx.fillStyle = "rgba(23,25,27,.94)";
        ctx.fillRect(0, 0, width, height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,.85)";
        ctx.fillStyle = "#FFFFFF";
        const x = width / 2;
        const firstY = paddingY + lineHeight / 2;
        const secondY = paddingY + lineHeight + lineGap + lineHeight / 2;
        ctx.font = "700 14px Arial";
        ctx.strokeText(title, x, firstY);
        ctx.fillText(title, x, firstY);
        ctx.font = "700 13px Arial";
        ctx.strokeText(subtitle, x, secondY);
        ctx.fillText(subtitle, x, secondY);
        const result = {
            image: canvas.toDataURL("image/png"),
            width: width,
            height: height
        };
        // Keep recent textures for repeated distances without growing the JS cache indefinitely.
        cache.set(cacheKey, result);
        if (cache.size > 64) cache.delete(cache.keys().next().value);
        return result;
    }
    function updateStandLocatorSign(ref, distanceText) {
        const sign = state.standLocator.labelEntity?.billboard;
        if (!sign) return;
        const labelText = `STAND ${ref}\n${distanceText}`;
        if (state.standLocator.labelText === labelText) return;
        const graphic = createStandLocatorSign(ref, distanceText);
        if (!graphic) return;
        sign.image = graphic.image;
        sign.width = graphic.width;
        sign.height = graphic.height;
        // Keep the entire sign above the 42px pin, with a consistent 12px gap.
        sign.pixelOffset = new window.Cesium.Cartesian2(0, -(42 + 12 + graphic.height / 2));
        state.standLocator.labelText = labelText;
    }
    function removeStandLocatorEntities(options = {}) {
        resetFollowMeRoute();
        stopMarshallerMonitor();
        removeMarshallerEntity();
        const entities = getCesiumEntityCollection();
        if (entities) {
            for (const entity of [ state.standLocator.markerEntity, state.standLocator.labelEntity, state.standLocator.leadInEntity ]) {
                if (!entity) continue;
                try {
                    entities.remove(entity);
                } catch (_) {}
            }
        }
        state.standLocator.markerEntity = null;
        state.standLocator.labelEntity = null;
        state.standLocator.labelText = null;
        state.standLocator.leadInEntity = null;
        state.standLocator.lastDistanceM = null;
        if (options.clearSelection) {
            state.standLocator.selectedRef = null;
            state.standLocator.selectedFeature = null;
            state.standLocator.selectedTarget = null;
            if (state.standInput) state.standInput.value = "";
        }
        updateStandLocatorStatus();
        updateUI();
        renderStandList();
    }
    function standDistanceText(distanceM) {
        if (!Number.isFinite(distanceM)) return "";
        if (distanceM >= 1e3) {
            return `${(distanceM / 1e3).toFixed(distanceM >= 1e4 ? 0 : 1)} km`;
        }
        if (distanceM >= 100) {
            return `${Math.round(distanceM / 10) * 10} m`;
        }
        return `${Math.max(0, Math.round(distanceM))} m`;
    }
    function updateStandLocatorStatus(message = null, mode = "") {
        if (!state.standLocatorStatus) return;
        if (message) {
            state.standLocatorStatus.textContent = message;
            state.standLocatorStatus.dataset.mode = mode || "";
            return;
        }
        const ref = state.standLocator.selectedRef;
        if (!ref) {
            const standCount = standLocatorFeatures().length;
            state.standLocatorStatus.textContent = standCount ? `${standCount} loaded stands` : "Load an airport first";
            state.standLocatorStatus.dataset.mode = "";
            return;
        }
        const distance = standDistanceText(state.standLocator.lastDistanceM);
        state.standLocatorStatus.textContent = distance ? `Selected ${ref}  •  ${distance}` : `Selected ${ref}`;
        state.standLocatorStatus.dataset.mode = "selected";
    }
    function buildStandLocatorEntities(match) {
        const Cesium = window.Cesium;
        const entities = getCesiumEntityCollection();
        if (!Cesium || !entities || !match?.target) {
            updateStandLocatorStatus("Could not create stand marker", "error");
            return false;
        }
        removeStandLocatorEntities({
            clearSelection: false
        });
        const target = match.target;
        const position = Cesium.Cartesian3.fromDegrees(target.lon, target.lat, 0);
        const displayCondition = Cesium.DistanceDisplayCondition ? new Cesium.DistanceDisplayCondition(0, CFG.standLocatorMaxDisplayDistanceM) : undefined;
        const heightReference = Cesium.HeightReference?.CLAMP_TO_GROUND;
        const verticalOrigin = Cesium.VerticalOrigin?.BOTTOM;
        const horizontalOrigin = Cesium.HorizontalOrigin?.CENTER;
        const pinImage = createStandPinImage();
        state.standLocator.markerEntity = entities.add({
            position: position,
            billboard: {
                image: pinImage,
                width: 32,
                height: 42,
                verticalOrigin: verticalOrigin,
                horizontalOrigin: horizontalOrigin,
                heightReference: heightReference,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: displayCondition
            }
        });
        const initialDistanceText = standDistanceText(match.distance);
        const signGraphic = createStandLocatorSign(match.ref, initialDistanceText);
        if (signGraphic) {
            state.standLocator.labelEntity = entities.add({
                position: position,
                billboard: {
                    image: signGraphic.image,
                    width: signGraphic.width,
                    height: signGraphic.height,
                    pixelOffset: new Cesium.Cartesian2(0, -(42 + 12 + signGraphic.height / 2)),
                    verticalOrigin: Cesium.VerticalOrigin?.CENTER,
                    horizontalOrigin: horizontalOrigin,
                    heightReference: heightReference,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    distanceDisplayCondition: displayCondition
                }
            });
            state.standLocator.labelText = `STAND ${match.ref}\n${initialDistanceText}`;
        }
        state.standLocator.lastDistanceM = match.distance;
        const points = match.feature.points || [];
        if (points.length >= 2) {
            const positions = points.map(point => Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0));
            state.standLocator.leadInEntity = entities.add({
                polyline: {
                    positions: positions,
                    width: CFG.standLocatorLineWidthPx,
                    material: Cesium.Color.fromCssColorString("#FFD21A").withAlpha(.96),
                    clampToGround: true
                }
            });
        }
        syncStandMarkerVisibility();
        return true;
    }
    function selectStand(rawQuery, options = {}) {
        const query = normalizeStandQuery(rawQuery);
        if (!query) {
            updateStandLocatorStatus("Enter a stand number", "error");
            state.standInput?.focus();
            return false;
        }
        if (!state.parking.size && !state.minimapAirportData?.parking?.length) {
            updateStandLocatorStatus("No stand data loaded yet", "error");
            if (!options.silent) {
                queueNotification("warning", "STAND LOCATOR", "NO AIRPORT DATA", "Wait for airport loading to finish", "stand-no-data", 2400);
            }
            return false;
        }
        const match = findLoadedStand(query);
        if (!match) {
            updateStandLocatorStatus(`Stand ${query} not found`, "error");
            if (!options.silent) {
                queueNotification("warning", "STAND NOT FOUND", query, "Not in loaded airport data", `stand-not-found:${query}`, 2500);
            }
            return false;
        }
        state.standLocator.selectedRef = match.ref;
        state.standLocator.selectedFeature = match.feature;
        state.standLocator.selectedTarget = match.target;
        state.standLocator.lastDistanceM = match.distance;
        state.followMe.graphFailedSource = null;
        if (state.standInput) {
            state.standInput.value = match.ref;
        }
        const created = buildStandLocatorEntities(match);
        if (!created) return false;
        updateStandLocatorStatus();
        updateUI();
        renderStandList();
        syncMarshaller();
        if (state.minimapOpen) {
            drawMinimap();
        }
        if (!options.silent) {
            queueNotification("success", "STAND LOCATED", match.ref, standDistanceText(match.distance), `stand-located:${match.ref}`, 2400);
        }
        return true;
    }
    function clearStandSelection() {
        removeStandLocatorEntities({
            clearSelection: true
        });
        updateStandLocatorStatus();
        if (state.minimapOpen) {
            drawMinimap();
        }
        if (state.standInput) {
            state.standInput.focus();
        }
    }
    function updateStandLocator() {
        const ref = state.standLocator.selectedRef;
        const target = state.standLocator.selectedTarget;
        if (!ref || !target) {
            updateStandLocatorStatus();
            return;
        }
        const aircraft = aircraftLL();
        if (!Number.isFinite(aircraft.lat) || !Number.isFinite(aircraft.lon)) {
            return;
        }
        const distance = geoDistanceMeters(aircraft, target);
        state.standLocator.lastDistanceM = distance;
        updateStandLocatorSign(ref, standDistanceText(distance));
        updateStandLocatorStatus();
    }
    function startStandLocatorMonitor() {
        if (state.standLocatorTimer) return;
        state.standLocatorTimer = setInterval(updateStandLocator, CFG.standLocatorUpdateMs);
    }
    function reacquireSelectedStandAfterLoad() {
        const ref = state.standLocator.selectedRef;
        if (!ref) return;
        const found = selectStand(ref, {
            silent: true
        });
        if (!found) {
            removeStandLocatorEntities({
                clearSelection: true
            });
        }
    }
    function minimapAvailable() {
        return !!(!state.arrivalMode && state.chunkData.size && hasUsefulAirportData());
    }
    function minimapAirportCacheKey(source) {
        return `${CFG.minimapAirportCachePrefix}${source}`;
    }
    function minimapAirportCenter() {
        const bounds = state.queryBounds;
        if (bounds && Number.isFinite(bounds.south) && Number.isFinite(bounds.north) && Number.isFinite(bounds.west) && Number.isFinite(bounds.east)) {
            return {
                lat: (bounds.south + bounds.north) / 2,
                lon: (bounds.west + bounds.east) / 2
            };
        }
        return aircraftLL();
    }
    function minimapAirportDatasetValid(dataset) {
        return !!dataset && [ "taxiways", "taxilanes", "holdings", "parking", "runways", "aprons" ].every(field => Array.isArray(dataset[field]));
    }
    function minimapAirportDatasetUseful(dataset) {
        return minimapAirportDatasetValid(dataset) && [ "taxiways", "taxilanes", "runways", "parking", "aprons" ].some(field => dataset[field].length);
    }
    function updateMinimapStatus() {
        const element = state.minimapStatusEl;
        if (!element) return;
        let text = "Loaded ground data";
        let mode = "local";
        if (state.minimapAirportLoading) {
            text = state.minimapAirportStatus === "expanding" ? "Extending airport map…" : state.minimapAirportStatus === "waiting" ? "Waiting for airport load…" : "Loading complete airport map…";
            mode = "loading";
        } else if (state.minimapAirportReady) {
            const radiusKm = Math.round(state.minimapAirportRadiusM / 100) / 10;
            text = state.minimapAirportCapped ? `Airport map ready · ${radiusKm} km coverage limit` : `Complete airport map · ${radiusKm} km coverage`;
            mode = "ready";
        } else if (state.minimapAirportStatus === "error") {
            text = "Full map unavailable · using loaded data";
            mode = "error";
        }
        element.textContent = text;
        element.dataset.mode = mode;
    }
    function resetMinimapAirportData() {
        state.minimapAirportGeneration++;
        if (state.minimapAirportController) {
            try {
                state.minimapAirportController.abort();
            } catch (_) {}
        }
        state.minimapAirportController = null;
        state.minimapAirportData = null;
        state.minimapAirportSource = null;
        state.minimapAirportLoading = false;
        state.minimapAirportReady = false;
        state.minimapAirportStatus = "idle";
        state.minimapAirportRadiusM = 0;
        state.minimapAirportCapped = false;
        followMeInvalidateGraph();
        updateMinimapStatus();
    }
    function loadMinimapAirportCache(source) {
        if (!CFG.cacheEnabled || !source) return null;
        try {
            const raw = localStorage.getItem(minimapAirportCacheKey(source));
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (!cached || Date.now() - Number(cached.time) > CFG.minimapAirportCacheLifetimeMs || !minimapAirportDatasetUseful(cached.dataset)) {
                localStorage.removeItem(minimapAirportCacheKey(source));
                return null;
            }
            return cached;
        } catch (_) {
            return null;
        }
    }
    function saveMinimapAirportCache(source, dataset, radiusM, capped) {
        if (!CFG.cacheEnabled || !source || !minimapAirportDatasetUseful(dataset)) return;
        try {
            localStorage.setItem(minimapAirportCacheKey(source), JSON.stringify({
                time: Date.now(),
                radiusM: radiusM,
                capped: !!capped,
                dataset: dataset
            }));
        } catch (_) {}
    }
    function buildMinimapAirportQuery(center, radiusM) {
        const radius = Math.max(500, Math.round(radiusM));
        return `\n[out:json][timeout:20];\n(\n    way["aeroway"="taxiway"](around:${radius},${center.lat},${center.lon});\n    way["aeroway"="taxilane"](around:${radius},${center.lat},${center.lon});\n\n    way["aeroway"="holding_position"](around:${radius},${center.lat},${center.lon});\n    node["aeroway"="holding_position"](around:${radius},${center.lat},${center.lon});\n\n    way["aeroway"="parking_position"](around:${radius},${center.lat},${center.lon});\n    node["aeroway"="parking_position"](around:${radius},${center.lat},${center.lon});\n\n    way["aeroway"="apron"](around:${radius},${center.lat},${center.lon});\n    way["aeroway"="runway"](around:${radius},${center.lat},${center.lon});\n);\nout body;\n>;\nout skel qt;\n`;
    }
    function minimapAirportDatasetTouchesEdge(dataset, center, radiusM) {
        const edgeDistance = Math.max(300, radiusM - CFG.minimapAirportEdgeMarginM);
        for (const field of [ "taxiways", "taxilanes", "holdings", "parking", "runways", "aprons" ]) {
            for (const feature of dataset?.[field] || []) {
                const points = feature.point ? [ feature.point ] : feature.points || [];
                for (const point of points) {
                    if (geoDistanceMeters(center, point) >= edgeDistance) return true;
                }
            }
        }
        return false;
    }
    async function requestMinimapAirportDataset(center, radiusM, generation) {
        const query = buildMinimapAirportQuery(center, radiusM);
        let lastError = null;
        for (let serverIndex = 0; serverIndex < OVERPASS_SERVERS.length; serverIndex++) {
            if (generation !== state.minimapAirportGeneration) throw new Error("Cancelled");
            const controller = new AbortController;
            state.minimapAirportController = controller;
            const timeout = setTimeout(() => controller.abort(), CFG.requestTimeoutMs);
            try {
                const serverUrl = OVERPASS_SERVERS[serverIndex];
                console.log("[TWY MINIMAP] Request", {
                    radiusM: radiusM,
                    server: serverIndex + 1,
                    url: serverUrl
                });
                const response = await fetch(serverUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    body: "data=" + encodeURIComponent(query),
                    signal: controller.signal
                });
                if (!response.ok) throw new HttpError(response.status);
                const data = await response.json();
                if (generation !== state.minimapAirportGeneration) throw new Error("Cancelled");
                return parseDataset(data, {
                    key: `minimap_${center.lat}_${center.lon}_${radiusM}`
                });
            } catch (error) {
                lastError = error;
                if (generation !== state.minimapAirportGeneration) throw new Error("Cancelled");
                console.warn("[TWY MINIMAP] Request failed", {
                    radiusM: radiusM,
                    server: serverIndex + 1,
                    error: error
                });
            } finally {
                clearTimeout(timeout);
                if (state.minimapAirportController === controller) {
                    state.minimapAirportController = null;
                }
            }
        }
        throw lastError || new Error("Airport map request failed");
    }
    function ensureMinimapAirportData() {
        if (!minimapAvailable()) return;
        if (state.running) {
            state.minimapAirportStatus = "waiting";
            updateMinimapStatus();
            return;
        }
        const source = state.gridSignature;
        if (!source || state.minimapAirportSource === source) return;
        const center = minimapAirportCenter();
        if (!Number.isFinite(center.lat) || !Number.isFinite(center.lon)) return;
        state.minimapAirportSource = source;
        state.minimapAirportLoading = true;
        state.minimapAirportReady = false;
        state.minimapAirportStatus = "loading";
        const generation = ++state.minimapAirportGeneration;
        updateMinimapStatus();
        (async () => {
            try {
                const cached = loadMinimapAirportCache(source);
                if (cached) {
                    state.minimapAirportData = cached.dataset;
                    state.minimapAirportRadiusM = Number(cached.radiusM) || CFG.minimapAirportInitialRadiusM;
                    state.minimapAirportCapped = !!cached.capped;
                } else {
                    let radiusM = CFG.minimapAirportInitialRadiusM;
                    let capped = false;
                    let dataset = await requestMinimapAirportDataset(center, radiusM, generation);
                    if (minimapAirportDatasetTouchesEdge(dataset, center, radiusM) && CFG.minimapAirportMaxRadiusM > radiusM) {
                        state.minimapAirportStatus = "expanding";
                        updateMinimapStatus();
                        const expandedRadiusM = CFG.minimapAirportMaxRadiusM;
                        try {
                            const expandedDataset = await requestMinimapAirportDataset(center, expandedRadiusM, generation);
                            dataset = expandedDataset;
                            radiusM = expandedRadiusM;
                        } catch (error) {
                            if (String(error?.message) === "Cancelled") throw error;
                            capped = true;
                        }
                    }
                    if (!minimapAirportDatasetUseful(dataset)) throw new Error("No airport ground data returned");
                    state.minimapAirportData = dataset;
                    state.minimapAirportRadiusM = radiusM;
                    state.minimapAirportCapped = capped || minimapAirportDatasetTouchesEdge(dataset, center, radiusM);
                    saveMinimapAirportCache(source, dataset, radiusM, state.minimapAirportCapped);
                }
                if (generation !== state.minimapAirportGeneration) return;
                state.minimapAirportLoading = false;
                state.minimapAirportReady = true;
                state.minimapAirportStatus = "ready";
                updateMinimapStatus();
                if (state.minimapOpen) drawMinimap();
            } catch (error) {
                if (generation !== state.minimapAirportGeneration) return;
                state.minimapAirportLoading = false;
                state.minimapAirportReady = false;
                state.minimapAirportStatus = "error";
                updateMinimapStatus();
                console.warn("[TWY MINIMAP] Complete airport map unavailable", error);
                if (state.minimapOpen) drawMinimap();
            }
        })();
    }
    function minimapIsPanned() {
        return Math.abs(state.minimapPanX) > .5 || Math.abs(state.minimapPanY) > .5;
    }
    function minimapTouchInteraction() {
        state.minimapPanLastInteraction = Date.now();
    }
    function recenterMinimap(options = {}) {
        state.minimapPanX = 0;
        state.minimapPanY = 0;
        state.minimapCanvasDragging = false;
        state.minimapPanLastInteraction = 0;
        if (options.unlock !== false) {
            state.minimapPanLocked = false;
        }
        updateMinimapControls();
        drawMinimap();
    }
    function clampMinimapPan() {
        const maxPx = CFG.minimapCanvasSize * CFG.minimapPanMaxRangeFactor;
        state.minimapPanX = clamp(state.minimapPanX, -maxPx, maxPx);
        state.minimapPanY = clamp(state.minimapPanY, -maxPx, maxPx);
    }
    function startMinimapCanvasPan(event) {
        if (!state.minimapOpen || !minimapAvailable() || event.button !== 0) {
            return;
        }
        state.minimapCanvasDragging = true;
        state.minimapCanvasLastX = event.clientX;
        state.minimapCanvasLastY = event.clientY;
        minimapTouchInteraction();
        event.preventDefault();
        event.stopPropagation();
    }
    function moveMinimapCanvasPan(event) {
        if (!state.minimapCanvasDragging) return;
        const dx = event.clientX - state.minimapCanvasLastX;
        const dy = event.clientY - state.minimapCanvasLastY;
        state.minimapCanvasLastX = event.clientX;
        state.minimapCanvasLastY = event.clientY;
        state.minimapPanX += dx;
        state.minimapPanY += dy;
        clampMinimapPan();
        minimapTouchInteraction();
        updateMinimapControls();
        drawMinimap();
        event.preventDefault();
    }
    function endMinimapCanvasPan() {
        if (!state.minimapCanvasDragging) return;
        state.minimapCanvasDragging = false;
        minimapTouchInteraction();
        updateMinimapControls();
    }
    function toggleMinimapPanLock() {
        if (!minimapIsPanned()) {
            state.minimapPanLocked = false;
            updateMinimapControls();
            return;
        }
        state.minimapPanLocked = !state.minimapPanLocked;
        if (!state.minimapPanLocked) {
            recenterMinimap({
                unlock: true
            });
            return;
        }
        minimapTouchInteraction();
        updateMinimapControls();
    }
    function maybeAutoRecenterMinimap() {
        if (!minimapIsPanned() || state.minimapPanLocked || state.minimapCanvasDragging) {
            return;
        }
        if (!state.minimapPanLastInteraction) {
            minimapTouchInteraction();
            return;
        }
        if (Date.now() - state.minimapPanLastInteraction >= CFG.minimapPanRecenterMs) {
            recenterMinimap({
                unlock: true
            });
        }
    }
    function minimapHeadingDeg() {
        if (Number.isFinite(state.autoLoad.bearingDeg)) return state.autoLoad.bearingDeg;
        if (Number.isFinite(state.detector.bearingDeg)) return state.detector.bearingDeg;
        return 0;
    }
    function followMeAircraftHeading() {
        const htrHeading = Number(window.geofs?.aircraft?.instance?.htr?.[0]);
        if (Number.isFinite(htrHeading)) {
            return (htrHeading % 360 + 360) % 360;
        }
        if (Number.isFinite(state.detector.bearingDeg)) return state.detector.bearingDeg;
        if (Number.isFinite(state.autoLoad.bearingDeg)) return state.autoLoad.bearingDeg;
        return null;
    }
    function minimapRangeM() {
        state.minimapRangeIndex = clamp(Math.round(state.minimapRangeIndex), 0, CFG.minimapRangesM.length - 1);
        return CFG.minimapRangesM[state.minimapRangeIndex];
    }
    function minimapRangeText(rangeM = minimapRangeM()) {
        const nm = rangeM / 1852;
        if (nm < .5) {
            return `${nm.toFixed(2)} NM`;
        }
        if (nm < 1) {
            return `${nm.toFixed(1)} NM`;
        }
        return `${nm.toFixed(1)} NM`;
    }
    function setMinimapRangeIndex(index) {
        const next = clamp(Math.round(index), 0, CFG.minimapRangesM.length - 1);
        if (next === state.minimapRangeIndex) return;
        state.minimapRangeIndex = next;
        localStorage.setItem("geofsGroundMinimapRangeIndex", String(next));
        if (minimapIsPanned()) {
            minimapTouchInteraction();
        }
        updateMinimapControls();
        drawMinimap();
    }
    function minimapZoomIn() {
        setMinimapRangeIndex(state.minimapRangeIndex - 1);
    }
    function minimapZoomOut() {
        setMinimapRangeIndex(state.minimapRangeIndex + 1);
    }
    function updateMinimapControls() {
        const zoomIn = state.minimapWindow?.querySelector("#twy-minimap-zoom-in");
        const zoomOut = state.minimapWindow?.querySelector("#twy-minimap-zoom-out");
        const range = state.minimapWindow?.querySelector("#twy-minimap-range");
        const lock = state.minimapWindow?.querySelector("#twy-minimap-lock");
        if (zoomIn) {
            zoomIn.disabled = state.minimapRangeIndex <= 0;
        }
        if (zoomOut) {
            zoomOut.disabled = state.minimapRangeIndex >= CFG.minimapRangesM.length - 1;
        }
        if (range) {
            range.textContent = minimapRangeText();
        }
        if (lock) {
            const panned = minimapIsPanned();
            lock.disabled = !panned;
            lock.classList.toggle("active", state.minimapPanLocked);
            lock.textContent = state.minimapPanLocked ? "LOCK" : "FOLLOW";
            lock.title = state.minimapPanLocked ? "Unlock and return to aircraft-centred follow mode" : panned ? "Lock this panned map position" : "Map is following the aircraft";
        }
    }
    function minimapProject(origin, point, headingDeg, scale, cx, cy) {
        const local = localMeters(origin, point);
        const h = headingDeg * Math.PI / 180;
        const right = local.x * Math.cos(h) - local.y * Math.sin(h);
        const forward = local.x * Math.sin(h) + local.y * Math.cos(h);
        return {
            x: cx + state.minimapPanX + right * scale,
            y: cy + state.minimapPanY - forward * scale
        };
    }
    function minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size, margin = 24) {
        const points = feature?.points || (feature?.point ? [ feature.point ] : []);
        if (!points.length) return false;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const point of points) {
            const projected = minimapProject(origin, point, heading, scale, cx, cy);
            minX = Math.min(minX, projected.x);
            minY = Math.min(minY, projected.y);
            maxX = Math.max(maxX, projected.x);
            maxY = Math.max(maxY, projected.y);
        }
        return maxX >= -margin && maxY >= -margin && minX <= size + margin && minY <= size + margin;
    }
    function minimapDrawPolygon(ctx, feature, origin, heading, scale, cx, cy) {
        const points = feature?.points || [];
        if (points.length < 3) return;
        ctx.beginPath();
        points.forEach((point, index) => {
            const p = minimapProject(origin, point, heading, scale, cx, cy);
            if (index === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        if (ctx.lineWidth > 0) {
            ctx.stroke();
        }
    }
    function minimapDrawFeature(ctx, feature, origin, heading, scale, cx, cy) {
        const points = feature?.points || (feature?.point ? [ feature.point ] : []);
        if (points.length < 2) return;
        ctx.beginPath();
        points.forEach((point, index) => {
            const p = minimapProject(origin, point, heading, scale, cx, cy);
            if (index === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    }
    function minimapFeatureMidpoint(feature) {
        const points = feature?.points || [];
        if (!points.length) return feature?.point || null;
        return points[Math.floor(points.length / 2)] || null;
    }
    function minimapDrawLabel(ctx, text, x, y, options = {}) {
        if (!text) return;
        const fontSize = options.fontSize || 8;
        const weight = options.weight || 700;
        ctx.save();
        ctx.font = `${weight} ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const width = ctx.measureText(text).width;
        const padX = options.padX ?? 3;
        const padY = options.padY ?? 2;
        ctx.fillStyle = options.background || "rgba(18,20,22,.86)";
        ctx.fillRect(x - width / 2 - padX, y - fontSize / 2 - padY, width + padX * 2, fontSize + padY * 2);
        ctx.fillStyle = options.color || "#e8ecef";
        ctx.fillText(text, x, y + .3);
        ctx.restore();
    }
    function minimapDrawRunwayLabels(ctx, runways, origin, heading, scale, cx, cy, size, range) {
        for (const feature of runways) {
            const ref = normalizeRef(feature.ref);
            if (!ref) continue;
            if (!minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size, 16)) {
                continue;
            }
            const point = minimapFeatureMidpoint(feature);
            if (!point) continue;
            const p = minimapProject(origin, point, heading, scale, cx, cy);
            if (p.x < 14 || p.y < 14 || p.x > size - 14 || p.y > size - 14) {
                continue;
            }
            minimapDrawLabel(ctx, ref.toUpperCase(), p.x, p.y, {
                fontSize: 8,
                weight: 700,
                color: "#c9ced1",
                background: "rgba(25,28,30,.90)",
                padX: 4
            });
        }
    }
    function minimapDrawTaxiwayLabels(ctx, taxiways, origin, heading, scale, cx, cy, size, range) {
        if (range > CFG.minimapTaxiLabelMaxRangeM) {
            return;
        }
        const placed = [];
        const seenRefs = new Set;
        const candidates = taxiways.filter(feature => normalizeRef(feature.ref)).map(feature => ({
            feature: feature,
            distance: featureDistanceMeters(origin, feature)
        })).filter(item => minimapFeatureVisibleOnCanvas(item.feature, origin, heading, scale, cx, cy, size, 16)).sort((a, b) => a.distance - b.distance);
        for (const item of candidates) {
            const ref = normalizeRef(item.feature.ref)?.toUpperCase();
            if (!ref) continue;
            if (seenRefs.has(ref)) continue;
            const point = minimapFeatureMidpoint(item.feature);
            if (!point) continue;
            const p = minimapProject(origin, point, heading, scale, cx, cy);
            if (p.x < 16 || p.y < 16 || p.x > size - 16 || p.y > size - 16) {
                continue;
            }
            const crowded = placed.some(old => Math.hypot(old.x - p.x, old.y - p.y) < CFG.minimapTaxiLabelMinSeparationPx);
            if (crowded) continue;
            minimapDrawLabel(ctx, ref, p.x, p.y, {
                fontSize: range <= 500 ? 9 : 8,
                color: "#ffe263",
                background: "rgba(16,18,19,.88)"
            });
            placed.push(p);
            seenRefs.add(ref);
        }
    }
    function minimapSelectedStandScreenPoint(origin, heading, scale, cx, cy) {
        const target = state.standLocator.selectedTarget;
        const ref = state.standLocator.selectedRef;
        if (!target || !ref) return null;
        return {
            ref: ref,
            point: minimapProject(origin, target, heading, scale, cx, cy),
            feature: state.standLocator.selectedFeature
        };
    }
    function minimapDrawSelectedStandUnderlay(ctx, origin, heading, scale, cx, cy) {
        const selected = minimapSelectedStandScreenPoint(origin, heading, scale, cx, cy);
        if (!selected) return;
        const p = selected.point;
        const aircraftX = cx + state.minimapPanX;
        const aircraftY = cy + state.minimapPanY;
        ctx.save();
        ctx.setLineDash([ 3, 5 ]);
        ctx.strokeStyle = "rgba(255,255,255,.11)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(aircraftX, aircraftY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.setLineDash([]);
        const points = selected.feature?.points || [];
        if (points.length >= 2) {
            ctx.strokeStyle = "rgba(255,255,255,.28)";
            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            minimapDrawFeature(ctx, selected.feature, origin, heading, scale, cx, cy);
        }
        ctx.restore();
    }
    function minimapDrawSelectedStandMarker(ctx, origin, heading, scale, cx, cy, size) {
        const selected = minimapSelectedStandScreenPoint(origin, heading, scale, cx, cy);
        if (!selected) return;
        const p = selected.point;
        const ref = selected.ref;
        const aircraftX = cx + state.minimapPanX;
        const aircraftY = cy + state.minimapPanY;
        const margin = 14;
        const visible = p.x >= margin && p.y >= margin && p.x <= size - margin && p.y <= size - margin;
        if (!visible) {
            const dx = p.x - aircraftX;
            const dy = p.y - aircraftY;
            const maxX = size / 2 - 18;
            const maxY = size / 2 - 18;
            const factor = Math.min(maxX / Math.max(Math.abs(dx), .001), maxY / Math.max(Math.abs(dy), .001));
            const ex = aircraftX + dx * factor;
            const ey = aircraftY + dy * factor;
            ctx.save();
            ctx.translate(ex, ey);
            ctx.rotate(Math.atan2(dy, dx) + Math.PI / 2);
            ctx.fillStyle = "rgba(255,255,255,.90)";
            ctx.strokeStyle = "#151719";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(4, 3.5);
            ctx.lineTo(-4, 3.5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            minimapDrawLabel(ctx, `STD ${ref}`, ex, ey + 11, {
                fontSize: 7,
                color: "rgba(255,255,255,.92)",
                background: "rgba(18,20,22,.68)",
                padX: 3,
                padY: 1
            });
            return;
        }
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,.18)";
        ctx.strokeStyle = "rgba(255,255,255,.92)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        minimapDrawLabel(ctx, `STD ${ref}`, p.x, p.y - 11, {
            fontSize: 7,
            color: "rgba(255,255,255,.94)",
            background: "rgba(18,20,22,.66)",
            padX: 3,
            padY: 1
        });
    }
    function minimapDrawCompass(ctx, heading, size) {
        const x = size - 18;
        const y = 18;
        const radius = 9;
        ctx.save();
        ctx.strokeStyle = "rgba(220,224,227,.32)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        const a = heading * Math.PI / 180;
        const dx = -Math.sin(a);
        const dy = -Math.cos(a);
        ctx.strokeStyle = "#eef0f1";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx * (radius - 2), y + dy * (radius - 2));
        ctx.stroke();
        ctx.fillStyle = "#eef0f1";
        ctx.font = "700 7px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N", x + dx * (radius + 5), y + dy * (radius + 5));
        ctx.restore();
    }
    function minimapHasVisibleGroundGeometry(origin, heading, scale, cx, cy, size, aprons, runways, taxiways, taxilanes) {
        const groups = [ aprons, runways, taxiways, taxilanes ];
        for (const features of groups) {
            for (const feature of features) {
                if (minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size)) {
                    return true;
                }
            }
        }
        return false;
    }
    function minimapDrawOutOfCoverage(ctx, size) {
        ctx.save();
        ctx.fillStyle = "rgba(255,210,26,.82)";
        ctx.font = "400 11px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("OUT OF COVERAGE", size / 2, size / 2);
        ctx.restore();
    }
    function drawMinimap() {
        if (!state.minimapOpen || !state.minimapCanvas) {
            return;
        }
        if (!minimapAvailable()) {
            setMinimapOpen(false);
            return;
        }
        const canvas = state.minimapCanvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const size = CFG.minimapCanvasSize;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const pixels = Math.round(size * dpr);
        if (canvas.width !== pixels || canvas.height !== pixels) {
            canvas.width = pixels;
            canvas.height = pixels;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = "#15181a";
        ctx.fillRect(0, 0, size, size);
        const origin = aircraftLL();
        if (!Number.isFinite(origin.lat) || !Number.isFinite(origin.lon)) {
            return;
        }
        const heading = minimapHeadingDeg();
        const range = minimapRangeM();
        const cx = size / 2;
        const cy = size / 2;
        const scale = size * .46 / range;
        const datasets = minimapDatasetsForDisplay();
        const aprons = collectNearbyFeatures(datasets, "aprons");
        const runways = collectNearbyFeatures(datasets, "runways");
        const taxiways = collectNearbyFeatures(datasets, "taxiways");
        const taxilanes = collectNearbyFeatures(datasets, "taxilanes");
        const hasVisibleGroundGeometry = minimapHasVisibleGroundGeometry(origin, heading, scale, cx, cy, size, aprons, runways, taxiways, taxilanes);
        if (!hasVisibleGroundGeometry) {
            minimapDrawOutOfCoverage(ctx, size);
            return;
        }
        ctx.save();
        ctx.fillStyle = "#24292c";
        ctx.strokeStyle = "rgba(145,153,158,.18)";
        ctx.lineWidth = .7;
        for (const feature of aprons) {
            if (minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size)) {
                minimapDrawPolygon(ctx, feature, origin, heading, scale, cx, cy);
            }
        }
        ctx.restore();
        minimapDrawSelectedStandUnderlay(ctx, origin, heading, scale, cx, cy);
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#4d5357";
        ctx.lineWidth = 8;
        for (const feature of runways) {
            if (minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size)) {
                minimapDrawFeature(ctx, feature, origin, heading, scale, cx, cy);
            }
        }
        ctx.strokeStyle = "#8c7c30";
        ctx.lineWidth = 1.1;
        for (const feature of taxilanes) {
            if (minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size)) {
                minimapDrawFeature(ctx, feature, origin, heading, scale, cx, cy);
            }
        }
        ctx.strokeStyle = "#f1c918";
        ctx.lineWidth = 1.7;
        for (const feature of taxiways) {
            if (minimapFeatureVisibleOnCanvas(feature, origin, heading, scale, cx, cy, size)) {
                minimapDrawFeature(ctx, feature, origin, heading, scale, cx, cy);
            }
        }
        ctx.restore();
        minimapDrawRunwayLabels(ctx, runways, origin, heading, scale, cx, cy, size, range);
        minimapDrawTaxiwayLabels(ctx, taxiways, origin, heading, scale, cx, cy, size, range);
        minimapDrawSelectedStandMarker(ctx, origin, heading, scale, cx, cy, size);
        const aircraftX = cx + state.minimapPanX;
        const aircraftY = cy + state.minimapPanY;
        ctx.save();
        ctx.translate(aircraftX, aircraftY);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#101214";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(6, 7);
        ctx.lineTo(0, 4);
        ctx.lineTo(-6, 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        minimapDrawCompass(ctx, heading, size);
        ctx.fillStyle = "#aeb4b8";
        ctx.font = "600 8px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`HDG ${String(Math.round((heading % 360 + 360) % 360)).padStart(3, "0")}°`, size - 8, size - 8);
    }
    function setMinimapOpen(open) {
        const wanted = !!open;
        if (wanted && !minimapAvailable()) {
            state.minimapOpen = false;
            localStorage.setItem("geofsGroundMinimapOpen", "false");
            state.minimapWindow?.classList.remove("open");
            state.minimapButton?.classList.remove("active");
            return;
        }
        state.minimapOpen = wanted;
        localStorage.setItem("geofsGroundMinimapOpen", String(state.minimapOpen));
        state.minimapWindow?.classList.toggle("open", state.minimapOpen);
        state.minimapButton?.classList.toggle("active", state.minimapOpen);
        updateMinimapControls();
        if (state.minimapOpen) {
            ensureMinimapAirportData();
            drawMinimap();
        }
    }
    function toggleMinimap() {
        if (!minimapAvailable()) return;
        setMinimapOpen(!state.minimapOpen);
    }
    function updateMinimapAvailability() {
        const available = minimapAvailable();
        if (available && state.minimapOpen) {
            ensureMinimapAirportData();
        }
        const button = state.minimapButton;
        if (button) {
            button.disabled = !available;
            button.classList.toggle("unavailable", !available);
            button.title = available ? state.minimapAirportLoading ? "Airport moving map · loading complete airport map" : "Airport moving map" : "Moving map available with loaded airport ground data";
        }
        updateMinimapStatus();
        if (!available && state.minimapOpen) {
            setMinimapOpen(false);
        }
    }
    function saveMinimapPosition() {
        if (!state.minimapWindow) return;
        const rect = state.minimapWindow.getBoundingClientRect();
        localStorage.setItem("geofsGroundMinimapPosition", JSON.stringify({
            left: Math.round(rect.left),
            top: Math.round(rect.top)
        }));
    }
    function restoreMinimapPosition() {
        if (!state.minimapWindow) return;
        let saved = null;
        try {
            saved = JSON.parse(localStorage.getItem("geofsGroundMinimapPosition") || "null");
        } catch (_) {}
        if (!saved || !Number.isFinite(saved.left) || !Number.isFinite(saved.top)) {
            return;
        }
        const maxLeft = Math.max(6, window.innerWidth - 238);
        const maxTop = Math.max(6, window.innerHeight - 285);
        state.minimapWindow.style.left = `${clamp(saved.left, 6, maxLeft)}px`;
        state.minimapWindow.style.top = `${clamp(saved.top, 6, maxTop)}px`;
        state.minimapWindow.style.right = "auto";
        state.minimapWindow.style.bottom = "auto";
    }
    function startMinimapDrag(event) {
        if (!state.minimapWindow || event.button !== 0 || event.target.closest("button")) {
            return;
        }
        const rect = state.minimapWindow.getBoundingClientRect();
        state.minimapDragging = true;
        state.minimapDragOffsetX = event.clientX - rect.left;
        state.minimapDragOffsetY = event.clientY - rect.top;
        state.minimapWindow.style.left = `${rect.left}px`;
        state.minimapWindow.style.top = `${rect.top}px`;
        state.minimapWindow.style.right = "auto";
        state.minimapWindow.style.bottom = "auto";
        event.preventDefault();
    }
    function moveMinimapDrag(event) {
        if (!state.minimapDragging || !state.minimapWindow) {
            return;
        }
        const width = state.minimapWindow.offsetWidth || 232;
        const height = state.minimapWindow.offsetHeight || 285;
        const left = clamp(event.clientX - state.minimapDragOffsetX, 4, Math.max(4, window.innerWidth - width - 4));
        const top = clamp(event.clientY - state.minimapDragOffsetY, 4, Math.max(4, window.innerHeight - height - 4));
        state.minimapWindow.style.left = `${left}px`;
        state.minimapWindow.style.top = `${top}px`;
    }
    function endMinimapDrag() {
        if (!state.minimapDragging) return;
        state.minimapDragging = false;
        saveMinimapPosition();
    }
    function startMinimapMonitor() {
        if (state.minimapTimer) return;
        state.minimapTimer = setInterval(() => {
            updateMinimapAvailability();
            if (state.minimapOpen) {
                maybeAutoRecenterMinimap();
                drawMinimap();
            }
        }, CFG.minimapUpdateMs);
    }
    function closeArrivalChooser(options = {}) {
        const abort = options.abort !== false;
        if (abort && state.arrivalDiscoveryController) {
            try {
                state.arrivalDiscoveryController.abort();
            } catch (_) {}
        }
        state.arrivalDiscoveryController = null;
        state.arrivalDiscoveryBusy = false;
        if (state.arrivalChooserHost) {
            state.arrivalChooserHost.classList.remove("open");
            state.arrivalChooserHost.innerHTML = "";
        }
    }
    function escapeHtml(value) {
        return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }
    function airportPrimaryCode(candidate) {
        return (candidate.icao || candidate.iata || candidate.ref || "AIRPORT").toUpperCase();
    }
    function airportReleaseLabel(candidate) {
        const tags = candidate?.tags || {};
        const code = cleanRef(candidate?.icao) || cleanRef(candidate?.iata) || cleanRef(candidate?.ref) || cleanRef(tags.icao) || cleanRef(tags.iata) || cleanRef(tags.ref);
        if (code) return code.toUpperCase();
        return cleanRef(candidate?.name) || cleanRef(tags.name) || cleanRef(tags["name:en"]) || "ARRIVAL";
    }
    function airportSecondaryCode(candidate) {
        const primary = airportPrimaryCode(candidate);
        const values = [ candidate.icao, candidate.iata, candidate.ref ].filter(Boolean).map(value => String(value).toUpperCase()).filter(value => value !== primary);
        return values[0] || "";
    }
    function arrivalDistanceText(distanceM) {
        if (!Number.isFinite(distanceM)) return "";
        if (distanceM >= 1e4) return `${Math.round(distanceM / 1e3)} km`;
        if (distanceM >= 1e3) return `${(distanceM / 1e3).toFixed(1)} km`;
        return `${Math.round(distanceM)} m`;
    }
    function arrivalBearingDifference(candidate) {
        const heading = state.autoLoad.bearingDeg;
        if (!Number.isFinite(heading) || !Number.isFinite(candidate.bearingDeg)) {
            return null;
        }
        return angleDifferenceDegrees(heading, candidate.bearingDeg);
    }
    function renderArrivalChooserLoading() {
        if (!state.arrivalChooserHost) return;
        state.arrivalChooserHost.innerHTML = `\n            <div class="twy-arrival-card">\n                <div class="twy-arrival-title">CHOOSE ARRIVAL</div>\n                <div class="twy-arrival-subtitle">\n                    Searching nearby aerodromes…\n                </div>\n\n                <div class="twy-arrival-loading">\n                    <span class="twy-spinner"></span>\n                    Looking within ${Math.round(CFG.arrivalSearchRadiusM / 1e3)} km\n                </div>\n\n                <button class="twy-arrival-cancel">CANCEL</button>\n            </div>\n        `;
        state.arrivalChooserHost.classList.add("open");
        state.arrivalChooserHost.querySelector(".twy-arrival-cancel")?.addEventListener("click", event => {
            event.stopPropagation();
            closeArrivalChooser();
        });
    }
    function renderArrivalChooserError(message) {
        if (!state.arrivalChooserHost) return;
        state.arrivalChooserHost.innerHTML = `\n            <div class="twy-arrival-card">\n                <div class="twy-arrival-title">CHOOSE ARRIVAL</div>\n                <div class="twy-arrival-error">${escapeHtml(message)}</div>\n\n                <div class="twy-arrival-actions">\n                    <button class="twy-arrival-retry">RETRY</button>\n                    <button class="twy-arrival-cancel">CANCEL</button>\n                </div>\n            </div>\n        `;
        state.arrivalChooserHost.classList.add("open");
        state.arrivalChooserHost.querySelector(".twy-arrival-retry")?.addEventListener("click", event => {
            event.stopPropagation();
            openArrivalChooser();
        });
        state.arrivalChooserHost.querySelector(".twy-arrival-cancel")?.addEventListener("click", event => {
            event.stopPropagation();
            closeArrivalChooser();
        });
    }
    function renderArrivalChoices(candidates) {
        if (!state.arrivalChooserHost) return;
        const rows = candidates.map((candidate, index) => {
            const primary = airportPrimaryCode(candidate);
            const secondary = airportSecondaryCode(candidate);
            const secondaryText = secondary ? ` · ${secondary}` : "";
            const name = candidate.name || "Unnamed aerodrome";
            const diff = arrivalBearingDifference(candidate);
            const ahead = Number.isFinite(diff) && diff <= 35 ? '<span class="twy-arrival-ahead">AHEAD</span>' : "";
            return `\n                <button class="twy-arrival-choice" data-arrival-index="${index}">\n                    <div class="twy-arrival-choice-main">\n                        <span class="twy-arrival-code">\n                            ${escapeHtml(primary)}${escapeHtml(secondaryText)}\n                        </span>\n                        ${ahead}\n                    </div>\n\n                    <div class="twy-arrival-name">\n                        ${escapeHtml(name)}\n                    </div>\n\n                    <div class="twy-arrival-distance">\n                        ${escapeHtml(arrivalDistanceText(candidate.distanceM))}\n                    </div>\n                </button>\n            `;
        }).join("");
        state.arrivalChooserHost.innerHTML = `\n            <div class="twy-arrival-card">\n                <div class="twy-arrival-title">CHOOSE ARRIVAL</div>\n                <div class="twy-arrival-subtitle">\n                    Nearby airports · closest useful matches first\n                </div>\n\n                <div class="twy-arrival-list">\n                    ${rows}\n                </div>\n\n                <button class="twy-arrival-cancel">CANCEL</button>\n            </div>\n        `;
        state.arrivalChooserHost.classList.add("open");
        for (const button of state.arrivalChooserHost.querySelectorAll(".twy-arrival-choice")) {
            button.addEventListener("click", event => {
                event.stopPropagation();
                const index = Number(button.dataset.arrivalIndex);
                const candidate = state.arrivalCandidates[index];
                if (candidate) {
                    chooseArrivalAirport(candidate);
                }
            });
        }
        state.arrivalChooserHost.querySelector(".twy-arrival-cancel")?.addEventListener("click", event => {
            event.stopPropagation();
            closeArrivalChooser();
        });
    }
    function buildArrivalDiscoveryQuery(position) {
        const radius = Math.round(CFG.arrivalSearchRadiusM);
        return `\n[out:json][timeout:15];\n(\n  node["aeroway"="aerodrome"](around:${radius},${position.lat},${position.lon});\n  way["aeroway"="aerodrome"](around:${radius},${position.lat},${position.lon});\n  relation["aeroway"="aerodrome"](around:${radius},${position.lat},${position.lon});\n);\nout center;\n`;
    }
    function parseArrivalCandidates(data, position) {
        const byIdentity = new Map;
        for (const element of data?.elements || []) {
            const tags = element.tags || {};
            const lat = Number(element.type === "node" ? element.lat : element.center?.lat);
            const lon = Number(element.type === "node" ? element.lon : element.center?.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
            const icao = cleanRef(tags.icao);
            const iata = cleanRef(tags.iata);
            const ref = cleanRef(tags.ref);
            const name = cleanRef(tags.name) || cleanRef(tags["name:en"]) || null;
            const center = {
                lat: lat,
                lon: lon
            };
            const distanceM = geoDistanceMeters(position, center);
            if (distanceM > CFG.arrivalSearchRadiusM * 1.08) continue;
            const bearingDeg = bearingDegrees(position, center);
            const identity = icao && `ICAO:${icao.toUpperCase()}` || iata && `IATA:${iata.toUpperCase()}` || name && `NAME:${name.toUpperCase()}` || `${element.type}:${element.id}`;
            const candidate = {
                id: element.id,
                osmType: element.type,
                center: center,
                icao: icao,
                iata: iata,
                ref: ref,
                name: name,
                distanceM: distanceM,
                bearingDeg: bearingDeg,
                tags: tags
            };
            const old = byIdentity.get(identity);
            if (!old || candidate.distanceM < old.distanceM) {
                byIdentity.set(identity, candidate);
            }
        }
        const heading = state.autoLoad.bearingDeg;
        const candidates = [ ...byIdentity.values() ];
        for (const candidate of candidates) {
            const anglePenalty = Number.isFinite(heading) ? angleDifferenceDegrees(heading, candidate.bearingDeg) * 70 : 0;
            const codePenalty = candidate.icao || candidate.iata || candidate.ref ? 0 : 1e4;
            candidate.rankScore = candidate.distanceM + anglePenalty + codePenalty;
        }
        candidates.sort((a, b) => {
            if (a.rankScore !== b.rankScore) {
                return a.rankScore - b.rankScore;
            }
            return a.distanceM - b.distanceM;
        });
        return candidates.slice(0, CFG.arrivalMaxChoices);
    }
    async function requestArrivalDiscovery(position, serverIndex) {
        await waitForRequestGate();
        const controller = new AbortController;
        state.arrivalDiscoveryController = controller;
        const timeout = setTimeout(() => controller.abort(), CFG.arrivalSearchTimeoutMs);
        try {
            const response = await fetch(OVERPASS_SERVERS[serverIndex], {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: "data=" + encodeURIComponent(buildArrivalDiscoveryQuery(position)),
                signal: controller.signal
            });
            if (!response.ok) {
                throw new HttpError(response.status);
            }
            return await response.json();
        } finally {
            clearTimeout(timeout);
            if (state.arrivalDiscoveryController === controller) {
                state.arrivalDiscoveryController = null;
            }
        }
    }
    async function discoverArrivalAirports() {
        if (state.arrivalDiscoveryBusy) return;
        const position = aircraftLL();
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lon)) {
            renderArrivalChooserError("Aircraft position unavailable");
            return;
        }
        state.arrivalDiscoveryBusy = true;
        renderArrivalChooserLoading();
        const order = serverOrder();
        let lastError = null;
        try {
            for (const serverIndex of order) {
                try {
                    const data = await requestArrivalDiscovery(position, serverIndex);
                    markServerSuccess(serverIndex);
                    const candidates = parseArrivalCandidates(data, position);
                    if (!candidates.length) {
                        renderArrivalChooserError(`No aerodromes found within ${Math.round(CFG.arrivalSearchRadiusM / 1e3)} km`);
                        return;
                    }
                    state.arrivalCandidates = candidates;
                    renderArrivalChoices(candidates);
                    return;
                } catch (error) {
                    lastError = error;
                    if (error?.name === "AbortError") {
                        if (!state.arrivalChooserHost?.classList.contains("open")) {
                            return;
                        }
                    }
                    markServerFailure(serverIndex, error);
                }
            }
            console.warn("[TWY ARR] Arrival discovery failed", lastError);
            renderArrivalChooserError("Could not search nearby airports right now");
        } finally {
            state.arrivalDiscoveryBusy = false;
        }
    }
    function startArrivalChooserDrag(event) {
        if (!state.arrivalChooserHost || event.button !== 0 || event.target.closest("button, input, a")) {
            return;
        }
        const rect = state.arrivalChooserHost.getBoundingClientRect();
        state.arrivalChooserDragging = true;
        state.arrivalChooserDragOffsetX = event.clientX - rect.left;
        state.arrivalChooserDragOffsetY = event.clientY - rect.top;
        state.arrivalChooserHost.style.setProperty("left", `${rect.left}px`, "important");
        state.arrivalChooserHost.style.setProperty("top", `${rect.top}px`, "important");
        state.arrivalChooserHost.style.setProperty("transform", "none", "important");
        event.preventDefault();
    }
    function moveArrivalChooserDrag(event) {
        if (!state.arrivalChooserDragging || !state.arrivalChooserHost) {
            return;
        }
        const width = state.arrivalChooserHost.offsetWidth || 430;
        const height = state.arrivalChooserHost.offsetHeight || 260;
        const left = clamp(event.clientX - state.arrivalChooserDragOffsetX, 4, Math.max(4, window.innerWidth - width - 4));
        const top = clamp(event.clientY - state.arrivalChooserDragOffsetY, 4, Math.max(4, window.innerHeight - height - 4));
        state.arrivalChooserHost.style.setProperty("left", `${left}px`, "important");
        state.arrivalChooserHost.style.setProperty("top", `${top}px`, "important");
        event.preventDefault();
    }
    function endArrivalChooserDrag() {
        state.arrivalChooserDragging = false;
    }
    function openArrivalChooser() {
        if (!state.arrivalMode) return;
        closeArrivalChooser();
        state.arrivalCandidates = [];
        discoverArrivalAirports();
    }
    // Flight-plan arrivals prepare only the normal chunk cache. They do not
    // merge into the live airport, request a canvas, or create scene objects.
    function readFlightPlanArrivalICAO() {
        try {
            const plan = window.geofs?.flightPlan;
            if (typeof plan?.export !== "function") return null;
            let waypoints = plan.export();
            if (typeof waypoints === "string") waypoints = JSON.parse(waypoints);
            if (!Array.isArray(waypoints) || waypoints.length < 2) return null;
            let destination = null;
            for (const waypoint of waypoints) {
                if (waypoint?.type === "DST" && waypoint.ident) destination = waypoint;
            }
            destination = destination || waypoints[waypoints.length - 1];
            if (destination?.type === "DPT") return null;
            const icao = String(destination?.ident || "").trim().toUpperCase();
            return /^[A-Z]{4}$/.test(icao) ? icao : null;
        } catch (_) {
            return null;
        }
    }
    function flightPlanArrivalCurrent(job) {
        return state.arrival.flightPlanJob === job && state.arrivalMode && state.autoLoadEnabled && !state.arrival.flightPlanManualOverride && job.generation === state.loadGeneration;
    }
    function cancelFlightPlanArrival() {
        const job = state.arrival.flightPlanJob;
        state.arrival.flightPlanJob = null;
        if (job?.controller) job.controller.abort();
    }
    function flightPlanAirportCandidate(icao, lat, lon, tags = {}) {
        if (lat === null || lon === null || lat === undefined || lon === undefined || lat === "" || lon === "") return null;
        lat = Number(lat);
        lon = Number(lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
        const center = { lat, lon };
        const aircraft = aircraftLL();
        return {
            icao, center, tags,
            name: cleanRef(tags.name) || cleanRef(tags["name:en"]) || icao,
            distanceM: geoDistanceMeters(aircraft, center),
            bearingDeg: bearingDegrees(aircraft, center)
        };
    }
    async function resolveFlightPlanAirport(job) {
        const location = window.geofs?.mainAirportList?.[job.icao];
        const knownAirport = Array.isArray(location) ? flightPlanAirportCandidate(job.icao, location[0], location[1]) : null;
        if (knownAirport) return knownAirport;
        // An ICAO-looking final fix is not enough: verify it is an aerodrome.
        const query = `[out:json][timeout:15];nwr["aeroway"="aerodrome"]["icao"="${job.icao}"];out center;`;
        for (const serverIndex of serverOrder()) {
            if (!flightPlanArrivalCurrent(job)) return null;
            if (state.serverHealth[serverIndex].cooldownUntil > Date.now()) continue;
            await waitForRequestGate();
            if (!flightPlanArrivalCurrent(job)) return null;
            const controller = new AbortController;
            job.controller = controller;
            const timeout = setTimeout(() => controller.abort(), CFG.arrivalSearchTimeoutMs);
            try {
                const response = await fetch(OVERPASS_SERVERS[serverIndex], {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
                    body: "data=" + encodeURIComponent(query),
                    signal: controller.signal
                });
                if (!response.ok) throw new HttpError(response.status);
                const data = await response.json();
                if (!flightPlanArrivalCurrent(job)) return null;
                if (data.remark) throw new Error(data.remark);
                markServerSuccess(serverIndex);
                for (const element of data.elements || []) {
                    if (element.tags?.aeroway !== "aerodrome" || String(element.tags?.icao).toUpperCase() !== job.icao) continue;
                    const point = element.type === "node" ? element : element.center;
                    const candidate = flightPlanAirportCandidate(job.icao, point?.lat, point?.lon, element.tags);
                    if (candidate) return candidate;
                }
                job.unavailable = true;
                return null;
            } catch (error) {
                if (!flightPlanArrivalCurrent(job)) return null;
                markServerFailure(serverIndex, error);
            } finally {
                clearTimeout(timeout);
                if (job.controller === controller) job.controller = null;
            }
        }
        return null;
    }
    function setFlightPlanArrivalStatus(job) {
        if (!flightPlanArrivalCurrent(job) || !job.airport) return;
        const complete = job.datasets.size === job.chunks.length;
        setStatus(complete ? `Arrival ${job.icao} cached · waiting for approach` : `Arrival ${job.icao} · ${job.datasets.size}/${job.chunks.length} areas cached`, complete ? "ready" : "loading");
    }
    async function prepareFlightPlanArrival(job) {
        job.busy = true;
        job.passes++;
        try {
            if (!job.airport) job.airport = await resolveFlightPlanAirport(job);
            if (!flightPlanArrivalCurrent(job) || !job.airport) return;
            if (!job.notified) {
                job.notified = true;
                job.chunks = makeChunks(job.airport.center);
                queueNotification("success", "ARRIVAL DETECTED", job.icao, "Arrival airport detected from flightplan. We will be loading it for you.", `flightplan-arrival:${job.icao}`, 4500);
            }
            // Use one background request at a time; the ordinary loader retains
            // its existing concurrency, failover, previews and final painting.
            for (const chunk of job.chunks) {
                if (!flightPlanArrivalCurrent(job)) return;
                if (job.datasets.has(chunk.key)) continue;
                let dataset = loadChunkCache(chunk);
                if (!dataset) {
                    for (const serverIndex of serverOrder()) {
                        if (!flightPlanArrivalCurrent(job)) return;
                        if (state.serverHealth[serverIndex].cooldownUntil > Date.now()) continue;
                        try {
                            dataset = await requestChunk(chunk, serverIndex, job.generation, job);
                            if (!flightPlanArrivalCurrent(job)) return;
                            markServerSuccess(serverIndex);
                            saveChunkCache(chunk, dataset);
                            break;
                        } catch (error) {
                            if (!flightPlanArrivalCurrent(job)) return;
                            markServerFailure(serverIndex, error);
                        }
                    }
                }
                if (dataset) job.datasets.set(chunk.key, dataset);
                setFlightPlanArrivalStatus(job);
            }
            job.complete = job.datasets.size === job.chunks.length;
        } catch (error) {
        } finally {
            job.busy = false;
            job.retryAt = Date.now() + CFG.flightPlanArrivalRetryMs;
        }
    }
    function flightPlanArrivalOnApproach(job, position) {
        if (!job.airport) return false;
        const distance = geoDistanceMeters(position, job.airport.center);
        if (!Number.isFinite(distance) || distance > CFG.flightPlanArrivalPaintRadiusM) return false;
        const aircraft = window.geofs?.aircraft?.instance;
        if (aircraft?.groundContact) return true;
        const height = window.geofs?.relativeAltitude; // GeoFS height above ground, in metres.
        if (!Number.isFinite(height) || height > CFG.flightPlanArrivalPaintMaxHeightM) return false;
        const heading = Number.isFinite(state.autoLoad.bearingDeg) ? state.autoLoad.bearingDeg : aircraft?.htr?.[0];
        return Number.isFinite(heading) && angleDifferenceDegrees(heading, bearingDegrees(position, job.airport.center)) <= 90;
    }
    function updateFlightPlanArrival(position, now) {
        const arrival = state.arrival;
        if (!state.arrivalMode || arrival.flightPlanManualOverride) return false;
        if (now >= arrival.flightPlanNextCheckAt) {
            arrival.flightPlanNextCheckAt = now + CFG.flightPlanArrivalCheckMs;
            const icao = readFlightPlanArrivalICAO();
            if (arrival.flightPlanJob && arrival.flightPlanJob.icao !== icao) {
                cancelFlightPlanArrival();
                setStatus("Airborne · ARR available", "idle");
            }
            if (icao && !arrival.flightPlanJob) {
                const job = {
                    icao, generation: state.loadGeneration, airport: null,
                    controller: null, datasets: new Map, chunks: [],
                    busy: false, complete: false, unavailable: false,
                    notified: false, passes: 0, retryAt: 0
                };
                arrival.flightPlanJob = job;
                void prepareFlightPlanArrival(job);
            }
        }
        const job = arrival.flightPlanJob;
        if (!job || !flightPlanArrivalCurrent(job) || job.unavailable) return false;
        // An open manual chooser always has priority over automatic activation.
        if (state.arrivalChooserHost?.classList.contains("open")) return false;
        if (flightPlanArrivalOnApproach(job, position)) {
            if (readFlightPlanArrivalICAO() !== job.icao) {
                arrival.flightPlanNextCheckAt = 0;
                return false;
            }
            chooseArrivalAirport(job.airport, { prefetchedChunks: job.datasets, flightPlanArrival: true });
            return true;
        }
        if (!job.busy && !job.complete && job.passes < CFG.flightPlanArrivalMaxPasses && now >= job.retryAt) {
            void prepareFlightPlanArrival(job);
        }
        // A landing elsewhere must still reach the existing nearby-airport scan.
        return !window.geofs?.aircraft?.instance?.groundContact;
    }
    function chooseArrivalAirport(candidate, options = {}) {
        closeArrivalChooser();
        disarmModifyArrival();
        state.arrivalMode = false;
        state.arrival.selectedAirport = candidate;
        state.arrival.manualModifyAvailable = true;
        state.arrival.groundConfirmSince = 0;
        resetArrivalLockState();
        state.arrival.protectionUntil = Date.now() + CFG.arrivalProtectionMs;
        state.arrival.departureOutsideSince = 0;
        const aircraft = aircraftLL();
        state.arrival.selectedBestDistanceM = Number.isFinite(aircraft.lat) && Number.isFinite(aircraft.lon) ? geoDistanceMeters(aircraft, candidate.center) : candidate.distanceM;
        state.arrival.movingAwaySince = 0;
        updateUI();
        const code = airportPrimaryCode(candidate);
        if (!options.flightPlanArrival) {
            queueNotification("success", "ARRIVAL SELECTED", code, candidate.name || arrivalDistanceText(candidate.distanceM), `arrival-selected:${code}`, 2500);
        }
        loadAirport({
            automatic: false,
            arrival: true,
            center: candidate.center,
            airport: candidate,
            flightPlanArrival: !!options.flightPlanArrival,
            prefetchedChunks: options.prefetchedChunks
        });
    }
    function addUI() {
        document.getElementById("geofs-twy-ui")?.remove();
        document.getElementById("geofs-twy-style")?.remove();
        document.getElementById("twy-notification-host")?.remove();
        document.getElementById("twy-arrival-host")?.remove();
        document.getElementById("twy-minimap-window")?.remove();
        document.getElementById("twy-stand-list-window")?.remove();
        const style = document.createElement("style");
        style.id = "geofs-twy-style";
        style.textContent = `\n            #geofs-twy-ui {\n                position: relative;\n                display: inline-flex;\n                align-items: center;\n                font-family: Arial, Helvetica, sans-serif;\n                color: #eee;\n                user-select: none;\n                overflow: visible;\n            }\n\n            #geofs-twy-ui * { box-sizing: border-box; }\n\n            #twy-brand {\n                position: absolute;\n                right: 0;\n                bottom: calc(100% + 6px);\n                display: flex;\n                align-items: center;\n                gap: 5px;\n                white-space: nowrap;\n                pointer-events: none;\n            }\n\n            #twy-brand img {\n                width: auto;\n                height: 18px;\n                display: block;\n                filter:\n                    drop-shadow(0 1px 1px rgba(0,0,0,.78))\n                    drop-shadow(0 0 4px rgba(0,0,0,.42));\n            }\n\n            #twy-brand span {\n                font-size: 10px;\n                font-weight: 700;\n                letter-spacing: .55px;\n                color: #eef0f1;\n                line-height: 1;\n                text-shadow:\n                    0 1px 1px rgba(0,0,0,.88),\n                    0 0 4px rgba(0,0,0,.52),\n                    0 0 8px rgba(0,0,0,.24);\n            }\n\n\n            \n            #twy-menu-button,\n            #twy-stand-button {\n                min-width: 42px;\n                width: 42px;\n                padding-left: 0;\n                padding-right: 0;\n\n                font-size: 10px;\n                font-weight: 700;\n                letter-spacing: .45px;\n                line-height: inherit;\n                text-align: center;\n            }\n\n            #twy-menu-button.active,\n            #twy-stand-button.active {\n                background: rgba(255,255,255,.14);\n            }\n\n            #twy-menu-button.arrival-mode {\n                box-shadow: inset 0 -2px 0 rgba(255,210,26,.88);\n            }\n\n            #twy-stand-button {\n                \n                position: absolute;\n                top: calc(100% + 4px);\n                right: 0;\n                z-index: 4;\n            }\n\n            \n            #twy-stand-button.selected {\n                color: inherit;\n                background: inherit;\n                box-shadow: inset 0 -2px 0 rgba(255,210,26,.88);\n            }\n\n            #twy-stand-button.selected:hover {\n                box-shadow: inset 0 -2px 0 rgba(255,210,26,1);\n            }\n\n\n            #twy-map-button {\n                position: absolute;\n                top: calc(200% + 8px);\n                right: 0;\n                z-index: 4;\n                min-width: 42px;\n                width: 42px;\n                padding-left: 0;\n                padding-right: 0;\n                font-size: 10px;\n                font-weight: 700;\n                letter-spacing: .45px;\n                line-height: inherit;\n                text-align: center;\n            }\n\n            #twy-map-button.active {\n                box-shadow: inset 0 -2px 0 rgba(255,210,26,.88);\n            }\n\n            #twy-map-button.unavailable,\n            #twy-map-button:disabled {\n                opacity: .35;\n                cursor: default;\n                box-shadow: none;\n            }\n\n            #twy-minimap-window {\n                position: fixed;\n                right: 112px;\n                bottom: 92px;\n                width: 232px;\n                display: none;\n                overflow: hidden;\n                border: 1px solid rgba(255,255,255,.14);\n                border-radius: 6px;\n                background: #15181a;\n                box-shadow: 0 6px 18px rgba(0,0,0,.42);\n                z-index: 2147483600;\n                color: #eef0f1;\n                font-family: Arial, Helvetica, sans-serif;\n                user-select: none;\n            }\n\n            #twy-minimap-window.open { display: block; }\n\n            #twy-minimap-header {\n                height: 28px;\n                display: flex;\n                align-items: center;\n                justify-content: space-between;\n                padding: 0 7px 0 9px;\n                border-bottom: 1px solid rgba(255,255,255,.10);\n                background: #202326;\n                cursor: move;\n            }\n\n            #twy-minimap-logo {\n                display: block;\n                width: auto;\n                height: 12px;\n                opacity: .92;\n                filter:\n                    drop-shadow(0 1px 1px rgba(0,0,0,.72))\n                    drop-shadow(0 0 3px rgba(0,0,0,.30));\n            }\n\n            #twy-minimap-controls {\n                display: flex;\n                align-items: center;\n                gap: 2px;\n            }\n\n            #twy-minimap-range {\n                min-width: 43px;\n                color: #aeb4b8;\n                font-size: 7px;\n                font-weight: 700;\n                text-align: center;\n                letter-spacing: .2px;\n            }\n\n            #twy-minimap-lock,\n            #twy-minimap-zoom-in,\n            #twy-minimap-zoom-out,\n            #twy-minimap-close {\n                width: 22px;\n                height: 20px;\n                padding: 0;\n                border: 0;\n                border-radius: 3px;\n                background: transparent;\n                color: #aeb4b8;\n                cursor: pointer;\n                font: 700 13px Arial;\n                line-height: 20px;\n                text-align: center;\n            }\n\n            #twy-minimap-lock {\n                width: 42px;\n                font-size: 7px;\n                letter-spacing: .25px;\n            }\n\n            #twy-minimap-lock.active {\n                color: #ffe263;\n                background: rgba(255,210,26,.10);\n            }\n\n            #twy-minimap-lock:hover,\n            #twy-minimap-zoom-in:hover,\n            #twy-minimap-zoom-out:hover,\n            #twy-minimap-close:hover {\n                color: #fff;\n                background: rgba(255,255,255,.07);\n            }\n\n            #twy-minimap-lock:disabled,\n            #twy-minimap-zoom-in:disabled,\n            #twy-minimap-zoom-out:disabled {\n                opacity: .28;\n                cursor: default;\n                background: transparent;\n            }\n\n            #twy-minimap-canvas {\n                display: block;\n                margin: 6px;\n                border: 1px solid rgba(255,255,255,.08);\n                background: #15181a;\n                cursor: grab;\n            }\n\n            #twy-minimap-canvas:active {\n                cursor: grabbing;\n            }\n\n            #twy-stand-panel {\n                position: absolute;\n                top: calc(100% + 4px);\n                right: 48px;\n\n                width: 226px;\n                padding: 11px;\n\n                display: none;\n\n                border: 1px solid rgba(255,255,255,.12);\n                border-radius: 7px;\n                background: rgba(25,27,30,.98);\n                box-shadow: 0 6px 18px rgba(0,0,0,.34);\n                color: #e8eaec;\n\n                z-index: 1000002;\n            }\n\n            #twy-stand-panel.open {\n                display: block;\n            }\n\n            .twy-stand-search-row {\n                display: flex;\n                gap: 5px;\n                margin-top: 8px;\n            }\n\n            #twy-stand-input {\n                min-width: 0;\n                flex: 1 1 auto;\n                height: 28px;\n\n                padding: 0 8px;\n\n                border: 1px solid rgba(255,255,255,.14);\n                border-radius: 4px;\n                outline: none;\n\n                background: #202326;\n                color: #f0f1f2;\n\n                font: 600 10px Arial, Helvetica, sans-serif;\n            }\n\n            #twy-stand-input:focus {\n                border-color: rgba(255,210,26,.65);\n            }\n\n            #twy-stand-find {\n                flex: 0 0 45px;\n                height: 28px;\n\n                border: 1px solid rgba(255,255,255,.11);\n                border-radius: 4px;\n\n                background: #4c4933;\n                color: #f3e9a5;\n\n                cursor: pointer;\n                font-size: 9px;\n                font-weight: 700;\n            }\n\n            #twy-stand-find:hover {\n                background: #5b573a;\n            }\n\n            #twy-stand-locator-status {\n                min-height: 14px;\n                margin-top: 8px;\n\n                color: #92989d;\n                font-size: 8px;\n                line-height: 1.35;\n            }\n\n            #twy-stand-locator-status[data-mode="selected"] {\n                color: #cfd8d1;\n            }\n\n            #twy-stand-locator-status[data-mode="error"] {\n                color: #d8a6a6;\n            }\n\n            .twy-stand-marshaller-row {\n                margin-top: 7px;\n                padding-top: 7px;\n                border-top: 1px solid rgba(255,255,255,.07);\n            }\n\n            .twy-marshaller-offset-row {\n                min-height: 24px;\n                display: flex;\n                align-items: center;\n                justify-content: space-between;\n                gap: 8px;\n            }\n\n            .twy-marshaller-offset-label {\n                color: #858b90;\n                font-size: 7px;\n                font-weight: 700;\n                letter-spacing: .35px;\n            }\n\n            .twy-marshaller-offset-controls {\n                display: flex;\n                align-items: center;\n                gap: 3px;\n            }\n\n            #twy-marshaller-offset-minus,\n            #twy-marshaller-offset-plus {\n                width: 21px;\n                height: 19px;\n                padding: 0;\n                border: 1px solid rgba(255,255,255,.10);\n                border-radius: 3px;\n                background: #34383c;\n                color: #d5d8da;\n                cursor: pointer;\n                font: 700 11px Arial;\n                line-height: 17px;\n            }\n\n            #twy-marshaller-offset-minus:hover,\n            #twy-marshaller-offset-plus:hover {\n                background: #41464b;\n            }\n\n            #twy-marshaller-offset-minus:disabled,\n            #twy-marshaller-offset-plus:disabled {\n                opacity: .3;\n                cursor: default;\n            }\n\n            #twy-marshaller-offset-value {\n                min-width: 34px;\n                color: #cfd2d4;\n                font-size: 8px;\n                font-weight: 700;\n                text-align: center;\n            }\n\n            #twy-stand-clear {\n                width: 100%;\n                height: 25px;\n                margin-top: 7px;\n\n                border: 1px solid rgba(255,255,255,.10);\n                border-radius: 4px;\n\n                background: #34383c;\n                color: #c9cccf;\n\n                cursor: pointer;\n                font-size: 8px;\n                font-weight: 600;\n            }\n\n            #twy-stand-clear:hover {\n                background: #41464b;\n            }\n\n            #twy-notif-button {\n                \n                position: absolute;\n                top: 0;\n                right: 46px;\n\n                min-width: 46px;\n                width: 46px;\n                padding-left: 0;\n                padding-right: 0;\n                font-size: 9px;\n                font-weight: 700;\n                letter-spacing: .35px;\n                text-align: center;\n                transition: background .15s ease, opacity .15s ease;\n                z-index: 3;\n            }\n\n            #twy-notif-button.notif-on {\n                background: rgba(86,127,96,.88);\n                color: #f4f6f4;\n            }\n\n            #twy-notif-button.notif-off {\n                background: rgba(55,58,62,.76);\n                color: #9ca1a5;\n                opacity: .78;\n            }\n\n\n            #twy-arrival-host {\n                position: fixed !important;\n                left: 50vw !important;\n                top: clamp(118px, 16vh, 170px) !important;\n                transform: translateX(-50%) !important;\n\n                width: min(430px, calc(100vw - 24px));\n                max-width: calc(100vw - 24px);\n\n                display: none;\n                pointer-events: auto;\n\n                z-index: 2147483647 !important;\n                font-family: Arial, Helvetica, sans-serif;\n            }\n\n            #twy-arrival-host.open {\n                display: block;\n            }\n\n            .twy-arrival-card {\n                width: 100%;\n                padding: 14px;\n\n                border: 1px solid rgba(255,255,255,.13);\n                border-left: 4px solid #FFD21A;\n                border-radius: 7px;\n\n                background: rgba(17,19,21,.98);\n                box-shadow: 0 8px 26px rgba(0,0,0,.44);\n\n                color: #f0f1f2;\n                cursor: grab;\n            }\n\n            .twy-arrival-card:active {\n                cursor: grabbing;\n            }\n\n            .twy-arrival-card button,\n            .twy-arrival-card input {\n                cursor: pointer;\n            }\n\n            .twy-arrival-title {\n                font-size: 11px;\n                font-weight: 800;\n                letter-spacing: .9px;\n                text-align: center;\n                cursor: grab;\n            }\n\n            .twy-arrival-subtitle {\n                margin-top: 4px;\n                color: #92989d;\n                font-size: 8px;\n                text-align: center;\n                cursor: grab;\n            }\n\n            .twy-arrival-loading,\n            .twy-arrival-error {\n                margin: 14px 0 10px;\n                padding: 10px;\n\n                border-radius: 5px;\n                background: #24272a;\n\n                color: #c9cccf;\n                font-size: 9px;\n                text-align: center;\n            }\n\n            .twy-arrival-error {\n                color: #d8a6a6;\n            }\n\n            .twy-arrival-list {\n                display: grid;\n                gap: 5px;\n                margin-top: 11px;\n            }\n\n            .twy-arrival-choice {\n                position: relative;\n                width: 100%;\n                min-height: 54px;\n                padding: 8px 70px 8px 10px;\n\n                border: 1px solid rgba(255,255,255,.09);\n                border-radius: 5px;\n\n                background: #272a2d;\n                color: #f0f1f2;\n\n                cursor: pointer;\n                text-align: left;\n            }\n\n            .twy-arrival-choice:hover {\n                border-color: rgba(255,210,26,.42);\n                background: #303438;\n            }\n\n            .twy-arrival-choice-main {\n                display: flex;\n                align-items: center;\n                gap: 6px;\n            }\n\n            .twy-arrival-code {\n                font-size: 12px;\n                font-weight: 800;\n                letter-spacing: .35px;\n            }\n\n            .twy-arrival-ahead {\n                padding: 2px 4px;\n                border-radius: 3px;\n                background: rgba(255,210,26,.14);\n                color: #e5cf70;\n                font-size: 7px;\n                font-weight: 700;\n                letter-spacing: .4px;\n            }\n\n            .twy-arrival-name {\n                margin-top: 3px;\n                overflow: hidden;\n\n                color: #9fa5aa;\n                font-size: 8px;\n                white-space: nowrap;\n                text-overflow: ellipsis;\n            }\n\n            .twy-arrival-distance {\n                position: absolute;\n                right: 10px;\n                top: 50%;\n                transform: translateY(-50%);\n\n                color: #d9dadd;\n                font-size: 10px;\n                font-weight: 700;\n            }\n\n            .twy-arrival-cancel,\n            .twy-arrival-retry {\n                height: 27px;\n                margin-top: 10px;\n\n                border: 1px solid rgba(255,255,255,.10);\n                border-radius: 4px;\n\n                background: #34383c;\n                color: #c9cccf;\n\n                cursor: pointer;\n                font-size: 8px;\n                font-weight: 700;\n            }\n\n            .twy-arrival-cancel {\n                width: 100%;\n            }\n\n            .twy-arrival-actions {\n                display: flex;\n                gap: 6px;\n                margin-top: 10px;\n            }\n\n            .twy-arrival-actions .twy-arrival-retry,\n            .twy-arrival-actions .twy-arrival-cancel {\n                flex: 1 1 0;\n                width: auto;\n                margin-top: 0;\n            }\n\n            .twy-arrival-cancel:hover,\n            .twy-arrival-retry:hover {\n                background: #41464b;\n            }\n\n            #twy-notification-host {\n                \n                position: fixed !important;\n                left: 50vw !important;\n                top: clamp(64px, 9vh, 96px) !important;\n                right: auto !important;\n                bottom: auto !important;\n                transform: translateX(-50%) !important;\n\n                width: min(380px, calc(100vw - 24px));\n                max-width: calc(100vw - 24px);\n\n                pointer-events: none !important;\n                visibility: visible !important;\n                overflow: visible !important;\n\n                \n                z-index: 2147483647 !important;\n\n                font-family: Arial, Helvetica, sans-serif;\n            }\n\n            .twy-notification-card {\n                width: 100%;\n                min-width: 0;\n                padding: 14px 18px 13px;\n                border: 1px solid rgba(255,255,255,.13);\n                border-left: 4px solid #d3b95e;\n                border-radius: 7px;\n                background: rgba(17,19,21,.97);\n                box-shadow: 0 8px 24px rgba(0,0,0,.40);\n                color: #f0f1f2;\n                text-align: center;\n                opacity: 0;\n                transform: translateY(-10px) scale(.985);\n                transition: opacity .18s ease, transform .18s ease;\n            }\n\n            .twy-notification-card.show {\n                opacity: 1;\n                transform: translateY(0) scale(1);\n            }\n\n            .twy-notification-card.warning { border-left-color: #d7a84d; }\n            .twy-notification-card.runway { border-left-color: #c86565; }\n            .twy-notification-card.success { border-left-color: #6f9f79; }\n            .twy-notification-card.taxi { border-left-color: #d3b95e; }\n\n            .twy-notification-title {\n                font-size: 10px;\n                line-height: 1;\n                font-weight: 700;\n                letter-spacing: .95px;\n                color: #aeb3b7;\n            }\n\n            .twy-notification-value {\n                margin-top: 5px;\n                font-size: 25px;\n                line-height: 1.05;\n                font-weight: 800;\n                letter-spacing: .5px;\n                color: #fff;\n            }\n\n            .twy-notification-meta {\n                margin-top: 5px;\n                font-size: 9px;\n                line-height: 1.2;\n                color: #aeb3b7;\n            }\n\n            #twy-panel {\n                position: absolute;\n                top: calc(100% + 6px);\n                right: 0;\n                width: 220px;\n                padding: 11px;\n                display: none;\n                border: 1px solid rgba(255,255,255,.12);\n                border-radius: 7px;\n                background: rgba(25,27,30,.98);\n                box-shadow: 0 6px 18px rgba(0,0,0,.34);\n                color: #e8eaec;\n                z-index: 1000000;\n            }\n\n            #twy-panel.open { display: block; }\n\n            .twy-title { font-size: 11px; font-weight: 700; }\n            .twy-subtitle { margin-top: 2px; color: #858b90; font-size: 8px; }\n\n            .twy-section {\n                margin-top: 9px;\n                padding-top: 8px;\n                border-top: 1px solid rgba(255,255,255,.07);\n            }\n\n            .twy-row {\n                min-height: 24px;\n                display: flex;\n                align-items: center;\n                justify-content: space-between;\n                gap: 10px;\n            }\n\n            .twy-label { color: #cfd2d4; font-size: 9px; font-weight: 600; }\n\n            .twy-switch {\n                position: relative;\n                width: 36px;\n                height: 20px;\n                padding: 0;\n                flex: 0 0 auto;\n                border: 1px solid rgba(255,255,255,.12);\n                border-radius: 11px;\n                background: #4a4f54;\n                cursor: pointer;\n            }\n\n            .twy-switch.on { background: #567f60; }\n\n            .twy-knob {\n                position: absolute;\n                left: 2px;\n                top: 2px;\n                width: 14px;\n                height: 14px;\n                border-radius: 50%;\n                background: #f2f2f2;\n                box-shadow: 0 1px 2px rgba(0,0,0,.32);\n                transition: transform .15s ease;\n            }\n\n            #twy-status { margin-top: 9px; color: #c8cccf; font-size: 9px; }\n\n            .twy-dot {\n                display: inline-block;\n                width: 6px;\n                height: 6px;\n                margin-right: 5px;\n                border-radius: 50%;\n                vertical-align: 1px;\n            }\n\n            .twy-dot.idle { background: #8e9499; }\n            .twy-dot.loading { background: #d2b85f; }\n            .twy-dot.ready { background: #7eae87; }\n            .twy-dot.error { background: #c27e7e; }\n\n            .twy-progress-bg {\n                width: 100%;\n                height: 3px;\n                margin-top: 7px;\n                overflow: hidden;\n                border-radius: 3px;\n                background: #34383c;\n            }\n\n            #twy-progress-fill {\n                width: 0%;\n                height: 100%;\n                border-radius: 3px;\n                background: #d3b95e;\n                transition: width .2s ease;\n            }\n\n            #twy-details {\n                min-height: 10px;\n                margin-top: 5px;\n                color: #858b90;\n                font-size: 8px;\n                line-height: 1.35;\n            }\n\n\n            #twy-modify-arr-wrap {\n                display: none;\n                margin-top: 9px;\n                padding-top: 9px;\n                border-top: 1px solid rgba(255,255,255,.07);\n            }\n\n            #twy-modify-arr-wrap.visible {\n                display: block;\n            }\n\n            #twy-modify-arr-button {\n                position: relative;\n\n                width: 100%;\n                min-height: 43px;\n                padding: 7px 10px 6px;\n\n                overflow: hidden;\n\n                border: 1px solid rgba(217,183,78,.33);\n                border-radius: 5px;\n\n                background:\n                    linear-gradient(\n                        180deg,\n                        rgba(68,66,53,.88),\n                        rgba(47,48,46,.94)\n                    );\n\n                color: #e5ddbb;\n\n                cursor: pointer;\n                text-align: center;\n\n                box-shadow:\n                    inset 0 1px 0 rgba(255,255,255,.06),\n                    0 1px 3px rgba(0,0,0,.24);\n\n                transition:\n                    border-color .12s ease,\n                    background .12s ease,\n                    box-shadow .12s ease,\n                    transform .08s ease;\n            }\n\n            \n            #twy-modify-arr-button::before,\n            #twy-modify-arr-button::after {\n                content: "";\n                position: absolute;\n                top: 4px;\n                bottom: 4px;\n                width: 1px;\n                background: rgba(255,255,255,.09);\n                pointer-events: none;\n            }\n\n            #twy-modify-arr-button::before { left: 9px; }\n            #twy-modify-arr-button::after { right: 9px; }\n\n            #twy-modify-arr-button:hover {\n                border-color: rgba(230,198,91,.52);\n                background:\n                    linear-gradient(\n                        180deg,\n                        rgba(76,73,56,.92),\n                        rgba(52,53,49,.96)\n                    );\n            }\n\n            #twy-modify-arr-button:active {\n                transform: translateY(1px);\n            }\n\n            #twy-modify-arr-button.armed {\n                border-color: rgba(201,101,101,.80);\n\n                background:\n                    linear-gradient(\n                        180deg,\n                        rgba(92,48,48,.96),\n                        rgba(57,36,37,.98)\n                    );\n\n                color: #f2d9d9;\n\n                box-shadow:\n                    inset 0 0 0 1px rgba(255,255,255,.04),\n                    0 0 0 1px rgba(201,101,101,.10),\n                    0 2px 7px rgba(0,0,0,.30);\n            }\n\n            .twy-modify-arr-title {\n                display: block;\n\n                font-size: 10px;\n                line-height: 1.1;\n                font-weight: 800;\n                letter-spacing: .65px;\n            }\n\n            .twy-modify-arr-safe,\n            .twy-modify-arr-confirm {\n                display: block;\n                margin-top: 5px;\n\n                font-size: 7px;\n                line-height: 1;\n                font-weight: 700;\n                letter-spacing: .8px;\n            }\n\n            .twy-modify-arr-safe {\n                color: #9d9b8e;\n            }\n\n            .twy-modify-arr-confirm {\n                color: #e9b8b8;\n            }\n\n            .twy-actions { display: flex; gap: 5px; margin-top: 8px; }\n\n            #twy-load-button,\n            #twy-reset-button {\n                height: 27px;\n                border: 1px solid rgba(255,255,255,.11);\n                border-radius: 4px;\n                background: #383c40;\n                color: #e8e9ea;\n                cursor: pointer;\n                font-size: 9px;\n                font-weight: 600;\n            }\n\n            #twy-load-button { flex: 1 1 auto; }\n            #twy-reset-button { flex: 0 0 52px; color: #d9b9b9; }\n\n            #twy-load-button:hover:not(:disabled),\n            #twy-reset-button:hover { background: #44494e; }\n\n            #twy-load-button:disabled { opacity: .55; cursor: default; }\n\n            .twy-spinner {\n                display: inline-block;\n                width: 8px;\n                height: 8px;\n                margin-right: 4px;\n                border: 1.2px solid rgba(255,255,255,.20);\n                border-top-color: #d3b95e;\n                border-radius: 50%;\n                vertical-align: -1px;\n                animation: twy-spin .8s linear infinite;\n            }\n\n            @keyframes twy-spin { to { transform: rotate(360deg); } }\n\n            #geofs-twy-ui.fallback {\n                position: fixed;\n                right: 12px;\n                bottom: 76px;\n                z-index: 999999;\n            }\n        `;
        style.textContent += `
            #geofs-twy-ui,
            #geofs-twy-ui.fallback {
                position: fixed !important;
                left: 0 !important;
                right: auto !important;
                top: 50% !important;
                bottom: auto !important;
                width: 30px;
                height: 62px;
                transform: translateY(-50%);
                display: block;
                overflow: visible;
                z-index: 2147483500;
            }
            #twy-edge-toggle {
                position: absolute;
                inset: 0;
                width: 30px;
                height: 62px;
                padding: 0;
                border: 1px solid rgba(242,197,0,.70);
                border-left: 0;
                border-radius: 0 8px 8px 0;
                background: rgba(14,16,18,.94);
                box-shadow: 3px 3px 12px rgba(0,0,0,.38);
                color: #f2c500;
                cursor: pointer;
            }
            #twy-edge-toggle:hover { background: rgba(29,31,33,.97); }
            #twy-edge-toggle img {
                position: absolute;
                left: 7px;
                top: 19px;
                width: 16px;
                height: 22px;
                object-fit: contain;
                display: block;
            }
            #twy-dock-buttons {
                position: absolute;
                left: 36px;
                top: 50%;
                width: 52px;
                padding: 5px;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
                border: 1px solid rgba(255,255,255,.12);
                border-radius: 7px;
                background: rgba(18,20,22,.95);
                box-shadow: 0 6px 18px rgba(0,0,0,.38);
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: translate(-7px,-50%);
                transition: opacity .14s ease, transform .14s ease, visibility .14s;
            }
            #geofs-twy-ui.dock-open #twy-dock-buttons {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
                transform: translate(0,-50%);
            }
            #twy-dock-buttons #twy-brand,
            #twy-dock-buttons #twy-menu-button,
            #twy-dock-buttons #twy-notif-button,
            #twy-dock-buttons #twy-stand-button,
            #twy-dock-buttons #twy-map-button,
            #twy-dock-buttons #twy-extras-button {
                position: static !important;
                inset: auto !important;
                width: 42px;
                min-width: 42px;
                margin: 0;
            }
            #geofs-twy-ui #twy-panel,
            #geofs-twy-ui #twy-stand-panel,
            #geofs-twy-ui #twy-extras-panel {
                position: absolute;
                left: 96px;
                right: auto;
                top: 50%;
                transform: translateY(-50%);
            }
            #geofs-twy-ui:not(.dock-open) #twy-panel,
            #geofs-twy-ui:not(.dock-open) #twy-stand-panel,
            #geofs-twy-ui:not(.dock-open) #twy-extras-panel { display: none !important; }
            #twy-extras-panel {
                width: 240px;
                padding: 11px;
                display: none;
                border: 1px solid rgba(255,255,255,.12);
                border-radius: 7px;
                background: rgba(25,27,30,.98);
                box-shadow: 0 6px 18px rgba(0,0,0,.34);
                color: #e8eaec;
                z-index: 1000001;
            }
            #twy-extras-panel.open { display: block; }
            #twy-extras-button.active { background: rgba(255,255,255,.14); }
            .twy-extras-description {
                margin-top: 3px;
                max-width: 170px;
                color: #858b90;
                font-size: 8px;
                line-height: 1.3;
            }
            #twy-ground-handling-status {
                min-height: 14px;
                margin-top: 8px;
                color: #858b90;
                font-size: 8px;
                line-height: 1.35;
            }
            #twy-arrival-mode-label {
                position: absolute;
                left: 62px;
                top: -39px;
                width: max-content;
                color: #d8dbdd;
                font: 400 7px/1.2 Arial, Helvetica, sans-serif;
                letter-spacing: .25px;
                text-align: center;
                white-space: nowrap;
                opacity: 0;
                transform: translate(-50%, 3px);
                transition: opacity .14s ease, transform .14s ease;
                pointer-events: none;
            }
            #twy-arrival-mode-label.show {
                opacity: 1;
                transform: translate(-50%, 0);
            }

            #twy-dock-buttons #twy-extras-button {
                padding: 0;
                font-size: 8px;
                font-weight: 700;
                letter-spacing: .15px;
                line-height: inherit;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
            }

            #twy-extras-panel {
                width: 220px;
                padding: 11px;
            }

            #twy-ground-handling-status {
                min-height: 10px;
                margin-top: 5px;
                color: #858b90;
                font-size: 8px;
                line-height: 1.25;
            }
            .twy-throttle-visualizer-row {
                margin-top: 4px;
                padding-top: 4px;
                border-top: 1px solid rgba(255,255,255,.06);
            }
            .twy-throttle-visualizer-controls {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .twy-turn-aid-button {
                width: 32px;
                min-width: 32px;
                height: 24px;
                padding: 0 2px;
                border: 1px solid rgba(255,255,255,.10);
                border-radius: 4px;
                background: #34383c;
                color: #858b90;
                cursor: pointer;
                font: 700 7px/7px Arial, Helvetica, sans-serif;
                letter-spacing: .15px;
                white-space: pre-line;
                text-align: center;
            }
            .twy-turn-aid-button:hover { background: #41464b; color: #d5d8da; }
            .twy-turn-aid-button.on {
                border-color: rgba(197,216,188,.32);
                background: #687963;
                color: #f0f3ed;
            }
            .twy-follow-me-row {
                margin-top: 7px;
                padding-top: 7px;
                border-top: 1px solid rgba(255,255,255,.07);
            }
            #twy-follow-me-status {
                min-height: 14px;
                margin-top: 5px;
                color: #858b90;
                font-size: 8px;
                line-height: 1.25;
            }
            #twy-follow-me-status[data-mode="active"] { color: #cfd8d1; }
            #twy-follow-me-status[data-mode="error"] { color: #d8a6a6; }
            .twy-follow-me-distance-row {
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 7px;
                padding-top: 7px;
                border-top: 1px solid rgba(255,255,255,.07);
            }
            .twy-follow-me-distance-label {
                color: #858b90;
                font-size: 8px;
                font-weight: 700;
                letter-spacing: .2px;
            }
            .twy-follow-me-distance-controls {
                display: flex;
                align-items: center;
                gap: 3px;
            }
            #twy-follow-me-distance-minus,
            #twy-follow-me-distance-plus {
                width: 21px;
                height: 19px;
                padding: 0;
                border: 1px solid rgba(255,255,255,.10);
                border-radius: 3px;
                background: #34383c;
                color: #d5d8da;
                cursor: pointer;
                font: 700 11px Arial;
                line-height: 17px;
            }
            #twy-follow-me-distance-minus:hover,
            #twy-follow-me-distance-plus:hover { background: #41464b; }
            #twy-follow-me-distance-minus:disabled,
            #twy-follow-me-distance-plus:disabled {
                opacity: .3;
                cursor: default;
            }
            #twy-follow-me-distance-value {
                min-width: 34px;
                color: #cfd2d4;
                font-size: 8px;
                font-weight: 700;
                text-align: center;
            }
        `;
        style.textContent += `
            #twy-throttle-visualizer {
                position: fixed !important;
                left: 50%;
                top: clamp(12px, 3vh, 32px);
                width: 138px;
                padding: 6px 8px 7px;
                border: 1px solid rgba(255,255,255,.13);
                border-radius: 5px;
                background: rgba(17,19,21,.78);
                box-shadow: 0 4px 12px rgba(0,0,0,.24);
                color: #e8eaec;
                font-family: Arial, Helvetica, sans-serif;
                pointer-events: auto !important;
                cursor: grab;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
                opacity: 0;
                visibility: hidden;
                transform: translateX(-50%) translateY(-3px);
                transition: opacity .12s ease, transform .12s ease, visibility .12s;
                z-index: 2147483646 !important;
            }
            #twy-throttle-visualizer.open {
                opacity: 1;
                visibility: visible;
                pointer-events: auto !important;
                cursor: grab;
                transform: translateX(-50%) translateY(0);
            }
            #twy-throttle-visualizer.open.dragging { cursor: grabbing; }
            .twy-throttle-visualizer-readout {
                display: flex;
                align-items: baseline;
                gap: 7px;
                min-height: 11px;
                line-height: 1;
            }
            .twy-throttle-visualizer-caption {
                color: #858b90;
                font-size: 7px;
                font-weight: 700;
                letter-spacing: .45px;
            }
            #twy-throttle-visualizer-mode {
                flex: 1 1 auto;
                color: #cfd2d4;
                font-size: 8px;
                font-weight: 700;
                letter-spacing: .35px;
            }
            #twy-throttle-visualizer-mode.reverse { color: #dfaaaa; }
            #twy-throttle-visualizer-mode.unavailable { color: #858b90; }
            #twy-throttle-visualizer-value {
                color: #f0f1f2;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: .15px;
            }
            .twy-throttle-visualizer-track {
                width: 100%;
                height: 3px;
                margin-top: 5px;
                overflow: hidden;
                border-radius: 3px;
                background: rgba(255,255,255,.14);
            }
            #twy-throttle-visualizer-fill {
                display: block;
                width: 0;
                height: 100%;
                border-radius: inherit;
                background: #d3b95e;
                transition: width .08s linear, background .12s ease;
            }
            #twy-throttle-visualizer-fill.reverse { background: #c97d7d; }

            #twy-stand-list-button {
                width: 100%; height: 24px; margin-top: 5px;
                border: 1px solid rgba(255,255,255,.10); border-radius: 4px;
                background: #34383c; color: #c9cccf; cursor: pointer;
                font-size: 8px; font-weight: 700; letter-spacing: .25px;
            }
            #twy-stand-list-button:hover,
            #twy-stand-list-button.active { background: #41464b; color: #f0f1f2; }
            #twy-stand-list-window {
                position: fixed; left: 92px; top: 50%; transform: translateY(-50%);
                width: 248px; max-height: min(560px, calc(100vh - 40px));
                display: none; overflow: hidden; border: 1px solid rgba(255,255,255,.12);
                border-radius: 7px; background: rgba(25,27,30,.98);
                box-shadow: 0 6px 18px rgba(0,0,0,.38); color: #e8eaec;
                font-family: Arial, Helvetica, sans-serif; user-select: none;
                z-index: 2147483501;
            }
            #twy-stand-list-window.open { display: block; }
            .twy-stand-list-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 8px; border-bottom: 1px solid rgba(255,255,255,.08); }
            .twy-stand-list-title { font-size: 11px; font-weight: 700; }
            #twy-stand-list-close { width: 20px; height: 20px; padding: 0; border: 0; border-radius: 3px; background: transparent; color: #92989d; cursor: pointer; font: 700 15px/20px Arial; }
            #twy-stand-list-close:hover { color: #fff; background: rgba(255,255,255,.08); }
            #twy-stand-list-summary { padding: 6px 10px 7px; color: #858b90; font-size: 8px; }
            #twy-stand-list-search {
                display: block; width: calc(100% - 20px); height: 28px; margin: 0 10px 7px;
                padding: 0 9px; border: 1px solid rgba(255,255,255,.12); border-radius: 4px;
                outline: none; background: #202326; color: #e8eaec; font: 600 10px Arial, Helvetica, sans-serif;
            }
            #twy-stand-list-search:focus { border-color: rgba(255,210,26,.62); }
            #twy-stand-list-search::placeholder { color: #858b90; font-weight: 400; }
            #twy-stand-list-body {
                max-height: min(435px, calc(100vh - 155px));
                overflow-y: auto; padding: 7px;
                border-top: 1px solid rgba(255,255,255,.06);
            }
            .twy-stand-list-section { margin-bottom: 8px; }
            .twy-stand-list-group {
                display: flex; align-items: center; justify-content: space-between;
                margin: 5px 3px 6px; color: #a3a9ae; font-size: 8px; font-weight: 700;
                letter-spacing: .4px; text-transform: uppercase;
            }
            .twy-stand-list-count { color: #868d93; font-size: 8px; font-variant-numeric: tabular-nums; }
            .twy-stand-list-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 5px; }
            .twy-stand-list-entry {
                width: 100%; min-width: 0; min-height: 31px; display: flex;
                align-items: center; justify-content: space-between; gap: 4px;
                padding: 5px 8px; border: 1px solid rgba(255,255,255,.09);
                border-radius: 4px; background: #272a2d; color: #e8eaec;
                cursor: pointer; text-align: left;
            }
            .twy-stand-list-entry:hover { border-color: rgba(255,210,26,.42); background: #343438; }
            .twy-stand-list-entry.selected { border-color: rgba(255,210,26,.9); background: rgba(255,210,26,.11); }
            .twy-stand-list-ref { overflow: hidden; font-size: 10px; font-weight: 700; white-space: nowrap; text-overflow: ellipsis; }
            .twy-stand-list-meta { overflow: hidden; color: #aeb4b8; font-size: 7px; white-space: nowrap; text-overflow: ellipsis; }
            .twy-stand-list-empty { padding: 14px 7px; color: #858b90; font-size: 8px; text-align: center; }
        `;
        document.head.appendChild(style);
        const root = document.createElement("div");
        root.id = "geofs-twy-ui";
        const edgeToggle = document.createElement("button");
        edgeToggle.id = "twy-edge-toggle";
        edgeToggle.innerHTML = `<img src="${BRAND_LOGO}" alt="">`;
        const dockButtons = document.createElement("div");
        dockButtons.id = "twy-dock-buttons";
        const arrivalModeLabel = document.createElement("div");
        arrivalModeLabel.id = "twy-arrival-mode-label";
        arrivalModeLabel.textContent = "ARR MODE ACTIVE";
        const menuButton = document.createElement("button");
        menuButton.id = "twy-menu-button";
        menuButton.className = "geofs-button";
        menuButton.textContent = "TWY";
        menuButton.title = "Airport ground overlay";
        const notificationButton = document.createElement("button");
        notificationButton.id = "twy-notif-button";
        notificationButton.className = "geofs-button";
        notificationButton.textContent = "NOTIF";
        notificationButton.title = "Airport awareness notifications";
        const standButton = document.createElement("button");
        standButton.id = "twy-stand-button";
        standButton.className = "geofs-button";
        standButton.textContent = "STD";
        standButton.title = "Find a stand / gate";
        const mapButton = document.createElement("button");
        mapButton.id = "twy-map-button";
        mapButton.className = "geofs-button";
        mapButton.textContent = "MAP";
        mapButton.title = "Airport moving map";
        const extrasButton = document.createElement("button");
        extrasButton.id = "twy-extras-button";
        extrasButton.className = "geofs-button";
        extrasButton.textContent = "EXTRAS";
        extrasButton.title = "Optional ground physics adjustments";
        const standPanel = document.createElement("div");
        standPanel.id = "twy-stand-panel";
        standPanel.innerHTML = `\n            <div class="twy-title">Stand locator</div>\n\n            <div class="twy-stand-search-row">\n                <input\n                    id="twy-stand-input"\n                    type="text"\n                    autocomplete="off"\n                    spellcheck="false"\n                    placeholder="e.g. 224"\n                />\n                <button id="twy-stand-find">FIND</button>\n            </div>\n\n            <div id="twy-stand-locator-status">Load an airport first</div>\n\n            <div class="twy-row twy-stand-marshaller-row">\n                <div class="twy-label">Marshaller guidance</div>\n                <button id="twy-marshaller-toggle" class="twy-switch">\n                    <span class="twy-knob"></span>\n                </button>\n            </div>\n\n            <div class="twy-marshaller-offset-row">\n                <span class="twy-marshaller-offset-label">STOP OFFSET ±</span>\n\n                <div class="twy-marshaller-offset-controls">\n                    <button id="twy-marshaller-offset-minus">−</button>\n                    <span id="twy-marshaller-offset-value">12 m</span>\n                    <button id="twy-marshaller-offset-plus">+</button>\n                </div>\n            </div>\n\n            <button id="twy-stand-clear">CLEAR LOCATOR</button>\n        `;
        const standListButton = document.createElement("button");
        standListButton.id = "twy-stand-list-button";
        standListButton.type = "button";
        standListButton.textContent = "STAND LIST";
        standListButton.title = "Browse available stands";
        standPanel.querySelector("#twy-stand-locator-status")?.insertAdjacentElement("afterend", standListButton);
        const followMeRow = document.createElement("div");
        followMeRow.className = "twy-row twy-follow-me-row";
        followMeRow.innerHTML = `
            <div class="twy-label">Follow-me vehicle</div>
            <button id="twy-follow-me-toggle" class="twy-switch" aria-label="Toggle follow-me vehicle">
                <span class="twy-knob"></span>
            </button>
        `;
        const followMeStatus = document.createElement("div");
        followMeStatus.id = "twy-follow-me-status";
        followMeStatus.textContent = "Select a stand first";
        const followMeDistanceRow = document.createElement("div");
        followMeDistanceRow.className = "twy-follow-me-distance-row";
        followMeDistanceRow.innerHTML = `
            <span class="twy-follow-me-distance-label">Follow-me distance</span>
            <div class="twy-follow-me-distance-controls">
                <button id="twy-follow-me-distance-minus" type="button">−</button>
                <span id="twy-follow-me-distance-value">28 m</span>
                <button id="twy-follow-me-distance-plus" type="button">+</button>
            </div>
        `;
        const standClearButton = standPanel.querySelector("#twy-stand-clear");
        standPanel.insertBefore(followMeRow, standClearButton);
        standPanel.insertBefore(followMeDistanceRow, standClearButton);
        standPanel.insertBefore(followMeStatus, standClearButton);
        const panel = document.createElement("div");
        panel.id = "twy-panel";
        panel.innerHTML = `\n            <div class="twy-title">Airport ground</div>\n\n            <div class="twy-section">\n                <div class="twy-row">\n                    <div class="twy-label">Taxiway labels</div>\n                    <button id="twy-label-toggle" class="twy-switch">\n                        <span class="twy-knob"></span>\n                    </button>\n                </div>\n\n                <div class="twy-row">\n                    <div class="twy-label">Stand lead-in lines</div>\n                    <button id="twy-leadin-toggle" class="twy-switch">\n                        <span class="twy-knob"></span>\n                    </button>\n                </div>\n\n                <div class="twy-row">\n                    <div class="twy-label">Stand numbers</div>\n                    <button id="twy-stand-toggle" class="twy-switch">\n                        <span class="twy-knob"></span>\n                    </button>\n                </div>\n\n                <div class="twy-row">\n                    <div class="twy-label">Auto-load airports</div>\n                    <button id="twy-autoload-toggle" class="twy-switch">\n                        <span class="twy-knob"></span>\n                    </button>\n                </div>\n            </div>\n\n            <div id="twy-status">\n                <span id="twy-status-dot" class="twy-dot idle"></span>\n                <span id="twy-status-text">Ready</span>\n            </div>\n\n            <div class="twy-progress-bg">\n                <div id="twy-progress-fill"></div>\n            </div>\n\n            <div id="twy-details"></div>\n\n            <div id="twy-modify-arr-wrap">\n                <button id="twy-modify-arr-button">\n                    <span class="twy-modify-arr-title">MODIFY ARR</span>\n                    <span class="twy-modify-arr-safe">GUARDED</span>\n                </button>\n            </div>\n\n            <div class="twy-actions">\n                <button id="twy-load-button">Load airport</button>\n                <button id="twy-reset-button">Reset</button>\n            </div>\n        `;
        const extrasPanel = document.createElement("div");
        extrasPanel.id = "twy-extras-panel";
        extrasPanel.innerHTML = `
            <div class="twy-title">Extras</div>
            <div class="twy-section">
                <div class="twy-row">
                    <div class="twy-label">Ground Grip Physics</div>
                    <button id="twy-ground-handling-toggle" class="twy-switch" aria-label="Toggle ground grip physics">
                        <span class="twy-knob"></span>
                    </button>
                </div>
                <div id="twy-ground-handling-status">Speed 0 kt · Turn response 100%</div>
                <div class="twy-row twy-throttle-visualizer-row">
                    <div class="twy-label">Throttle visualizer</div>
                    <div class="twy-throttle-visualizer-controls">
                        <button id="twy-throttle-visualizer-toggle" class="twy-switch" aria-label="Toggle throttle visualizer">
                            <span class="twy-knob"></span>
                        </button>
                        <button id="twy-turn-aid-toggle" class="twy-turn-aid-button" type="button" aria-label="Toggle Turn Aid" aria-pressed="false">TURN
AID</button>
                    </div>
                </div>
            </div>
        `;
        dockButtons.append(notificationButton, menuButton, standButton, mapButton, extrasButton);
        root.append(edgeToggle, dockButtons, arrivalModeLabel, standPanel, panel, extrasPanel);
        const minimapWindow = document.createElement("div");
        minimapWindow.id = "twy-minimap-window";
        minimapWindow.innerHTML = `\n            <div id="twy-minimap-header">\n                <img id="twy-minimap-logo" src="${BRAND_LOGO}" alt="">\n\n                <div id="twy-minimap-controls">\n                    <button id="twy-minimap-lock" title="Map is following the aircraft">FOLLOW</button>\n                    <button id="twy-minimap-zoom-out" title="Zoom out">−</button>\n                    <span id="twy-minimap-range">0.7 NM</span>\n                    <button id="twy-minimap-zoom-in" title="Zoom in">+</button>\n                    <button id="twy-minimap-close" title="Close map">×</button>\n                </div>\n            </div>\n\n            <canvas id="twy-minimap-canvas"></canvas>\n        `;
        const minimapStatus = document.createElement("div");
        minimapStatus.id = "twy-minimap-status";
        minimapStatus.textContent = "Loaded ground data";
        minimapStatus.style.minHeight = "14px";
        minimapStatus.style.padding = "4px 7px 0";
        minimapStatus.style.color = "#858b90";
        minimapStatus.style.font = "700 7px Arial";
        minimapStatus.style.letterSpacing = ".2px";
        minimapStatus.style.textAlign = "center";
        minimapWindow.insertBefore(minimapStatus, minimapWindow.querySelector("#twy-minimap-canvas"));
        document.body.appendChild(minimapWindow);
        const notificationHost = document.createElement("div");
        notificationHost.id = "twy-notification-host";
        document.body.appendChild(notificationHost);
        const throttleVisualizerHud = document.createElement("div");
        throttleVisualizerHud.id = "twy-throttle-visualizer";
        throttleVisualizerHud.setAttribute("aria-hidden", "true");
        throttleVisualizerHud.innerHTML = `
            <div class="twy-throttle-visualizer-readout">
                <span class="twy-throttle-visualizer-caption">THR</span>
                <span id="twy-throttle-visualizer-mode">—</span>
                <span id="twy-throttle-visualizer-value">—</span>
            </div>
            <div class="twy-throttle-visualizer-track">
                <span id="twy-throttle-visualizer-fill"></span>
            </div>
        `;
        document.body.appendChild(throttleVisualizerHud);
        const arrivalChooserHost = document.createElement("div");
        arrivalChooserHost.id = "twy-arrival-host";
        document.body.appendChild(arrivalChooserHost);
        arrivalChooserHost.addEventListener("mousedown", startArrivalChooserDrag);
        document.addEventListener("mousemove", moveArrivalChooserDrag);
        document.addEventListener("mouseup", endArrivalChooserDrag);
        const standListWindow = document.createElement("div");
        standListWindow.id = "twy-stand-list-window";
        standListWindow.innerHTML = `
            <div class="twy-stand-list-header">
                <div class="twy-stand-list-title">Available stands</div>
                <button id="twy-stand-list-close" type="button" aria-label="Close stand list">×</button>
            </div>
            <div id="twy-stand-list-summary">No stand data loaded yet</div>
            <input id="twy-stand-list-search" type="text" autocomplete="off"
                   spellcheck="false" aria-label="Search available stands"
                   placeholder="Find a stand..." />
            <div id="twy-stand-list-body"></div>
        `;
        document.body.appendChild(standListWindow);
        standListWindow.addEventListener("click", event => event.stopPropagation());
        const geofsRight = document.querySelector(".geofs-ui-right");
        const pads = geofsRight?.querySelector(".geofs-pads-container");
        if (geofsRight) {
            if (pads) geofsRight.insertBefore(root, pads); else geofsRight.appendChild(root);
        } else {
            root.classList.add("fallback");
            document.body.appendChild(root);
        }
        state.root = root;
        state.panel = panel;
        state.extrasButton = extrasButton;
        state.extrasPanel = extrasPanel;
        state.groundHandlingToggle = extrasPanel.querySelector("#twy-ground-handling-toggle");
        state.groundHandlingStatus = extrasPanel.querySelector("#twy-ground-handling-status");
        state.throttleVisualizerToggle = extrasPanel.querySelector("#twy-throttle-visualizer-toggle");
        state.turnAidToggle = extrasPanel.querySelector("#twy-turn-aid-toggle");
        state.throttleVisualizerHud = throttleVisualizerHud;
        state.throttleVisualizerMode = throttleVisualizerHud.querySelector("#twy-throttle-visualizer-mode");
        state.throttleVisualizerValue = throttleVisualizerHud.querySelector("#twy-throttle-visualizer-value");
        state.throttleVisualizerFill = throttleVisualizerHud.querySelector("#twy-throttle-visualizer-fill");
        throttleVisualizerHud.title = "Drag to move throttle HUD";
        const throttleDragCapture = { capture: true, passive: false };
        window.addEventListener("pointerdown", startThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("pointermove", moveThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("pointerup", endThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("pointercancel", endThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("mousedown", startThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("mousemove", moveThrottleVisualizerDrag, throttleDragCapture);
        window.addEventListener("mouseup", endThrottleVisualizerDrag, throttleDragCapture);
        throttleVisualizerHud.addEventListener("click", event => event.stopPropagation());
        window.addEventListener("resize", restoreThrottleVisualizerPosition);
        restoreThrottleVisualizerPosition();
        state.menuButton = menuButton;
        state.standButton = standButton;
        state.standPanel = standPanel;
        state.standInput = standPanel.querySelector("#twy-stand-input");
        state.standFindButton = standPanel.querySelector("#twy-stand-find");
        state.standClearButton = standPanel.querySelector("#twy-stand-clear");
        state.standLocatorStatus = standPanel.querySelector("#twy-stand-locator-status");
        state.standListButton = standListButton;
        state.standListWindow = standListWindow;
        state.standListSummary = standListWindow.querySelector("#twy-stand-list-summary");
        state.standListSearchInput = standListWindow.querySelector("#twy-stand-list-search");
        state.standListBody = standListWindow.querySelector("#twy-stand-list-body");
        state.marshallerToggle = standPanel.querySelector("#twy-marshaller-toggle");
        state.marshallerOffsetValue = standPanel.querySelector("#twy-marshaller-offset-value");
        state.marshallerOffsetMinus = standPanel.querySelector("#twy-marshaller-offset-minus");
        state.marshallerOffsetPlus = standPanel.querySelector("#twy-marshaller-offset-plus");
        state.followMeToggle = standPanel.querySelector("#twy-follow-me-toggle");
        state.followMeStatus = standPanel.querySelector("#twy-follow-me-status");
        state.followMeDistanceMinus = standPanel.querySelector("#twy-follow-me-distance-minus");
        state.followMeDistanceValue = standPanel.querySelector("#twy-follow-me-distance-value");
        state.followMeDistancePlus = standPanel.querySelector("#twy-follow-me-distance-plus");
        state.minimapButton = mapButton;
        state.minimapWindow = minimapWindow;
        state.minimapCanvas = minimapWindow.querySelector("#twy-minimap-canvas");
        state.minimapStatusEl = minimapStatus;
        state.notificationButton = notificationButton;
        state.notificationHost = notificationHost;
        state.arrivalModeLabel = arrivalModeLabel;
        state.arrivalChooserHost = arrivalChooserHost;
        state.statusEl = document.getElementById("twy-status-text");
        state.statusDot = document.getElementById("twy-status-dot");
        state.detailsEl = document.getElementById("twy-details");
        state.progressFill = document.getElementById("twy-progress-fill");
        state.loadButton = document.getElementById("twy-load-button");
        state.resetButton = document.getElementById("twy-reset-button");
        state.taxiLabelToggle = document.getElementById("twy-label-toggle");
        state.standNumberToggle = document.getElementById("twy-stand-toggle");
        state.standLeadInToggle = document.getElementById("twy-leadin-toggle");
        state.autoLoadToggle = document.getElementById("twy-autoload-toggle");
        state.modifyArrivalWrap = document.getElementById("twy-modify-arr-wrap");
        state.modifyArrivalButton = document.getElementById("twy-modify-arr-button");
        mapButton.onclick = event => {
            event.stopPropagation();
            toggleMinimap();
        };
        minimapWindow.querySelector("#twy-minimap-close")?.addEventListener("click", event => {
            event.stopPropagation();
            setMinimapOpen(false);
        });
        minimapWindow.querySelector("#twy-minimap-zoom-in")?.addEventListener("click", event => {
            event.stopPropagation();
            minimapZoomIn();
        });
        minimapWindow.querySelector("#twy-minimap-zoom-out")?.addEventListener("click", event => {
            event.stopPropagation();
            minimapZoomOut();
        });
        minimapWindow.querySelector("#twy-minimap-lock")?.addEventListener("click", event => {
            event.stopPropagation();
            toggleMinimapPanLock();
        });
        minimapWindow.querySelector("#twy-minimap-header")?.addEventListener("mousedown", startMinimapDrag);
        state.minimapCanvas?.addEventListener("mousedown", startMinimapCanvasPan);
        document.addEventListener("mousemove", event => {
            moveMinimapDrag(event);
            moveMinimapCanvasPan(event);
        });
        document.addEventListener("mouseup", () => {
            endMinimapDrag();
            endMinimapCanvasPan();
        });
        restoreMinimapPosition();
        updateMinimapControls();
        updateMinimapAvailability();
        setMinimapOpen(state.minimapOpen);
        const setDockOpen = open => {
            const next = !!open;
            root.classList.toggle("dock-open", next);
            const label = next ? "Close Immersive Airports controls" : "Open Immersive Airports controls";
            edgeToggle.title = label;
            edgeToggle.setAttribute("aria-label", label);
            localStorage.setItem("geofsGroundV485DockOpen", String(next));
            if (!next) {
                panel.classList.remove("open");
                menuButton.classList.remove("active");
                standPanel.classList.remove("open");
                standButton.classList.remove("active");
                setStandListOpen(false);
                extrasPanel.classList.remove("open");
                extrasButton.classList.remove("active");
                closeArrivalChooser();
            }
        };
        edgeToggle.onclick = event => {
            event.stopPropagation();
            if (state.arrivalModeCueTimer) {
                clearTimeout(state.arrivalModeCueTimer);
                state.arrivalModeCueTimer = null;
                state.arrivalModeLabel?.classList.remove("show");
                root.classList.remove("arrival-cue");
            }
            setDockOpen(!root.classList.contains("dock-open"));
        };
        setDockOpen(localStorage.getItem("geofsGroundV485DockOpen") === "true");
        menuButton.onclick = event => {
            event.stopPropagation();
            standPanel.classList.remove("open");
            standButton.classList.remove("active");
            setStandListOpen(false);
            extrasPanel.classList.remove("open");
            extrasButton.classList.remove("active");
            if (state.arrivalMode) {
                panel.classList.remove("open");
                menuButton.classList.remove("active");
                openArrivalChooser();
                return;
            }
            closeArrivalChooser();
            const open = panel.classList.toggle("open");
            menuButton.classList.toggle("active", open);
        };
        standButton.onclick = event => {
            event.stopPropagation();
            panel.classList.remove("open");
            menuButton.classList.remove("active");
            extrasPanel.classList.remove("open");
            extrasButton.classList.remove("active");
            const open = standPanel.classList.toggle("open");
            standButton.classList.toggle("active", open);
            if (open) {
                updateStandLocatorStatus();
                renderStandList();
                setTimeout(() => {
                    state.standInput?.focus();
                    state.standInput?.select();
                }, 0);
            }
        };
        extrasButton.onclick = event => {
            event.stopPropagation();
            panel.classList.remove("open");
            menuButton.classList.remove("active");
            standPanel.classList.remove("open");
            standButton.classList.remove("active");
            setStandListOpen(false);
            closeArrivalChooser();
            const open = extrasPanel.classList.toggle("open");
            extrasButton.classList.toggle("active", open);
        };
        notificationButton.onclick = event => {
            event.stopPropagation();
            toggleNotifications();
        };
        document.addEventListener("click", event => {
            if (!root.contains(event.target)) {
                panel.classList.remove("open");
                menuButton.classList.remove("active");
                standPanel.classList.remove("open");
                standButton.classList.remove("active");
                setStandListOpen(false);
                extrasPanel.classList.remove("open");
                extrasButton.classList.remove("active");
            }
        });
        state.groundHandlingToggle.onclick = event => {
            event.stopPropagation();
            toggleGroundHandling();
        };
        state.throttleVisualizerToggle.onclick = event => {
            event.stopPropagation();
            toggleThrottleVisualizer();
        };
        state.turnAidToggle.onclick = event => {
            event.stopPropagation();
            toggleTurnAid();
        };
        state.taxiLabelToggle.onclick = event => {
            event.stopPropagation();
            toggleTaxiwayLabels();
        };
        state.standLeadInToggle.onclick = event => {
            event.stopPropagation();
            toggleStandLeadIns();
        };
        state.standNumberToggle.onclick = event => {
            event.stopPropagation();
            toggleStandNumbers();
        };
        state.autoLoadToggle.onclick = event => {
            event.stopPropagation();
            toggleAutoLoad();
        };
        state.standFindButton.onclick = event => {
            event.stopPropagation();
            selectStand(state.standInput.value);
        };
        state.standListButton.onclick = event => {
            event.stopPropagation();
            setStandListOpen(!state.standListWindow?.classList.contains("open"));
        };
        standListWindow.querySelector("#twy-stand-list-close").onclick = event => {
            event.stopPropagation();
            setStandListOpen(false);
        };
        state.standListSearchInput.addEventListener("input", event => {
            event.stopPropagation();
            state.standListBody.scrollTop = 0;
            renderStandList();
        });
        state.standListSearchInput.addEventListener("keydown", event => {
            event.stopPropagation();
            if (event.key === "Escape") {
                event.preventDefault();
                if (state.standListSearchInput.value) {
                    state.standListSearchInput.value = "";
                    renderStandList();
                } else {
                    setStandListOpen(false);
                }
            }
        });
        state.standListSearchInput.addEventListener("keyup", event => event.stopPropagation());
        state.standClearButton.onclick = event => {
            event.stopPropagation();
            clearStandSelection();
        };
        state.marshallerToggle.onclick = event => {
            event.stopPropagation();
            toggleMarshaller();
        };
        state.followMeToggle.onclick = event => {
            event.stopPropagation();
            toggleFollowMe();
        };
        state.followMeDistanceMinus.onclick = event => {
            event.stopPropagation();
            adjustFollowMeDistance(-CFG.followMeLeadDistanceStepM);
        };
        state.followMeDistancePlus.onclick = event => {
            event.stopPropagation();
            adjustFollowMeDistance(CFG.followMeLeadDistanceStepM);
        };
        state.marshallerOffsetMinus.onclick = event => {
            event.stopPropagation();
            adjustMarshallerStopOffset(-CFG.marshallerStopOffsetStepM);
        };
        state.marshallerOffsetPlus.onclick = event => {
            event.stopPropagation();
            adjustMarshallerStopOffset(CFG.marshallerStopOffsetStepM);
        };
        updateMarshallerOffsetUI();
        updateFollowMeDistanceUI();
        state.standInput.onclick = event => {
            event.stopPropagation();
        };
        state.standInput.onkeydown = event => {
            event.stopPropagation();
            if (event.key === "Enter") {
                event.preventDefault();
                selectStand(state.standInput.value);
            }
            if (event.key === "Escape") {
                standPanel.classList.remove("open");
                standButton.classList.remove("active");
            }
        };
        state.modifyArrivalButton.onclick = event => {
            event.stopPropagation();
            handleModifyArrivalPress();
        };
        state.loadButton.onclick = event => {
            event.stopPropagation();
            loadAirport();
        };
        state.resetButton.onclick = event => {
            event.stopPropagation();
            resetAirport();
        };
        updateStandLocatorStatus();
        updateUI();
    }
    function fpe(num) {
        return Number(num.toFixed(3));
    }
    function makeChunks(center) {
        const chunks = [];
        const cs = CFG.chunkSize;
        const baseLat = Math.floor(center.lat / cs) * cs;
        const baseLon = Math.floor(center.lon / cs) * cs;
        for (let v = -CFG.gridRadius; v <= CFG.gridRadius; v++) {
            for (let h = -CFG.gridRadius; h <= CFG.gridRadius; h++) {
                chunks.push({
                    south: fpe(baseLat + v * cs),
                    west: fpe(baseLon + h * cs),
                    north: fpe(baseLat + (v + 1) * cs),
                    east: fpe(baseLon + (h + 1) * cs)
                });
            }
        }
        chunks.sort((a, b) => {
            const aLat = (a.south + a.north) / 2;
            const aLon = (a.west + a.east) / 2;
            const bLat = (b.south + b.north) / 2;
            const bLon = (b.west + b.east) / 2;
            const da = (aLat - center.lat) ** 2 + (aLon - center.lon) ** 2;
            const db = (bLat - center.lat) ** 2 + (bLon - center.lon) ** 2;
            return da - db;
        });
        return chunks.map((chunk, index) => ({
            ...chunk,
            index: index,
            key: chunkKey(chunk)
        }));
    }
    function chunkKey(chunk) {
        return `${chunk.south}_${chunk.west}_${chunk.north}_${chunk.east}`;
    }
    function gridSignature(chunks) {
        return chunks.map(c => c.key).join("|");
    }
    function getOverallBounds(chunks) {
        return {
            south: Math.min(...chunks.map(c => c.south)),
            west: Math.min(...chunks.map(c => c.west)),
            north: Math.max(...chunks.map(c => c.north)),
            east: Math.max(...chunks.map(c => c.east))
        };
    }
    function cacheKey(chunk) {
        return CFG.cachePrefix + chunk.key;
    }
    function loadChunkCache(chunk) {
        if (!CFG.cacheEnabled) return null;
        try {
            const raw = localStorage.getItem(cacheKey(chunk));
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.dataset) return null;
            if (Date.now() - data.time > CFG.cacheLifetimeMs) {
                localStorage.removeItem(cacheKey(chunk));
                return null;
            }
            return data.dataset;
        } catch (_) {
            return null;
        }
    }
    function saveChunkCache(chunk, dataset) {
        if (!CFG.cacheEnabled) return;
        try {
            localStorage.setItem(cacheKey(chunk), JSON.stringify({
                time: Date.now(),
                dataset: dataset
            }));
        } catch (_) {}
    }
    function clearGroundCache() {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (key.startsWith("geofsGroundChunk_") || key.startsWith("geofsTwyChunk_") || key.startsWith("geofsGround_v") || key.startsWith("geofsTwy_v")) {
                localStorage.removeItem(key);
            }
        }
    }
    function featureKey(feature) {
        return `${feature.osmType}:${feature.id}`;
    }
    function mergeFeatureList(targetMap, list) {
        let added = 0;
        for (const feature of list || []) {
            if (!feature) continue;
            const key = featureKey(feature);
            if (!targetMap.has(key)) {
                targetMap.set(key, feature);
                added++;
            }
        }
        return added;
    }
    function mergeDataset(chunk, dataset) {
        state.chunkData.set(chunk.key, dataset);
        let added = 0;
        added += mergeFeatureList(state.taxiways, dataset.taxiways);
        added += mergeFeatureList(state.taxilanes, dataset.taxilanes);
        added += mergeFeatureList(state.holdings, dataset.holdings);
        added += mergeFeatureList(state.parking, dataset.parking);
        added += mergeFeatureList(state.runways, dataset.runways);
        added += mergeFeatureList(state.aprons, dataset.aprons);
        updateUI();
        if (state.standListWindow?.classList.contains("open")) renderStandList();
        return added;
    }
    function clearRuntimeData() {
        state.taxiways = new Map;
        state.taxilanes = new Map;
        state.holdings = new Map;
        state.parking = new Map;
        state.runways = new Map;
        state.aprons = new Map;
        state.chunkData = new Map;
    }
    class HttpError extends Error {
        constructor(status, message) {
            super(message || `HTTP ${status}`);
            this.name = "HttpError";
            this.status = status;
        }
    }
    function classifyCooldown(error) {
        if (error?.name === "AbortError") return CFG.cooldownTimeoutMs;
        if (error instanceof HttpError && error.status === 429) return CFG.cooldown429Ms;
        if (error instanceof HttpError && error.status >= 500) return CFG.cooldownServerErrorMs;
        return CFG.cooldownOtherMs;
    }
    function markServerSuccess(index) {
        const health = state.serverHealth[index];
        health.cooldownUntil = 0;
        health.failures = 0;
        health.successes++;
        state.preferredServerIndex = index;
    }
    function markServerFailure(index, error) {
        const health = state.serverHealth[index];
        health.failures++;
        health.cooldownUntil = Date.now() + classifyCooldown(error);
    }
    function serverOrder() {
        const now = Date.now();
        const indices = OVERPASS_SERVERS.map((_, index) => index);
        indices.sort((a, b) => {
            const aPreferred = a === state.preferredServerIndex ? 0 : 1;
            const bPreferred = b === state.preferredServerIndex ? 0 : 1;
            const aCooling = state.serverHealth[a].cooldownUntil > now ? 1 : 0;
            const bCooling = state.serverHealth[b].cooldownUntil > now ? 1 : 0;
            if (aCooling !== bCooling) return aCooling - bCooling;
            if (aPreferred !== bPreferred) return aPreferred - bPreferred;
            return state.serverHealth[a].cooldownUntil - state.serverHealth[b].cooldownUntil;
        });
        return indices;
    }
    function waitForRequestGate() {
        const task = state.requestGate.then(async () => {
            const now = Date.now();
            const wait = Math.max(0, CFG.requestSpacingMs - (now - state.lastRequestStart));
            if (wait > 0) await sleep(wait);
            state.lastRequestStart = Date.now();
        });
        state.requestGate = task.catch(() => {});
        return task;
    }
    function cleanRef(raw) {
        if (typeof raw !== "string") return null;
        return raw.trim() || null;
    }
    function buildChunkQuery(chunk) {
        const bbox = `${fpe(chunk.south)},${fpe(chunk.west)},${fpe(chunk.north)},${fpe(chunk.east)}`;
        return `\n[out:json][timeout:15];\n(\n    way["aeroway"="taxiway"](${bbox});\n    way["aeroway"="taxilane"](${bbox});\n\n    way["aeroway"="holding_position"](${bbox});\n    node["aeroway"="holding_position"](${bbox});\n\n    way["aeroway"="parking_position"](${bbox});\n    node["aeroway"="parking_position"](${bbox});\n\n    way["aeroway"="apron"](${bbox});\n    way["aeroway"="runway"](${bbox});\n);\nout body;\n>;\nout skel qt;\n`;
    }
    function parseDataset(data, chunk) {
        const nodes = new Map;
        for (const element of data.elements || []) {
            if (element.type === "node" && Number.isFinite(Number(element.lat)) && Number.isFinite(Number(element.lon))) {
                nodes.set(element.id, element);
            }
        }
        const dataset = {
            taxiways: [],
            taxilanes: [],
            holdings: [],
            parking: [],
            runways: [],
            aprons: []
        };
        for (const element of data.elements || []) {
            if (element.type !== "node" || !element.tags) continue;
            const aeroway = element.tags.aeroway;
            if (aeroway !== "holding_position" && aeroway !== "parking_position") continue;
            const lat = Number(element.lat);
            const lon = Number(element.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
            const feature = {
                id: element.id,
                osmType: "node",
                chunkKey: chunk.key,
                point: {
                    lat: lat,
                    lon: lon
                },
                tags: element.tags,
                ref: cleanRef(element.tags.ref)
            };
            if (aeroway === "holding_position") {
                feature.holdType = cleanRef(element.tags["holding_position:type"]);
                dataset.holdings.push(feature);
            } else {
                dataset.parking.push(feature);
            }
        }
        for (const element of data.elements || []) {
            if (element.type !== "way" || !Array.isArray(element.nodes) || !element.tags) continue;
            const points = element.nodes.map(nodeId => nodes.get(nodeId)).filter(Boolean).map(node => ({
                lat: Number(node.lat),
                lon: Number(node.lon)
            })).filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lon));
            if (points.length < 2) continue;
            const feature = {
                id: element.id,
                osmType: "way",
                chunkKey: chunk.key,
                points: points,
                tags: element.tags,
                ref: cleanRef(element.tags.ref)
            };
            switch (element.tags.aeroway) {
              case "taxiway":
                dataset.taxiways.push(feature);
                break;

              case "taxilane":
                dataset.taxilanes.push(feature);
                break;

              case "holding_position":
                feature.holdType = cleanRef(element.tags["holding_position:type"]);
                dataset.holdings.push(feature);
                break;

              case "parking_position":
                dataset.parking.push(feature);
                break;

              case "runway":
                dataset.runways.push(feature);
                break;

              case "apron":
                if (points.length >= 3) {
                    dataset.aprons.push(feature);
                }
                break;
            }
        }
        return dataset;
    }
    async function requestChunk(chunk, serverIndex, generation, prefetch = null) {
        await waitForRequestGate();
        if (generation !== state.loadGeneration || prefetch && !flightPlanArrivalCurrent(prefetch)) {
            throw new Error("Cancelled");
        }
        const controller = new AbortController;
        state.controllers.add(controller);
        if (prefetch) prefetch.controller = controller;
        state.activeRequests++;
        updateUI();
        const timeout = setTimeout(() => controller.abort(), CFG.requestTimeoutMs);
        try {
            const serverUrl = OVERPASS_SERVERS[serverIndex];
            console.log("[TWY] Request", {
                chunk: chunk.index + 1,
                server: serverIndex + 1,
                url: serverUrl
            });
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: "data=" + encodeURIComponent(buildChunkQuery(chunk)),
                signal: controller.signal
            });
            if (!response.ok) {
                throw new HttpError(response.status);
            }
            const data = await response.json();
            if (generation !== state.loadGeneration || prefetch && !flightPlanArrivalCurrent(prefetch)) throw new Error("Cancelled");
            if (prefetch && data.remark) throw new Error(data.remark);
            const dataset = parseDataset(data, chunk);
            return dataset;
        } finally {
            clearTimeout(timeout);
            state.controllers.delete(controller);
            if (prefetch?.controller === controller) prefetch.controller = null;
            state.activeRequests = Math.max(0, state.activeRequests - 1);
            updateUI();
        }
    }
    function maybeRequestStagedRender() {
        if (!state.earlyPreviewRequested && state.successfulChunks >= 1) {
            state.earlyPreviewRequested = true;
            requestRender(1, CFG.previewDelayMs);
        }
        if (!state.midPreviewRequested && state.completedChunks >= 5) {
            state.midPreviewRequested = true;
            requestRender(1, CFG.previewDelayMs);
        }
    }
    async function processChunk(chunk, generation, options = {}) {
        if (generation !== state.loadGeneration) return false;
        const retryMode = !!options.retryMode;
        const cached = options.prefetchedChunks?.get(chunk.key) || loadChunkCache(chunk);
        if (cached) {
            if (generation !== state.loadGeneration) return false;
            mergeDataset(chunk, cached);
            if (retryMode) {
                if (state.failedChunkKeys.delete(chunk.key)) {
                    state.failedChunks = Math.max(0, state.failedChunks - 1);
                    state.successfulChunks++;
                }
            } else {
                state.cachedChunks++;
                state.successfulChunks++;
                state.completedChunks++;
            }
            maybeRequestStagedRender();
            updateUI();
            return true;
        }
        const order = serverOrder();
        let lastError = null;
        for (let attempt = 0; attempt < order.length; attempt++) {
            if (generation !== state.loadGeneration) return false;
            const serverIndex = order[attempt];
            const health = state.serverHealth[serverIndex];
            const now = Date.now();
            const allCooling = order.every(index => state.serverHealth[index].cooldownUntil > now);
            if (!allCooling && health.cooldownUntil > now) continue;
            if (attempt > 0) {
                const delay = CFG.retryDelaysMs[Math.min(attempt - 1, CFG.retryDelaysMs.length - 1)] || 1200;
                setStatus(retryMode ? `Recovering area ${chunk.index + 1}: switching server…` : `Area ${chunk.index + 1}: switching server…`, "loading");
                await sleep(delay);
            }
            try {
                const dataset = await requestChunk(chunk, serverIndex, generation);
                if (generation !== state.loadGeneration) return false;
                markServerSuccess(serverIndex);
                saveChunkCache(chunk, dataset);
                mergeDataset(chunk, dataset);
                if (retryMode) {
                    if (state.failedChunkKeys.delete(chunk.key)) {
                        state.failedChunks = Math.max(0, state.failedChunks - 1);
                        state.successfulChunks++;
                    }
                } else {
                    state.successfulChunks++;
                    state.completedChunks++;
                }
                maybeRequestStagedRender();
                updateUI();
                return true;
            } catch (error) {
                lastError = error;
                if (generation !== state.loadGeneration) return false;
                if (String(error?.message) === "Cancelled") return false;
                markServerFailure(serverIndex, error);
                console.warn(retryMode ? "[TWY RETRY] Chunk/server failure" : "[TWY] Chunk/server failure", {
                    area: chunk.index + 1,
                    server: serverIndex + 1,
                    error: error
                });
            }
        }
        console.warn(retryMode ? "[TWY RETRY] Area still unavailable" : "[TWY] Area unavailable after failover", chunk.index + 1, lastError);
        if (!retryMode) {
            state.failedChunkKeys.add(chunk.key);
            state.failedChunks++;
            state.completedChunks++;
            maybeRequestStagedRender();
        }
        updateUI();
        return false;
    }
    async function runQueue(chunks, generation, options = {}) {
        let nextIndex = 0;
        const concurrency = Math.max(1, Number.isFinite(options.concurrency) ? Math.floor(options.concurrency) : CFG.maxConcurrentRequests);
        async function worker() {
            while (generation === state.loadGeneration) {
                const index = nextIndex++;
                if (index >= chunks.length) return;
                await processChunk(chunks[index], generation, options);
            }
        }
        const count = Math.min(concurrency, chunks.length);
        await Promise.all(Array.from({
            length: count
        }, () => worker()));
    }
    function failedChunksForCurrentLoad() {
        if (!state.failedChunkKeys.size) return [];
        return state.chunks.filter(chunk => state.failedChunkKeys.has(chunk.key));
    }
    async function recoverFailedChunks(generation) {
        if (!state.failedChunkKeys.size) return;
        for (let pass = 1; pass <= CFG.autoChunkRetryPasses; pass++) {
            if (generation !== state.loadGeneration) return;
            const failed = failedChunksForCurrentLoad();
            if (!failed.length) return;
            const delay = CFG.autoChunkRetryDelaysMs[Math.min(pass - 1, CFG.autoChunkRetryDelaysMs.length - 1)] || 2500;
            setStatus(`Recovering ${failed.length} missing area${failed.length === 1 ? "" : "s"} · pass ${pass}/${CFG.autoChunkRetryPasses}`, "loading");
            updateUI();
            await sleep(delay);
            if (generation !== state.loadGeneration) return;
            console.log(`[TWY RETRY] Starting recovery pass ${pass}`, failed.map(chunk => chunk.index + 1));
            await runQueue(failed, generation, {
                retryMode: true,
                concurrency: CFG.autoChunkRetryConcurrency
            });
            if (generation !== state.loadGeneration) return;
            if (state.failedChunkKeys.size < failed.length && (state.taxiways.size || state.taxilanes.size)) {
                requestRender(1, 80);
            }
        }
    }
    function parseWidthMeters(raw) {
        if (raw === undefined || raw === null) return null;
        const match = String(raw).replace(",", ".").match(/\d+(?:\.\d+)?/);
        if (!match) return null;
        const value = Number(match[0]);
        return Number.isFinite(value) && value > 0 ? value : null;
    }
    function addPointToBounds(point, bounds) {
        if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lon)) return;
        bounds.south = Math.min(bounds.south, point.lat);
        bounds.north = Math.max(bounds.north, point.lat);
        bounds.west = Math.min(bounds.west, point.lon);
        bounds.east = Math.max(bounds.east, point.lon);
    }
    function computeTightBounds() {
        const bounds = {
            south: Infinity,
            west: Infinity,
            north: -Infinity,
            east: -Infinity
        };
        for (const map of [ state.taxiways, state.taxilanes, state.holdings, state.parking ]) {
            for (const feature of map.values()) {
                if (feature.point) addPointToBounds(feature.point, bounds);
                for (const point of feature.points || []) addPointToBounds(point, bounds);
            }
        }
        if (!Number.isFinite(bounds.south)) return state.queryBounds;
        const middleLat = (bounds.south + bounds.north) / 2;
        const cosLat = Math.max(.2, Math.cos(middleLat * Math.PI / 180));
        const padLat = CFG.imageryPaddingM / 111320;
        const padLon = CFG.imageryPaddingM / (111320 * cosLat);
        return {
            south: bounds.south - padLat,
            west: bounds.west - padLon,
            north: bounds.north + padLat,
            east: bounds.east + padLon
        };
    }
    function nearestPointOnSegment(p, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len2 = dx * dx + dy * dy;
        if (len2 <= 1e-8) {
            return {
                x: a.x,
                y: a.y,
                distance: Math.hypot(p.x - a.x, p.y - a.y)
            };
        }
        const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / len2, 0, 1);
        const x = a.x + dx * t;
        const y = a.y + dy * t;
        return {
            x: x,
            y: y,
            distance: Math.hypot(p.x - x, p.y - y)
        };
    }
    function nearestPathSegment(pointPx, features, toPixel) {
        let best = null;
        for (const feature of features) {
            const points = feature.points || [];
            for (let i = 1; i < points.length; i++) {
                const a = toPixel(points[i - 1]);
                const b = toPixel(points[i]);
                const nearest = nearestPointOnSegment(pointPx, a, b);
                if (!best || nearest.distance < best.distance) {
                    best = {
                        ...nearest,
                        feature: feature,
                        angle: Math.atan2(b.y - a.y, b.x - a.x)
                    };
                }
            }
        }
        return best;
    }
    function midpointOfPath(points, toPixel) {
        const pixelPoints = points.map(toPixel);
        if (pixelPoints.length < 2) return null;
        let total = 0;
        const lengths = [];
        for (let i = 1; i < pixelPoints.length; i++) {
            const length = Math.hypot(pixelPoints[i].x - pixelPoints[i - 1].x, pixelPoints[i].y - pixelPoints[i - 1].y);
            lengths.push(length);
            total += length;
        }
        if (total <= 1e-6) return null;
        const target = total / 2;
        let travelled = 0;
        for (let i = 1; i < pixelPoints.length; i++) {
            const segment = lengths[i - 1];
            if (travelled + segment >= target) {
                const a = pixelPoints[i - 1];
                const b = pixelPoints[i];
                const t = (target - travelled) / segment;
                return {
                    x: a.x + (b.x - a.x) * t,
                    y: a.y + (b.y - a.y) * t,
                    angle: Math.atan2(b.y - a.y, b.x - a.x)
                };
            }
            travelled += segment;
        }
        return null;
    }
    function featuresForChunk(chunkKey, type) {
        const data = state.chunkData.get(chunkKey);
        if (!data) return [];
        if (type === "movement") return [ ...data.taxiways, ...data.taxilanes ];
        if (type === "runways") return data.runways;
        return [];
    }
    function localMeters(origin, point) {
        const latScale = 111320;
        const lonScale = 111320 * Math.max(.15, Math.cos(origin.lat * Math.PI / 180));
        return {
            x: (point.lon - origin.lon) * lonScale,
            y: (point.lat - origin.lat) * latScale
        };
    }
    function geoDistanceMeters(a, b) {
        const p = localMeters(a, b);
        return Math.hypot(p.x, p.y);
    }
    function bearingDegrees(a, b) {
        const lat1 = a.lat * Math.PI / 180;
        const lat2 = b.lat * Math.PI / 180;
        const dLon = (b.lon - a.lon) * Math.PI / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        let deg = Math.atan2(y, x) * 180 / Math.PI;
        if (deg < 0) deg += 360;
        return deg;
    }
    function pointSegmentDistanceMeters(origin, aGeo, bGeo) {
        const a = localMeters(origin, aGeo);
        const b = localMeters(origin, bGeo);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len2 = dx * dx + dy * dy;
        if (len2 <= 1e-9) return Math.hypot(a.x, a.y);
        const t = clamp(-(a.x * dx + a.y * dy) / len2, 0, 1);
        const x = a.x + dx * t;
        const y = a.y + dy * t;
        return Math.hypot(x, y);
    }
    function featureDistanceMeters(origin, feature) {
        if (feature.point) {
            return geoDistanceMeters(origin, feature.point);
        }
        const points = feature.points || [];
        if (points.length === 0) return Infinity;
        if (points.length === 1) return geoDistanceMeters(origin, points[0]);
        let best = Infinity;
        for (let i = 1; i < points.length; i++) {
            const d = pointSegmentDistanceMeters(origin, points[i - 1], points[i]);
            if (d < best) best = d;
        }
        return best;
    }
    function featureRepresentativePoint(feature) {
        if (feature.point) return feature.point;
        const points = feature.points || [];
        if (!points.length) return null;
        return points[Math.floor((points.length - 1) / 2)];
    }
    function distanceToMovementNetwork(point, collections = [ state.taxilanes, state.taxiways ]) {
        if (!point) return Infinity;
        let best = Infinity;
        const latPad = 180 / 111320;
        const lonPad = 180 / (111320 * Math.max(.15, Math.cos(point.lat * Math.PI / 180)));
        for (const collection of collections) {
            for (const movement of collection.values()) {
                const points = movement.points || [];
                for (let i = 1; i < points.length; i++) {
                    const a = points[i - 1];
                    const b = points[i];
                    if (point.lat < Math.min(a.lat, b.lat) - latPad || point.lat > Math.max(a.lat, b.lat) + latPad || point.lon < Math.min(a.lon, b.lon) - lonPad || point.lon > Math.max(a.lon, b.lon) + lonPad) {
                        continue;
                    }
                    const distance = pointSegmentDistanceMeters(point, a, b);
                    if (distance < best) best = distance;
                    if (best < .25) return best;
                }
            }
        }
        return best;
    }
    function parkingTargetPoint(feature) {
        if (feature.point) return feature.point;
        const points = feature.points || [];
        if (!points.length) return null;
        if (points.length === 1) return points[0];
        const stamp = `${state.loadGeneration}:${state.completedChunks}:${state.taxiways.size}:${state.taxilanes.size}`;
        if (feature.parkingTargetStamp === stamp && feature.parkingTargetPoint) {
            return feature.parkingTargetPoint;
        }
        const first = points[0];
        const last = points[points.length - 1];
        const firstDistance = distanceToMovementNetwork(first);
        const lastDistance = distanceToMovementNetwork(last);
        let target = last;
        if (Number.isFinite(firstDistance) && Number.isFinite(lastDistance) && Math.abs(firstDistance - lastDistance) > 1.5) {
            target = firstDistance > lastDistance ? first : last;
        } else if (Number.isFinite(firstDistance) !== Number.isFinite(lastDistance)) {
            target = Number.isFinite(firstDistance) ? last : first;
        }
        feature.parkingTargetStamp = stamp;
        feature.parkingTargetPoint = target;
        return target;
    }
    function updateFollowMeStatus() {
        const element = state.followMeStatus;
        if (!element) return;
        const followMe = state.followMe;
        let text = "Select a stand first";
        let mode = "";
        if (!followMe.enabled) {
            text = "Off";
        } else if (followMe.statusMessage) {
            text = followMe.statusMessage;
            mode = followMe.routeStatus === "error" ? "error" : followMe.routeStatus === "active" || followMe.routeStatus === "arrived" ? "active" : "";
        } else if (!state.standLocator.selectedTarget) {
            text = "Select a stand first";
        } else if (followMe.routeStatus === "building") {
            text = "Building taxi route…";
        } else if (followMe.routeStatus === "active") {
            text = `Guiding to ${state.standLocator.selectedRef || "stand"}`;
            mode = "active";
        } else if (followMe.routeStatus === "arrived") {
            text = `Arrived at ${state.standLocator.selectedRef || "stand"}`;
            mode = "active";
        } else if (!followMeRoutingDataset()) {
            text = state.minimapAirportLoading || state.running ? "Waiting for airport taxiway data" : "Airport taxiway data unavailable";
            mode = state.minimapAirportLoading || state.running ? "" : "error";
        } else if (!state.minimapAirportReady) {
            text = "Using loaded airport data";
        } else {
            text = "Enter a taxiway to activate";
        }
        if (element.textContent !== text) element.textContent = text;
        if (element.dataset.mode !== mode) element.dataset.mode = mode;
    }
    function setFollowMeStatus(status, message = "") {
        state.followMe.routeStatus = status;
        state.followMe.statusMessage = message;
        updateFollowMeStatus();
    }
    function followMePointKey(point) {
        return `${Math.round(point.lat * 1e5)}_${Math.round(point.lon * 1e5)}`;
    }
    function followMeProjectGeoPoint(point, a, b) {
        const aLocal = localMeters(point, a);
        const bLocal = localMeters(point, b);
        const dx = bLocal.x - aLocal.x;
        const dy = bLocal.y - aLocal.y;
        const len2 = dx * dx + dy * dy;
        const t = len2 <= 1e-9 ? 0 : clamp(-(aLocal.x * dx + aLocal.y * dy) / len2, 0, 1);
        const x = aLocal.x + dx * t;
        const y = aLocal.y + dy * t;
        const lonScale = 111320 * Math.max(.15, Math.cos(point.lat * Math.PI / 180));
        return {
            point: {
                lat: point.lat + y / 111320,
                lon: point.lon + x / lonScale
            },
            t: t,
            distance: Math.hypot(x, y)
        };
    }
    const FOLLOW_ME_INDEX_CELL_DEG = .002;
    function followMeIndexCell(point) {
        return {
            lat: Math.floor(point.lat / FOLLOW_ME_INDEX_CELL_DEG),
            lon: Math.floor(point.lon / FOLLOW_ME_INDEX_CELL_DEG)
        };
    }
    function followMeIndexCellKey(lat, lon) {
        return `${lat}:${lon}`;
    }
    function followMeBuildSegmentIndex(segments) {
        const cells = new Map;
        for (const segment of segments || []) {
            const minLat = Math.min(segment.aPoint.lat, segment.bPoint.lat);
            const maxLat = Math.max(segment.aPoint.lat, segment.bPoint.lat);
            const minLon = Math.min(segment.aPoint.lon, segment.bPoint.lon);
            const maxLon = Math.max(segment.aPoint.lon, segment.bPoint.lon);
            const minCell = followMeIndexCell({ lat: minLat, lon: minLon });
            const maxCell = followMeIndexCell({ lat: maxLat, lon: maxLon });
            for (let lat = minCell.lat; lat <= maxCell.lat; lat++) {
                for (let lon = minCell.lon; lon <= maxCell.lon; lon++) {
                    const key = followMeIndexCellKey(lat, lon);
                    let bucket = cells.get(key);
                    if (!bucket) {
                        bucket = [];
                        cells.set(key, bucket);
                    }
                    bucket.push(segment);
                }
            }
        }
        return {
            cells: cells,
            cellCount: cells.size
        };
    }
    function followMeNearestIndexedSegment(point, index, searchRadiusM = CFG.followMeGraphSearchRadiusM) {
        if (!point || !index?.cells?.size) return null;
        const center = followMeIndexCell(point);
        const radiusM = Number.isFinite(searchRadiusM) ? Math.max(0, searchRadiusM) : CFG.followMeGraphSearchRadiusM;
        const latCellM = FOLLOW_ME_INDEX_CELL_DEG * 111320;
        const lonCellM = FOLLOW_ME_INDEX_CELL_DEG * 111320 * Math.max(.15, Math.cos(point.lat * Math.PI / 180));
        const latRadius = Math.ceil(radiusM / latCellM) + 1;
        const lonRadius = Math.ceil(radiusM / Math.max(1, lonCellM)) + 1;
        const seen = new Set;
        let best = null;
        for (let lat = center.lat - latRadius; lat <= center.lat + latRadius; lat++) {
            for (let lon = center.lon - lonRadius; lon <= center.lon + lonRadius; lon++) {
                const bucket = index.cells.get(followMeIndexCellKey(lat, lon));
                for (const segment of bucket || []) {
                    if (seen.has(segment)) continue;
                    seen.add(segment);
                    const projected = followMeProjectGeoPoint(point, segment.aPoint, segment.bPoint);
                    if (!best || projected.distance < best.distance) {
                        best = {
                            segment: segment,
                            point: projected.point,
                            t: projected.t,
                            distance: projected.distance
                        };
                    }
                }
            }
        }
        return best;
    }
    function followMeNearestMovementSegment(point, graph, searchRadiusM = CFG.followMeGraphSearchRadiusM) {
        if (!graph?.movementSegments?.length) return null;
        if (graph.movementIndex) {
            return followMeNearestIndexedSegment(point, graph.movementIndex, searchRadiusM);
        }
        return followMeNearestSegment(point, graph.movementSegments);
    }
    function followMeNearestSegment(point, segments) {
        let best = null;
        for (const segment of segments || []) {
            const projected = followMeProjectGeoPoint(point, segment.aPoint, segment.bPoint);
            if (!best || projected.distance < best.distance) {
                best = {
                    segment: segment,
                    point: projected.point,
                    t: projected.t,
                    distance: projected.distance
                };
            }
        }
        return best;
    }
    function followMeGraphNode(graph, key, point) {
        let node = graph.nodes.get(key);
        if (!node) {
            node = {
                key: key,
                point: {
                    lat: point.lat,
                    lon: point.lon
                },
                edges: []
            };
            graph.nodes.set(key, node);
        }
        return node;
    }
    function followMeAddGraphEdge(graph, aKey, bKey, type, feature, weight = null) {
        if (!aKey || !bKey || aKey === bKey) return null;
        const edgeKey = aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
        if (graph.edgeKeys.has(edgeKey)) return graph.edgeMap.get(edgeKey);
        const a = graph.nodes.get(aKey);
        const b = graph.nodes.get(bKey);
        if (!a || !b) return null;
        const length = Number.isFinite(weight) ? weight : geoDistanceMeters(a.point, b.point);
        if (!Number.isFinite(length) || length <= .05) return null;
        const segment = {
            aKey: aKey,
            bKey: bKey,
            aPoint: a.point,
            bPoint: b.point,
            length: length,
            type: type,
            feature: feature || null
        };
        graph.edgeKeys.add(edgeKey);
        graph.edgeMap.set(edgeKey, segment);
        graph.segments.push(segment);
        a.edges.push({
            to: bKey,
            weight: length,
            segment: segment
        });
        b.edges.push({
            to: aKey,
            weight: length,
            segment: segment
        });
        return segment;
    }
    function followMeAddFeatureToGraph(graph, feature, type) {
        const points = feature?.points || [];
        for (let i = 1; i < points.length; i++) {
            const aKey = followMePointKey(points[i - 1]);
            const bKey = followMePointKey(points[i]);
            followMeGraphNode(graph, aKey, points[i - 1]);
            followMeGraphNode(graph, bKey, points[i]);
            const segment = followMeAddGraphEdge(graph, aKey, bKey, type, feature);
            if (segment && type === "movement") {
                graph.movementSegments.push(segment);
            }
        }
    }
    function followMeEnsureProjectionNode(graph, match) {
        if (!match?.segment) return null;
        if (match.t <= .001) return match.segment.aKey;
        if (match.t >= .999) return match.segment.bKey;
        const key = `snap_${followMePointKey(match.point)}`;
        followMeGraphNode(graph, key, match.point);
        followMeAddGraphEdge(graph, key, match.segment.aKey, "connector", match.segment.feature, match.segment.length * match.t);
        followMeAddGraphEdge(graph, key, match.segment.bKey, "connector", match.segment.feature, match.segment.length * (1 - match.t));
        return key;
    }
    function followMeNodeHasMovementEdge(node) {
        return !!node?.edges?.some(edge => edge.segment?.type === "movement");
    }
    function followMeBuildGraph(dataset) {
        if (!dataset) return null;
        const graph = {
            nodes: new Map,
            segments: [],
            movementSegments: [],
            edgeKeys: new Set,
            edgeMap: new Map
        };
        const movementFeatures = [ ...(dataset.taxiways || []), ...(dataset.taxilanes || []) ];
        for (const feature of movementFeatures) {
            followMeAddFeatureToGraph(graph, feature, "movement");
        }
        graph.movementIndex = followMeBuildSegmentIndex(graph.movementSegments);
        for (const feature of dataset.parking || []) {
            if (feature.points?.length >= 2) {
                followMeAddFeatureToGraph(graph, feature, "parking");
            }
        }
        for (const feature of dataset.parking || []) {
            const points = feature.points || [];
            if (points.length < 2) continue;
            const target = followMeParkingTargetPoint(feature, movementFeatures, graph.movementIndex);
            if (!target) continue;
            const entry = geoDistanceMeters(points[0], target) < geoDistanceMeters(points.at(-1), target) ? points.at(-1) : points[0];
            const entryKey = followMePointKey(entry);
            const entryNode = graph.nodes.get(entryKey);
            if (!entryNode || followMeNodeHasMovementEdge(entryNode)) continue;
            const nearest = followMeNearestMovementSegment(entry, graph, CFG.followMeGraphSearchRadiusM);
            if (!nearest || nearest.distance > CFG.followMeParkingConnectDistanceM) continue;
            const snapKey = followMeEnsureProjectionNode(graph, nearest);
            followMeAddGraphEdge(graph, entryKey, snapKey, "connector", feature, nearest.distance);
        }
        return graph;
    }
    function followMeHeapPush(heap, item) {
        heap.push(item);
        let index = heap.length - 1;
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (heap[parent][0] <= heap[index][0]) break;
            [ heap[parent], heap[index] ] = [ heap[index], heap[parent] ];
            index = parent;
        }
    }
    function followMeHeapPop(heap) {
        if (!heap.length) return null;
        const first = heap[0];
        const last = heap.pop();
        if (heap.length && last) {
            heap[0] = last;
            let index = 0;
            while (true) {
                const left = index * 2 + 1;
                const right = left + 1;
                let smallest = index;
                if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;
                if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;
                if (smallest === index) break;
                [ heap[index], heap[smallest] ] = [ heap[smallest], heap[index] ];
                index = smallest;
            }
        }
        return first;
    }
    function followMeShortestPath(graph, startKey, targetKey) {
        if (!graph?.nodes.has(startKey) || !graph.nodes.has(targetKey)) return null;
        if (startKey === targetKey) return {
            keys: [ startKey ],
            distance: 0
        };
        const distances = new Map([[ startKey, 0 ]]);
        const previous = new Map;
        const heap = [];
        followMeHeapPush(heap, [ 0, startKey ]);
        while (heap.length) {
            const current = followMeHeapPop(heap);
            if (!current) break;
            const [distance, key] = current;
            if (distance !== distances.get(key)) continue;
            if (key === targetKey) break;
            const node = graph.nodes.get(key);
            for (const edge of node?.edges || []) {
                const nextDistance = distance + edge.weight;
                if (nextDistance >= (distances.get(edge.to) ?? Infinity)) continue;
                distances.set(edge.to, nextDistance);
                previous.set(edge.to, key);
                followMeHeapPush(heap, [ nextDistance, edge.to ]);
            }
        }
        if (!distances.has(targetKey)) return null;
        const keys = [];
        let key = targetKey;
        while (key !== undefined) {
            keys.push(key);
            if (key === startKey) break;
            key = previous.get(key);
        }
        if (keys.at(-1) !== startKey) return null;
        keys.reverse();
        return {
            keys: keys,
            distance: distances.get(targetKey)
        };
    }
    function followMeTargetNode(graph, target) {
        if (!target) return null;
        const directKey = followMePointKey(target);
        if (graph.nodes.has(directKey)) {
            return {
                key: directKey,
                distance: 0
            };
        }
        const nearest = followMeNearestSegment(target, graph.segments);
        if (!nearest) return null;
        return {
            key: followMeEnsureProjectionNode(graph, nearest),
            distance: nearest.distance
        };
    }
    function followMeDedupePoints(points) {
        const result = [];
        for (const point of points || []) {
            if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lon)) continue;
            const previous = result.at(-1);
            if (!previous || geoDistanceMeters(previous, point) > .35) {
                result.push({
                    lat: point.lat,
                    lon: point.lon
                });
            }
        }
        return result;
    }
    function followMePrepareRoute(points) {
        const cleanPoints = followMeDedupePoints(points);
        if (cleanPoints.length < 2) return null;
        const lengths = [];
        const cumulative = [ 0 ];
        let total = 0;
        for (let i = 1; i < cleanPoints.length; i++) {
            const length = geoDistanceMeters(cleanPoints[i - 1], cleanPoints[i]);
            lengths.push(length);
            total += length;
            cumulative.push(total);
        }
        if (total < 5) return null;
        return {
            points: cleanPoints,
            lengths: lengths,
            cumulative: cumulative,
            totalM: total
        };
    }
    function followMeBuildRoute(position, heading) {
        const graph = state.followMe.graph;
        const target = state.standLocator.selectedTarget;
        if (!graph || !target) return null;
        const startMatch = followMeNearestMovementSegment(position, graph, CFG.followMeGraphSearchRadiusM);
        if (!startMatch) return {
            waiting: true,
            distance: Infinity
        };
        if (startMatch.distance > CFG.followMeTaxiwayEntryDistanceM) {
            return {
                waiting: true,
                distance: startMatch.distance
            };
        }
        const targetMatch = followMeTargetNode(graph, target);
        if (!targetMatch?.key) return {
            error: "Could not connect the selected stand to the taxiway network"
        };
        const candidates = [];
        const startKeys = [ startMatch.segment.aKey, startMatch.segment.bKey ];
        for (const startKey of new Set(startKeys)) {
            const path = followMeShortestPath(graph, startKey, targetMatch.key);
            if (!path) continue;
            const startNode = graph.nodes.get(startKey);
            const initialBearing = startNode ? bearingDegrees(startMatch.point, startNode.point) : heading;
            const initialAngle = Number.isFinite(heading) && Number.isFinite(initialBearing) ? angleDifferenceDegrees(heading, initialBearing) : null;
            const headingPenalty = Number.isFinite(initialAngle) ? initialAngle * 2 : 0;
            const points = [ startMatch.point, ...path.keys.map(key => graph.nodes.get(key)?.point), target ];
            const route = followMePrepareRoute(points);
            if (!route) continue;
            candidates.push({
                route: route,
                score: route.totalM + headingPenalty,
                forwardCompatible: !Number.isFinite(initialAngle) || initialAngle <= CFG.followMeForwardRouteMaxAngleDeg
            });
        }
        if (!candidates.length) return {
            error: "No connected taxi route to the selected stand"
        };
        const forwardCandidates = candidates.filter(candidate => candidate.forwardCompatible);
        const candidatePool = forwardCandidates.length ? forwardCandidates : candidates;
        candidatePool.sort((a, b) => a.score - b.score);
        return {
            route: candidatePool[0].route
        };
    }
    function followMeRoutePoseAt(route, distanceM) {
        if (!route) return null;
        const distance = clamp(distanceM, 0, route.totalM);
        for (let i = 1; i < route.points.length; i++) {
            if (distance > route.cumulative[i] && i < route.points.length - 1) continue;
            const segmentLength = Math.max(route.lengths[i - 1], .001);
            const t = clamp((distance - route.cumulative[i - 1]) / segmentLength, 0, 1);
            const a = route.points[i - 1];
            const b = route.points[i];
            return {
                point: {
                    lat: a.lat + (b.lat - a.lat) * t,
                    lon: a.lon + (b.lon - a.lon) * t
                },
                heading: bearingDegrees(a, b)
            };
        }
        const last = route.points.at(-1);
        const previous = route.points.at(-2) || last;
        return {
            point: last,
            heading: bearingDegrees(previous, last)
        };
    }
    function followMeProjectOnRoute(position, route, referenceProgressM = null) {
        if (!route) return null;
        let best = null;
        for (let i = 1; i < route.points.length; i++) {
            const projected = followMeProjectGeoPoint(position, route.points[i - 1], route.points[i]);
            const progressM = route.cumulative[i - 1] + route.lengths[i - 1] * projected.t;
            let score = projected.distance;
            if (Number.isFinite(referenceProgressM)) {
                const progressDelta = progressM - referenceProgressM;
                const distanceFromReference = Math.abs(progressDelta);
                // Prefer the nearby part of the route. This prevents a taxiway
                // crossing from selecting an older segment with the same
                // physical distance from the aircraft.
                score += Math.min(80, distanceFromReference * .12);
                if (progressDelta < -12) {
                    score += Math.min(220, (-progressDelta - 12) * 1.75);
                } else if (progressDelta > 75) {
                    score += Math.min(180, (progressDelta - 75) * 1.1);
                }
            }
            const isBetterTie = best && Math.abs(score - best.score) < .1 && progressM > best.progressM;
            if (!best || score < best.score || isBetterTie) {
                best = {
                    distance: projected.distance,
                    progressM: progressM,
                    point: projected.point,
                    score: score
                };
            }
        }
        return best;
    }
    function resetFollowMeVehicleMotion() {
        const followMe = state.followMe;
        followMe.vehicleProgressM = 0;
        followMe.vehicleSpeedMps = 0;
        followMe.vehicleLastAt = 0;
        followMe.lastAircraftProgressM = 0;
        followMe.lastAircraftProgressAt = 0;
        followMe.lastValidAircraftSpeedMps = 0;
        followMe.routeOffRouteSince = 0;
    }
    function followMeAdvanceVehicle(route, aircraftProgressM, speedKts, now) {
        const followMe = state.followMe;
        if (!route || !Number.isFinite(aircraftProgressM)) return null;
        const leadDistance = followMeLeadDistanceM();
        const velocity = window.geofs?.aircraft?.instance?.rigidBody?.v_linearVelocity;
        const velocityComponents = velocity ? [
            Number(velocity[0] ?? velocity.x ?? 0),
            Number(velocity[1] ?? velocity.y ?? 0),
            Number(velocity[2] ?? velocity.z ?? 0)
        ] : [];
        const rigidBodySpeedMps = velocityComponents.length === 3 && velocityComponents.every(Number.isFinite) ?
            Math.hypot(...velocityComponents) : 0;
        const indicatedSpeedMps = Number.isFinite(speedKts) ? Math.max(0, speedKts) * .514444 : 0;
        const initial = !followMe.vehicleLastAt;
        const elapsedS = initial ? 0 : clamp((now - followMe.vehicleLastAt) / 1e3, 0, .5);
        const previousAircraftProgress = followMe.lastAircraftProgressM;
        const previousAircraftAt = followMe.lastAircraftProgressAt;
        followMe.vehicleLastAt = now;
        followMe.lastAircraftProgressM = aircraftProgressM;
        followMe.lastAircraftProgressAt = now;
        const aircraftDeltaS = previousAircraftAt ? (now - previousAircraftAt) / 1e3 : 0;
        const measuredAircraftSpeed = aircraftDeltaS > .02 && Number.isFinite(previousAircraftProgress) ?
            Math.max(0, (aircraftProgressM - previousAircraftProgress) / aircraftDeltaS) : 0;
        const rawAircraftSpeed = clamp(
            Math.max(indicatedSpeedMps, rigidBodySpeedMps, measuredAircraftSpeed),
            0,
            CFG.followMeVehicleMaxSpeedMps
        );
        if (initial || !Number.isFinite(followMe.lastValidAircraftSpeedMps)) {
            followMe.lastValidAircraftSpeedMps = rawAircraftSpeed;
        } else {
            const memoryAlpha = clamp(elapsedS * 1e3 / CFG.followMeVehicleSpeedMemoryMs, 0, 1);
            followMe.lastValidAircraftSpeedMps += (rawAircraftSpeed - followMe.lastValidAircraftSpeedMps) * memoryAlpha;
        }
        const cruiseSpeed = clamp(
            Math.max(CFG.followMeVehicleMinimumRollSpeedMps, followMe.lastValidAircraftSpeedMps),
            CFG.followMeVehicleMinimumRollSpeedMps,
            CFG.followMeVehicleMaxSpeedMps
        );
        if (initial) {
            followMe.vehicleProgressM = clamp(aircraftProgressM + leadDistance, 0, route.totalM);
            followMe.vehicleSpeedMps = Math.min(
                CFG.followMeVehicleMaxSpeedMps,
                cruiseSpeed
            );
            return followMe.vehicleProgressM;
        }
        const desiredProgress = Math.min(route.totalM, aircraftProgressM + leadDistance);
        const leadLimit = Math.min(route.totalM, desiredProgress + CFG.followMeVehicleLeadSlackM);
        const currentProgress = clamp(Number(followMe.vehicleProgressM) || 0, 0, route.totalM);
        const remainingToLimitM = leadLimit - currentProgress;
        let targetSpeed = cruiseSpeed;
        if (remainingToLimitM <= 0) {
            targetSpeed = 0;
        } else if (currentProgress < desiredProgress - 1) {
            const catchupSpeed = (desiredProgress - currentProgress) / .65;
            targetSpeed = Math.min(
                CFG.followMeVehicleMaxSpeedMps,
                Math.max(cruiseSpeed, catchupSpeed)
            );
        }
        // Approach the moving safety limit progressively. A single low speed
        // sample during braking or a turn must not freeze the vehicle.
        const softStopDistanceM = Math.max(2, cruiseSpeed * CFG.followMeVehicleSoftStopTimeS);
        if (remainingToLimitM > 0 && remainingToLimitM < softStopDistanceM) {
            targetSpeed = Math.min(targetSpeed, remainingToLimitM / CFG.followMeVehicleSoftStopTimeS);
        }
        const acceleration = targetSpeed >= followMe.vehicleSpeedMps ?
            CFG.followMeVehicleAccelerationMps2 : CFG.followMeVehicleBrakingMps2;
        const speedChange = acceleration * elapsedS;
        if (followMe.vehicleSpeedMps < targetSpeed) {
            followMe.vehicleSpeedMps = Math.min(targetSpeed, followMe.vehicleSpeedMps + speedChange);
        } else {
            followMe.vehicleSpeedMps = Math.max(targetSpeed, followMe.vehicleSpeedMps - speedChange);
        }
        const nextProgress = Math.min(
            leadLimit,
            route.totalM,
            currentProgress + followMe.vehicleSpeedMps * elapsedS
        );
        followMe.vehicleProgressM = Math.max(currentProgress, nextProgress);
        return followMe.vehicleProgressM;
    }
    function followMeForwardDistance(from, to, heading) {
        if (!from || !to || !Number.isFinite(heading)) return null;
        const local = localMeters(from, to);
        const radians = heading * Math.PI / 180;
        return local.x * Math.sin(radians) + local.y * Math.cos(radians);
    }
    function followMeVehicleIsBehindAircraft(aircraftPoint, vehiclePoint, heading) {
        const forwardDistance = followMeForwardDistance(aircraftPoint, vehiclePoint, heading);
        return Number.isFinite(forwardDistance) && forwardDistance < -CFG.followMeBehindThresholdM;
    }
    function followMeOffsetGeoPoint(point, heading, forwardM, lateralM) {
        const radians = heading * Math.PI / 180;
        const north = Math.cos(radians) * forwardM - Math.sin(radians) * lateralM;
        const east = Math.sin(radians) * forwardM + Math.cos(radians) * lateralM;
        const lonScale = 111320 * Math.max(.15, Math.cos(point.lat * Math.PI / 180));
        return {
            lat: point.lat + north / 111320,
            lon: point.lon + east / lonScale
        };
    }
    const FOLLOW_ME_BEACON_PATTERN = [
        [ true, false ],
        [ false, false ],
        [ false, true ],
        [ false, false ],
        [ false, false ],
        [ false, false ]
    ];
    function followMeBeaconNightActive() {
        if (!CFG.followMeBeaconEnabled) return false;
        if (!CFG.followMeBeaconNightOnly) return true;
        return window.geofs?.isNight === true;
    }
    function followMeBeaconLocation(point, heading, lateralM) {
        const offset = followMeOffsetGeoPoint(point, heading, CFG.followMeBeaconForwardM, lateralM);
        // GeoFS billboard locations use [latitude, longitude, altitude].
        // Cesium model positions below use fromDegrees(longitude, latitude, altitude).
        return [ offset.lat, offset.lon, CFG.followMeBeaconHeightM ];
    }
    function followMeBeaconOptions() {
        const Cesium = window.Cesium;
        const geofs = window.geofs;
        const options = {
            sizeInMeters: false
        };
        if (geofs?.api?.ALTITUDE_RELATIVE !== undefined) {
            options.altitudeMode = geofs.api.ALTITUDE_RELATIVE;
        }
        if (Cesium?.NearFarScalar) {
            options.scaleByDistance = new Cesium.NearFarScalar(
                1,
                CFG.followMeBeaconScaleNear,
                CFG.followMeBeaconScaleFarDistanceM,
                CFG.followMeBeaconScaleFar
            );
        }
        return options;
    }
    function followMeBeaconTextureType() {
        const textureMap = window.geofs?.fx?.texture2url;
        if (textureMap?.[CFG.followMeBeaconLightType]) return CFG.followMeBeaconLightType;
        if (textureMap?.orange) return "orange";
        if (textureMap?.yellow) return "yellow";
        return CFG.followMeBeaconLightType;
    }
    function setFollowMeBeaconVisibility() {
        const lights = state.followMe.beaconLights;
        if (!lights.length) return;
        const pattern = FOLLOW_ME_BEACON_PATTERN[state.followMe.beaconPatternIndex % FOLLOW_ME_BEACON_PATTERN.length];
        const night = followMeBeaconNightActive();
        lights.forEach((light, index) => {
            try {
                light.setVisibility(night && !!pattern[index]);
            } catch (_) {}
        });
    }
    function updateFollowMeBeacon(point, heading) {
        const lights = state.followMe.beaconLights;
        if (!lights.length) return false;
        const locations = [
            followMeBeaconLocation(point, heading, -CFG.followMeBeaconLateralM),
            followMeBeaconLocation(point, heading, CFG.followMeBeaconLateralM)
        ];
        lights.forEach((light, index) => {
            try {
                light.setLocation(locations[index]);
            } catch (_) {}
        });
        setFollowMeBeaconVisibility();
        return true;
    }
    function startFollowMeBeaconPulse() {
        if (state.followMe.beaconTimer) return;
        state.followMe.beaconTimer = window.setInterval(() => {
            state.followMe.beaconPatternIndex = (state.followMe.beaconPatternIndex + 1) % FOLLOW_ME_BEACON_PATTERN.length;
            setFollowMeBeaconVisibility();
        }, CFG.followMeBeaconPulseMs);
    }
    function removeFollowMeBeacon() {
        if (state.followMe.beaconTimer) {
            window.clearInterval(state.followMe.beaconTimer);
            state.followMe.beaconTimer = null;
        }
        for (const light of state.followMe.beaconLights) {
            try {
                light.setVisibility(false);
                light.destroy();
            } catch (_) {}
        }
        state.followMe.beaconLights = [];
        state.followMe.beaconPatternIndex = 0;
    }
    function ensureFollowMeBeacon(point, heading) {
        if (!CFG.followMeBeaconEnabled) return false;
        if (state.followMe.beaconLights.length) {
            updateFollowMeBeacon(point, heading);
            startFollowMeBeaconPulse();
            return true;
        }
        const Light = window.geofs?.fx?.light;
        if (typeof Light !== "function") return false;
        const locations = [
            followMeBeaconLocation(point, heading, -CFG.followMeBeaconLateralM),
            followMeBeaconLocation(point, heading, CFG.followMeBeaconLateralM)
        ];
        const created = [];
        const textureType = followMeBeaconTextureType();
        try {
            for (const location of locations) {
                created.push(new Light(location, textureType, followMeBeaconOptions()));
            }
        } catch (error) {
            for (const light of created) {
                try {
                    light.destroy();
                } catch (_) {}
            }
            console.warn("[TWY FOLLOW] Beacon creation failed", error);
            return false;
        }
        if (created.length !== locations.length || created.some(light => !light)) {
            for (const light of created) {
                try {
                    light.destroy();
                } catch (_) {}
            }
            return false;
        }
        state.followMe.beaconLights = created;
        state.followMe.beaconPatternIndex = 0;
        updateFollowMeBeacon(point, heading);
        startFollowMeBeaconPulse();
        return true;
    }
    function followMeVehicleGroundPlacement(Cesium) {
        const heightReference = Cesium?.HeightReference;
        if (heightReference?.RELATIVE_TO_GROUND !== undefined) {
            return {
                heightReference: heightReference.RELATIVE_TO_GROUND,
                heightM: CFG.followMeVehicleModelHeightOffsetM
            };
        }
        if (heightReference?.CLAMP_TO_GROUND !== undefined) {
            return {
                heightReference: heightReference.CLAMP_TO_GROUND,
                heightM: 0
            };
        }
        return null;
    }
    function followMeVehiclePosition(point, heading, forwardM, lateralM, heightM) {
        const Cesium = window.Cesium;
        const offset = followMeOffsetGeoPoint(point, heading, forwardM, lateralM);
        return Cesium.Cartesian3.fromDegrees(offset.lon, offset.lat, heightM);
    }
    function followMeVehicleOrientation(point, heading) {
        const Cesium = window.Cesium;
        if (!Cesium?.Transforms?.headingPitchRollQuaternion || !Cesium.HeadingPitchRoll) return undefined;
        const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0);
        return Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0));
    }
    function followMeBlendHeading(from, to, amount) {
        if (!Number.isFinite(from)) return to;
        if (!Number.isFinite(to)) return from;
        const delta = (to - from + 540) % 360 - 180;
        let result = (from + delta * amount) % 360;
        if (result < 0) result += 360;
        return result;
    }
    function stopFollowMeVehicleAnimation() {
        const followMe = state.followMe;
        if (followMe.vehicleAnimationFrame !== null && typeof window.cancelAnimationFrame === "function") {
            window.cancelAnimationFrame(followMe.vehicleAnimationFrame);
        }
        followMe.vehicleAnimationFrame = null;
        followMe.vehicleAnimationLastMs = 0;
    }
    function scheduleFollowMeVehicleAnimation() {
        const followMe = state.followMe;
        if (followMe.vehicleAnimationFrame !== null || typeof window.requestAnimationFrame !== "function") return;
        followMe.vehicleAnimationFrame = window.requestAnimationFrame(followMeAnimateVehicle);
    }
    function followMeAnimateVehicle(timestamp) {
        const followMe = state.followMe;
        followMe.vehicleAnimationFrame = null;
        if (!followMe.enabled || !followMe.vehicleEntities.length || !followMe.vehicleTargetPose) return;
        const target = followMe.vehicleTargetPose;
        const current = followMe.vehiclePose || {
            point: { ...target.point },
            heading: target.heading
        };
        const previousTimestamp = followMe.vehicleAnimationLastMs;
        const elapsedMs = previousTimestamp ? clamp(timestamp - previousTimestamp, 1, 120) : CFG.followMeUpdateMs;
        followMe.vehicleAnimationLastMs = timestamp;
        const alpha = 1 - Math.exp(-elapsedMs / CFG.followMeVehicleSmoothingMs);
        const nextPoint = {
            lat: current.point.lat + (target.point.lat - current.point.lat) * alpha,
            lon: current.point.lon + (target.point.lon - current.point.lon) * alpha
        };
        const nextHeading = followMeBlendHeading(current.heading, target.heading, alpha);
        followMe.vehiclePose = {
            point: nextPoint,
            heading: nextHeading
        };
        updateFollowMeVehicle(nextPoint, nextHeading);
        const locationRemainingM = geoDistanceMeters(nextPoint, target.point);
        const headingRemaining = Number.isFinite(nextHeading) && Number.isFinite(target.heading) ? angleDifferenceDegrees(nextHeading, target.heading) : 0;
        if (locationRemainingM < .03 && headingRemaining < .2) {
            followMe.vehiclePose = {
                point: { ...target.point },
                heading: target.heading
            };
            updateFollowMeVehicle(target.point, target.heading);
            return;
        }
        scheduleFollowMeVehicleAnimation();
    }
    function removeFollowMeVehicle() {
        stopFollowMeVehicleAnimation();
        removeFollowMeBeacon();
        const entities = getCesiumEntityCollection();
        if (entities) {
            for (const part of state.followMe.vehicleEntities) {
                try {
                    entities.remove(part.entity || part);
                } catch (_) {}
            }
        }
        state.followMe.vehicleEntities = [];
        state.followMe.vehiclePose = null;
        state.followMe.vehicleTargetPose = null;
        resetFollowMeVehicleMotion();
    }
    function followMeVehicleModelPosition(point, heading, heightM = CFG.followMeVehicleModelHeightOffsetM) {
        return followMeVehiclePosition(
            point,
            heading,
            0,
            0,
            heightM
        );
    }
    function followMeVehicleModelOrientation(point, heading) {
        return followMeVehicleOrientation(
            point,
            heading + CFG.followMeVehicleModelHeadingOffsetDeg
        );
    }
    function ensureFollowMeVehicle(point, heading) {
        const Cesium = window.Cesium;
        const entities = getCesiumEntityCollection();
        if (!Cesium || !entities) return false;
        if (state.followMe.vehicleEntities.length) {
            return true;
        }
        const groundPlacement = followMeVehicleGroundPlacement(Cesium);
        if (!groundPlacement) return false;
        const displayCondition = Cesium.DistanceDisplayCondition ? new Cesium.DistanceDisplayCondition(0, CFG.followMeVehicleDisplayDistanceM) : undefined;
        try {
            const entity = entities.add({
                position: followMeVehicleModelPosition(point, heading, groundPlacement.heightM),
                orientation: followMeVehicleModelOrientation(point, heading),
                model: {
                    uri: CFG.followMeVehicleModelUrl,
                    scale: CFG.followMeVehicleModelScale,
                    minimumPixelSize: 12,
                    heightReference: groundPlacement.heightReference,
                    distanceDisplayCondition: displayCondition
                }
            });
            state.followMe.vehicleEntities.push({entity: entity});
            ensureFollowMeBeacon(point, heading);
        } catch (error) {
            removeFollowMeVehicle();
            console.warn("[TWY FOLLOW] Vehicle creation failed", error);
            return false;
        }
        return state.followMe.vehicleEntities.length > 0;
    }
    function updateFollowMeVehicle(point, heading) {
        if (!ensureFollowMeVehicle(point, heading)) return false;
        const Cesium = window.Cesium;
        const groundPlacement = followMeVehicleGroundPlacement(Cesium);
        if (!groundPlacement) return false;
        const vehicle = state.followMe.vehicleEntities[0];
        vehicle.entity.position = followMeVehicleModelPosition(point, heading, groundPlacement.heightM);
        const orientation = followMeVehicleModelOrientation(point, heading);
        if (orientation) vehicle.entity.orientation = orientation;
        ensureFollowMeBeacon(point, heading);
        return true;
    }
    function setFollowMeVehicleTarget(point, heading) {
        if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lon) || !Number.isFinite(heading)) return false;
        if (!ensureFollowMeVehicle(point, heading)) return false;
        const followMe = state.followMe;
        followMe.vehicleTargetPose = {
            point: {
                lat: point.lat,
                lon: point.lon
            },
            heading: heading
        };
        if (!followMe.vehiclePose) {
            followMe.vehiclePose = {
                point: { ...followMe.vehicleTargetPose.point },
                heading: heading
            };
            followMe.vehicleAnimationLastMs = 0;
            if (!updateFollowMeVehicle(point, heading)) return false;
        }
        if (typeof window.requestAnimationFrame === "function") {
            scheduleFollowMeVehicleAnimation();
        } else {
            updateFollowMeVehicle(point, heading);
        }
        return true;
    }
    function followMeInvalidateGraph() {
        removeFollowMeVehicle();
        state.followMe.graph = null;
        state.followMe.graphSource = null;
        state.followMe.graphFailedSource = null;
        state.followMe.loadedDataset = null;
        state.followMe.loadedDatasetSource = null;
        state.followMe.route = null;
        state.followMe.routeProgressM = 0;
        state.followMe.routeDirectionCorrectionUsed = false;
        state.followMe.routeStartedAt = 0;
        state.followMe.routeStatus = "idle";
        state.followMe.statusMessage = "";
        state.followMe.exit = null;
        state.followMe.completedTargetRef = null;
        state.followMe.lastAttemptAt = 0;
        updateFollowMeStatus();
    }
    function resetFollowMeRoute() {
        removeFollowMeVehicle();
        state.followMe.route = null;
        state.followMe.routeProgressM = 0;
        state.followMe.routeDirectionCorrectionUsed = false;
        state.followMe.routeStartedAt = 0;
        state.followMe.routeStatus = "idle";
        state.followMe.statusMessage = "";
        state.followMe.exit = null;
        state.followMe.completedTargetRef = null;
        state.followMe.lastAttemptAt = 0;
        updateFollowMeStatus();
    }
    function followMeBuildExitRoute(pose) {
        if (!pose?.point || !Number.isFinite(pose.heading)) return null;
        const forward = CFG.followMeExitForwardM;
        const turn = CFG.followMeExitTurnM;
        const clear = Math.max(turn + 1, CFG.followMeExitClearDistanceM);
        return followMePrepareRoute([
            pose.point,
            followMeOffsetGeoPoint(pose.point, pose.heading, forward, 0),
            followMeOffsetGeoPoint(pose.point, pose.heading, forward, -turn),
            followMeOffsetGeoPoint(pose.point, pose.heading, forward, -clear)
        ]);
    }
    function followMeStartExit() {
        const followMe = state.followMe;
        if (followMe.exit) return true;
        const pose = followMeRoutePoseAt(followMe.route, followMe.route?.totalM);
        const exitRoute = followMeBuildExitRoute(pose);
        if (!exitRoute || !pose) return false;
        if (!setFollowMeVehicleTarget(pose.point, pose.heading)) return false;
        followMe.exit = {
            route: exitRoute,
            progressM: 0,
            lastAt: Date.now()
        };
        followMe.routeStatus = "active";
        followMe.statusMessage = "Clearing stand…";
        updateFollowMeStatus();
        return true;
    }
    function followMeTickExit() {
        const followMe = state.followMe;
        const exit = followMe.exit;
        if (!exit?.route) return false;
        const now = Date.now();
        const elapsedS = exit.lastAt ? clamp((now - exit.lastAt) / 1e3, 0, .6) : 0;
        exit.lastAt = now;
        exit.progressM = Math.min(exit.route.totalM, exit.progressM + elapsedS * CFG.followMeExitSpeedMps);
        const pose = followMeRoutePoseAt(exit.route, exit.progressM);
        if (!pose) return false;
        if (!setFollowMeVehicleTarget(pose.point, pose.heading)) {
            removeFollowMeVehicle();
            followMe.exit = null;
            setFollowMeStatus("error", "Vehicle could not be displayed");
            return true;
        }
        if (exit.progressM >= exit.route.totalM - .01) {
            const completedTargetRef = state.standLocator.selectedRef;
            removeFollowMeVehicle();
            followMe.exit = null;
            followMe.route = null;
            followMe.routeProgressM = 0;
            followMe.routeStartedAt = 0;
            followMe.completedTargetRef = completedTargetRef;
            setFollowMeStatus("arrived", "");
        } else {
            setFollowMeStatus("active", "Clearing stand…");
        }
        return true;
    }
    function toggleFollowMe() {
        state.followMe.enabled = !state.followMe.enabled;
        localStorage.setItem("geofsGroundV411FollowMe", String(state.followMe.enabled));
        if (state.followMe.enabled) {
            state.followMe.graphFailedSource = null;
            startFollowMeMonitor();
            resetFollowMeRoute();
            setStatus(state.standLocator.selectedTarget ? "Follow-me vehicle armed" : "Follow-me vehicle on · select a stand", state.standLocator.selectedTarget ? "ready" : "idle");
        } else {
            stopFollowMeMonitor();
            resetFollowMeRoute();
            setStatus("Follow-me vehicle off", state.taxiways.size ? "ready" : "idle");
        }
        updateUI();
    }
    function followMeTick() {
        const followMe = state.followMe;
        if (!followMe.enabled) return;
        if (!state.standLocator.selectedTarget) {
            if (followMe.route || followMe.vehicleEntities.length || followMe.routeStatus !== "idle" || followMe.statusMessage) {
                resetFollowMeRoute();
            }
            return;
        }
        if (followMe.completedTargetRef === state.standLocator.selectedRef) {
            if (followMe.routeStatus !== "arrived" || followMe.statusMessage) setFollowMeStatus("arrived", "");
            return;
        }
        if (followMe.exit) {
            followMeTickExit();
            return;
        }
        if (!state.minimapAirportReady && !state.minimapAirportLoading) {
            ensureMinimapAirportData();
        }
        const routingData = followMeRoutingDataset();
        if (!routingData) {
            removeFollowMeVehicle();
            setFollowMeStatus("waiting", state.running || state.minimapAirportLoading ? "Waiting for airport taxiway data" : "Airport taxiway data unavailable");
            return;
        }
        const source = routingData.source;
        const dataHint = routingData.complete ? "" : " · using loaded taxiways";
        if (followMe.graphFailedSource === source) {
            setFollowMeStatus("error", `Could not build taxiway network${dataHint}`);
            return;
        }
        if (!followMe.graph || !followMe.route && followMe.graphSource !== source) {
            try {
                setFollowMeStatus("building", "Building taxiway network…");
                followMe.graph = followMeBuildGraph(routingData.dataset);
                followMe.graphSource = source;
                followMe.route = null;
                followMe.routeProgressM = 0;
                followMe.routeDirectionCorrectionUsed = false;
                followMe.lastAttemptAt = 0;
                resetFollowMeVehicleMotion();
            } catch (error) {
                followMe.graph = null;
                followMe.graphSource = source;
                followMe.graphFailedSource = source;
                setFollowMeStatus("error", "Could not build taxiway network");
                console.warn("[TWY FOLLOW] Graph build failed", error);
                return;
            }
            followMe.graphFailedSource = null;
        }
        const position = aircraftLL();
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lon)) return;
        const now = Date.now();
        const heading = followMeAircraftHeading();
        if (!followMe.route) {
            if (now - followMe.lastAttemptAt < 650) return;
            followMe.lastAttemptAt = now;
            const result = followMeBuildRoute(position, heading);
            if (result?.waiting) {
                removeFollowMeVehicle();
                const distanceText = Number.isFinite(result.distance) ? `Enter a taxiway · ${Math.round(result.distance)} m away` : "Taxiway network not found near aircraft";
                const waitingText = result.distance <= CFG.followMeTaxiwayEntryDistanceM ? "Enter a taxiway to activate" : distanceText;
                setFollowMeStatus("waiting", `${waitingText}${dataHint}`);
                return;
            }
            if (result?.error || !result?.route) {
                removeFollowMeVehicle();
                setFollowMeStatus("error", `${result?.error || "No taxi route found"}${dataHint}`);
                return;
            }
            followMe.route = result.route;
            followMe.routeProgressM = 0;
            followMe.routeStartedAt = now;
            followMe.routeDirectionCorrectionUsed = false;
            resetFollowMeVehicleMotion();
        }
        const projection = followMeProjectOnRoute(position, followMe.route, followMe.routeProgressM);
        const projectionValid = !!projection && projection.distance <= CFG.followMeOffRouteDistanceM;
        if (!projectionValid) {
            if (!followMe.routeOffRouteSince) followMe.routeOffRouteSince = now;
            if (now - followMe.routeOffRouteSince > CFG.followMeRouteGraceMs) {
                removeFollowMeVehicle();
                followMe.route = null;
                followMe.routeProgressM = 0;
                followMe.routeDirectionCorrectionUsed = false;
                followMe.routeStartedAt = 0;
                setFollowMeStatus("waiting", "Route lost · re-enter a taxiway");
                return;
            }
        } else {
            followMe.routeOffRouteSince = 0;
            // Taxiing is forward-only here. Never let an ambiguous intersection
            // projection move the aircraft cursor back onto an older segment.
            followMe.routeProgressM = Math.max(followMe.routeProgressM, projection.progressM);
        }
        const speedKts = groundSpeedKts(window.geofs?.aircraft?.instance);
        const vehicleProgressM = followMeAdvanceVehicle(
            followMe.route,
            followMe.routeProgressM,
            speedKts,
            now
        );
        if (!Number.isFinite(vehicleProgressM)) return;
        if (vehicleProgressM >= followMe.route.totalM - CFG.followMeExitEndpointBufferM) {
            if (!followMeStartExit()) {
                removeFollowMeVehicle();
                followMe.route = null;
                followMe.routeProgressM = 0;
                setFollowMeStatus("error", "Could not clear the stand");
            }
            return;
        }
        followMe.routeStatus = "active";
        followMe.statusMessage = "";
        const pose = followMeRoutePoseAt(followMe.route, vehicleProgressM);
        if (pose && !setFollowMeVehicleTarget(pose.point, pose.heading)) {
            setFollowMeStatus("error", "Vehicle could not be displayed");
            return;
        }
        updateFollowMeStatus();
    }
    function startFollowMeMonitor() {
        if (state.followMeTimer) return;
        state.followMeTimer = setInterval(followMeTick, CFG.followMeUpdateMs);
    }
    function stopFollowMeMonitor() {
        if (!state.followMeTimer) return;
        clearInterval(state.followMeTimer);
        state.followMeTimer = null;
    }
    function nearbyChunkDatasets(position, radiusM = CFG.detectorSearchRadiusM) {
        if (!state.chunks.length || !state.chunkData.size) return [];
        const latPad = radiusM / 111320;
        const lonPad = radiusM / (111320 * Math.max(.15, Math.cos(position.lat * Math.PI / 180)));
        const datasets = [];
        for (const chunk of state.chunks) {
            if (position.lat >= chunk.south - latPad && position.lat <= chunk.north + latPad && position.lon >= chunk.west - lonPad && position.lon <= chunk.east + lonPad) {
                const data = state.chunkData.get(chunk.key);
                if (data) datasets.push(data);
            }
        }
        return datasets;
    }
    function minimapDatasetsForDisplay() {
        if (state.minimapAirportData) return [ state.minimapAirportData ];
        return [ ...state.chunkData.values() ];
    }
    function collectNearbyFeatures(datasets, field) {
        const unique = new Map;
        for (const data of datasets) {
            for (const feature of data?.[field] || []) {
                unique.set(featureKey(feature), feature);
            }
        }
        return [ ...unique.values() ];
    }
    function nearestNamedTaxiway(position, taxiways) {
        let best = null;
        for (const feature of taxiways) {
            const ref = normalizeRef(feature.ref);
            if (!ref) continue;
            const distance = featureDistanceMeters(position, feature);
            if (!best || distance < best.distance) {
                best = {
                    feature: feature,
                    ref: ref,
                    distance: distance
                };
            }
        }
        return best;
    }
    function nearestParkingStand(position, parking) {
        let best = null;
        for (const feature of parking) {
            const ref = normalizeRef(feature.ref);
            if (!ref) continue;
            const target = parkingTargetPoint(feature);
            if (!target) continue;
            const distance = geoDistanceMeters(position, target);
            if (!best || distance < best.distance) {
                best = {
                    feature: feature,
                    ref: ref,
                    target: target,
                    distance: distance
                };
            }
        }
        return best;
    }
    function runwayCorridorHalfWidth(feature) {
        const width = parseWidthMeters(feature.tags?.width) || 45;
        return clamp(width / 2 + CFG.runwayExtraMarginM, CFG.runwayMinCorridorHalfWidthM, CFG.runwayMaxCorridorHalfWidthM);
    }
    function nearestRunwayHit(position, runways) {
        let best = null;
        for (const feature of runways) {
            const distance = featureDistanceMeters(position, feature);
            const halfWidth = runwayCorridorHalfWidth(feature);
            if (distance > halfWidth) continue;
            if (!best || distance < best.distance) {
                best = {
                    feature: feature,
                    key: featureKey(feature),
                    distance: distance,
                    halfWidth: halfWidth
                };
            }
        }
        return best;
    }
    function runwayHeadingFromDesignator(part) {
        const match = String(part || "").trim().toUpperCase().match(/^(\d{1,2})([LCR]?)$/);
        if (!match) return null;
        const number = Number(match[1]);
        if (!Number.isFinite(number) || number < 1 || number > 36) return null;
        return number === 36 ? 360 : number * 10;
    }
    function angleDifferenceDegrees(a, b) {
        const d = Math.abs((a - b + 540) % 360 - 180);
        return d;
    }
    function runwayDisplayRef(feature, movementBearing) {
        const raw = normalizeRef(feature?.ref);
        if (!raw) return "RUNWAY";
        const parts = raw.split(/[\/;]/).map(part => part.trim().toUpperCase()).filter(Boolean);
        if (parts.length <= 1 || !Number.isFinite(movementBearing)) {
            return raw.toUpperCase();
        }
        let best = null;
        for (const part of parts) {
            const heading = runwayHeadingFromDesignator(part);
            if (heading === null) continue;
            const diff = angleDifferenceDegrees(movementBearing, heading);
            if (!best || diff < best.diff) {
                best = {
                    part: part,
                    diff: diff
                };
            }
        }
        return best && best.diff <= 55 ? best.part : raw.toUpperCase();
    }
    function nearestRunwayToPoint(position, runways) {
        let best = null;
        for (const feature of runways) {
            const distance = featureDistanceMeters(position, feature);
            if (!best || distance < best.distance) {
                best = {
                    feature: feature,
                    distance: distance
                };
            }
        }
        return best;
    }
    function nearestHoldAhead(position, holdings, runways) {
        let best = null;
        for (const feature of holdings) {
            const type = String(feature.holdType || "").trim().toLowerCase();
            if (type === "ils" || type === "intermediate" || type === "movement") {
                continue;
            }
            const distance = featureDistanceMeters(position, feature);
            if (distance > CFG.holdAheadDistanceM) continue;
            const anchor = featureRepresentativePoint(feature);
            if (!anchor) continue;
            const runway = nearestRunwayToPoint(anchor, runways);
            if (!runway || runway.distance > 220) continue;
            if (!best || distance < best.distance) {
                best = {
                    feature: feature,
                    key: featureKey(feature),
                    distance: distance,
                    runway: runway.feature
                };
            }
        }
        return best;
    }
    function updateDetectorMotion(position, now) {
        const d = state.detector;
        if (!d.lastPosition || !d.lastSampleTime) {
            d.lastPosition = {
                ...position
            };
            d.lastSampleTime = now;
            d.speedKt = 0;
            return false;
        }
        const dt = (now - d.lastSampleTime) / 1e3;
        if (dt <= 0 || dt > 3) {
            d.lastPosition = {
                ...position
            };
            d.lastSampleTime = now;
            return false;
        }
        const distance = geoDistanceMeters(d.lastPosition, position);
        const rawSpeedKt = distance / dt * 1.943844;
        if (rawSpeedKt > 250 || distance > 800) {
            resetDetectorState();
            state.detector.lastPosition = {
                ...position
            };
            state.detector.lastSampleTime = now;
            return true;
        }
        if (distance > .8) {
            d.bearingDeg = bearingDegrees(d.lastPosition, position);
        }
        d.speedKt = d.lastSampleTime ? d.speedKt * .55 + rawSpeedKt * .45 : rawSpeedKt;
        d.lastPosition = {
            ...position
        };
        d.lastSampleTime = now;
        return false;
    }
    function commitRunwayState(runwayHit, taxiHit, now) {
        const d = state.detector;
        const nextKey = runwayHit?.key || null;
        if (nextKey === d.currentRunwayKey) {
            if (nextKey && runwayHit?.feature) {
                const refined = runwayDisplayRef(runwayHit.feature, d.bearingDeg);
                if (refined && !refined.includes("/")) {
                    d.currentRunwayLabel = refined;
                }
            }
            d.runwayCandidateKey = null;
            d.runwayCandidateFeature = null;
            d.runwayCandidateSince = 0;
            return;
        }
        if (nextKey !== d.runwayCandidateKey) {
            d.runwayCandidateKey = nextKey;
            d.runwayCandidateFeature = runwayHit?.feature || null;
            d.runwayCandidateSince = now;
            return;
        }
        if (now - d.runwayCandidateSince < CFG.runwayStableMs) return;
        const oldKey = d.currentRunwayKey;
        const oldFeature = d.currentRunwayFeature;
        const oldLabel = d.currentRunwayLabel;
        const newFeature = d.runwayCandidateFeature;
        d.currentRunwayKey = nextKey;
        d.currentRunwayFeature = newFeature;
        d.currentRunwayLabel = newFeature ? runwayDisplayRef(newFeature, d.bearingDeg) : null;
        d.runwayCandidateKey = null;
        d.runwayCandidateFeature = null;
        d.runwayCandidateSince = 0;
        if (!d.initialized) return;
        if (!oldKey && nextKey && newFeature) {
            const runwayRef = d.currentRunwayLabel || runwayDisplayRef(newFeature, d.bearingDeg);
            queueNotification("runway", "ENTERING RUNWAY", runwayRef, Number.isFinite(d.speedKt) ? `${Math.round(d.speedKt)} kt` : "", `runway-enter:${nextKey}`, 2900);
            d.suppressTaxiUntil = now + 2800;
            d.lastHoldAlertKey = null;
            return;
        }
        if (oldKey && !nextKey && oldFeature) {
            const runwayRef = oldLabel || runwayDisplayRef(oldFeature, d.bearingDeg);
            const taxiRef = taxiHit?.ref || null;
            queueNotification("success", "VACATED RUNWAY", runwayRef, taxiRef ? `TAXIWAY ${taxiRef}` : "", `runway-vacated:${oldKey}`, 2800);
            if (taxiRef) {
                d.currentTaxiRef = taxiRef;
                d.taxiCandidateRef = null;
                d.taxiCandidateSince = 0;
            }
            d.suppressTaxiUntil = now + 2800;
        }
    }
    function commitTaxiwayState(taxiHit, now) {
        const d = state.detector;
        if (d.currentRunwayKey) return;
        const nextRef = taxiHit && taxiHit.distance <= CFG.taxiwayAcquireDistanceM ? taxiHit.ref : null;
        if (nextRef === d.currentTaxiRef) {
            d.taxiCandidateRef = null;
            d.taxiCandidateSince = 0;
            return;
        }
        if (nextRef !== d.taxiCandidateRef) {
            d.taxiCandidateRef = nextRef;
            d.taxiCandidateSince = now;
            return;
        }
        if (now - d.taxiCandidateSince < CFG.taxiwayStableMs) return;
        d.currentTaxiRef = nextRef;
        d.taxiCandidateRef = null;
        d.taxiCandidateSince = 0;
        if (d.initialized && nextRef && now >= d.suppressTaxiUntil) {
            queueNotification("taxi", "ENTERING TAXIWAY", nextRef, "", `taxiway:${nextRef}`, 2200);
        }
    }
    function detectParking(position, parking, now) {
        const d = state.detector;
        const stand = nearestParkingStand(position, parking);
        const eligible = !d.currentRunwayKey && stand && stand.distance <= CFG.standParkDistanceM && d.speedKt <= CFG.standParkMaxSpeedKt;
        if (!eligible) {
            d.standCandidateRef = null;
            d.standCandidateSince = 0;
            if (d.parkedStandRef && (!stand || stand.distance > CFG.standReleaseDistanceM || d.speedKt > CFG.standReleaseSpeedKt)) {
                d.parkedStandRef = null;
            }
            return;
        }
        if (stand.ref === d.parkedStandRef) return;
        if (stand.ref !== d.standCandidateRef) {
            d.standCandidateRef = stand.ref;
            d.standCandidateSince = now;
            return;
        }
        if (now - d.standCandidateSince < CFG.standStableMs) return;
        d.parkedStandRef = stand.ref;
        d.standCandidateRef = null;
        d.standCandidateSince = 0;
        if (!d.initialized) return;
        queueNotification("success", "PARKED AT STAND", stand.ref, `${Math.round(stand.distance)} m from stop point`, `parked:${stand.ref}`, 3200);
    }
    function clearGroundEventStateForFlight() {
        const d = state.detector;
        d.initialized = false;
        d.taxiSpeedWarningActive = false;
        d.currentTaxiRef = null;
        d.taxiCandidateRef = null;
        d.taxiCandidateSince = 0;
        d.currentRunwayKey = null;
        d.currentRunwayFeature = null;
        d.currentRunwayLabel = null;
        d.runwayCandidateKey = null;
        d.runwayCandidateFeature = null;
        d.runwayCandidateSince = 0;
        d.lastHoldAlertKey = null;
        d.parkedStandRef = null;
        d.standCandidateRef = null;
        d.standCandidateSince = 0;
        d.suppressTaxiUntil = 0;
    }
    function handleHighSpeedGroundSuppression() {
        const d = state.detector;
        if (!d.highSpeedSuppressed && d.speedKt >= CFG.flightSuppressSpeedKt) {
            d.highSpeedSuppressed = true;
            d.taxiSpeedFlightLatch = true;
            clearGroundEventStateForFlight();
            state.notificationQueue = [];
            return true;
        }
        if (d.highSpeedSuppressed && d.speedKt <= CFG.flightResumeSpeedKt) {
            d.highSpeedSuppressed = false;
            clearGroundEventStateForFlight();
            return false;
        }
        return d.highSpeedSuppressed;
    }
    function detectTaxiSpeedWarning(runwayHit, taxiHit) {
        const d = state.detector;
        if (d.taxiSpeedFlightLatch) {
            if (d.speedKt <= CFG.taxiSpeedResetKt) {
                d.taxiSpeedFlightLatch = false;
                d.taxiSpeedWarningActive = false;
            }
            return;
        }
        const onRunway = !!d.currentRunwayKey || !!runwayHit;
        if (onRunway) {
            if (d.speedKt <= CFG.taxiSpeedResetKt) {
                d.taxiSpeedWarningActive = false;
            }
            return;
        }
        const onTaxiway = !!taxiHit && !!taxiHit.ref && taxiHit.distance <= CFG.taxiwayAcquireDistanceM;
        if (!onTaxiway) {
            if (d.speedKt <= CFG.taxiSpeedResetKt) {
                d.taxiSpeedWarningActive = false;
            }
            return;
        }
        if (d.speedKt <= CFG.taxiSpeedResetKt) {
            d.taxiSpeedWarningActive = false;
            return;
        }
        if (!d.taxiSpeedWarningActive && d.speedKt >= CFG.taxiSpeedWarningKt) {
            d.taxiSpeedWarningActive = true;
            queueNotification("warning", "HIGH TAXI SPEED", `${Math.round(d.speedKt)} KT`, "Reduce taxi speed", "taxi-speed-warning", 2500);
        }
    }
    function detectorTick() {
        if (!state.notificationsEnabled || !state.taxiways.size && !state.runways.size && !state.parking.size && !state.holdings.size) {
            return;
        }
        const position = aircraftLL();
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lon)) return;
        const now = Date.now();
        const teleported = updateDetectorMotion(position, now);
        if (teleported) return;
        if (handleHighSpeedGroundSuppression()) return;
        const datasets = nearbyChunkDatasets(position);
        if (!datasets.length) return;
        const taxiways = collectNearbyFeatures(datasets, "taxiways");
        const holdings = collectNearbyFeatures(datasets, "holdings");
        const parking = collectNearbyFeatures(datasets, "parking");
        const runways = collectNearbyFeatures(datasets, "runways");
        const taxiHit = nearestNamedTaxiway(position, taxiways);
        const runwayHit = nearestRunwayHit(position, runways);
        if (!state.detector.initialized) {
            state.detector.currentTaxiRef = taxiHit && taxiHit.distance <= CFG.taxiwayAcquireDistanceM ? taxiHit.ref : null;
            state.detector.currentRunwayKey = runwayHit?.key || null;
            state.detector.currentRunwayFeature = runwayHit?.feature || null;
            state.detector.currentRunwayLabel = runwayHit?.feature ? runwayDisplayRef(runwayHit.feature, state.detector.bearingDeg) : null;
            state.detector.taxiSpeedWarningActive = !runwayHit && state.detector.speedKt >= CFG.taxiSpeedWarningKt;
            state.detector.initialized = true;
            const initialStand = nearestParkingStand(position, parking);
            if (initialStand && initialStand.distance <= CFG.standParkDistanceM && state.detector.speedKt <= CFG.standParkMaxSpeedKt) {
                state.detector.parkedStandRef = initialStand.ref;
            }
            return;
        }
        commitRunwayState(runwayHit, taxiHit, now);
        commitTaxiwayState(taxiHit, now);
        detectTaxiSpeedWarning(runwayHit, taxiHit);
        detectParking(position, parking, now);
    }
    function startDetector() {
        if (state.detectorTimer) return;
        state.detectorTimer = setInterval(detectorTick, CFG.detectorIntervalMs);
    }
    function drawPolyline(ctx, points, toPixel, widthPx, opacity = 1) {
        if (!Array.isArray(points) || points.length < 2) return;
        const first = toPixel(points[0]);
        ctx.save();
        ctx.strokeStyle = CFG.yellow;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = widthPx;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < points.length; i++) {
            const p = toPixel(points[i]);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.restore();
    }
    function drawBarLine(ctx, center, angle, lengthPx, offsetPx, widthPx, dashed, dashPx, gapPx) {
        const normalX = -Math.sin(angle);
        const normalY = Math.cos(angle);
        const cx = center.x + normalX * offsetPx;
        const cy = center.y + normalY * offsetPx;
        const half = lengthPx / 2;
        const dx = Math.cos(angle) * half;
        const dy = Math.sin(angle) * half;
        ctx.save();
        ctx.strokeStyle = CFG.yellow;
        ctx.lineWidth = widthPx;
        ctx.lineCap = "butt";
        ctx.setLineDash(dashed ? [ Math.max(1, dashPx), Math.max(1, gapPx) ] : []);
        ctx.beginPath();
        ctx.moveTo(cx - dx, cy - dy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
        ctx.restore();
    }
    function holdingGeometry(feature, toPixel) {
        if (feature.osmType === "way" && feature.points?.length >= 2) {
            const middle = midpointOfPath(feature.points, toPixel);
            if (!middle) return null;
            const localMovement = featuresForChunk(feature.chunkKey, "movement");
            const nearestMovement = localMovement.length ? nearestPathSegment({
                x: middle.x,
                y: middle.y
            }, localMovement, toPixel) : null;
            return {
                center: {
                    x: middle.x,
                    y: middle.y
                },
                barAngle: middle.angle,
                nearestMovement: nearestMovement
            };
        }
        if (feature.point) {
            const center = toPixel(feature.point);
            let movement = featuresForChunk(feature.chunkKey, "movement");
            let nearestMovement = movement.length ? nearestPathSegment(center, movement, toPixel) : null;
            if (!nearestMovement) {
                movement = [ ...state.taxiways.values(), ...state.taxilanes.values() ];
                nearestMovement = nearestPathSegment(center, movement, toPixel);
            }
            if (!nearestMovement) return null;
            return {
                center: center,
                barAngle: nearestMovement.angle + Math.PI / 2,
                nearestMovement: nearestMovement
            };
        }
        return null;
    }
    function runwaySideSign(feature, center, barAngle, toPixel) {
        let runways = featuresForChunk(feature.chunkKey, "runways");
        let runway = runways.length ? nearestPathSegment(center, runways, toPixel) : null;
        if (!runway && state.runways.size) {
            runway = nearestPathSegment(center, [ ...state.runways.values() ], toPixel);
        }
        if (!runway) return 1;
        const vx = runway.x - center.x;
        const vy = runway.y - center.y;
        const normalX = -Math.sin(barAngle);
        const normalY = Math.cos(barAngle);
        return vx * normalX + vy * normalY >= 0 ? 1 : -1;
    }
    function drawHoldingPositions(ctx, toPixel, metersPerPixel) {
        for (const feature of state.holdings.values()) {
            const geometry = holdingGeometry(feature, toPixel);
            if (!geometry) continue;
            const widthM = parseWidthMeters(geometry.nearestMovement?.feature?.tags?.width) || CFG.holdDefaultTaxiwayWidthM;
            const lengthPx = clamp(widthM * 1.1, CFG.holdMinLengthM, CFG.holdMaxLengthM) / metersPerPixel;
            const lineWidthPx = CFG.holdLineWidthM / metersPerPixel;
            const pairPx = CFG.holdPairSpacingM / metersPerPixel;
            const groupPx = CFG.holdGroupSpacingM / metersPerPixel;
            const dashPx = CFG.holdDashM / metersPerPixel;
            const gapPx = CFG.holdGapM / metersPerPixel;
            const type = String(feature.holdType || "").trim().toLowerCase();
            const runwaySign = runwaySideSign(feature, geometry.center, geometry.barAngle, toPixel);
            if (type === "ils") {
                const sepPx = 3 / metersPerPixel;
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, -sepPx / 2, lineWidthPx, false, 0, 0);
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, sepPx / 2, lineWidthPx, false, 0, 0);
            } else if (type === "intermediate") {
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, 0, lineWidthPx, true, dashPx, gapPx);
            } else {
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, -runwaySign * (groupPx + pairPx / 2), lineWidthPx, false, 0, 0);
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, -runwaySign * (groupPx - pairPx / 2), lineWidthPx, false, 0, 0);
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, runwaySign * (groupPx - pairPx / 2), lineWidthPx, true, dashPx, gapPx);
                drawBarLine(ctx, geometry.center, geometry.barAngle, lengthPx, runwaySign * (groupPx + pairPx / 2), lineWidthPx, true, dashPx, gapPx);
            }
        }
    }
    function normalizeRef(raw) {
        if (typeof raw !== "string") return null;
        return raw.split(";").map(part => part.trim()).filter(Boolean).join("/") || null;
    }
    function drawStandText(ctx, text, x, y, metersPerPixel) {
        if (!state.standNumbersEnabled || !text) return;
        const fontPx = clamp(CFG.standFontM / metersPerPixel, CFG.standMinPx, CFG.standMaxPx);
        ctx.save();
        ctx.font = `700 ${fontPx}px Arial, Helvetica, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = Math.max(2, fontPx * .18);
        ctx.strokeStyle = "rgba(0,0,0,.72)";
        ctx.fillStyle = CFG.yellow;
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    function drawParking(ctx, toPixel, metersPerPixel) {
        const drawPhysical = state.standLeadInsEnabled;
        const widthPx = CFG.parkingLineWidthM / metersPerPixel;
        const labelWinnerByRef = new Map;
        for (const feature of state.parking.values()) {
            const refKey = normalizeStandQuery(normalizeRef(feature.ref));
            const target = parkingTargetPoint(feature);
            if (!refKey || !target) continue;
            const taxiwayDistance = distanceToMovementNetwork(target, [ state.taxiways ]);
            const score = Number.isFinite(taxiwayDistance) ? taxiwayDistance : 1e6;
            const existing = labelWinnerByRef.get(refKey);
            if (!existing || score > existing.score) {
                labelWinnerByRef.set(refKey, {
                    feature: feature,
                    score: score
                });
            }
        }
        for (const feature of state.parking.values()) {
            const refKey = normalizeStandQuery(normalizeRef(feature.ref));
            const drawLabel = !!refKey && labelWinnerByRef.get(refKey)?.feature === feature;
            if (feature.osmType === "way" && feature.points?.length >= 2) {
                const target = parkingTargetPoint(feature) || feature.points.at(-1);
                const targetAtStart = target === feature.points[0];
                const end = toPixel(target);
                if (drawPhysical) {
                    drawPolyline(ctx, feature.points, toPixel, widthPx, .82);
                    const before = toPixel(targetAtStart ? feature.points[1] : feature.points.at(-2));
                    const angle = Math.atan2(end.y - before.y, end.x - before.x) + Math.PI / 2;
                    drawBarLine(ctx, end, angle, CFG.parkingStopBarM / metersPerPixel, 0, widthPx, false, 0, 0);
                }
                if (drawLabel) drawStandText(ctx, normalizeRef(feature.ref), end.x, end.y - 6 / metersPerPixel, metersPerPixel);
            } else if (feature.point) {
                const p = toPixel(feature.point);
                if (drawPhysical) {
                    ctx.save();
                    ctx.fillStyle = CFG.yellow;
                    ctx.globalAlpha = .82;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.max(1, CFG.parkingNodeRadiusM / metersPerPixel), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                if (drawLabel) drawStandText(ctx, normalizeRef(feature.ref), p.x, p.y - 6 / metersPerPixel, metersPerPixel);
            }
        }
    }
    function interpolateAlongPixelPath(pixelPoints, targetDistance) {
        let travelled = 0;
        for (let i = 1; i < pixelPoints.length; i++) {
            const a = pixelPoints[i - 1];
            const b = pixelPoints[i];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const length = Math.hypot(dx, dy);
            if (length <= 1e-6) continue;
            if (travelled + length >= targetDistance) {
                const t = (targetDistance - travelled) / length;
                let angle = Math.atan2(dy, dx);
                if (angle > Math.PI / 2) angle -= Math.PI;
                if (angle < -Math.PI / 2) angle += Math.PI;
                return {
                    x: a.x + dx * t,
                    y: a.y + dy * t,
                    angle: angle
                };
            }
            travelled += length;
        }
        return null;
    }
    function boxesOverlap(a, b, margin = 3) {
        return !(a.right + margin < b.left || a.left - margin > b.right || a.bottom + margin < b.top || a.top - margin > b.bottom);
    }
    function roundedRect(ctx, x, y, width, height, radius) {
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            return;
        }
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
    function drawTaxiwayLabels(ctx, toPixel, metersPerPixel) {
        if (!state.taxiwayLabelsEnabled) return;
        const candidates = [];
        const repeatPx = CFG.taxiLabelRepeatM / metersPerPixel;
        for (const way of state.taxiways.values()) {
            const ref = normalizeRef(way.ref);
            if (!ref || !way.points || way.points.length < 2) continue;
            const pixels = way.points.map(toPixel);
            let totalLength = 0;
            for (let i = 1; i < pixels.length; i++) {
                totalLength += Math.hypot(pixels[i].x - pixels[i - 1].x, pixels[i].y - pixels[i - 1].y);
            }
            if (totalLength <= 1) continue;
            const count = totalLength > repeatPx * 1.35 ? Math.max(1, Math.floor(totalLength / repeatPx)) : 1;
            for (let i = 1; i <= count; i++) {
                const target = totalLength * i / (count + 1);
                const point = interpolateAlongPixelPath(pixels, target);
                if (point) candidates.push({
                    ref: ref,
                    ...point
                });
            }
        }
        const fontPx = clamp(CFG.taxiLabelFontM / metersPerPixel, CFG.taxiLabelMinPx, CFG.taxiLabelMaxPx);
        const paddingPx = Math.max(2, CFG.taxiLabelPaddingM / metersPerPixel);
        const offsetPx = CFG.taxiLabelOffsetM / metersPerPixel;
        const sameRefSpacingPx = CFG.taxiLabelSameRefMinM / metersPerPixel;
        const placedBoxes = [];
        const placedByRef = new Map;
        ctx.save();
        ctx.font = `700 ${fontPx}px Arial, Helvetica, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const candidate of candidates) {
            const sameRef = placedByRef.get(candidate.ref) || [];
            if (sameRef.some(existing => Math.hypot(candidate.x - existing.x, candidate.y - existing.y) < sameRefSpacingPx)) {
                continue;
            }
            const textWidth = ctx.measureText(candidate.ref).width;
            const boxWidth = textWidth + paddingPx * 2.3;
            const boxHeight = fontPx + paddingPx * 1.7;
            const normalX = -Math.sin(candidate.angle);
            const normalY = Math.cos(candidate.angle);
            let chosen = null;
            for (const side of [ 1, -1, 0 ]) {
                const x = candidate.x + normalX * offsetPx * side;
                const y = candidate.y + normalY * offsetPx * side;
                const box = {
                    left: x - boxWidth / 2,
                    right: x + boxWidth / 2,
                    top: y - boxHeight / 2,
                    bottom: y + boxHeight / 2
                };
                if (!placedBoxes.some(existing => boxesOverlap(box, existing))) {
                    chosen = {
                        x: x,
                        y: y,
                        box: box
                    };
                    break;
                }
            }
            if (!chosen) continue;
            ctx.save();
            ctx.translate(chosen.x, chosen.y);
            ctx.rotate(candidate.angle);
            roundedRect(ctx, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, Math.max(2, fontPx * .18));
            ctx.fillStyle = "rgba(18,20,22,.88)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,210,26,.92)";
            ctx.lineWidth = Math.max(1, fontPx * .08);
            ctx.stroke();
            ctx.fillStyle = CFG.yellow;
            ctx.fillText(candidate.ref, 0, .5);
            ctx.restore();
            placedBoxes.push(chosen.box);
            sameRef.push({
                x: candidate.x,
                y: candidate.y
            });
            placedByRef.set(candidate.ref, sameRef);
        }
        ctx.restore();
    }
    function renderCanvas(quality) {
        const bounds = computeTightBounds();
        if (!bounds) throw new Error("No ground geometry to render");
        const middleLat = (bounds.south + bounds.north) / 2;
        const cosLat = Math.max(.15, Math.cos(middleLat * Math.PI / 180));
        const heightM = (bounds.north - bounds.south) * 111320;
        const widthM = (bounds.east - bounds.west) * 111320 * cosLat;
        const longestGroundDimension = Math.max(widthM, heightM);
        const desiredMetersPerPixel = CFG.taxiwayWidthM / CFG.targetStrokePixels;
        let longestCanvasDimension;
        if (quality === 1) {
            longestCanvasDimension = Math.min(CFG.previewCanvasMax, Math.max(2048, Math.ceil(longestGroundDimension / desiredMetersPerPixel)));
        } else {
            longestCanvasDimension = Math.ceil(longestGroundDimension / desiredMetersPerPixel);
            longestCanvasDimension = Math.max(CFG.finalCanvasBase, longestCanvasDimension);
            longestCanvasDimension = Math.min(CFG.finalCanvasMax, longestCanvasDimension);
        }
        let width;
        let height;
        if (widthM >= heightM) {
            width = longestCanvasDimension;
            height = Math.max(512, Math.round(width * heightM / widthM));
        } else {
            height = longestCanvasDimension;
            width = Math.max(512, Math.round(height * widthM / heightM));
        }
        const metersPerPixel = (widthM / width + heightM / height) / 2;
        console.log("[TWY RENDER]", {
            quality: quality === 1 ? "preview" : "final",
            canvas: `${width}×${height}`,
            taxiways: state.taxiways.size,
            taxilanes: state.taxilanes.size,
            holds: state.holdings.size,
            stands: state.parking.size
        });
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", {
            alpha: true
        });
        ctx.clearRect(0, 0, width, height);
        const lonRange = bounds.east - bounds.west;
        const latRange = bounds.north - bounds.south;
        function toPixel(point) {
            return {
                x: (point.lon - bounds.west) / lonRange * width,
                y: (bounds.north - point.lat) / latRange * height
            };
        }
        const taxiwayWidthPx = CFG.taxiwayWidthM / metersPerPixel;
        const taxilaneWidthPx = CFG.taxilaneWidthM / metersPerPixel;
        for (const taxiway of state.taxiways.values()) {
            drawPolyline(ctx, taxiway.points, toPixel, taxiwayWidthPx, 1);
        }
        for (const taxilane of state.taxilanes.values()) {
            drawPolyline(ctx, taxilane.points, toPixel, taxilaneWidthPx, CFG.taxilaneOpacity);
        }
        drawHoldingPositions(ctx, toPixel, metersPerPixel);
        drawParking(ctx, toPixel, metersPerPixel);
        drawTaxiwayLabels(ctx, toPixel, metersPerPixel);
        const result = {
            canvas: canvas,
            bounds: bounds
        };
        return result;
    }
    function canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("PNG export failed"));
                    return;
                }
                resolve(blob);
            }, "image/png");
        });
    }
    async function installCanvas(canvas, bounds, serial) {
        const Cesium = window.Cesium;
        const layers = getImageryLayers();
        if (!layers) {
            return;
        }
        const blob = await canvasToBlob(canvas);
        if (serial !== state.renderSerial) {
            return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const rectangle = Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north);
        let provider;
        if (Cesium.SingleTileImageryProvider && typeof Cesium.SingleTileImageryProvider.fromUrl === "function") {
            provider = await Cesium.SingleTileImageryProvider.fromUrl(blobUrl, {
                rectangle: rectangle
            });
        } else {
            provider = new Cesium.SingleTileImageryProvider({
                url: blobUrl,
                rectangle: rectangle
            });
        }
        if (serial !== state.renderSerial) {
            URL.revokeObjectURL(blobUrl);
            return;
        }
        const newLayer = typeof layers.addImageryProvider === "function" ? layers.addImageryProvider(provider) : layers.add(new Cesium.ImageryLayer(provider));
        newLayer.alpha = 1;
        newLayer.show = true;
        const oldLayer = state.layer;
        const oldBlob = state.blobUrl;
        state.layer = newLayer;
        state.blobUrl = blobUrl;
        if (oldLayer) {
            try {
                layers.remove(oldLayer, true);
            } catch (_) {
                try {
                    layers.remove(oldLayer);
                } catch (_) {}
            }
        }
        if (oldBlob) {
            setTimeout(() => {
                try {
                    URL.revokeObjectURL(oldBlob);
                } catch (_) {}
            }, 600);
        }
    }
    function requestRender(quality, delayMs = 0) {
        state.pendingRenderQuality = Math.max(state.pendingRenderQuality, quality);
        if (state.renderBusy) return;
        if (state.renderTimer) clearTimeout(state.renderTimer);
        state.renderTimer = setTimeout(() => {
            state.renderTimer = null;
            runRenderLoop();
        }, delayMs);
    }
    async function runRenderLoop() {
        if (state.renderBusy) return;
        if (!state.pendingRenderQuality) return;
        if (!state.taxiways.size && !state.taxilanes.size && !state.parking.size && !state.holdings.size) return;
        state.renderBusy = true;
        try {
            while (state.pendingRenderQuality) {
                const quality = state.pendingRenderQuality;
                state.pendingRenderQuality = 0;
                const serial = ++state.renderSerial;
                try {
                    const rendered = renderCanvas(quality);
                    await installCanvas(rendered.canvas, rendered.bounds, serial);
                } catch (error) {
                    console.error("[TWY RENDER]", error);
                }
            }
        } finally {
            state.renderBusy = false;
        }
    }
    function removeCurrentOverlay() {
        const layers = getImageryLayers();
        if (layers && state.layer) {
            try {
                layers.remove(state.layer, true);
            } catch (_) {
                try {
                    layers.remove(state.layer);
                } catch (_) {}
            }
        }
        state.layer = null;
        if (state.blobUrl) {
            try {
                URL.revokeObjectURL(state.blobUrl);
            } catch (_) {}
            state.blobUrl = null;
        }
    }
    function autoLoadPositionInsideCoverage(position) {
        const bounds = state.queryBounds;
        if (!bounds) return false;
        return position.lat >= bounds.south && position.lat <= bounds.north && position.lon >= bounds.west && position.lon <= bounds.east;
    }
    function updateAutoLoadMotion(position, now) {
        const a = state.autoLoad;
        if (!a.lastPosition || !a.lastSampleTime) {
            a.lastPosition = {
                ...position
            };
            a.lastSampleTime = now;
            a.speedKt = 0;
            return;
        }
        const dt = (now - a.lastSampleTime) / 1e3;
        if (dt <= 0 || dt > 5) {
            a.lastPosition = {
                ...position
            };
            a.lastSampleTime = now;
            return;
        }
        const distance = geoDistanceMeters(a.lastPosition, position);
        const rawSpeedKt = distance / dt * 1.943844;
        if (distance > 2) {
            a.bearingDeg = bearingDegrees(a.lastPosition, position);
        }
        if (rawSpeedKt > 500 || distance > 2500) {
            a.speedKt = 500;
            a.candidateSince = 0;
        } else {
            a.speedKt = a.speedKt * .45 + rawSpeedKt * .55;
        }
        a.lastPosition = {
            ...position
        };
        a.lastSampleTime = now;
    }
    function autoLoadResetBlockActive(position) {
        const blockedAt = state.autoLoad.resetBlockPosition;
        if (!blockedAt) return false;
        const distance = geoDistanceMeters(blockedAt, position);
        if (distance >= CFG.autoLoadResetReleaseDistanceM) {
            state.autoLoad.resetBlockPosition = null;
            return false;
        }
        return true;
    }
    function clearAirportRuntimeKeepCache() {
        abortActiveWork();
        resetDetectorState();
        clearNotificationQueue();
        resetMinimapAirportData();
        resetStandListMetadata();
        state.running = false;
        removeCurrentOverlay();
        removeStandLocatorEntities({
            clearSelection: true
        });
        clearRuntimeData();
        state.chunks = [];
        state.queryBounds = null;
        state.gridSignature = null;
        state.totalChunks = 0;
        state.completedChunks = 0;
        state.successfulChunks = 0;
        state.failedChunks = 0;
        state.cachedChunks = 0;
        state.failedChunkKeys = new Set;
        state.earlyPreviewRequested = false;
        state.midPreviewRequested = false;
        state.autoLoad.candidateSince = 0;
    }
    function unloadAirportForFlight() {
        disarmModifyArrival();
        clearAirportRuntimeKeepCache();
        state.arrival.flightPlanManualOverride = false;
        state.arrival.flightPlanNextCheckAt = 0;
        state.arrivalMode = true;
        state.arrival.departureOutsideSince = 0;
        state.arrival.protectionUntil = 0;
        state.arrival.selectedAirport = null;
        state.arrival.manualModifyAvailable = false;
        state.arrival.groundConfirmSince = 0;
        resetArrivalLockState();
        state.arrival.selectedBestDistanceM = null;
        state.arrival.movingAwaySince = 0;
        closeArrivalChooser();
        setStatus("Airborne · ARR available", "idle");
        updateStandLocatorStatus();
        updateUI();
        showArrivalModeCue();
        console.log("[TWY] Departure detected: airport overlay/data unloaded; cache retained.");
    }
    function arrivalProtectionActive(position, now) {
        if (!state.arrival.protectionUntil) return false;
        const selected = state.arrival.selectedAirport;
        if (autoLoadPositionInsideCoverage(position)) {
            state.arrival.movingAwaySince = 0;
            if (state.arrival.manualModifyAvailable) {
                return true;
            }
            state.arrival.protectionUntil = 0;
            state.arrival.selectedBestDistanceM = null;
            return false;
        }
        if (now >= state.arrival.protectionUntil) {
            state.arrival.protectionUntil = 0;
            state.arrival.selectedBestDistanceM = null;
            state.arrival.movingAwaySince = 0;
            return false;
        }
        if (!selected?.center) {
            return true;
        }
        const distance = geoDistanceMeters(position, selected.center);
        if (!Number.isFinite(state.arrival.selectedBestDistanceM)) {
            state.arrival.selectedBestDistanceM = distance;
        }
        if (distance < state.arrival.selectedBestDistanceM) {
            state.arrival.selectedBestDistanceM = distance;
            state.arrival.movingAwaySince = 0;
            return true;
        }
        const increase = distance - state.arrival.selectedBestDistanceM;
        if (state.autoLoad.speedKt < CFG.arrivalWrongAirportMinSpeedKt) {
            state.arrival.movingAwaySince = 0;
            return true;
        }
        if (increase < CFG.arrivalWrongAirportDistanceIncreaseM) {
            state.arrival.movingAwaySince = 0;
            return true;
        }
        if (!state.arrival.movingAwaySince) {
            state.arrival.movingAwaySince = now;
            return true;
        }
        if (now - state.arrival.movingAwaySince < CFG.arrivalWrongAirportStableMs) {
            return true;
        }
        console.log("[TWY ARR] Selected arrival appears wrong; releasing protection.", {
            airport: airportPrimaryCode(selected),
            closestDistanceM: state.arrival.selectedBestDistanceM,
            currentDistanceM: distance,
            increaseM: increase
        });
        state.arrival.protectionUntil = 0;
        state.arrival.movingAwaySince = 0;
        return false;
    }
    function maybeUnloadDepartedAirport(position, now) {
        if (!state.queryBounds) {
            state.arrival.departureOutsideSince = 0;
            return false;
        }
        if (arrivalProtectionActive(position, now)) {
            state.arrival.departureOutsideSince = 0;
            return false;
        }
        const outside = !autoLoadPositionInsideCoverage(position);
        if (!outside || state.autoLoad.speedKt < CFG.departureUnloadMinSpeedKt) {
            state.arrival.departureOutsideSince = 0;
            return false;
        }
        if (!state.arrival.departureOutsideSince) {
            state.arrival.departureOutsideSince = now;
            return false;
        }
        if (now - state.arrival.departureOutsideSince < CFG.departureUnloadStableMs) {
            return false;
        }
        unloadAirportForFlight();
        return true;
    }
    function nearestFeatureDistanceMeters(position, features) {
        let best = Infinity;
        for (const feature of features || []) {
            const distance = featureDistanceMeters(position, feature);
            if (distance < best) {
                best = distance;
            }
        }
        return best;
    }
    function arrivalHasGroundGeometry(position) {
        const datasets = nearbyChunkDatasets(position, Math.max(CFG.detectorSearchRadiusM, CFG.arrivalGroundMovementDistanceM + 40));
        if (!datasets.length) return false;
        const runways = collectNearbyFeatures(datasets, "runways");
        if (nearestRunwayHit(position, runways)) {
            return true;
        }
        const taxiways = collectNearbyFeatures(datasets, "taxiways");
        const taxilanes = collectNearbyFeatures(datasets, "taxilanes");
        const taxiwayDistance = nearestFeatureDistanceMeters(position, taxiways);
        const taxilaneDistance = nearestFeatureDistanceMeters(position, taxilanes);
        return taxiwayDistance <= CFG.arrivalGroundMovementDistanceM || taxilaneDistance <= CFG.arrivalGroundMovementDistanceM;
    }
    function updateArrivalGroundConfirmation(position, now) {
        const arrival = state.arrival;
        if (!arrival.manualModifyAvailable || !arrival.selectedAirport) {
            arrival.groundConfirmSince = 0;
            return;
        }
        const insideCoverage = autoLoadPositionInsideCoverage(position);
        const slowEnough = state.autoLoad.speedKt <= CFG.autoLoadMaxSpeedKt;
        if (!insideCoverage || !slowEnough) {
            arrival.groundConfirmSince = 0;
            return;
        }
        if (!arrivalHasGroundGeometry(position)) {
            arrival.groundConfirmSince = 0;
            return;
        }
        if (!arrival.groundConfirmSince) {
            arrival.groundConfirmSince = now;
            return;
        }
        if (now - arrival.groundConfirmSince < CFG.arrivalGroundConfirmMs) {
            return;
        }
        arrival.manualModifyAvailable = false;
        arrival.groundConfirmSince = 0;
        arrival.protectionUntil = 0;
        arrival.selectedAirport = null;
        arrival.selectedBestDistanceM = null;
        arrival.movingAwaySince = 0;
        resetArrivalLockState();
        disarmModifyArrival();
        updateUI();
        console.log("[TWY ARR] Arrival ground confirmed; normal TWY lifecycle resumed.");
    }
    function handleActiveArrivalLock(position, now) {
        const arrival = state.arrival;
        if (!arrival.manualModifyAvailable || !arrival.selectedAirport) {
            return false;
        }
        if (arrival.preloadReady) {
            arrival.groundFallbackSince = 0;
            return true;
        }
        if (state.autoLoad.speedKt > CFG.autoLoadMaxSpeedKt) {
            arrival.groundFallbackSince = 0;
            return true;
        }
        const distance = geoDistanceMeters(position, arrival.selectedAirport.center);
        if (!Number.isFinite(distance) || distance > CFG.arrivalGroundFallbackRadiusM) {
            arrival.groundFallbackSince = 0;
            return true;
        }
        if (arrival.groundFallbackAttempts >= CFG.arrivalGroundFallbackMaxAttempts) {
            return true;
        }
        if (now - arrival.groundFallbackLastAttempt < CFG.arrivalGroundFallbackCooldownMs) {
            arrival.groundFallbackSince = 0;
            return true;
        }
        if (!arrival.groundFallbackSince) {
            arrival.groundFallbackSince = now;
            return true;
        }
        if (now - arrival.groundFallbackSince < CFG.arrivalGroundFallbackStableMs) {
            return true;
        }
        arrival.groundFallbackSince = 0;
        arrival.groundFallbackLastAttempt = now;
        arrival.groundFallbackAttempts++;
        const airport = arrival.selectedAirport;
        console.log("[TWY ARR] Preload had no useful data; trying ground-centred ARR recovery.", {
            airport: airportPrimaryCode(airport),
            attempt: arrival.groundFallbackAttempts,
            distanceM: distance
        });
        loadAirport({
            automatic: true,
            arrival: true,
            groundFallback: true,
            center: position,
            airport: airport
        });
        return true;
    }
    function autoLoadTick() {
        if (!state.autoLoadEnabled) {
            cancelFlightPlanArrival();
            return;
        }
        if (state.running) return;
        const position = aircraftLL();
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lon)) {
            return;
        }
        const now = Date.now();
        updateAutoLoadMotion(position, now);
        updateArrivalGroundConfirmation(position, now);
        if (maybeUnloadDepartedAirport(position, now)) {
            return;
        }
        if (updateFlightPlanArrival(position, now)) {
            return;
        }
        if (handleActiveArrivalLock(position, now)) {
            return;
        }
        // In ARR, low motion alone is not a landing: a paused or slow aircraft
        // may still be airborne. Destination activation above keeps its own
        // approach gate; the nearby-airport scan must wait for ground contact.
        if (state.arrivalMode && !window.geofs?.aircraft?.instance?.groundContact) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (now - state.autoLoad.startedAt < CFG.autoLoadInitialDelayMs) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (autoLoadResetBlockActive(position)) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (state.autoLoad.speedKt > CFG.autoLoadMaxSpeedKt) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (autoLoadPositionInsideCoverage(position)) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (now - state.autoLoad.lastTriggerTime < CFG.autoLoadCooldownMs) {
            state.autoLoad.candidateSince = 0;
            return;
        }
        if (!state.autoLoad.candidateSince) {
            state.autoLoad.candidateSince = now;
            return;
        }
        if (now - state.autoLoad.candidateSince < CFG.autoLoadStableMs) {
            return;
        }
        state.autoLoad.candidateSince = 0;
        state.autoLoad.lastTriggerTime = now;
        console.log("[TWY AUTOLOAD] Stable ground position outside current coverage; loading airport.", {
            lat: position.lat,
            lon: position.lon,
            speedKt: state.autoLoad.speedKt
        });
        loadAirport({
            automatic: true
        });
    }
    function startAutoLoadMonitor() {
        if (state.autoLoadTimer) return;
        state.autoLoad.startedAt = Date.now();
        state.autoLoadTimer = setInterval(autoLoadTick, CFG.autoLoadCheckMs);
    }
    function abortActiveWork() {
        cancelFlightPlanArrival();
        state.loadGeneration++;
        for (const controller of state.controllers) {
            try {
                controller.abort();
            } catch (_) {}
        }
        state.controllers.clear();
        state.requestGate = Promise.resolve();
        state.lastRequestStart = 0;
        if (state.renderTimer) {
            clearTimeout(state.renderTimer);
            state.renderTimer = null;
        }
        state.pendingRenderQuality = 0;
        state.renderSerial++;
    }
    async function loadAirport(options = {}) {
        if (state.running) return;
        disarmModifyArrival();
        const automatic = !!options.automatic;
        const arrival = !!options.arrival;
        const sourceCenter = options.center || aircraftLL();
        const center = {
            lat: Number(sourceCenter?.lat),
            lon: Number(sourceCenter?.lon)
        };
        if (!Number.isFinite(center.lat) || !Number.isFinite(center.lon)) {
            setStatus("Could not find aircraft position", "error");
            return;
        }
        abortActiveWork();
        resetDetectorState();
        // Keep the flight-plan detection alert visible/queued during its handoff.
        // Other airport loads retain the existing notification reset behavior.
        if (!options.flightPlanArrival) clearNotificationQueue();
        resetMinimapAirportData();
        resetStandListMetadata();
        closeArrivalChooser();
        state.arrivalMode = false;
        state.arrival.departureOutsideSince = 0;
        if (!arrival) {
            state.arrival.protectionUntil = 0;
            state.arrival.selectedAirport = null;
            state.arrival.manualModifyAvailable = false;
            state.arrival.groundConfirmSince = 0;
            resetArrivalLockState();
            state.arrival.selectedBestDistanceM = null;
            state.arrival.movingAwaySince = 0;
        }
        state.autoLoad.resetBlockPosition = null;
        state.autoLoad.candidateSince = 0;
        state.autoLoad.lastTriggerTime = Date.now();
        const generation = state.loadGeneration;
        const chunks = makeChunks(center);
        const signature = gridSignature(chunks);
        const moved = state.gridSignature !== null && state.gridSignature !== signature;
        if (moved) {
            removeCurrentOverlay();
            removeStandLocatorEntities({
                clearSelection: true
            });
        } else {
            removeStandLocatorEntities({
                clearSelection: false
            });
        }
        clearRuntimeData();
        state.running = true;
        state.chunks = chunks;
        state.queryBounds = getOverallBounds(chunks);
        state.gridSignature = signature;
        state.totalChunks = chunks.length;
        state.completedChunks = 0;
        state.successfulChunks = 0;
        state.failedChunks = 0;
        state.cachedChunks = 0;
        state.failedChunkKeys = new Set;
        state.earlyPreviewRequested = false;
        state.midPreviewRequested = false;
        const arrivalCode = arrival && options.airport ? airportPrimaryCode(options.airport) : null;
        if (arrivalCode && /^[A-Z]{4}$/i.test(arrivalCode)) {} else if (moved && !arrivalCode) {}
        setStatus(arrivalCode ? `Loading arrival ${arrivalCode}…` : automatic ? "Auto-loading airport ground data…" : "Finding airport ground data…", "loading");
        updateUI();
        await runQueue(chunks, generation, { prefetchedChunks: options.prefetchedChunks });
        if (generation !== state.loadGeneration) return;
        const hadInitialFailures = state.failedChunkKeys.size > 0;
        if (hadInitialFailures) {
            await recoverFailedChunks(generation);
        }
        if (generation !== state.loadGeneration) return;
        state.running = false;
        if (state.renderTimer) {
            clearTimeout(state.renderTimer);
            state.renderTimer = null;
        }
        state.pendingRenderQuality = Math.max(state.pendingRenderQuality, 2);
        await runRenderLoop();
        reacquireSelectedStandAfterLoad();
        if (state.standListWindow?.classList.contains("open")) ensureStandListMetadata();
        const usefulData = hasUsefulAirportData();
        if (arrival && options.airport) {
            state.arrival.preloadReady = usefulData;
            if (usefulData) {
                state.arrival.groundFallbackSince = 0;
            }
        }
        if (!usefulData) {
            setStatus(arrival && options.airport ? "Arrival preload incomplete · ground retry armed" : "Couldn’t load airport ground data this time", "error");
        } else if (state.taxiways.size === 0 && state.taxilanes.size === 0) {
            setStatus("Airport loaded · no mapped taxiways", "ready");
        } else if (state.failedChunks > 0) {
            setStatus(`Ready · ${state.failedChunks} area${state.failedChunks === 1 ? "" : "s"} still unavailable after retry`, "loading");
        } else if (hadInitialFailures) {
            setStatus("Airport ground ready · missing areas recovered", "ready");
        } else if (state.cachedChunks === state.totalChunks) {
            setStatus("Ready · loaded from cache", "ready");
        } else {
            setStatus("Airport ground ready", "ready");
        }
        updateUI();
        if (arrival && options.airport && usefulData) {
            const code = airportPrimaryCode(options.airport);
            queueNotification("success", "AIRPORT READY", code, state.taxiways.size || state.taxilanes.size ? "Ground map loaded" : "Airport data loaded", `arrival-ready:${code}`, 2400);
        }
    }
    function resetAirport() {
        const resetPosition = aircraftLL();
        disarmModifyArrival();
        abortActiveWork();
        resetDetectorState();
        clearNotificationQueue();
        resetMinimapAirportData();
        resetStandListMetadata();
        closeArrivalChooser();
        state.arrivalMode = false;
        state.arrival.departureOutsideSince = 0;
        state.arrival.protectionUntil = 0;
        state.arrival.selectedAirport = null;
        state.arrival.manualModifyAvailable = false;
        state.arrival.groundConfirmSince = 0;
        resetArrivalLockState();
        state.running = false;
        if (Number.isFinite(resetPosition.lat) && Number.isFinite(resetPosition.lon)) {
            state.autoLoad.resetBlockPosition = {
                ...resetPosition
            };
        }
        state.autoLoad.candidateSince = 0;
        removeCurrentOverlay();
        removeStandLocatorEntities({
            clearSelection: true
        });
        clearGroundCache();
        clearRuntimeData();
        state.chunks = [];
        state.queryBounds = null;
        state.gridSignature = null;
        state.totalChunks = 0;
        state.completedChunks = 0;
        state.successfulChunks = 0;
        state.failedChunks = 0;
        state.cachedChunks = 0;
        state.failedChunkKeys = new Set;
        state.earlyPreviewRequested = false;
        state.midPreviewRequested = false;
        setStatus(state.autoLoadEnabled ? "Reset · auto-load waits for next airport" : "Ready when you are", "idle");
        updateUI();
        console.log("[TWY] Reset complete; airport data and cache cleared.");
    }
    async function main() {
        await waitForGeoFS();
        window.addEventListener("focus", refreshMarshallerAfterFocus);
        document.addEventListener("visibilitychange", refreshMarshallerAfterFocus);
        addUI();
        startGroundHandlingMonitor();
        resetDetectorState();
        startDetector();
        startAutoLoadMonitor();
        startStandLocatorMonitor();
        if (state.followMe.enabled) startFollowMeMonitor();
        syncMarshaller();
        startMinimapMonitor();
        setStatus(state.autoLoadEnabled ? "Auto-load ready" : "Ready when you are", "idle");
        updateUI();
    }
    main();
})();
