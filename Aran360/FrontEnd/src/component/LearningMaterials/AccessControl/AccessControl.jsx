import '../XSS/XSSMaterial.css';
import Lab from '../../Lab/Lab';
import Payloads from '../../Payloads/Payloads';
export default function AccessControl(){
    return(
        <div id='xss'>
            <section className='mainbar'>
                <section>
                    <h1>Access control vulnerabilities and privilege escalation</h1>
                    <p>In this section, we describe: </p>
                    <ul>
                        <li>Privilege escalation.</li>
                        <li>The types of vulnerabilities that can arise with access control.</li>
                        <li>How to prevent access control vulnerabilities. </li>
                    </ul>
                    <div className="labbox">
                        <h3>Labs</h3>
                        <p>If you're familiar with the basic concepts behind access control vulnerabilities and want to practice exploiting them on some realistic, deliberately vulnerable targets, you can access labs in this topic from the link below. </p>
                        <ul>
                            <li>View all access control labs</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h1>What is access control?</h1>
                    <p>Access control is the application of constraints on who or what is authorized to perform actions or access resources. In the context of web applications, access control is dependent on authentication and session management: </p>
                    <ul>
                        <li><b>Authentication</b> confirms that the user is who they say they are.</li>
                        <li><b>Session management</b> identifies which subsequent HTTP requests are being made by that same user. </li>
                        <li><b>Access control</b> determines whether the user is allowed to carry out the action that they are attempting to perform. </li>
                    </ul>
                    <p>Broken access controls are common and often present a critical security vulnerability. Design and management of access controls is a complex and dynamic problem that applies business, organizational, and legal constraints to a technical implementation. Access control design decisions have to be made by humans so the potential for errors is high. </p>
                    <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTsuQetG7gx75cG3aSkkiNH_qxhx0ZUB_JpjeHu9VrwODj0NkYN"/>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>Access control security models</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h3>Vertical access controls</h3>
                    <p>Vertical access controls are mechanisms that restrict access to sensitive functionality to specific types of users. </p>
                    <p>With vertical access controls, different types of users have access to different application functions. For example, an administrator might be able to modify or delete any user's account, while an ordinary user has no access to these actions. Vertical access controls can be more fine-grained implementations of security models designed to enforce business policies such as separation of duties and least privilege. </p>
                </section>
                <section>
                    <h3>Horizontal access controls</h3>
                    <p>Horizontal access controls are mechanisms that restrict access to resources to specific users. </p>
                    <p>With horizontal access controls, different users have access to a subset of resources of the same type. For example, a banking application will allow a user to view transactions and make payments from their own accounts, but not the accounts of any other user. </p>
                </section>
                <section>
                    <h3>Context-dependent access controls</h3>
                    <p>Context-dependent access controls restrict access to functionality and resources based upon the state of the application or the user's interaction with it. </p>
                    <p>Context-dependent access controls prevent a user performing actions in the wrong order. For example, a retail website might prevent users from modifying the contents of their shopping cart after they have made payment. </p>
                </section>
                <section>
                    <h1>Examples of broken access controls</h1>
                    <p>Broken access control vulnerabilities exist when a user can access resources or perform actions that they are not supposed to be able to. </p>
                    <h3>Vertical privilege escalation</h3>
                    <p> If a user can gain access to functionality that they are not permitted to access then this is vertical privilege escalation. For example, if a non-administrative user can gain access to an admin page where they can delete user accounts, then this is vertical privilege escalation.</p>
                    <h4>Unprotected functionality</h4>
                    <p>At its most basic, vertical privilege escalation arises where an application does not enforce any protection for sensitive functionality. For example, administrative functions might be linked from an administrator's welcome page but not from a user's welcome page. However, a user might be able to access the administrative functions by browsing to the relevant admin URL. </p>
                    <p>For example, a website might host sensitive functionality at the following URL: </p>
                    <Payloads>https://insecure-website.com/admin</Payloads>
                    <p>This might be accessible by any user, not only administrative users who have a link to the functionality in their user interface. In some cases, the administrative URL might be disclosed in other locations, such as the <span>robots.txt</span> file: </p>
                    <Payloads>https://insecure-website.com/robots.txt</Payloads>
                    <p>Even if the URL isn't disclosed anywhere, an attacker may be able to use a wordlist to brute-force the location of the sensitive functionality. </p>
                    <p>In some cases, sensitive functionality is concealed by giving it a less predictable URL. This is an example of so-called "security by obscurity". However, hiding sensitive functionality does not provide effective access control because users might discover the obfuscated URL in a number of ways. </p>
                    <p>Imagine an application that hosts administrative functions at the following URL: </p>
                    <Payloads>https://insecure-website.com/administrator-panel-yb556</Payloads>
                    <p>This might not be directly guessable by an attacker. However, the application might still leak the URL to users. The URL might be disclosed in JavaScript that constructs the user interface based on the user's role: </p>
                    <Payloads><pre>{`<script>
	var isAdmin = false;
	if (isAdmin) {
		...
		var adminPanelTag = document.createElement('a');
		adminPanelTag.setAttribute('href', 'https://insecure-website.com/administrator-panel-yb556');
		adminPanelTag.innerText = 'Admin panel';
		...
	}
</script>`}</pre></Payloads>
                    <p>This script adds a link to the user's UI if they are an admin user. However, the script containing the URL is visible to all users regardless of their role. </p>
                    <h4>Parameter-based access control methods</h4>
                    <p>Some applications determine the user's access rights or role at login, and then store this information in a user-controllable location. This could be: </p>
                    <ul>
                        <li>A hidden field. </li>
                        <li>A cookie. </li>
                        <li>A preset query string parameter. </li>
                    </ul>
                    <p>The application makes access control decisions based on the submitted value. For example: </p>
                    <Payloads>https://insecure-website.com/login/home.jsp?admin=true<br/>https://insecure-website.com/login/home.jsp?role=1</Payloads>
                    <p>This approach is insecure because a user can modify the value and access functionality they're not authorized to, such as administrative functions. </p>
                    <h4>Broken access control resulting from platform misconfiguration</h4>
                    <p>Some applications enforce access controls at the platform layer. they do this by restricting access to specific URLs and HTTP methods based on the user's role. For example, an application might configure a rule as follows: </p>
                    <Payloads>DENY: POST, /admin/deleteUser, managers</Payloads>
                    <p>This rule denies access to the <span>POST</span> method on the URL <span>/admin/deleteUser</span>, for users in the managers group. Various things can go wrong in this situation, leading to access control bypasses. </p>
                    <p>Some application frameworks support various non-standard HTTP headers that can be used to override the URL in the original request, such as <span>X-Original-URL</span> and <span>X-Rewrite-URL</span>. If a website uses rigorous front-end controls to restrict access based on the URL, but the application allows the URL to be overridden via a request header, then it might be possible to bypass the access controls using a request like the following: </p>
                    <Payloads>POST / HTTP/1.1<br/>X-Original-URL: /admin/deleteUser<br/>...</Payloads>
                    <p> An alternative attack relates to the HTTP method used in the request. The front-end controls described in the previous sections restrict access based on the URL and HTTP method. Some websites tolerate different HTTP request methods when performing an action. If an attacker can use the <span>GET</span> (or another) method to perform actions on a restricted URL, they can bypass the access control that is implemented at the platform layer. </p>
                    <h4>Broken access control resulting from URL-matching discrepancies</h4>
                    <p> Websites can vary in how strictly they match the path of an incoming request to a defined endpoint. For example, they may tolerate inconsistent capitalization, so a request to <span>/ADMIN/DELETEUSER</span> may still be mapped to the <span>/admin/deleteUser</span> endpoint. If the access control mechanism is less tolerant, it may treat these as two different endpoints and fail to enforce the correct restrictions as a result. </p>
                    <p>Similar discrepancies can arise if developers using the Spring framework have enabled the <span>useSuffixPatternMatch</span> option. This allows paths with an arbitrary file extension to be mapped to an equivalent endpoint with no file extension. In other words, a request to <span>/admin/deleteUser.anything</span> would still match the <span>/admin/deleteUser</span> pattern. Prior to Spring 5.3, this option is enabled by default. </p>
                    <p>On other systems, you may encounter discrepancies in whether <span>/admin/deleteUser</span> and <span>/admin/deleteUser/</span> are treated as distinct endpoints. In this case, you may be able to bypass access controls by appending a trailing slash to the path. </p>
                </section>
                <section>
                    <h3>Horizontal privilege escalation</h3>
                    <p>Horizontal privilege escalation occurs if a user is able to gain access to resources belonging to another user, instead of their own resources of that type. For example, if an employee can access the records of other employees as well as their own, then this is horizontal privilege escalation. </p>
                    <p>Horizontal privilege escalation attacks may use similar types of exploit methods to vertical privilege escalation. For example, a user might access their own account page using the following URL: </p>
                    <Payloads>https://insecure-website.com/myaccount?id=123</Payloads>
                    <p>If an attacker modifies the <span>id</span> parameter value to that of another user, they might gain access to another user's account page, and the associated data and functions. </p>
                    <div className="labbox">
                        <h3>Note</h3>
                        <p>This is an example of an insecure direct object reference (IDOR) vulnerability. This type of vulnerability arises where user-controller parameter values are used to access resources or functions directly. </p>
                    </div>
                    <p>In some applications, the exploitable parameter does not have a predictable value. For example, instead of an incrementing number, an application might use globally unique identifiers (GUIDs) to identify users. This may prevent an attacker from guessing or predicting another user's identifier. However, the GUIDs belonging to other users might be disclosed elsewhere in the application where users are referenced, such as user messages or reviews. </p>
                    <p>In some cases, an application does detect when the user is not permitted to access the resource, and returns a redirect to the login page. However, the response containing the redirect might still include some sensitive data belonging to the targeted user, so the attack is still successful. </p>
                </section>
                <section>
                    <h3>Horizontal to vertical privilege escalation</h3>
                    <p>Often, a horizontal privilege escalation attack can be turned into a vertical privilege escalation, by compromising a more privileged user. For example, a horizontal escalation might allow an attacker to reset or capture the password belonging to another user. If the attacker targets an administrative user and compromises their account, then they can gain administrative access and so perform vertical privilege escalation. </p>
                    <p>An attacker might be able to gain access to another user's account page using the parameter tampering technique already described for horizontal privilege escalation:</p>
                    <Payloads>https://insecure-website.com/myaccount?id=456</Payloads>
                    <p>If the target user is an application administrator, then the attacker will gain access to an administrative account page. This page might disclose the administrator's password or provide a means of changing it, or might provide direct access to privileged functionality. </p>
                </section>
                <section>
                    <h3>Insecure direct object references</h3>
                    <p>Insecure direct object references (IDORs) are a subcategory of access control vulnerabilities. IDORs occur if an application uses user-supplied input to access objects directly and an attacker can modify the input to obtain unauthorized access. It was popularized by its appearance in the OWASP 2007 Top Ten. It's just one example of many implementation mistakes that can provide a means to bypass access controls. </p>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>Insecure direct object references (IDOR)</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h3>Access control vulnerabilities in multi-step processes</h3>
                    <p>Many websites implement important functions over a series of steps. This is common when: </p>
                    <ul>
                        <li> A variety of inputs or options need to be captured. </li>
                        <li>The user needs to review and confirm details before the action is performed. </li>
                    </ul>
                    <p>For example, the administrative function to update user details might involve the following steps: </p>
                    <ol>
                        <li>Load the form that contains details for a specific user.</li>
                        <li>Submit the changes.</li>
                        <li>Review the changes and confirm.</li>
                    </ol>
                    <p>Sometimes, a website will implement rigorous access controls over some of these steps, but ignore others. Imagine a website where access controls are correctly applied to the first and second steps, but not to the third step. The website assumes that a user will only reach step 3 if they have already completed the first steps, which are properly controlled. An attacker can gain unauthorized access to the function by skipping the first two steps and directly submitting the request for the third step with the required parameters. </p>
                    <h3>Referer-based access control</h3>
                    <p>Some websites base access controls on the <span>Referer</span> header submitted in the HTTP request. The <span>Referer</span> header can be added to requests by browsers to indicate which page initiated a request. </p>
                    <p>For example, an application robustly enforces access control over the main administrative page at <span>/admin</span>, but for sub-pages such as <span>/admin/deleteUser</span> only inspects the <span>Referer</span> header. If the <span>Referer</span> header contains the main <span>/admin</span> URL, then the request is allowed. </p>
                    <p>In this case, the <span>Referer</span> header can be fully controlled by an attacker. This means that they can forge direct requests to sensitive sub-pages by supplying the required <span>Referer</span> header, and gain unauthorized access. </p>
                    <h3>Location-based access control</h3>
                    <p>Some websites enforce access controls based on the user's geographical location. This can apply, for example, to banking applications or media services where state legislation or business restrictions apply. These access controls can often be circumvented by the use of web proxies, VPNs, or manipulation of client-side geolocation mechanisms. </p>
                </section>
                <section>
                    <h1>How to prevent access control vulnerabilities</h1>
                    <p>Access control vulnerabilities can be prevented by taking a defense-in-depth approach and applying the following principles: </p>
                    <ul>
                        <li>Never rely on obfuscation alone for access control. </li>
                        <li>Unless a resource is intended to be publicly accessible, deny access by default. </li>
                        <li>Wherever possible, use a single application-wide mechanism for enforcing access controls. </li>
                        <li>At the code level, make it mandatory for developers to declare the access that is allowed for each resource, and deny access by default. </li>
                        <li>Thoroughly audit and test access controls to ensure they work as designed. </li>
                    </ul>
                </section>
            </section>
        </div>
    );
}