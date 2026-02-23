import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

export default function LearningMaterials({ list }) {
    const [activeId, setActiveId] = useState(Object.keys(list)[0]);

    useEffect(() => {
        setActiveId(Object.keys(list)[0]);
    }, [list]);

    const activeItem = list[activeId];
    const ActiveComponent = activeItem?.comp;
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header setActiveId={setActiveId} />
            </div>
            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Sidebar
                    list={list}
                    activeId={activeId}
                    setActiveId={setActiveId}
                ></Sidebar>
                {ActiveComponent ? <ActiveComponent /> : <></>}
            </div>
        </>
    );
}
