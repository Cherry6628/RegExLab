import Lab from "../../Lab/Lab";
import Payloads from "../../Payloads/Payloads";
import "../XSS/XSSMaterial.css";
export default function UnionAttack() {
    return (
        <div id="xss">
            <section className="mainbar">
                <section>
                    <h1>SQL injection UNION attacks</h1>
                    <p>
                        When an application is vulnerable to SQL injection, and
                        the results of the query are returned within the
                        application's responses, you can use the{" "}
                        <span>UNION</span> keyword to retrieve data from other
                        tables within the database. This is commonly known as a
                        SQL injection UNION attack.
                    </p>
                    <p>
                        The <span>UNION</span> keyword enables you to execute
                        one or more additional <span>SELECT</span> queries and
                        append the results to the original query. For example:
                    </p>
                    <Payloads>
                        SELECT a, b FROM table1 UNION SELECT c, d FROM table2
                    </Payloads>
                    <p>
                        This SQL query returns a single result set with two
                        columns, containing values from columns <span>a</span>{" "}
                        and <span>b</span> in <span>table1</span> and columns{" "}
                        <span>c</span> and <span>d</span> in <span>table2</span>
                        .
                    </p>
                    <p>
                        For a <span>UNION</span> query to work, two key
                        requirements must be met:
                    </p>
                    <ul>
                        <li>
                            The individual queries must return the same number
                            of columns.
                        </li>
                        <li>
                            The data types in each column must be compatible
                            between the individual queries.
                        </li>
                    </ul>
                    <p>
                        To carry out a SQL injection UNION attack, make sure
                        that your attack meets these two requirements. This
                        normally involves finding out:
                    </p>
                    <ul>
                        <li>
                            How many columns are being returned from the
                            original query.
                        </li>
                        <li>
                            Which columns returned from the original query are
                            of a suitable data type to hold the results from the
                            injected query.
                        </li>
                    </ul>
                </section>
                <section>
                    <h1>Determining the number of columns required</h1>
                    <p>
                        When you perform a SQL injection UNION attack, there are
                        two effective methods to determine how many columns are
                        being returned from the original query.
                    </p>
                    <p>
                        One method involves injecting a series of{" "}
                        <span>ORDER BY</span> clauses and incrementing the
                        specified column index until an error occurs. For
                        example, if the injection point is a quoted string
                        within the <span>WHERE</span> clause of the original
                        query, you would submit:
                    </p>
                    <Payloads>
                        ' ORDER BY 1--
                        <br />' ORDER BY 2--
                        <br />' ORDER BY 3--
                        <br />
                        etc.
                    </Payloads>
                    <p>
                        This series of payloads modifies the original query to
                        order the results by different columns in the result
                        set. The column in an <span>ORDER BY</span> clause can
                        be specified by its index, so you don't need to know the
                        names of any columns. When the specified column index
                        exceeds the number of actual columns in the result set,
                        the database returns an error, such as:
                    </p>
                    <Payloads>
                        The ORDER BY position number 3 is out of range of the
                        number of items in the select list.
                    </Payloads>
                    <p>
                        The application might actually return the database error
                        in its HTTP response, but it may also issue a generic
                        error response. In other cases, it may simply return no
                        results at all. Either way, as long as you can detect
                        some difference in the response, you can infer how many
                        columns are being returned from the query.
                    </p>
                    <p>
                        The second method involves submitting a series of{" "}
                        <span>UNION SELECT</span> payloads specifying a
                        different number of null values:
                    </p>
                    <Payloads>
                        ' UNION SELECT NULL--
                        <br />' UNION SELECT NULL,NULL--
                        <br />' UNION SELECT NULL,NULL,NULL--
                        <br />
                        etc.
                    </Payloads>
                    <p>
                        If the number of nulls does not match the number of
                        columns, the database returns an error, such as:
                    </p>
                    <Payloads>
                        All queries combined using a UNION, INTERSECT or EXCEPT
                        operator must have an equal number of expressions in
                        their target lists.
                    </Payloads>
                    <p>
                        We use <span>NULL</span> as the values returned from the
                        injected <span>SELECT</span> query because the data
                        types in each column must be compatible between the
                        original and the injected queries. <span>NULL</span> is
                        convertible to every common data type, so it maximizes
                        the chance that the payload will succeed when the column
                        count is correct.
                    </p>
                    <p>
                        As with the <span>ORDER BY</span> technique, the
                        application might actually return the database error in
                        its HTTP response, but may return a generic error or
                        simply return no results. When the number of nulls
                        matches the number of columns, the database returns an
                        additional row in the result set, containing null values
                        in each column. The effect on the HTTP response depends
                        on the application's code. If you are lucky, you will
                        see some additional content within the response, such as
                        an extra row on an HTML table. Otherwise, the null
                        values might trigger a different error, such as a{" "}
                        <span>NullPointerException</span>. In the worst case,
                        the response might look the same as a response caused by
                        an incorrect number of nulls. This would make this
                        method ineffective.
                    </p>
                </section>
                <section>
                    <h1>Database-specific syntax</h1>
                    <p>
                        On Oracle, every <span>SELECT</span> query must use the{" "}
                        <span>FROM</span> keyword and specify a valid table.
                        There is a built-in table on Oracle called{" "}
                        <span>dual</span> which can be used for this purpose. So
                        the injected queries on Oracle would need to look like:
                    </p>
                    <Payloads>' UNION SELECT NULL FROM DUAL--</Payloads>
                    <p>
                        The payloads described use the double-dash comment
                        sequence <span>--</span> to comment out the remainder of
                        the original query following the injection point. On
                        MySQL, the double-dash sequence must be followed by a
                        space. Alternatively, the hash character <span>#</span>{" "}
                        can be used to identify a comment.
                    </p>
                </section>
                <section>
                    <h1>Finding columns with a useful data type</h1>
                    <p>
                        A SQL injection UNION attack enables you to retrieve the
                        results from an injected query. The interesting data
                        that you want to retrieve is normally in string form.
                        This means you need to find one or more columns in the
                        original query results whose data type is, or is
                        compatible with, string data.
                    </p>
                    <p>
                        After you determine the number of required columns, you
                        can probe each column to test whether it can hold string
                        data. You can submit a series of{" "}
                        <span>UNION SELECT</span> payloads that place a string
                        value into each column in turn. For example, if the
                        query returns four columns, you would submit:
                    </p>
                    <Payloads>
                        ' UNION SELECT 'a',NULL,NULL,NULL--
                        <br />' UNION SELECT NULL,'a',NULL,NULL--
                        <br />' UNION SELECT NULL,NULL,'a',NULL--
                        <br />' UNION SELECT NULL,NULL,NULL,'a'--
                    </Payloads>
                    <p>
                        If the column data type is not compatible with string
                        data, the injected query will cause a database error,
                        such as:
                    </p>
                    <Payloads>
                        Conversion failed when converting the varchar value 'a'
                        to data type int.
                    </Payloads>
                    <p>
                        If an error does not occur, and the application's
                        response contains some additional content including the
                        injected string value, then the relevant column is
                        suitable for retrieving string data.
                    </p>
                </section>
                <section>
                    <h1>
                        Using a SQL injection UNION attack to retrieve
                        interesting data
                    </h1>
                    <p>
                        When you have determined the number of columns returned
                        by the original query and found which columns can hold
                        string data, you are in a position to retrieve
                        interesting data.
                    </p>
                    <p>Suppose that:</p>
                    <ul>
                        <li>
                            The original query returns two columns, both of
                            which can hold string data.
                        </li>
                        <li>
                            The injection point is a quoted string within the{" "}
                            <span>WHERE</span> clause.
                        </li>
                        <li>
                            The database contains a table called{" "}
                            <span>users</span> with the columns{" "}
                            <span>username</span> and <span>password</span>.
                        </li>
                    </ul>
                    <p>
                        In this example, you can retrieve the contents of the{" "}
                        <span>users</span> table by submitting the input:
                    </p>
                    <Payloads>
                        ' UNION SELECT username, password FROM users--
                    </Payloads>
                    <p>
                        In order to perform this attack, you need to know that
                        there is a table called <span>users</span> with two
                        columns called <span>username</span> and{" "}
                        <span>password</span>. Without this information, you
                        would have to guess the names of the tables and columns.
                        All modern databases provide ways to examine the
                        database structure, and determine what tables and
                        columns they contain.
                    </p>
                    <div className="labbox">
                        <h3>Read more</h3>
                        <ul>
                            <li>
                                Examining the database in SQL injection attacks
                            </li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h1>Retrieving multiple values within a single column</h1>
                    <p>
                        In some cases the query in the previous example may only
                        return a single column.
                    </p>
                    <p>
                        You can retrieve multiple values together within this
                        single column by concatenating the values together. You
                        can include a separator to let you distinguish the
                        combined values. For example, on Oracle you could submit
                        the input:
                    </p>
                    <Payloads>
                        ' UNION SELECT username || '~' || password FROM users--
                    </Payloads>
                    <p>
                        This uses the double-pipe sequence <span>||</span> which
                        is a string concatenation operator on Oracle. The
                        injected query concatenates together the values of the{" "}
                        <span>username</span> and <span>password</span> fields,
                        separated by the <span>~</span> character.
                    </p>
                    <p>
                        The results from the query contain all the usernames and
                        passwords, for example:
                    </p>
                    <Payloads>
                        ...
                        <br />
                        administrator~s3cure
                        <br />
                        wiener~peter
                        <br />
                        carlos~montoya
                        <br />
                        ...
                    </Payloads>
                </section>
            </section>
        </div>
    );
}
