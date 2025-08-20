import ballerina/sql;
import ballerinax/mysql;
import ballerina/jwt;

configurable string JWT_SECRET = ?;

type DbConfig record {|
    string host; int port; string name; string user; string password; record {|
        int maxOpenConnections;
        int minIdleConnections;
        decimal maxConnectionLifeTime;
    |} connectionPool;
|};

sql:ConnectionPool poolOptions = {
    maxOpenConnections: dbConfig.connectionPool.maxOpenConnections,
    minIdleConnections: dbConfig.connectionPool.minIdleConnections,
    maxConnectionLifeTime: dbConfig.connectionPool.maxConnectionLifeTime
};

type User record {
    int user_id?; string email; string password; string user_type; string name; string phone?; boolean is_active?;
};
// Minimal payload for login to avoid requiring user_type/name
type LoginRequest record { string email; string password; };
type UserIdRecord record { int user_id; };

configurable DbConfig dbConfig = ?;
mysql:Client dbClient = check new (host = dbConfig.host, port = dbConfig.port, database = dbConfig.name,
    user = dbConfig.user, password = dbConfig.password, connectionPool = poolOptions,
    options = { ssl: { mode: mysql:SSL_DISABLED } });

function registerUser(User user) returns string|error {
    if user.user_type != "organization" && user.user_type != "volunteer" && user.user_type != "admin" {
        return error("Registration allowed only for organization, volunteer and admin users.");
    }
    stream<UserIdRecord, sql:Error?> userStream = dbClient->query(`SELECT user_id FROM users WHERE email = ${user.email}`,
        UserIdRecord);
    record {| UserIdRecord value; |}|sql:Error? nextRec = userStream.next();
    sql:Error? closeErr = userStream.close();
    if closeErr is error { return closeErr; }
    if nextRec is record {| UserIdRecord value; |} { return error("Email already registered"); }
    sql:ExecutionResult execResult = check dbClient->execute(`INSERT INTO users (email, password, user_type, name, phone, is_active)
        VALUES (${user.email}, ${user.password}, ${user.user_type}, ${user.name}, ${user.phone}, ${user.is_active})`);
    if execResult.affectedRowCount is int && execResult.affectedRowCount > 0 { return "User registered successfully"; }
    return error("User registration failed or no rows affected");
}

function loginUser(LoginRequest req) returns map<anydata>|error {
    stream<User, sql:Error?> userStream = dbClient->query(`SELECT user_id, password, user_type, name, phone, is_active FROM users
        WHERE email = ${req.email}`, User);
    record {| User value; |}|sql:Error? nextUser = userStream.next();
    sql:Error? closeErr2 = userStream.close();
    if closeErr2 is error { return closeErr2; }
    if nextUser is record {| User value; |} {
        User dbUser = nextUser.value.clone();
        if dbUser.password != req.password { return error("Invalid password"); }
        string jwtToken = check generateJwt(dbUser);
        return { message: "Login successful", user_id: dbUser.user_id, user_type: dbUser.user_type, token: jwtToken };
    }
    return error("User not found");
}

function generateJwt(User user) returns string|error {
    jwt:IssuerConfig issuerConfig = {
        issuer: "VConnectAPI",
        username: user.email,
        audience: "VConnectClient",
        expTime: 3600,
        customClaims: { "user_id": user.user_id, "user_type": user.user_type, "name": user.name },
        signatureConfig: { algorithm: jwt:HS256, config: JWT_SECRET }
    };
    return check jwt:issue(issuerConfig);
}

