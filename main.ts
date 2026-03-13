//% color="#0082FB" weight=95 icon="\uf294" block="Bluetooth V2"
namespace bluetoothV2 {

    let _connected = false
    let _lastData = ""

    /**
     * Create a new Bluetooth device and make it discoverable.
     * Call this once in "on start".
     * @param name The name shown on your phone/PC, eg: "myBit"
     */
    //% blockId=bluetoothV2_create
    //% block="create Bluetooth device named %name"
    //% name.defl="myBit"
    //% weight=100
    //% group="Setup"
    export function createDevice(name: string): void {
        bluetooth.startUartService()
        bluetooth.onBluetoothConnected(function () {
            _connected = true
        })
        bluetooth.onBluetoothDisconnected(function () {
            _connected = false
        })
        basic.showString(name.substr(0, 5))
    }

    /**
     * Start all Bluetooth services (UART, accelerometer, temperature, button).
     */
    //% blockId=bluetoothV2_startAll
    //% block="start all Bluetooth services"
    //% weight=90
    //% group="Setup"
    export function startAllServices(): void {
        bluetooth.startUartService()
        bluetooth.startAccelerometerService()
        bluetooth.startTemperatureService()
        bluetooth.startButtonService()
        bluetooth.startLEDService()
    }

    /**
     * Set Bluetooth transmit power (0=low, 7=max range).
     * @param level Power 0–7, eg: 7
     */
    //% blockId=bluetoothV2_power
    //% block="set Bluetooth power %level"
    //% level.min=0
    //% level.max=7
    //% level.defl=7
    //% weight=80
    //% group="Setup"
    export function setPower(level: number): void {
        let v = level < 0 ? 0 : level > 7 ? 7 : level
        bluetooth.setTransmitPower(v)
    }

    /**
     * Send a text string over Bluetooth UART.
     * @param text Text to send, eg: "hello"
     */
    //% blockId=bluetoothV2_sendStr
    //% block="send %text over Bluetooth"
    //% text.defl="hello"
    //% weight=75
    //% group="Data"
    export function sendString(text: string): void {
        bluetooth.uartWriteString(text + "\n")
    }

    /**
     * Send a number over Bluetooth UART.
     * @param value Number to send, eg: 0
     */
    //% blockId=bluetoothV2_sendNum
    //% block="send number %value over Bluetooth"
    //% value.defl=0
    //% weight=73
    //% group="Data"
    export function sendNumber(value: number): void {
        bluetooth.uartWriteString("" + value + "\n")
    }

    /**
     * Send a key=value pair over Bluetooth UART.
     * @param key Label, eg: "temp"
     * @param value Number value, eg: 0
     */
    //% blockId=bluetoothV2_sendKV
    //% block="send %key = %value over Bluetooth"
    //% key.defl="key"
    //% value.defl=0
    //% weight=71
    //% group="Data"
    export function sendKeyValue(key: string, value: number): void {
        bluetooth.uartWriteString(key + "=" + value + "\n")
    }

    /**
     * Read incoming Bluetooth UART data (call inside "on data received").
     */
    //% blockId=bluetoothV2_read
    //% block="read Bluetooth data"
    //% weight=69
    //% group="Data"
    export function readData(): string {
        _lastData = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
        return _lastData
    }

    /**
     * The last string received over Bluetooth.
     */
    //% blockId=bluetoothV2_last
    //% block="last Bluetooth data"
    //% weight=67
    //% group="Data"
    export function lastData(): string {
        return _lastData
    }

    /**
     * Run code when phone/PC connects.
     */
    //% blockId=bluetoothV2_onConnect
    //% block="on Bluetooth connected"
    //% weight=60
    //% group="Events"
    export function onConnected(handler: () => void): void {
        bluetooth.onBluetoothConnected(function () {
            _connected = true
            handler()
        })
    }

    /**
     * Run code when phone/PC disconnects.
     */
    //% blockId=bluetoothV2_onDisconnect
    //% block="on Bluetooth disconnected"
    //% weight=58
    //% group="Events"
    export function onDisconnected(handler: () => void): void {
        bluetooth.onBluetoothDisconnected(function () {
            _connected = false
            handler()
        })
    }

    /**
     * Run code when data arrives over Bluetooth UART.
     */
    //% blockId=bluetoothV2_onData
    //% block="on Bluetooth data received"
    //% weight=55
    //% group="Events"
    export function onDataReceived(handler: () => void): void {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            _lastData = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
            handler()
        })
    }

    /**
     * True if a device is connected.
     */
    //% blockId=bluetoothV2_connected
    //% block="Bluetooth is connected"
    //% weight=45
    //% group="Status"
    export function isConnected(): boolean {
        return _connected
    }

    /**
     * Show a tick (connected) or cross (not connected) on the LEDs.
     */
    //% blockId=bluetoothV2_showStatus
    //% block="show Bluetooth status"
    //% weight=40
    //% group="Status"
    export function showStatus(): void {
        if (_connected) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
    }
}