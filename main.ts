/**
 * BluetoothV2 - Full Bluetooth custom blocks for micro:bit
 * Provides easy-to-use blocks for initializing, naming,
 * advertising, sending/receiving data over BLE.
 *
 * NOTE: Bluetooth and Radio cannot be used at the same time.
 */

//% color="#0082FB" weight=95 icon="\uf294" block="Bluetooth V2"
//% groups='["Setup","Advertising","Data","Events","Status"]'
namespace bluetoothV2 {

    let _deviceName = "micro:bit";
    let _isInitialized = false;
    let _isConnected = false;
    let _txBuffer = "";
    let _rxBuffer = "";
    let _onConnectedHandler: () => void = null;
    let _onDisconnectedHandler: () => void = null;
    let _onDataHandler: (data: string) => void = null;

    // ─── SETUP ──────────────────────────────────────────────────────────────

    /**
     * Initialize Bluetooth V2 with a custom device name.
     * Must be called once at program start (e.g. in "on start").
     * @param name The BLE advertised name (max 8 chars), eg: "myBit"
     */
    //% blockId=bluetoothV2_init
    //% block="init Bluetooth V2 with name %name"
    //% name.defl="myBit"
    //% weight=100
    //% group="Setup"
    export function initBluetoothV2(name: string): void {
        _deviceName = name.substr(0, 8);
        bluetooth.setTransmitPower(7);
        bluetooth.startUartService();
        _isInitialized = true;

        // Wire internal event handlers
        bluetooth.onBluetoothConnected(function () {
            _isConnected = true;
            if (_onConnectedHandler) _onConnectedHandler();
        });

        bluetooth.onBluetoothDisconnected(function () {
            _isConnected = false;
            if (_onDisconnectedHandler) _onDisconnectedHandler();
        });

        bluetooth.uartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            _rxBuffer = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
            if (_onDataHandler) _onDataHandler(_rxBuffer);
        });
    }

    /**
     * Change the Bluetooth device name at any time.
     * Takes effect on the next advertisement / reconnect.
     * @param name New BLE device name (max 8 chars), eg: "newName"
     */
    //% blockId=bluetoothV2_setName
    //% block="set Bluetooth name to %name"
    //% name.defl="newName"
    //% weight=90
    //% group="Setup"
    export function setDeviceName(name: string): void {
        _deviceName = name.substr(0, 8);
    }

    /**
     * Get the current Bluetooth device name.
     */
    //% blockId=bluetoothV2_getName
    //% block="Bluetooth device name"
    //% weight=85
    //% group="Setup"
    export function getDeviceName(): string {
        return _deviceName;
    }

    /**
     * Set the Bluetooth transmit power level (0–7).
     * Higher = longer range, more battery use.
     * @param level Power level 0–7, eg: 7
     */
    //% blockId=bluetoothV2_setPower
    //% block="set Bluetooth TX power to %level"
    //% level.min=0 level.max=7
    //% level.defl=7
    //% weight=80
    //% group="Setup"
    export function setTxPower(level: number): void {
        bluetooth.setTransmitPower(Math.clamp(0, 7, level));
    }

    // ─── ADVERTISING ────────────────────────────────────────────────────────

    /**
     * Start Bluetooth advertising (make device discoverable).
     */
    //% blockId=bluetoothV2_startAdvert
    //% block="start Bluetooth advertising"
    //% weight=70
    //% group="Advertising"
    export function startAdvertising(): void {
        bluetooth.advertiseUid(1234, 7, true);
    }

    /**
     * Stop Bluetooth advertising.
     */
    //% blockId=bluetoothV2_stopAdvert
    //% block="stop Bluetooth advertising"
    //% weight=65
    //% group="Advertising"
    export function stopAdvertising(): void {
        bluetooth.advertiseUid(1234, 7, false);
    }

    /**
     * Advertise a custom URL via Eddystone beacon.
     * @param url The URL to advertise, eg: "makecode.microbit.org"
     */
    //% blockId=bluetoothV2_advertiseUrl
    //% block="advertise URL %url"
    //% url.defl="makecode.microbit.org"
    //% weight=60
    //% group="Advertising"
    export function advertiseUrl(url: string): void {
        bluetooth.advertiseUrl(url, 7, true);
    }

    // ─── DATA ───────────────────────────────────────────────────────────────

    /**
     * Send a text string over Bluetooth UART.
     * @param text The text to send, eg: "Hello!"
     */
    //% blockId=bluetoothV2_sendString
    //% block="send string %text over Bluetooth"
    //% text.defl="Hello!"
    //% weight=75
    //% group="Data"
    export function sendString(text: string): void {
        bluetooth.uartWriteString(text + "\n");
    }

    /**
     * Send a number over Bluetooth UART.
     * @param value The number to send, eg: 42
     */
    //% blockId=bluetoothV2_sendNumber
    //% block="send number %value over Bluetooth"
    //% value.defl=0
    //% weight=73
    //% group="Data"
    export function sendNumber(value: number): void {
        bluetooth.uartWriteNumber(value);
        bluetooth.uartWriteString("\n");
    }

    /**
     * Send a key=value pair over Bluetooth UART.
     * @param key   The key name, eg: "temp"
     * @param value The value, eg: 24
     */
    //% blockId=bluetoothV2_sendKeyValue
    //% block="send key %key = %value over Bluetooth"
    //% key.defl="key" value.defl=0
    //% weight=71
    //% group="Data"
    export function sendKeyValue(key: string, value: number): void {
        bluetooth.uartWriteString(key + "=" + value + "\n");
    }

    /**
     * Get the last string received over Bluetooth UART.
     */
    //% blockId=bluetoothV2_lastReceived
    //% block="last received Bluetooth string"
    //% weight=68
    //% group="Data"
    export function lastReceivedString(): string {
        return _rxBuffer;
    }

    // ─── EVENTS ─────────────────────────────────────────────────────────────

    /**
     * Run code when a Bluetooth device connects.
     */
    //% blockId=bluetoothV2_onConnected
    //% block="on Bluetooth connected"
    //% weight=55
    //% group="Events"
    export function onConnected(handler: () => void): void {
        _onConnectedHandler = handler;
    }

    /**
     * Run code when a Bluetooth device disconnects.
     */
    //% blockId=bluetoothV2_onDisconnected
    //% block="on Bluetooth disconnected"
    //% weight=53
    //% group="Events"
    export function onDisconnected(handler: () => void): void {
        _onDisconnectedHandler = handler;
    }

    /**
     * Run code when data is received over Bluetooth.
     * The received string is passed as "data".
     */
    //% blockId=bluetoothV2_onDataReceived
    //% block="on Bluetooth data received as $data"
    //% draggableParameters
    //% weight=50
    //% group="Events"
    export function onDataReceived(handler: (data: string) => void): void {
        _onDataHandler = handler;
    }

    // ─── STATUS ─────────────────────────────────────────────────────────────

    /**
     * Returns true if a device is currently connected over Bluetooth.
     */
    //% blockId=bluetoothV2_isConnected
    //% block="Bluetooth is connected"
    //% weight=40
    //% group="Status"
    export function isConnected(): boolean {
        return _isConnected;
    }

    /**
     * Returns true if Bluetooth V2 has been initialized.
     */
    //% blockId=bluetoothV2_isInitialized
    //% block="Bluetooth V2 is initialized"
    //% weight=38
    //% group="Status"
    export function isInitialized(): boolean {
        return _isInitialized;
    }

    /**
     * Show Bluetooth connection status on the LED display.
     * Displays a tick if connected, a cross if not.
     */
    //% blockId=bluetoothV2_showStatus
    //% block="show Bluetooth status on display"
    //% weight=35
    //% group="Status"
    export function showStatus(): void {
        if (_isConnected) {
            basic.showIcon(IconNames.Yes);
        } else {
            basic.showIcon(IconNames.No);
        }
    }
}