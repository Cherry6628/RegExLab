import Header from "../../component/Header/Header";
import XSSMaterial from "../../component/LearningMaterials/XSSMaterial";
import Sidebar from "../../component/Sidebar/Sidebar";
export default function LearningPage(){
    return(<>
        <div>
            <Header  style={{position:"fixed",top:"0",right:"0"}}></Header>
        </div>
        <div className="quizPage" style={{ width: "100vw", display: "flex", justifyContent: "center"}}>
            <Sidebar></Sidebar>
            <XSSMaterial></XSSMaterial>
        </div>
    </>);
}