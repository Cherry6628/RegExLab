import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./LearningMaterials.css";

export default function LearningMaterials({ list, topic_url }) {
    const context = useGlobalContext();
    const navigate = useNavigate();
    const realPages = Object.fromEntries(
        Object.entries(list).filter(([, v]) => v.comp)
    );

    const [activeId, setActiveId] = useState(Object.keys(realPages)[0]);

    useEffect(() => {
        if (location.hash.slice(1) === "last" && context.lastLearnt?.page_id) {
            setActiveId(context.lastLearnt.page_id);
            navigate("/learning-material/" + topic_url, { replace: true });
        } else {
            setActiveId(Object.keys(realPages)[0]);
        }
    }, [topic_url]);

    useEffect(() => {
        if (location.hash.slice(1) === "last" && context.lastLearnt?.page_id) {
            setActiveId(context.lastLearnt.page_id);
        }
    }, [context.lastLearnt?.page_id]);

    const activeItem = realPages[activeId];
    const ActiveComponent = activeItem?.comp;

    useEffect(() => {
        const trigger = document.getElementById("progress-trigger");
        if (!trigger) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                context.saveProgress({ topic_url, page_id: activeId });
                observer.disconnect();
            }
        });
        observer.observe(trigger);
        return () => observer.disconnect();
    }, [activeId]);

    return (
        <>
            <div style={{ height: "100px" }}>
                <Header setActiveId={setActiveId} />
            </div>
            <div>
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
                    />
                    {ActiveComponent ? <ActiveComponent /> : <></>}
                </div>
                <div
                    id="progress-trigger"
                    style={{
                        position: "relative",
                        bottom: "200px",
                        height: "1px",
                        backgroundColor: "transparent",
                        width: "100vw",
                    }}
                />
            </div>
        </>
    );
}