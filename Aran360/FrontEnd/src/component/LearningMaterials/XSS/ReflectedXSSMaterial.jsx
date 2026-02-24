import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
import "./XSSMaterial.css";
export default function ReflectedXSSMaterial() {
  return (
    <div id="xss">
      <section className="mainbar">
        <section>
          <h1>Reflected XSS</h1>
          <p>
            In this section, we'll explain reflected cross-site scripting,
            describe the impact of reflected XSS attacks, and spell out how to
            find reflected XSS vulnerabilities.
          </p>
          <h1>What is reflected cross-site scripting?</h1>
          <p>
            Reflected cross-site scripting (or XSS) arises when an application
            receives data in an HTTP request and includes that data within the
            immediate response in an unsafe way.
          </p>
          <p>
            Suppose a website has a search function which receives the
            user-supplied search term in a URL parameter:
          </p>
          <Payloads>https://insecure-website.com/search?term=gift</Payloads>
          <p>
            The application echoes the supplied search term in the response to
            this URL:
          </p>
          <Payloads>{`<p>You searched for: gift</p>`}</Payloads>
          <p>
            Assuming the application doesn't perform any other processing of the
            data, an attacker can construct an attack like this:
          </p>
          <Payloads>{`https://insecure-website.com/search?term=<script>/*+Bad+stuff+here...+*/</script>`}</Payloads>
          <p>This URL results in the following response:</p>
          <Payloads>{`<p>You searched for: <script>/* Bad stuff here... */</script></p>`}</Payloads>
          <p>
            If another user of the application requests the attacker's URL, then
            the script supplied by the attacker will execute in the victim
            user's browser, in the context of their session with the
            application.
          </p>
        </section>
        <section>
          <h1>Impact of reflected XSS attacks</h1>
          <p>
            If an attacker can control a script that is executed in the victim's
            browser, then they can typically fully compromise that user. Amongst
            other things, the attacker can:
          </p>
          <ul>
            <li>
              Perform any action within the application that the user can
              perform.
            </li>
            <li>View any information that the user is able to view.</li>
            <li>Modify any information that the user is able to modify.</li>
            <li>
              Initiate interactions with other application users, including
              malicious attacks, that will appear to originate from the initial
              victim user.
            </li>
          </ul>
          <p>
            There are various means by which an attacker might induce a victim
            user to make a request that they control, to deliver a reflected XSS
            attack. These include placing links on a website controlled by the
            attacker, or on another website that allows content to be generated,
            or by sending a link in an email, tweet or other message. The attack
            could be targeted directly against a known user, or could be an
            indiscriminate attack against any users of the application.
          </p>
          <p>
            The need for an external delivery mechanism for the attack means
            that the impact of reflected XSS is generally less severe than
            stored XSS, where a self-contained attack can be delivered within
            the vulnerable application itself.
          </p>
          <div className="labbox">
            <h3>Read more</h3>
            <ul>
              <li>Exploiting cross-site scripting vulnerabilities</li>
            </ul>
          </div>
        </section>
        <section>
          <h1>Reflected XSS in different contexts</h1>
          <p>
            There are many different varieties of reflected cross-site
            scripting. The location of the reflected data within the
            application's response determines what type of payload is required
            to exploit it and might also affect the impact of the vulnerability.
          </p>
          <p>
            In addition, if the application performs any validation or other
            processing on the submitted data before it is reflected, this will
            generally affect what kind of XSS payload is needed.
          </p>
          <div className="labbox">
            <h3>Read more</h3>
            <ul>
              <li>Cross-site scripting contexts</li>
            </ul>
          </div>
        </section>
        <section>
          <h1>How to find and test for reflected XSS vulnerabilities</h1>
          <p>
            The vast majority of reflected cross-site scripting vulnerabilities
            can be found quickly and reliably using Burp Suite's web
            vulnerability scanner.
          </p>
          <p>
            Testing for reflected XSS vulnerabilities manually involves the
            following steps:
          </p>
          <ul>
            <li>
              <b>Test every entry point.</b> Test separately every entry point for data
              within the application's HTTP requests. This includes parameters
              or other data within the URL query string and message body, and
              the URL file path. It also includes HTTP headers, although
              XSS-like behavior that can only be triggered via certain HTTP
              headers may not be exploitable in practice.
            </li>
            <li>
              <b>Submit random alphanumeric values.</b> For each entry point, submit a
              unique random value and determine whether the value is reflected
              in the response. The value should be designed to survive most
              input validation, so needs to be fairly short and contain only
              alphanumeric characters. But it needs to be long enough to make
              accidental matches within the response highly unlikely. A random
              alphanumeric value of around 8 characters is normally ideal. You
              can use Burp Intruder's number payloads with randomly generated
              hex values to generate suitable random values. And you can use
              Burp Intruder's grep payloads settings to automatically flag
              responses that contain the submitted value.
            </li>
            <li>
              <b>Determine the reflection context.</b> For each location within the
              response where the random value is reflected, determine its
              context. This might be in text between HTML tags, within a tag
              attribute which might be quoted, within a JavaScript string, etc.
            </li>
            <li>
              <b>Test a candidate payload.</b> Based on the context of the reflection,
              test an initial candidate XSS payload that will trigger JavaScript
              execution if it is reflected unmodified within the response. The
              easiest way to test payloads is to send the request to Burp
              Repeater, modify the request to insert the candidate payload,
              issue the request, and then review the response to see if the
              payload worked. An efficient way to work is to leave the original
              random value in the request and place the candidate XSS payload
              before or after it. Then set the random value as the search term
              in Burp Repeater's response view. Burp will highlight each
              location where the search term appears, letting you quickly locate
              the reflection.
            </li>
            <li>
              <b>Test alternative payloads.</b> If the candidate XSS payload was
              modified by the application, or blocked altogether, then you will
              need to test alternative payloads and techniques that might
              deliver a working XSS attack based on the context of the
              reflection and the type of input validation that is being
              performed. For more details, see <u>cross-site scripting contexts</u>
            </li>
            <li>
              <b>Test the attack in a browser.</b> Finally, if you succeed in finding a
              payload that appears to work within Burp Repeater, transfer the
              attack to a real browser (by pasting the URL into the address bar,
              or by modifying the request in Burp Proxy's intercept view, and
              see if the injected JavaScript is indeed executed. Often, it is
              best to execute some simple JavaScript like <span>alert(document.domain)</span>
              which will trigger a visible popup within the browser if the
              attack succeeds.
            </li>
          </ul>
        </section>
        <section>
          <h1>Common questions about reflected cross-site scripting</h1>
          <p>
            <b>What is the difference between reflected XSS and stored XSS?</b>
            Reflected XSS arises when an application takes some input from an
            HTTP request and embeds that input into the immediate response in an
            unsafe way. With stored XSS, the application instead stores the
            input and embeds it into a later response in an unsafe way.
          </p>
          <p>
            <b>What is the difference between reflected XSS and self-XSS?</b> Self-XSS
            involves similar application behavior to regular reflected XSS,
            however it cannot be triggered in normal ways via a crafted URL or a
            cross-domain request. Instead, the vulnerability is only triggered
            if the victim themselves submits the XSS payload from their browser.
            Delivering a self-XSS attack normally involves socially engineering
            the victim to paste some attacker-supplied input into their browser.
            As such, it is normally considered to be a lame, low-impact issue.
          </p>
        </section>
      </section>
    </div>
  );
}