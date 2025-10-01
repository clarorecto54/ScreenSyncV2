import AnimatedLogo from "@/components/animated.logo"
import classMerge from "@/components/utils/classMerge"

function DefaultDisplay() {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full", //? Sizing
            "bg-[#525252]", //? Background presenting ? "bg-[#]" : 
            "flex flex-col gap-[8px] justify-center items-center Unselectable", //? Display
            "transition-[background-color] duration-500", //? Animation
        )}>
        <AnimatedLogo size={16} />
        <label //* SCHOOL NAME
            className="font-[500] font-[Montserrat] leading-[40px] text-center text-[20px]">
            Welcome to Screensync!
        </label>
    </div>
}

export default DefaultDisplay