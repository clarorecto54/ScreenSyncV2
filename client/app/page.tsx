"use client"
import Image from "next/image";
import classMerge from "@/components/utils/classMerge";
import LoginForm from "@/components/login/form";
import SessionList from "@/components/login/sessions";
import { useGlobals } from "@/components/hooks/useGlobals";
import SystemPopup from "@/components/system.popup";

export default function Home() {
    /* ----- STATES & HOOKS ----- */
    const { myInfo, roomList, systemPopup, socket, peer } = useGlobals()
    /* -------- RENDERING ------- */
    return <div //* VIEWPORT
        className={classMerge(
            "h-full w-full", //? Size
            "relative flex justify-center items-center overflow-hidden", //? Display
        )}>
        <div //* BACKDROP
            className={classMerge(
                "h-full w-full flex gap-[2em] justify-center items-center", //? Base
                "focus-within:backdrop-blur-md focus-within:backdrop-brightness-50", //? Trigger
                "transition-all duration-1000", //? Animation
            )}>
            {!systemPopup && <LoginForm />}
            {(myInfo.name.length > 3 && roomList.length !== 0 && !systemPopup && myInfo.id && socket && peer) && <SessionList />}
            {systemPopup && <SystemPopup />}
        </div>
        {/*<Image //* BACKGROUND IMAGE*/}
        {/*  priority*/}
        {/*  className="-z-[99] absolute object-cover"*/}
        {/*  src={require("@/public/images/Background.svg")}*/}
        {/*  alt=""*/}
        {/*  sizes="100vw"*/}
        {/*  fill*/}
        {/*/>*/}
        <div className="z-[-99] absolute h-full w-full bg-neutral-600" />
    </div>
}