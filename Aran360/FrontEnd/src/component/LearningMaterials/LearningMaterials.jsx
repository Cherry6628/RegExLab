import { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

export default function LearningMaterials({ list }) {
  const [activeId, setActiveId] = useState(Object.keys(list)[0]);
  
  const activeItem = list[activeId];
  console.log(list);
  console.log(activeId);
  
  const ActiveComponent = activeItem?.comp;
  console.log(ActiveComponent);
  return (
    <>
      <div style={{ height: "100px" }}>
            <Header/>
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

        {ActiveComponent?<ActiveComponent />:<h1>No Learning Material Found</h1>}
      </div>
    </>
  );
}
