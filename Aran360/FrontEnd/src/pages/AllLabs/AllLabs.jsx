import Header from "../../component/Header/Header";
import { useEffect, useState } from "react";
import Lab from "../../component/Lab/Lab";
import { backendFetch } from "../../utils/helpers";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";

export default function AllLabs() {
    const [labs, setLabs] = useState({});
    const context = useGlobalContext();

    useEffect(() => {
        backendFetch("/all-labs", { method: "GET" }).then((r) => {
            if (r.status === "success") setLabs(r.data);
        });
    }, []);

    useEffect(() => {
        if (Object.keys(labs).length === 0) return;
        const hash = location.hash.replace("#", "");
        if (hash) {
            document
                .getElementById(hash)
                ?.scrollIntoView({ behavior: "smooth" });
        }
    }, [labs]);

    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="all-labs">
                {Object.entries(context.learningData).map(([title, data]) => {
                    const labList = labs[title] ? Object.values(labs[title]) : [];
                    return (
                        <section key={title} id={data.url}>
                            <h1>{title}</h1>
                            {labList.map((lab) => (
                                <Lab
                                    key={lab.image}
                                    link={`/lab/view/${lab.image}`}
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
