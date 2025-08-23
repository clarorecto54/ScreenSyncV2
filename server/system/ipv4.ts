const os = require("os")
export default function GETIP() {
    var IP = "localhost" //? Default IP
    try {
        for (var index = 0; index < 4; index++) { //? Find a valid IP
            const data: string = os.networkInterfaces()[Object.keys(os.networkInterfaces())[index]][0].address
            if ((data.split(".").length - 1) === 3) {
                IP = data //? If valid IP found it will return it
                break
            }
        }
    } catch (error) { console.log("No LAN Detected running on localhost") }
    return IP
}