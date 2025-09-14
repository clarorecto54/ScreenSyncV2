import { Box, Button, Typography } from "@mui/material"
import { useSchema } from "../hooks/useSchema"
import Image from "next/image"

export default function SchemaHeader()
{
    const { setSchemaBuilder } = useSchema()
    return <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between">
        <Button
            variant="text"
            size="small"
            onClick={() => setSchemaBuilder(false)}
            startIcon={
                <Image
                    src={require("@/public/images/Arrow.svg")}
                    alt="back"
                    className="h-[8px] w-[8px] rotate-90"
                />
            }
            sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "10pt" }}>
            Back
        </Button>
        <Typography
            sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "16pt",
            }}>
            Creating New Schema
        </Typography>
    </Box>
}