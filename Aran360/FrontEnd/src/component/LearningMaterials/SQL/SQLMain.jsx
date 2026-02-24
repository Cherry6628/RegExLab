import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
import '../XSS/XSSMaterial.css';
export default function SQLMain(){
    return(
        <div id="xss">
            <section className="mainbar">
                <h1>SQL injection</h1>
                <p>In this section, we explain:</p>
                <ul>
                    <li>What SQL injection (SQLi) is.</li>
                    <li>How to find and exploit different types of SQLi vulnerabilities.</li>
                    <li>How to prevent SQLi.</li>
                </ul>
                <img src="https://miro.medium.com/1*J9j5Q-jsU9HATIhqH9T4_g.jpeg"/>
                <div className="labbox">
                    <h3>Labs</h3>
                    <p>If you're familiar with the basic concepts behind SQLi vulnerabilities and want to practice exploiting them on some realistic, deliberately vulnerable targets, you can access labs in this topic from the link below.</p>
                    <ul>
                        <li>View all SQL injection labs</li>
                    </ul>
                </div>
                <section>
                    <h1>What is SQL injection (SQLi)?</h1>
                    <p>SQL injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. This can allow an attacker to view data that they are not normally able to retrieve. This might include data that belongs to other users, or any other data that the application can access. In many cases, an attacker can modify or delete this data, causing persistent changes to the application's content or behavior.</p>
                    <p>In some situations, an attacker can escalate a SQL injection attack to compromise the underlying server or other back-end infrastructure. It can also enable them to perform denial-of-service attacks.</p>
                    <iframe src="https://www.youtube.com/embed/wX6tszfgYp4?start=2" title="YouTube video" allowFullScreen />
                </section>
                <section>
                    <h1>What is the impact of a successful SQL injection attack?</h1>
                    <p>A successful SQL injection attack can result in unauthorized access to sensitive data, such as:</p>
                    <ul>
                        <li>Passwords.</li>
                        <li>Credit card details.</li>
                        <li>Personal user information.</li>
                    </ul>
                    <p>SQL injection attacks have been used in many high-profile data breaches over the years. These have caused reputational damage and regulatory fines. In some cases, an attacker can obtain a persistent backdoor into an organization's systems, leading to a long-term compromise that can go unnoticed for an extended period.</p>
                </section>
                <section>
                    <h1>How to detect SQL injection vulnerabilities</h1>
                    <p>You can detect SQL injection manually using a systematic set of tests against every entry point in the application. To do this, you would typically submit:</p>
                    <ul>
                        <li>The single quote character<span> ' </span>and look for errors or other anomalies.</li>
                        <li>Some SQL-specific syntax that evaluates to the base (original) value of the entry point, and to a different value, and look for systematic differences in the application responses.</li>
                        <li>Boolean conditions such as <span>OR 1=1</span> and <span>OR 1=2</span>, and look for differences in the application's responses.</li>
                        <li>Payloads designed to trigger time delays when executed within a SQL query, and look for differences in the time taken to respond.</li>
                        <li>OAST payloads designed to trigger an out-of-band network interaction when executed within a SQL query, and monitor any resulting interactions.</li>
                    </ul>
                    <p>Alternatively, you can find the majority of SQL injection vulnerabilities quickly and reliably using Burp Scanner.</p>
                </section>
                <section>
                    <h1>SQL injection in different parts of the query</h1>
                    <p>Most SQL injection vulnerabilities occur within the <span>WHERE</span> clause of a <span>SELECT</span> query. Most experienced testers are familiar with this type of SQL injection.</p>
                    <p>However, SQL injection vulnerabilities can occur at any location within the query, and within different query types. Some other common locations where SQL injection arises are:</p>
                    <ul>
                        <li>In <span>UPDATE</span> statements, within the updated values or the <span>WHERE</span> clause.</li>
                        <li>In <span>INSERT</span> statements, within the inserted values.</li>
                        <li>In <span>SELECT</span> statements, within the table or column name.</li>
                        <li>In <span>SELECT</span> statements, within the <span>ORDER BY</span> clause.</li>
                    </ul>
                </section>
                <section>
                    <h1>SQL injection examples</h1>
                    <p>There are lots of SQL injection vulnerabilities, attacks, and techniques, that occur in different situations. Some common SQL injection examples include:</p>
                    <ul>
                        <li><u>Retrieving hidden data</u>, where you can modify a SQL query to return additional results.</li>
                        <li><u>Subverting application logic</u>, where you can change a query to interfere with the application's logic.</li>
                        <li><u>UNION attacks</u>, where you can retrieve data from different database tables.</li>
                        <li><u>Blind SQL injection</u>, where the results of a query you control are not returned in the application's responses.</li>
                    </ul>
                </section>
                <section>
                    <h1>Retrieving hidden data</h1>
                    <p>Imagine a shopping application that displays products in different categories. When the user clicks on the <b>Gifts</b> category, their browser requests the URL:</p>
                    <Payloads>https://insecure-website.com/products?category=Gifts</Payloads>
                    <p>This causes the application to make a SQL query to retrieve details of the relevant products from the database:</p>
                    <Payloads>SELECT * FROM products WHERE category = 'Gifts' AND released = 1</Payloads>
                    <p>This SQL query asks the database to return:</p>
                    <ul>
                        <li>all details (<span>*</span>)</li>
                        <li>from the <span>products</span> table</li>
                        <li>where the <span>category</span> is <span>Gifts</span></li>
                        <li>and <span>released</span> is <span>1</span>.</li>
                    </ul>
                    <p>The restriction <span>released = 1</span> is being used to hide products that are not released. We could assume for unreleased products, <span>released = 0</span>.</p>
                    <p>The application doesn't implement any defenses against SQL injection attacks. This means an attacker can construct the following attack, for example:</p>
                    <Payloads>https://insecure-website.com/products?category=Gifts'--</Payloads>
                    <p>This results in the SQL query:</p>
                    <Payloads>SELECT * FROM products WHERE category = 'Gifts'--' AND released = 1</Payloads>
                    <p>Crucially, note that <span>--</span> is a comment indicator in SQL. This means that the rest of the query is interpreted as a comment, effectively removing it. In this example, this means the query no longer includes <span>AND released = 1</span>. As a result, all products are displayed, including those that are not yet released.</p>
                    <p>You can use a similar attack to cause the application to display all the products in any category, including categories that they don't know about:</p>
                    <Payloads>https://insecure-website.com/products?category=Gifts'+OR+1=1--</Payloads>
                    <p>This results in the SQL query:</p>
                    <Payloads>SELECT * FROM products WHERE category = 'Gifts' OR 1=1--' AND released = 1</Payloads>
                    <p>The modified query returns all items where either the <span>category</span> is <span>Gifts</span>, or <span>1</span> is equal to <span>1</span>. As <span>1=1</span> is always true, the query returns all items.</p>
                    <div className="labbox">
                        <h3>Warning</h3>
                        <p>Take care when injecting the condition <span>OR 1=1</span> into a SQL query. Even if it appears to be harmless in the context you're injecting into, it's common for applications to use data from a single request in multiple different queries. If your condition reaches an <span>UPDATE</span> or <span>DELETE</span> statement, for example, it can result in an accidental loss of data.</p>
                    </div>
                </section>
                <section>
                    <h1>Subverting application logic</h1>
                    <p>Imagine an application that lets users log in with a username and password. If a user submits the username <span>wiener</span> and the password <span>bluecheese</span>, the application checks the credentials by performing the following SQL query:</p>
                    <Payloads>SELECT * FROM users WHERE username = 'wiener' AND password = 'bluecheese'</Payloads>
                    <p>If the query returns the details of a user, then the login is successful. Otherwise, it is rejected.</p>
                    <p>In this case, an attacker can log in as any user without the need for a password. They can do this using the SQL comment sequence <span>--</span> to remove the password check from the <span>WHERE</span> clause of the query. For example, submitting the username <span>administrator'--</span> and a blank password results in the following query:</p>
                    <Payloads>SELECT * FROM users WHERE username = 'administrator'--' AND password = ''</Payloads>
                    <p>This query returns the user whose <span>username</span> is <span>administrator</span> and successfully logs the attacker in as that user.</p>
                </section>
                <section>
                    <h1>Retrieving data from other database tables</h1>
                    <p>In cases where the application responds with the results of a SQL query, an attacker can use a SQL injection vulnerability to retrieve data from other tables within the database. You can use the <span>UNION</span> keyword to execute an additional <span>SELECT</span> query and append the results to the original query.</p>
                    <p>For example, if an application executes the following query containing the user input <span>Gifts</span>:</p>
                    <Payloads>SELECT name, description FROM products WHERE category = 'Gifts'</Payloads>
                    <p>An attacker can submit the input:</p>
                    <Payloads>' UNION SELECT username, password FROM users--</Payloads>
                    <p>This causes the application to return all usernames and passwords along with the names and descriptions of products.</p>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>SQL injection UNION attacks</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h1>Blind SQL injection vulnerabilities</h1>
                    <p>Many instances of SQL injection are blind vulnerabilities. This means that the application does not return the results of the SQL query or the details of any database errors within its responses. Blind vulnerabilities can still be exploited to access unauthorized data, but the techniques involved are generally more complicated and difficult to perform.</p>
                    <p>The following techniques can be used to exploit blind SQL injection vulnerabilities, depending on the nature of the vulnerability and the database involved:</p>
                    <ul>
                        <li>You can change the logic of the query to trigger a detectable difference in the application's response depending on the truth of a single condition. This might involve injecting a new condition into some Boolean logic, or conditionally triggering an error such as a divide-by-zero.</li>
                        <li>You can conditionally trigger a time delay in the processing of the query. This enables you to infer the truth of the condition based on the time that the application takes to respond.</li>
                        <li>You can trigger an out-of-band network interaction, using OAST techniques. This technique is extremely powerful and works in situations where the other techniques do not. Often, you can directly exfiltrate data via the out-of-band channel. For example, you can place the data into a DNS lookup for a domain that you control.</li>
                    </ul>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>Blind SQL injection</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h1>Second-order SQL injection</h1>
                    <p>First-order SQL injection occurs when the application processes user input from an HTTP request and incorporates the input into a SQL query in an unsafe way.</p>
                    <p>Second-order SQL injection occurs when the application takes user input from an HTTP request and stores it for future use. This is usually done by placing the input into a database, but no vulnerability occurs at the point where the data is stored. Later, when handling a different HTTP request, the application retrieves the stored data and incorporates it into a SQL query in an unsafe way. For this reason, second-order SQL injection is also known as stored SQL injection.</p>
                    <img src="https://media.licdn.com/dms/image/v2/D5622AQHZ1okjXOws_w/feedshare-shrink_800/feedshare-shrink_800/0/1723470329965?e=2147483647&v=beta&t=hpKdiZAnO9P14JPxppvnpe0DbzSeMFAauiAGD69AxHE"/>
                    <p>Second-order SQL injection often occurs in situations where developers are aware of SQL injection vulnerabilities, and so safely handle the initial placement of the input into the database. When the data is later processed, it is deemed to be safe, since it was previously placed into the database safely. At this point, the data is handled in an unsafe way, because the developer wrongly deems it to be trusted.</p>
                </section>
                <section>
                    <h1>Examining the database</h1>
                    <p>Some core features of the SQL language are implemented in the same way across popular database platforms, and so many ways of detecting and exploiting SQL injection vulnerabilities work identically on different types of database.</p>
                    <p>However, there are also many differences between common databases. These mean that some techniques for detecting and exploiting SQL injection work differently on different platforms. For example:</p>
                    <ul>
                        <li>Syntax for string concatenation.</li>
                        <li>Comments.</li>
                        <li>Batched (or stacked) queries.</li>
                        <li>Platform-specific APIs.</li>
                        <li>Error messages.</li>
                    </ul>
                    <p>After you identify a SQL injection vulnerability, it's often useful to obtain information about the database. This information can help you to exploit the vulnerability.</p>
                    <p>You can query the version details for the database. Different methods work for different database types. This means that if you find a particular method that works, you can infer the database type. For example, on Oracle you can execute:</p>
                    <Payloads>SELECT * FROM v$version</Payloads>
                    <p>You can also identify what database tables exist, and the columns they contain. For example, on most databases you can execute the following query to list the tables:</p>
                    <Payloads>SELECT * FROM information_schema.tables</Payloads>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>Examining the database in SQL injection attacks</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h1>SQL injection in different contexts</h1>
                    <p>In the previous labs, you used the query string to inject your malicious SQL payload. However, you can perform SQL injection attacks using any controllable input that is processed as a SQL query by the application. For example, some websites take input in JSON or XML format and use this to query the database.</p>
                    <p>These different formats may provide different ways for you to <u>obfuscate attacks</u> that are otherwise blocked due to WAFs and other defense mechanisms. Weak implementations often look for common SQL injection keywords within the request, so you may be able to bypass these filters by encoding or escaping characters in the prohibited keywords. For example, the following XML-based SQL injection uses an XML escape sequence to encode the <span>S</span> character in <span>SELECT</span>:</p>
                    <Payloads><pre>{`<stockCheck>
    <productId>123</productId>
    <storeId>999 &#x53;ELECT * FROM information_schema.tables</storeId>
</stockCheck>`}</pre></Payloads>
                    <p>This will be decoded server-side before being passed to the SQL interpreter.</p>
                </section>
                <section>
                    <h1>How to prevent SQL injection</h1>
                    <p>You can prevent most instances of SQL injection using parameterized queries instead of string concatenation within the query. These parameterized queries are also know as "prepared statements".</p>
                    <p>The following code is vulnerable to SQL injection because the user input is concatenated directly into the query:</p>
                    <Payloads>String query = "SELECT * FROM products WHERE category = '"+ input + "'";<br/>Statement statement = connection.createStatement();<br/>ResultSet resultSet = statement.executeQuery(query);</Payloads>
                    <p>You can rewrite this code in a way that prevents the user input from interfering with the query structure:</p>
                    <Payloads>PreparedStatement statement = connection.prepareStatement("SELECT * FROM products WHERE category = ?");<br/>statement.setString(1, input);<br/>ResultSet resultSet = statement.executeQuery();</Payloads>
                    <p>You can use parameterized queries for any situation where untrusted input appears as data within the query, including the <span>WHERE</span> clause and values in an <span>INSERT</span> or <span>UPDATE</span> statement. They can't be used to handle untrusted input in other parts of the query, such as table or column names, or the <span>ORDER BY</span> clause. Application functionality that places untrusted data into these parts of the query needs to take a different approach, such as:</p>
                    <ul>
                        <li>Whitelisting permitted input values.</li>
                        <li>Using different logic to deliver the required behavior.</li>
                    </ul>
                    <p>For a parameterized query to be effective in preventing SQL injection, the string that is used in the query must always be a hard-coded constant. It must never contain any variable data from any origin. Do not be tempted to decide case-by-case whether an item of data is trusted, and continue using string concatenation within the query for cases that are considered safe. It's easy to make mistakes about the possible origin of data, or for changes in other code to taint trusted data.</p>
                </section>
            </section>
        </div>
    );
}