import Payloads from "../../Payloads/Payloads";
export default function PathTraversalMaterial() {
    return (
        <div id="learning-material-main-box">
            <section className="mainbar">
                <section>
                    <h1>Path traversal</h1>
                    <p>In this section, we explain:</p>
                    <ul>
                        <li>What path traversal is.</li>
                        <li>
                            How to carry out path traversal attacks and
                            circumvent common obstacles.
                        </li>
                        <li>How to prevent path traversal vulnerabilities.</li>
                    </ul>
                    <img src="https://miro.medium.com/1*KvQzFMqdqFvPPsrwaGEaVQ.jpeg" />
                    <div className="labbox">
                        <h3>Labs</h3>
                        <p>
                            If you're familiar with the basic concepts behind
                            path traversal and want to practice exploiting them
                            on some realistic, deliberately vulnerable targets,
                            you can access labs in this topic from the link
                            below.
                        </p>
                        <ul>
                            <li>View all path traversal labs</li>
                        </ul>
                    </div>
                    <h1>What is path traversal?</h1>
                    <p>
                        Path traversal is also known as directory traversal.
                        These vulnerabilities enable an attacker to read
                        arbitrary files on the server that is running an
                        application. This might include:
                    </p>
                    <ul>
                        <li>Application code and data.</li>
                        <li>Credentials for back-end systems.</li>
                        <li>Sensitive operating system files.</li>
                    </ul>
                    <p>
                        In some cases, an attacker might be able to write to
                        arbitrary files on the server, allowing them to modify
                        application data or behavior, and ultimately take full
                        control of the server.
                    </p>
                    <iframe
                        src="https://www.youtube.com/embed/NQwUDLMOrHo"
                        title="YouTube video"
                        allowFullScreen
                    />
                </section>
                <section>
                    <h1>Reading arbitrary files via path traversal</h1>
                    <p>
                        Imagine a shopping application that displays images of
                        items for sale. This might load an image using the
                        following HTML:
                    </p>
                    <Payloads>
                        &lt;img src="/loadImage?filename=218.png"/&gt;
                    </Payloads>
                    <p>
                        The <span>loadImage</span> URL takes a{" "}
                        <span>filename</span> parameter and returns the contents
                        of the specified file. The image files are stored on
                        disk in the location <span>/var/www/images/</span>. To
                        return an image, the application appends the requested
                        filename to this base directory and uses a filesystem
                        API to read the contents of the file. In other words,
                        the application reads from the following file path:
                    </p>
                    <Payloads>/var/www/images/218.png</Payloads>
                    <p>
                        This application implements no defenses against path
                        traversal attacks. As a result, an attacker can request
                        the following URL to retrieve the{" "}
                        <span>/etc/passwd</span> file from the server's
                        filesystem:
                    </p>
                    <Payloads>
                        https://insecure-website.com/loadImage?filename=../../../etc/passwd
                    </Payloads>
                    <p>
                        This causes the application to read from the following
                        file path:
                    </p>
                    <Payloads>/var/www/images/../../../etc/passwd</Payloads>
                    <p>
                        The sequence <span>../</span> is valid within a file
                        path, and means to step up one level in the directory
                        structure. The three consecutive <span>../</span>
                        sequences step up from <span>/var/www/images/</span> to
                        the filesystem root, and so the file that is actually
                        read is:
                    </p>
                    <Payloads>/etc/passwd</Payloads>
                    <p>
                        On Unix-based operating systems, this is a standard file
                        containing details of the users that are registered on
                        the server, but an attacker could retrieve other
                        arbitrary files using the same technique.
                    </p>
                    <p>
                        On Windows, both <span>../</span> and <span>..\</span>{" "}
                        are valid directory traversal sequences. The following
                        is an example of an equivalent attack against a
                        Windows-based server:
                    </p>
                    <Payloads>
                        https://insecure-website.com/loadImage?filename=..\..\..\windows\win.iniLAB
                    </Payloads>
                </section>
                <section>
                    <h1>
                        Common obstacles to exploiting path traversal
                        vulnerabilities
                    </h1>
                    <p>
                        Many applications that place user input into file paths
                        implement defenses against path traversal attacks. These
                        can often be bypassed.
                    </p>
                    <p>
                        If an application strips or blocks directory traversal
                        sequences from the user-supplied filename, it might be
                        possible to bypass the defense using a variety of
                        techniques.
                    </p>
                    <p>
                        You might be able to use an absolute path from the
                        filesystem root, such as{" "}
                        <span>filename=/etc/passwd</span>, to directly reference
                        a file without using any traversal sequences.
                    </p>
                    <p>
                        You might be able to use nested traversal sequences,
                        such as
                        <span>....//</span> or <span>....\/</span>. These revert
                        to simple traversal sequences when the inner sequence is
                        stripped.
                    </p>
                    <p>
                        In some contexts, such as in a URL path or the{" "}
                        <span>filename</span> parameter of a{" "}
                        <span>multipart/form-data</span> request, web servers
                        may strip any directory traversal sequences before
                        passing your input to the application. You can sometimes
                        bypass this kind of sanitization by URL encoding, or
                        even double URL encoding, the <span>../</span>{" "}
                        characters. This results in <span>%2e%2e%2f</span> and{" "}
                        <span>%252e%252e%252f</span> respectively. Various
                        non-standard encodings, such as <span>..%c0%af</span> or{" "}
                        <span>..%ef%bc%8f</span>, may also work.
                    </p>
                    <p>
                        For Burp Suite Professional users, Burp Intruder
                        provides the predefined payload list{" "}
                        <b>Fuzzing - path traversal</b>. This contains some
                        encoded path traversal sequences that you can try.
                    </p>
                    <p>
                        An application may require the user-supplied filename to
                        start with the expected base folder, such as{" "}
                        <span>/var/www/images</span>. In this case, it might be
                        possible to include the required base folder followed by
                        suitable traversal sequences. For example:
                        <span>
                            filename=/var/www/images/../../../etc/passwd
                        </span>
                        .
                    </p>
                    <p>
                        An application may require the user-supplied filename to
                        end with an expected file extension, such as{" "}
                        <span>.png</span>. In this case, it might be possible to
                        use a null byte to effectively terminate the file path
                        before the required extension. For example:
                        <span>filename=../../../etc/passwd%00.png</span>.
                    </p>
                </section>
                <section>
                    <h1>How to prevent a path traversal attack</h1>
                    <p>
                        The most effective way to prevent path traversal
                        vulnerabilities is to avoid passing user-supplied input
                        to filesystem APIs altogether. Many application
                        functions that do this can be rewritten to deliver the
                        same behavior in a safer way.
                    </p>
                    <p>
                        If you can't avoid passing user-supplied input to
                        filesystem APIs, we recommend using two layers of
                        defense to prevent attacks:
                    </p>
                    <ul>
                        <li>
                            Validate the user input before processing it.
                            Ideally, compare the user input with a whitelist of
                            permitted values. If that isn't possible, verify
                            that the input contains only permitted content, such
                            as alphanumeric characters only.
                        </li>
                        <li>
                            After validating the supplied input, append the
                            input to the base directory and use a platform
                            filesystem API to canonicalize the path. Verify that
                            the canonicalized path starts with the expected base
                            directory.
                        </li>
                    </ul>
                    <p>
                        Below is an example of some simple Java code to validate
                        the canonical path of a file based on user input:
                    </p>
                    <div className="code">
                        <p>File file = new File(BASE_DIRECTORY, userInput);</p>
                        <p>
                            if
                            (file.getCanonicalPath().startsWith(BASE_DIRECTORY))
                            {"{"}
                        </p>
                        <p>
                            &thinsp;&thinsp;&thinsp;&thinsp;&thinsp;// process
                            file
                        </p>
                        <p>{"}"}</p>
                    </div>
                    <Payloads>
                        <pre>
                            File file = new File(BASE_DIRECTORY, userInput); if
                            (file.getCanonicalPath().startsWith(BASE_DIRECTORY)){" "}
                        </pre>
                    </Payloads>
                </section>
            </section>
        </div>
    );
}
