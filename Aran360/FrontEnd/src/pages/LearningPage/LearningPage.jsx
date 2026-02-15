import Header from "../../component/Header/Header";
import PathTraversalMaterial from "../../component/LearningMaterials/PathTraversalMaterial";
import PathTraversal from "../../component/LearningMaterials/PathTraversalMaterial";
import DOMBasedXSSMaterial from "../../component/LearningMaterials/XSS/DOMBasedXSSMaterial";
import XSSMaterial from "../../component/LearningMaterials/XSSMaterial";
import Sidebar from "../../component/Sidebar/Sidebar";
import XSSContexts from "../../component/LearningMaterials/XSS/XSSContexts";
export default function LearningPage(){
    return(<>
        <div>
            <Header></Header>
        </div>
        <div className="quizPage" style={{ width: "100vw", display: "flex", justifyContent: "center"}}>
            <Sidebar></Sidebar>
            {/* <PathTraversalMaterial></PathTraversalMaterial> */}
            {/* <XSSMaterial/> */}
            {/* <DOMBasedXSSMaterial></DOMBasedXSSMaterial> */}
            <XSSContexts></XSSContexts>
        </div>
    </>);
}