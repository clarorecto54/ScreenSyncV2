import { write, parse, SessionDescription, MediaAttributes } from "sdp-transform"
export function transformSDP(sdp: string) {
    const modifiedSDP: SessionDescription = parse(sdp)
    const quality: number = 30000000
    const fps: number = 60
    //* INITAITE NEW CODECS
    var payloads: number[] = []
    var rtp: MediaAttributes["rtp"] = []
    var fmtp: MediaAttributes["fmtp"] = []
    var rtcpfbPayloads: number[] = []
    //* SDP BANDWIDTH
    modifiedSDP.bandwidth = [ //? Set the connection bandwidth
        { type: "AS", limit: quality },
        { type: "CT", limit: quality },
        { type: "RR", limit: quality },
        { type: "RS", limit: quality },
        { type: "TIAS", limit: quality }
    ]
    //* CODEC LIST
    const GoogleFlags: string = [
        "x-google-start-bitrate=8000",
        "x-google-min-bitrate=8000",
        "x-google-max-bitrate=10000",
        "x-google-min-quantization=20",
        "x-google-max-quantization=30",
        "sprop-maxcapturerate=60"
    ].join(';')
    const h264Extra: string = ";max-br=10000;max-fr=60"
    const videoCodecs: { codec: string, config: string }[] = [
        { codec: "VP8", config: "".concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "AV1", config: "".concat(`;${GoogleFlags}`) },
        { codec: "VP9", config: "profile-id=0;max-fr=60;max-fs=10000".concat(`;${GoogleFlags}`) },
        { codec: "VP9", config: "profile-id=2;max-fr=60;max-fs=10000".concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f".concat(h264Extra).concat(`;${GoogleFlags}`) },
        { codec: "H264", config: "level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f".concat(h264Extra).concat(`;${GoogleFlags}`) },
    ]
    //* TEMPLATES
    function addCODEC(payload: number, codec: string, config: string, rate?: number, encoding?: number) {
        //* CODEC
        payloads.push(payload) //? Add VP8 Payload Code
        rtp.push({ payload: payload, codec, rate: rate ?? 90000, encoding: encoding ?? undefined }) //? Codec name
        if (config) fmtp.push({ payload: payload, config: config.concat(";ulpfec=1") }) //? Codec config
        rtcpfbPayloads.push(payload) //? Add the codec payload for acknowledgement config
        //* RTX
        payloads.push(payload + 1) //? Add RTX to the payload
        rtp.push({ payload: payload + 1, codec: "rtx", rate: rate ?? 90000 }) //? Codec name
        fmtp.push({ payload: payload + 1, config: `apt=${payload};ulpfec=1` }) //? Retransmit to the payload of previous codec
    }
    function addRTPRTX(payload: number, codec: string, rate?: number, config?: string) {
        //* RTP
        payloads.push(payload) //? Adds RTP payload into the list of payloads
        rtp.push({ payload: payload, codec: codec, rate: rate ?? 90000 }) //? Adds in RTP
        if (config) { fmtp.push({ payload, config: config.concat(";ulpfec=1") }) }
        //* RTX
        payloads.push(payload + 1) //? Adds payload of RTP Retransmission into the payload list
        rtp.push({ payload: payload + 1, codec: "rtx", rate: rate ?? 90000 }) //? Adds the Retransmission to the RTP
        fmtp.push({ payload: payload + 1, config: `apt=${payload};ulpfec=1` }) //? Retransmission of RTP
    }
    function addRTPOnly(payload: number, codec: string, rate?: number) {
        //* RTP ONLY
        payloads.push(payload) //? Adds payload of RTP into the payload list
        rtp.push({ payload: payload, codec, rate: rate ?? 90000 }) //? Adds to the RTP
    }
    modifiedSDP.media.forEach((media, mediaIndex) => {
        //* MEDIA MODIFICATIONS
        modifiedSDP.media[mediaIndex].bandwidth = [ //? Set the media bandwidth
            { type: "AS", limit: quality },
            { type: "CT", limit: quality },
            { type: "RR", limit: quality },
            { type: "RS", limit: quality },
            { type: "TIAS", limit: quality }
        ]
        modifiedSDP.media[mediaIndex].framerate = fps //? Set the framerate
        modifiedSDP.media[mediaIndex].ptime = 20 //? Minimum Packeting time
        modifiedSDP.media[mediaIndex].maxptime = 30 //? Max Packeting time
        modifiedSDP.media[mediaIndex].xGoogleFlag = GoogleFlags
        //* VIDEO & AUDIO MODIFICATIONS
        switch (media.type) {
            case "video":
                //* INITAITE NEW CODECS
                payloads = []
                rtp = []
                fmtp = []
                rtcpfbPayloads = []
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Cle96ar out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                modifiedSDP.media[mediaIndex].ext
                //* INSTALLING NEW CODECS
                var startingPayload = 99
                videoCodecs.forEach(({ codec, config }) => {
                    addCODEC(startingPayload, codec, config)
                    startingPayload += 2
                })
                //* RED [PACKET REDUNDANCY] (121)
                addRTPRTX(121, "red", undefined, "apt=99")
                //* RED [PACKET REDUNDANCY] (123)
                addRTPRTX(123, "red", undefined, "apt=99")
                //* RED [PACKET REDUNDANCY] (125)
                addRTPRTX(125, "red", undefined, "apt=99")
                //* PACKET ERROR CORRECTION (127)
                addRTPOnly(127, "ulpfec")
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                break
            case "audio":
                //* INITAITE NEW CODECS
                payloads = []
                rtp = []
                fmtp = []
                rtcpfbPayloads = []
                //* CLEAR DEFAULTS
                modifiedSDP.media[mediaIndex].payloads = "" //? Clear out payloads
                modifiedSDP.media[mediaIndex].rtp = [] //? Clear out default codecs
                modifiedSDP.media[mediaIndex].fmtp = [] //? Clear out deafult configs
                modifiedSDP.media[mediaIndex].rtcpFb = [] //? Clear out acknowledgement
                //* RED [PACKET REDUNDANCY] (96)
                payloads.push(96)
                rtp.push({ payload: 96, codec: "red", rate: 48000, encoding: 2 })
                fmtp.push({ payload: 96, config: "97/97/97/98" })
                //* OPUS (97)
                payloads.push(97)
                rtp.push({ payload: 97, codec: "opus", rate: 48000, encoding: 2 })
                fmtp.push({
                    payload: 97, config: [
                        "stereo=1",
                        "sprop-stereo=1",
                        "useinbandfec=1",
                        "usedtx=1",
                        "cbr=0",
                        "stereo=1",
                        "minptime=20",
                        "ptime=15",
                        "maxptime=30",
                        "maxaveragebitrate=320000",
                        "maxplaybackrate=320000",
                        "sprop-maxcapturerate=320000"
                    ].join(";")
                })
                rtcpfbPayloads.push(97)
                //* TELEPHONE EVENT(98)
                payloads.push(98)
                rtp.push({ payload: 98, codec: "telephone-event", rate: 48000 })
                //* APPLYING NEW CODECS
                modifiedSDP.media[mediaIndex].payloads = payloads.join(" ")
                modifiedSDP.media[mediaIndex].rtp = rtp
                modifiedSDP.media[mediaIndex].fmtp = fmtp
                modifiedSDP.media[mediaIndex].rtcpFb = generateRTCPFB(rtcpfbPayloads)
                break
            default:
                break
        }
    })
    const finalSDP: string = write(modifiedSDP).replaceAll("262144", "125000000")
    // console.clear()
    // console.log("Original SDP: ", sdp) //? Show Original SDP
    // console.log(finalSDP) //? Show Modified SDP
    // return sdp //? Return Original SDP
    return finalSDP //? Return the modified SDP with the new max packet size
}
function generateRTCPFB(payloads: number[]) {
    const rtcpFb: MediaAttributes["rtcpFb"] = []
    const mainType = ["nack", "rtpfb"]
    const nack = ["pli", "fir"]
    const rtpfb = ["transport-wide-cc", "ccm-fir", "ccm-nack", "ccm-tmmbr"]
    for (const payload of payloads) { //? Push payload
        for (const main of mainType) {
            rtcpFb.push({ //? Push the main type
                payload: payload,
                type: main
            })
            switch (main) { //? Push the sub types
                case "nack":
                    for (const sub of nack) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                case "rtpfb":
                    for (const sub of rtpfb) {
                        rtcpFb.push({
                            payload: payload,
                            type: main,
                            subtype: sub
                        })
                    }
                    break
                default:
                    break
            }
        }
    }
    return rtcpFb
}