import { CustomListItemProps } from "@/types/Schema.types";
import { ListItemText, ListItemButton, IconButton, ListItemIcon } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ChoiceElement({ choice, index, questionData, setQuestionData }: CustomListItemProps)
{
    const [selectedChoice, setSelectedChoice] = useState<boolean>(false)
    const [hovered, setHovered] = useState<boolean>(false)
    const correctAnswerStyling = {
        backgroundColor: "rgb(34 197 94 / 0.3)"
    }
    useEffect(() =>
    {
        if (choice === questionData.correctAnswer) setSelectedChoice(true)
        else setSelectedChoice(false)
    }, [choice, questionData.correctAnswer])
    return (
        <ListItemButton
            key={index}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setQuestionData(prev => ({ ...prev, correctAnswer: choice }))}
            sx={{
                ...(selectedChoice && correctAnswerStyling),
                display: "flex",
                alignItems: "center",
                border: "2px solid #ddd",
                borderRadius: 1,
                height: "auto",
                maxHeight: "fit-content",
                px: "16px"
            }}
        >
            {selectedChoice && <ListItemIcon sx={{ minWidth: "fit-content", paddingRight: "16px" }} >
                <Image className="h-[8px] w-[8px]" alt="" src={require("@/public/images/Check.svg")} />
            </ListItemIcon>}
            <ListItemText
                primary={choice}
                slotProps={{
                    primary: {
                        sx: {
                            paddingRight: "16px",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "unset",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                        }
                    }
                }}
            />
            {hovered && <IconButton edge="start" onClick={() => setQuestionData(prev =>
            {
                const updatedChoices = prev.choices
                updatedChoices.splice(index, 1)
                return {
                    ...prev,
                    choices: updatedChoices,
                }
            })
            }>
                <Image className="h-[8px] w-[8px]" alt="" src={require("@/public/images/Close 2.svg")} />
            </IconButton>}
        </ListItemButton>
    );
}