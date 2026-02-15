import { useState } from "react";

export default function Main() {
    const [part, setPart] = useState("xss");
    return (
        <>
            <div>
                <Header></Header>
            </div>
            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Sidebar list={{}}></Sidebar>
                {/* <PathTraversalMaterial></PathTraversalMaterial> */}
                {/* <XSSMaterial/> */}
                {/* <DOMBasedXSSMaterial></DOMBasedXSSMaterial> */}
                <XSSContexts></XSSContexts>
            </div>
        </>
    );
}
