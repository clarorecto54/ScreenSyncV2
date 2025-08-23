/* -------- TIME LOG -------- */
export function TimeLog(seconds?: boolean) {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: seconds ? "2-digit" : undefined
    })
}
/* ------- SERVER LOG ------- */
export function ServerLog(server: "socket" | "peer" | "server", message: string, closeup?: boolean) {
    if (closeup) {
        console.log(`[ ${TimeLog(true)} ][ LOG ][ ${server.toUpperCase()} ]${message}`)
    } else {
        console.log(`[ ${TimeLog(true)} ][ LOG ][ ${server.toUpperCase()} ] ${message}`)
    }
}