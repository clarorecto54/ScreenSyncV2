import Image from "next/image"
import classMerge from "./utils/classMerge"
export default function AnimatedLogo({ size }: { size: number }) {
    return <div //* LOGO CONTAINER 
        style={{ height: `${size}em` }}
        className={classMerge(
            "relative aspect-square flex justify-center items-center h-[8em] Unselectable", //? Base
        )}>
        <Image //* BACK LOGO
            priority
            className="aspect-square object-cover animate-spin"
            src={require("@/public/images/TUP Back.svg")}
            alt=""
            sizes="100vw"
            fill
        />
        <Image //* LOGO
            priority
            className="aspect-square object-cover"
            src={require("@/public/images/TUP Front.svg")}
            alt=""
            sizes="100vw"
            fill
        />
    </div>
}