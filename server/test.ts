import ProfileLevelId, { Level1, Level1_b, Level4, Level5, Level5_2 } from "h264-profile-level-id"
const h264 = ProfileLevelId
const profiles = [h264.ProfileBaseline, h264.ProfileConstrainedBaseline, h264.ProfileMain, , h264.ProfileConstrainedHigh]
const levels = [
    h264.Level1_b,
    h264.Level1_3,
    h264.Level2_2,
    h264.Level3,
    h264.Level3_1,
    h264.Level3_2,
    h264.Level4,
    h264.Level4_1,
    h264.Level4_2,
    h264.Level5,
    h264.Level5_1,
    h264.Level5_2,
]
// for (const level of levels) {
//     const profileID = h264.profileLevelIdToString({ profile: h264.ProfileConstrainedBaseline, level })
//     if (profileID) {
//         console.log(`{ codec: "H264", config: (["profile-level-id=${profileID}", "level-asymmetry-allowed=1", "packetization-mode=0"].concat(H264_config)).join(";") },`)
//         console.log(`{ codec: "H264", config: (["profile-level-id=${profileID}", "level-asymmetry-allowed=1", "packetization-mode=1"].concat(H264_config)).join(";") },`)
//     }
// }
console.log(h264.profileLevelIdToString({ profile: h264.ProfileConstrainedHigh, level: h264.Level5_2 }))
// const profileID = h264.profileLevelIdToString({ profile: h264.ProfileBaseline, level: Level1_b })
// if (profileID) {
//     console.clear()
//     console.log(`{ codec: "H264", config: (["profile-level-id=${profileID}", "level-asymmetry-allowed=1", "packetization-mode=0",].concat(H264_config)).join(";") },`)
//     console.log(`{ codec: "H264", config: (["profile-level-id=${profileID}", "level-asymmetry-allowed=1", "packetization-mode=1",].concat(H264_config)).join(";") },`)
// }