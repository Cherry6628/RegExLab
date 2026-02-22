import LearningMaterials from "../../component/LearningMaterials/LearningMaterials";
import QuizMain from "../../component/Quiz/QuizMain";
import QuizResult from "../../component/Quiz/QuizResult";
import AuthPage from "../../pages/AuthPage/AuthPage";
import Profile from "../../pages/Profile/Profile";
import Dashboard from "../../pages/Dashboard/Dashboard";
import NotFound_404 from "../../pages/NotFound_404/NotFound_404";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { frontendbasename } from "../../utils/params";
import { useGlobalContext } from "../ContextProvider/ContextProvider";
import AllLabs from "../../pages/AllLabs/AllLabs";
import Redirect from "../../component/Redirect/Redirect";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
export default function NavigationModal() {
  const context = useGlobalContext();
  return (
    <BrowserRouter basename={frontendbasename}>
      <Routes>
        {/* <Route path="/learning-material/xss" element={<XSSMain/>}/> */}
        {Object.keys(context.learningData).map((key)=>{
          console.log(context.learningData[key].url)
          return <Route key={key} path={"/learning-material/"+context.learningData[key].url} element={<LearningMaterials list={context.learningData[key].subTitles}/>}/>
        })}
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/accounts" element={context.uname?<Profile/>:<AuthPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/all-labs" element={<AllLabs/>}/>
        <Route path="/test" element={<QuizMain/>} />
        <Route path="/result" element={<QuizResult/>} />
        <Route path="/" element={<Redirect path="/dashboard"/>}/>
        <Route path="*" element={<NotFound_404/>} />
      </Routes>
    </BrowserRouter>
  );
}
