export default function Authentication() {
    return (
        <div id="learning-material-main-box">
            <section className="mainbar">
                <section>
                    <h1>Authentication vulnerabilities</h1>
                    <p>
                        Conceptually, authentication vulnerabilities are easy to
                        understand. However, they are usually critical because
                        of the clear relationship between authentication and
                        security.
                    </p>
                    <p>
                        Authentication vulnerabilities can allow attackers to
                        gain access to sensitive data and functionality. They
                        also expose additional attack surface for further
                        exploits. For this reason, it's important to learn how
                        to identify and exploit authentication vulnerabilities,
                        and how to bypass common protection measures.
                    </p>
                    <p>In this section, we explain:</p>
                    <ul>
                        <li>
                            The most common authentication mechanisms used by
                            websites.
                        </li>
                        <li>Potential vulnerabilities in these mechanisms.</li>
                        <li>
                            Inherent vulnerabilities in different authentication
                            mechanisms.
                        </li>
                        <li>
                            Typical vulnerabilities that are introduced by their
                            improper implementation.
                        </li>
                        <li>
                            How you can make your own authentication mechanisms
                            as robust as possible.
                        </li>
                    </ul>
                    <img src="https://miro.medium.com/v2/resize:fit:1400/1*ly9REZVUgz9S3Eel3XwQ3A.png" />
                    <h1>Labs</h1>
                    <p>
                        If you're familiar with the basic concepts behind
                        authentication vulnerabilities and want to practice
                        exploiting them on some realistic, deliberately
                        vulnerable targets, you can access labs in this topic
                        from the link below.
                    </p>
                    <ul>
                        <li>
                            <u>View all authentication labs</u>
                        </li>
                    </ul>
                    <h1>What is authentication?</h1>
                    <p>
                        Authentication is the process of verifying the identity
                        of a user or client. Websites are potentially exposed to
                        anyone who is connected to the internet. This makes
                        robust authentication mechanisms integral to effective
                        web security.
                    </p>
                    <p>There are three main types of authentication:</p>
                    <ul>
                        <li>
                            Something you <b>know</b>, such as a password or the
                            answer to a security question. These are sometimes
                            called "knowledge factors".
                        </li>
                        <li>
                            Something you <b>have</b>, This is a physical object
                            such as a mobile phone or security token. These are
                            sometimes called "possession factors".
                        </li>
                        <li>
                            Something you <b>are</b> or do. For example, your
                            biometrics or patterns of behavior. These are
                            sometimes called "inherence factors".
                        </li>
                    </ul>
                    <p>
                        Authentication mechanisms rely on a range of
                        technologies to verify one or more of these factors.
                    </p>
                    <section>
                        <h3>
                            What is the difference between authentication and
                            authorization?
                        </h3>
                        <p>
                            Authentication is the process of verifying that a
                            user is who they claim to be. Authorization involves
                            verifying whether a user is allowed to do something.
                        </p>
                        <p>
                            For example, authentication determines whether
                            someone attempting to access a website with the
                            username <span>Carlos123</span> really is the same
                            person who created the account.
                        </p>
                        <p>
                            Once <span>Carlos123</span> is authenticated, their
                            permissions determine what they are authorized to
                            do. For example, they may be authorized to access
                            personal information about other users, or perform
                            actions such as deleting another user's account.
                        </p>
                    </section>
                    <section>
                        <h1>How do authentication vulnerabilities arise?</h1>
                        <p>
                            Most vulnerabilities in authentication mechanisms
                            occur in one of two ways:
                        </p>
                        <ul>
                            <li>
                                The authentication mechanisms are weak because
                                they fail to adequately protect against
                                brute-force attacks.
                            </li>
                            <li>
                                Logic flaws or poor coding in the implementation
                                allow the authentication mechanisms to be
                                bypassed entirely by an attacker. This is
                                sometimes called "broken authentication".
                            </li>
                        </ul>
                        <p>
                            In many areas of web development, logic flaws cause
                            the website to behave unexpectedly, which may or may
                            not be a security issue. However, as authentication
                            is so critical to security, it's very likely that
                            flawed authentication logic exposes the website to
                            security issues.
                        </p>
                    </section>
                    <section>
                        <h1>
                            What is the impact of vulnerable authentication?
                        </h1>
                        <p>
                            The impact of authentication vulnerabilities can be
                            severe. If an attacker bypasses authentication or
                            brute-forces their way into another user's account,
                            they have access to all the data and functionality
                            that the compromised account has. If they are able
                            to compromise a high-privileged account, such as a
                            system administrator, they could take full control
                            over the entire application and potentially gain
                            access to internal infrastructure.
                        </p>
                        <p>
                            Even compromising a low-privileged account might
                            still grant an attacker access to data that they
                            otherwise shouldn't have, such as commercially
                            sensitive business information. Even if the account
                            does not have access to any sensitive data, it might
                            still allow the attacker to access additional pages,
                            which provide a further attack surface. Often,
                            high-severity attacks are not possible from publicly
                            accessible pages, but they may be possible from an
                            internal page.
                        </p>
                    </section>
                    <section>
                        <h1>Vulnerabilities in authentication mechanisms</h1>
                        <p>
                            A website's authentication system usually consists
                            of several distinct mechanisms where vulnerabilities
                            may occur. Some vulnerabilities are applicable
                            across all of these contexts. Others are more
                            specific to the functionality provided.
                        </p>
                        <p>
                            We will look more closely at some of the most common
                            vulnerabilities in the following areas:
                        </p>
                        <ul>
                            <li>
                                <b>
                                    <u>
                                        Vulnerabilities in password-based login
                                    </u>{" "}
                                </b>
                            </li>
                            <li>
                                <b>
                                    <u>
                                        Vulnerabilities in multi-factor
                                        authentication
                                    </u>
                                </b>
                            </li>
                            <li>
                                <b>
                                    <u>
                                        Vulnerabilities in other authentication
                                        mechanisms{" "}
                                    </u>
                                </b>
                            </li>
                        </ul>
                        <p>
                            Several of the labs require you to enumerate
                            usernames and brute-force passwords. To help you
                            with this process, we provide a shortlist of
                            candidate usernames and passwords that you should
                            use to solve the labs.
                        </p>
                    </section>
                    <section>
                        <h1>
                            Preventing attacks on your own authentication
                            mechanisms
                        </h1>
                        <p>
                            We have demonstrated several ways in which websites
                            can be vulnerable due to how they implement
                            authentication. To reduce the risk of such attacks
                            on your own websites, there are several principles
                            that you should always try to follow.
                        </p>
                        <div className="labbox">
                            <h3>Read more</h3>
                            <ul>
                                <li>
                                    How to secure your authentication mechanisms
                                </li>
                            </ul>
                        </div>
                    </section>
                </section>
            </section>
        </div>
    );
}
