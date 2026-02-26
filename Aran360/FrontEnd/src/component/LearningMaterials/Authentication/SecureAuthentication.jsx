export default function SecureAuthentication() {
    return (
        <div id="learning-material-main-box">
            <section className="mainbar">
                <section>
                    <h1>How to secure your authentication mechanisms</h1>
                    <p>
                        In this section, we'll talk about how you can prevent
                        some of the vulnerabilities we've discussed from
                        occurring in your authentication mechanisms.
                    </p>
                    <p>
                        Authentication is a complex topic and, as we have
                        demonstrated, it is unfortunately all too easy for
                        weaknesses and flaws to creep in. Outlining every
                        possible measure you can take to protect your own
                        websites is clearly not possible. However, there are
                        several general principles that you should always
                        follow.
                    </p>
                    <h1>Take care with user credentials</h1>
                    <p>
                        Even the most robust authentication mechanisms are
                        ineffective if you unwittingly disclose a valid set of
                        login credentials to an attacker. It should go without
                        saying that you should never send any login data over
                        unencrypted connections. Although you may have
                        implemented HTTPS for your login requests, make sure
                        that you enforce this by redirecting any attempted HTTP
                        requests to HTTPS as well.
                    </p>
                    <p>
                        You should also audit your website to make sure that no
                        username or email addresses are disclosed either through
                        publicly accessible profiles or reflected in HTTP
                        responses, for example.
                    </p>
                    <h1>Don't count on users for security</h1>
                    <p>
                        Strict authentication measures often require some
                        additional effort from your users. Human nature makes it
                        all but inevitable that some users will find ways to
                        save themselves this effort. Therefore, you need to
                        enforce secure behavior wherever possible.
                    </p>
                    <p>
                        The most obvious example is to implement an effective
                        password policy. Some of the more traditional policies
                        fall down because people crowbar their own predictable
                        passwords into the policy. Instead, it can be more
                        effective to implement a simple password checker of some
                        kind, which allows users to experiment with passwords
                        and provides feedback about their strength in real time.
                        A popular example is the JavaScript library{" "}
                        <span>zxcvbn</span>, which was developed by Dropbox. By
                        only allowing passwords which are rated highly by the
                        password checker, you can enforce the use of secure
                        passwords more effectively than you can with traditional
                        policies.
                    </p>
                    <h1>Prevent username enumeration</h1>
                    <p>
                        It is considerably easier for an attacker to break your
                        authentication mechanisms if you reveal that a user
                        exists on the system. There are even certain situations
                        where, due to the nature of the website, the knowledge
                        that a particular person has an account is sensitive
                        information in itself.
                    </p>
                    <p>
                        Regardless of whether an attempted username is valid, it
                        is important to use identical, generic error messages,
                        and make sure they really are identical. You should
                        always return the same HTTP status code with each login
                        request and, finally, make the response times in
                        different scenarios as indistinguishable as possible.
                    </p>
                    <h1>Implement robust brute-force protection</h1>
                    <p>
                        Given how simple constructing a brute-force attack can
                        be, it is vital to ensure that you take steps to
                        prevent, or at least disrupt, any attempts to
                        brute-force logins.
                    </p>
                    <p>
                        One of the more effective methods is to implement
                        strict, IP-based user rate limiting. This should involve
                        measures to prevent attackers from manipulating their
                        apparent IP address. Ideally, you should require the
                        user to complete a CAPTCHA test with every login attempt
                        after a certain limit is reached.
                    </p>
                    <p>
                        Keep in mind that this is not guaranteed to completely
                        eliminate the threat of brute-forcing. However, making
                        the process as tedious and manual as possible increases
                        the likelihood that any would-be attacker gives up and
                        goes in search of a softer target instead.
                    </p>
                    <h1>Triple-check your verification logic</h1>
                    <p>
                        As demonstrated by our labs, it is easy for simple logic
                        flaws to creep into code which, in the case of
                        authentication, have the potential to completely
                        compromise your website and users. Auditing any
                        verification or validation logic thoroughly to eliminate
                        flaws is absolutely key to robust authentication. A
                        check that can be bypassed is, ultimately, not much
                        better than no check at all.
                    </p>
                    <h1>Don't forget supplementary functionality</h1>\
                    <p>
                        Be sure not to just focus on the central login pages and
                        overlook additional functionality related to
                        authentication. This is particularly important in cases
                        where the attacker is free to register their own account
                        and explore this functionality. Remember that a password
                        reset or change is just as valid an attack surface as
                        the main login mechanism and, consequently, must be
                        equally as robust.
                    </p>
                    <h1>Implement proper multi-factor authentication</h1>
                    <p>
                        While multi-factor authentication may not be practical
                        for every website, when done properly it is much more
                        secure than password-based login alone. Remember that
                        verifying multiple instances of the same factor is not
                        true multi-factor authentication. Sending verification
                        codes via email is essentially just a more long-winded
                        form of single-factor authentication.
                    </p>
                    <p>
                        SMS-based 2FA is technically verifying two factors
                        (something you know and something you have). However,
                        the potential for abuse through SIM swapping, for
                        example, means that this system can be unreliable.
                    </p>
                    <p>
                        Ideally, 2FA should be implemented using a dedicated
                        device or app that generates the verification code
                        directly. As they are purpose-built to provide security,
                        these are typically more secure.
                    </p>
                    <p>
                        Finally, just as with the main authentication logic,
                        make sure that the logic in your 2FA checks is sound so
                        that it cannot be easily bypassed.
                    </p>
                </section>
            </section>
        </div>
    );
}
