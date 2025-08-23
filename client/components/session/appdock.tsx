import Button from "../atom/button"
import { useState, useEffect } from "react"
import { useGlobals } from "../hooks/useGlobals"
import { useSession } from "../hooks/useSession"
import classMerge from "../utils/classMerge"
import Reaction from "./dock/reaction"
import Chat from "./interactive/chat"
import Participants from "./interactive/participants"
import { UserProps } from "@/types/session.types"
import { transformSDP } from "../utils/sdp.transform"
import Inactives from "./interactive/inactives"
import Whitelist from "../whitelist"

export default function AppDock() {
    /* ----- STATES & HOOKS ----- */
    const { meetingCode } = useGlobals()
    const [copy, setCopy] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (copy) setTimeout(() => {
            setCopy(false)
        }, 3000)
    }, [copy])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full p-[16px]", //? Sizing
            "flex items-center justify-evenly Unselectable", //? Display
        )}>
        <Button //* COPY MEETING
            useIcon iconSrc={require("@/public/images/Copy.svg")} iconOverlay
            onClick={() => {
                navigator.clipboard.writeText(meetingCode) //? Copy the meeting code to the clipboard
                setCopy(true)
            }}
            className={classMerge(
                "bg-transparent", //? Background
                "hover:bg-[#525252]", //? Hover
                "transition-all duration-200", //? Animation
            )}>{copy ? "Copied!" : "Meeting Code"}</Button>
        <Dock />
        <Interactive />
    </div>
}
function Dock() {
    /* ----- STATES & HOOKS ----- */
    const {
        host, participantList, setfullscreen,
        stream, setstream,
        calls, setcalls,
        streamAccess, setstreamAcces,
        presenting, setpresenting,
        mutestream, setmutestream,
    } = useSession()
    const {
        socket, peer, myInfo, setsystemPopup,
        meetingCode, setmeetingCode,
    } = useGlobals()
    const [requestCooldown, setRequestCooldown] = useState<boolean>(false)
    const [noRequest, setNoRequest] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        socket?.on("get-stream", (targetID: string) => {
            if (peer && stream) {
                const makeCall = peer.call(targetID, stream, { sdpTransform: transformSDP })
                setcalls(prev => [...prev, makeCall])
            }
        })
        socket?.on("streaming", () => {
            if (!host) {
                setstreamAcces(false)
                setNoRequest(true)
                setpresenting(true)
            }
        })
        socket?.on("avail-req", () => {
            if (!host || streamAccess) {
                setNoRequest(false)
                setstreamAcces(false)
            }
            if (calls.length !== 0) {
                calls.forEach(call => call.close())
                setcalls([])
            }
            if (stream) { stream.getTracks().forEach(track => track.stop()) }
            setpresenting(false)
        })
        socket?.on("grant-access", (permittedID: string) => {
            if (permittedID === myInfo.id) {
                setRequestCooldown(false)
                setstreamAcces(true)
            } else { !host && setNoRequest(true) }
        })
        socket?.on("req-stream", (client: UserProps) => {
            if (host) {
                setRequestCooldown(false)
                setsystemPopup({
                    type: "INFO",
                    message: `Allow ${client.name} to have streaming access?`,
                    icon: require("@/public/images/Share Screen (2).svg"),
                    action() {
                        socket.emit("grant-access", meetingCode, client.id)
                    }
                })
            } else { setRequestCooldown(true) }
        })
        return () => {
            socket?.off("get-stream", (targetID: string) => {
                if (peer && stream) {
                    const makeCall = peer.call(targetID, stream, { sdpTransform: transformSDP })
                    setcalls(prev => [...prev, makeCall])
                }
            })
            socket?.off("streaming", () => {
                if (!host) {
                    setstreamAcces(false)
                    setNoRequest(true)
                    setpresenting(true)
                }
            })
            socket?.off("avail-req", () => {
                if (!host || streamAccess) {
                    setNoRequest(false)
                    setstreamAcces(false)
                }
                if (calls.length !== 0) {
                    calls.forEach(call => call.close())
                    setcalls([])
                }
                if (stream) { stream.getTracks().forEach(track => track.stop()) }
                setpresenting(false)
            })
            socket?.off("grant-access", (permittedID: string) => {
                if (permittedID === myInfo.id) {
                    setRequestCooldown(false)
                    setstreamAcces(true)
                } else { !host && setNoRequest(true) }
            })
            socket?.off("req-stream", (client: UserProps) => {
                if (host) {
                    setRequestCooldown(false)
                    setsystemPopup({
                        type: "INFO",
                        message: `Allow ${client.name} to have streaming access?`,
                        icon: require("@/public/images/Share Screen (2).svg"),
                        action() {
                            socket.emit("grant-access", meetingCode, client.id)
                        }
                    })
                } else { setRequestCooldown(true) }
            })
        }
    }, [host, peer, stream])
    useEffect(() => {
        requestCooldown && setTimeout(() => {
            setRequestCooldown(false)
        }, 5000)
    }, [requestCooldown])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className="flex gap-[16px] justify-center items-center">
        <Reaction />
        {(presenting && ((!host && !streamAccess) || (host && !streamAccess && calls.length === 0))) && <Button //* FULLSCREEN
            circle useIcon iconOverlay iconSrc={require("@/public/images/Fullscreen.svg")}
            onClick={() => setfullscreen(true)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(presenting && stream?.getAudioTracks().length !== 0 && ((!host && !streamAccess) || (host && !streamAccess && calls.length === 0))) && <Button //* MUTE
            circle useIcon iconSrc={mutestream ? require("@/public/images/Audio (1).svg") : require("@/public/images/Audio (2).svg")}
            iconOverlay customOverlay={mutestream ? "redOverlay" : undefined}
            onClick={() => setmutestream(!mutestream)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(!presenting && !requestCooldown && !noRequest && (host || streamAccess || !streamAccess)) && < Button //* SHARE SCREEN
            circle useIcon iconSrc={require("@/public/images/Share Screen (2).svg")}
            iconOverlay customOverlay={(presenting || (!streamAccess && !host)) ? "redOverlay" : undefined}
            onClick={async () => {
                if (streamAccess || host) {
                    if (socket && peer && navigator.mediaDevices.getDisplayMedia) {
                        //* GET DISPLAY
                        const mainStream = await navigator.mediaDevices.getDisplayMedia({
                            audio: {
                                autoGainControl: { ideal: false },
                                echoCancellation: { ideal: false },
                                noiseSuppression: { ideal: false },
                                sampleRate: { ideal: 48000 },
                                sampleSize: { ideal: 24 }
                            }, video: true
                        })
                            .then(async (originalStream) => {
                                //* TRACK MODIFICATION
                                for (const track of originalStream.getTracks()) {
                                    if (track.kind === "audio") { track.contentHint = "music" }
                                    else { track.contentHint = "detail" }
                                    //* ADD EVENT LISTENER
                                    await track.addEventListener("ended", function onEnded() {
                                        ((host || streamAccess) && (socket?.emit("stop-stream", meetingCode)))
                                        setpresenting(false)
                                        setstreamAcces(false)
                                        setNoRequest(false)
                                        track.removeEventListener("ended", onEnded)
                                    })
                                }
                                //* VIDEO MODIFICATION
                                for (const video of originalStream.getVideoTracks()) {
                                    await video.applyConstraints({
                                        displaySurface: { exact: "window" },
                                        frameRate: { exact: 60 }
                                    }).then(() => { return }).catch(err => err)
                                }
                                return originalStream
                            })
                        setstream(mainStream)
                        participantList.forEach(client => {
                            if (client.id !== myInfo.id) {
                                const makeCall = peer.call(client.id, mainStream, { sdpTransform: transformSDP })
                                //* DATA CHANNEL MODIFICATIONS
                                const channel = makeCall.peerConnection.createDataChannel("myChannel", {
                                    id: 0,
                                    maxRetransmits: 10,
                                    negotiated: true,
                                    ordered: false
                                })
                                channel.bufferedAmountLowThreshold = 65536
                                makeCall._initializeDataChannel(channel)
                                //* TRANSCEIVER MODIFICATIONS
                                makeCall.peerConnection.getTransceivers().forEach(transceiver => {
                                    if (transceiver.receiver.track.kind === "video") transceiver.receiver.track.contentHint = "detail"
                                    else transceiver.receiver.track.contentHint = "music"
                                })
                                //* SENDER PEER MODIFICATIONS
                                makeCall.peerConnection.getSenders().forEach(async (sender) => {
                                    if (sender.track?.kind === "video") {
                                        const params = sender.getParameters()
                                        //* DEGREDATION PREFERENCE
                                        params.degradationPreference = "maintain-framerate"
                                        //* ENCODINGS
                                        params.encodings.forEach(encoding => {
                                            encoding.priority = "high"
                                            encoding.networkPriority = "high"
                                            encoding.maxBitrate = 30000000
                                            encoding.maxFramerate = 60
                                            encoding.scaleResolutionDownBy = 1
                                        })
                                        await sender.setParameters(params)
                                    }
                                })
                                setcalls(prev => [...prev, makeCall])
                            }
                        })
                    }
                    socket?.emit("start-stream", meetingCode, myInfo)
                    setpresenting(true)
                    setmutestream(true)
                } else {
                    socket?.emit("req-stream", meetingCode, myInfo)
                    setRequestCooldown(true)
                }
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        {(presenting && (host || streamAccess)) && < Button //* STOP SHARE SCREEN
            circle useIcon iconSrc={require("@/public/images/Share Screen (1).svg")}
            iconOverlay customOverlay={(presenting || (!streamAccess && !host)) ? "redOverlay" : undefined}
            onClick={() => {
                if (host || streamAccess) {
                    calls.forEach(call => call.close())
                    setcalls([])
                }
                if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                socket?.emit("stop-stream", meetingCode)
                setstream(null)
                setpresenting(false)
                setstreamAcces(false)
                setNoRequest(false)
            }}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
        <Button //* END CALL
            circle useIcon iconOverlay iconSrc={require("@/public/images/End Call.svg")}
            onClick={() => {
                if (stream) {
                    if (host || streamAccess) {
                        calls.forEach(call => call.close())
                        setcalls([])
                    }
                    if (stream) { for (const track of stream.getTracks()) { track.stop() } }
                    (host || streamAccess) && socket?.emit("stop-stream", meetingCode)
                    setstream(null)
                    setpresenting(false)
                    setstreamAcces(false)
                    setNoRequest(false)
                }
                socket?.emit("leave-room", meetingCode)
                setmeetingCode("")
            }}
            containerClass="w-[6em]"
            className={classMerge(
                "bg-[#DF2020]", //? Background
                "hover:bg-[#B21A1A]", //? Hover
            )} />
    </div>
}
function Interactive() {
    /* ----- STATES & HOOKS ----- */
    const { setsystemPopup } = useGlobals()
    const { host } = useSession()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className="flex gap-[16px] justify-center items-center">
        <Chat />
        <Participants />
        {host && <Inactives />}
        {host && <Button //* FULLSCREEN
            circle useIcon iconOverlay iconSrc={require("@/public/images/whitelist 2.svg")}
            onClick={() => setsystemPopup({
                type: "INFO",
                message: <Whitelist context="Session" />
            })}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />}
    </div>
}