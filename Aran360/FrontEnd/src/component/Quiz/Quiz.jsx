import CodeSnippet from '../CodeSnippet/CodeSnippet';
import './Quiz.css';
import Option from './Option/Option';
import Button from '../Button/Button';
export default function Quiz(){
    return(
        <div className="Quiz">
            <h1 className='headline'>Cross-site scripting</h1>
            <p className='describe'>In this section, we'll explain what cross-site scripting is, describe the different varieties of cross-site scripting vulnerabilities, and spell out how to find and prevent cross-site scripting.</p>
            <CodeSnippet></CodeSnippet>
            <p className='question'>Which line contain the vulnerabilities?</p>
            <Option></Option>
            <Option></Option>
            <Option></Option>
            <Option></Option>
            <div className='btns'>
                <Button>Get Answer</Button>
                <Button>Submit</Button>
            </div>
        </div>
    );
}