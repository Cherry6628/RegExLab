import Header from "../../component/Header/Header";
import PathTraversalMaterial from "../../component/LearningMaterials/PathTraversalMaterial";
import PathTraversal from "../../component/LearningMaterials/PathTraversalMaterial";
import XSSMaterial from "../../component/LearningMaterials/XSSMaterial";
import Sidebar from "../../component/Sidebar/Sidebar";
export default function LearningPage(){
    return(<>
        <div>
            <Header></Header>
        </div>
        <div className="quizPage" style={{ width: "100vw", display: "flex", justifyContent: "center"}}>
            <Sidebar></Sidebar>
            {/* <PathTraversalMaterial></PathTraversalMaterial> */}
            <XSSMaterial/>
        </div>
    </>);
}