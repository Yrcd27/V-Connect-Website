import ballerina/sql;

// Summary type for listing users (excludes password)
type UserSummary record {|
    int user_id;
    string email;
    string user_type;
    string name;
    boolean? is_active;
|};

type UserStatusUpdate record {| boolean is_active; |};

type VolunteerContribution record {|
    int volunteer_id;
    string? name;
    int feedback_count;
    int? total_hours;
    decimal avg_rating;
|};

function listAllUsers() returns UserSummary[]|error {
    UserSummary[] list = [];
    stream<UserSummary, sql:Error?> rs = dbClient->query(`SELECT user_id, email, user_type, name, is_active FROM users`);
    while true {
        record {| UserSummary value; |}|sql:Error? n = rs.next();
        if n is record {| UserSummary value; |} { list.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close();
    if cerr is error { return cerr; }
    return list;
}

function updateUserStatus(int id, boolean active) returns string|error {
    sql:ExecutionResult r = check dbClient->execute(`UPDATE users SET is_active = ${active} WHERE user_id = ${id}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Status updated"; }
    return error("NotFound", message = "User not found");
}

function deleteUserAccount(int id) returns string|error {
    sql:ExecutionResult r = check dbClient->execute(`DELETE FROM users WHERE user_id = ${id}`);
    if r.affectedRowCount is int && r.affectedRowCount > 0 { return "Deleted"; }
    return error("NotFound", message = "User not found");
}

function listVolunteerContributionsForEvent(int eventId) returns VolunteerContribution[]|error {
    VolunteerContribution[] list = [];
    stream<VolunteerContribution, sql:Error?> rs = dbClient->query(`SELECT f.volunteer_id as volunteer_id, u.name as name,
            COUNT(f.feedback_id) as feedback_count,
            SUM(f.hours_worked) as total_hours,
            AVG(f.rating) as avg_rating
        FROM feedback f JOIN users u ON f.volunteer_id = u.user_id
        WHERE f.event_id = ${eventId}
        GROUP BY f.volunteer_id, u.name`);
    while true {
        record {| VolunteerContribution value; |}|sql:Error? n = rs.next();
        if n is record {| VolunteerContribution value; |} { list.push(n.value); continue; }
        break;
    }
    sql:Error? cerr = rs.close(); if cerr is error { return cerr; }
    return list;
}