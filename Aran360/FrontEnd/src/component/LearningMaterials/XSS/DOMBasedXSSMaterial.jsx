import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
import "./XSSMaterial.css";
export default function DOMBasedXSSMaterial() {
    return (
        <div id="xss">
            <section className="mainbar">
                <section>
                    <h1>DOM-based XSS</h1>
                    <p>
                        In this section, we'll describe DOM-based cross-site
                        scripting (DOM XSS), explain how to find DOM XSS
                        vulnerabilities, and talk about how to exploit DOM XSS
                        with different sources and sinks.
                    </p>
                    <h1>What is DOM-based cross-site scripting?</h1>
                    <p>
                        DOM-based XSS vulnerabilities usually arise when
                        JavaScript takes data from an attacker-controllable
                        source, such as the URL, and passes it to a sink that
                        supports dynamic code execution, such as{" "}
                        <span>eval()</span> or <span>innerHTML</span>. This
                        enables attackers to execute malicious JavaScript, which
                        typically allows them to hijack other users' accounts.
                    </p>
                    <p>
                        To deliver a DOM-based XSS attack, you need to place
                        data into a source so that it is propagated to a sink
                        and causes execution of arbitrary JavaScript.
                    </p>
                    <p>
                        The most common source for DOM XSS is the URL, which is
                        typically accessed with the <span>window.location</span>{" "}
                        object. An attacker can construct a link to send a
                        victim to a vulnerable page with a payload in the query
                        string and fragment portions of the URL. In certain
                        circumstances, such as when targeting a 404 page or a
                        website running PHP, the payload can also be placed in
                        the path.
                    </p>
                    <p>
                        For a detailed explanation of the taint flow between
                        sources and sinks, please refer to the DOM-based
                        vulnerabilities page.
                    </p>
                </section>
                <section>
                    <h1>How to test for DOM-based cross-site scripting</h1>
                    <p>
                        The majority of DOM XSS vulnerabilities can be found
                        quickly and reliably using Burp Suite's web
                        vulnerability scanner. To test for DOM-based cross-site
                        scripting manually, you generally need to use a browser
                        with developer tools, such as Chrome. You need to work
                        through each available source in turn, and test each one
                        individually.
                    </p>
                    <section>
                        <h1>Testing HTML sinks</h1>
                        <p>
                            To test for DOM XSS in an HTML sink, place a random
                            alphanumeric string into the source (such as{" "}
                            <span>location.search</span>), then use developer
                            tools to inspect the HTML and find where your string
                            appears. Note that the browser's "View source"
                            option won't work for DOM XSS testing because it
                            doesn't take account of changes that have been
                            performed in the HTML by JavaScript. In Chrome's
                            developer tools, you can use <span>Control+F</span>{" "}
                            (or <span>Command+F</span> on MacOS) to search the
                            DOM for your string.
                        </p>
                        <p>
                            For each location where your string appears within
                            the DOM, you need to identify the context. Based on
                            this context, you need to refine your input to see
                            how it is processed. For example, if your string
                            appears within a double-quoted attribute then try to
                            inject double quotes in your string to see if you
                            can break out of the attribute.
                        </p>
                        <p>
                            Note that browsers behave differently with regards
                            to URL-encoding, Chrome, Firefox, and Safari will
                            URL-encode <span>location.search</span> and{" "}
                            <span>location.hash</span>, while IE11 and Microsoft
                            Edge (pre-Chromium) will not URL-encode these
                            sources. If your data gets URL-encoded before being
                            processed, then an XSS attack is unlikely to work.
                        </p>
                        <h1>Testing JavaScript execution sinks</h1>
                        <p>
                            Testing JavaScript execution sinks for DOM-based XSS
                            is a little harder. With these sinks, your input
                            doesn't necessarily appear anywhere within the DOM,
                            so you can't search for it. Instead you'll need to
                            use the JavaScript debugger to determine whether and
                            how your input is sent to a sink.
                        </p>
                        <p>
                            For each potential source, such as{" "}
                            <span>location</span>, you first need to find cases
                            within the page's JavaScript code where the source
                            is being referenced. In Chrome's developer tools,
                            you can use <span>Control+Shift+F</span> (or{" "}
                            <span>Command+Alt+F</span> on MacOS) to search all
                            the page's JavaScript code for the source.
                        </p>
                        <p>
                            Once you've found where the source is being read,
                            you can use the JavaScript debugger to add a break
                            point and follow how the source's value is used. You
                            might find that the source gets assigned to other
                            variables. If this is the case, you'll need to use
                            the search function again to track these variables
                            and see if they're passed to a sink. When you find a
                            sink that is being assigned data that originated
                            from the source, you can use the debugger to inspect
                            the value by hovering over the variable to show its
                            value before it is sent to the sink. Then, as with
                            HTML sinks, you need to refine your input to see if
                            you can deliver a successful XSS attack.
                        </p>
                        <h1>Testing for DOM XSS using DOM Invader</h1>
                        <p>
                            Identifying and exploiting DOM XSS in the wild can
                            be a tedious process, often requiring you to
                            manually trawl through complex, minified JavaScript.
                            If you use Burp's browser, however, you can take
                            advantage of its built-in DOM Invader extension,
                            which does a lot of the hard work for you.
                        </p>
                        <div className="labbox">
                            <h3>Read more</h3>
                            <ul>
                                <li>DOM Invader documentation</li>
                            </ul>
                        </div>
                    </section>
                    <section>
                        <h1>
                            Exploiting DOM XSS with different sources and sinks
                        </h1>
                        <p>
                            In principle, a website is vulnerable to DOM-based
                            cross-site scripting if there is an executable path
                            via which data can propagate from source to sink. In
                            practice, different sources and sinks have differing
                            properties and behavior that can affect
                            exploitability, and determine what techniques are
                            necessary. Additionally, the website's scripts might
                            perform validation or other processing of data that
                            must be accommodated when attempting to exploit a
                            vulnerability. There are a variety of sinks that are
                            relevant to DOM-based vulnerabilities. Please refer
                            to the <u>list</u> below for details.
                        </p>
                        <p>
                            The <span>document.write</span> sink works with{" "}
                            <span>script</span> elements, so you can use a
                            simple payload, such as the one below:
                        </p>
                        <Payloads>
                            document.write('...
                            &lt;script&gt;alert(document.domain)&lt;/script&gt;
                            ...');
                        </Payloads>
                        <p>
                            Note, however, that in some situations the content
                            that is written to <span>document.write</span>{" "}
                            includes some surrounding context that you need to
                            take account of in your exploit. For example, you
                            might need to close some existing elements before
                            using your JavaScript payload.
                        </p>
                        <p>
                            The <span>innerHTML</span> sink doesn't accept{" "}
                            <span>script</span> elements on any modern browser,
                            nor will <span>svg onload</span> events fire. This
                            means you will need to use alternative elements like{" "}
                            <span>img</span> or <span>iframe</span>. Event
                            handlers such as <span>onload</span> and{" "}
                            <span>onerror</span> can be used in conjunction with
                            these elements. For example:
                        </p>
                        <Payloads>
                            element.innerHTML='... &lt;img src=1
                            onerror=alert(document.domain)&gt; ...'
                        </Payloads>
                    </section>
                    <section>
                        <h1>Sources and sinks in third-party dependencies</h1>
                        <p>
                            Modern web applications are typically built using a
                            number of third-party libraries and frameworks,
                            which often provide additional functions and
                            capabilities for developers. It's important to
                            remember that some of these are also potential
                            sources and sinks for DOM XSS.
                        </p>
                        <h3>DOM XSS in jQuery</h3>
                        <p>
                            If a JavaScript library such as jQuery is being
                            used, look out for sinks that can alter DOM elements
                            on the page. For instance, jQuery's{" "}
                            <span>attr()</span> function can change the
                            attributes of DOM elements. If data is read from a
                            user-controlled source like the URL, then passed to
                            the <span>attr()</span> function, then it may be
                            possible to manipulate the value sent to cause XSS.
                            For example, here we have some JavaScript that
                            changes an anchor element's <span>href</span>{" "}
                            attribute using data from the URL:
                        </p>
                        <Payloads>
                            {`$function()`}
                            <br />
                            {`$('#backLink').attr("href",(new URLSearchParams(window.location.search)).get('returnUrl'));`}
                            <br />
                            {`}`}
                        </Payloads>
                        <p>
                            You can exploit this by modifying the URL so that
                            the <span>location.search</span> source contains a
                            malicious JavaScript URL. After the page's
                            JavaScript applies this malicious URL to the back
                            link's <span>href</span>, clicking on the back link
                            will execute it:
                        </p>
                        <Payloads>
                            ?returnUrl=javascript:alert(document.domain)
                        </Payloads>
                        <p>
                            Another potential sink to look out for is jQuery's{" "}
                            <span>$()</span> selector function, which can be
                            used to inject malicious objects into the DOM.
                        </p>
                        <p>
                            jQuery used to be extremely popular, and a classic
                            DOM XSS vulnerability was caused by websites using
                            this selector in conjunction with the{" "}
                            <span>location.hash</span> source for animations or
                            auto-scrolling to a particular element on the page.
                            This behavior was often implemented using a
                            vulnerable <span>hashchange</span> event handler,
                            similar to the following:
                        </p>
                        <Payloads>
                            {`$(window).on('hashchange', function() {`}
                            <br />
                            {`var element = $(location.hash);`}
                            <br />
                            {`element[0].scrollIntoView();`}
                            <br />
                            {`});`}
                        </Payloads>
                        <p>
                            As the <span>hash</span> is user controllable, an
                            attacker could use this to inject an XSS vector into
                            the <span>$()</span> selector sink. More recent
                            versions of jQuery have patched this particular
                            vulnerability by preventing you from injecting HTML
                            into a selector when the input begins with a hash
                            character <span>(#)</span>. However, you may still
                            find vulnerable code in the wild.
                        </p>
                        <p>
                            To actually exploit this classic vulnerability,
                            you'll need to find a way to trigger a{" "}
                            <span>hashchange</span> event without user
                            interaction. One of the simplest ways of doing this
                            is to deliver your exploit via an{" "}
                            <span>iframe</span>:
                        </p>
                        <Payloads>{`<iframe src="https://vulnerable-website.com#" onload="this.src+='<img src=1 onerror=alert(1)>'"></iframe>`}</Payloads>
                        <p>
                            In this example, the <span>src</span> attribute
                            points to the vulnerable page with an empty hash
                            value. When the <span>iframe</span> is loaded, an
                            XSS vector is appended to the hash, causing the{" "}
                            <span>hashchange</span> event to fire.
                        </p>
                        <div className="labbox">
                            <h3>Note</h3>
                            <p>
                                Even newer versions of jQuery can still be
                                vulnerable via the <span>$()</span> selector
                                sink, provided you have full control over its
                                input from a source that doesn't require a{" "}
                                <span>#</span> prefix.
                            </p>
                        </div>
                        <h1>DOM XSS in AngularJS</h1>
                        <p>
                            If a framework like AngularJS is used, it may be
                            possible to execute JavaScript without angle
                            brackets or events. When a site uses the{" "}
                            <span>ng-app</span> attribute on an HTML element, it
                            will be processed by AngularJS. In this case,
                            AngularJS will execute JavaScript inside double
                            curly braces that can occur directly in HTML or
                            inside attributes.
                        </p>
                    </section>
                    <section>
                        <h1>DOM XSS combined with reflected and stored data</h1>
                        <p>
                            Some pure DOM-based vulnerabilities are
                            self-contained within a single page. If a script
                            reads some data from the URL and writes it to a
                            dangerous sink, then the vulnerability is entirely
                            client-side.
                        </p>
                        <p>
                            However, sources aren't limited to data that is
                            directly exposed by browsers - they can also
                            originate from the website. For example, websites
                            often reflect URL parameters in the HTML response
                            from the server. This is commonly associated with
                            normal XSS, but it can also lead to reflected DOM
                            XSS vulnerabilities.
                        </p>
                        <p>
                            In a reflected DOM XSS vulnerability, the server
                            processes data from the request, and echoes the data
                            into the response. The reflected data might be
                            placed into a JavaScript string literal, or a data
                            item within the DOM, such as a form field. A script
                            on the page then processes the reflected data in an
                            unsafe way, ultimately writing it to a dangerous
                            sink.
                        </p>
                        <Payloads>
                            eval('var data = "reflected string"');
                        </Payloads>
                        <p>
                            Websites may also store data on the server and
                            reflect it elsewhere. In a stored DOM XSS
                            vulnerability, the server receives data from one
                            request, stores it, and then includes the data in a
                            later response. A script within the later response
                            contains a sink which then processes the data in an
                            unsafe way.
                        </p>
                        <Payloads>element.innerHTML = comment.author</Payloads>
                        <h1>
                            Which sinks can lead to DOM-XSS vulnerabilities?
                        </h1>
                        <p>
                            The following are some of the main sinks that can
                            lead to DOM-XSS vulnerabilities:
                        </p>
                        <Payloads>
                            document.write()
                            <br />
                            document.writeln()
                            <br />
                            document.domain
                            <br />
                            element.innerHTML
                            <br />
                            element.outerHTML
                            <br />
                            element.insertAdjacentHTML
                            <br />
                            element.onevent
                            <br />
                        </Payloads>
                        <p>
                            The following jQuery functions are also sinks that
                            can lead to DOM-XSS vulnerabilities:
                        </p>
                        <Payloads>
                            add()
                            <br />
                            after()
                            <br />
                            append()
                            <br />
                            animate()
                            <br />
                            insertAfter()
                            <br />
                            insertBefore()
                            <br />
                            before()
                            <br />
                            html()
                            <br />
                            prepend()
                            <br />
                            replaceAll()
                            <br />
                            replaceWith()
                            <br />
                            wrap()
                            <br />
                            wrapInner()
                            <br />
                            wrapAll()
                            <br />
                            has()
                            <br />
                            constructor()
                            <br />
                            init()
                            <br />
                            index()
                            <br />
                            jQuery.parseHTML()
                            <br />
                            $.parseHTML()
                        </Payloads>
                        <h1>How to prevent DOM-XSS vulnerabilities</h1>
                        <p>
                            In addition to the general measures described on the
                            DOM-based vulnerabilities page, you should avoid
                            allowing data from any untrusted source to be
                            dynamically written to the HTML document.
                        </p>
                    </section>
                </section>
            </section>
        </div>
    );
}
