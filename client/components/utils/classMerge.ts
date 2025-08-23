import clsx, { ClassValue } from "clsx"
import { twMerge } from "tw-merge"
export default function classMerge(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}