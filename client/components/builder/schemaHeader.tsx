import { Button, CardHeader } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"

export default function SchemaHeader()
{
    const { setBuilderMode, builderPage } = useSchema()
    return <CardHeader
        avatar={
            <Button
                size="small"
                variant="contained"
                onClick={() => setBuilderMode(false)}
            >
                Back
            </Button>
        }
        title={builderPage}
        slotProps={{
            avatar: {
                style: {
                    zIndex: 1,
                    margin: 0,
                }
            },
            action: {
                style: {
                    zIndex: 1,
                    margin: 0,
                }
            },
            root: {
                style: {
                    position: "relative",
                    margin: 0,
                    padding: 0,
                    paddingBottom: "8px",
                }
            }
        }}
        sx={{
            "& *": { margin: 0 },
            "& .MuiCardHeader-content": {
                width: "100%",
                position: "absolute",
            },
            "& .MuiCardHeader-title": {
                fontSize: "16pt",
                textAlign: "center",
                fontWeight: 600,
            }
        }}
    />
}