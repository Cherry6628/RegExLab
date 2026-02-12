import CodeSnippet from './CodeSnippet/CodeSnippet';
import './Quiz.css';
import Option from './option/Option';
export default function Quiz(){
    return(
        <div className="Quiz">
            <h1 className='header'>Cross-site scripting</h1>
            <p className='describe'>In this section, we'll explain what cross-site scripting is, describe the different varieties of cross-site scripting vulnerabilities, and spell out how to find and prevent cross-site scripting.</p>
            {/* <code>code</code> */}
            <CodeSnippet></CodeSnippet>
            <p className='question'>Which line contain the vulnerabilities?</p>
            <Option></Option>
            <Option></Option>
            <Option></Option>
            <Option></Option>
        </div>
    );
}