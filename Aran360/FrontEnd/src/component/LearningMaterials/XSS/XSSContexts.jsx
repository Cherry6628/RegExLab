import Payloads from "../../Payloads/Payloads";
export default function XSSContexts() {
    return (
        <div id="learning-material-main-box">
            <section className="mainbar">
                <section>
                    <h1>Cross-site scripting contexts</h1>
                    <p>
                        When testing for <u>reflected</u> and <u>stored</u> XSS,
                        a key task is to identify the XSS context:
                    </p>
                    <ul>
                        <li>
                            The location within the response where
                            attacker-controllable data appears.
                        </li>
                        <li>
                            Any input validation or other processing that is
                            being performed on that data by the application.
                        </li>
                    </ul>
                    <p>
                        Based on these details, you can then select one or more
                        candidate XSS payloads, and test whether they are
                        effective.
                    </p>
                    <div className="labbox">
                        <h3>Note</h3>
                        <p>
                            We have built a comprehensive XSS cheat sheet to
                            help testing web applications and filters. You can
                            filter by events and tags and see which vectors
                            require user interaction. The cheat sheet also
                            contains AngularJS sandbox escapes and many other
                            sections to help with XSS research.
                        </p>
                    </div>
                </section>
                <section>
                    <h1>XSS between HTML tags</h1>
                    <p>
                        When the XSS context is text between HTML tags, you need
                        to introduce some new HTML tags designed to trigger
                        execution of JavaScript.
                    </p>
                    <p>Some useful ways of executing JavaScript are:</p>
                    <Payloads>
                        {`<script>alt(document.domain)</script>`}
                        <br />
                        {`<img src=1 onerror=alert(1)>`}
                    </Payloads>
                </section>
                <section>
                    <h1>XSS in HTML tag attributes</h1>
                    <p>
                        When the XSS context is into an HTML tag attribute
                        value, you might sometimes be able to terminate the
                        attribute value, close the tag, and introduce a new one.
                        For example:
                    </p>
                    <Payloads>{`"<script>art(document.domain)</script`}</Payloads>
                    <p>
                        More commonly in this situation, angle brackets are
                        blocked or encoded, so your input cannot break out of
                        the tag in which it appears. Provided you can terminate
                        the attribute value, you can normally introduce a new
                        attribute that creates a scriptable context, such as an
                        event handler. For example:
                    </p>
                    <Payloads>
                        " autofocus onfocus=alert(document.domain) x="
                    </Payloads>
                    <p>
                        The above payload creates an <span>onfocus</span> event
                        that will execute JavaScript when the element receives
                        the focus, and also adds the
                        <span>autofocus</span> attribute to try to trigger the{" "}
                        <span>onfocus</span> event automatically without any
                        user interaction. Finally, it adds <span>x="</span> to
                        gracefully repair the following markup.
                    </p>
                    <p>
                        Sometimes the XSS context is into a type of HTML tag
                        attribute that itself can create a scriptable context.
                        Here, you can execute JavaScript without needing to
                        terminate the attribute value. For example, if the XSS
                        context is into the <span>href</span> attribute of an
                        anchor tag, you can use the <span>javascript</span>{" "}
                        pseudo-protocol to execute script. For example:
                    </p>
                    <Payloads>{`<a href="javascript:alert(document.domain)"></a>`}</Payloads>
                    <p>
                        You might encounter websites that encode angle brackets
                        but still allow you to inject attributes. Sometimes,
                        these injections are possible even within tags that
                        don't usually fire events automatically, such as a
                        canonical tag. You can exploit this behavior using
                        access keys and user interaction on Chrome. Access keys
                        allow you to provide keyboard shortcuts that reference a
                        specific element. The accesskey attribute allows you to
                        define a letter that, when pressed in combination with
                        other keys (these vary across different platforms), will
                        cause events to fire. In the next lab you can experiment
                        with access keys and exploit a canonical tag. You can
                        exploit XSS in hidden input fields using a technique
                        invented by PortSwigger Research.
                    </p>
                </section>
                <section>
                    <h1>XSS into JavaScript</h1>
                    <p>
                        When the XSS context is some existing JavaScript within
                        the response, a wide variety of situations can arise,
                        with different techniques necessary to perform a
                        successful exploit.
                    </p>
                    <section>
                        <h3>Terminating the existing script</h3>
                        <p>
                            In the simplest case, it is possible to simply close
                            the script tag that is enclosing the existing
                            JavaScript, and introduce some new HTML tags that
                            will trigger execution of JavaScript. For example,
                            if the XSS context is as follows:
                        </p>
                        <Payloads>
                            {`<script>`}
                            <br />
                            {`...`}
                            <br />
                            {`var input = 'controllable data here';`}
                            <br />
                            {`...`}
                            <br />
                            {`</script><`}
                        </Payloads>
                        <p>
                            then you can use the following payload to break out
                            of the existing JavaScript and execute your own:
                        </p>
                        <Payloads>{`</script><img src=1 onerror=alt(document.domain)>`}</Payloads>
                        <p>
                            The reason this works is that the browser first
                            performs HTML parsing to identify the page elements
                            including blocks of script, and only later performs
                            JavaScript parsing to understand and execute the
                            embedded scripts. The above payload leaves the
                            original script broken, with an unterminated string
                            literal. But that doesn't prevent the subsequent
                            script being parsed and executed in the normal way.
                        </p>
                    </section>
                    <section>
                        <h3>Breaking out of a JavaScript string</h3>
                        <p>
                            In cases where the XSS context is inside a quoted
                            string literal, it is often possible to break out of
                            the string and execute JavaScript directly. It is
                            essential to repair the script following the XSS
                            context, because any syntax errors there will
                            prevent the whole script from executing.
                        </p>
                        <p>
                            Some useful ways of breaking out of a string literal
                            are:
                        </p>
                        <Payloads>
                            ';alert(document.domain)//
                            <br />
                            '-alert(document.domain)-'
                        </Payloads>
                        <p>
                            Some applications attempt to prevent input from
                            breaking out of the JavaScript string by escaping
                            any single quote characters with a backslash. A
                            backslash before a character tells the JavaScript
                            parser that the character should be interpreted
                            literally, and not as a special character such as a
                            string terminator. In this situation, applications
                            often make the mistake of failing to escape the
                            backslash character itself. This means that an
                            attacker can use their own backslash character to
                            neutralize the backslash that is added by the
                            application.
                        </p>
                        <p>For example, suppose that the input:</p>
                        <Payloads>';alert(document.domain)//</Payloads>
                        <p>gets converted to:</p>
                        <Payloads>';alert(document.domain)//</Payloads>
                        <p>gets converted to:</p>
                        <Payloads>';alert(document.domain)//</Payloads>
                        <p>which gets converted to:</p>
                        <Payloads>';alert(document.domain)//</Payloads>
                        <p>
                            Here, the first backslash means that the second
                            backslash is interpreted literally, and not as a
                            special character. This means that the quote is now
                            interpreted as a string terminator, and so the
                            attack succeeds.
                        </p>
                        <p>
                            Some websites make XSS more difficult by restricting
                            which characters you are allowed to use. This can be
                            on the website level or by deploying a WAF that
                            prevents your requests from ever reaching the
                            website. In these situations, you need to experiment
                            with other ways of calling functions which bypass
                            these security measures. One way of doing this is to
                            use the <span>throw</span> statement with an
                            exception handler. This enables you to pass
                            arguments to a function without using parentheses.
                            The following code assigns the
                            <span>alert()</span> function to the global
                            exception handler and the <span>throw</span>
                            statement passes the <span>1</span> to the exception
                            handler (in this case
                            <span>alert</span>). The end result is that the{" "}
                            <span>alert()</span> function is called with
                            <span>1</span> as an argument.
                        </p>
                        <Payloads>onerror=alert;throw 1</Payloads>
                        <p>
                            There are multiple ways of using this technique to
                            call functions without parentheses.
                        </p>
                        <p>
                            The next lab demonstrates a website that filters
                            certain characters. You'll have to use similar
                            techniques to those described above in order to
                            solve it.
                        </p>
                    </section>
                    <section>
                        <h3>Making use of HTML-encoding</h3>
                        <p>
                            When the XSS context is some existing JavaScript
                            within a quoted tag attribute, such as an event
                            handler, it is possible to make use of HTML-encoding
                            to work around some input filters.
                        </p>
                        <p>
                            When the browser has parsed out the HTML tags and
                            attributes within a response, it will perform
                            HTML-decoding of tag attribute values before they
                            are processed any further. If the server-side
                            application blocks or sanitizes certain characters
                            that are needed for a successful XSS exploit, you
                            can often bypass the input validation by
                            HTML-encoding those characters.
                        </p>
                        <p>For example, if the XSS context is as follows:</p>
                        <Payloads>{`<a href="#" onclick="... var input='controllable data here'; ...">`}</Payloads>
                        <p>
                            and the application blocks or escapes single quote
                            characters, you can use the following payload to
                            break out of the JavaScript string and execute your
                            own script:
                        </p>
                        <Payloads>
                            {`&apos;`}-alert(document.domain)-{`&apos;`}
                        </Payloads>
                        <p>
                            The <span>{`&apos;`}</span> sequence is an HTML
                            entity representing an apostrophe or single quote.
                            Because the browser HTML-decodes the value of the{" "}
                            <span>onclick</span> attribute before the JavaScript
                            is interpreted, the entities are decoded as quotes,
                            which become string delimiters, and so the attack
                            succeeds.
                        </p>
                    </section>
                    <section>
                        <h3>XSS in JavaScript template literals</h3>
                        <p>
                            JavaScript template literals are string literals
                            that allow embedded JavaScript expressions. The
                            embedded expressions are evaluated and are normally
                            concatenated into the surrounding text. Template
                            literals are encapsulated in backticks instead of
                            normal quotation marks, and embedded expressions are
                            identified using the
                            <span>{"$..."}</span> syntax.
                        </p>
                        <p>
                            For example, the following script will print a
                            welcome message that includes the user's display
                            name:
                        </p>
                        <Payloads>
                            {`<p>document.getElementById('message').innerText = 'Welcome, `}
                            {"${user.displayName}"}
                            {`.';</p> `}
                        </Payloads>
                        <p>
                            When the XSS context is into a JavaScript template
                            literal, there is no need to terminate the literal.
                            Instead, you simply need to use the{" "}
                            <span>{"$..."}</span> syntax to embed a JavaScript
                            expression that will be executed when the literal is
                            processed. For example, if the XSS context is as
                            follows:
                        </p>
                        <Payloads>
                            {`<script>`}
                            <br />
                            {`...`}
                            <br />
                            {` var input = 'controllable data here';`}
                            <br />
                            {`...`}
                            <br />
                            {`</script>`}
                        </Payloads>
                        <p>
                            then you can use the following payload to execute
                            JavaScript without terminating the template literal:
                        </p>
                        <Payloads>{"${alert(document.domain)}"}</Payloads>
                    </section>
                </section>
                <section>
                    <h1>XSS via client-side template injection</h1>
                    <p>
                        Some websites use a client-side template framework, such
                        as AngularJS, to dynamically render web pages. If they
                        embed user input into these templates in an unsafe
                        manner, an attacker may be able to inject their own
                        malicious template expressions that launch an XSS
                        attack.
                    </p>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>Client-side template injection</li>
                        </ul>
                    </div>
                </section>
            </section>
        </div>
    );
}
