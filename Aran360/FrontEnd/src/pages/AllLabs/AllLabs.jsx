import Header from "../../component/Header/Header";
import { useEffect, useState } from "react";
import Lab from "../../component/Lab/Lab";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import Sidebar from "../../component/Sidebar/Sidebar";
import "./AllLabs.css";
export default function AllLabs() {
    const context = useGlobalContext();
    useEffect(() => {
        if (Object.keys(context.labs).length === 0) return;
        const hash = location.hash.replace("#", "");
        if (hash) {
            document
                .getElementById(hash)
                ?.scrollIntoView({ behavior: "smooth" });
        }
    }, [context.labs]);
    const sidebarList = Object.fromEntries(
        Object.entries(context.learningData)
            .filter(([title, data]) => {
                const labList = context.labs[title];
                return labList && Object.keys(labList).length > 0;
            })
            .map(([title, data]) => [title, { hash: data.url }]),
    );
    return (
        <div id="all-labs">
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    flexDirection: "row-reverse",
                }}
            >
                <Sidebar list={sidebarList}></Sidebar>
                <div className="lab-list">
                    {Object.entries(context.learningData).map(
                        ([title, data]) => {
                            const labList = context.labs[title]
                                ? Object.values(context.labs[title])
                                : [];
                            if (labList.length == 0) return;
                            return (
                                <section
                                    key={title}
                                    id={data.url}
                                    style={{
                                        marginLeft: "0px",
                                        background: "none",
                                        padding: "40px 40px 0",
                                    }}
                                >
                                    <h1 style={{ color: "var(--text-main)" }}>
                                        {title}
                                    </h1>
                                    {labList.map((lab) => (
                                        <Lab
                                            key={lab.image}
                                            link={`/lab/image/${lab.image}`}
                                        >
                                            {lab.name}
                                        </Lab>
                                    ))}
                                </section>
                            );
                        },
                    )}
                </div>
            </div>
        </div>
    );
}
