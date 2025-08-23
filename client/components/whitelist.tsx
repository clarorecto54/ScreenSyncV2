import { useGlobals } from "./hooks/useGlobals";
import classMerge from "./utils/classMerge";
import { useSession } from "./hooks/useSession";

export default function Whitelist({ context }: { context: "Session" | "Global" }) {
    /* ----- STATES & HOOKS ----- */
    // const {
    //     rawWhitelist, setRawWhitelist,
    //     whitelist, setWhitelist
    // } = (context === "Global" ? useGlobals() : useSession())
    const globalAccess = useGlobals()
    const sessionAccess = useSession()
    const rawWhitelist = context === "Global" ? globalAccess.rawWhitelist : sessionAccess.rawWhitelist
    const setRawWhitelist = context === "Global" ? globalAccess.setRawWhitelist : sessionAccess.setRawWhitelist
    const whitelist = context === "Global" ? globalAccess.whitelist : sessionAccess.whitelist
    const setWhitelist = context === "Global" ? globalAccess.setWhitelist : sessionAccess.setWhitelist
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "flex flex-col justify-center items-center gap-[0.25em]", //? Display 
        )}>
        <label //* HEADER
            className="w-full text-center font-[Montserrat] font-[500]">
            Whitelisted Participants
        </label>
        <div //* INPUTS AND OUTPUTS
            className="flex gap-[1em] justify-center items-center">
            <textarea
                autoFocus
                placeholder="Please input the list of names here"
                value={rawWhitelist}
                onChange={(thisElement) => {
                    setRawWhitelist(thisElement.target.value.toUpperCase())
                    const data: string = thisElement.target.value.toUpperCase()
                    var lineText: string[] = data.split("\n").filter(name => (name.trim() !== '') && (name.length > 3))
                    lineText = Array.from(new Set(lineText))
                    setWhitelist(lineText)
                }}
                className={classMerge(
                    "p-[1em] rounded-[1em]", //? Sizing
                    "overflow-hidden shadow", //? Background
                    "focus-within:border-[1px] focus-within:border-blue-600", //? Border Styling
                    "text-black text-[0.75em] font-[Montserrat] font-[500]", //? Text & Font Styling
                    "min-h-[258px] max-h-[258px] aspect-[1/1] overflow-y-auto", //? Limits
                )} />
            <div //* NAME LIST
                className={classMerge(
                    "p-[1em] rounded-[1em]", //? Sizing
                    "overflow-hidden shadow", //? Background
                    "text-black text-[0.75em] font-[Montserrat] font-[500]", //? Text & Font Styling
                    "min-h-[258px] max-h-[258px] aspect-square overflow-y-auto", //? Limits
                    "flex flex-col justify-center items-center gap-[0.25em]", //? Display
                )}>
                <label //* HEADER
                    className="w-full text-center font-[Montserrat] font-[600]">
                    Valid Names ( {whitelist.length} )
                </label>
                <ul //* NAME LIST
                    className="h-full w-full px-[2em] list-disc overflow-hidden overflow-y-auto">
                    {whitelist.map((name, index) => {
                        return <li key={index}>{name}</li>
                    })}
                </ul>
            </div>
        </div>
    </div>
}