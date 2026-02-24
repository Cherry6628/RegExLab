import Header from "../../component/Header/Header";
import { useEffect, useState } from "react";
import Lab from "../../component/Lab/Lab";
import { backendFetch } from "../../utils/helpers";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";

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

    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="all-labs">
                {Object.entries(context.learningData).map(([title, data]) => {
                    const labList = context.labs[title] ? Object.values(context.labs[title]) : [];
                    if (labList.length==0)return;
                    return (
                        <section key={title} id={data.url} style={{marginLeft: "0px"}}>
                            <h1 style={{color: "var(--text-main)"}}>{title}</h1>
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
                })}
            </div>
        </>
    );
}
