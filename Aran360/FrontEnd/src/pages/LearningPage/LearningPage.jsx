import Header from "../../component/Header/Header";
import PathTraversalMaterial from "../../component/LearningMaterials/PathTraversalMaterial";
import PathTraversal from "../../component/LearningMaterials/PathTraversalMaterial";
import DOMBasedXSSMaterial from "../../component/LearningMaterials/XSS/DOMBasedXSSMaterial";
import XSSMaterial from "../../component/LearningMaterials/XSSMaterial";
import Sidebar from "../../component/Sidebar/Sidebar";
import XSSContexts from "../../component/LearningMaterials/XSS/XSSContexts";
import ExploitingXSSMaterial from "../../component/LearningMaterials/XSS/ExploitingXSSMaterial";
// import XSSAttacks from "../../component/LearningMaterials/XSS/XSSAttacks";
import XSSPrevention from "../../component/LearningMaterials/XSS/XSSPrevention";
import ContentSecurityPolicy from "../../component/LearningMaterials/XSS/ContentSecurityPolicy";
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
            {/* <XSSContexts></XSSContexts> */}
            {/* <ExploitingXSSMaterial></ExploitingXSSMaterial> */}
            {/* <XSSAttacks></XSSAttacks> */}
            {/* <XSSPrevention></XSSPrevention> */}
            <ContentSecurityPolicy></ContentSecurityPolicy>
        </div>
    </>);
}