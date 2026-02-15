import './XSSMaterial.css';
export default function ContentSecurityPolicy(){
    return(
        <div id="xss">
        <section className="mainbar">
            <section>
                <h1>Content security policy</h1>
                <p>In this section, we'll explain what content security policy is, and describe how CSP can be used to mitigate against some common attacks.</p>
                <h1>What is CSP (content security policy)?</h1>
                <p>CSP is a browser security mechanism that aims to mitigate XSS and some other attacks. It works by restricting the resources (such as scripts and images) that a page can load and restricting whether a page can be framed by other pages.</p>
                <p>To enable CSP, a response needs to include an HTTP response header called Content-Security-Policy with a value containing the policy. The policy itself consists of one or more directives, separated by semicolons.</p>
            </section>
        <section>
            <h1>Mitigating XSS attacks using CSP</h1>
            <p>The following directive will only allow scripts to be loaded from the same origin as the page itself:</p>
            <div className="code">
                <p>script-src 'self'</p>
            </div>
            <p>The following directive will only allow scripts to be loaded from a specific domain:</p>
            <div className="code">
                <p>script-src https://scripts.normal-website.com</p>
            </div>
            <p>Care should be taken when allowing scripts from external domains. If there is any way for an attacker to control content that is served from the external domain, then they might be able to deliver an attack. For example, content delivery networks (CDNs) that do not use per-customer URLs, such as ajax.googleapis.com, should not be trusted, because third parties can get content onto their domains.</p>
            <p>In addition to whitelisting specific domains, content security policy also provides two other ways of specifying trusted resources: nonces and hashes:</p>
            <ul>
                <li>The CSP directive can specify a nonce (a random value) and the same value must be used in the tag that loads a script. If the values do not match, then the script will not execute. To be effective as a control, the nonce must be securely generated on each page load and not be guessable by an attacker.</li>
                <li>The CSP directive can specify a hash of the contents of the trusted script. If the hash of the actual script does not match the value specified in the directive, then the script will not execute. If the content of the script ever changes, then you will of course need to update the hash value that is specified in the directive.</li>
            </ul>
            <p>It's quite common for a CSP to block resources like script. However, many CSPs do allow image requests. This means you can often use img elements to make requests to external servers in order to disclose CSRF tokens, for example.</p>
            <p>Some browsers, such as Chrome, have built-in dangling markup mitigation that will block requests containing certain characters, such as raw, unencoded new lines or angle brackets.</p>
            <p>Some policies are more restrictive and prevent all forms of external requests. However, it's still possible to get round these restrictions by eliciting some user interaction. To bypass this form of policy, you need to inject an HTML element that, when clicked, will store and send everything enclosed by the injected element to an external server.</p>
        </section>
        <section>
            <h1>Mitigating dangling markup attacks using CSP</h1>
            <p>The following directive will only allow images to be loaded from the same origin as the page itself:</p>
            <div className="code">
                <p>img-src 'self'</p>
            </div>
            <p>The following directive will only allow images to be loaded from a specific domain:</p>
            <div className="code">
                <p>img-src https://images.normal-website.com</p>
            </div>
            <p>Note that these policies will prevent some dangling markup exploits, because an easy way to capture data with no user interaction is using an img tag. However, it will not prevent other exploits, such as those that inject an anchor tag with a dangling href attribute.</p>
        </section>
        <section>
            <h1>Bypassing CSP with policy injection</h1>
            <p>You may encounter a website that reflects input into the actual policy, most likely in a report-uri directive. If the site reflects a parameter that you can control, you can inject a semicolon to add your own CSP directives. Usually, this report-uri directive is the final one in the list. This means you will need to overwrite existing directives in order to exploit this vulnerability and bypass the policy.</p>
            <p>Normally, it's not possible to overwrite an existing script-src directive. However, Chrome recently introduced the script-src-elem directive, which allows you to control script elements, but not events. Crucially, this new directive allows you to overwrite existing script-src directives. Using this knowledge, you should be able to solve the following lab.</p>
        </section>
        <section>
            <h1>Protecting against clickjacking using CSP</h1>
            <p>The following directive will only allow the page to be framed by other pages from the same origin:</p>
            <div className="code">
                <p>frame-ancestors 'self'</p>
            </div>
            <p>The following directive will prevent framing altogether:</p>
            <div className="code">
                <p>frame-ancestors 'none'</p>
            </div>
            <p>Using content security policy to prevent clickjacking is more flexible than using the X-Frame-Options header because you can specify multiple domains and use wildcards. For example:</p>
            <div className="code">
                <p>frame-ancestors 'self' https://normal-website.com https://*.robust-website.com</p>
            </div>
            <p>CSP also validates each frame in the parent frame hierarchy, whereas X-Frame-Options only validates the top-level frame.</p>
            <p>Using CSP to protect against clickjacking attacks is recommended. You can also combine this with the X-Frame-Options header to provide protection on older browsers that don't support CSP, such as Internet Explorer.</p>
        </section>
        </section>
    </div>
    );
}