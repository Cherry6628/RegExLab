import "../XSS/XSSMaterial.css";
import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
export default function IDOR() {
    return (
        <div id="xss">
            <section className="mainbar">
                <h1>Insecure direct object references (IDOR)</h1>
                <p>
                    {" "}
                    In this section, we will explain what insecure direct object
                    references (IDOR) are and describe some common
                    vulnerabilities.{" "}
                </p>
                <h1>What are insecure direct object references (IDOR)?</h1>
                <p>
                    Insecure direct object references (IDOR) are a type of
                    access control vulnerability that arises when an application
                    uses user-supplied input to access objects directly. The
                    term IDOR was popularized by its appearance in the OWASP
                    2007 Top Ten. However, it is just one example of many access
                    control implementation mistakes that can lead to access
                    controls being circumvented. IDOR vulnerabilities are most
                    commonly associated with horizontal privilege escalation,
                    but they can also arise in relation to vertical privilege
                    escalation.{" "}
                </p>
                <h1>IDOR examples</h1>
                <p>
                    There are many examples of access control vulnerabilities
                    where user-controlled parameter values are used to access
                    resources or functions directly.{" "}
                </p>
                <section>
                    <h3>
                        IDOR vulnerability with direct reference to database
                        objects
                    </h3>
                    <p>
                        Consider a website that uses the following URL to access
                        the customer account page, by retrieving information
                        from the back-end database:{" "}
                    </p>
                    <Payloads>
                        https://insecure-website.com/customer_account?customer_number=132355
                    </Payloads>
                    <p>
                        Here, the customer number is used directly as a record
                        index in queries that are performed on the back-end
                        database. If no other controls are in place, an attacker
                        can simply modify the <span>customer_number</span>{" "}
                        value, bypassing access controls to view the records of
                        other customers. This is an example of an IDOR
                        vulnerability leading to horizontal privilege
                        escalation.{" "}
                    </p>
                    <p>
                        An attacker might be able to perform horizontal and
                        vertical privilege escalation by altering the user to
                        one with additional privileges while bypassing access
                        controls. Other possibilities include exploiting
                        password leakage or modifying parameters once the
                        attacker has landed in the user's accounts page, for
                        example.{" "}
                    </p>
                </section>
                <section>
                    <h3>
                        IDOR vulnerability with direct reference to static files
                    </h3>
                    <p>
                        IDOR vulnerabilities often arise when sensitive
                        resources are located in static files on the server-side
                        filesystem. For example, a website might save chat
                        message transcripts to disk using an incrementing
                        filename, and allow users to retrieve these by visiting
                        a URL like the following:{" "}
                    </p>
                    <Payloads>
                        https://insecure-website.com/static/12144.txt
                    </Payloads>
                    <p>
                        In this situation, an attacker can simply modify the
                        filename to retrieve a transcript created by another
                        user and potentially obtain user credentials and other
                        sensitive data.{" "}
                    </p>
                </section>
            </section>
        </div>
    );
}
