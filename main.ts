//% color="#0082FB" weight=95 icon="\uf294" block="Bluetooth V2"
namespace bluetoothV2 {

    let _deviceName = "micro:bit"
    let _isConnected = false
    let _isInitialized = false
    let _rxBuffer = ""

    // ── SETUP ────────────────────────────────────────────────────────────────

    /**
     * Initialize Bluetooth V2. Call this once in "on start".
     * @param name Device name shown when pairing, eg: "myBit"
     */
    //% blockId=bluetoothV2_init
    //% block="init Bluetooth V2 with name %name"
    //% name.defl="myBit"
    //% weight=100
    //% group="Setup"
    export function initBluetoothV2(name: string): void {
        _deviceName = name.substr(0, 8)
        bluetooth.startUartService()
        _isInitialized = true
        bluetooth.onBluetoothConnected(function () {
            _isConnected = true
        })
        bluetooth.onBluetoothDisconnected(function () {
            _isConnected = false
        })
    }

    /**
     * Change the Bluetooth device name (max 8 characters).
     * @param name New device name, eg: "newBit"
     */
    //% blockId=bluetoothV2_setName
    //% block="set Bluetooth name to %name"
    //% name.defl="newBit"
    //% weight=90
    //% group="Setup"
    export function setDeviceName(name: string): void {
        _deviceName = name.substr(0, 8)
    }

    /**
     * Get the current Bluetooth device name.
     */
    //% blockId=bluetoothV2_getName
    //% block="Bluetooth device name"
    //% weight=85
    //% group="Setup"
    export function getDeviceName(): string {
        return _deviceName
    }

    /**
     * Set the Bluetooth transmit power (0 = lowest, 7 = highest range).
     * @param level Power level, eg: 7
     */
    //% blockId=bluetoothV2_setPower
    //% block="set Bluetooth TX power %level"
    //% level.min=0
    //% level.max=7
    //% level.defl=7
    //% weight=80
    //% group="Setup"
    export function setTxPower(level: number): void {
        let safe = level < 0 ? 0 : level > 7 ? 7 : level
        bluetooth.setTransmitPower(safe)
    }

    // ── DATA ─────────────────────────────────────────────────────────────────

    /**
     * Send a text string over Bluetooth.
     * @param text Text to send, eg: "Hello!"
     */
    //% blockId=bluetoothV2_sendString
    //% block="send string %text over Bluetooth"
    //% text.defl="Hello!"
    //% weight=75
    //% group="Data"
    export function sendString(text: string): void {
        bluetooth.uartWriteString(text + "\n")
    }

    /**
     * Send a number over Bluetooth.
     * @param value Number to send, eg: 42
     */
    //% blockId=bluetoothV2_sendNumber
    //% block="send number %value over Bluetooth"
    //% value.defl=0
    //% weight=73
    //% group="Data"
    export function sendNumber(value: number): void {
        bluetooth.uartWriteString("" + value + "\n")
    }

    /**
     * Send a key=value pair over Bluetooth.
     * @param key Key name, eg: "temp"
     * @param value Value, eg: 24
     */
    //% blockId=bluetoothV2_sendKeyValue
    //% block="send %key = %value over Bluetooth"
    //% key.defl="key"
    //% value.defl=0
    //% weight=71
    //% group="Data"
    export function sendKeyValue(key: string, value: number): void {
        bluetooth.uartWriteString(key + "=" + value + "\n")
    }

    /**
     * Read a line of text received over Bluetooth.
     */
    //% blockId=bluetoothV2_readString
    //% block="read Bluetooth string"
    //% weight=69
    //% group="Data"
    export function readString(): string {
        _rxBuffer = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
        return _rxBuffer
    }

    /**
     * Get the last string received over Bluetooth.
     */
    //% blockId=bluetoothV2_lastReceived
    //% block="last received Bluetooth string"
    //% weight=67
    //% group="Data"
    export function lastReceivedString(): string {
        return _rxBuffer
    }

    // ── EVENTS ───────────────────────────────────────────────────────────────

    /**
     * Run code when a Bluetooth device connects.
     */
    //% blockId=bluetoothV2_onConnected
    //% block="on Bluetooth connected"
    //% weight=60
    //% group="Events"
    export function onConnected(handler: () => void): void {
        bluetooth.onBluetoothConnected(function () {
            _isConnected = true
            handler()
        })
    }

    /**
     * Run code when a Bluetooth device disconnects.
     */
    //% blockId=bluetoothV2_onDisconnected
    //% block="on Bluetooth disconnected"
    //% weight=58
    //% group="Events"
    export function onDisconnected(handler: () => void): void {
        bluetooth.onBluetoothDisconnected(function () {
            _isConnected = false
            handler()
        })
    }

    /**
     * Run code when data is received over Bluetooth UART.
     */
    //% blockId=bluetoothV2_onDataReceived
    //% block="on Bluetooth data received"
    //% weight=55
    //% group="Events"
    export function onDataReceived(handler: () => void): void {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            _rxBuffer = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
            handler()
        })
    }

    // ── STATUS ───────────────────────────────────────────────────────────────

    /**
     * True if a device is currently connected over Bluetooth.
     */
    //% blockId=bluetoothV2_isConnected
    //% block="Bluetooth is connected"
    //% weight=45
    //% group="Status"
    export function isConnected(): boolean {
        return _isConnected
    }

    /**
     * True if Bluetooth V2 has been initialized.
     */
    //% blockId=bluetoothV2_isInitialized
    //% block="Bluetooth V2 is initialized"
    //% weight=43
    //% group="Status"
    export function isInitialized(): boolean {
        return _isInitialized
    }

    /**
     * Show Bluetooth status on the LED display.
     */
    //% blockId=bluetoothV2_showStatus
    //% block="show Bluetooth status on display"
    //% weight=40
    //% group="Status"
    export function showStatus(): void {
        if (_isConnected) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
    }
}